"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSignup?: () => void;
}

export default function LoginModal({
  isOpen,
  onClose,
  onSignup,
}: LoginModalProps) {
  const [email, setEmail] = useState(""); // 이메일
  const [password, setPassword] = useState(""); // 비밀번호
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(""); // 에러 메시지  처리
  const { handleLogIn } = useAuth();
  const router = useRouter();
  const handleOnSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setIsLoading(true);
    e.preventDefault();
    const { error } = await handleLogIn(email, password); // 로그인
    setIsLoading(false);

    //에러 처리
    if (error) {
      setEmail("");
      setPassword("");
    } else {
      setErrorMsg("");
      onClose();
      router.push("/");
      window.location.reload();
    }
  };

  if (!isOpen) return null;

  // 에러 메시지 초기화 후 모달 닫기
  const handleClose = () => {
    setErrorMsg("");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 relative animate-in fade-in duration-300">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 cursor-pointer"
        >
          <i className="ri-close-line text-xl"></i>
        </button>
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">로그인</h2>
          <p className="text-gray-500">여행 계획을 시작해보세요!</p>
        </div>
        {errorMsg && (
          <div className="text-red-500 text-sm text-center mb-4">
            {errorMsg}
          </div>
        )}
        <form className="space-y-4" onSubmit={handleOnSubmit}>
          <div>
            <input
              type="email"
              placeholder="이메일"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-pink-300 transition-colors"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              onInvalid={(e) => {
                e.preventDefault();
                setErrorMsg("이메일 또는 비밀번호가 올바르지 않습니다.");
                setEmail("");
                setPassword("");
              }}
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="비밀번호"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-pink-300 transition-colors"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-pink-400 to-purple-400 text-white py-3 rounded-xl font-medium hover:from-pink-500 hover:to-purple-500 transition-all duration-300 whitespace-nowrap cursor-pointer flex items-center justify-center"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 mr-2 inline-block"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  />
                </svg>
                로딩 중...
              </>
            ) : (
              "로그인"
            )}
          </button>
          {onSignup && (
            <div className="text-center mt-6">
              <button
                onClick={onSignup}
                className="text-pink-400 hover:text-pink-600 transition-colors cursor-pointer"
              >
                아직 계정이 없으신가요? 회원가입
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
