// components/ImageUpload.tsx
'use client';
import { supabase } from '@/lib/supabase';
import { useRef } from 'react';

const BUCKET = "images"; //버킷 이름 

interface ImageUploadProps {
  images: File[]; //선택된 File 객체 배열
  previewImages: string[]; //미리보기용 URL 배열 (DataURL)
  onChange: (newFiles: File[], newPreviews: string[]) => void; // 변경되었을 때의 로직
  onRemove: (index: number) => void; // 제거되었을 때의 로직 
}

//내보내기~
export default function ImageUpload({
  images,
  previewImages,
  onChange,
  onRemove,
}: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  //이미지 선택 시 처리
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + images.length > 5) {
      alert('최대 5장까지 업로드 가능합니다.');
      return;
    }

    //선택한 이미지들 DataURL로 변환(미리보기용)
    const newPreviews: string[] = [];
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        newPreviews.push(e.target?.result as string);
        if (newPreviews.length === files.length) {
          onChange([...images, ...files], [...previewImages, ...newPreviews]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  return (
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
              onClick={() => onRemove(index)}
              className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full text-xs hover:bg-red-600 transition-colors cursor-pointer"
            >
              ×
            </button>
          </div>
        ))}

        {images.length < 5 && (
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
