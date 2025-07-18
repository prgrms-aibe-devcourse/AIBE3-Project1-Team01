import { useState, useEffect } from "react";
import RandomBarGame from "../game/RandomBarGame";

const GAME_TYPES = [
  {
    id: "places",
    label: "🎯 여행지로 게임",
    color: "from-blue-400 to-purple-500",
    description: "검색된 여행지들 중에서 랜덤 선택!",
    bgColor: "from-blue-50 to-purple-50",
    type: "places",
  },
  {
    id: "custom",
    label: "✏️ 직접 입력해서 게임",
    color: "from-pink-400 to-purple-500",
    description: "원하는 선택지를 직접 입력해서 랜덤 선택!",
    bgColor: "from-pink-50 to-purple-50",
    type: "custom",
  },
];

export default function CustomGameModal({ isOpen, onClose, places = [] }) {
  const [step, setStep] = useState("gameSelect"); // "gameSelect" | "inputSetup" | "gamePlay"
  const [selectedGame, setSelectedGame] = useState(null);
  const [inputs, setInputs] = useState([""]);
  const [gameResult, setGameResult] = useState(null);
  const maxCount = 20;

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleGameSelect = (game) => {
    setSelectedGame(game);
    if (game.type === "places") {
      setStep("gamePlay");
      setGameResult(null);
    } else {
      setStep("inputSetup");
    }
  };

  const handleInputChange = (idx, value) => {
    const newInputs = [...inputs];
    newInputs[idx] = value;
    setInputs(newInputs);
  };

  const handleAddInput = () => {
    if (inputs.length < maxCount) setInputs([...inputs, ""]);
  };

  const handleRemoveInput = (idx) => {
    if (inputs.length === 1) return;
    setInputs(inputs.filter((_, i) => i !== idx));
  };

  const handleStartGame = () => {
    const validInputs = inputs.filter(Boolean);
    if (validInputs.length < 2) return;
    setStep("gamePlay");
    setGameResult(null);
  };

  const handleGameComplete = (result) => {
    setGameResult(result);
  };

  const handleBackToGameSelect = () => {
    setStep("gameSelect");
    setSelectedGame(null);
    setInputs([""]); // Reset inputs when going back to game select
    setGameResult(null);
  };

  const handleBackToSetup = () => {
    setStep("inputSetup");
    setGameResult(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto border-4 border-my-aqua">
        {/* 헤더 */}
        <div className="flex justify-between items-center mb-6">
          {/* 왼쪽: 게임 선택으로 버튼 (gamePlay 단계에서만) */}
          {step === "gamePlay" ? (
            <button
              onClick={handleBackToGameSelect}
              className="px-4 py-2 bg-my-aqua text-my-dark-gray rounded-lg hover:bg-my-coral transition-colors font-bold"
              style={{ fontFamily: "'Jua', 'WoowahanBrothers', sans-serif" }}
            >
              게임 선택으로
            </button>
          ) : (
            <div />
          )}
          {/* 중앙 타이틀 */}
          <h2
            className="text-2xl font-bold text-gray-800"
            style={{ fontFamily: "'Jua', 'WoowahanBrothers', sans-serif" }}
          >
            {step === "gameSelect" && "게임으로 선택하기"}
            {step === "inputSetup" && "게임 설정"}
            {/* 게임플레이 단계에서는 타이틀을 표시하지 않음 */}
          </h2>
          {/* 오른쪽: 닫기 버튼 */}
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-my-aqua text-2xl font-bold"
          >
            ×
          </button>
        </div>

        {/* 게임 선택 화면 */}
        {step === "gameSelect" && (
          <div className="space-y-6">
            <p
              className="text-center text-gray-600 mb-6"
              style={{ fontFamily: "'Jua', 'WoowahanBrothers', sans-serif" }}
            >
              원하는 게임 방식을 선택해주세요!
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {GAME_TYPES.map((game) => (
                <button
                  key={game.id}
                  onClick={() => handleGameSelect(game)}
                  disabled={game.id === "places" && places.length === 0}
                  className={`p-6 rounded-2xl border-2 transition-all duration-300 transform hover:scale-105 hover:shadow-xl ${
                    game.id === "places" && places.length === 0
                      ? "bg-gray-100 border-gray-200 cursor-not-allowed opacity-50"
                      : "bg-my-aqua border-my-aqua hover:border-my-coral"
                  }`}
                  style={{
                    fontFamily: "'Jua', 'WoowahanBrothers', sans-serif",
                  }}
                >
                  <h3
                    className="text-xl font-bold text-gray-800 mb-2"
                    style={{
                      fontFamily: "'Jua', 'WoowahanBrothers', sans-serif",
                    }}
                  >
                    {game.label.replace(/[^가-힣a-zA-Z0-9 ]/g, "")}
                  </h3>
                  <p
                    className="text-sm text-gray-600"
                    style={{
                      fontFamily: "'Jua', 'WoowahanBrothers', sans-serif",
                    }}
                  >
                    {game.description}
                  </p>
                  {game.id === "places" && places.length === 0 && (
                    <p className="text-xs text-red-500 mt-2">
                      먼저 여행지를 검색해주세요!
                    </p>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 선택지 입력 화면 */}
        {step === "inputSetup" && (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3
                className="text-xl font-bold text-gray-800 mb-2"
                style={{ fontFamily: "'Jua', 'WoowahanBrothers', sans-serif" }}
              >
                직접 입력
              </h3>
              <p
                className="text-gray-600"
                style={{ fontFamily: "'Jua', 'WoowahanBrothers', sans-serif" }}
              >
                원하는 선택지를 직접 입력해서 랜덤으로 뽑아보세요!
              </p>
            </div>

            <div className="bg-my-aqua/30 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3
                  className="text-lg font-bold text-gray-800"
                  style={{
                    fontFamily: "'Jua', 'WoowahanBrothers', sans-serif",
                  }}
                >
                  선택지 입력 (최대 20개)
                </h3>
                <button
                  onClick={handleAddInput}
                  disabled={inputs.length >= maxCount}
                  className="px-4 py-2 rounded-lg bg-my-aqua text-my-dark-gray font-bold text-sm disabled:opacity-50 hover:bg-my-coral transition-colors"
                  style={{
                    fontFamily: "'Jua', 'WoowahanBrothers', sans-serif",
                  }}
                >
                  + 추가
                </button>
              </div>

              <div className="space-y-3">
                {inputs.map((value, idx) => (
                  <div key={idx} className="flex gap-3 items-center group">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-my-aqua text-my-dark-gray text-sm font-bold flex items-center justify-center">
                      {idx + 1}
                    </div>
                    <input
                      type="text"
                      value={value}
                      onChange={(e) => handleInputChange(idx, e.target.value)}
                      className="flex-1 px-4 py-3 border-2 border-my-aqua rounded-lg focus:outline-none focus:ring-2 focus:ring-my-aqua focus:border-my-aqua transition-all"
                      maxLength={20}
                      placeholder={`선택지 ${idx + 1}을 입력하세요`}
                      style={{
                        fontFamily: "'Jua', 'WoowahanBrothers', sans-serif",
                      }}
                    />
                    <button
                      onClick={() => handleRemoveInput(idx)}
                      disabled={inputs.length === 1}
                      className="px-3 py-3 text-gray-400 hover:text-red-500 disabled:opacity-40 transition-colors rounded-lg hover:bg-red-50"
                    >
                      삭제
                    </button>
                  </div>
                ))}
              </div>

              <div
                className="mt-4 text-sm text-gray-500 text-center"
                style={{ fontFamily: "'Jua', 'WoowahanBrothers', sans-serif" }}
              >
                최소 2개 이상 입력해주세요
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleBackToGameSelect}
                className="flex-1 px-6 py-3 bg-my-aqua text-my-dark-gray rounded-xl font-bold hover:bg-my-coral transition-colors"
                style={{ fontFamily: "'Jua', 'WoowahanBrothers', sans-serif" }}
              >
                게임 선택으로
              </button>
              <button
                onClick={handleStartGame}
                disabled={inputs.filter(Boolean).length < 2}
                className={`flex-1 px-6 py-3 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 disabled:opacity-50 bg-my-aqua text-my-dark-gray hover:bg-my-coral`}
                style={{ fontFamily: "'Jua', 'WoowahanBrothers', sans-serif" }}
              >
                게임 시작하기
              </button>
            </div>
          </div>
        )}

        {/* 게임 실행 화면 */}
        {step === "gamePlay" && (
          <div>
            {/* 게임 선택으로 버튼은 헤더로 이동됨 */}
            {selectedGame?.type === "places" ? (
              <RandomBarGame
                items={places.map((place) => place.title)}
                onComplete={handleGameComplete}
                onClose={onClose}
              />
            ) : (
              <RandomBarGame
                items={inputs.filter(Boolean)}
                onComplete={handleGameComplete}
                onClose={onClose}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
