"use client";

import { supabase } from "../../../lib/supabase";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Header from "../../components/Header";

// 후기 타입 명시
type Review = {
  id: string;
  title: string;
  region: string;
  rating: number;
  content: string;
  user_id: string;
  created_at?: string;
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

  // 후기 및 사용자 정보 가져오기
  useEffect(() => {
    const fetchUserAndReview = async () => {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
      if (user) setCurrentUserId(user.id);

      // 후기 정보 가져오기
      const { data, error } = await supabase
        .from("reviews")
        .select("*, images(img_url, order)") //상세 페이지에서 이미지 순서대로 보여주기 위해 order 추가
        .eq("id", id)
        .single();

      if (!error && data) {
        setReview(data);

        // order 순으로 정렬
        const sortedImages = data.images
          .slice() // 원본 배열 복사
          .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
          .map((img) => img.img_url);
        setImages(sortedImages);
      }

      setIsLoading(false);
    };

    fetchUserAndReview();
  }, [id]);

  // 후기 삭제 함수
  const handleDelete = async () => {
    const { error: imageDeleteError } = await supabase
      .from("images")
      .delete()
      .eq("review_id", id);

    if (imageDeleteError) {
      alert("이미지 삭제 중 오류 발생: " + imageDeleteError.message);
      return;
    }

    const { error: reviewDeleteError } = await supabase
      .from("reviews")
      .delete()
      .eq("id", id);

    if (reviewDeleteError) {
      alert("후기 삭제 실패: " + reviewDeleteError.message);
      return;
    }

    alert("후기 삭제 완료!");
    router.push("/reviews"); // 후기 목록으로 이동
  };

  // 로딩 중 화면
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

  // 후기 상세화면 렌더링
  return (
    <div>
      <Header />
      <div className="relative w-full max-w-6xl mx-auto bg-white text-[#413D3D] rounded-2xl shadow-lg px-6 py-10">
        {/* 내용 */}
        <button
          className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center text-2xl font-bold text-gray-400 hover:text-gray-600 bg-white/80 rounded-full shadow transition-all duration-200"
          style={{ lineHeight: 1 }}
          aria-label="닫기"
          onClick={() => router.push("/reviews")}
        >
          ×
        </button>
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            {review.title}
          </h1>

          <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
            <span className="bg-pink-100 text-pink-600 px-2 py-1 rounded-full font-medium">
              {review.region}
            </span>
            <span className="bg-yellow-100 text-yellow-600 px-2 py-1 rounded-full font-medium">
              평점 {review.rating}점
            </span>
          </div>

          <span className="text-xs text-gray-400">
            작성일:{" "}
            {new Date(review.created_at).toLocaleDateString(
              "ko-KR"
            )}
          </span>
        </div>

        <p className="mb-6 text-gray-700 whitespace-pre-wrap text-base leading-relaxed">
          {review.content}
        </p>

        {/* 이미지 표시 */}
        {images.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
            {images.map((url, idx) => (
              <div key={idx} className="relative group">
                <img
                  src={url}
                  alt={`이미지 ${idx + 1}`}
                  className="w-full h-48 sm:h-56 object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
                />
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute bottom-2 right-2 bg-white/80 text-xs text-blue-600 px-2 py-1 rounded shadow hover:underline"
                >
                  원본보기
                </a>
              </div>
            ))}
          </div>
        )}

        {/* 사용자 본인일 경우에만 수정/삭제 버튼 */}
        {currentUserId === review.user_id && (
          <div className="flex justify-end gap-3">
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
              <i className="ri-delete-bin-line mr-2 text-[#413D3D]"></i>후기
              삭제
            </button>
          </div>
        )}
      </div>
      {/* ✅ Footer를 하단에 고정 */}

      <footer className="bg-white/60 backdrop-blur-md py-9 text-sm text-gray-600 mt-auto relative px-6 flex items-center">
        {/* 배경 이미지 */}
        <div
          className="absolute inset-y-0 left-16 w-40 bg-no-repeat bg-left bg-contain pointer-events-none"
          style={{ backgroundImage: "url('/images/h1trip-logo.png')" }}
        />

        {/* 텍스트 */}
        <p className="relative z-10 pl-[10rem] text-left w-full">
          © 2025 h1 Trip. 모든 여행자들의 꿈을 응원합니다. 🌟
        </p>
      </footer>
    </div>
  );
}
