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
          className="flex flex-col items-center justify-center w-full h-40 mb-4 bg-gray-100 rounded-xl relative overflow-hidden"
          style={{ maxWidth: 320 }}
        >
          <img
            src="/images/h1trip-logo.png"
            alt="로고"
            className="absolute inset-0 w-full h-full object-contain opacity-25 pointer-events-none select-none"
            draggable={false}
          />
          <span className="relative z-10 text-sm text-gray-400 font-semibold">
            대체 이미지 입니다.
          </span>
        </div>
      )}
      <h3 className="text-lg font-bold text-gray-800 mb-2 text-center">
        {place.title}
      </h3>
      <p className="text-gray-600 text-sm text-center">{place.addr1}</p>
    </div>
  );
}
//받아오는 관광지, 식당, 숙소 정보들
