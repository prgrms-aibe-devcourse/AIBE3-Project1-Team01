"use client";

import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import Link from "next/link";

type popularPlace = {
  region: string;
  rating: number;
  title: string;
  content: string;
  id: string;
  cover_image: string;
};

export default function PopularDestinations() {
  const [popularPlaces, setPopularPlaces] = useState<popularPlace[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPopularPlaces = async () => {
      try {
        const { data: reviews, error } = await supabase
          .from("reviews")
          .select(
            `
            *,
            images!inner(img_url, is_cover) 
          `
          )
          .eq("images.is_cover", true)
          .gte("rating", 4)
          .order("created_at", { ascending: false })
          .limit(4);

        if (error) throw error;

        if (reviews) {
          const places = reviews.map((review) => ({
            region: review.region,
            rating: review.rating,
            title: review.title,
            content: review.content,
            id: review.id,
            cover_image: review.images[0].img_url,
          }));
          setPopularPlaces(places);
        }
      } catch (error) {
        console.error("인기 여행지 불러오기 실패:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPopularPlaces();
  }, []);

  if (loading) {
    return (
      <section className="w-full py-16 bg-gradient-to-b from-pink-50 to-purple-50">
        <div className="container mx-auto px-6">
          <div className="text-center">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-96 mx-auto"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (popularPlaces.length === 0) {
    return (
      <section className="w-full py-16 bg-gradient-to-b from-pink-50 to-purple-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              🌟 인기 여행 후기
            </h2>
            <p className="text-gray-600 text-lg">
              아직 등록된 인기 후기가 없습니다
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full py-16 bg-gradient-to-b from-pink-50 to-purple-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            요즘 인기 여행지
          </h2>
          <p className="text-gray-600 text-lg">
            평점 4점 이상의 최신 여행 후기를 만나보세요
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {popularPlaces.map((place) => (
            <Link
              key={place.id}
              href={`/reviews/${place.id}`}
              className="group cursor-pointer"
            >
              <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group-hover:scale-105 h-[420px] flex flex-col">
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={place.cover_image}
                    alt={place.title}
                    className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-500"
                  />
                </div>

                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-pink-500 bg-pink-50 px-2 py-1 rounded-full">
                      {place.region}
                    </span>
                    <span className="text-sm font-medium text-yellow-500">
                      ★ {place.rating}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2 truncate">
                    {place.title}
                  </h3>
                  <p className="text-gray-600 text-sm line-clamp-2 overflow-hidden">
                    {place.content}
                  </p>

                  <div className="mt-auto flex items-center text-pink-500 group-hover:text-pink-600">
                    <span className="text-sm font-medium">
                      여행 계획 세우기
                    </span>
                    <i className="ri-arrow-right-line ml-2 group-hover:translate-x-1 transition-transform duration-300"></i>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
