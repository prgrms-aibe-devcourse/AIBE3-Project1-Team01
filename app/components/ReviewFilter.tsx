'use client';

import { useState } from 'react';

interface FilterProps {
  onFilterChange: (filters: any) => void;
  activeFilters: {
    region: string;
    category: string;
    rating: string;
  };
}

const regions = [
  { id: 'all', name: '전체 지역' },
  { id: '서울', name: '서울' },
  { id: '부산', name: '부산' },
  { id: '제주도', name: '제주도' },
  { id: '강원도', name: '강원도' },
  { id: '경기도', name: '경기도' },
  { id: '전라남도', name: '전라남도' },
  { id: '경상북도', name: '경상북도' },
];

const categories = [
  { id: 'all', name: '전체 카테고리' },
  { id: 'nature', name: '자연' },
  { id: 'culture', name: '문화' },
  { id: 'food', name: '맛집' },
  { id: 'history', name: '역사' },
  { id: 'activity', name: '액티비티' },
];

const ratings = [
  { id: 'all', name: '전체 평점' },
  { id: '5', name: '5점' },
  { id: '4', name: '4점 이상' },
  { id: '3', name: '3점 이상' },
];

export default function ReviewFilter({ onFilterChange, activeFilters }: FilterProps) {
  const [filters, setFilters] = useState(activeFilters);

  const handleFilterUpdate = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
      <h3 className="text-lg font-bold text-gray-800 mb-6">필터</h3>

      {/* 지역 필터 */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-gray-700 mb-3">지역</h4>
        <div className="space-y-2">
          {regions.map(region => (
            <label key={region.id} className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="region"
                value={region.id}
                checked={filters.region === region.id}
                onChange={(e) => handleFilterUpdate('region', e.target.value)}
                className="sr-only"
              />
              <div className={`w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center ${
                filters.region === region.id 
                  ? 'border-pink-500 bg-pink-500' 
                  : 'border-gray-300'
              }`}>
                {filters.region === region.id && (
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                )}
              </div>
              <span className={`text-sm ${
                filters.region === region.id ? 'text-pink-600 font-medium' : 'text-gray-600'
              }`}>
                {region.name}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* 카테고리 필터 */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-gray-700 mb-3">카테고리</h4>
        <div className="space-y-2">
          {categories.map(category => (
            <label key={category.id} className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="category"
                value={category.id}
                checked={filters.category === category.id}
                onChange={(e) => handleFilterUpdate('category', e.target.value)}
                className="sr-only"
              />
              <div className={`w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center ${
                filters.category === category.id 
                  ? 'border-purple-500 bg-purple-500' 
                  : 'border-gray-300'
              }`}>
                {filters.category === category.id && (
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                )}
              </div>
              <span className={`text-sm ${
                filters.category === category.id ? 'text-purple-600 font-medium' : 'text-gray-600'
              }`}>
                {category.name}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* 평점 필터 */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-gray-700 mb-3">평점</h4>
        <div className="space-y-2">
          {ratings.map(rating => (
            <label key={rating.id} className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="rating"
                value={rating.id}
                checked={filters.rating === rating.id}
                onChange={(e) => handleFilterUpdate('rating', e.target.value)}
                className="sr-only"
              />
              <div className={`w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center ${
                filters.rating === rating.id 
                  ? 'border-yellow-500 bg-yellow-500' 
                  : 'border-gray-300'
              }`}>
                {filters.rating === rating.id && (
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                )}
              </div>
              <span className={`text-sm ${
                filters.rating === rating.id ? 'text-yellow-600 font-medium' : 'text-gray-600'
              }`}>
                {rating.name}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* 필터 초기화 */}
      <button
        onClick={() => {
          const resetFilters = { region: 'all', category: 'all', rating: 'all' };
          setFilters(resetFilters);
          onFilterChange(resetFilters);
        }}
        className="w-full bg-gray-100 text-gray-600 py-2 px-4 rounded-xl hover:bg-gray-200 transition-colors text-sm font-medium whitespace-nowrap cursor-pointer"
      >
        필터 초기화
      </button>
    </div>
  );
}