'use client';

import Header from '../components/Header';
import KoreaMap from '../components/KoreaMap';
import PopularDestinations from '../components/PopularDestinations';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      <Header />
      
      {/* Hero Section */}
      <section className="container mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-6 leading-tight">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">
              완벽한 여행
            </span>
            을<br />
            계획해보세요 ✈️
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            대한민국 전국 어디든, 당신만의 특별한 여행 계획을 세우고 
            다른 여행자들과 후기를 공유해보세요
          </p>
        </div>

        {/* Interactive Korea Map */}
        <div className="mb-16">
          <KoreaMap />
        </div>
      </section>

      {/* Popular Destinations */}
      <PopularDestinations />

      {/* Features Section */}
      <section className="container mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            🎯 주요 기능
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Link href="/plans" className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 text-center shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group">
            <div className="w-16 h-16 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
              <i className="ri-map-pin-line text-2xl text-white"></i>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-4">여행 계획</h3>
            <p className="text-gray-600">
              지역별 맞춤 장소 추천과 함께 나만의 여행 일정을 쉽게 계획하세요
            </p>
          </Link>

          <Link href="/reviews" className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 text-center shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
              <i className="ri-chat-3-line text-2xl text-white"></i>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-4">여행 후기</h3>
            <p className="text-gray-600">
              생생한 여행 경험을 사진과 함께 공유하고 다른 여행자들의 후기도 확인하세요
            </p>
          </Link>

          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 text-center shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full flex items-center justify-center mx-auto mb-6">
              <i className="ri-lightbulb-line text-2xl text-white"></i>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-4">AI 추천</h3>
            <p className="text-gray-600">
              취향과 여행 스타일에 맞는 개인화된 장소와 코스를 추천받으세요
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 py-16">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            지금 바로 여행 계획을 시작해보세요! 🚀
          </h2>
          <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
            원하는 지역을 선택하고 나만의 특별한 여행을 만들어보세요
          </p>
          <button className="bg-white text-purple-600 px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-50 transition-colors duration-300 shadow-lg hover:shadow-xl whitespace-nowrap cursor-pointer">
            여행 계획 시작하기 ✨
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white/50 backdrop-blur-sm py-8 mt-16">
        <div className="container mx-auto px-6 text-center">
          <p className="text-gray-600">
            © 2024 h1 Trip. 모든 여행자들의 꿈을 응원합니다. 🌟
          </p>
        </div>
      </footer>
    </div>
  );
}