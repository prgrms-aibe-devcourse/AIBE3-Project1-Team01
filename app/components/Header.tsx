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
    return (
      <header
        className="w-full border-b border-pink-100 sticky top-0 z-40 py-6 shadow-sm"
        style={{
          backgroundColor: "#F6EFEF",
          boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
        }}
      >
        <div className="container mx-auto px-6 flex items-center justify-between animate-pulse">
          {/* 로고 자리 */}
          <div className="w-[160px] h-[48px] bg-[#E0E0E0] rounded-md" />

          {/* 메뉴 자리 */}
          <div className="hidden md:flex gap-12">
            <div className="w-[60px] h-[20px] bg-[#E0E0E0] rounded" />
            <div className="w-[80px] h-[20px] bg-[#E0E0E0] rounded" />
            <div className="w-[70px] h-[20px] bg-[#E0E0E0] rounded" />
          </div>

          {/* 버튼 자리 */}
          <div className="w-[80px] h-[36px] bg-[#E0E0E0] rounded-full" />
        </div>
      </header>
    );
  }

  return (
    <>
      <header
        className="w-full border-b border-pink-100 sticky top-0 z-40 py-6 shadow-sm"
        style={{
          backgroundColor: "#F6EFEF",
          boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
        }}
      >
        <div
          className="container mx-auto px-6 flex items-center justify-between"
          style={{ height: "60px" }} // 헤더 내부 높이 고정
        >
          <div
            className="flex items-center relative"
            style={{ height: "80px" }}
          >
            <Link href="/">
              <Image
                src="/images/h1trip-logo2.png"
                alt="h1 Trip"
                width={160}
                height={80} // 헤더보다 큰 로고 높이
                className="object-contain cursor-pointer"
              />
            </Link>
          </div>

          <nav className="hidden md:flex items-center font-semibold gap-8 lg:gap-12 xl:gap-16 absolute left-1/2 transform -translate-x-1/2">
            <Link
              href="/plans/list"
              className="text-[#413D3D] hover:text-[#B2DAD9] transition-colors cursor-pointer text-lg"
            >
              내 일정
            </Link>
            <Link
              href="/reviews"
              className="text-[#413D3D] hover:text-[#B2DAD9] transition-colors cursor-pointer text-lg"
            >
              여행 후기
            </Link>
            <Link
              href="/recommendation" // <-- 이동하고자 하는 페이지 경로 (예: /recommendation)
              className="text-[#413D3D] hover:text-[#B2DAD9] transition-colors cursor-pointer text-lg"
            >
              장소 추천
            </Link>
          </nav>

          <div className="flex items-center space-x-10 z-10">
            {user ? (
              <>
                <span className="text-sm text-[#413D3D] whitespace-nowrap">
                  안녕하세요,
                  <br />
                  {user.email}님
                </span>
                <button
                  onClick={() => handleLogout()}
                  className="px-5 py-2 rounded-full font-medium text-lg border text-[#333] bg-[#C9E6E5] border-[#7FC4C9] hover:bg-[#B2DAD9] transition-all duration-200 shadow-sm active:translate-y-[1px]"
                >
                  Logout
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsLoginModalOpen(true)}
                className="px-4 py-1.5 rounded-full font-medium text-base border-[3px] text-[#333] bg-[#C9E6E5] border-[#7FC4C9] hover:bg-[#B2DAD9] transition-all duration-200 shadow-sm active:translate-y-[1px]"
              >
                Login
              </button>
            )}
          </div>
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
