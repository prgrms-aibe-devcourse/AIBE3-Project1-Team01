'use client';

interface PlanMapProps {
  selectedPlaces: any[];
  region: string;
}

export default function PlanMap({ selectedPlaces, region }: PlanMapProps) {
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      <div className="p-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white">
        <h2 className="text-lg font-bold">여행 경로</h2>
        <p className="text-sm opacity-90">선택한 장소들이 지도에 표시됩니다</p>
      </div>
      
      <div className="relative h-96 bg-gradient-to-br from-blue-50 to-green-50">
        {/* 구글 맵 임베드 */}
        <iframe
          src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3162.1!2d126.9780!3d37.5665!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzfCsDMzJzU5LjQiTiAxMjbCsDU4JzQwLjgiRQ!5e0!3m2!1sko!2skr!4v1635000000000!5m2!1sko!2skr`}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="absolute inset-0 rounded-b-2xl"
        ></iframe>
        
        {/* 선택된 장소 핀 표시 */}
        {selectedPlaces.map((place, index) => (
          <div
            key={place.id}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 z-10"
            style={{
              top: `${30 + (index * 8)}%`,
              left: `${40 + (index * 10)}%`
            }}
          >
            <div className="bg-pink-500 text-white w-8 h-8 rounded-full flex items-center justify-center shadow-lg font-bold text-sm">
              {place.order}
            </div>
            <div className="absolute top-10 left-1/2 transform -translate-x-1/2 bg-white px-2 py-1 rounded shadow-md text-xs whitespace-nowrap">
              {place.name}
            </div>
          </div>
        ))}
        
        {/* 경로 연결선 */}
        {selectedPlaces.length > 1 && (
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            {selectedPlaces.slice(0, -1).map((_, index) => (
              <line
                key={index}
                x1={`${40 + (index * 10)}%`}
                y1={`${30 + (index * 8)}%`}
                x2={`${40 + ((index + 1) * 10)}%`}
                y2={`${30 + ((index + 1) * 8)}%`}
                stroke="#ec4899"
                strokeWidth="2"
                strokeDasharray="5,5"
              />
            ))}
          </svg>
        )}
      </div>
    </div>
  );
}