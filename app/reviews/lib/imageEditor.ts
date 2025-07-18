/**
 * Supabase 이미지 수정
 */
import { supabase } from "../../../lib/supabase";
import { generateImageFileName, uploadImageToStorage } from "./imageUtils";

// 기존 이미지 -> 순서 정렬을 위해서 url 뿐만 아니라 order, is_cover 도 필요
interface ExistingImage {
  url: string;
  order: number;
  is_cover?: boolean;
}

interface ImageWithNewFlag extends ExistingImage {
  isNew: boolean;
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
  // 기존 파일 삭제(스토리지)
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

  // DB img_url 업데이트 (is_cover 상태 유지)
  const { error: updateError } = await supabase
    .from("images")
    .update({ img_url: newUrl })
    .eq("review_id", reviewId)
    .filter('"order"', "eq", oldImage.order);
  if (updateError) throw new Error(updateError.message);

  return newUrl;
}

// 이미지 커버 상태 업데이트
export async function updateImageCover(reviewId: number, order: number) {
  // 1) 기존 커버 이미지가 있다면 is_cover를 false로 설정
  const { error: resetError } = await supabase
    .from("images")
    .update({ is_cover: false })
    .eq("review_id", reviewId)
    .eq("is_cover", true);
  
  if (resetError) throw new Error(resetError.message);

  // 2) 새로운 커버 이미지 설정
  const { error: updateError } = await supabase
    .from("images")
    .update({ is_cover: true })
    .eq("review_id", reviewId)
    .filter('"order"', "eq", order);
  
  if (updateError) throw new Error(updateError.message);
}

// 새 이미지 업로드 및 순서 재할당
export async function updateImagesOrder(
  reviewId: number,
  remainingExistingImages: ExistingImage[],
  newFiles: File[],
  newCoverImageIndex: number | null
) {
  // 새 이미지 업로드(스토리지)
  const uploadedUrls: string[] = [];
  for (let i = 0; i < newFiles.length; i++) {
    const file = newFiles[i];
    const fileName = generateImageFileName(file, `${reviewId}-new-${i}-`);
    const imageUrl = await uploadImageToStorage(file, fileName);
    uploadedUrls.push(imageUrl);
  }

  // 기존+새 이미지 합쳐서 order 0부터 일괄 재할당
  const allImages: ImageWithNewFlag[] = [
    ...remainingExistingImages.map((img) => ({ ...img, isNew: false })),
    ...uploadedUrls.map((url, idx) => ({ 
      url, 
      order: remainingExistingImages.length + idx,
      isNew: true 
    })),
  ];

  // 기존 커버 이미지 찾기
  const existingCoverImage = remainingExistingImages.find(img => img.is_cover);

  // 0번부터 order 재할당
  for (let i = 0; i < allImages.length; i++) {
    const img = allImages[i];
    if (img.isNew) {
      // 새 이미지 DB insert (order: i)
      const { error: insertError } = await supabase.from("images").insert({
        review_id: reviewId,
        img_url: img.url,
        order: i,
        is_cover: newCoverImageIndex !== null && i === (remainingExistingImages.length + newCoverImageIndex),
      });
      if (insertError) throw new Error(insertError.message);
    } else {
      // 기존 이미지 DB update (order: i)
      const oldOrder = img.order;
      const isCover = existingCoverImage ? oldOrder === existingCoverImage.order : false;
      
      if (oldOrder !== i || isCover) {
        const { error } = await supabase
          .from("images")
          .update({ 
            order: i,
            is_cover: isCover && newCoverImageIndex === null // 새로운 커버 이미지가 선택되지 않은 경우에만 기존 커버 상태 유지
          })
          .eq("review_id", reviewId)
          .filter('"order"', "eq", oldOrder);
        if (error) throw new Error(error.message);
      }
    }
  }

  return uploadedUrls;
} 