/**
 * 이미지 업로드 상태 및 로직 커스텀 훅
 * - 파일, 미리보기 상태 관리
 * - 파일 추가/제거, 초기화 등 제공
 *
 * @param initialFiles 초기 파일 배열(선택)
 * @param initialPreviews 초기 미리보기 배열(선택)
 * @returns { files, previews, addFiles, removeFile, reset }
 */
import { useState } from "react";

export function useImageUploadForm(initialFiles?: File[], initialPreviews?: string[]) {
  // 이미지 파일 상태
  const [files, setFiles] = useState<File[]>(initialFiles || []);
  // 미리보기 URL 상태
  const [previews, setPreviews] = useState<string[]>(initialPreviews || []);

  // 파일 추가 (여러 개 가능)
  const addFiles = (newFiles: File[], newPreviews: string[]) => {
    setFiles((prev) => [...prev, ...newFiles]);
    setPreviews((prev) => [...prev, ...newPreviews]);
  };

  // 파일/미리보기 제거
  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  // 상태 초기화
  const reset = () => {
    setFiles(initialFiles || []);
    setPreviews(initialPreviews || []);
  };

  return { files, previews, addFiles, removeFile, reset };
} 