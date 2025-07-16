export default function CategoryTabs({ category, setCategory, categories }) {
  const cats = [{ name: "전체", id: "" }, ...categories];
  return (
    <div className="grid grid-cols-3 gap-4">
      {cats.map((cat) => (
        <button
          key={cat.id}
          className={`rounded-full px-6 py-3 min-w-[120px] shadow text-lg font-bold transition
            ${
              category === cat.id
                ? "bg-gradient-to-r from-pink-400 to-purple-400 text-white scale-105"
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
