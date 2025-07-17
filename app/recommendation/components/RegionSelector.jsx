export default function RegionSelector({ areaCode, setAreaCode, areaCodes }) {
  const regions = areaCodes;
  return (
    <div className="grid grid-cols-3 gap-4">
      {regions.map((region) => (
        <button
          key={region.code}
          className={`rounded-full px-6 py-3 min-w-[120px] shadow text-base font-bold transition whitespace-nowrap
            ${
              areaCode === region.code
                ? "bg-pink-300 text-white scale-105"
                : "bg-gray-100 text-gray-700 hover:bg-pink-50"
            }`}
          onClick={() => setAreaCode(region.code)}
        >
          {region.name}
        </button>
      ))}
    </div>
  );
}
//지역 선택 함수
