import { useState, useEffect } from "react";
import TourCard from "./TourCard";
import Pagination from "./Pagination";
import SearchBar from "./SearchBar";
import DetailModal from "./DetailModal";
import useTourApiList from "../hooks/useTourApiList";

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

export default function TourApiList({
  areaCode,
  contentTypeId,
  cat1,
  cat2,
  onPlacesUpdate,
  searchKeyword = "",
}) {
  const [pageNo, setPageNo] = useState(1);
  const numOfRows = 12;
  const [selectedId, setSelectedId] = useState(null);

  // 검색 조건/키워드 변경 시 페이지 초기화
  useEffect(() => {
    setPageNo(1);
  }, [areaCode, contentTypeId, cat1, cat2, searchKeyword]);

  const { places, loading, error, totalCount } = useTourApiList({
    areaCode,
    contentTypeId,
    cat1,
    cat2,
    keyword: searchKeyword,
    pageNo,
    numOfRows,
  });
  const totalPages = Math.ceil(totalCount / numOfRows);

  // places 데이터가 변경될 때마다 상위 컴포넌트에 전달
  useEffect(() => {
    if (onPlacesUpdate && places) {
      onPlacesUpdate(places);
    }
  }, [places, onPlacesUpdate]);

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
              <TourCard
                key={`${place.contentid}-${idx}`}
                place={place}
                onClick={() => setSelectedId(place.contentid)}
              />
            ))}
          </div>
          {/* Pagination */}
          {totalPages > 1 && (
            <Pagination
              pageNo={pageNo}
              totalPages={totalPages}
              pageNumbers={pageNumbers}
              onPageChange={setPageNo}
            />
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
//메인 리스트 함수
