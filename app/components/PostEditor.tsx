// components/PostEditor.tsx
"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function PostEditor() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    title: "",
    region: "",
    rating: 5,
    content: "",
    images: [] as File[],
  });

  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const regions = [
    "서울", "부산", "제주도", "강원도", "경기도",
    "인천", "대구", "광주", "대전", "울산",
  ];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + formData.images.length > 5) {
      alert("최대 5장까지 업로드 가능합니다.");
      return;
    }

    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...files],
    }));

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImages((prev) => [...prev, e.target?.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
    setPreviewImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { title, region, rating, content } = formData;

    if (!title.trim() || !region || !content.trim()) {
      alert("모든 필수 항목을 입력해주세요.");
      return;
    }
    if (content.length > 500) {
      alert("후기 내용은 500자를 초과할 수 없습니다.");
      return;
    }

    setIsSubmitting(true);

    const { data, error } = await supabase.from("reviews").insert({
      title,
      region,
      rating,
      content,
      created_at: new Date().toISOString(),
    });

    setIsSubmitting(false);
    if (error) {
      alert("후기 등록에 실패했습니다: " + error.message);
    } else {
      alert("후기가 성공적으로 등록되었습니다!");
      router.push("/reviews");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-8">
      {/* 제목 */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          후기 제목 *
        </label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, title: e.target.value }))
          }
          placeholder="여행 후기 제목을 입력해주세요"
          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-pink-300 transition-colors"
        />
      </div>

      {/* 지역 */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          여행 지역 *
        </label>
        <select
          value={formData.region}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, region: e.target.value }))
          }
          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-pink-300 transition-colors pr-8"
        >
          <option value="">지역을 선택해주세요</option>
          {regions.map((region) => (
            <option key={region} value={region}>
              {region}
            </option>
          ))}
        </select>
      </div>

      {/* 평점 */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          평점 *
        </label>
        <div className="flex items-center space-x-2">
          {Array.from({ length: 5 }, (_, i) => (
            <button
              key={i}
              type="button"
              onClick={() =>
                setFormData((prev) => ({ ...prev, rating: i + 1 }))
              }
              className={`text-2xl transition-colors cursor-pointer ${
                i < formData.rating ? "text-yellow-400" : "text-gray-300"
              }`}
            >
              <i className="ri-star-fill"></i>
            </button>
          ))}
          <span className="ml-4 text-sm text-gray-600">
            {formData.rating}점
          </span>
        </div>
      </div>

      {/* 후기 내용 */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          후기 내용 *
          <span className="text-xs text-gray-500 font-normal">
            ({formData.content.length}/500자)
          </span>
        </label>
        <textarea
          value={formData.content}
          onChange={(e) => {
            if (e.target.value.length <= 500) {
              setFormData((prev) => ({
                ...prev,
                content: e.target.value,
              }));
            }
          }}
          placeholder="여행에서 경험한 생생한 후기를 공유해주세요"
          rows={6}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-pink-300 transition-colors resize-none"
        />
      </div>

      {/* 이미지 업로드 */}
      <div className="mb-8">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          사진 업로드 (최대 5장)
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
          {previewImages.map((img, idx) => (
            <div key={idx} className="relative group">
              <img
                src={img}
                alt={`preview-${idx}`}
                className="w-full h-24 object-cover rounded-lg"
              />
              <button
                type="button"
                onClick={() => removeImage(idx)}
                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full text-xs hover:bg-red-600"
              >
                ×
              </button>
            </div>
          ))}
          {formData.images.length < 5 && (
            <label className="border-2 border-dashed border-gray-300 rounded-lg h-24 flex flex-col items-center justify-center cursor-pointer hover:border-pink-300 transition-colors">
              <i className="ri-camera-line text-xl text-gray-400 mb-1"></i>
              <span className="text-xs text-gray-500">사진 추가</span>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
          )}
        </div>
        <p className="text-xs text-gray-500">
          JPG, PNG 파일만 업로드 가능합니다. (각 파일 최대 5MB)
        </p>
      </div>

      {/* 버튼 */}
      <div className="flex gap-4">
        <Link
          href="/reviews"
          className="flex-1 bg-gray-100 text-gray-600 py-3 px-6 rounded-xl font-medium text-center hover:bg-gray-200 transition-colors"
        >
          취소
        </Link>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 bg-gradient-to-r from-pink-400 to-purple-400 text-white py-3 px-6 rounded-xl font-medium hover:from-pink-500 hover:to-purple-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <i className="ri-loader-4-line animate-spin mr-2" />
              등록 중...
            </>
          ) : (
            "후기 등록"
          )}
        </button>
      </div>
    </form>
  );
}
