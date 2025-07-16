export default function TourCard({ place, onClick }) {
  return (
    <div
      className="bg-white/60 rounded-2xl shadow-lg p-6 flex flex-col items-center cursor-pointer transition-transform duration-200 hover:scale-105 hover:shadow-2xl active:scale-95"
      onClick={onClick}
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
      <p className="text-gray-600 text-sm text-center">{place.addr1}</p>
    </div>
  );
}
