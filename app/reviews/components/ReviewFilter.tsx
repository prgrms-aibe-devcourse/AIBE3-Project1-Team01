"use client";

import { useState } from "react";

// 필터 Props 인터페이스 정의
interface FilterProps {
  onFilterChange: (filters: FilterState) => void;
  activeFilters: FilterState;
}

// 필터 상태 타입 정의
interface FilterState {
  region: string;
  rating: string;
  myReviewOnly?: boolean;
}

// 지역 목록
const regions = [
  { id: "all", name: "전체 지역" },
  { id: "서울", name: "서울" },
  { id: "가평·양평", name: "가평·양평" },
  { id: "강릉·속초", name: "강릉·속초" },
  { id: "경주", name: "경주" },
  { id: "부산", name: "부산" },
  { id: "여수", name: "여수" },
  { id: "인천", name: "인천" },
  { id: "전주", name: "전주" },
  { id: "제주", name: "제주" },
  { id: "춘천·홍천", name: "춘천·홍천" },
  { id: "태안", name: "태안" },
  { id: "통영·거제·남해", name: "통영·거제·남해" },
  { id: "포항·안동", name: "포항·안동" },
];

// 평점 목록
const ratings = [
  { id: "all", name: "전체 평점" },
  { id: "5", name: "5점" },
  { id: "4", name: "4점 이상" },
  { id: "3", name: "3점 이상" },
  { id: "2", name: "2점 이상" },
  { id: "1", name: "1점 이상" },
];

export default function ReviewFilter({
  onFilterChange,
  activeFilters,
}: FilterProps) {
  // 초기 필터 상태 설정 (myReviewOnly는 false 기본값)
  const [filters, setFilters] = useState<FilterState>({
    ...activeFilters,
    myReviewOnly: activeFilters.myReviewOnly ?? false,
  });

  // 필터 상태 변경 처리
  const handleFilterUpdate = (key: string, value: string | boolean) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
      <h3 className="text-lg font-bold text-gray-800 mb-6">필터</h3>

      {/* 내가 쓴 후기 토글 (지역 필터 스타일과 동일) */}
      <div className="mb-6">
        <div className="space-y-2">
          <label className="flex items-center cursor-pointer hover:bg-[#C9E6E5]/30 p-2 rounded-lg transition">
            {/* 실제 체크박스는 숨기고 */}
            <input
              type="checkbox"
              checked={filters.myReviewOnly}
              onChange={(e) =>
                handleFilterUpdate("myReviewOnly", e.target.checked)
              }
              className="sr-only"
            />

            {/* 원형 토글 디스크 */}
            <div
              className={`w-4 h-4 rounded-full border-2 mr-2 flex items-center justify-center transition-all ${
                filters.myReviewOnly
                  ? "border-[#5CB9B7] bg-white"
                  : "border-gray-300 bg-white"
              }`}
            >
              {filters.myReviewOnly && (
                <div className="w-2 h-2 bg-white rounded-full" />
              )}
            </div>

            {/* 텍스트 */}
            <span
              className={`text-sm transition-colors ${
                filters.myReviewOnly
                  ? "text-[#5CB9B7] font-medium"
                  : "text-gray-600"
              }`}
            >
              내 후기
            </span>
          </label>
        </div>
      </div>

      {/* 지역 필터 */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-gray-700 mb-3">지역</h4>
        <div className="space-y-2">
          {regions.map((region) => (
            <label key={region.id} className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="region"
                value={region.id}
                checked={filters.region === region.id}
                onChange={(e) => handleFilterUpdate("region", e.target.value)}
                className="sr-only"
              />
              <div
                className={`w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center ${
                  filters.region === region.id
                    ? "border-pink-500 bg-pink-500"
                    : "border-gray-300"
                }`}
              >
                {filters.region === region.id && (
                  <div className="w-2 h-2 bg-white rounded-full" />
                )}
              </div>
              <span
                className={`text-sm ${
                  filters.region === region.id
                    ? "text-pink-600 font-medium"
                    : "text-gray-600"
                }`}
              >
                {region.name}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* 평점 필터 */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-gray-700 mb-3">평점</h4>
        <div className="space-y-2">
          {ratings.map((rating) => (
            <label key={rating.id} className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="rating"
                value={rating.id}
                checked={filters.rating === rating.id}
                onChange={(e) => handleFilterUpdate("rating", e.target.value)}
                className="sr-only"
              />
              <div
                className={`w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center ${
                  filters.rating === rating.id
                    ? "border-yellow-500 bg-yellow-500"
                    : "border-gray-300"
                }`}
              >
                {filters.rating === rating.id && (
                  <div className="w-2 h-2 bg-white rounded-full" />
                )}
              </div>
              <span
                className={`text-sm ${
                  filters.rating === rating.id
                    ? "text-yellow-600 font-medium"
                    : "text-gray-600"
                }`}
              >
                {rating.name}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* 필터 초기화 버튼 */}
      <button
        onClick={() => {
          const resetFilters: FilterState = {
            region: "all",
            rating: "all",
            myReviewOnly: false,
          };
          setFilters(resetFilters);
          onFilterChange(resetFilters);
        }}
        className="w-full bg-gray-100 text-gray-600 py-2 px-4 rounded-xl hover:bg-gray-200 transition-colors text-sm font-medium whitespace-nowrap cursor-pointer"
      >
        필터 초기화
      </button>
    </div>
  );
}
