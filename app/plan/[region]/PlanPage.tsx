"use client";

import { useState } from "react";
import Link from "next/link";
import PlaceList from "@/app/components/PlaceList";
import PlanMap from "@/app/components/PlanMap";
import SelectedPlaces from "@/app/components/SelectedPlaces";

interface PlanPageProps {
  region: string;
}

const regionNames: { [key: string]: string } = {
  seoul: "서울",
  busan: "부산",
  jeju: "제주도",
  gangwon: "강원도",
  gyeonggi: "경기도",
  chungbuk: "충청북도",
  chungnam: "충청남도",
  jeonbuk: "전라북도",
  jeonnam: "전라남도",
  gyeongbuk: "경상북도",
  gyeongnam: "경상남도",
};

export default function PlanPage({ region }: PlanPageProps) {
  const [selectedPlaces, setSelectedPlaces] = useState<any[]>([]);
  const [activeCategory, setActiveCategory] = useState("all");

  const regionName = regionNames[region] || region;

  const handlePlaceSelect = (place: any) => {
    setSelectedPlaces((prev) => [
      ...prev,
      { ...place, order: prev.length + 1 },
    ]);
  };

  const handlePlaceRemove = (placeId: string) => {
    setSelectedPlaces((prev) => prev.filter((p) => p.id !== placeId));
  };

  const handleOrderChange = (dragIndex: number, dropIndex: number) => {
    const newPlaces = [...selectedPlaces];
    const draggedPlace = newPlaces[dragIndex];
    newPlaces.splice(dragIndex, 1);
    newPlaces.splice(dropIndex, 0, draggedPlace);

    // 순서 재정렬
    const reorderedPlaces = newPlaces.map((place, index) => ({
      ...place,
      order: index + 1,
    }));

    setSelectedPlaces(reorderedPlaces);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-pink-100 sticky top-0 z-40">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link
              href="/"
              className="text-pink-500 hover:text-pink-600 cursor-pointer"
            >
              <i className="ri-arrow-left-line text-xl"></i>
            </Link>
            <h1 className="text-2xl font-bold text-gray-800">
              {regionName} 여행 계획
            </h1>
          </div>

          <div className="flex space-x-3">
            <button className="bg-pink-100 text-pink-600 px-4 py-2 rounded-full hover:bg-pink-200 transition-colors whitespace-nowrap cursor-pointer">
              <i className="ri-save-line mr-2"></i>
              저장하기
            </button>
            <button className="bg-purple-100 text-purple-600 px-4 py-2 rounded-full hover:bg-purple-200 transition-colors whitespace-nowrap cursor-pointer">
              <i className="ri-upload-line mr-2"></i>
              불러오기
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 장소 리스트 */}
          <div className="lg:col-span-1">
            <PlaceList
              region={region}
              activeCategory={activeCategory}
              onCategoryChange={setActiveCategory}
              onPlaceSelect={handlePlaceSelect}
              selectedPlaces={selectedPlaces}
            />
          </div>

          {/* 지도 */}
          <div className="lg:col-span-1">
            <PlanMap selectedPlaces={selectedPlaces} region={region} />
          </div>

          {/* 선택된 장소 목록 */}
          <div className="lg:col-span-1">
            <SelectedPlaces
              places={selectedPlaces}
              onRemove={handlePlaceRemove}
              onOrderChange={handleOrderChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
