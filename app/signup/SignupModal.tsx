"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import SignupSuccessModal from "./SignupSuccessModal";

interface SignupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin?: () => void;
}

export default function SignupModal({
  isOpen,
  onClose,
  onLogin,
}: SignupModalProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const router = useRouter();
  const { handleSignUp, handleLogInWithGoogle } = useAuth(); // ✅ 소셜 로그인 함수 추가

  const isPasswordMismatch =
    Boolean(password) &&
    Boolean(confirmPassword) &&
    password !== confirmPassword;

  const handleOnSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const emailRegex = /^[\w.-]+@[\w.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      setErrorMsg("올바른 이메일을 입력하세요.");
      setIsLoading(false);
      return;
    }
    if (password.length < 6) {
      setErrorMsg("비밀번호는 6자 이상이어야 합니다.");
      setIsLoading(false);
      return;
    }
    if (isPasswordMismatch) {
      setErrorMsg("");
      setIsLoading(false);
      return;
    }

    const { error } = await handleSignUp(email, password);
    setIsLoading(false);

    if (error) {
      setErrorMsg(error.message);
      setEmail("");
      setPassword("");
      setConfirmPassword("");
    } else {
      setErrorMsg("");
      setIsSuccess(true);
    }
  };

  // ✅ 구글 로그인 처리 함수
  const handleGoogleLogin = async () => {
    setIsLoading(true);
    const { error } = await handleLogInWithGoogle();
    setIsLoading(false);

    if (error) {
      setErrorMsg("구글 로그인에 실패했습니다.");
    }
  };

  if (!isOpen) return null;

  const handleClose = () => {
    setEmail("");
    setPassword("");
    setConfirmPassword("");
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

          {/* 닫기 버튼 */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 cursor-pointer z-20"
          >
            <i className="ri-close-line text-xl"></i>
          </button>

          <div className="absolute inset-x-0 bottom-0 text-center">
            <p className="text-[#413D3D]">여행 계획을 시작해보세요!</p>
          </div>
        </div>

        {/* ✅ 회원가입 성공 시 모달 */}
        <SignupSuccessModal
          isOpen={isSuccess}
          onClose={() => {
            setIsSuccess(false);
            onClose(); // 회원가입 모달 닫기
            if (onLogin) onLogin(); // 로그인 모달 띄우기
          }}
        />

        {errorMsg && (
          <div className="text-red-500 text-sm text-center mb-2">
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
              onInvalid={(e) => {
                e.preventDefault();
                setErrorMsg("올바른 이메일을 입력하세요.");
              }}
              required
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
          <div>
            <input
              type="password"
              placeholder="비밀번호 확인"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#F4CCC4] transition-colors"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          {isPasswordMismatch && (
            <div className="text-red-500 text-sm text-center mb-2">
              비밀번호가 일치하지 않습니다.
            </div>
          )}

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
              "회원가입"
            )}
          </button>

          {onLogin && (
            <div className="text-center mt-6">
              <button
                onClick={onLogin}
                className="text-[#7FC4C9] hover:text-[#B2DAD9] transition-colors cursor-pointer block mx-auto mt-6"
              >
                이미 계정이 있으신가요? 로그인
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
