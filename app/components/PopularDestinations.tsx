'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '../../lib/supabase';

interface PopularPlace {
  region: string;
  rating: number;
  title: string;
  content: string;
  id: number;
  cover_image: string;
}

// 지역별 배경 그라데이션 색상 매핑
const regionColors: { [key: string]: string } = {
  '제주': 'from-blue-400 to-cyan-400',
  '부산': 'from-orange-400 to-red-400',
  '강릉·속초': 'from-green-400 to-emerald-400',
  '서울': 'from-purple-400 to-pink-400',
  '가평·양평': 'from-yellow-400 to-amber-400',
  '경주': 'from-indigo-400 to-violet-400',
  '여수': 'from-sky-400 to-blue-400',
  '인천': 'from-rose-400 to-pink-400',
  '전주': 'from-lime-400 to-green-400',
  '춘천·홍천': 'from-emerald-400 to-teal-400',
  '태안': 'from-cyan-400 to-sky-400',
  '통영·거제·남해': 'from-violet-400 to-purple-400',
  '포항·안동': 'from-amber-400 to-orange-400',
};

export default function PopularDestinations() {
  const [popularPlaces, setPopularPlaces] = useState<PopularPlace[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPopularPlaces = async () => {
      try {
        // 평점 4점 이상이면서 대표 이미지가 있는 최근 리뷰 가져오기
        const { data: reviews, error } = await supabase
          .from('reviews')
          .select(`
            *,
            images!inner(img_url, is_cover) 
          `) //연결된 images가 있는 경우에만 inner join -> img_url, is_cover 컬럼 가져오기
          .eq('images.is_cover', true) //is_cover가 true인 이미지만 가져오기 (대표사진 있는 후기만 메인에 띄우게)
          .gte('rating', 4) //평점 4점 이상 
          .order('created_at', { ascending: false }) //최신순 정렬
          .limit(4);

        if (error) throw error;

        if (reviews) {
          const places = reviews.map(review => ({
            region: review.region,
            rating: review.rating,
            title: review.title,
            content: review.content,
            id: review.id,
            cover_image: review.images[0].img_url // is_cover가 true인 이미지는 하나만 있으므로 첫 번째 이미지가 커버 이미지
          }));
          setPopularPlaces(places);
        }
      } catch (error) {
        console.error('인기 여행지 불러오기 실패:', error);
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

  // 데이터가 없을 때 보여줄 화면
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
            🌟 인기 여행 후기
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
              <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group-hover:scale-105">
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={place.cover_image}
                    alt={place.title}
                    className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${regionColors[place.region] || 'from-gray-400 to-gray-500'} opacity-20 group-hover:opacity-30 transition-opacity duration-300`}></div>
                </div>
                
                <div className="p-6">
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
                  <p className="text-gray-600 text-sm line-clamp-2">
                    {place.content}
                  </p>
                  
                  <div className="mt-4 flex items-center text-pink-500 group-hover:text-pink-600">
                    <span className="text-sm font-medium">후기 자세히 보기</span>
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