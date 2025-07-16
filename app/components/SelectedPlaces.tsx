'use client';

import { useState } from 'react';

interface SelectedPlacesProps {
  places: any[];
  onRemove: (placeId: string) => void;
  onOrderChange: (dragIndex: number, dropIndex: number) => void;
}

export default function SelectedPlaces({ places, onRemove, onOrderChange }: SelectedPlacesProps) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedIndex !== null && draggedIndex !== dropIndex) {
      onOrderChange(draggedIndex, dropIndex);
    }
    setDraggedIndex(null);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-800">선택된 장소</h2>
        <span className="bg-pink-100 text-pink-600 px-3 py-1 rounded-full text-sm font-medium">
          {places.length}개
        </span>
      </div>

      {places.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="ri-map-pin-line text-2xl text-gray-400"></i>
          </div>
          <p className="text-gray-500 mb-2">아직 선택된 장소가 없습니다</p>
          <p className="text-sm text-gray-400">왼쪽에서 장소를 선택해보세요</p>
        </div>
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {places.map((place, index) => (
            <div
              key={place.id}
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, index)}
              className={`flex items-center gap-3 p-3 border border-gray-200 rounded-xl hover:border-pink-200 transition-colors cursor-move ${
                draggedIndex === index ? 'opacity-50' : ''
              }`}
            >
              <div className="w-8 h-8 bg-pink-500 text-white rounded-full flex items-center justify-center font-bold text-sm">
                {place.order}
              </div>

              <img
                src={place.image}
                alt={place.name}
                className="w-12 h-12 rounded-lg object-cover object-top"
              />

              <div className="flex-1">
                <h3 className="font-semibold text-gray-800 text-sm">{place.name}</h3>
                <p className="text-xs text-gray-500">{place.address}</p>
              </div>

              <button
                onClick={() => onRemove(place.id)}
                className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
              >
                <i className="ri-close-line"></i>
              </button>
            </div>
          ))}
        </div>
      )}

      {places.length > 0 && (
        <div className="mt-6 pt-4 border-t border-gray-100">
          <div className="text-sm text-gray-600 mb-3">
            <i className="ri-information-line mr-1"></i>
            드래그해서 순서를 변경할 수 있습니다
          </div>
          
          <div className="flex gap-2">
            <button className="flex-1 bg-gradient-to-r from-pink-400 to-purple-400 text-white py-2 px-4 rounded-xl font-medium hover:from-pink-500 hover:to-purple-500 transition-all duration-300 whitespace-nowrap cursor-pointer">
              <i className="ri-save-line mr-2"></i>
              계획 저장
            </button>
            <button className="bg-gray-100 text-gray-600 py-2 px-4 rounded-xl hover:bg-gray-200 transition-colors whitespace-nowrap cursor-pointer">
              <i className="ri-share-line mr-2"></i>
              공유
            </button>
          </div>
        </div>
      )}
    </div>
  );
}