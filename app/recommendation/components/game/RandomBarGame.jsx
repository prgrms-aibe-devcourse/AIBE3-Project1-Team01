import { useState, useRef, useEffect } from "react";

export default function RandomBarGame({ items, onComplete, onClose }) {
  const [isSpinning, setIsSpinning] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [result, setResult] = useState(null);
  const animationRef = useRef();
  const itemHeight = 30;
  const visibleCount = 3;
  const centerOffset = Math.floor(visibleCount / 2);
  const repeatCount = 30;
  const minSpins = 5;
  const totalItems = items.length * repeatCount;
  const displayItems = Array.from(
    { length: totalItems },
    (_, i) => items[i % items.length]
  );
  const centerIndex = Math.floor(totalItems / 2);

  const startSpinning = () => {
    if (items.length < 2) return;
    setIsSpinning(true);
    setResult(null);

    const finalItemIndex = Math.floor(Math.random() * items.length);

    let finalIndex = currentIndex + items.length * minSpins + finalItemIndex;

    finalIndex = Math.min(finalIndex, displayItems.length - 1);
    let tick = 0;
    let speed = 32; // ms
    let totalTicks = finalIndex - currentIndex; // 현재 위치에서 결과까지 이동

    function spin() {
      setCurrentIndex((prev) => prev + 1);
      tick++;
      if (tick > totalTicks - 12) speed += 18;
      else if (tick > totalTicks - 24) speed += 4;

      if (tick < totalTicks) {
        animationRef.current = setTimeout(spin, speed);
      } else {
        setCurrentIndex(finalIndex);
        setTimeout(() => {
          console.log("currentIndex:", currentIndex);
          console.log("finalIndex:", finalIndex);
          console.log("displayItems[finalIndex]:", displayItems[finalIndex]);
          console.log(
            "displayItems[currentIndex]:",
            displayItems[currentIndex]
          );
          setResult(displayItems[finalIndex]);
          setIsSpinning(false);
          if (onComplete) onComplete(displayItems[finalIndex]);
        }, 400);
      }
    }
    spin();
  };

  useEffect(() => {
    return () => {
      if (animationRef.current) clearTimeout(animationRef.current);
    };
  }, []);

  return (
    <div
      className="text-center"
      style={{ fontFamily: "'Jua', 'WoowahanBrothers', sans-serif" }}
    >
      <h3 className="text-2xl font-bold mb-6 text-pink-600">랜덤 선택</h3>
      <div className="relative mb-8 flex justify-center">
        <div
          className="w-96 bg-gradient-to-b from-gray-50 to-gray-100 rounded-2xl border-2 border-gray-200 overflow-hidden relative flex flex-col justify-center"
          style={{ height: `${itemHeight * visibleCount}px` }}
        >
          <div
            className="relative transition-transform duration-300 ease-out"
            style={{
              transform: `translateY(-${currentIndex * itemHeight}px)`,
            }}
          >
            {displayItems.map((item, index) => (
              <div
                key={index}
                className={`flex items-center justify-center font-bold text-lg transition-all duration-200 whitespace-nowrap overflow-hidden text-ellipsis ${
                  index === currentIndex + centerOffset
                    ? "text-pink-600 scale-110 bg-white border-2 border-orange-400 rounded-lg shadow-md z-10"
                    : "text-gray-400"
                }`}
                style={{
                  maxWidth: 600,
                  height: `${itemHeight}px`,
                  lineHeight: `${itemHeight}px`,
                  padding: 0,
                  transform: "translateY(-15px)",
                }}
              >
                {item}
              </div>
            ))}
          </div>
          {/* 중앙 테두리 (2번째 줄) */}
          <div
            className="pointer-events-none absolute left-0 right-0 z-20"
            style={{
              top: `calc(50% - ${itemHeight / 2}px)`,
              height: `${itemHeight}px`,
              border: "2px solid-my-aqua",
              borderRadius: "12px",
              boxShadow: "0 0 8px 2px #f59e4280",
            }}
          />
        </div>
      </div>
      {!isSpinning && !result && (
        <button
          onClick={startSpinning}
          className="px-6 py-3 rounded-full font-bold text-base shadow-lg transition-all duration-300 transform hover:scale-105 bg-my-aqua text-my-dark-gray hover:from-pink-500 hover:to-purple-600"
        >
          <div className="flex items-center gap-2">
            <span>시작</span>
          </div>
        </button>
      )}
      {result && (
        <div className="mt-6 p-6 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-xl border-2 border-yellow-300">
          <h3 className="text-xl font-bold text-center text-orange-600 mb-4">
            선택된 결과
          </h3>
          <div className="text-center">
            <p className="font-semibold text-2xl mb-4">{result}</p>
            <div className="flex gap-2 justify-center">
              <button
                onClick={() => {
                  setResult(null);
                  setCurrentIndex(0);
                }}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                다시하기
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}
      {isSpinning && (
        <div className="mt-4">
          <div className="animate-pulse text-pink-600 font-bold">
            선택 중...
          </div>
        </div>
      )}
    </div>
  );
}
