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

function DetailModal({ contentid, onClose }) {
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!contentid) return;
    setLoading(true);
    setError(null);
    setDetail(null);
    const fetchDetail = async () => {
      try {
        const apiKey = process.env.NEXT_PUBLIC_TOUR_API_KEY;
        const encodedKey = encodeURIComponent(apiKey);
        const url = `https://apis.data.go.kr/B551011/KorService2/detailCommon2?serviceKey=${encodedKey}&MobileOS=ETC&MobileApp=AppTest&_type=json&contentId=${contentid}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error("상세 정보 호출 실패");
        const data = await res.json();
        const item = data.response?.body?.items?.item;
        setDetail(Array.isArray(item) ? item[0] : item || null);
        console.log("상세 응답:", item);
      } catch (e) {
        setError("상세 정보를 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [contentid]);

  if (!contentid) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-lg w-full relative animate-bounceIn max-h-[90vh] overflow-y-auto">
        {/* 좌측 상단 로고 */}
        <img
          src="/h1trip-logo.png"
          alt="h1Trip 로고"
          className="absolute top-4 left-4 w-14 h-14 object-contain"
        />
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-2xl text-gray-400 hover:text-pink-400"
        >
          ×
        </button>
        {loading ? (
          <div className="text-center py-12 text-lg font-bold text-pink-400">
            불러오는 중...
          </div>
        ) : error ? (
          <div className="text-center py-12 text-red-500">{error}</div>
        ) : detail ? (
          <div>
            {/* 제목 */}
            <h3 className="text-3xl font-extrabold mb-4 text-center text-pink-300 drop-shadow">
              {detail.title}
            </h3>
            {/* 이미지 */}
            {detail.firstimage ? (
              <img
                src={detail.firstimage}
                alt={detail.title}
                className="w-full h-56 object-cover rounded-2xl mb-6 border-4 border-pink-100 shadow-lg"
              />
            ) : (
              <div className="w-full h-56 flex flex-col items-center justify-center rounded-2xl mb-6 bg-gray-200 text-gray-400">
                {/* ...이미지 없음 SVG... */}
                <span className="text-sm">이미지 없음</span>
              </div>
            )}

            {/* 주소/전화/홈페이지 */}
            <div className="flex flex-col gap-2 items-center mb-4">
              {detail.addr1 && (
                <div className="flex items-center gap-2 text-gray-700">
                  <span>📍</span>
                  <span>{detail.addr1}</span>
                </div>
              )}
              {detail.tel && (
                <div className="flex items-center gap-2 text-gray-700">
                  <span>📞</span>
                  <span>{detail.tel}</span>
                </div>
              )}
              {detail.homepage &&
                detail.homepage.replace(/<[^>]+>/g, "").trim() && (
                  <div className="flex items-center gap-2">
                    <span>🌐</span>
                    <a
                      href={detail.homepage
                        .replace(/<[^>]+>/g, "")
                        .replace('href="', "")
                        .replace('"', "")}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 underline"
                    >
                      홈페이지 바로가기
                    </a>
                  </div>
                )}
            </div>

            {/* 구분선 */}
            <div className="border-t border-pink-200 my-4"></div>

            {/* 설명 */}
            {detail.overview && (
              <div className="text-gray-800 text-base whitespace-pre-line leading-relaxed">
                {detail.overview}
              </div>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default function TourApiList({ areaCode, contentTypeId, cat1, cat2 }) {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pageNo, setPageNo] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [keyword, setKeyword] = useState("");
  const numOfRows = 12;
  const [selectedId, setSelectedId] = useState(null);

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
          if (areaCode !== "") url += `&areaCode=${areaCode}`;
          if (contentTypeId !== "") url += `&contentTypeId=${contentTypeId}`;
          if (cat1 !== "") url += `&cat1=${cat1}`;
          if (cat2 !== "") url += `&cat2=${cat2}`;
        } else {
          // 지역+카테고리 검색
          const coords = AREA_COORDS[areaCode] || AREA_COORDS[1];
          const { mapX, mapY } = coords;
          url = `http://apis.data.go.kr/B551011/KorService2/locationBasedList2?serviceKey=${encodedKey}&numOfRows=${numOfRows}&pageNo=${pageNo}&MobileOS=ETC&MobileApp=AppTest&_type=json&mapX=${mapX}&mapY=${mapY}&radius=20000`;
          if (areaCode !== "") url += `&areaCode=${areaCode}`;
          if (contentTypeId !== "") url += `&contentTypeId=${contentTypeId}`;
          if (cat1 !== "") url += `&cat1=${cat1}`;
          if (cat2 !== "") url += `&cat2=${cat2}`;
        }
        const res = await fetch(url);
        data = await res.json();
        const items = Array.isArray(data.response?.body?.items?.item)
          ? data.response.body.items.item
          : data.response.body.items?.item
          ? [data.response.body.items.item]
          : [];
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

  // 페이지네이션 버튼 계산
  let pageNumbers = [];
  if (totalPages > 1) {
    const window = 2; // 현재 페이지 앞뒤로 몇 개 보여줄지
    let startPage = Math.max(1, pageNo - window);
    let endPage = Math.min(totalPages, pageNo + window);
    if (startPage > 1) pageNumbers.push(1);
    if (startPage > 2) pageNumbers.push("...");
    for (let i = startPage; i <= endPage; i++) pageNumbers.push(i);
    if (endPage < totalPages - 1) pageNumbers.push("...");
    if (endPage < totalPages) pageNumbers.push(totalPages);
  }

  return (
    <div>
      {/* 검색창은 항상 노출 */}
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
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-pink-300">
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
          className="px-6 py-3 rounded-full bg-pink-300 text-white font-bold shadow hover:scale-105 transition"
          onClick={() => setPageNo(1)}
        >
          검색
        </button>
      </div>
      {/* 리스트/로딩/결과없음/페이징 등은 조건부로 */}
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
          검색 결과가 없습니다...!!
        </p>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {places.map((place, idx) => (
              <div
                key={`${place.contentid}-${idx}`}
                className="bg-white/60 rounded-2xl shadow-lg p-6 flex flex-col items-center cursor-pointer transition-transform duration-200 hover:scale-105 hover:shadow-2xl active:scale-95"
                onClick={() => setSelectedId(place.contentid)}
                tabIndex={0}
                aria-label={place.title}
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
            <div className="flex justify-center items-center gap-2 mt-8 flex-wrap">
              <button
                className="px-3 py-1 rounded-lg bg-white/80 text-gray-700 shadow hover:bg-pink-100 disabled:opacity-50"
                onClick={() => setPageNo(pageNo - 1)}
                disabled={pageNo === 1}
              >
                이전
              </button>
              {pageNumbers.map((num, idx) =>
                num === "..." ? (
                  <span key={`ellipsis-${idx}`} className="px-2 text-gray-400">
                    ...
                  </span>
                ) : (
                  <button
                    key={`page-${num}`}
                    className={`px-3 py-1 rounded-lg font-semibold transition-colors duration-200 ${
                      pageNo === num
                        ? "bg-gradient-to-r from-pink-400 to-purple-400 text-white shadow"
                        : "bg-white text-gray-700 hover:bg-pink-50"
                    }`}
                    onClick={() => setPageNo(num)}
                  >
                    {num}
                  </button>
                )
              )}
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
      {/* 상세 정보 모달 */}
      {selectedId && (
        <DetailModal
          contentid={selectedId}
          onClose={() => setSelectedId(null)}
        />
      )}
    </div>
  );
}
