"use client";

import { useState } from "react";
import RegionSelector from "./components/RegionSelector";
import CategoryTabs from "./components/CategoryTabs";
import SubCategoryTabs from "./components/SubCategoryTabs";
import TourApiList from "./components/TourApiList";
import SearchBar from "./components/SearchBar";
import Link from "next/link";
import CustomGameModal from "./components/CustomGameModal";

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
  const [gameResult, setGameResult] = useState(null);
  const [currentPlaces, setCurrentPlaces] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [isCustomGameModalOpen, setIsCustomGameModalOpen] = useState(false);

  // 선택이 바뀔 때마다 하위 선택 초기화
  const handleAreaChange = (code) => {
    setAreaCode(code);
    setCategory("");
    setSubCategory("");
    setGameResult(null);
  };
  const handleCategoryChange = (id) => {
    setCategory(id);
    setSubCategory("");
    setGameResult(null);
  };

  const handlePlacesUpdate = (places) => {
    setCurrentPlaces(places);
  };

  const handleSearch = (keyword) => {
    setSearchKeyword(keyword);
  };

  const handleGameResult = (result) => {
    setGameResult(result);
  };

  return (
    <div className="min-h-screen bg-pink-100">
      <div className="w-full flex items-center justify-between bg-white shadow px-8 h-28 mb-6">
        <div className="flex items-center h-full">
          <img
            src="/h1trip-logo2.png"
            alt="h1Trip 로고"
            className="h-32 w-64 object-contain"
          />
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-center drop-shadow-lg tracking-tight flex-1">
          <span>✨ </span>
          <span className="text-gray-400">추천 여행지 리스트</span>
          <span> ✈️</span>
        </h1>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsCustomGameModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-pink-300 text-white font-bold shadow hover:scale-105 transition border border-pink-100"
          >
            게임 선택
          </button>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-pink-300 text-white font-bold shadow hover:scale-105 transition border border-pink-100"
          >
            홈으로
          </Link>
        </div>
      </div>
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row gap-8">
          {/* 선택 UI 영역 */}
          <div className="md:w-1/3 w-full flex flex-col gap-6">
            <div className="bg-white/60 rounded-2xl shadow-lg p-6">
              <h2 className="text-2xl font-extrabold mb-4 drop-shadow">
                <span>📍 </span>
                <span className="text-gray-400">어디로 떠나볼까요?</span>
              </h2>
              <RegionSelector
                areaCode={areaCode}
                setAreaCode={handleAreaChange}
                areaCodes={AREA_CODES}
              />
            </div>
            {areaCode && (
              <div className="bg-white/60 rounded-2xl shadow-lg p-6">
                <h2 className="text-2xl font-extrabold mb-4 drop-shadow">
                  <span>🗺️ </span>
                  <span className="text-gray-400">어떤 여행을 원하세요?</span>
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
                <h2 className="text-2xl font-extrabold mb-4 drop-shadow">
                  <span>🔎 </span>
                  <span className="text-gray-400">더 자세히 골라볼까요?</span>
                </h2>
                <SubCategoryTabs
                  category={category}
                  subCategory={subCategory}
                  setSubCategory={setSubCategory}
                  subCategories={SUBCATEGORIES[category]}
                />
              </div>
            )}
            {/* 게임으로 선택하기 버튼 삭제됨 */}
          </div>
          {/* 리스트 영역 */}
          <div className="md:w-2/3 w-full">
            {areaCode && category && (
              <>
                {/* 검색 및 게임 영역 */}
                <div className="bg-white/60 rounded-2xl shadow-lg p-6 mb-6">
                  {/* 검색바를 먼저 표시 */}
                  <div className="mb-6">
                    <SearchBar
                      keyword={searchKeyword}
                      setKeyword={setSearchKeyword}
                      onSearch={handleSearch}
                    />
                  </div>

                  {/* 게임 결과 표시 */}
                  {gameResult && (
                    <div className="bg-gradient-to-r from-yellow-100 to-orange-100 rounded-2xl shadow-lg p-6 mb-6 border-2 border-yellow-300">
                      <h3 className="text-2xl font-bold text-center text-orange-600 mb-4">
                        🎉 게임 결과 - 선택된 여행지
                      </h3>
                      <div className="text-center">
                        <p className="font-semibold text-xl mb-2">
                          {gameResult.title}
                        </p>
                        <p className="text-gray-600 mb-2">
                          {gameResult.addr1} {gameResult.addr2}
                        </p>
                        {gameResult.tel && (
                          <p className="text-gray-600 mb-2">
                            📞 {gameResult.tel}
                          </p>
                        )}
                        <button
                          onClick={() => setGameResult(null)}
                          className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                        >
                          결과 닫기
                        </button>
                      </div>
                    </div>
                  )}

                  {/* 기존 리스트 */}
                  <TourApiList
                    areaCode={areaCode}
                    contentTypeId={category}
                    cat1={subCategory.length === 3 ? subCategory : ""}
                    cat2={subCategory.length === 5 ? subCategory : ""}
                    onPlacesUpdate={handlePlacesUpdate}
                    searchKeyword={searchKeyword}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* 게임 모달 */}
      <CustomGameModal
        isOpen={isCustomGameModalOpen}
        onClose={() => setIsCustomGameModalOpen(false)}
        places={currentPlaces}
      />
    </div>
  );
}
