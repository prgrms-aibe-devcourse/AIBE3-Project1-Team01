export default function SubCategoryTabs({
  category,
  subCategory,
  setSubCategory,
  subCategories,
}) {
  if (!subCategories.length) return null;
  return (
    <div className="flex gap-2 bg-white/60 rounded-xl p-2 shadow-sm">
      <button
        className={`px-4 py-2 rounded-lg font-semibold transition-colors duration-200 ${
          subCategory === ""
            ? "bg-gradient-to-r from-blue-400 to-cyan-400 text-white shadow"
            : "bg-white text-gray-700 hover:bg-blue-50"
        }`}
        onClick={() => setSubCategory("")}
      >
        전체
      </button>
      {subCategories.map((sub) => (
        <button
          key={sub.code}
          className={`px-4 py-2 rounded-lg font-semibold transition-colors duration-200 ${
            subCategory === sub.code
              ? "bg-gradient-to-r from-blue-400 to-cyan-400 text-white shadow"
              : "bg-white text-gray-700 hover:bg-blue-50"
          }`}
          onClick={() => setSubCategory(sub.code)}
        >
          {sub.name}
        </button>
      ))}
    </div>
  );
}
