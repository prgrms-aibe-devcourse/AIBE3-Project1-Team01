"use client";

import React from "react";

interface ConfirmModalProps {
  title: string;
  detail: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ReviewConfirmModal({
  title,
  detail,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#F6EFEF] rounded-3xl shadow-2xl max-w-md w-full p-8 text-center text-[#413D3D]">
        <p className="text-lg font-semibold mb-2">{title}</p>
        <p className="text-sm text-gray-600 mb-6">{detail}</p>
        <div className="flex justify-center gap-4">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-full border border-gray-300 text-sm text-[#413D3D] bg-white hover:bg-gray-100"
          >
            취소
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-full bg-[#F4CCC4] text-[#413D3D] text-sm hover:bg-[#cc9288]"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
}
