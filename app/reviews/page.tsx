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

    let query = supabase
      .from("reviews")
      .select("*")
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
      setReviews(data || []);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchReviews();
  }, [filters]);

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">📝 여행 후기 목록</h1>
        {/* 후기 작성 버튼 */}
        <button
          onClick={handleWriteClick}
          className="bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-600 transition"
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
                <li key={review.id} className="border-b pb-4">
                  <Link
                    href={`/reviews/${review.id}`}
                    className="text-lg font-semibold text-blue-600 hover:underline"
                  >
                    {review.title}
                  </Link>
                  <p className="text-sm text-gray-600">
                    지역: {review.region} / 평점: {review.rating} / 날짜:{" "}
                    {new Date(review.created_at).toLocaleDateString("ko-KR")}
                  </p>
                  <p className="text-sm mt-1 text-gray-800 line-clamp-2">
                    {review.content}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
