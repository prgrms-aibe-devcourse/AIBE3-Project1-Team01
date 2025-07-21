"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import LoginModal from "../login/LoginModal";
import SignupModal from "../signup/SignupModal";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/navigation";

/*
Header에서의 기능은 다음과 같습니다
1. 로그인 or 회원가입 창 띄우기
2. 로딩 시 로딩 중으로 띄워주기
*/

export default function Header() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false); //로그인 창을 띄워야 하는 경우 사용
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false); //회원가입 창을 띄워야 하는 경우 사용
  const { user, isLoading, handleLogout } = useAuth();
  const router = useRouter();

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
      <header className="w-full bg-[#F6EFEF] border-b sticky top-0 z-40 py-6 shadow-sm">
        <div
          className="container mx-auto px-6 flex items-center justify-between relative"
          style={{ height: 60 }}
        >
          {/* 1️⃣ 로고 (왼쪽) */}
          <div className="flex-none flex items-center h-[80px]">
            <Link href="/">
              <Image
                src="/images/h1trip-logo2.png"
                alt="h1 Trip"
                width={200}
                height={100}
                className="object-contain cursor-pointer"
              />
            </Link>
          </div>

          {/* 2️⃣ 메뉴 (가운데, px-4 로 여백 확보)  */}
          <nav className="hidden lg:flex w-full mx-auto items-center justify-center gap-20 font-semibold px-4 text-lg">
            <button
              className="whitespace-nowrap text-[#413D3D] hover:text-[#B2DAD9] transition-colors"
              onClick={() =>
                user ? router.push("/plans") : setIsLoginModalOpen(true)
              }
            >
              계획 세우기
            </button>
            <Link
              href="/reviews"
              className="whitespace-nowrap text-[#413D3D] hover:text-[#B2DAD9] transition-colors"
            >
              여행 후기
            </Link>
            <Link
              href="/recommendation"
              className="whitespace-nowrap text-[#413D3D] hover:text-[#B2DAD9] transition-colors"
            >
              장소 추천
            </Link>
          </nav>

          {/* 3️⃣ 유저 영역 (고정 w-[220px], space-x-4) */}
          <div className="flex-none flex justify-end items-center space-x-4 w-[220px]">
            {user ? (
              <>
                <span
                  className="text-sm text-[#413D3D] whitespace-normal break-words"
                  style={{ maxWidth: 140 }}
                >
                  안녕하세요, {user.email.split("@")[0]}님
                </span>
                <button
                  onClick={handleLogout}
                  className="whitespace-nowrap flex-shrink-0 px-4 py-1.5 rounded-full font-medium text-base border-2 bg-[#C9E6E5] border-[#7FC4C9] hover:bg-[#B2DAD9] transition-all duration-200"
                >
                  Log Out
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsLoginModalOpen(true)}
                className="whitespace-nowrap flex-shrink-0 px-4 py-1.5 rounded-full font-medium text-base border-2 bg-[#C9E6E5] border-[#7FC4C9] hover:bg-[#B2DAD9] transition-all duration-200"
              >
                Log In
              </button>
            )}
          </div>
        </div>

        {/* 로그인/회원가입 모달 */}
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
      </header>
    </>
  );
}
