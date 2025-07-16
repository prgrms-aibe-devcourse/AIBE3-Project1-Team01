import { useEffect, useState } from "react";

// 지역별 대표 좌표 매핑
const AREA_COORDS = {
  1: { mapX: 126.9779692, mapY: 37.566535 }, // 서울
  2: { mapX: 126.705206, mapY: 37.456256 }, // 인천
  3: { mapX: 127.3845475, mapY: 36.3504119 }, // 대전
  4: { mapX: 128.601445, mapY: 35.871435 }, // 대구
  5: { mapX: 126.851338, mapY: 35.159545 }, // 광주
  6: { mapX: 129.0750222, mapY: 35.1795543 }, // 부산
  7: { mapX: 129.31136, mapY: 35.538377 }, // 울산
  8: { mapX: 127.289034, mapY: 36.480351 }, // 세종
  31: { mapX: 127.5183, mapY: 37.4138 }, // 경기
  32: { mapX: 128.1555, mapY: 37.8228 }, // 강원
  33: { mapX: 127.4914, mapY: 36.6358 }, // 충북
  34: { mapX: 126.8044, mapY: 36.5184 }, // 충남
  35: { mapX: 127.1088, mapY: 35.8202 }, // 전북
  36: { mapX: 126.4636, mapY: 34.8161 }, // 전남
  37: { mapX: 128.5056, mapY: 36.576 }, // 경북
  38: { mapX: 128.6957, mapY: 35.2383 }, // 경남
  39: { mapX: 126.5312, mapY: 33.4996 }, // 제주
};

export default function TourApiList({ areaCode, contentTypeId, cat1, cat2 }) {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const apiKey = process.env.NEXT_PUBLIC_TOUR_API_KEY;
        const encodedKey = encodeURIComponent(apiKey);
        const coords = AREA_COORDS[areaCode] || AREA_COORDS[1];
        const { mapX, mapY } = coords;
        let url = `http://apis.data.go.kr/B551011/KorService2/locationBasedList2?serviceKey=${encodedKey}&numOfRows=10&pageNo=1&MobileOS=ETC&MobileApp=AppTest&_type=json&mapX=${mapX}&mapY=${mapY}&radius=20000&areaCode=${areaCode}&contentTypeId=${contentTypeId}`;
        if (cat1) url += `&cat1=${cat1}`;
        if (cat2) url += `&cat2=${cat2}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error("API 호출 실패");
        const data = await res.json();
        console.log("API 응답:", data);
        setPlaces(data.response.body.items.item || []);
      } catch (e) {
        setError("데이터를 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [areaCode, contentTypeId, cat1, cat2]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="bg-white/60 rounded-2xl shadow-lg p-6 animate-pulse h-48"
          />
        ))}
      </div>
    );
  }
  if (error) return <p className="text-center text-red-500 py-8">{error}</p>;
  if (!places.length)
    return <p className="text-center text-gray-500 py-8">여행지가 없습니다</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {places.map((place) => (
        <div
          key={place.contentid}
          className="bg-white/60 rounded-2xl shadow-lg p-6 flex flex-col items-center hover:shadow-xl transition-shadow duration-300"
        >
          {place.firstimage ? (
            <img
              src={place.firstimage}
              alt={place.title}
              className="w-full h-40 object-cover rounded-xl mb-4 bg-gray-100"
              style={{ maxWidth: 320 }}
            />
          ) : (
            <div
              className="w-full h-40 flex flex-col items-center justify-center rounded-xl mb-4 bg-gray-200 text-gray-400"
              style={{ maxWidth: 320 }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10 mb-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 11l4 4 4-4"
                />
              </svg>
              <span className="text-sm">이미지 없음</span>
            </div>
          )}
          <h3 className="text-lg font-bold text-gray-800 mb-2 text-center">
            {place.title}
          </h3>
          <p className="text-gray-600 text-sm text-center">{place.addr1}</p>
        </div>
      ))}
    </div>
  );
}
