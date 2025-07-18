import { CATEGORY_TREE } from "../constants/travelData";

export default function SubCategoryTabs({
  category,
  cat1,
  setCat1,
  cat2,
  setCat2,
  cat3,
  setCat3,
  categoryTree,
}) {
  if (!category || !categoryTree[category]) return null;
  const cat1List = Object.keys(categoryTree[category].cat1);
  const cat2List = cat1
    ? Object.keys(categoryTree[category].cat1[cat1]?.cat2 || {})
    : [];
  const cat3List =
    cat1 && cat2
      ? Object.keys(categoryTree[category].cat1[cat1].cat2[cat2]?.cat3 || {})
      : [];

  return (
    <div className="flex flex-col gap-4">
      {/* 대분류(cat1) */}
      <div className="flex flex-wrap gap-2">
        {cat1List.map((c1) => (
          <button
            key={c1}
            className={`px-4 py-2 rounded-full border text-sm font-medium transition
              ${
                cat1 === c1
                  ? "bg-my-coral text-white border-my-coral"
                  : "bg-my-off-white text-my-dark-gray border-gray-200 hover:bg-my-peach"
              }`}
            onClick={() => {
              setCat1(c1);
              setCat2("");
              setCat3("");
            }}
          >
            {c1}
          </button>
        ))}
      </div>
      {/* 중분류(cat2) */}
      {cat1 && cat2List.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {cat2List.map((c2) => (
            <button
              key={c2}
              className={`px-4 py-2 rounded-full border text-sm font-medium transition
                ${
                  cat2 === c2
                    ? "bg-my-coral text-white border-my-coral"
                    : "bg-my-off-white text-my-dark-gray border-gray-200 hover:bg-my-peach"
                }`}
              onClick={() => {
                setCat2(c2);
                setCat3("");
              }}
            >
              {c2}
            </button>
          ))}
        </div>
      )}
      {/* 소분류(cat3) */}
      {cat1 && cat2 && cat3List.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {cat3List.map((c3) => (
            <button
              key={c3}
              className={`px-4 py-2 rounded-full border text-sm font-medium transition
                ${
                  cat3 === c3
                    ? "bg-my-coral text-white border-my-coral"
                    : "bg-my-off-white text-my-dark-gray border-gray-200 hover:bg-my-peach"
                }`}
              onClick={() => setCat3(c3)}
            >
              {c3}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
// 트리형 카테고리 분류 선택 함수
