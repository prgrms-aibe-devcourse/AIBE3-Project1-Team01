"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import ReviewFilter from "./components/ReviewFilter";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Review {
  id: number;
  title: string;
  region: string;
  rating: number;
  content: string;
  created_at: string;
  cover_image?: string; // 커버 이미지 url
}

interface FilterState {
  region: string;
  rating: string;
}

export default function ReviewList() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<FilterState>({
    region: "all",
    rating: "all",
  });

  const router = useRouter();

  // 로그인한 유저만 후기 작성 가능
  const handleWriteClick = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      alert("로그인 후에 작성할 수 있습니다!");
      return;
    }

    router.push("/reviews/write");
  };

  // 필터 기반 Supabase 데이터 요청
  const fetchReviews = async () => {
    setLoading(true);

    // 대표 이미지 불러오는 기능 추가
    let query = supabase
      .from("reviews")
      .select(
        `
        *,
        images(img_url, is_cover)
      `
      )
      .order("created_at", { ascending: false });

    if (filters.region && filters.region !== "all") {
      query = query.eq("region", filters.region);
    }

    if (filters.rating && filters.rating !== "all") {
      const ratingNum = parseInt(filters.rating, 10);
      if (!isNaN(ratingNum)) {
        query = query.gte("rating", ratingNum);
      }
    }

    const { data, error } = await query;

    if (error) {
      console.error("❌ 후기 불러오기 실패:", error.message);
    } else {
      setReviews(
        data.map((review) => ({
          ...review,
          cover_image: review.images?.find((img) => img.is_cover)?.img_url,
        })) || []
      );
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchReviews();
  }, [filters]);

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <div className="flex justify-between items-center mb-6">
        {/*임시 홈버튼*/}
        <h1 className="text-3xl font-bold">
          <Link href="http://localhost:3000/">여행 후기 목록</Link>
        </h1>

        {/* 후기 작성 버튼 */}
        <button
          onClick={handleWriteClick}
          className="bg-[#F4CCC4] text-[#413D3D] px-4 py-2 rounded-xl hover: transition"
        >
          후기 작성
        </button>
      </div>

      <div className="flex gap-8">
        {/* 왼쪽 필터 영역 */}
        <div className="w-1/4">
          <ReviewFilter activeFilters={filters} onFilterChange={setFilters} />
        </div>

        {/* 오른쪽 후기 리스트 */}
        <div className="w-3/4">
          {loading ? (
            <div>로딩 중...</div>
          ) : (
            <ul className="space-y-6">
              {reviews.map((review) => (
                <li
                  key={review.id}
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex gap-4">
                    {review.cover_image ? (
                      <div className="w-24 h-24 flex-shrink-0">
                        <img
                          src={review.cover_image}
                          alt={review.title}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      </div>
                    ) : (
                      <div className="w-24 h-24 bg-gray-100 flex-shrink-0 rounded-lg flex items-center justify-center">
                        <span className="text-gray-400">No Image</span>
                      </div>
                    )}
                    <div className="flex-grow">
                      <Link
                        href={`/reviews/${review.id}`}
                        className="text-lg font-semibold text-blue-600 hover:underline"
                      >
                        {review.title}
                      </Link>
                      <p className="text-sm text-gray-600 mt-1">
                        지역: {review.region} / 평점: {review.rating} / 날짜:{" "}
                        {new Date(review.created_at).toLocaleDateString(
                          "ko-KR"
                        )}
                      </p>
                      <p className="text-sm mt-2 text-gray-800 line-clamp-2">
                        {review.content}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
