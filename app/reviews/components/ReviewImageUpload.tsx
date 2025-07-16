import React, { useRef, useState } from "react";

export interface ReviewImageUploadData {
  files: File[];
  previews: string[];
}

interface ReviewImageUploadProps {
  value: ReviewImageUploadData;
  onChange: (data: ReviewImageUploadData) => void;
  disabled?: boolean;
}

export default function ReviewImageUpload({ value, onChange, disabled }: ReviewImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  // 이미지 선택
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + value.files.length > 5) {
      alert("최대 5장까지 업로드 가능합니다.");
      return;
    }
    const newPreviews: string[] = [];
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        newPreviews.push(e.target?.result as string);
        if (newPreviews.length === files.length) {
          onChange({
            files: [...value.files, ...files],
            previews: [...value.previews, ...newPreviews],
          });
        }
      };
      reader.readAsDataURL(file);
    });
  };

  // 이미지 제거
  const handleRemove = (index: number) => {
    const newFiles = [...value.files];
    const newPreviews = [...value.previews];
    newFiles.splice(index, 1);
    newPreviews.splice(index, 1);
    onChange({ files: newFiles, previews: newPreviews });
  };

  return (
    <div className="mb-8">
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        사진 업로드 (최대 5장)
      </label>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
        {value.previews.map((image, index) => (
          <div key={index} className="relative group">
            <img
              src={image}
              alt={`미리보기 ${index + 1}`}
              className="w-full h-24 object-cover rounded-lg"
            />
            <button
              type="button"
              onClick={() => handleRemove(index)}
              className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full text-xs hover:bg-red-600 transition-colors cursor-pointer"
              disabled={disabled}
            >
              ×
            </button>
          </div>
        ))}
        {value.files.length < 5 && (
          <label className="border-2 border-dashed border-gray-300 rounded-lg h-24 flex flex-col items-center justify-center cursor-pointer hover:border-pink-300 transition-colors">
            <i className="ri-camera-line text-xl text-gray-400 mb-1"></i>
            <span className="text-xs text-gray-500">사진 추가</span>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              ref={inputRef}
              disabled={disabled}
            />
          </label>
        )}
      </div>
      <p className="text-xs text-gray-500">
        JPG, PNG 파일만 업로드 가능합니다. (각 파일 최대 5MB)
      </p>
    </div>
  );
} 