/**
 * 이미지 업로드 통합 커스텀 훅
 * - 파일/미리보기 상태 관리
 * - 업로드 로직 및 로딩/에러 상태 관리
 * - 파일 추가/제거, 초기화 기능 제공
 */
import { useState } from "react";
import { uploadImagesToSupabase } from "../lib/imageUploader";

export function useImageUpload(
  initialFiles?: File[],
  initialPreviews?: string[]
) {
  const [files, setFiles] = useState<File[]>(initialFiles || []);
  const [previews, setPreviews] = useState<string[]>(initialPreviews || []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const addFiles = (newFiles: File[], newPreviews: string[]) => {
    setFiles((prev) => [...prev, ...newFiles]);
    setPreviews((prev) => [...prev, ...newPreviews]);
  };
  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };
  const reset = () => {
    setFiles(initialFiles || []);
    setPreviews(initialPreviews || []);
    setError(null);
  };
  const upload = async (reviewId: number) => {
    if (files.length === 0) return;
    setLoading(true);
    setError(null);
    try {
      const urls = await uploadImagesToSupabase(files, reviewId);
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
    loading,
    error,
    addFiles,
    removeFile,
    reset,
    upload,
  };
}
