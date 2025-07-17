"use client";

import { useState } from "react";
import { supabase } from "../../../lib/supabase";
import ReviewContentForm, { ReviewContentData } from "../components/ReviewContentForm";
import ReviewImageUpload, { ReviewImageUploadData } from "../components/ReviewImageUpload";
import { useImageUploader } from "../hooks/useImageUploader";
import { useReviewContentForm } from "../hooks/useReviewContentForm";
import { useImageUploadForm } from "../hooks/useImageUploadForm";

export default function WriteReviewPage() {
  // 후기 내용 상태 및 로직 (커스텀 훅)
  const {
    form: contentData,
    setForm: setContentData,
    handleChange: handleContentChange,
    reset: resetContent,
    validate: validateContent,
  } = useReviewContentForm();

  // 이미지 업로드 상태 및 로직 (커스텀 훅)
  const {
    files: imageFiles,
    previews: imagePreviews,
    addFiles: addImageFiles,
    removeFile: removeImageFile,
    reset: resetImages,
  } = useImageUploadForm();

  const [uploadedUrls, setUploadedUrls] = useState<string[]>([]);
  const { upload, loading: isUploading, error: uploadError } = useImageUploader();

  // ReviewImageUpload에 맞는 value 객체 생성
  const imageValue = { files: imageFiles, previews: imagePreviews };

  // onChange 핸들러: ReviewImageUploadData 타입을 받아 훅의 상태로 반영
  const handleImageUploadChange = (data: { files: File[]; previews: string[] }) => {
    // 상태를 완전히 대체
    // (useImageUploadForm 훅에 setFiles, setPreviews가 있다면 그걸 써도 됨)
    // 여기서는 reset 후 addFiles로 대체
    resetImages();
    if (data.files.length > 0 || data.previews.length > 0) {
      // 새로 받은 파일/미리보기로 상태를 채움
      addImageFiles(data.files, data.previews);
    }
  };

  // 이미지 제거 핸들러
  const handleImageRemove = (index: number) => {
    removeImageFile(index);
  };

  // 제출 처리
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // 입력 유효성 검사
    const errorMsg = validateContent();
    if (errorMsg) {
      alert(errorMsg);
      return;
    }
    try {
      // 리뷰 내용을 reviews 테이블에 저장
      const { data: reviewData, error: reviewError } = await supabase
        .from("reviews")
        .insert({
          ...contentData,
          created_at: new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, -1),
        })
        .select()
        .single();
      if (reviewError || !reviewData) {
        alert("후기 저장 실패: " + reviewError?.message);
        return;
      }
      const reviewId = reviewData.id;
      // 이미지 업로드 및 images 테이블 저장
      const uploaded = await upload(imageFiles, reviewId);
      setUploadedUrls(uploaded);
      // 상태 초기화
      resetImages();
      resetContent();
    } catch (e: any) {
      alert(e.message || "이미지 업로드 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="max-w-xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-6">✍️ 후기 작성</h1>
      <form onSubmit={handleSubmit}>
        <ReviewContentForm value={contentData} onChange={setContentData} disabled={isUploading} />
        <ReviewImageUpload
          value={imageValue}
          onChange={handleImageUploadChange}
          disabled={isUploading}
        />
        <button
          type="submit"
          disabled={isUploading}
          className="w-full bg-pink-500 text-white py-2 rounded hover:bg-pink-600 disabled:bg-gray-300"
        >
          {isUploading ? "등록 중..." : "후기 등록"}
        </button>
      </form>
      {uploadedUrls.length > 0 && (
        <div className="mt-6">
          <h2 className="font-semibold mb-2">업로드된 이미지들:</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {uploadedUrls.map((url, idx) => (
              <div key={idx} className="border rounded p-2">
                <img
                  src={url}
                  alt={`업로드 이미지 ${idx + 1}`}
                  className="w-full h-auto object-cover rounded"
                />
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-xs text-blue-600 underline mt-1 break-all"
                >
                  {url}
                </a>
              </div>
            ))}
          </div>
        </div>
      )}
      {/* 업로드 에러 메시지 */}
      {uploadError && (
        <div className="mt-4 text-red-500 text-sm">{uploadError.message}</div>
      )}
    </div>
  );
}
