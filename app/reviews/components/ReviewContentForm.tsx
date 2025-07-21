/**
 * 후기 내용 폼
 * - 제목, 지역, 평점, 내용 입력
 */
import React, { useState, useEffect } from "react";
import { REGION_OPTIONS } from "../constants/regions";

export interface ReviewContentData {
  title: string;
  region: string;       // 시/도 (province)
  region_city: string;  // 시/군/구 (city)
  rating: number;
  content: string;
}

interface ReviewContentFormProps {
  value: ReviewContentData;
  onChange: (data: ReviewContentData) => void;
  disabled?: boolean;
}

export default function ReviewContentForm({
  value,
  onChange,
  disabled,
}: ReviewContentFormProps) {
  // 내부 상태는 부모에서 관리, 입력값이 바뀔 때마다 onChange로 전달

  // 선택된 region, region_city 내부 상태 (기존 value에 맞게 초기화)
  const [region, setRegion] = useState(value.region || "");
  const [regionCity, setRegionCity] = useState(value.region_city || "");

  // value가 바뀌면 내부 상태 동기화
  useEffect(() => {
    setRegion(value.region || "");
    setRegionCity(value.region_city || "");
  }, [value.region, value.region_city]);

  // region 변경 시 region_city 초기화 및 value 변경
  const onRegionChange = (newRegion: string) => {
    setRegion(newRegion);
    setRegionCity("");

    onChange({ ...value, region: newRegion, region_city: ""});
  };

  // region_city 변경 시 value 변경
  const onRegionCityChange = (newRegionCity: string) => {
    setRegionCity(newRegionCity);
    onChange({ ...value, region, region_city: newRegionCity });
  };

  return (
    <>
      {/* 후기 제목 */}
      <div className="mb-4">
        <label className="block text-sm font-semibold mb-1">후기 제목</label>
        <input
          type="text"
          value={value.title}
          onChange={(e) => onChange({ ...value, title: e.target.value })}
          className="w-full px-3 py-2 border rounded"
          placeholder="제목을 입력하세요"
          disabled={disabled}
        />
      </div>

      {/* 지역 선택 */}
      <div className="mb-4">
        <label className="block text-sm font-semibold mb-1">여행 지역</label>
        <div className="flex space-x-2">
          <select
            value={region}
            onChange={(e) => onRegionChange(e.target.value)}
            className="w-1/2 px-3 py-2 border rounded"
            disabled={disabled}
          >
            <option value="">시/도 선택</option>
            {REGION_OPTIONS.map(({ province }) => (
              <option key={province} value={province}>
                {province}
              </option>
            ))}
          </select>

          {/* 시/군/구 선택 */}  
          <select
            value={regionCity}
            onChange={(e) => onRegionCityChange(e.target.value)}
            className="w-1/2 px-3 py-2 border rounded"
            disabled={!region || disabled}
          >
            {region === "세종" ? (
              <option value="" disabled>
                세종시는 자치구가 없습니다.
              </option>
            ) : (
              <>
                <option value="">시/군/구 선택</option>
                {REGION_OPTIONS.find((r) => r.province === region)?.cities.map((cityName) => (
                  <option key={cityName} value={cityName}>
                    {cityName}
                  </option>
                ))}
              </>
            )}
          </select>
        </div>
      </div>

      {/* 평점 선택 */}
      <div className="mb-4">
        <label className="block text-sm font-semibold mb-1">평점</label>
        <div className="flex space-x-1">
          {Array.from({ length: 5 }, (_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => onChange({ ...value, rating: i + 1 })}
              className={`text-2xl ${i < value.rating ? "text-yellow-400" : "text-gray-300"}`}
              disabled={disabled}
            >
              ★
            </button>
          ))}
          <span className="ml-2 mt-2">{value.rating} 점</span>
        </div>
      </div>

      {/* 후기 내용 */}
      <div className="mb-6">
        <label className="block text-sm font-semibold mb-1">후기 내용 (500자 이내)</label>
        <textarea
          value={value.content}
          onChange={(e) => {
            if (e.target.value.length <= 500) onChange({ ...value, content: e.target.value });
          }}
          rows={6}
          className="w-full px-3 py-2 border rounded resize-none"
          placeholder="후기 내용을 입력하세요"
          disabled={disabled}
        />
        <div className="text-xs text-gray-500 mt-1">{value.content.length} / 500</div>
      </div>
    </>
  );
}
