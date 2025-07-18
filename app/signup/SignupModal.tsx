"use client";
/*
 */
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

//타입 소개
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
  const [email, setEmail] = useState(""); // 이메일
  const [password, setPassword] = useState(""); // 비밀번호
  const [confirmPassword, setConfirmPassword] = useState(""); //비밀번호 확인
  const [isLoading, setIsLoading] = useState(false); //로딩
  const [errorMsg, setErrorMsg] = useState(""); // 에러 메시지
  const router = useRouter();
  const { handleSignUp } = useAuth();

  // 비밀번호와 확인 시 비밀번호가 다른 경우 하단에 비밀번호가 일치하지 않는다는 경고글 띄움
  const isPasswordMismatch =
    Boolean(password) &&
    Boolean(confirmPassword) &&
    password !== confirmPassword;

  const handleOnSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setIsLoading(true);
    e.preventDefault();
    const emailRegex = /^[\w.-]+@[\w.-]+\.[a-zA-Z]{2,}$/;
    // 입력값 검증
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
      setErrorMsg(""); // 이미 아래에 안내가 있으므로 중복 안내 X
      setIsLoading(false);
      return;
    }
    const { error } = await handleSignUp(email, password); // 회원가입
    setIsLoading(false);

    //회원가입 시 에러 처리
    if (error) {
      setErrorMsg(error.message);
      setEmail("");
      setPassword("");
      setConfirmPassword("");
    } else {
      alert("회원 가입 성공");
      setErrorMsg("");
      onClose(); //성공 시 창 닫기
      if (onLogin) {
        onLogin(); // 로그인 모달 띄우기
      }
      router.push("/");
    }
  };

  if (!isOpen) return null;

  // 입력값 초기화 후 모달 닫기
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
          {/*비밀번호 일치 확인 & 로딩 시 로딩중으로 글자 변경 */}
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
