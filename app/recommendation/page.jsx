"use client";

import { useState } from "react";
import RegionSelector from "./components/RegionSelector";
import CategoryTabs from "./components/CategoryTabs";
import SubCategoryTabs from "./components/SubCategoryTabs";
import TourApiList from "./components/TourApiList";
import Link from "next/link";

const AREA_CODES = [
  { name: "서울", code: 1 },
  { name: "부산", code: 6 },
  { name: "대구", code: 4 },
  { name: "인천", code: 2 },
  { name: "광주", code: 5 },
  { name: "대전", code: 3 },
  { name: "울산", code: 7 },
  { name: "세종", code: 8 },
  { name: "경기", code: 31 },
  { name: "강원", code: 32 },
  { name: "충북", code: 33 },
  { name: "충남", code: 34 },
  { name: "전북", code: 35 },
  { name: "전남", code: 36 },
  { name: "경북", code: 37 },
  { name: "경남", code: 38 },
  { name: "제주", code: 39 },
];

const CATEGORIES = [
  { name: "관광지", id: 12 },
  { name: "숙박", id: 32 },
  { name: "음식점", id: 39 },
  { name: "축제/행사", id: 15 },
  { name: "레포츠", id: 28 },
  { name: "쇼핑", id: 38 },
  { name: "문화시설", id: 14 },
];

const SUBCATEGORIES = {
  12: [
    { name: "자연관광지", code: "A01" },
    { name: "산", code: "A0101" },
    { name: "계곡", code: "A0102" },
    { name: "폭포", code: "A0103" },
    { name: "문화관광지", code: "A02" },
    { name: "유적지", code: "A0201" },
    { name: "박물관/미술관", code: "A0202" },
  ],
  32: [
    { name: "호텔", code: "B0201" },
    { name: "콘도/리조트", code: "B0202" },
    { name: "모텔", code: "B0203" },
  ],
  39: [
    { name: "한식", code: "C0101" },
    { name: "중식", code: "C0102" },
    { name: "일식", code: "C0103" },
  ],
};

export default function RecommendationPage() {
  const [areaCode, setAreaCode] = useState("");
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");

  // 선택이 바뀔 때마다 하위 선택 초기화
  const handleAreaChange = (code) => {
    setAreaCode(code);
    setCategory("");
    setSubCategory("");
  };
  const handleCategoryChange = (id) => {
    setCategory(id);
    setSubCategory("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 py-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-start mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-pink-400 to-purple-400 text-white font-bold shadow hover:scale-105 transition"
          >
            <span role="img" aria-label="home">
              🏠
            </span>{" "}
            홈으로 돌아가기
          </Link>
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-center mb-10 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 drop-shadow-lg tracking-tight">
          ✨ 추천 여행지 리스트 ✈️
        </h1>
        <div className="flex flex-col md:flex-row gap-8">
          {/* 선택 UI 영역 */}
          <div className="md:w-1/3 w-full flex flex-col gap-6">
            <div className="bg-white/60 rounded-2xl shadow-lg p-6">
              <h2 className="text-2xl font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400 drop-shadow">
                📍 어디로 떠나볼까요?
              </h2>
              <RegionSelector
                areaCode={areaCode}
                setAreaCode={handleAreaChange}
                areaCodes={AREA_CODES}
              />
            </div>
            {areaCode && (
              <div className="bg-white/60 rounded-2xl shadow-lg p-6">
                <h2 className="text-2xl font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400 drop-shadow">
                  🗺️ 어떤 여행을 원하세요?
                </h2>
                <CategoryTabs
                  category={category}
                  setCategory={handleCategoryChange}
                  categories={CATEGORIES}
                />
              </div>
            )}
            {areaCode && category && SUBCATEGORIES[category] && (
              <div className="bg-white/60 rounded-2xl shadow-lg p-6">
                <h2 className="text-2xl font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400 drop-shadow">
                  🔎 더 자세히 골라볼까요?
                </h2>
                <SubCategoryTabs
                  category={category}
                  subCategory={subCategory}
                  setSubCategory={setSubCategory}
                  subCategories={SUBCATEGORIES[category]}
                />
              </div>
            )}
          </div>
          {/* 리스트 영역 */}
          <div className="md:w-2/3 w-full">
            {areaCode && category && (
              <TourApiList
                areaCode={areaCode}
                contentTypeId={category}
                cat1={subCategory.length === 3 ? subCategory : ""}
                cat2={subCategory.length === 5 ? subCategory : ""}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
