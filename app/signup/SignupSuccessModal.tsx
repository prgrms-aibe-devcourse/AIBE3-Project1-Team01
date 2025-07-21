// components/SignupSuccessModal.tsx
import React from "react";

interface SignupSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SignupSuccessModal({
  isOpen,
  onClose,
}: SignupSuccessModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#F4CCC4] text-[#413D3D] rounded-3xl shadow-xl w-full max-w-sm p-6 text-center animate-in fade-in duration-300">
        <h2 className="text-xl font-semibold mb-2">회원가입 완료</h2>
        <p className="text-sm mb-4">
          이제 로그인하여 여행 계획을 시작해보세요.
        </p>
        <button
          onClick={onClose}
          className="bg-white text-[#F4CCC4] border border-white px-4 py-2 rounded-full hover:bg-[#ffe9e3] transition"
        >
          닫기
        </button>
      </div>
    </div>
  );
}
