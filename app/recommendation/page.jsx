"use client";

import { useState } from "react";
import RegionSelector from "./components/RegionSelector";
import CategoryTabs from "./components/CategoryTabs";
import SubCategoryTabs from "./components/SubCategoryTabs";
import TourApiList from "./components/TourApiList";
import SearchBar from "./components/common/SearchBar";
import Link from "next/link";
import CustomGameModal from "./components/game/CustomGameModal";
import {
  AREA_CODES,
  CATEGORIES,
  SUBCATEGORIES,
  CATEGORY_TREE,
} from "./constants/travelData";
// import Header from "@/app/components/Header";
import Header from "../components/Header";

export default function RecommendationPage() {
  const [areaCode, setAreaCode] = useState("");
  const [category, setCategory] = useState(""); // 최상위 카테고리명
  const [cat1, setCat1] = useState("");
  const [cat2, setCat2] = useState("");
  const [cat3, setCat3] = useState("");
  const [gameResult, setGameResult] = useState(null);
  const [currentPlaces, setCurrentPlaces] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [isCustomGameModalOpen, setIsCustomGameModalOpen] = useState(false);
  const [totalCount, setTotalCount] = useState(0);

  // 선택이 바뀔 때마다 하위 선택 초기화
  const handleAreaChange = (code) => {
    setAreaCode(code);
    setCategory("");
    setCat1("");
    setCat2("");
    setCat3("");
    setGameResult(null);
  };
  const handleCategoryChange = (cat) => {
    setCategory(cat);
    setCat1("");
    setCat2("");
    setCat3("");
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
    <div className="relative w-full min-h-screen flex flex-col bg-my-off-white">
      <Header />
      {/* 상단 배경: 66vh로 확장 */}
      <div className="absolute top-0 left-0 w-full h-[66vh] min-h-[300px] z-0 pointer-events-none">
        <img
          src="/images/ListMain.jpg"
          alt=""
          className="w-full h-full object-cover"
          draggable={false}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(255,255,255,0.5) 70%, #fdf6f5 100%)",
          }}
        />
      </div>
      {/* 컨텐츠 */}
      <main className="relative z-10 container mx-auto px-4 flex-1 flex flex-col">
        <div className="w-full flex items-center justify-center h-32 md:h-40">
          <h1
            className="text-3xl md:text-4xl font-extrabold text-center drop-shadow-lg tracking-tight flex-1 text-my-dark-gray"
            style={{ fontFamily: "'Pacifico', cursive" }}
          >
            Travel Picks
          </h1>
        </div>
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-1/3 w-full flex flex-col gap-6">
            <div className="bg-my-peach rounded-2xl shadow p-6">
              <h2 className="text-2xl font-extrabold mb-4 drop-shadow text-my-dark-gray">
                지역
              </h2>
              <RegionSelector
                areaCode={areaCode}
                setAreaCode={handleAreaChange}
                areaCodes={AREA_CODES}
              />
            </div>
            {areaCode && (
              <div className="bg-my-peach rounded-2xl shadow p-6">
                <h2 className="text-2xl font-extrabold mb-4 drop-shadow text-my-dark-gray">
                  테마
                </h2>
                <CategoryTabs
                  category={category}
                  setCategory={handleCategoryChange}
                  categoryTree={CATEGORY_TREE}
                />
              </div>
            )}
            {areaCode && category && (
              <div className="bg-my-peach rounded-2xl shadow p-6">
                <h2 className="text-2xl font-extrabold mb-4 drop-shadow text-my-dark-gray">
                  세부 테마
                </h2>
                <SubCategoryTabs
                  category={category}
                  cat1={cat1}
                  setCat1={setCat1}
                  cat2={cat2}
                  setCat2={setCat2}
                  cat3={cat3}
                  setCat3={setCat3}
                  categoryTree={CATEGORY_TREE}
                />
              </div>
            )}
          </div>
          <div className="md:w-2/3 w-full md:ml-auto">
            {areaCode && category && (
              <>
                {/* 검색 및 게임 영역 */}
                <div className="bg-my-peach rounded-2xl shadow p-6 mb-6">
                  {/* 검색바를 먼저 표시 */}
                  <div className="mb-6">
                    <SearchBar
                      keyword={searchKeyword}
                      setKeyword={setSearchKeyword}
                      onSearch={handleSearch}
                      onGameSelect={() => setIsCustomGameModalOpen(true)}
                      totalCount={totalCount}
                    />
                  </div>
                  {/* 게임 결과 표시 */}
                  {gameResult && (
                    <div className="bg-gradient-to-r from-my-aqua to-my-peach rounded-2xl shadow p-6 mb-6 border-2 border-my-coral">
                      <h3 className="text-2xl font-bold text-center text-my-coral mb-4">
                        🎉 게임 결과 - 선택된 여행지
                      </h3>
                      <div className="text-center">
                        <p className="font-semibold text-xl mb-2 text-my-dark-gray">
                          {gameResult.title}
                        </p>
                        <p className="text-my-dark-gray mb-2">
                          {gameResult.addr1} {gameResult.addr2}
                        </p>
                        {gameResult.tel && (
                          <p className="text-my-dark-gray mb-2">
                            📞 {gameResult.tel}
                          </p>
                        )}
                        <button
                          onClick={() => setGameResult(null)}
                          className="mt-4 px-4 py-2 bg-my-coral text-white rounded-lg hover:bg-my-peach transition-colors"
                        >
                          결과 닫기
                        </button>
                      </div>
                    </div>
                  )}
                  {/* 기존 리스트 */}
                  <TourApiList
                    areaCode={areaCode}
                    contentTypeId={CATEGORY_TREE[category]?.contentTypeId || ""}
                    cat1={cat1 ? CATEGORY_TREE[category].cat1[cat1]?.code : ""}
                    cat2={
                      cat1 && cat2
                        ? CATEGORY_TREE[category].cat1[cat1].cat2[cat2]?.code
                        : ""
                    }
                    cat3={
                      cat1 && cat2 && cat3
                        ? CATEGORY_TREE[category].cat1[cat1].cat2[cat2].cat3[
                            cat3
                          ]
                        : ""
                    }
                    onPlacesUpdate={handlePlacesUpdate}
                    searchKeyword={searchKeyword}
                    onTotalCountUpdate={setTotalCount}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </main>
      {/* 푸터 */}
      <footer className="bg-white/60 backdrop-blur-md py-9 text-sm text-gray-600 mt-auto relative px-6 flex items-center">
        <div
          className="absolute inset-y-0 left-16 w-40 bg-no-repeat bg-left bg-contain pointer-events-none"
          style={{ backgroundImage: "url('/images/h1trip-logo.png')" }}
        />
        <p className="relative z-10 text-center w-full">
          © 2025 h1 Trip. 모든 여행자들의 꿈을 응원합니다. 🌟
        </p>
      </footer>
      <CustomGameModal
        isOpen={isCustomGameModalOpen}
        onClose={() => setIsCustomGameModalOpen(false)}
        places={currentPlaces}
      />
    </div>
  );
}
