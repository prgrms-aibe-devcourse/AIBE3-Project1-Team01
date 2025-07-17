export default function CategoryTabs({ category, setCategory, categories }) {
  const cats = [{ name: "전체", id: "" }, ...categories];
  return (
    <div className="grid grid-cols-3 gap-4">
      {cats.map((cat) => (
        <button
          key={cat.id}
          className={`rounded-full px-6 py-3 min-w-[120px] shadow text-base font-bold transition whitespace-nowrap
            ${
              category === cat.id
                ? "bg-pink-300 text-white scale-105"
                : "bg-gray-100 text-gray-700 hover:bg-pink-50"
            }`}
          onClick={() => setCategory(cat.id)}
        >
          {cat.name}
        </button>
      ))}
    </div>
  );
}
// 카테고리 선택하는 함수
