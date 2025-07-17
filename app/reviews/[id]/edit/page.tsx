"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../../lib/supabase";
import ReviewContentForm, { ReviewContentData } from "../../components/ReviewContentForm";
import ReviewImageUpload from "../../components/ReviewImageUpload";
import { useImageUpload } from "../../hooks/useImageUpload";
import { useReviewContent } from "../../hooks/useReviewContent";
import { uploadImagesToSupabase } from "../../lib/imageUploader";

export default function EditReviewPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = React.use(params);
  const reviewId = parseInt(id);
  const [loading, setLoading] = useState(true);
  const [existingImages, setExistingImages] = useState<{ url: string, order: number }[]>([]);
  const [deletedImages, setDeletedImages] = useState<string[]>([]);

  // 후기 내용 상태 및 로직 (커스텀 훅)
  const {
    form: contentData,
    setForm: setContentData,
    reset: resetContent,
    validate: validateContent,
  } = useReviewContent();

  // 이미지 업로드 통합 훅 사용
  const {
    files: imageFiles,
    previews: imagePreviews,
    addFiles: addImageFiles,
    removeFile: removeImageFile,
    reset: resetImages,
    upload,
    loading: isUploading,
    error: uploadError,
  } = useImageUpload();

  const [uploadedUrls, setUploadedUrls] = useState<string[]>([]);

  // 기존 리뷰 데이터 로드
  useEffect(() => {
    if (reviewId) {
      loadExistingReview(reviewId);
    }
  }, [reviewId]);

  const loadExistingReview = async (id: number) => {
    try {
      // 리뷰 정보 가져오기
      const { data: review, error: reviewError } = await supabase
        .from("reviews")
        .select("*")
        .eq("id", id)
        .single();

      if (reviewError) {
        throw new Error("리뷰 정보를 불러올 수 없습니다: " + reviewError.message);
      }

      // 폼 데이터 설정 -> 기존에 작성된 내용 그대로 표시시
      setContentData({
        title: review.title,
        region: review.region,
        rating: review.rating,
        content: review.content,
      });

      // 이미지 정보 가져오기
      const { data: images, error: imagesError } = await supabase
        .from("images")
        .select("img_url, order")
        .eq("review_id", id)
        .order("order");

      if (!imagesError && images) {
        const imageObjects = images.map(img => ({ url: img.img_url, order: img.order }));
        setExistingImages(imageObjects);
        setDeletedImages([]);
        setUploadedUrls(imageObjects.map(img => img.url));
      }

      setLoading(false);
    } catch (error: any) {
      alert(error.message);
      setLoading(false);
    }
  };

  // 기존+새 이미지 합친 미리보기
  const existingPreviews = existingImages
    .filter(img => !deletedImages.includes(img.url))
    .sort((a, b) => a.order - b.order)
    .map(img => img.url);

  // 기존 이미지와 중복되지 않는 새 이미지만 포함
  const allPreviews = [
    ...existingPreviews,
    ...imagePreviews.filter(preview => !existingPreviews.includes(preview))
  ];
    
  const imageValue = { files: imageFiles, previews: allPreviews };

  // onChange 핸들러: 새 이미지만 반영
  const handleImageUploadChange = (data: { files: File[]; previews: string[] }) => {
    // 기존 이미지를 제외한 새 이미지만 추가
    const existingUrls = existingImages
      .filter(img => !deletedImages.includes(img.url))
      .map(img => img.url);

    // 중복되지 않은 새 이미지만 필터링
    const newFiles: File[] = [];
    const newPreviews: string[] = [];
    
    data.previews.forEach((preview, index) => {
      const file = data.files[index];
      if (file && !existingUrls.includes(preview)) {
        newFiles.push(file);
        newPreviews.push(preview);
      }
    });

    resetImages();
    if (newFiles.length > 0 || newPreviews.length > 0) {
      addImageFiles(newFiles, newPreviews);
    }
  };

  // 이미지 제거 핸들러
  const handleImageRemove = async (index: number) => {
    const remainingExistingImages = existingImages.filter((img) => !deletedImages.includes(img.url));
    
    if (index < remainingExistingImages.length) {   // 기존 이미지
      const url = remainingExistingImages[index].url;
      setDeletedImages((prev) => [...prev, url]);
    } else {    // 새 이미지
      const newIndex = index - remainingExistingImages.length;
      removeImageFile(newIndex);
    }
  };

  // 수정 제출 처리
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // 입력 유효성 검사
    const errorMsg = validateContent();
    if (errorMsg) {
      alert(errorMsg);
      return;
    }
    try {
      // 리뷰 정보 수정
      const { data: reviewData, error: reviewError } = await supabase
        .from("reviews")
        .update({
          ...contentData,
          updated_at: new Date(
            Date.now() - new Date().getTimezoneOffset() * 60000
          )
            .toISOString()
            .slice(0, -1)
        })
        .eq("id", reviewId)
        .select()
        .single();

      if (reviewError || !reviewData) {
        alert("후기 수정 실패: " + reviewError?.message);
        return;
      }

      // 삭제할 기존 이미지 DB에서 삭제
      if (deletedImages.length > 0) {
        const { error: deleteError } = await supabase
          .from("images")
          .delete()
          .in("img_url", deletedImages)
          .eq("review_id", reviewId);

        if (deleteError) {
          throw new Error("이미지 삭제 중 오류가 발생했습니다: " + deleteError.message);
        }

        // 버킷에서도 이미지 파일 삭제
        for (const url of deletedImages) {
          const fileName = url.split('/').pop(); // URL에서 파일명 추출
          if (fileName) {
            const { error: storageError } = await supabase.storage
              .from("images")
              .remove([fileName]);
            
            if (storageError) {
              console.error("스토리지 이미지 삭제 실패:", storageError);
            }
          }
        }
      }

      // 새 이미지 업로드 (교체된 이미지 포함)
      if (imageFiles.length > 0) {
        const uploaded = await upload(reviewId);
        setUploadedUrls(uploaded || []);
      }

      alert("후기가 성공적으로 수정되었습니다!");
      // 수정 완료 후 상세 페이지로 이동
      router.push(`/reviews/${reviewId}`);
    } catch (e: any) {
      alert(e.message || "이미지 업로드 중 오류가 발생했습니다.");
    }
  };

  // 취소 버튼
  const handleCancel = () => {
    if (confirm("수정을 취소하시겠습니까? 변경사항이 저장되지 않습니다.")) {
      router.push("/reviews");
    }
  };

  if (loading) {
    return (
      <div className="max-w-xl mx-auto py-10 px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p>리뷰 정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto py-10 px-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">✏️ 후기 수정</h1>
        <button
          onClick={handleCancel}
          className="text-gray-500 hover:text-gray-700 text-sm"
        >
          취소
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <ReviewContentForm
          value={contentData}
          onChange={setContentData}
          disabled={isUploading}
        />
        <ReviewImageUpload
          value={imageValue}
          onChange={handleImageUploadChange}
          disabled={isUploading}
          onRemove={handleImageRemove}
        />
        <div className="flex gap-3 mt-6">
          <button
            type="button"
            onClick={handleCancel}
            className="flex-1 bg-gray-100 text-gray-600 py-2 px-4 rounded hover:bg-gray-200 transition-colors"
          >
            취소
          </button>
          <button
            type="submit"
            disabled={isUploading}
            className="flex-1 bg-pink-500 text-white py-2 px-4 rounded hover:bg-pink-600 disabled:bg-gray-300 transition-colors"
          >
            {isUploading ? "수정 중..." : "수정 완료"}
          </button>
        </div>
      </form>

      {/* 업로드 에러 메시지 */}
      {uploadError && (
        <div className="mt-4 text-red-500 text-sm">{uploadError.message}</div>
      )}
    </div>
  );
} 