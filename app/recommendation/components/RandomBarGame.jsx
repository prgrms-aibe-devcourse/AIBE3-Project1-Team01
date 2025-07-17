import { useState, useRef, useEffect } from "react";

export default function RandomBarGame({ items, onComplete, onClose }) {
  const [isSpinning, setIsSpinning] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [result, setResult] = useState(null);
  const animationRef = useRef();
  const repeatCount = 30; // 리스트 반복 횟수(무한 스크롤처럼 보이게)
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

    // 결과는 미리 결정
    const finalItemIndex = Math.floor(Math.random() * items.length);
    const finalIndex = centerIndex + finalItemIndex; // 중앙에 결과가 오도록
    let tick = 0;
    let speed = 32; // ms
    let totalTicks = finalIndex - currentIndex; // 현재 위치에서 결과까지 이동

    function spin() {
      setCurrentIndex((prev) => prev + 1);
      tick++;
      // 마지막 12회만 점점 느려지게
      if (tick > totalTicks - 12) speed += 18;
      else if (tick > totalTicks - 24) speed += 4;
      // 그 전에는 일정한 속도

      if (tick < totalTicks) {
        animationRef.current = setTimeout(spin, speed);
      } else {
        setCurrentIndex(finalIndex);
        setTimeout(() => {
          setResult(items[finalItemIndex]);
          setIsSpinning(false);
          if (onComplete) onComplete(items[finalItemIndex]);
        }, 400);
      }
    }
    spin();
  };

  // 정리
  useEffect(() => {
    return () => {
      if (animationRef.current) clearTimeout(animationRef.current);
    };
  }, []);

  return (
    <div className="text-center">
      <h3 className="text-2xl font-bold mb-6 text-pink-600">🎲 랜덤 선택</h3>
      <div className="relative mb-8 flex justify-center">
        <div className="w-64 h-32 bg-gradient-to-b from-gray-50 to-gray-100 rounded-2xl border-2 border-gray-200 overflow-hidden relative">
          <div
            className="relative transition-transform duration-300 ease-out"
            style={{
              transform: `translateY(-${currentIndex * 40}px)`,
            }}
          >
            {displayItems.map((item, index) => (
              <div
                key={index}
                className={`h-10 flex items-center justify-center font-bold text-lg transition-all duration-200 whitespace-nowrap overflow-hidden text-ellipsis px-2 ${
                  index === currentIndex + 4 // 중앙에 오도록
                    ? "text-pink-600 scale-110"
                    : "text-gray-400"
                }`}
                style={{ maxWidth: 220 }}
              >
                {item}
              </div>
            ))}
          </div>
          <div className="absolute top-12 left-0 right-0 transform -translate-y-12 bg-gradient-to-r from-transparent via-pink-100 to-transparent border-y-2 border-pink-300 pointer-events-none"></div>
          <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-white to-transparent pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white to-transparent pointer-events-none"></div>
        </div>
      </div>
      {!isSpinning && !result && (
        <button
          onClick={startSpinning}
          className="px-6 py-3 rounded-full font-bold text-base shadow-lg transition-all duration-300 transform hover:scale-105 bg-gradient-to-r from-pink-400 to-purple-500 text-white hover:from-pink-500 hover:to-purple-600"
        >
          <div className="flex items-center gap-2">
            <span>🎲</span>
            <span>랜덤 선택 시작</span>
          </div>
        </button>
      )}
      {result && (
        <div className="mt-6 p-6 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-xl border-2 border-yellow-300">
          <h3 className="text-xl font-bold text-center text-orange-600 mb-4">
            🎉 선택된 결과
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
