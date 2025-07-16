export default function SubCategoryTabs({
  category,
  subCategory,
  setSubCategory,
  subCategories,
}) {
  if (!subCategories.length) return null;
  const subs = [{ name: "전체", code: "" }, ...subCategories];
  return (
    <div className="grid grid-cols-3 gap-4">
      {subs.map((sub) => (
        <button
          key={sub.code}
          className={`rounded-full px-6 py-3 min-w-[120px] shadow text-lg font-bold transition
            ${
              subCategory === sub.code
                ? "bg-gradient-to-r from-blue-400 to-cyan-400 text-white scale-105"
                : "bg-gray-100 text-gray-700 hover:bg-blue-50"
            }`}
          onClick={() => setSubCategory(sub.code)}
        >
          {sub.name}
        </button>
      ))}
    </div>
  );
}
