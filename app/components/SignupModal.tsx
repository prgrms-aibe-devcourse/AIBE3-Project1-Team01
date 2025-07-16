"use client";
/*
 */
import React, { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
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
  const router = useRouter();

  const isPasswordMismatch =
    Boolean(password) &&
    Boolean(confirmPassword) &&
    password !== confirmPassword;

  const handleOnSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setIsLoading(true);
    e.preventDefault();
    const { error } = await supabase.auth.signUp({ email, password });
    setIsLoading(false);
    if (error) {
      alert(error.message);
      console.log(error);
    } else {
      alert("회원 가입 성공");
      onClose();
      router.push("/");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 relative animate-in fade-in duration-300">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 cursor-pointer"
        >
          <i className="ri-close-line text-xl"></i>
        </button>
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">회원가입</h2>
          <p className="text-gray-500">새로운 여행 친구가 되어주세요!</p>
        </div>
        <form className="space-y-4" onSubmit={handleOnSubmit}>
          <div>
            <input
              type="email"
              placeholder="이메일"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-pink-300 transition-colors"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
          <div>
            <input
              type="password"
              placeholder="비밀번호 확인"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-pink-300 transition-colors"
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
            className="w-full bg-gradient-to-r from-pink-400 to-purple-400 text-white py-3 rounded-xl font-medium hover:from-pink-500 hover:to-purple-500 transition-all duration-300 whitespace-nowrap cursor-pointer"
            disabled={isPasswordMismatch || isLoading}
          >
            {isLoading ? "로딩 중..." : "회원가입"}
          </button>
          {onLogin && (
            <div className="text-center mt-6">
              <button
                onClick={onLogin}
                className="text-pink-400 hover:text-pink-600 transition-colors cursor-pointer"
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
