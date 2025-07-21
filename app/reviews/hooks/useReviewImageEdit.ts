/**
 * 이미지 수정 관련 커스텀 훅
 * - 기존 이미지 관리
 * - 새 이미지 관리
 * - 이미지 업로드 관리
 * - 이미지 삭제 관리
 * - 이미지 교체 관리
 * - 이미지 순서 재할당 관리
 * - 이미지 업로드 상태 관리
 * - 커버 이미지 관리
 */
import { useState } from "react";
import { deleteImage, replaceImage, updateImagesOrder, updateImageCover } from "../lib/imageEditor";
import { supabase } from "../../../lib/supabase";

interface ExistingImage {
  url: string;
  order: number;
  is_cover: boolean;
}

export function useReviewImageEdit(
  initialImages: ExistingImage[] = [],
  reviewId?: number
) {
  // 기존 이미지 상태
  const [existingImages, setExistingImages] = useState<ExistingImage[]>(initialImages);
  const [deletedIndexes, setDeletedIndexes] = useState<number[]>([]); // 기존 이미지 배열에서 삭제된 이미지들의 인덱스들 
  const [imageReplacements, setImageReplacements] = useState<Record<number, File>>({}); // <교체가 요청된 이미지 인덱스(키) : 교체될 새 파일(값)> 객체
  const [replacementPreviews, setReplacementPreviews] = useState<Record<number, string>>({}); // <교체가 요청된 이미지 인덱스(키) : 교체될 새 파일의 base64 url(값)> 객체

  // 새 이미지 상태
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [newPreviews, setNewPreviews] = useState<string[]>([]);
  const [newCoverImageIndex, setNewCoverImageIndex] = useState<number | null>(null);

  // 업로드 상태
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // 기존 이미지 교체 (미리보기 변경)
  const handleExistingImageReplace = (index: number, file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setImageReplacements((prev) => ({ // useState 말고 useRef로 하면 리렌더링이 줄어서 성능이 좋아질까...?
        ...prev,
        [index]: file,
      }));
      setReplacementPreviews((prev) => ({
        ...prev,
        [index]: reader.result as string,
      }));
      setDeletedIndexes((prev) => prev.filter((i) => i !== index));
    };
    reader.readAsDataURL(file);
  };

  // 기존 이미지 삭제
  const handleExistingImageDelete = (index: number) => { 
    const targetImage = existingImages[index];
    
    setDeletedIndexes((prev) => {
      if (!prev.includes(index)) return [...prev, index];
      return prev;
    });
    setImageReplacements((prev) => { // 교체 대상 중에 삭제된 애 제거 
      const copy = { ...prev };
      delete copy[index];
      return copy;
    });
    setReplacementPreviews((prev) => { // 교체 대상 중에 삭제된 애 제거 
      const copy = { ...prev };
      delete copy[index];
      return copy;
    });

    // 삭제된 이미지가 커버였다면 커버 이미지 상태 초기화
    if (targetImage.is_cover) {
      setExistingImages(prev => 
        prev.map(img => ({
          ...img,
          is_cover: false
        }))
      );
      setNewCoverImageIndex(null);
    }
  };

  // 기존 이미지 커버 설정/해제
  const handleExistingImageCoverChange = async (index: number) => {
    const image = existingImages[index];
    if (!image || !reviewId) return;

    try {
      // 이미 커버 이미지인 경우 해제
      if (image.is_cover) {
        await updateImageCover(reviewId, null);
        setExistingImages(prev => 
          prev.map(img => ({
            ...img,
            is_cover: false
          }))
        );
        setNewCoverImageIndex(null);
      } else {
        // 새로운 커버 이미지 설정
        await updateImageCover(reviewId, image.order);
        setExistingImages(prev => 
          prev.map((img, i) => ({
            ...img,
            is_cover: i === index
          }))
        );
        setNewCoverImageIndex(null);
      }
    } catch (e: any) {
      setError(e);
      throw e;
    }
  };

  // 새 이미지 추가
  const handleNewImageAdd = (files: File[]) => {
    Promise.all( // all 안하면 미리보기 순서 보장 X
      files.map(
        (file) =>
          new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.readAsDataURL(file);
          })
      )
    ).then((previews) => {
      setNewFiles((prev) => [...prev, ...files]);
      setNewPreviews((prev) => [...prev, ...previews]);
    });
  };

  // 새 이미지 삭제
  const handleNewImageDelete = (index: number) => {
    
    setNewFiles((prev) => prev.filter((_, i) => i !== index));
    setNewPreviews((prev) => prev.filter((_, i) => i !== index));
    // 커버 이미지가 삭제되는 경우 처리
    if (index === newCoverImageIndex) {
      setNewCoverImageIndex(null);
    } else if (newCoverImageIndex !== null && index < newCoverImageIndex) {
      setNewCoverImageIndex(newCoverImageIndex - 1);
    }
  };

  // 새 이미지 커버 설정/해제
  const handleNewImageCoverChange = (index: number) => {
    // 이미 선택된 이미지를 다시 클릭하면 해제
    if (index === newCoverImageIndex) {
      setNewCoverImageIndex(null);
    } else {
      // 기존 이미지의 커버 선택 해제
      setExistingImages(prev => 
        prev.map(img => ({
          ...img,
          is_cover: false
        }))
      );
      setNewCoverImageIndex(index);
    }
  };

  // 이미지 업로드 및 업데이트
  const updateImages = async (reviewId: number) => {
    setError(null);
    setIsUploading(true);

    try {
      // 1) 삭제 이미지 처리
      for (const index of deletedIndexes) {
        const img = existingImages[index];
        if (!img) continue;
        await deleteImage(reviewId, img);
      }

      // 2) 교체 이미지 처리
      for (const [indexStr, file] of Object.entries(imageReplacements)) {
        const index = Number(indexStr);
        if (deletedIndexes.includes(index)) continue;

        const oldImage = existingImages[index];
        if (!oldImage) continue;

        await replaceImage(reviewId, oldImage, file);
      }

      // 3) 새 이미지 업로드 및 순서 재할당
      if (newFiles.length > 0 || deletedIndexes.length > 0 || Object.keys(imageReplacements).length > 0) {
        const remainingExistingImages = existingImages
          .map((img, idx) => ({ ...img, idx }))
          .filter((img) => !deletedIndexes.includes(img.idx));

        await updateImagesOrder(
          reviewId, 
          remainingExistingImages, 
          newFiles, 
          newCoverImageIndex,
          existingImages.findIndex(img => img.is_cover)
        );
      }
    } catch (e: any) {
      setError(e);
      throw e;
    } finally {
      setIsUploading(false);
    }
  };

  return {
    // 상태
    existingImages,
    setExistingImages,
    deletedIndexes,
    replacementPreviews,
    newFiles,
    newPreviews,
    newCoverImageIndex,
    isUploading,
    error,
    // 핸들러
    handleExistingImageReplace,
    handleExistingImageDelete,
    handleExistingImageCoverChange,
    handleNewImageAdd,
    handleNewImageDelete,
    handleNewImageCoverChange,
    // 업로드
    updateImages,
  };
} 