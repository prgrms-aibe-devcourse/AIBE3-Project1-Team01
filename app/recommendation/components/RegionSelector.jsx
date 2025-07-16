export default function RegionSelector({ areaCode, setAreaCode, areaCodes }) {
  return (
    <select
      className="rounded-xl border border-gray-200 px-4 py-2 shadow-sm bg-white/80 focus:outline-none focus:ring-2 focus:ring-pink-300 text-gray-700 text-base"
      value={areaCode}
      onChange={(e) => setAreaCode(Number(e.target.value))}
    >
      {areaCodes.map((region) => (
        <option key={region.code} value={region.code}>
          {region.name}
        </option>
      ))}
    </select>
  );
}
