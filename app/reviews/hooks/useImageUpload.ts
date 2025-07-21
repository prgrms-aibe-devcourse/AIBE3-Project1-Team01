/**
 * 이미지 업로드(write) 커스텀 훅
 * - 파일/미리보기 상태 관리
 * - 업로드 로직 및 로딩/에러 상태 관리
 * - 파일 추가/제거, 초기화 기능 제공
 * - 커버 이미지 관리
 */
import { useState } from "react";
import { uploadImagesToSupabase } from "../lib/imageUploader";

export function useImageUpload(
  initialFiles?: File[],
  initialPreviews?: string[],
  initialCoverIndex?: number | null
) {
  const [files, setFiles] = useState<File[]>(initialFiles || []);
  const [previews, setPreviews] = useState<string[]>(initialPreviews || []);
  const [coverImageIndex, setCoverImageIndex] = useState<number | null>(initialCoverIndex || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // 이미지 파일로부터 미리보기 URL 생성
  const createPreviewUrls = async (imageFiles: File[]): Promise<string[]> => {
    return Promise.all( // all로 안하면 미리보기 순서 보장 X
      imageFiles.map(
        (file) =>
          new Promise<string>((resolve) => { // 비동기 처리 끝났을 때 resolve 호출
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string); //파일 읽기 끝낫을 때 실행할 콜백 함수 
            reader.readAsDataURL(file);
          })
      )
    );
  };

  // 파일 추가
  const addFiles = async (newFiles: File[]) => {
    const newPreviews = await createPreviewUrls(newFiles); //base64 url 생성
    setFiles((prev) => [...prev, ...newFiles]);
    setPreviews((prev) => [...prev, ...newPreviews]);
  };

  // 파일 제거
  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
    // 커버 이미지가 삭제되는 경우 처리
    if (index === coverImageIndex) {
      setCoverImageIndex(null);
    } else if (coverImageIndex !== null && index < coverImageIndex) {
      setCoverImageIndex(coverImageIndex - 1);
    }
  };

  // 커버 이미지 설정
  const setCoverImage = (index: number) => {
    setCoverImageIndex(index);
  };

  // 초기화
  const reset = () => {
    setFiles(initialFiles || []);
    setPreviews(initialPreviews || []);
    setCoverImageIndex(initialCoverIndex || null);
    setError(null);
  };

  // 업로드
  const upload = async (reviewId: number) => {
    if (files.length === 0) return;
    setLoading(true);
    setError(null);
    try {
      const urls = await uploadImagesToSupabase(files, reviewId, coverImageIndex);
      setLoading(false);
      return urls;
    } catch (e: any) {
      setError(e);
      setLoading(false);
      throw e;
    }
  };

  return {
    files,
    previews,
    coverImageIndex,
    loading,
    error,
    addFiles,
    removeFile,
    setCoverImage,
    reset,
    upload,
  };
}
