"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ReviewContentForm from "../../components/ReviewContentForm";
import { supabase } from "../../../../lib/supabase";
import { useReviewContent } from "../../hooks/useReviewContent";

export default function EditReviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const { id } = React.use(params);
  const reviewId = parseInt(id);

  // 로딩 상태
  const [loading, setLoading] = useState(true);

  // 기존 이미지 (url + order)
  const [existingImages, setExistingImages] = useState<
    { url: string; order: number }[]
  >([]);

  // 기존 이미지 미리보기 (url or 교체 이미지 base64)
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  // 삭제 대상 인덱스 (기존 이미지 기준)
  const [deletedIndexes, setDeletedIndexes] = useState<number[]>([]);

  // 교체 이미지: key=index, value=File
  const [imageReplacements, setImageReplacements] = useState<
    Record<number, File>
  >({});

  // 새 이미지 파일 & 미리보기
  const [newImages, setNewImages] = useState<File[]>([]);
  const [newImagePreviews, setNewImagePreviews] = useState<string[]>([]);

  // 업로드 중 에러 상태
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<Error | null>(null);

  const {
    form: contentData,
    setForm: setContentData,
    validate: validateContent,
  } = useReviewContent();

  useEffect(() => {
    if (!reviewId) return;
    const load = async () => {
      try {
        const { data: review } = await supabase
          .from("reviews")
          .select("*")
          .eq("id", reviewId)
          .single();

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
          .eq("review_id", reviewId)
          .order("order");

        if (images) {
          setExistingImages(
            images.map((img) => ({ url: img.img_url, order: img.order }))
          );
          setImagePreviews(images.map((img) => img.img_url));
        }

        setLoading(false);
      } catch (e: any) {
        alert(e.message);
        setLoading(false);
      }
    };
    load();
  }, [reviewId, setContentData]);

  // 기존 이미지 교체
  const handleImageReplace = (index: number) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreviews((prev) => {
        const copy = [...prev];
        copy[index] = reader.result as string;
        return copy;
      });
      setImageReplacements((prev) => ({
        ...prev,
        [index]: file,
      }));
      setDeletedIndexes((prev) => prev.filter((i) => i !== index));
    };
    reader.readAsDataURL(file);
  };

  // 기존 이미지 삭제
  const handleImageDelete = (index: number) => {
    if (confirm("이 이미지를 삭제하시겠습니까?")) {
      setDeletedIndexes((prev) => {
        if (!prev.includes(index)) return [...prev, index];
        return prev;
      });
      setImageReplacements((prev) => {
        const copy = { ...prev };
        delete copy[index];
        return copy;
      });
      setImagePreviews((prev) => {
        const copy = [...prev];
        copy[index] = "";
        return copy;
      });
    }
  };

  // 새 이미지 추가
  const handleNewImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const fileArray = Array.from(files);
    setNewImages((prev) => [...prev, ...fileArray]);

    fileArray.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewImagePreviews((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });

    e.target.value = "";
  };

  // 새 이미지 삭제
  const handleNewImageDelete = (index: number) => {
    if (confirm("이 이미지를 삭제하시겠습니까?")) {
      setNewImages((prev) => prev.filter((_, i) => i !== index));
      setNewImagePreviews((prev) => prev.filter((_, i) => i !== index));
    }
  };

  // 제출 핸들러
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploadError(null);

    const errorMsg = validateContent();
    if (errorMsg) {
      alert(errorMsg);
      return;
    }

    setUploading(true);

    try {
      // 1) 후기 내용 업데이트
      const { error: reviewError } = await supabase
        .from("reviews")
        .update({ ...contentData, updated_at: new Date().toISOString() })
        .eq("id", reviewId);
      if (reviewError) throw new Error(reviewError.message);

      // 2) 삭제 이미지 처리 - 스토리지 & DB 삭제
      for (const index of deletedIndexes) {
        const img = existingImages[index];
        if (!img) continue;

        // 스토리지 삭제
        const fileName = img.url.split("/").pop();
        if (fileName) {
          const { error: storageErr } = await supabase.storage
            .from("images")
            .remove([fileName]);
          if (storageErr) console.error("스토리지 삭제 실패:", storageErr.message);
        }

        // DB 삭제
        const { error: dbDeleteErr } = await supabase
          .from("images")
          .delete()
          .eq("review_id", reviewId)
          .filter('"order"', "eq", img.order);
        if (dbDeleteErr) throw new Error(dbDeleteErr.message);
      }

      // 3) 교체 이미지 처리
      for (const [indexStr, file] of Object.entries(imageReplacements)) {
        const index = Number(indexStr);
        if (deletedIndexes.includes(index)) continue;

        const oldImage = existingImages[index];
        if (!oldImage) continue;

        // 기존 파일 삭제
        const oldFileName = oldImage.url.split("/").pop();
        if (oldFileName) {
          const { error: storageRemoveError } = await supabase.storage
            .from("images")
            .remove([oldFileName]);
          if (storageRemoveError)
            console.error("스토리지 삭제 실패:", storageRemoveError.message);
        }

        // 새 파일 업로드
        const ext = file.name.split(".").pop() ?? "jpg";
        const newFileName = `${reviewId}-${Date.now()}-replace-${index}.${ext}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("images")
          .upload(newFileName, file);
        if (uploadError) throw new Error(uploadError.message);

        // 공개 URL 가져오기
        const { data: publicUrlData, error: publicUrlError } = supabase.storage
          .from("images")
          .getPublicUrl(uploadData.path);
        if (publicUrlError) throw new Error(publicUrlError.message);

        const newUrl = publicUrlData.publicUrl;

        // DB img_url 업데이트
        const { error: updateError } = await supabase
          .from("images")
          .update({ img_url: newUrl })
          .eq("review_id", reviewId)
          .filter('"order"', "eq", oldImage.order);
        if (updateError) throw new Error(updateError.message);
      }

      // 4) 새 이미지 업로드 & DB 삽입
      // 삭제되지 않은 기존 이미지의 최대 order 계산
      const remainingOrders = existingImages
        .map((img, idx) => ({ order: img.order, idx }))
        .filter(({ idx }) => !deletedIndexes.includes(idx))
        .map(({ order }) => order);

      const maxOrder = remainingOrders.length > 0 ? Math.max(...remainingOrders) : -1;

      for (let i = 0; i < newImages.length; i++) {
        const file = newImages[i];
        const ext = file.name.split(".").pop() ?? "jpg";
        const newFileName = `${reviewId}-${Date.now()}-new-${i}.${ext}`;

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("images")
          .upload(newFileName, file);
        if (uploadError) throw new Error(uploadError.message);

        const { data: publicUrlData, error: publicUrlError } = supabase.storage
          .from("images")
          .getPublicUrl(uploadData.path);
        if (publicUrlError) throw new Error(publicUrlError.message);

        // DB insert (order는 maxOrder + 1부터 순차 할당)
        const { error: insertError } = await supabase.from("images").insert({
          review_id: reviewId,
          img_url: publicUrlData.publicUrl,
          order: maxOrder + 1 + i,
        });
        if (insertError) throw new Error(insertError.message);
      }

      // 5) 남은 기존 이미지 order 재정렬 (0부터 연속 숫자)
      // 남은 기존 이미지 (삭제 제외) 정렬
      const remainingImages = existingImages
        .map((img, idx) => ({ ...img, idx }))
        .filter((img) => !deletedIndexes.includes(img.idx));

      // order 재정렬
      for (let newOrder = 0; newOrder < remainingImages.length; newOrder++) {
        const oldOrder = remainingImages[newOrder].order;
        if (oldOrder !== newOrder) {
          const { error } = await supabase
            .from("images")
            .update({ order: newOrder })
            .eq("review_id", reviewId)
            .filter('"order"', "eq", oldOrder);
          if (error) throw new Error(error.message);
        }
      }

      alert("후기 수정 완료!");
      router.push(`/reviews/${reviewId}`);
    } catch (e: any) {
      setUploadError(e);
      alert(e.message || "오류가 발생했습니다.");
    } finally {
      setUploading(false);
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

  return (
    <div className="max-w-xl mx-auto py-10 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">✏️ 후기 수정</h1>
        <button
          onClick={handleCancel}
          className="text-sm text-gray-500 hover:text-gray-700"
          disabled={uploading}
        >
          취소
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <ReviewContentForm
          value={contentData}
          onChange={setContentData}
          disabled={uploading}
        />

        {/* 기존 이미지 리스트 */}
        <div className="mt-6 space-y-4">
          <h2 className="font-semibold">기존 이미지</h2>
          {imagePreviews.map((preview, index) =>
            deletedIndexes.includes(index) ? null : (
              <div key={index} className="flex items-center gap-4">
                {preview ? (
                  <img
                    src={preview}
                    alt={`미리보기 ${index + 1}`}
                    className="w-32 h-32 object-cover rounded"
                  />
                ) : (
                  <div className="w-32 h-32 bg-gray-200 rounded flex items-center justify-center text-gray-400">
                    이미지 없음
                  </div>
                )}

                <div className="flex flex-col gap-2">
                  <label className="text-sm text-blue-500 cursor-pointer">
                    이미지 교체
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageReplace(index)}
                      disabled={uploading}
                    />
                  </label>
                  <button
                    type="button"
                    className="text-sm text-red-500"
                    onClick={() => handleImageDelete(index)}
                    disabled={uploading}
                  >
                    삭제
                  </button>
                </div>
              </div>
            )
          )}
        </div>

        {/* 새 이미지 추가 */}
        <div className="mt-6">
          <h2 className="font-semibold">새 이미지 추가</h2>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleNewImagesChange}
            disabled={uploading}
          />
          <div className="mt-4 flex flex-wrap gap-4">
            {newImagePreviews.map((preview, index) => (
              <div key={index} className="relative">
                <img
                  src={preview}
                  alt={`새 이미지 미리보기 ${index + 1}`}
                  className="w-32 h-32 object-cover rounded"
                />
                <button
                  type="button"
                  onClick={() => handleNewImageDelete(index)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 text-xs flex items-center justify-center"
                  disabled={uploading}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            type="button"
            onClick={handleCancel}
            className="flex-1 bg-gray-100 py-2 rounded"
            disabled={uploading}
          >
            취소
          </button>
          <button
            type="submit"
            className="flex-1 bg-pink-500 text-white py-2 rounded disabled:bg-gray-300"
            disabled={uploading}
          >
            {uploading ? "수정 중..." : "수정 완료"}
          </button>
        </div>

        {uploadError && (
          <div className="mt-4 text-red-500 text-sm">{uploadError.message}</div>
        )}
      </form>
    </div>
  );
}
