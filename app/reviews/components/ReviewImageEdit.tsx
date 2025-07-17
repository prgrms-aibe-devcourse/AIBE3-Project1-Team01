/**
 * 리뷰 이미지 수정 폼
 * - 기존 이미지 수정/삭제
 * - 새 이미지 추가
 */
import React from "react";

interface ExistingImage {
  url: string;
  order: number;
}

interface ReviewImageEditProps {
  // 기존 이미지
  existingImages: ExistingImage[];
  onExistingImageDelete: (index: number) => void;
  onExistingImageReplace: (index: number, file: File) => void;
  deletedIndexes: number[];
  replacementPreviews: Record<number, string>;

  // 새 이미지
  newFiles: File[];
  newPreviews: string[];
  onNewImageAdd: (files: File[]) => void;
  onNewImageDelete: (index: number) => void;

  disabled?: boolean;
}

export default function ReviewImageEdit({
  // 기존 이미지
  existingImages,
  onExistingImageDelete,
  onExistingImageReplace,
  deletedIndexes,
  replacementPreviews,
  // 새 이미지
  newFiles,
  newPreviews,
  onNewImageAdd,
  onNewImageDelete,
  disabled = false,
}: ReviewImageEditProps) {
  // 새 이미지 추가 핸들러
  const handleNewImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    onNewImageAdd(Array.from(files));
    e.target.value = "";
  };

  // 기존 이미지 교체 핸들러
  const handleExistingImageReplace = (index: number) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    onExistingImageReplace(index, file);
  };

  return (
    <div className="mt-6 space-y-6">
      {/* 기존 이미지 섹션 */}
      <div className="space-y-4">
        <h2 className="font-semibold">기존 이미지</h2>
        {existingImages.map((img, index) =>
          deletedIndexes.includes(index) ? null : (
            <div key={index} className="flex items-center gap-4">
              <img
                src={replacementPreviews[index] || img.url}
                alt={`미리보기 ${index + 1}`}
                className="w-32 h-32 object-cover rounded"
              />
              <div className="flex flex-col gap-2">
                <label className="text-sm text-blue-500 cursor-pointer">
                  이미지 교체
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleExistingImageReplace(index)}
                    disabled={disabled}
                  />
                </label>
                <button
                  type="button"
                  className="text-sm text-red-500"
                  onClick={() => onExistingImageDelete(index)}
                  disabled={disabled}
                >
                  삭제
                </button>
              </div>
            </div>
          )
        )}
      </div>

      {/* 새 이미지 섹션 */}
      <div>
        <h2 className="font-semibold">새 이미지 추가</h2>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleNewImagesChange}
          disabled={disabled}
          className="mt-2"
        />
        <div className="mt-4 flex flex-wrap gap-4">
          {newPreviews.map((preview, index) => (
            <div key={index} className="relative">
              <img
                src={preview}
                alt={`새 이미지 미리보기 ${index + 1}`}
                className="w-32 h-32 object-cover rounded"
              />
              <button
                type="button"
                onClick={() => onNewImageDelete(index)}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 text-xs flex items-center justify-center"
                disabled={disabled}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 