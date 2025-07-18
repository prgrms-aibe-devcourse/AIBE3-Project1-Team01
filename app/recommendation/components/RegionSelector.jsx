export default function RegionSelector({ areaCode, setAreaCode, areaCodes }) {
  const regions = areaCodes;
  return (
    <div className="flex flex-wrap gap-2">
      {regions.map((region) => (
        <button
          key={region.code}
          className={`px-4 py-2 rounded-full border text-sm font-medium transition
            ${
              areaCode === region.code
                ? "bg-my-coral text-white border-my-coral"
                : "bg-my-off-white text-my-dark-gray border-gray-200 hover:bg-my-peach"
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
