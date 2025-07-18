export default function SearchBar({
  keyword,
  setKeyword,
  onSearch,
  onGameSelect,
  totalCount,
}) {
  return (
    <div className="mb-8 flex items-center justify-center gap-4">
      {typeof totalCount === "number" && (
        <div className="text-base text-my-dark-gray whitespace-nowrap">
          총 <span className="font-bold">{totalCount.toLocaleString()}</span>건
        </div>
      )}
      <div className="relative w-72">
        <input
          type="text"
          placeholder="장소, 키워드로 검색해보세요!"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") onSearch();
          }}
          className="rounded-full border border-my-aqua px-5 py-3 shadow bg-my-off-white focus:outline-none focus:ring-2 focus:ring-my-coral text-my-dark-gray text-base w-full pr-12"
        />
        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-my-coral">
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
        className="px-6 py-3 rounded-full bg-my-coral text-my-dark-gray font-bold shadow hover:bg-my-aqua transition"
        onClick={onGameSelect}
        style={{ fontFamily: "'Jua', Woowahan Brothers" }}
      >
        랜덤으로 여행지 추천
      </button>
    </div>
  );
}
// 키워드 검색 함수
