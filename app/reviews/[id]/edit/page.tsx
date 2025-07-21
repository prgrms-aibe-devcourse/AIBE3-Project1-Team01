"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ReviewContentForm from "../../components/ReviewContentForm";
import ReviewImageEdit from "../../components/ReviewImageEdit";
import { supabase } from "../../../../lib/supabase";
import { useReviewContent } from "../../hooks/useReviewContent";
import { useReviewImageEdit } from "../../hooks/useReviewImageEdit";
import Header from "../../../components/Header";
import ReviewModal from "../../components/ReviewModal";

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

  //모달 상태
  const [modal, setModal] = useState<{
    title: string;
    detail: string;
  } | null>(null);

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
          region_city: review.region_city,
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
              is_cover: img.is_cover,
            }))
          );
        }

        setLoading(false);
      } catch (e: any) {
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
      setModal(null);
      setModal({
        title: "다시 수정하세요",
        detail: errorMsg,
      }); //모달 교체 완료
      return;
    }

    try {
      // 후기 내용 업데이트
      const { error: reviewError } = await supabase
        .from("reviews")
        .update({
          ...contentData,
          updated_at: new Date(
            Date.now() - new Date().getTimezoneOffset() * 60000
          )
            .toISOString()
            .slice(0, -1),
        }) //현지 시간으로 업데이트
        .eq("id", reviewId);
      if (reviewError) throw new Error(reviewError.message);

      // 이미지 업데이트
      await updateImages(reviewId);
      router.push(`/reviews/${reviewId}`); //리뷰 상세 페이지로 돌아가기
    } catch (e: any) {
      setModal({
        title: "후기 수정 실패.",
        detail: e.message,
      }); //모달 교체 완료
    }
  };

  // 수정 취소 핸들러
  const handleCancel = () => {
    router.push(`/reviews/${reviewId}`);
  };

  if (loading) {
    // 저장된 정보 다 불러올 때까지 loading 상태
    return <div className="text-center py-10">리뷰 정보를 불러오는 중...</div>;
  }

  return (
    <div>
      <Header />
      <div className="relative w-full max-w-6xl mx-auto bg-white text-[#413D3D] rounded-2xl shadow-lg px-4 py-8 sm:px-6 md:px-8 lg:px-12 xl:px-16">
        <button
          className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center text-xl font-bold text-gray-400 hover:text-gray-600 bg-white/80 rounded-full shadow transition-all duration-200"
          style={{ lineHeight: 1 }}
          aria-label="닫기"
          onClick={() => router.push(`/reviews/${reviewId}`)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3"
            />
          </svg>
        </button>

        <h1 className="text-2xl font-bold mb-6">후기 수정</h1>

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
              className="flex-1 bg-[#F4CCC4] text-[#413D3D] py-2 rounded-xl hover:shadow-lg disabled:bg-gray-300"
              disabled={isUploading}
            >
              {isUploading ? "수정 중..." : "수정 완료"}
            </button>
          </div>

          {uploadError && (
            <div className="mt-4 text-red-500 text-sm">
              {uploadError.message}
            </div>
          )}
        </form>
      </div>

      <footer className="bg-white/60 backdrop-blur-md py-9 text-sm text-gray-600 mt-auto flex justify-center relative px-6 flex items-center">
        {/* 배경 이미지 */}
        <div
          className="absolute inset-y-0 left-16 w-40 bg-no-repeat bg-left bg-contain pointer-events-none"
          style={{ backgroundImage: "url('/images/h1trip-logo.png')" }}
        />

        {/* 텍스트 */}
        <p className=" text-center relative z-10  text-left w-full">
          © 2025 h1 Trip. 모든 여행자들의 꿈을 응원합니다. 🌟
        </p>
      </footer>

      {modal && (
        <ReviewModal
          title={modal.title}
          detail={modal.detail}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
}
