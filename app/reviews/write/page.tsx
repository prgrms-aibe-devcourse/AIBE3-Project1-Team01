"use client";

import { supabase } from "@/lib/supabase";
import { useState } from "react";
import Link from "next/link";

export default function WriteReviewPage() {
  const [formData, setFormData] = useState({
    title: "",
    region: "",
    rating: 5,
    content: "",
    images: [] as File[],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewImages, setPreviewImages] = useState<string[]>([]);

  const regions = [
    "서울",
    "부산",
    "제주도",
    "강원도",
    "경기도",
    "인천",
    "대구",
    "광주",
    "대전",
    "울산",
  ];

  // ...existing code...

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

    // 미리보기 생성
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

    if (
      !formData.title.trim() ||
      !formData.region ||
      !formData.content.trim()
    ) {
      alert("모든 필수 항목을 입력해주세요.");
      return;
    }

    if (formData.content.length > 500) {
      alert("후기 내용은 500자를 초과할 수 없습니다.");
      return;
    }

    setIsSubmitting(true);

    // Supabase에 데이터 전송
    const { data, error } = await supabase.from("reviews").insert({
      title: formData.title,
      region: formData.region,
      rating: formData.rating,
      content: formData.content,
      created_at: new Date().toISOString(), // 필요 시
    });

    setIsSubmitting(false);
    if (error) {
      alert("후기 등록에 실패했습니다: " + error.message);
      return;
    }
    alert("후기가 성공적으로 등록되었습니다!");
    // 후기 목록으로 이동 (원하는 경우 추가)
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-pink-100 sticky top-0 z-40">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link
              href="/reviews"
              className="text-pink-500 hover:text-pink-600 cursor-pointer"
            >
              <i className="ri-arrow-left-line text-xl"></i>
            </Link>
            <h1 className="text-2xl font-bold text-gray-800">후기 작성</h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8 max-w-2xl">
        <form
          id="review-form"
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-lg p-8"
        >
          {/* 제목 */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              후기 제목 *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, title: e.target.value }))
              }
              placeholder="여행 후기 제목을 입력해주세요"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-pink-300 transition-colors"
            />
          </div>

          {/* 지역 선택 */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              여행 지역 *
            </label>
            <select
              name="region"
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
              name="content"
              value={formData.content}
              onChange={(e) => {
                if (e.target.value.length <= 500) {
                  setFormData((prev) => ({ ...prev, content: e.target.value }));
                }
              }}
              placeholder="여행에서 경험한 생생한 후기를 공유해주세요"
              rows={6}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-pink-300 transition-colors resize-none"
            />
          </div>

          {/* 사진 업로드 */}
          <div className="mb-8">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              사진 업로드 (최대 5장)
            </label>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
              {previewImages.map((image, index) => (
                <div key={index} className="relative group">
                  <img
                    src={image}
                    alt={`미리보기 ${index + 1}`}
                    className="w-full h-24 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full text-xs hover:bg-red-600 transition-colors cursor-pointer"
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

          {/* 제출 버튼 */}
          <div className="flex gap-4">
            <Link
              href="/reviews"
              className="flex-1 bg-gray-100 text-gray-600 py-3 px-6 rounded-xl font-medium text-center hover:bg-gray-200 transition-colors cursor-pointer"
            >
              취소
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-gradient-to-r from-pink-400 to-purple-400 text-white py-3 px-6 rounded-xl font-medium hover:from-pink-500 hover:to-purple-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <i className="ri-loader-4-line animate-spin mr-2"></i>
                  등록 중...
                </>
              ) : (
                "후기 등록"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
