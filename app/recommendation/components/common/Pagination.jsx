export default function Pagination({
  pageNo,
  totalPages,
  pageNumbers,
  onPageChange,
}) {
  if (totalPages <= 1) return null;
  return (
    <div className="flex justify-center items-center gap-2 mt-8 flex-wrap">
      <button
        className="px-3 py-1 rounded-lg bg-my-off-white text-my-dark-gray shadow hover:bg-my-peach disabled:opacity-50"
        onClick={() => onPageChange(pageNo - 1)}
        disabled={pageNo === 1}
      >
        이전
      </button>
      {pageNumbers.map((num, idx) =>
        num === "..." ? (
          <span key={`ellipsis-${idx}`} className="px-2 text-my-coral">
            ...
          </span>
        ) : (
          <button
            key={`page-${num}`}
            className={`px-3 py-1 rounded-lg font-semibold transition-colors duration-200 ${
              pageNo === num
                ? "bg-my-coral text-white shadow"
                : "bg-my-off-white text-my-dark-gray hover:bg-my-peach"
            }`}
            onClick={() => onPageChange(num)}
          >
            {num}
          </button>
        )
      )}
      <button
        className="px-3 py-1 rounded-lg bg-my-off-white text-my-dark-gray shadow hover:bg-my-peach disabled:opacity-50"
        onClick={() => onPageChange(pageNo + 1)}
        disabled={pageNo === totalPages}
      >
        다음
      </button>
    </div>
  );
}
//리스트들 페이지 정리
