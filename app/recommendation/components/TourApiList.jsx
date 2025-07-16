import { useState, useEffect } from "react";

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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pageNo, setPageNo] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [keyword, setKeyword] = useState("");
  const numOfRows = 12;

  // 검색 조건/키워드 변경 시 페이지 초기화
  useEffect(() => {
    setPageNo(1);
  }, [areaCode, contentTypeId, cat1, cat2, keyword]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const apiKey = process.env.NEXT_PUBLIC_TOUR_API_KEY;
        const encodedKey = encodeURIComponent(apiKey);
        let url, data;
        if (keyword.trim()) {
          // 키워드 검색 (KorService2/searchKeyword2 + 파라미터)
          url = `https://apis.data.go.kr/B551011/KorService2/searchKeyword2?serviceKey=${encodedKey}&MobileOS=ETC&MobileApp=AppTest&keyword=${encodeURIComponent(
            keyword
          )}&numOfRows=${numOfRows}&pageNo=${pageNo}&_type=json`;
          if (areaCode) url += `&areaCode=${areaCode}`;
          if (contentTypeId) url += `&contentTypeId=${contentTypeId}`;
          if (cat1) url += `&cat1=${cat1}`;
          if (cat2) url += `&cat2=${cat2}`;
        } else {
          // 지역+카테고리 검색
          const coords = AREA_COORDS[areaCode] || AREA_COORDS[1];
          const { mapX, mapY } = coords;
          url = `http://apis.data.go.kr/B551011/KorService2/locationBasedList2?serviceKey=${encodedKey}&numOfRows=${numOfRows}&pageNo=${pageNo}&MobileOS=ETC&MobileApp=AppTest&_type=json&mapX=${mapX}&mapY=${mapY}&radius=20000&areaCode=${areaCode}&contentTypeId=${contentTypeId}`;
          if (cat1) url += `&cat1=${cat1}`;
          if (cat2) url += `&cat2=${cat2}`;
        }
        const res = await fetch(url);
        data = await res.json();
        const items = data.response?.body?.items?.item || [];
        setPlaces(items);
        setTotalCount(Number(data.response?.body?.totalCount) || 0);
      } catch (e) {
        setError("데이터를 불러오지 못했습니다.");
        setPlaces([]);
        setTotalCount(0);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [areaCode, contentTypeId, cat1, cat2, keyword, pageNo]);

  const totalPages = Math.ceil(totalCount / numOfRows);

  return (
    <div>
      {/* 더 친근한 헤딩 */}
      <h2 className="text-2xl md:text-3xl font-extrabold text-center mb-6 text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-500 drop-shadow-sm">
        ✨ 오늘의 추천 여행지, 어디로 떠나볼까요?
      </h2>
      {/* 검색창 */}
      <div className="mb-8 flex justify-center gap-2">
        <div className="relative w-72">
          <input
            type="text"
            placeholder="장소, 키워드로 검색해보세요!"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") setPageNo(1);
            }}
            className="rounded-full border border-gray-200 px-5 py-3 shadow bg-white/80 focus:outline-none focus:ring-2 focus:ring-pink-300 text-gray-700 text-base w-full pr-12"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-pink-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-4-4m0 0A7 7 0 104 4a7 7 0 0013 13z"
              />
            </svg>
          </span>
        </div>
        <button
          className="px-6 py-3 rounded-full bg-gradient-to-r from-pink-400 to-purple-400 text-white font-bold shadow hover:scale-105 transition"
          onClick={() => setPageNo(1)}
        >
          검색
        </button>
      </div>
      {/* 리스트/로딩/결과없음/페이징 */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: numOfRows }).map((_, i) => (
            <div
              key={i}
              className="bg-white/60 rounded-2xl shadow-lg p-6 animate-pulse h-48"
            />
          ))}
        </div>
      ) : error ? (
        <p className="text-center text-red-500 py-8">{error}</p>
      ) : !places.length ? (
        <p className="text-center text-gray-500 py-8">
          검색 결과가 없습니다. 새로운 여행지를 직접 추가해보세요!
        </p>
      ) : (
        <>
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
                <p className="text-gray-600 text-sm text-center">
                  {place.addr1}
                </p>
              </div>
            ))}
          </div>
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-8">
              <button
                className="px-3 py-1 rounded-lg bg-white/80 text-gray-700 shadow hover:bg-pink-100 disabled:opacity-50"
                onClick={() => setPageNo(pageNo - 1)}
                disabled={pageNo === 1}
              >
                이전
              </button>
              {Array.from({ length: totalPages }).map((_, idx) => (
                <button
                  key={idx + 1}
                  className={`px-3 py-1 rounded-lg font-semibold transition-colors duration-200 ${
                    pageNo === idx + 1
                      ? "bg-gradient-to-r from-pink-400 to-purple-400 text-white shadow"
                      : "bg-white text-gray-700 hover:bg-pink-50"
                  }`}
                  onClick={() => setPageNo(idx + 1)}
                >
                  {idx + 1}
                </button>
              ))}
              <button
                className="px-3 py-1 rounded-lg bg-white/80 text-gray-700 shadow hover:bg-pink-100 disabled:opacity-50"
                onClick={() => setPageNo(pageNo + 1)}
                disabled={pageNo === totalPages}
              >
                다음
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
