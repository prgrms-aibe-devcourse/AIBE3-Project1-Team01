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
  const { handleLogIn, handleLogInWithGoogle } = useAuth();
  const router = useRouter();

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    const { error } = await handleLogInWithGoogle();
    setIsLoading(false);

    if (error) {
      setErrorMsg("구글 로그인에 실패했습니다.");
    }
  };

  const handleOnSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setIsLoading(true);
    e.preventDefault();
    const { error } = await handleLogIn(email, password); // 로그인
    setIsLoading(false);

    //에러 처리
    if (error) {
      setEmail("");
      setPassword("");
      setErrorMsg("이메일 또는 비밀번호가 일치하지 않습니다.");
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
      <div className="bg-[#F6EFEF] rounded-3xl shadow-2xl w-full max-w-md p-8 relative animate-in fade-in duration-300">
        <div className="relative w-full h-[180px] mb-8">
          <div
            className="absolute inset-0 bg-center bg-no-repeat bg-contain"
            style={{ backgroundImage: "url('/images/h1trip-logo.png')" }}
          />

          {/* 버튼 */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 cursor-pointer z-20"
          >
            <i className="ri-close-line text-xl"></i>
          </button>

          {/* 글자: 배경 위에 올라가도록 absolute + z-index */}
          <div className="absolute inset-x-0 bottom-0 text-center">
            <p className="text-[#413D3D]">여행 계획을 시작해보세요!</p>
          </div>
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
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#F4CCC4] transition-colors"
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
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#F4CCC4] transition-colors"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#F4CCC4] text-white py-3 rounded-xl font-medium hover:brightness-105 transition-all duration-300 whitespace-nowrap cursor-pointer flex items-center justify-center"
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

          {/* or 구분선 */}
          <div className="flex items-center my-4">
            <div className="flex-grow border-t border-solid border-gray-400"></div>
            <span className="mx-3 text-gray-600 font-medium">or</span>
            <div className="flex-grow border-t border-solid border-gray-400"></div>
          </div>

          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 py-3 rounded-xl font-medium shadow hover:bg-gray-50 transition-all duration-300 mb-2"
            disabled={isLoading}
          >
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google"
              className="w-5 h-5"
            />
            <span>Google로 로그인</span>
          </button>

          {onSignup && (
            <button
              onClick={onSignup}
              className="text-[#7FC4C9] hover:text-[#B2DAD9] transition-colors cursor-pointer block mx-auto mt-6"
            >
              아직 계정이 없으신가요? 회원가입
            </button>
          )}
        </form>
      </div>
    </div>
  );
}
