"use client";

import { supabase } from "../../../lib/supabase";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

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
        .select("*, images(img_url)")
        .eq("id", id)
        .single();

      if (!error && data) {
        setReview(data);
        setImages(data.images.map((img) => img.img_url));
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
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 py-10">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg p-8">
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
            {new Date(review.created_at || review.createdAt).toLocaleDateString(
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
                  className="w-full h-32 sm:h-40 object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
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
              onClick={() => router.push(`/reviews/${id}/edit`)}
              className="bg-gradient-to-r from-blue-400 to-indigo-400 text-white px-6 py-2 rounded-xl font-medium hover:from-blue-500 hover:to-indigo-500 transition-all duration-300 shadow-md hover:shadow-lg flex items-center"
            >
              <i className="ri-edit-2-line mr-2 text-white"></i>수정
            </button>

            <button
              onClick={handleDelete}
              className="bg-gradient-to-r from-red-400 to-pink-400 text-white px-6 py-2 rounded-xl font-medium hover:from-red-500 hover:to-pink-500 transition-all duration-300 shadow-md hover:shadow-lg flex items-center"
            >
              <i className="ri-delete-bin-line mr-2 text-white"></i>후기 삭제
            </button>
          </div>
        )}
      </div>
    </div>
  );
}