"use client";

import { useState } from "react";
import { REGION_OPTIONS } from "../constants/regions";

// 필터 Props 인터페이스 정의
interface FilterProps {
  onFilterChange: (filters: FilterState) => void;
  activeFilters: FilterState;
  isLoggedIn: boolean;
}

// 필터 상태 타입 정의
interface FilterState {
  region: string;
  rating: string;
  myReviewOnly?: boolean;
}

// 기존 하드코딩된 지역 목록 대신 constants/regions의 데이터를 활용하도록 변경
const regions = [
  { id: "all", name: "전체 지역" },
  ...REGION_OPTIONS.map((r) => ({
    id: r.province,
    name: r.province,
  })),
];

// 평점 목록 (변경 없음)
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
  isLoggedIn,
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
      {/* 내가 쓴 후기 토글 (지역/평점 필터와 같은 스타일) */}
      {isLoggedIn && (
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-gray-700 mb-3">내 후기</h4>
          <label className="flex items-center cursor-pointer rounded-lg transition">
            <input
              type="checkbox"
              checked={filters.myReviewOnly}
              onChange={(e) => handleFilterUpdate("myReviewOnly", e.target.checked)}
              className="sr-only"
            />
            <div
              className={`w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center transition-all ${
                filters.myReviewOnly
                  ? "border-[#F4CCC4] bg-[#F4CCC4]"
                  : "border-gray-300 bg-white"
              }`}
            >
              {filters.myReviewOnly && <div className="w-2 h-2 bg-white rounded-full" />}
            </div>
            <span className="text-sm text-gray-600">내 후기만 보기</span>
          </label>
        </div>
      )}

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
                    ? "border-[#F4CCC4] bg-[#F4CCC4]"
                    : "border-gray-300"
                }`}
              >
                {filters.region === region.id && (
                  <div className="w-2 h-2 bg-white rounded-full" />
                )}
              </div>
              <span className="text-sm text-gray-600">{region.name}</span>
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
                    ? "border-[#F4CCC4] bg-[#F4CCC4]"
                    : "border-gray-300"
                }`}
              >
                {filters.rating === rating.id && (
                  <div className="w-2 h-2 bg-white rounded-full" />
                )}
              </div>
              <span className="text-sm text-gray-600">{rating.name}</span>
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
