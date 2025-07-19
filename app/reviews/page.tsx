"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import ReviewFilter from "./components/ReviewFilter";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Header from "../components/Header";

interface Review {
  id: number;
  title: string;
  region: string;
  region_city: string;
  rating: number;
  content: string;
  created_at: string;
  cover_image?: string; // 커버 이미지 url
}

interface FilterState {
  region: string;
  rating: string;
  myReviewOnly: boolean; // 추가
}

export default function ReviewList() {
  const [user, setUser] = useState<any>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<FilterState>({
    region: "all",
    rating: "all",
    myReviewOnly: false,
  });

  const router = useRouter();

  // 1) 로그인 유저 정보 가져오기
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });
  }, []);

  // 2) 필터 변경 콜백
  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
  };

  // 3) 후기 작성 버튼
  const handleWriteClick = () => {
    router.push("/reviews/write");
  };

  // 필터 기반 Supabase 데이터 요청
  const fetchReviews = async () => {
    setLoading(true);

    let query = supabase
      .from("reviews")
      .select(`*, images(img_url, is_cover)`)
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

    // 내가 쓴 후기만 보기 - 유저 ID 필터 추가
    if (filters.myReviewOnly && user) {
      query = query.eq("user_id", user.id);
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
    <div>
      <Header />
      <div className="px-10 md:px-48 py-16">
        <div className="flex gap-10">
          {/* 왼쪽 필터 영역 */}
          <div className="w-[220px] shrink-0">
            <ReviewFilter
              activeFilters={filters}
              onFilterChange={handleFilterChange}
              isLoggedIn={!!user}
            />
          </div>

          {/* 오른쪽 후기 리스트 */}
          <div className="flex-grow" style={{ maxWidth: "calc(100% - 220px)" }}>
            {/* ✅ 후기 리스트 상단: 제목 + 버튼 */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-[#413D3D]">여행 후기 모아보기</h2>
              {user && (
                <button
                  onClick={handleWriteClick}
                  className="bg-[#F4CCC4] text-white font-semibold px-4 py-2 rounded-full hover:bg-[#EAB7AD] transition"
                >
                  후기 작성
                </button>
              )}
            </div>

            {loading ? (
              <div>로딩 중...</div>
            ) : (
              <ul className="space-y-6">
                {reviews.map((review) => (
                  <li
                    key={review.id}
                    className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex gap-4 items-start">
                      {/* 커버 이미지 or No Image */}
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

                      {/* 제목, 작성일, 태그, 내용 영역 */}
                      <div className="flex-grow min-w-0 flex flex-col">
                        {/* 제목 + 작성일 (한 줄에 유지, 제목 넘칠 땐 말줄임) */}
                        <div
                          className="flex items-center justify-between gap-4 flex-nowrap min-w-0"
                          style={{ minWidth: 0 }}
                        >
                          <Link
                            href={`/reviews/${review.id}`}
                            className="text-lg font-semibold text-[#413D3D] hover:text-gray-400 transition-colors duration-200 truncate max-w-full"
                            style={{
                              minWidth: 0,
                              overflow: "hidden",
                              whiteSpace: "nowrap",
                              textOverflow: "ellipsis",
                              flexGrow: 1,
                            }}
                            title={review.title}
                          >
                            {review.title}
                          </Link>
                          <span
                            className="text-xs text-gray-400 whitespace-nowrap flex-shrink-0"
                          >
                            {new Date(review.created_at).toLocaleDateString("ko-KR")}
                          </span>
                        </div>

                        {/* 태그 및 내용 부분 */}
                        <p
                          className="mt-2 flex gap-2 items-center flex-wrap"
                          style={{
                            whiteSpace: "normal",
                            overflowWrap: "break-word",
                            wordBreak: "keep-all",
                          }}
                        >
                          <span className="bg-[#C9E6E5] text-[#413D3D] px-2 py-[2px] rounded-full text-[10px] font-medium shadow-sm">
                            {review.region}
                          </span>
                          {review.region_city && (
                            <span className="bg-[#FBDED6] text-[#413D3D] px-2 py-[2px] rounded-full text-[10px] font-medium shadow-sm">
                              {review.region_city}
                            </span>
                          )}
                          <span className="text-[#413D3D] text-[10px] font-medium ml-1 whitespace-nowrap">
                            ⭐x{review.rating}
                          </span>
                        </p>


                        {/* 후기 내용 */}
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

      <footer className="bg-white/60 backdrop-blur-md py-9 text-sm text-gray-600 mt-auto flex justify-center relative px-6 flex items-center">
        {/* 배경 이미지 */}
        <div
          className="absolute inset-y-0 left-16 w-40 bg-no-repeat bg-left bg-contain pointer-events-none"
          style={{ backgroundImage: "url('/images/h1trip-logo.png')" }}
        />

        {/* 텍스트 */}
        <p className="text-center relative z-10 text-left w-full">
          © 2025 h1 Trip. 모든 여행자들의 꿈을 응원합니다. 🌟
        </p>
      </footer>
    </div>
  );
}
