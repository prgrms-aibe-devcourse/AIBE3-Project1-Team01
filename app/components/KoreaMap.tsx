"use client";

import { useState } from "react";
import Link from "next/link";

const regions = [
  { name: "서울", id: "seoul", position: { top: "35%", left: "45%" } },
  { name: "경기", id: "gyeonggi", position: { top: "38%", left: "42%" } },
  { name: "인천", id: "incheon", position: { top: "40%", left: "38%" } },
  { name: "강원", id: "gangwon", position: { top: "28%", left: "55%" } },
  { name: "충북", id: "chungbuk", position: { top: "45%", left: "48%" } },
  { name: "충남", id: "chungnam", position: { top: "48%", left: "40%" } },
  { name: "대전", id: "daejeon", position: { top: "50%", left: "45%" } },
  { name: "세종", id: "sejong", position: { top: "52%", left: "42%" } },
  { name: "전북", id: "jeonbuk", position: { top: "58%", left: "40%" } },
  { name: "전남", id: "jeonnam", position: { top: "68%", left: "38%" } },
  { name: "광주", id: "gwangju", position: { top: "65%", left: "42%" } },
  { name: "경북", id: "gyeongbuk", position: { top: "48%", left: "58%" } },
  { name: "경남", id: "gyeongnam", position: { top: "65%", left: "55%" } },
  { name: "대구", id: "daegu", position: { top: "58%", left: "55%" } },
  { name: "울산", id: "ulsan", position: { top: "62%", left: "62%" } },
  { name: "부산", id: "busan", position: { top: "70%", left: "58%" } },
  { name: "제주", id: "jeju", position: { top: "85%", left: "35%" } },
];

export default function KoreaMap() {
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);

  return (
    <div className="relative w-full max-w-2xl mx-auto aspect-[3/4] bg-gradient-to-br from-blue-50 to-green-50 rounded-3xl shadow-lg overflow-hidden">
      <div className="absolute inset-4 bg-white/40 rounded-2xl">
        {regions.map((region) => (
          <Link
            key={region.id}
            href={`/plan/${region.id}`}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
            style={region.position}
            onMouseEnter={() => setHoveredRegion(region.id)}
            onMouseLeave={() => setHoveredRegion(null)}
          >
            <div
              className={`
                px-3 py-2 rounded-full text-sm font-medium transition-all duration-300
                ${
                  hoveredRegion === region.id
                    ? "bg-pink-400 text-white scale-110 shadow-lg"
                    : "bg-white/80 text-gray-700 hover:bg-pink-100"
                }
              `}
            >
              {region.name}
            </div>
          </Link>
        ))}

        <div className="absolute top-4 left-4 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2">
          <span className="text-sm text-gray-600 font-medium">
            지역을 클릭해보세요!
          </span>
        </div>
      </div>
    </div>
  );
}
