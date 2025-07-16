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
          className={`flex justify-center items-center rounded-full px-6 py-3 min-w-[120px] shadow text-base font-bold transition whitespace-nowrap
            ${
              subCategory === sub.code
                ? "bg-pink-300 text-white scale-105"
                : "bg-gray-100 text-gray-700 hover:bg-pink-50"
            }`}
          onClick={() => setSubCategory(sub.code)}
        >
          {sub.name}
        </button>
      ))}
    </div>
  );
}
