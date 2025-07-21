/**
 * 후기 내용 입력 상태 및 로직 커스텀 훅
 * - 제목, 지역, 평점, 본문 상태 관리
 * - 입력값 변경, 초기화, 유효성 검사 등 제공
 */
import { useState } from "react";
import { ReviewContentData } from "../components/ReviewContentForm";

export function useReviewContent(initial?: ReviewContentData) {
  
  // 후기 내용 상태
  const [form, setForm] = useState<ReviewContentData>(
    initial || { title: "", region: "", region_city: "", rating: 5, content: "" }
  );

  // 입력값 변경 핸들러
  const handleChange = (
    field: keyof ReviewContentData,
    value: string | number
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  // 상태 초기화
  const reset = () => {
    setForm(initial || { title: "", region: "", region_city: "", rating: 5, content: "" });
  };

  // 유효성 검사
  const validate = () => {
    if (!form.title.trim() || !form.region || !form.content.trim()) {
      return "모든 필수 항목을 입력해주세요.";
    }
    if (form.content.length > 500) {
      return "후기 내용은 500자를 초과할 수 없습니다.";
    }
    return null;
  };

  return { form, setForm, handleChange, reset, validate };
}
