import { useState, useEffect } from "react";
import TourCard from "./TourCard";
import Pagination from "./Pagination";
import SearchBar from "./SearchBar";
import DetailModal from "./DetailModal";
import useTourApiList from "../hooks/useTourApiList";
import { AREA_COORDS } from "../constants/areaCoords";

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
