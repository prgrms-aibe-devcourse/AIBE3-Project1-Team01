"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import ReviewContentForm, { ReviewContentData } from "@/app/reviews/components/ReviewContentForm";
import ReviewImageUpload, { ReviewImageUploadData } from "@/app/reviews/components/ReviewImageUpload";

export default function WriteReviewPage() {
  // 후기 내용 상태
  const [contentData, setContentData] = useState<ReviewContentData>({
    title: "",
    region: "",
    rating: 5,
    content: "",
  });
  // 이미지 업로드 상태
  const [imageData, setImageData] = useState<ReviewImageUploadData>({
    files: [],
    previews: [],
  });
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  // 안전한 파일명 생성
  const generateSafeFileName = (originalFile: File): string => {
    const extension = originalFile.name.split(".").pop()?.toLowerCase() || "jpg";
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 10);
    return `${timestamp}-${randomString}.${extension}`;
  };

  // 제출 처리
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { title, region, rating, content } = contentData;
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
    for (let i = 0; i < imageData.files.length; i++) {
      const file = imageData.files[i];
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
    setImageData({ files: [], previews: [] });
    setContentData({ title: "", region: "", rating: 5, content: "" });
    alert("후기 및 이미지 업로드 완료!");
    setIsUploading(false);
  };

  return (
    <div className="max-w-xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-6">✍️ 후기 작성</h1>
      <form onSubmit={handleSubmit}>
        <ReviewContentForm value={contentData} onChange={setContentData} disabled={isUploading} />
        <ReviewImageUpload value={imageData} onChange={setImageData} disabled={isUploading} />
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
