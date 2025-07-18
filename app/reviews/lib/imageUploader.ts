/**
 * Supabase 이미지 업로드
 */
import { supabase } from "../../../lib/supabase";
import { generateImageFileName, uploadImageToStorage } from "./imageUtils";

export async function uploadImagesToSupabase(
  files: File[],
  reviewId: number,
  coverImageIndex: number | null
): Promise<string[]> {
  const uploaded: string[] = [];

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const fileName = generateImageFileName(file, `${reviewId}-`);
    const imageUrl = await uploadImageToStorage(file, fileName);
    uploaded.push(imageUrl);

    const { error: insertError } = await supabase.from("images").insert({
      review_id: reviewId,
      img_url: imageUrl,
      order: i,
      is_cover: i === coverImageIndex, 
    });
    if (insertError) {
      throw new Error(`이미지 DB 저장 실패: ${insertError.message}`);
    }
  }
  return uploaded;
}
