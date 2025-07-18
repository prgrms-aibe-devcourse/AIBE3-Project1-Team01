"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ReviewContentForm from "../../components/ReviewContentForm";
import ReviewImageEdit from "../../components/ReviewImageEdit";
import { supabase } from "../../../../lib/supabase";
import { useReviewContent } from "../../hooks/useReviewContent";
import { useReviewImageEdit } from "../../hooks/useReviewImageEdit";

export default function EditReviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const { id } = React.use(params);
  const reviewId = parseInt(id);

  // 로딩 상태
  const [loading, setLoading] = useState(true);

  // 후기 내용 상태 및 로직
  const {
    form: contentData,
    setForm: setContentData,
    validate: validateContent,
  } = useReviewContent();

  // 이미지 상태 및 로직
  const {
    existingImages,
    setExistingImages,
    deletedIndexes,
    replacementPreviews,
    newFiles,
    newPreviews,
    newCoverImageIndex, // 새 커버 이미지 인덱스 
    isUploading,
    error: uploadError,
    handleExistingImageReplace,
    handleExistingImageDelete,
    handleExistingImageCoverChange, // 기존 이미지 커버 설정
    handleNewImageAdd,
    handleNewImageDelete,
    handleNewImageCoverChange, // 새 이미지 커버 설정
    updateImages,
  } = useReviewImageEdit([], reviewId);

  useEffect(() => {
    if (!reviewId) return;
    const load = async () => {
      try {
        // reviews 테이블에서 id에 맞는 정보 가져오기
        const { data: review } = await supabase
          .from("reviews")
          .select("*")
          .eq("id", reviewId)
          .single();

        if (!review) throw new Error("리뷰 정보 없음");

        // 조회 내용 form에 세팅 
        setContentData({
          title: review.title,
          region: review.region,
          rating: review.rating,
          content: review.content,
        });

        // 해당 리뷰에 저장된 이미지 가져오기 
        const { data: images } = await supabase
          .from("images")
          .select("img_url, order, is_cover")
          .eq("review_id", reviewId)
          .order("order");

        if (images) {
          setExistingImages(
            images.map((img) => ({
              url: img.img_url,
              order: img.order,
              is_cover: img.is_cover
            }))
          );
        }

        setLoading(false);
      } catch (e: any) {
        alert(e.message);
        setLoading(false);
      }
    };
    load();
  }, [reviewId, setContentData, setExistingImages]);

  // 수정 제출 핸들러
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const errorMsg = validateContent();
    if (errorMsg) {
      alert(errorMsg);
      return;
    }

    try {
      // 후기 내용 업데이트
      const { error: reviewError } = await supabase
        .from("reviews")
        .update({ ...contentData, updated_at:  new Date(
          Date.now() - new Date().getTimezoneOffset() * 60000
        )
          .toISOString()
          .slice(0, -1), }) //현지 시간으로 업데이트 
        .eq("id", reviewId);
      if (reviewError) throw new Error(reviewError.message);

      // 이미지 업데이트
      await updateImages(reviewId);

      alert("후기 수정 완료!");
      router.push(`/reviews/${reviewId}`); //리뷰 상세 페이지로 돌아가기 
    } catch (e: any) {
      alert(e.message || "오류가 발생했습니다.");
    }
  };

  // 수정 취소 핸들러
  const handleCancel = () => {
    if (confirm("수정을 취소하시겠습니까?")) {
      router.push("/reviews");
    }
  };

  if (loading) { // 저장된 정보 다 불러올 때까지 loading 상태
    return <div className="text-center py-10">리뷰 정보를 불러오는 중...</div>;
  }

  return (
    <div className="max-w-xl mx-auto py-10 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">✏️ 후기 수정</h1>
        <button
          onClick={handleCancel}
          className="text-sm text-gray-500 hover:text-gray-700"
          disabled={isUploading}
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

        <ReviewImageEdit
          existingImages={existingImages}
          onExistingImageDelete={handleExistingImageDelete}
          onExistingImageReplace={handleExistingImageReplace}
          onExistingImageCoverChange={handleExistingImageCoverChange}
          deletedIndexes={deletedIndexes}
          replacementPreviews={replacementPreviews}
          newFiles={newFiles}
          newPreviews={newPreviews}
          onNewImageAdd={handleNewImageAdd}
          onNewImageDelete={handleNewImageDelete}
          onNewImageCoverChange={handleNewImageCoverChange}
          newCoverImageIndex={newCoverImageIndex}
          disabled={isUploading}
        />

        <div className="flex gap-3 mt-6">
          <button
            type="button"
            onClick={handleCancel}
            className="flex-1 bg-gray-100 py-2 rounded"
            disabled={isUploading}
          >
            취소
          </button>
          <button
            type="submit"
            className="flex-1 bg-pink-500 text-white py-2 rounded disabled:bg-gray-300"
            disabled={isUploading}
          >
            {isUploading ? "수정 중..." : "수정 완료"}
          </button>
        </div>

        {uploadError && (
          <div className="mt-4 text-red-500 text-sm">{uploadError.message}</div>
        )}
      </form>
    </div>
  );
}
