export default function CategoryTabs({ category, setCategory, categories }) {
  return (
    <div className="flex gap-2 bg-white/60 rounded-xl p-2 shadow-sm">
      {categories.map((cat) => (
        <button
          key={cat.id}
          className={`px-4 py-2 rounded-lg font-semibold transition-colors duration-200
            ${
              category === cat.id
                ? "bg-gradient-to-r from-pink-400 to-purple-400 text-white shadow"
                : "bg-white text-gray-700 hover:bg-pink-50"
            }`}
          onClick={() => setCategory(cat.id)}
        >
          {cat.name}
        </button>
      ))}
    </div>
  );
}
