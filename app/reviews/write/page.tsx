"use client";

import { useState } from "react";
import ImageUpload from "@/app/components/ImageUpload";
import { supabase } from "@/lib/supabase";

export default function WriteReviewPage() {

  // 후기 본문 상태 정의
  const [title, setTitle] = useState("");
  const [region, setRegion] = useState("");
  const [rating, setRating] = useState(5);
  const [content, setContent] = useState("");

  //이미지를 위한 상태 정의 
  const [images, setImages] = useState<File[]>([]);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  // 이미지 선택 이벤트 처리(선택된 이미지와, 미리보기가 바뀌어야 함)
  const handleChange = (newFiles: File[], newPreviews: string[]) => {
    setImages(newFiles);
    setPreviewImages(newPreviews);
  };

  // 이미지 제거 처리(선택된 이미지와, 미리보기가 바뀌어야 함)
  const handleRemove = (index: number) => {
    const newFiles = [...images];
    const newPreviews = [...previewImages];
    newFiles.splice(index, 1);
    newPreviews.splice(index, 1);
    setImages(newFiles);
    setPreviewImages(newPreviews);
  };

  // 안전한 파일명 생성  
  const generateSafeFileName = (originalFile: File): string => {
    const extension = originalFile.name.split(".").pop()?.toLowerCase() || "jpg";
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 10);
    return `${timestamp}-${randomString}.${extension}`;
  };

  // 후기 및 이미지 업로드 처리  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 후기 본문 유효성 검사
    if (!title.trim() || !region || !content.trim()) {
      alert("모든 필수 항목을 입력해주세요.");
      return;
    }

    if (content.length > 500) {
      alert("후기 내용은 500자를 초과할 수 없습니다.");
      return;
    }

    setIsUploading(true);

    // 1. 후기 저장
    const { data: reviewData, error: reviewError } = await supabase
      .from("reviews")
      .insert({
        title,
        region,
        rating,
        content,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (reviewError || !reviewData) {
      alert("후기 저장 실패: " + reviewError?.message);
      setIsUploading(false);
      return;
    }

    const reviewId = reviewData.id;

    // 2. 이미지 업로드 및 DB 저장
    const uploaded: string[] = [];

    for (let i = 0; i < images.length; i++) {
      const file = images[i];
      const safeFileName = generateSafeFileName(file);

      const { data, error } = await supabase.storage
        .from("images")
        .upload(safeFileName, file);

      if (error) {
        alert(`이미지 업로드 실패: ${error.message}`);
        setIsUploading(false);
        return;
      }

      const { data: urlData } = supabase.storage
        .from("images")
        .getPublicUrl(safeFileName);

      if (!urlData?.publicUrl) continue;

      const imageUrl = urlData.publicUrl;
      uploaded.push(imageUrl);

      const { error: insertError } = await supabase.from("images").insert({
        review_id: reviewId,
        img_url: imageUrl,
        order: i,
        place: null,
      });

      if (insertError) {
        alert(`이미지 DB 저장 실패: ${insertError.message}`);
        setIsUploading(false);
        return;
      }
    }

    // 상태 초기화 및 알림
    setUploadedUrls(uploaded);
    setImages([]);
    setPreviewImages([]);
    setTitle("");
    setRegion("");
    setRating(5);
    setContent("");

    alert("후기 및 이미지 업로드 완료!");
    setIsUploading(false);
  };

  // 지역 선택 옵션
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

  return (
    <div className="max-w-xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-6">✍️ 후기 작성</h1>

      <form onSubmit={handleSubmit}>
        {/* 후기 제목 */}
        <div className="mb-4">
          <label className="block text-sm font-semibold mb-1">후기 제목 *</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            placeholder="제목을 입력하세요"
          />
        </div>

        {/* 지역 선택 */}
        <div className="mb-4">
          <label className="block text-sm font-semibold mb-1">여행 지역 *</label>
          <select
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            className="w-full px-3 py-2 border rounded"
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
                onClick={() => setRating(i + 1)}
                className={`text-2xl ${
                  i < rating ? "text-yellow-400" : "text-gray-300"
                }`}
              >
                ★
              </button>
            ))}
            <span className="ml-2">{rating} 점</span>
          </div>
        </div>

        {/* 후기 내용 */}
        <div className="mb-6">
          <label className="block text-sm font-semibold mb-1">
            후기 내용 * (500자 이내)
          </label>
          <textarea
            value={content}
            onChange={(e) => {
              if (e.target.value.length <= 500) {
                setContent(e.target.value);
              }
            }}
            rows={6}
            className="w-full px-3 py-2 border rounded resize-none"
            placeholder="후기 내용을 입력하세요"
          />
          <div className="text-xs text-gray-500 mt-1">
            {content.length} / 500
          </div>
        </div>

        {/* 이미지 업로드 */}
        <ImageUpload
          images={images}
          previewImages={previewImages}
          onChange={handleChange}
          onRemove={handleRemove}
        />

        {/* 제출 버튼 */}
        <button
          type="submit"
          disabled={isUploading}
          className="w-full bg-pink-500 text-white py-2 rounded hover:bg-pink-600 disabled:bg-gray-300"
        >
          {isUploading ? "등록 중..." : "후기 등록"}
        </button>
      </form>

      {uploadedUrls.length > 0 && (
        <div className="mt-6">
          <h2 className="font-semibold mb-2">업로드된 이미지들:</h2>
          <ul className="space-y-2 text-sm break-words">
            {uploadedUrls.map((url, idx) => (
              <li key={idx}>
                <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                  {url}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
