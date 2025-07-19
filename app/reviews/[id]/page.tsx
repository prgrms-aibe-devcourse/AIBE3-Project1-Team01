"use client";

import { supabase } from "../../../lib/supabase";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Header from "../../components/Header";
import ReviewModal from "../components/ReviewModal";
import ReviewConfirmModal from "../components/ReviewConfirmModal";

// 후기 타입 명시
type Review = {
  id: string;
  title: string;
  region: string;
  region_city?: string;
  rating: number;
  content: string;
  user_id: string;
  created_at?: string;
  updated_at?: string;
  images: { img_url: string }[];
};

export default function EditReviewPage() {
  const [review, setReview] = useState<Review | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  const params = useParams();
  const { id } = params;
  const router = useRouter();

  //모달 상태 
  const [modal, setModal] = useState<{
    title: string;
    detail: string;
  } | null>(null);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);

  useEffect(() => {
    const fetchUserAndReview = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) setCurrentUserId(user.id);

      const { data, error } = await supabase
        .from("reviews")
        .select("*, images(img_url, order)")
        .eq("id", id)
        .single();

      if (!error && data) {
        setReview(data);

        const sortedImages = data.images
          .slice()
          .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
          .map((img) => img.img_url);
        setImages(sortedImages);
      }

      setIsLoading(false);
    };

    fetchUserAndReview();
  }, [id]);

  // 모달로 교체
  const handleDelete = () => {
    setConfirmModalOpen(true);
  };
  
  // 실제 삭제 처리
  const confirmDelete = async () => {
    const { error: imageDeleteError } = await supabase
      .from("images")
      .delete()
      .eq("review_id", id);

    if (imageDeleteError) {
      setModal({
        title: "이미지 삭제 실패",
        detail: imageDeleteError.message,
      }); //모달 교체 완료료
      return;
    }

    const { error: reviewDeleteError } = await supabase
      .from("reviews")
      .delete()
      .eq("id", id);

    if (reviewDeleteError) {
      setModal({
        title: "후기 삭제 실패",
        detail: reviewDeleteError.message,
      }); //모달 교체 완료
      return;
    }
    router.push("/reviews");
  };



  if (isLoading || !review) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <i className="ri-loader-4-line animate-spin text-3xl text-pink-400"></i>
          </div>
          <span className="text-lg text-gray-500">로딩중...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        {/* 여백 최소화 및 전체 폭 사용 */}
        {/* 상단 padding 40px, 좌우 padding 64px, 하단 padding 32px으로 수정 */}
        <div className="relative w-full py-16 px-10 md:px-48 text-[#413D3D]">
          {/* 제목 + 태그 영역 */}
          <section className="relative mb-8 border-b border-gray-300 pb-4">
            {/* 닫기 버튼 */}
            <button
              className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center text-2xl font-bold text-gray-400 hover:text-gray-600 bg-white/80 rounded-full shadow transition-all duration-200"
              style={{ lineHeight: 1 }}
              aria-label="닫기"
              onClick={() => router.push("/reviews")}
            >
              ×
            </button>

            <h1 className="text-3xl font-bold text-gray-800 mb-3">{review.title}</h1>

            <div className="flex items-center flex-wrap gap-3 text-sm text-gray-600">
              <span className="bg-[#C9E6E5] text-[#413D3D] px-3 py-1 rounded-full text-xs font-semibold shadow-sm">
                {review.region}
              </span>
              {review.region_city && (
                <span className="bg-[#FBDED6] text-[#413D3D] px-3 py-1 rounded-full text-xs font-semibold shadow-sm">
                  {review.region_city}
                </span>
              )}
              <span className="text-[#413D3D] text-xs font-semibold ml-2 whitespace-nowrap">
                ⭐ x{review.rating}
              </span>
            </div>
          </section>

          {/* 이미지 영역 */}
          {images.length > 0 && (
            <section className="mb-8 pl-6"> {/* ✅ 왼쪽 여백 본문과 맞춤 */}
              <div className="flex flex-wrap gap-x-3 gap-y-4">
                {images.map((url, idx) => (
                  <div
                    key={idx}
                    className="relative group w-[180px] aspect-[2/3] rounded-lg overflow-hidden shadow-md"
                  >
                    <img
                      src={url}
                      alt={`이미지 ${idx + 1}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute bottom-2 right-2 bg-white/90 text-xs text-blue-600 px-2 py-1 rounded shadow hover:underline"
                    >
                      원본보기
                    </a>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* 본문 내용 */}
          <section className="mb-8 bg-white rounded-lg p-6 shadow-sm text-gray-700 whitespace-pre-wrap leading-relaxed text-[17px]">
            {review.content}
          </section>

          {/* 작성일/수정일 + 수정/삭제 버튼 한 줄로 배치 */}
          <div className="flex items-center justify-between">
            <div className="text-xs text-gray-400 whitespace-nowrap space-x-4">
              <span>작성일: {new Date(review.created_at!).toLocaleDateString("ko-KR")}</span>
              {review.updated_at && (
                <span>수정일: {new Date(review.updated_at).toLocaleDateString("ko-KR")}</span>
              )}
            </div>

            {currentUserId === review.user_id && (
              <div className="flex gap-3">
                <button
                  onClick={() => router.push(`${id}/edit`)}
                  className="bg-[#C9E6E5] text-[#413D3D] px-6 py-2 rounded-xl font-medium hover:from-blue-500 hover:to-indigo-500 transition-all duration-300 shadow-md hover:shadow-lg flex items-center"
                >
                  <i className="ri-edit-2-line mr-2 text-[#413D3D]"></i>수정
                </button>
                <button
                  onClick={handleDelete}
                  className="bg-[#F4CCC4] text-[#413D3D] px-6 py-2 rounded-xl font-medium hover:from-red-500 hover:to-pink-500 transition-all duration-300 shadow-md hover:shadow-lg flex items-center"
                >
                  <i className="ri-delete-bin-line mr-2 text-[#413D3D]"></i>후기 삭제
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* footer */}
      <footer className="bg-white/60 backdrop-blur-md py-9 text-sm text-gray-600 flex justify-center relative px-6 items-center">
        <div
          className="absolute inset-y-0 left-16 w-40 bg-no-repeat bg-left bg-contain pointer-events-none"
          style={{ backgroundImage: "url('/images/h1trip-logo.png')" }}
        />
        <p className="text-center relative z-10 text-left w-full">
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

      {confirmModalOpen && (
        <ReviewConfirmModal
          title="후기를 삭제하시겠습니까?"
          detail="삭제한 후기는 복구할 수 없습니다."
          onConfirm={confirmDelete}
          onCancel={() => setConfirmModalOpen(false)}
        />
      )}

    </div>
  );
}
