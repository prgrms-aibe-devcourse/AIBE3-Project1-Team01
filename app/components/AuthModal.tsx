'use client';

import { useState } from 'react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true);

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
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            {isLogin ? '로그인' : '회원가입'}
          </h2>
          <p className="text-gray-500">
            {isLogin ? '여행 계획을 시작해보세요!' : '새로운 여행 친구가 되어주세요!'}
          </p>
        </div>

        <form className="space-y-4">
          <div>
            <input
              type="email"
              placeholder="이메일"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-pink-300 transition-colors"
            />
          </div>
          
          {!isLogin && (
            <div>
              <input
                type="text"
                placeholder="닉네임"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-pink-300 transition-colors"
              />
            </div>
          )}
          
          <div>
            <input
              type="password"
              placeholder="비밀번호"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-pink-300 transition-colors"
            />
          </div>
          
          {!isLogin && (
            <div>
              <input
                type="password"
                placeholder="비밀번호 확인"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-pink-300 transition-colors"
              />
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-pink-400 to-purple-400 text-white py-3 rounded-xl font-medium hover:from-pink-500 hover:to-purple-500 transition-all duration-300 whitespace-nowrap cursor-pointer"
          >
            {isLogin ? '로그인' : '회원가입'}
          </button>
        </form>

        <div className="text-center mt-6">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-pink-400 hover:text-pink-600 transition-colors cursor-pointer"
          >
            {isLogin ? '아직 계정이 없으신가요? 회원가입' : '이미 계정이 있으신가요? 로그인'}
          </button>
        </div>
      </div>
    </div>
  );
}