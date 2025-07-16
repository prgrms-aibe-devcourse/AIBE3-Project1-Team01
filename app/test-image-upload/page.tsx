"use client";

import { useState } from "react";
import ImageUpload from "@/app/components/ImageUpload";
import { supabase } from "@/lib/supabase";

export default function TestImageUpload() {

  //이미지 파일 배열 상태 
  const [images, setImages] = useState<File[]>([]);
  
  //미리보기 이미지 상태 
  const [previewImages, setPreviewImages] = useState<string[]>([]);

  //로딩 상태 
  const [isUploading, setIsUploading] = useState(false);

  //업로드된 이미지 URL 상태 
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([]);

  //파일 선택 이벤트 처리 
  const handleChange = (newFiles: File[], newPreviews: string[]) => {
    setImages(newFiles);
    setPreviewImages(newPreviews);
  };

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
    // split과 pop으로 확장자 꺼내기, 없으면 jpg로 처리 
    const extension = originalFile.name.split(".").pop()?.toLowerCase() || "jpg";

    // 현재 시간 가져오기(파일이름 생성을 위해)
    const timestamp = Date.now();

    // 랜덤 문자열 생성(파일이름 생성을 위해)
    const randomString = Math.random().toString(36).substring(2, 10);

    // 안전한 파일이름 생성성
    return `${timestamp}-${randomString}.${extension}`;
  };

  // 스토리지 업로드 처리 
  const handleUpload = async () => {
    if (images.length === 0) {
      alert("업로드할 이미지가 없습니다.");
      return;
    }

    setIsUploading(true);
    const uploaded: string[] = []; //업로드 완료된 이미지들의 공개 URL 저장하는 배열

    const tempReviewId = 999; //임시 리뷰 아이디 

    //파일 하나씩 꺼내기 (순서 저장을 위해 for-of문이 아니라 for문 사용)
    for(let i = 0; i < images.length; i++) {
      const file = images[i]; //파일 하나 꺼내기
      const safeFileName = generateSafeFileName(file); //안전한 파일명 생성

      //버킷에 이미지 업로드
      const { data, error } = await supabase.storage 
        .from("images")
        .upload(safeFileName, file);

      //에러 처리
      if(error) {
        alert(`업로드 실패: ${error.message}`);
        setIsUploading(false);
        return;
      }

      //공개 URL 얻기
      const { data: urlData } = supabase.storage
        .from("images")
        .getPublicUrl(safeFileName);

      //없으면 넘어가기
      if(!urlData?.publicUrl) continue;

      //있으면 공개 URL 저장
      const imageUrl = urlData.publicUrl;
      uploaded.push(imageUrl);
      
      //images테이블에 이미지 저장
      const {error : insertError} = await supabase.from("images").insert({
        review_id: tempReviewId,
        img_url: imageUrl,
        order: i,
        place: null
    });
}

    //업로드된 이미지들 공개 URL 상태에 추가 
    setUploadedUrls(uploaded);

    //상태 초기화 
    setImages([]);
    setPreviewImages([]);

    alert("모든 이미지 업로드 성공!");
    setIsUploading(false);
  };

  return (
    <div className="max-w-xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-6">🧪 이미지 업로드 테스트</h1>

      {/** 이미지 업로드 컴포넌트 가져오기 */}
      <ImageUpload
        images={images}
        previewImages={previewImages}
        onChange={handleChange}
        onRemove={handleRemove}
      />

      {/** 업로드 버튼 */}
      <button
        onClick={handleUpload}
        disabled={isUploading || images.length === 0}
        className="mt-4 w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 disabled:bg-gray-300"
      >
        {isUploading ? "업로드 중..." : "업로드 제출"}
      </button>

      <pre className="text-xs mt-6 bg-gray-100 p-3 rounded">
        선택된 파일 수: {images.length}
      </pre>

      {/** 업로드된 이미지들 표시 */}
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

