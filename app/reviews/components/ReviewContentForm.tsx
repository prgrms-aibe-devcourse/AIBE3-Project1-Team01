/**
 * 후기 내용 폼
 * - 제목, 지역, 평점, 내용 입력
 */
import React, { useState, useEffect } from "react";

export interface ReviewContentData {
  title: string;
  region: string;
  rating: number;
  content: string;
}

interface ReviewContentFormProps {
  value: ReviewContentData;
  onChange: (data: ReviewContentData) => void;
  disabled?: boolean;
}

const regions = [
  "서울",
  "가평·양평",
  "강릉·속초",
  "경주",
  "부산",
  "여수",
  "인천",
  "전주",
  "제주",
  "춘천·홍천",
  "태안",
  "통영·거제·남해",
  "포항·안동",
];

export default function ReviewContentForm({
  value,
  onChange,
  disabled,
}: ReviewContentFormProps) {
  // 내부 상태는 부모에서 관리, 입력값이 바뀔 때마다 onChange로 전달
  const handleChange = (
    field: keyof ReviewContentData,
    val: string | number
  ) => {
    onChange({ ...value, [field]: val });
  };

  return (
    <>
      {/* 후기 제목 */}
      <div className="mb-4">
        <label className="block text-sm font-semibold mb-1">후기 제목 *</label>
        <input
          type="text"
          value={value.title}
          onChange={(e) => handleChange("title", e.target.value)}
          className="w-full px-3 py-2 border rounded"
          placeholder="제목을 입력하세요"
          disabled={disabled}
        />
      </div>
      {/* 지역 선택 */}
      <div className="mb-4">
        <label className="block text-sm font-semibold mb-1">여행 지역 *</label>
        <select
          value={value.region}
          onChange={(e) => handleChange("region", e.target.value)}
          className="w-full px-3 py-2 border rounded"
          disabled={disabled}
        >
          <option value="">지역 선택</option>
          {regions.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      </div>
      {/* 평점 선택 */}
      <div className="mb-4">
        <label className="block text-sm font-semibold mb-1">평점 *</label>
        <div className="flex space-x-1">
          {Array.from({ length: 5 }, (_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handleChange("rating", i + 1)}
              className={`text-2xl ${
                i < value.rating ? "text-yellow-400" : "text-gray-300"
              }`}
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
        <label className="block text-sm font-semibold mb-1">
          후기 내용 * (500자 이내)
        </label>
        <textarea
          value={value.content}
          onChange={(e) => {
            if (e.target.value.length <= 500)
              handleChange("content", e.target.value);
          }}
          rows={6}
          className="w-full px-3 py-2 border rounded resize-none"
          placeholder="후기 내용을 입력하세요"
          disabled={disabled}
        />
        <div className="text-xs text-gray-500 mt-1">
          {value.content.length} / 500
        </div>
      </div>
    </>
  );
}
