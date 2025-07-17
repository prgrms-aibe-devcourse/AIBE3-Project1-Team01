import { useState } from "react";
import { deleteImage, replaceImage, updateImagesOrder } from "../lib/imageEditor";

interface ExistingImage {
  url: string;
  order: number;
}

export function useReviewImageEdit(initialImages: ExistingImage[] = []) {
  // 기존 이미지 상태
  const [existingImages, setExistingImages] = useState<ExistingImage[]>(initialImages);
  const [deletedIndexes, setDeletedIndexes] = useState<number[]>([]);
  const [imageReplacements, setImageReplacements] = useState<Record<number, File>>({});
  const [replacementPreviews, setReplacementPreviews] = useState<Record<number, string>>({});

  // 새 이미지 상태
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [newPreviews, setNewPreviews] = useState<string[]>([]);

  // 업로드 상태
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // 기존 이미지 교체
  const handleExistingImageReplace = (index: number, file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setImageReplacements((prev) => ({
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
    if (!confirm("이 이미지를 삭제하시겠습니까?")) return;
    
    setDeletedIndexes((prev) => {
      if (!prev.includes(index)) return [...prev, index];
      return prev;
    });
    setImageReplacements((prev) => {
      const copy = { ...prev };
      delete copy[index];
      return copy;
    });
    setReplacementPreviews((prev) => {
      const copy = { ...prev };
      delete copy[index];
      return copy;
    });
  };

  // 새 이미지 추가
  const handleNewImageAdd = (files: File[]) => {
    Promise.all(
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
    if (!confirm("이 이미지를 삭제하시겠습니까?")) return;
    
    setNewFiles((prev) => prev.filter((_, i) => i !== index));
    setNewPreviews((prev) => prev.filter((_, i) => i !== index));
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
      if (newFiles.length > 0) {
        const remainingExistingImages = existingImages
          .map((img, idx) => ({ ...img, idx }))
          .filter((img) => !deletedIndexes.includes(img.idx));

        await updateImagesOrder(reviewId, remainingExistingImages, newFiles);
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
    isUploading,
    error,
    // 핸들러
    handleExistingImageReplace,
    handleExistingImageDelete,
    handleNewImageAdd,
    handleNewImageDelete,
    // 업로드
    updateImages,
  };
} 