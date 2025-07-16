'use client';

import Link from 'next/link';

const popularPlaces = [
  {
    id: 'jeju',
    name: '제주도',
    description: '아름다운 자연과 힐링이 있는 곳',
    image: 'https://readdy.ai/api/search-image?query=Beautiful%20Jeju%20Island%20landscape%20with%20clear%20blue%20sky%2C%20volcanic%20mountain%2C%20green%20fields%2C%20and%20ocean%20view%2C%20peaceful%20and%20serene%20atmosphere%2C%20soft%20pastel%20colors%2C%20travel%20photography%20style%2C%20professional%20quality&width=400&height=250&seq=jeju001&orientation=landscape',
    color: 'from-blue-400 to-cyan-400'
  },
  {
    id: 'busan',
    name: '부산',
    description: '바다와 도시가 만나는 매력적인 곳',
    image: 'https://readdy.ai/api/search-image?query=Busan%20city%20skyline%20with%20beautiful%20beach%2C%20colorful%20buildings%2C%20ocean%20waves%2C%20modern%20architecture%20mixed%20with%20traditional%20elements%2C%20warm%20sunset%20lighting%2C%20travel%20destination%20photography%2C%20vibrant%20and%20inviting%20atmosphere&width=400&height=250&seq=busan001&orientation=landscape',
    color: 'from-orange-400 to-red-400'
  },
  {
    id: 'gangwon',
    name: '강원도',
    description: '산과 바다, 사계절 아름다운 자연',
    image: 'https://readdy.ai/api/search-image?query=Gangwon-do%20mountain%20landscape%20with%20pine%20trees%2C%20clean%20streams%2C%20hiking%20trails%2C%20fresh%20mountain%20air%2C%20natural%20beauty%2C%20Korean%20traditional%20mountain%20scenery%2C%20peaceful%20forest%20atmosphere%2C%20travel%20photography&width=400&height=250&seq=gangwon001&orientation=landscape',
    color: 'from-green-400 to-emerald-400'
  },
  {
    id: 'seoul',
    name: '서울',
    description: '전통과 현대가 공존하는 수도',
    image: 'https://readdy.ai/api/search-image?query=Seoul%20cityscape%20with%20traditional%20Korean%20palace%20architecture%20and%20modern%20skyscrapers%2C%20Han%20river%2C%20vibrant%20city%20life%2C%20cultural%20heritage%20mixed%20with%20contemporary%20urban%20design%2C%20travel%20destination%20photography&width=400&height=250&seq=seoul001&orientation=landscape',
    color: 'from-purple-400 to-pink-400'
  }
];

export default function PopularDestinations() {
  return (
    <section className="w-full py-16 bg-gradient-to-b from-pink-50 to-purple-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            🌟 요즘 인기 여행지
          </h2>
          <p className="text-gray-600 text-lg">
            다른 여행자들이 많이 찾는 인기 여행지를 확인해보세요
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {popularPlaces.map((place) => (
            <Link
              key={place.id}
              href={`/plan/${place.id}`}
              className="group cursor-pointer"
            >
              <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group-hover:scale-105">
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={place.image}
                    alt={place.name}
                    className="w-full h-full object-cover object-top group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${place.color} opacity-20 group-hover:opacity-30 transition-opacity duration-300`}></div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    {place.name}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {place.description}
                  </p>
                  
                  <div className="mt-4 flex items-center text-pink-500 group-hover:text-pink-600">
                    <span className="text-sm font-medium">여행 계획 세우기</span>
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