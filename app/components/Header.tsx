"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import LoginModal from "../login/LoginModal";
import SignupModal from "../signup/SignupModal";
import { useAuth } from "@/context/AuthContext";

/*
Header에서의 기능은 다음과 같습니다
1. 로그인 or 회원가입 창 띄우기
2. 로딩 시 로딩 중으로 띄워주기
*/

export default function Header() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false); //로그인 창을 띄워야 하는 경우 사용
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false); //회원가입 창을 띄워야 하는 경우 사용
  const { user, isLoading, handleLogout } = useAuth();

  // 모달 전환 핸들러: 회원가입으로 전환
  const openSignup = () => {
    setIsLoginModalOpen(false);
    setIsSignupModalOpen(true);
  };

  // 모달 전환 핸들러: 로그인으로 전환
  const openLogin = () => {
    setIsSignupModalOpen(false);
    setIsLoginModalOpen(true);
  };

  //로딩 시 띄워 줄 리턴값
  if (isLoading) {
    return <>로딩 중...</>;
  }

  return (
    <>
      <header className="w-full bg-my-coral backdrop-blur-sm border-b border-pink-100 sticky top-0 z-40">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="relative w-[250px] h-[100px]">
              {" "}
              <Image
                src="h1trip-logo2.png"
                alt="h1 Trip"
                fill
                style={{ objectFit: "contain" }}
                className="cursor-pointer"
              />
            </Link>
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="/reviews"
              className="text-gray-700 hover:text-purple-600 transition-colors font-medium cursor-pointer"
            >
              여행 후기
            </Link>
            <Link
              href="/recommendation"
              className="text-gray-700 hover:text-purple-600 transition-colors font-medium cursor-pointer"
            >
              여행지 추천
            </Link>
          </nav>
          {/*로그인/로그아웃 표시 변경*/}
          {user ? (
            <>
              <span>안녕하세요, {user.email}님</span>
              <button
                onClick={() => handleLogout()}
                className="bg-gradient-to-r from-pink-300 to-purple-300 text-white px-6 py-2 rounded-full hover:from-pink-400 hover:to-purple-400 transition-all duration-300 font-medium shadow-md hover:shadow-lg whitespace-nowrap cursor-pointer"
              >
                로그아웃
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsLoginModalOpen(true)}
              className="bg-gradient-to-r from-pink-300 to-purple-300 text-white px-6 py-2 rounded-full hover:from-pink-400 hover:to-purple-400 transition-all duration-300 font-medium shadow-md hover:shadow-lg whitespace-nowrap cursor-pointer"
            >
              로그인
            </button>
          )}
        </div>
      </header>

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onSignup={openSignup}
      />
      <SignupModal
        isOpen={isSignupModalOpen}
        onClose={() => setIsSignupModalOpen(false)}
        onLogin={openLogin}
      />
    </>
  );
}
