/**
 * Supabase 이미지 수정 관련 유틸리티 함수
 */
import { supabase } from "../../../lib/supabase";
import { generateImageFileName, uploadImageToStorage } from "./imageUtils";

interface ExistingImage {
  url: string;
  order: number;
}

// 이미지 삭제 (스토리지 + DB)
export async function deleteImage(reviewId: number, image: ExistingImage) {
  // 스토리지 삭제
  const fileName = image.url.split("/").pop();
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
    .filter('"order"', "eq", image.order);
  if (dbDeleteErr) throw new Error(dbDeleteErr.message);
}

// 이미지 교체 (기존 삭제 + 새 이미지 업로드)
export async function replaceImage(
  reviewId: number,
  oldImage: ExistingImage,
  newFile: File
) {
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
  const fileName = generateImageFileName(newFile, `${reviewId}-replace-${oldImage.order}-`);
  const newUrl = await uploadImageToStorage(newFile, fileName);

  // DB img_url 업데이트
  const { error: updateError } = await supabase
    .from("images")
    .update({ img_url: newUrl })
    .eq("review_id", reviewId)
    .filter('"order"', "eq", oldImage.order);
  if (updateError) throw new Error(updateError.message);

  return newUrl;
}

// 새 이미지 업로드 및 순서 재할당
export async function updateImagesOrder(
  reviewId: number,
  remainingExistingImages: ExistingImage[],
  newFiles: File[]
) {
  // 새 이미지 업로드
  const uploadedUrls: string[] = [];
  for (let i = 0; i < newFiles.length; i++) {
    const file = newFiles[i];
    const fileName = generateImageFileName(file, `${reviewId}-new-${i}-`);
    const imageUrl = await uploadImageToStorage(file, fileName);
    uploadedUrls.push(imageUrl);
  }

  // 기존+새 이미지 합쳐서 order 0부터 일괄 재할당
  const allImages = [
    ...remainingExistingImages.map((img) => ({ ...img, isNew: false })),
    ...uploadedUrls.map((url) => ({ url, isNew: true })),
  ];

  // 0번부터 order 재할당
  for (let i = 0; i < allImages.length; i++) {
    const img = allImages[i];
    if (img.isNew) {
      // 새 이미지 DB insert (order: i)
      const { error: insertError } = await supabase.from("images").insert({
        review_id: reviewId,
        img_url: img.url,
        order: i,
      });
      if (insertError) throw new Error(insertError.message);
    } else {
      // 기존 이미지 DB update (order: i)
      if ((img as any).order !== i) {
        const { error } = await supabase
          .from("images")
          .update({ order: i })
          .eq("review_id", reviewId)
          .filter('"order"', "eq", (img as any).order);
        if (error) throw new Error(error.message);
      }
    }
  }

  return uploadedUrls;
} 