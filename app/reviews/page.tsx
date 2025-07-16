"use client";

import { useState } from "react";
import Link from "next/link";
import ReviewCard from "@/components/ReviewCard";
import ReviewFilter from "@/components/ReviewFilter";

const mockReviews = [
  {
    id: "1",
    title: "제주도 3박 4일 힐링 여행",
    content:
      "한라산 등반부터 해변까지, 제주도의 모든 매력을 만끽했습니다. 특히 성산일출봉에서 본 일출이 정말 감동적이었어요!",
    author: "여행러버",
    region: "제주도",
    rating: 5,
    images: [
      "https://readdy.ai/api/search-image?query=Beautiful%20Jeju%20Island%20Seongsan%20Ilchulbong%20sunrise%20peak%20with%20golden%20morning%20light%2C%20tourists%20watching%20sunrise%2C%20volcanic%20crater%2C%20ocean%20view%2C%20peaceful%20atmosphere%2C%20travel%20photography&width=300&height=200&seq=jeju_review_001&orientation=landscape",
    ],
    createdAt: "2024-01-15",
    likes: 24,
  },
  {
    id: "2",
    title: "부산 감천문화마을 예술 여행",
    content:
      "알록달록한 집들과 골목길 곳곳의 예술 작품들이 너무 아름다웠어요. 인스타그램 사진 찍기에도 최고!",
    author: "아트홀릭",
    region: "부산",
    rating: 4,
    images: [
      "https://readdy.ai/api/search-image?query=Gamcheon%20Culture%20Village%20in%20Busan%20with%20colorful%20houses%2C%20street%20art%2C%20narrow%20alleys%2C%20artistic%20installations%2C%20tourists%20taking%20photos%2C%20vibrant%20cultural%20atmosphere&width=300&height=200&seq=busan_review_001&orientation=landscape",
    ],
    createdAt: "2024-01-12",
    likes: 18,
  },
  {
    id: "3",
    title: "서울 궁궐 투어 완벽 가이드",
    content:
      "경복궁, 창덕궁, 덕수궁까지 하루에 돌아본 후기입니다. 한복 체험도 함께해서 더욱 의미있었어요.",
    author: "역사탐험가",
    region: "서울",
    rating: 5,
    images: [
      "https://readdy.ai/api/search-image?query=Korean%20palace%20Gyeongbokgung%20with%20people%20in%20traditional%20hanbok%2C%20changing%20of%20guard%20ceremony%2C%20beautiful%20architecture%2C%20tourists%20exploring%2C%20historical%20atmosphere&width=300&height=200&seq=seoul_review_001&orientation=landscape",
    ],
    createdAt: "2024-01-10",
    likes: 32,
  },
  {
    id: "4",
    title: "강원도 설악산 단풍 여행",
    content:
      "가을 단풍이 절정일 때 다녀온 설악산! 케이블카를 타고 올라간 전망이 정말 장관이었습니다.",
    author: "산행매니아",
    region: "강원도",
    rating: 5,
    images: [
      "https://readdy.ai/api/search-image?query=Seoraksan%20National%20Park%20in%20autumn%20with%20colorful%20fall%20foliage%2C%20mountain%20peaks%2C%20hiking%20trails%2C%20cable%20car%2C%20tourists%20enjoying%20nature%2C%20stunning%20landscape%20photography&width=300&height=200&seq=gangwon_review_001&orientation=landscape",
    ],
    createdAt: "2024-01-08",
    likes: 28,
  },
];

export default function ReviewsPage() {
  const [filteredReviews, setFilteredReviews] = useState(mockReviews);
  const [activeFilters, setActiveFilters] = useState({
    region: "all",
    rating: "all",
  });

  const handleFilterChange = (filters: any) => {
    setActiveFilters(filters);

    let filtered = mockReviews.filter((review) => {
      const regionMatch =
        filters.region === "all" || review.region === filters.region;
      const ratingMatch =
        filters.rating === "all" || review.rating >= parseInt(filters.rating);

      return regionMatch && ratingMatch;
    });

    setFilteredReviews(filtered);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-pink-100 sticky top-0 z-40">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link
              href="/"
              className="text-pink-500 hover:text-pink-600 cursor-pointer"
            >
              <i className="ri-arrow-left-line text-xl"></i>
            </Link>
            <h1 className="text-2xl font-bold text-gray-800">여행 후기</h1>
          </div>

          <Link
            href="/reviews/write"
            className="bg-gradient-to-r from-pink-400 to-purple-400 text-white px-6 py-2 rounded-full hover:from-pink-500 hover:to-purple-500 transition-all duration-300 font-medium shadow-md hover:shadow-lg whitespace-nowrap cursor-pointer"
          >
            <i className="ri-edit-line mr-2"></i>
            후기 작성
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* 필터 사이드바 */}
          <div className="lg:col-span-1">
            <ReviewFilter
              onFilterChange={handleFilterChange}
              activeFilters={activeFilters}
            />
          </div>

          {/* 후기 목록 */}
          <div className="lg:col-span-3">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  전체 후기 ({filteredReviews.length})
                </h2>
                <p className="text-gray-600 text-sm mt-1">
                  다른 여행자들의 생생한 후기를 확인해보세요
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredReviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>

            {filteredReviews.length === 0 && (
              <div className="text-center py-16">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="ri-search-line text-3xl text-gray-400"></i>
                </div>
                <h3 className="text-lg font-semibold text-gray-600 mb-2">
                  조건에 맞는 후기가 없습니다
                </h3>
                <p className="text-gray-500">다른 필터 조건을 시도해보세요</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
