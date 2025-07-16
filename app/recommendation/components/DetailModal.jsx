// app/recommendation/components/DetailModal.jsx
import { useState, useEffect } from "react";

export default function DetailModal({ contentid, onClose }) {
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
