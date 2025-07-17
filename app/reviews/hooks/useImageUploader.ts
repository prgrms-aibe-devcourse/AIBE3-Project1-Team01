/**
 * 이미지 업로드 커스텀 훅
 * - 업로드 시 로딩, 에러 상태 관리
 */
import { useState } from "react";
import { uploadImagesToSupabase } from "../lib/imageUploader";

export function useImageUploader() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  /**
   * 이미지 업로드 실행 함수
   */
  const upload = async (files: File[], reviewId: number) => {
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

  return { upload, loading, error };
} 