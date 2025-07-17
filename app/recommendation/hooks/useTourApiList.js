// app/recommendation/components/useTourApiList.js
import { useState, useEffect } from "react";

// 지역별 대표 좌표 매핑 (필요하다면 이 파일로 옮기세요)
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

export default function useTourApiList({
  areaCode,
  contentTypeId,
  cat1,
  cat2,
  keyword,
  pageNo,
  numOfRows,
}) {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const apiKey = process.env.NEXT_PUBLIC_TOUR_API_KEY;
        const encodedKey = encodeURIComponent(apiKey);
        let url, data;
        if (keyword.trim()) {
          url = `https://apis.data.go.kr/B551011/KorService2/searchKeyword2?serviceKey=${encodedKey}&MobileOS=ETC&MobileApp=AppTest&keyword=${encodeURIComponent(
            keyword
          )}&numOfRows=${numOfRows}&pageNo=${pageNo}&_type=json`;
          if (areaCode !== "") url += `&areaCode=${areaCode}`;
          if (contentTypeId !== "") url += `&contentTypeId=${contentTypeId}`;
          if (cat1 !== "") url += `&cat1=${cat1}`;
          if (cat2 !== "") url += `&cat2=${cat2}`;
        } else {
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
  }, [areaCode, contentTypeId, cat1, cat2, keyword, pageNo, numOfRows]);

  return { places, loading, error, totalCount };
}
// tour api 연동
