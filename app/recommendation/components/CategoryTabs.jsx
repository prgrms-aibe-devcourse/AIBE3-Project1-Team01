import { CATEGORY_TREE } from "../constants/travelData";

export default function CategoryTabs({ category, setCategory, categoryTree }) {
  const topCategories = Object.keys(categoryTree);
  return (
    <div className="flex flex-wrap gap-2">
      {topCategories.map((cat) => (
        <button
          key={cat}
          className={`px-4 py-2 rounded-full border text-sm font-medium transition
            ${
              category === cat
                ? "bg-my-coral text-white border-my-coral"
                : "bg-my-off-white text-my-dark-gray border-gray-200 hover:bg-my-peach"
            }`}
          onClick={() => setCategory(cat)}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}
// 카테고리 선택하는 함수
