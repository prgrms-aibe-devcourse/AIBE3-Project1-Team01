"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import LoginModal from "./LoginModal";
import SignupModal from "./SignupModal";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

export default function Header() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      setIsLoading(true);
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
      setIsLoading(false);
    };

    getUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    setIsLoading(true);
    await supabase.auth.signOut();
    window.location.reload();
    setIsLoading(false);
  };

  if (isLoading) {
    return <>로딩 중...</>;
  }

  // 모달 전환 핸들러
  const openSignup = () => {
    setIsLoginModalOpen(false);
    setIsSignupModalOpen(true);
  };
  const openLogin = () => {
    setIsSignupModalOpen(false);
    setIsLoginModalOpen(true);
  };

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
            <div className="text-gray-700 hover:text-purple-600 transition-colors font-medium cursor-pointer">
              AI 추천
            </div>
          </nav>

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
