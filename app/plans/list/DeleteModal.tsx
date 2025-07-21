import React from "react";

type DeleteModalProps = {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function DeleteModal({ open, onConfirm, onCancel }: DeleteModalProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
      <div className="bg-white rounded-xl p-8 shadow-lg text-center">
        <p className="mb-6 text-lg font-semibold">정말 삭제하시겠습니까?</p>
        <div className="flex gap-4 justify-center">
          <button
            className="px-6 py-2 rounded bg-[#F4CCC4] text-[#413D3D] font-semibold"
            onClick={onConfirm}
          >
            삭제
          </button>
          <button
            className="px-6 py-2 rounded bg-gray-200 text-gray-700 font-semibold"
            onClick={onCancel}
          >
            취소
          </button>
        </div>
      </div>
    </div>
  );
}
