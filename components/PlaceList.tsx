'use client';

import { useState } from 'react';

interface Place {
  id: string;
  name: string;
  category: string;
  rating: number;
  description: string;
  image: string;
  address: string;
}

interface PlaceListProps {
  region: string;
  activeCategory: string;
  onCategoryChange: (category: string) => void;
  onPlaceSelect: (place: Place) => void;
  selectedPlaces: Place[];
}

const mockPlaces: { [key: string]: Place[] } = {
  seoul: [
    {
      id: 'gyeongbokgung',
      name: '경복궁',
      category: 'tourist',
      rating: 4.5,
      description: '조선왕조의 대표 궁궐',
      image: 'https://readdy.ai/api/search-image?query=Gyeongbokgung%20Palace%20in%20Seoul%20with%20traditional%20Korean%20architecture%2C%20colorful%20roof%20tiles%2C%20royal%20guards%20ceremony%2C%20tourists%20walking%2C%20clear%20blue%20sky%2C%20historical%20landmark%2C%20professional%20travel%20photography&width=300&height=200&seq=gyeong001&orientation=landscape',
      address: '서울 종로구 사직로 161'
    },
    {
      id: 'myeongdong',
      name: '명동',
      category: 'shopping',
      rating: 4.2,
      description: '쇼핑과 맛집의 천국',
      image: 'https://readdy.ai/api/search-image?query=Myeongdong%20shopping%20street%20in%20Seoul%20with%20bright%20neon%20signs%2C%20crowded%20streets%2C%20Korean%20street%20food%20vendors%2C%20shopping%20bags%2C%20vibrant%20city%20atmosphere%2C%20evening%20lights%2C%20urban%20photography&width=300&height=200&seq=myeong001&orientation=landscape',
      address: '서울 중구 명동'
    },
    {
      id: 'hongdae',
      name: '홍대',
      category: 'entertainment',
      rating: 4.3,
      description: '젊음과 열정이 넘치는 거리',
      image: 'https://readdy.ai/api/search-image?query=Hongdae%20area%20in%20Seoul%20with%20young%20people%2C%20street%20performances%2C%20cafes%2C%20clubs%2C%20colorful%20murals%2C%20vibrant%20nightlife%2C%20university%20district%20atmosphere%2C%20modern%20urban%20scene&width=300&height=200&seq=hong001&orientation=landscape',
      address: '서울 마포구 홍익로'
    }
  ],
  busan: [
    {
      id: 'haeundae',
      name: '해운대 해수욕장',
      category: 'tourist',
      rating: 4.4,
      description: '부산의 대표 해수욕장',
      image: 'https://readdy.ai/api/search-image?query=Haeundae%20Beach%20in%20Busan%20with%20golden%20sand%2C%20blue%20ocean%20waves%2C%20beach%20umbrellas%2C%20people%20swimming%20and%20sunbathing%2C%20coastal%20city%20skyline%2C%20summer%20vacation%20atmosphere%2C%20beach%20photography&width=300&height=200&seq=hae001&orientation=landscape',
      address: '부산 해운대구 우동'
    },
    {
      id: 'gamcheon',
      name: '감천문화마을',
      category: 'tourist',
      rating: 4.6,
      description: '부산의 마추픽추',
      image: 'https://readdy.ai/api/search-image?query=Gamcheon%20Culture%20Village%20in%20Busan%20with%20colorful%20houses%20on%20hillside%2C%20narrow%20alleys%2C%20artistic%20murals%2C%20panoramic%20view%2C%20traditional%20Korean%20village%20atmosphere%2C%20cultural%20tourism%20destination&width=300&height=200&seq=gam001&orientation=landscape',
      address: '부산 사하구 감내2로 203'
    }
  ]
};

const categories = [
  { id: 'all', name: '전체', icon: 'ri-apps-line' },
  { id: 'tourist', name: '관광지', icon: 'ri-camera-line' },
  { id: 'restaurant', name: '맛집', icon: 'ri-restaurant-line' },
  { id: 'hotel', name: '숙소', icon: 'ri-hotel-line' },
  { id: 'shopping', name: '쇼핑', icon: 'ri-shopping-bag-line' },
  { id: 'entertainment', name: '엔터테인먼트', icon: 'ri-music-line' },
];

export default function PlaceList({ 
  region, 
  activeCategory, 
  onCategoryChange, 
  onPlaceSelect,
  selectedPlaces 
}: PlaceListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  
  const places = mockPlaces[region] || [];
  
  const filteredPlaces = places.filter(place => {
    const matchesCategory = activeCategory === 'all' || place.category === activeCategory;
    const matchesSearch = place.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const isPlaceSelected = (placeId: string) => {
    return selectedPlaces.some(p => p.id === placeId);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">추천 장소</h2>
        
        {/* 검색 */}
        <div className="relative mb-4">
          <input
            type="text"
            placeholder="장소 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-pink-300 transition-colors text-sm"
          />
          <i className="ri-search-line absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm"></i>
        </div>

        {/* 카테고리 */}
        <div className="flex flex-wrap gap-2">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => onCategoryChange(category.id)}
              className={`px-3 py-2 rounded-full text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
                activeCategory === category.id
                  ? 'bg-pink-100 text-pink-600'
                  : 'bg-gray-100 text-gray-600 hover:bg-pink-50'
              }`}
            >
              <i className={`${category.icon} mr-1`}></i>
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* 장소 목록 */}
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {filteredPlaces.map(place => (
          <div
            key={place.id}
            className={`border rounded-xl p-4 transition-colors cursor-pointer ${
              isPlaceSelected(place.id)
                ? 'border-pink-300 bg-pink-50'
                : 'border-gray-200 hover:border-pink-200'
            }`}
            onClick={() => !isPlaceSelected(place.id) && onPlaceSelect(place)}
          >
            <div className="flex gap-3">
              <img
                src={place.image}
                alt={place.name}
                className="w-16 h-16 rounded-lg object-cover object-top"
              />
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800 mb-1">{place.name}</h3>
                <p className="text-sm text-gray-600 mb-2">{place.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex text-yellow-400">
                      {Array.from({ length: 5 }, (_, i) => (
                        <i
                          key={i}
                          className={`ri-star${i < Math.floor(place.rating) ? '-fill' : '-line'} text-xs`}
                        ></i>
                      ))}
                    </div>
                    <span className="text-xs text-gray-500 ml-1">{place.rating}</span>
                  </div>
                  {isPlaceSelected(place.id) ? (
                    <span className="text-xs bg-pink-500 text-white px-2 py-1 rounded-full">
                      선택됨
                    </span>
                  ) : (
                    <button className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full hover:bg-pink-100 hover:text-pink-600 transition-colors whitespace-nowrap cursor-pointer">
                      추가
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}