'use client';

import { format, eachDayOfInterval } from 'date-fns';
//→ format: 날짜를 문자열로 포맷팅 (ex: 2025-07-16)
//→ eachDayOfInterval: 날짜 범위(from~to)를 하루씩 나눈 배열로 만들어줌
import type { DateRange } from 'react-day-picker';
//range 타입 정의용 import. { from: Date, to: Date } 구조

type DailyPlans = {
  [date: string]: { place: string; detail: string }[];
};
//→ 날짜 문자열을 키로 하고, 장소/설명 쌍의 배열을 값으로 가지는 객체
//→ 예: { '2025-07-17': [ { place: '경복궁', detail: '오전 방문' }, ... ] }

type Props = { //DayInputs 컴포넌트가 받는 props 3가지
  range: DateRange | undefined; //날짜 범위
  dailyPlans: DailyPlans; //날짜별 일정 데이터
  setDailyPlans: (plans: DailyPlans) => void; //날짜별 일정 데이터 업데이트 함수
};

export default function DayInputs({ range, dailyPlans, setDailyPlans }: Props) {
  
  const selectedDates =
    range?.from && range?.to
      ? eachDayOfInterval({ start: range.from, end: range.to })
      : [];
    //→ 날짜 범위가 존재하면 from~to 사이의 날짜들을 배열로 생성
    //→ 예: [7/17, 7/18, 7/19]

  const handleInputChange = ( //장소/설명 입력 필드 변경 시 호출되는 함수
    date: string,
    index: number,
    field: 'place' | 'detail',
    value: string
  ) => {
    setDailyPlans((prev) => {
      const current = prev[date] || []; //해당 날짜에 이미 저장된 일정 배열을 꺼냄 (없으면 빈 배열)
      const updated = [...current];
      updated[index] = { ...updated[index], [field]: value }; //해당 인덱스의 객체를 업데이트
      return { ...prev, [date]: updated };
    });
  };

  const handleAddEntry = (date: string) => { //항목 추가 버튼 클릭 시 호출되는 함수
    setDailyPlans((prev) => {
      const current = prev[date] || [];
      return {
        ...prev,
        [date]: [...current, { place: '', detail: '' }],
      };
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-h-[80vh] overflow-y-auto">
      <h2 className="text-xl font-bold mb-4">일정 입력</h2>
      {selectedDates.length === 0 ? (
        <p className="text-gray-500">날짜를 선택하면 일정 입력란이 표시됩니다.</p>
      ) : (
        selectedDates.map((date) => { //각 날짜별로 입력 필드 표시
          const dateStr = format(date, 'yyyy-MM-dd');
          const entries = dailyPlans[dateStr] || [];

          return (
            <div key={dateStr} className="mb-10 border-b pb-6">
              <h3 className="font-semibold mb-3 text-lg text-purple-700">
                {dateStr}
              </h3>

              <div className="flex flex-col gap-4">
                {entries.map((entry, idx) => ( //각 날짜별 장소/설명 입력 필드 표시
                  <div key={idx} className="space-y-2">
                    <input
                      type="text"
                      placeholder="여행지 이름"
                      value={entry.place}
                      onChange={(e) =>
                        handleInputChange(dateStr, idx, 'place', e.target.value)
                      }
                      className="w-full p-2 rounded border"
                    />
                    <textarea
                      placeholder="상세 설명"
                      value={entry.detail}
                      onChange={(e) =>
                        handleInputChange(dateStr, idx, 'detail', e.target.value)
                      }
                      className="w-full p-2 rounded border"
                    />
                  </div>
                ))}
              </div>

              <button
                onClick={() => handleAddEntry(dateStr)}
                className="mt-4 px-3 py-1 bg-gray-200 text-sm rounded hover:bg-gray-300"
              >
                + 항목 추가
              </button>
            </div>
          );
        })
      )}
    </div>
  );
}