"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import AuthModal from "./AuthModal";

export default function Header() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  return (
    <>
      <header className="w-full bg-white/80 backdrop-blur-sm border-b border-pink-100 sticky top-0 z-40">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/">
              <Image
                src="https://static.readdy.ai/image/df8eb1caceba02e6bad89568ddd977d7/31702154ca6be3ac016660554323f798.png"
                alt="h1 Trip"
                width={120}
                height={60}
                className="object-contain cursor-pointer"
              />
            </Link>
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className="text-gray-700 hover:text-purple-600 transition-colors font-medium cursor-pointer"
            >
              홈
            </Link>
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

          <button
            onClick={() => setIsAuthModalOpen(true)}
            className="bg-gradient-to-r from-pink-300 to-purple-300 text-white px-6 py-2 rounded-full hover:from-pink-400 hover:to-purple-400 transition-all duration-300 font-medium shadow-md hover:shadow-lg whitespace-nowrap cursor-pointer"
          >
            로그인
          </button>
        </div>
      </header>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </>
  );
}
