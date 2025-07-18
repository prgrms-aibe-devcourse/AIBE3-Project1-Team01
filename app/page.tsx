"use client";

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import LoginModal from './login/LoginModal';
import Header from "@/app/components/Header";
import PopularDestinations from "@/app/components/PopularDestinations";
import Link from "next/link";

export default function Home() {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

  const handlePlanClick = () => {
    if (user) {
      router.push('/plans');
    } else {
      setShowLoginModal(true);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F6EFEF] font-sans text-gray-800">
      {/* 헤더를 최상단 레이어로 */}
      <div className="fixed top-0 left-0 w-full z-30">
        <Header />
      </div>

      <main className="flex-1 pt-24">
        {/* Hero Section */}
        <section
          className="relative w-full bg-cover bg-center bg-no-repeat pt-[96px] h-[600px]"
          style={{
            backgroundImage:
              "url('/images/photo-1535189043414-47a3c49a0bed.avif')",
          }}
        >
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm z-0" />
          <div className="relative z-10 flex flex-col items-start justify-center text-left px-8 md:px-24 h-full">
            <h1 className="text-4xl md:text-5xl font-bold leading-snug text-white">
              <span className="text-[#7FC4C9]">완벽한 여행</span>
              <span className="text-white">
                을<br />
                계획해 주는 내 친구
              </span>
            </h1>
            <p className="mt-6 text-lg md:text-xl text-white max-w-xl font-medium">
              여행 준비의 복잡함은 덜고, 내 취향과 여행 스타일에 꼭 맞는
              <br></br>장소를 추천받아 설렘 가득한 여행을 시작하세요.
            </p>
            <Link href="/recommendation" passHref>
              {" "}
              {/* href 속성 추가 */}
              <button className="mt-8 bg-[#7FC4C9] hover:bg-[#5CAAB0] text-white font-semibold px-6 py-3 rounded-full transition shadow-md">
                나만의 장소 추천 &gt;
              </button>
            </Link>
          </div>
        </section>

        <PopularDestinations />

        <section
          id="features"
          className="container mx-auto px-6 py-20 text-center scroll-mt-16 text-[#413D3D]"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-1 tracking-tight text-[#413D3D]">
            주요 기능
          </h2>
          <p className="text-base md:text-lg text-[#413D3D] leading-relaxed mb-12">
            나만의 여행, 나답게, 특별하게, 가볍게 시작해요
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* 여행 계획 */}
            <button
              type="button"
              onClick={handlePlanClick}
              className="bg-white/70 backdrop-blur-md rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 group w-full text-center"
            >
              <div className="w-16 h-16 bg-[#F4CCC4] rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <i className="ri-map-pin-line text-2xl text-white"></i>
              </div>
              <h3 className="text-xl font-bold mb-2 text-[#413D3D]">
                여행 계획
              </h3>
              <p className="text-[#413D3D] text-sm ">
                지역별 추천 장소와 함께 나만의 여행 일정을 쉽게 짜보세요.
              </p>
            </button>
            <LoginModal
              isOpen={showLoginModal}
              onClose={() => setShowLoginModal(false)}
            />

            {/* 여행 후기 */}
            <Link
              href="/reviews"
              className="bg-white/70 backdrop-blur-md rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 group"
            >
              <div className="w-16 h-16 bg-[#7FC4C9] rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <i className="ri-chat-3-line text-2xl text-white"></i>
              </div>
              <h3 className="text-xl font-bold mb-2 text-[#413D3D]">
                여행 후기
              </h3>
              <p className="text-[#413D3D] text-sm">
                생생한 여행 후기를 사진과 함께 공유해보세요.
              </p>
            </Link>

            {/* 장소 추천 */}
            <Link
              href="/recommendation"
              className="bg-white/70 backdrop-blur-md rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 group"
            >
              <div className="w-16 h-16 bg-[#F4CCC4] rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <i className="ri-lightbulb-line text-2xl text-white"></i>
              </div>
              <h3 className="text-xl font-bold mb-2 text-[#413D3D]">
                장소 추천
              </h3>
              <p className="text-[#413D3D] text-sm">
                나의 취향에 맞는 장소와 코스를 추천해줘요.
              </p>
            </Link>
          </div>
        </section>

        <section
          className="relative w-full bg-cover bg-center bg-no-repeat pt-[96px] h-[450px] flex flex-col items-center justify-center text-center px-6"
          style={{
            backgroundImage:
              "url('/images/photo-1538098629216-b50fb4725510.avif')",
          }}
        >
          {/* 기본 오버레이 */}
          <div className="absolute inset-0 bg-black/40 transition-opacity duration-300 pointer-events-none"></div>

          {/* 텍스트 + 버튼 */}
          <div className="relative z-10 max-w-3xl">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white drop-shadow-md">
              지금 바로 여행을 시작해보세요
            </h2>
            <p className="text-lg text-white/90 mb-8 drop-shadow-sm">
              원하는 지역을 선택하고 나만의 특별한 여행을 만들어보세요.
            </p>

            {/* 버튼을 감싸는 div에 group 지정 */}
            <div className="relative group">
              {/* 오버레이를 진하게 덮는 요소 */}
              <div className="absolute inset-0 bg-black/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              <button className="relative bg-[#e6b3aa] text-white px-8 py-4 rounded-full font-bold text-lg shadow-lg transition duration-300 hover:bg-[#cc9288] hover:shadow-xl active:scale-95 active:brightness-90 focus:outline-none">
                여행 계획 시작하기
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* ✅ Footer를 하단에 고정 */}

      <footer className="bg-white/60 backdrop-blur-md py-9 text-sm text-gray-600 mt-auto relative px-6 flex items-center">
        {/* 배경 이미지 */}
        <div
          className="absolute inset-y-0 left-16 w-40 bg-no-repeat bg-left bg-contain pointer-events-none"
          style={{ backgroundImage: "url('/images/h1trip-logo.png')" }}
        />

        {/* 텍스트 */}
        <p className="relative z-10 text-center w-full">
          © 2025 h1 Trip. 모든 여행자들의 꿈을 응원합니다. 🌟
        </p>
      </footer>
    </div>
  );
}
