"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../../lib/supabase";
import { useImageUpload } from "../../hooks/useImageUpload";
import { useReviewContent } from "../../hooks/useReviewContent";
import ReviewContentForm from "../../components/ReviewContentForm";

export default function EditReviewPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = React.use(params);
  const reviewId = parseInt(id);

  const [loading, setLoading] = useState(true);
  const [existingImages, setExistingImages] = useState<{ url: string; order: number }[]>([]);
  const [deletedImages, setDeletedImages] = useState<string[]>([]);

  const {
    form: contentData,
    setForm: setContentData,
    validate: validateContent,
  } = useReviewContent();

  const {
    files: imageFiles,
    previews: imagePreviews,
    addFiles: addImageFiles,
    removeFile: removeImageFile,
    reset: resetImages,
    upload,
    loading: isUploading,
    error: uploadError,
  } = useImageUpload();

  useEffect(() => {
    if (reviewId) loadReview(reviewId);
  }, [reviewId]);

  const loadReview = async (id: number) => {
    try {
      const { data: review } = await supabase.from("reviews").select("*").eq("id", id).single();
      if (!review) throw new Error("리뷰 정보 없음");

      setContentData({
        title: review.title,
        region: review.region,
        rating: review.rating,
        content: review.content,
      });

      const { data: images } = await supabase
        .from("images")
        .select("img_url, order")
        .eq("review_id", id)
        .order("order");

      if (images) {
        setExistingImages(images.map(img => ({ url: img.img_url, order: img.order })));
        setDeletedImages([]);
      }

      setLoading(false);
    } catch (e: any) {
      alert(e.message);
      setLoading(false);
    }
  };

  const handleImageUploadChange = ({ files, previews }: { files: File[]; previews: string[] }) => {
    resetImages();
    addImageFiles(files, previews);
  };

  const handleImageRemove = (index: number) => {
    const remain = existingImages.filter(img => !deletedImages.includes(img.url));
    if (index < remain.length) {
      setDeletedImages(prev => [...prev, remain[index].url]);
    } else {
      removeImageFile(index - remain.length);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const err = validateContent();
    if (err) return alert(err);

    try {
      const { error: reviewError } = await supabase
        .from("reviews")
        .update({
          ...contentData,
          updated_at: new Date().toISOString(),
        })
        .eq("id", reviewId);

      if (reviewError) throw new Error(reviewError.message);

      if (deletedImages.length > 0) {
        await supabase
          .from("images")
          .delete()
          .in("img_url", deletedImages)
          .eq("review_id", reviewId);

        for (const url of deletedImages) {
          const fileName = url.split("/").pop();
          if (fileName) {
            await supabase.storage.from("images").remove([fileName]);
          }
        }
      }

      if (imageFiles.length > 0) {
        await upload(reviewId);
      }

      alert("후기 수정 완료!");
      router.push(`/reviews/${reviewId}`);
    } catch (e: any) {
      alert(e.message || "오류 발생");
    }
  };

  const handleCancel = () => {
    if (confirm("수정을 취소하시겠습니까?")) {
      router.push("/reviews");
    }
  };

  if (loading) {
    return <div className="text-center py-10">리뷰 정보를 불러오는 중...</div>;
  }

  // 기존 이미지 + 새 이미지 미리보기
  const allPreviews = [
    ...existingImages
      .filter(img => !deletedImages.includes(img.url))
      .sort((a, b) => a.order - b.order)
      .map(img => img.url),
    ...imagePreviews,
  ];

  return (
    <div className="max-w-xl mx-auto py-10 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">✏️ 후기 수정</h1>
        <button onClick={handleCancel} className="text-sm text-gray-500 hover:text-gray-700">취소</button>
      </div>

      <form onSubmit={handleSubmit}>
        <ReviewContentForm
          value={contentData}
          onChange={setContentData}
          disabled={isUploading}
        />

        <div className="mt-6">
          <label className="block mb-2 font-medium">사진 업로드</label>
          <div className="flex flex-wrap gap-2 mb-2">
            {allPreviews.map((src, index) => (
              <div key={index} className="relative w-24 h-24">
                <img src={src} alt={`preview-${index}`} className="w-full h-full object-cover rounded" />
                <button
                  type="button"
                  onClick={() => handleImageRemove(index)}
                  className="absolute top-0 right-0 text-white bg-black bg-opacity-50 px-1 rounded-bl"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => {
              const files = Array.from(e.target.files || []);
              const previews = files.map(file => URL.createObjectURL(file));
              handleImageUploadChange({ files, previews });
            }}
          />
        </div>

        <div className="flex gap-3 mt-6">
          <button
            type="button"
            onClick={handleCancel}
            className="flex-1 bg-gray-100 py-2 rounded"
          >
            취소
          </button>
          <button
            type="submit"
            className="flex-1 bg-pink-500 text-white py-2 rounded disabled:bg-gray-300"
            disabled={isUploading}
          >
            {isUploading ? "수정 중..." : "수정 완료"}
          </button>
        </div>
      </form>

      {uploadError && (
        <div className="mt-4 text-red-500 text-sm">{uploadError.message}</div>
      )}
    </div>
  );
}
