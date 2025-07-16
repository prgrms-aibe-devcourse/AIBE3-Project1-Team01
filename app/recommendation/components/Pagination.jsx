// app/recommendation/components/Pagination.jsx
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
        className="px-3 py-1 rounded-lg bg-white/80 text-gray-700 shadow hover:bg-pink-100 disabled:opacity-50"
        onClick={() => onPageChange(pageNo - 1)}
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
                ? "bg-pink-300 text-white shadow"
                : "bg-white text-gray-700 hover:bg-pink-50"
            }`}
            onClick={() => onPageChange(num)}
          >
            {num}
          </button>
        )
      )}
      <button
        className="px-3 py-1 rounded-lg bg-white/80 text-gray-700 shadow hover:bg-pink-100 disabled:opacity-50"
        onClick={() => onPageChange(pageNo + 1)}
        disabled={pageNo === totalPages}
      >
        다음
      </button>
    </div>
  );
}
