import React, { useEffect } from "react";

interface ReviewModalProps {
    title: string;
    detail: string;
    duration?: number;
    onClose: () => void;
}

export default function ReviewModal({
    title,
    detail,
    duration = 3000,
    onClose,
    }: ReviewModalProps) {
    useEffect(() => {
        const timer = setTimeout(onClose, duration);
        return () => clearTimeout(timer);
    }, [duration, onClose]);

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-[#F6EFEF] rounded-3xl shadow-2xl max-w-md w-full p-8 text-center text-[#413D3D]">
            <p className="text-lg font-semibold mb-2">{title}</p>
            <p className="text-sm text-gray-600">{detail}</p>
        </div>
        </div>
    );
}
  
