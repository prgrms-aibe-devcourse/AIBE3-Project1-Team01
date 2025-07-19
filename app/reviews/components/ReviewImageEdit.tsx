/**
 * 리뷰 이미지 수정 폼
 * - 기존 이미지 수정/삭제
 * - 새 이미지 추가
 * - 커버 이미지 선택
 */
import React, { useState } from "react";
import ReviewModal from "./ReviewModal";

interface ExistingImage {
  url: string;
  order: number;
  is_cover: boolean;
}

interface ReviewImageEditProps {
  // 기존 이미지
  existingImages: ExistingImage[];
  onExistingImageDelete: (index: number) => void;
  onExistingImageReplace: (index: number, file: File) => void;
  onExistingImageCoverChange: (index: number) => void;
  deletedIndexes: number[];
  replacementPreviews: Record<number, string>;

  // 새 이미지
  newFiles: File[];
  newPreviews: string[];
  onNewImageAdd: (files: File[]) => void;
  onNewImageDelete: (index: number) => void;
  onNewImageCoverChange: (index: number) => void;
  newCoverImageIndex: number | null;

  disabled?: boolean;
}

export default function ReviewImageEdit({
  // 기존 이미지
  existingImages,
  onExistingImageDelete,
  onExistingImageReplace,
  onExistingImageCoverChange,
  deletedIndexes,
  replacementPreviews,
  // 새 이미지
  newFiles,
  newPreviews,
  onNewImageAdd,
  onNewImageDelete,
  onNewImageCoverChange,
  newCoverImageIndex,
  disabled = false,
}: ReviewImageEditProps) {
  // 새 이미지 추가 핸들러
  const handleNewImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    // 전체 이미지 개수 체크 (기존 이미지 + 새 이미지 합쳐서 5개로 올라가도록)
    const totalExistingImages = existingImages.length - deletedIndexes.length;
    const totalNewImages = newFiles.length;
    const totalImages = totalExistingImages + totalNewImages;

    if (totalImages + files.length > 5) {
      setModal({
        title: "이미지는 최대 5장까지 업로드 가능합니다.",
        detail: `현재 ${totalImages + files.length}장`,
      }); // 모달 교체 완료
      return;
    }

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

  //모달 상태 
  const [modal, setModal] = useState<{
    title: string;
    detail: string;
  } | null>(null);

  return (
    <div className="mb-8">
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        사진 업로드 (최대 5장)
      </label>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
        {/* 기존 이미지 섹션 */}
        {existingImages.map((img, index) =>
          deletedIndexes.includes(index) ? null : (
            <div key={index} className="relative group">
              <img
                src={replacementPreviews[index] || img.url}
                alt={`미리보기 ${index + 1}`}
                className={`w-full h-24 object-cover rounded-lg ${
                  img.is_cover ? 'ring-2 ring-pink-500' : ''
                }`}
              />
              <div className="absolute -top-2 -right-2 flex gap-1">
                {/* 커버 이미지 선택 버튼 */}
                <button
                  type="button"
                  onClick={() => onExistingImageCoverChange(index)}
                  className={`w-6 h-6 ${
                    img.is_cover 
                      ? 'bg-pink-500' 
                      : 'bg-gray-500 hover:bg-pink-400'
                  } text-white rounded-full text-xs transition-colors cursor-pointer flex items-center justify-center`}
                  disabled={disabled}
                  title={img.is_cover ? '커버 이미지' : '커버 이미지로 설정'}
                >
                  ★
                </button>
                {/* 이미지 교체 버튼 */}
                <label className="w-6 h-6 bg-blue-500 text-white rounded-full text-xs hover:bg-blue-600 transition-colors cursor-pointer flex items-center justify-center">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleExistingImageReplace(index)}
                    disabled={disabled}
                  />
                  ↺
                </label>
                {/* 삭제 버튼 */}
                <button
                  type="button"
                  onClick={() => onExistingImageDelete(index)}
                  className="w-6 h-6 bg-red-500 text-white rounded-full text-xs hover:bg-red-600 transition-colors cursor-pointer flex items-center justify-center"
                  disabled={disabled}
                >
                  ×
                </button>
              </div>
            </div>
          )
        )}

        {/* 새 이미지 섹션 */}
        {newPreviews.map((preview, index) => (
          <div key={`new-${index}`} className="relative group">
            <img
              src={preview}
              alt={`새 이미지 미리보기 ${index + 1}`}
              className={`w-full h-24 object-cover rounded-lg ${
                newCoverImageIndex === index ? 'ring-2 ring-pink-500' : ''
              }`}
            />
            <div className="absolute -top-2 -right-2 flex gap-1">
              {/* 커버 이미지 선택 버튼 */}
              <button
                type="button"
                onClick={() => onNewImageCoverChange(index)}
                className={`w-6 h-6 ${
                  newCoverImageIndex === index 
                    ? 'bg-pink-500' 
                    : 'bg-gray-500 hover:bg-pink-400'
                } text-white rounded-full text-xs transition-colors cursor-pointer flex items-center justify-center`}
                disabled={disabled}
                title={newCoverImageIndex === index ? '커버 이미지' : '커버 이미지로 설정'}
              >
                ★
              </button>
              {/* 삭제 버튼 */}
              <button
                type="button"
                onClick={() => onNewImageDelete(index)}
                className="w-6 h-6 bg-red-500 text-white rounded-full text-xs hover:bg-red-600 transition-colors cursor-pointer flex items-center justify-center"
                disabled={disabled}
              >
                ×
              </button>
            </div>
          </div>
        ))}

        {/* 이미지 추가 버튼 */}
        {existingImages.length - deletedIndexes.length + newFiles.length < 5 && (
          <label className="border-2 border-dashed border-gray-300 rounded-lg h-24 flex flex-col items-center justify-center cursor-pointer hover:border-pink-300 transition-colors">
            <i className="ri-camera-line text-xl text-gray-400 mb-1"></i>
            <span className="text-xs text-gray-500">사진 추가</span>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleNewImagesChange}
              className="hidden"
              disabled={disabled}
            />
          </label>
        )}
      </div>

      <p className="text-xs text-gray-500">
        JPG, PNG 파일만 업로드 가능합니다. (각 파일 최대 5MB)
      </p>
      <p className="text-xs text-gray-500 mt-1">
        ★ 버튼을 클릭하여 커버 이미지를 선택해주세요.
      </p>

      {modal && (
        <ReviewModal
          title={modal.title}
          detail={modal.detail}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
} 