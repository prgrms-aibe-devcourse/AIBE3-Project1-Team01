'use client';

import React from 'react';

interface AlertModalProps {
  isOpen: boolean;
  message: string;
  onClose?: () => void;
  onConfirm?: () => void;
  confirmText?: string;
  cancelText?: string;
  showCancel?: boolean;
}

export default function AlertModal({
  isOpen,
  message,
  onClose,
  onConfirm,
  confirmText = '확인',
  cancelText = '취소',
  showCancel = false,
}: AlertModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 shadow-xl max-w-sm w-full text-center">
        <h2 className="text-lg font-semibold mb-4">알림</h2>
        <p className="text-gray-700">{message}</p>
        <div className="mt-6 flex justify-center gap-4">
          {showCancel && (
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-200 text-gray-700 rounded-full font-semibold hover:opacity-80"
            >
              {cancelText}
            </button>
          )}
          <button
            onClick={onConfirm || onClose}
            className="px-6 py-2 bg-[#F4CCC4] text-[#2B2323] rounded-full font-semibold hover:opacity-90"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}