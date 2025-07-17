/**
 * Supabase 이미지 업로드 및 DB 저장
 * 1. 안전한 파일명 생성
 * 2. 버킷에 업로드
 * 3. 공개 URL 추출
 * 4. images 테이블에 저장
 */
import { supabase } from "../../../lib/supabase";

// 안전한 파일명 생성 
function generateSafeFileName(originalFile: File): string {
  const extension = originalFile.name.split(".").pop()?.toLowerCase() || "jpg"; //확장자 추출 없으면 jpg 
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 10);
  return `${timestamp}-${randomString}.${extension}`; //현재 시간 + 랜덤 문자열로 파일명 생성 
}

//supabase 연동 함수  
export async function uploadImagesToSupabase(files: File[], reviewId: number): Promise<string[]> {

  const uploaded: string[] = []; //버킷에 업로드 완료된 이미지들의 공개 url 저장 -> 리뷰 등록 후 이미지 잘 올라갔는지 확인하기 위함! 추후에 제거 예정 

  //이미지 배열에서 하나씩 꺼내서 저장 
  for (let i = 0; i < files.length; i++) {
    const file = files[i]; // 파일 하나 꺼내기
    const safeFileName = generateSafeFileName(file); // 안전한 파일명 생성

    //Supabase 스토리지 버킷에 이미지 업로드
    const { data, error } = await supabase.storage
      .from("images")
      .upload(safeFileName, file);
    if (error) {
      throw new Error(`이미지 업로드 실패: ${error.message}`);
    }

    //공개 URL 얻기
    const { data: urlData } = supabase.storage
      .from("images")
      .getPublicUrl(safeFileName);
    if (!urlData?.publicUrl) continue;
    const imageUrl = urlData.publicUrl;
    uploaded.push(imageUrl);

    //images 테이블에 이미지 정보 저장
    const { error: insertError } = await supabase.from("images").insert({
      review_id: reviewId,
      img_url: imageUrl,
      order: i,
      place: null, // 추후 장소 정보 추가 가능, 우선은 null
    });
    if (insertError) {
      throw new Error(`이미지 DB 저장 실패: ${insertError.message}`);
    }
  }
  return uploaded;
} 