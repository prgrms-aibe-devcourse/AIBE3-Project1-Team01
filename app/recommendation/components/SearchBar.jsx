// app/recommendation/components/SearchBar.jsx
export default function SearchBar({ keyword, setKeyword, onSearch }) {
  return (
    <div className="mb-8 flex justify-center gap-2">
      <div className="relative w-72">
        <input
          type="text"
          placeholder="장소, 키워드로 검색해보세요!"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") onSearch();
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
        onClick={onSearch}
      >
        검색
      </button>
    </div>
  );
}
