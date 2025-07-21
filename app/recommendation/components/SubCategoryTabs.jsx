import { useEffect } from "react";
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

  useEffect(() => {
    let nextCat2 = cat2;
    let nextCat3 = cat3;
    if (
      cat1 &&
      cat2List.length === 1 &&
      cat2List[0] === cat1 &&
      cat2 !== cat2List[0]
    ) {
      nextCat2 = cat2List[0];
      setCat2(nextCat2);
      return;
    }
    if (
      cat2 &&
      cat3List.length === 1 &&
      cat3List[0] === cat2 &&
      cat3 !== cat3List[0]
    ) {
      nextCat3 = cat3List[0];
      setCat3(nextCat3);
      return;
    }
  }, [cat1, cat2, cat2List, cat3List, setCat2, setCat3, cat3]);

  const showCat2 = !(cat1 && cat2List.length === 1 && cat2List[0] === cat1);
  const showCat3 = !(cat2 && cat3List.length === 1 && cat3List[0] === cat2);

  // 오른쪽 화살표 SVG 구분자
  const ArrowDivider = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="currentColor"
      className="w-4 h-4 mr-2 text-my-dark-gray"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
      />
    </svg>
  );
  // 닫기(엑스) SVG 구분자
  const CloseDivider = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="currentColor"
      className="w-4 h-4 mr-2 text-my-dark-gray"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m4.5 4.5 15 15m0 0V8.25m0 11.25H8.25"
      />
    </svg>
  );

  return (
    <div className="flex flex-col gap-0 p-2">
      {/* 대분류 */}
      <div className="flex flex-wrap gap-3 mb-4">
        {cat1List.map((c1) => (
          <button
            key={c1}
            className={`px-4 py-2 rounded-full border text-sm font-medium transition whitespace-nowrap
              ${
                cat1 === c1
                  ? "bg-my-coral text-white border-my-coral shadow-md ring-2 ring-my-coral"
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
      {/* 중분류 */}
      {cat1 && cat2List.length > 0 && showCat2 && (
        <div className="flex flex-wrap gap-3 mb-4 ml-4">
          {cat2List.map((c2, idx) => (
            <div key={c2} className="flex items-center">
              {idx === 0 && (cat2 ? CloseDivider : ArrowDivider)}
              <button
                className={`px-4 py-2 rounded-full border text-sm font-medium transition whitespace-nowrap
                  ${
                    cat2 === c2
                      ? "bg-my-coral text-white border-my-coral shadow-md ring-2 ring-my-coral"
                      : "bg-my-off-white text-my-dark-gray border-gray-200 hover:bg-my-peach"
                  }`}
                onClick={() => {
                  setCat2(c2);
                  setCat3("");
                }}
              >
                {c2}
              </button>
            </div>
          ))}
        </div>
      )}
      {/* 소분류 */}
      {cat1 && cat2 && cat3List.length > 0 && showCat3 && (
        <div className="flex flex-wrap gap-3 mb-4 ml-8">
          {cat3List.map((c3, idx) => (
            <div key={c3} className="flex items-center">
              {idx === 0 && ArrowDivider}
              <button
                className={`px-4 py-2 rounded-full border text-sm font-medium transition whitespace-nowrap
                  ${
                    cat3 === c3
                      ? "bg-my-coral text-white border-my-coral shadow-md ring-2 ring-my-coral"
                      : "bg-my-off-white text-my-dark-gray border-gray-200 hover:bg-my-peach"
                  }`}
                onClick={() => setCat3(c3)}
              >
                {c3}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
// 트리형 카테고리 분류 선택 함수
