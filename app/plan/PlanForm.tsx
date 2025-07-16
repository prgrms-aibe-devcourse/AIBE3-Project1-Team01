'use client';

import { DayPicker } from 'react-day-picker'; //날짜 선택용 캘린더 컴포넌트 불러옴
import { format } from 'date-fns'; //날짜를 '2025-07-17' 형식으로 바꿔주는 유틸 함수
import 'react-day-picker/dist/style.css'; //얘 왜 호출해야 하는지 모르겠음
import type { DateRange } from 'react-day-picker'; //날짜 범위(from, to)를 나타내는 타입만 불러옴

type Props = {
  range: DateRange | undefined; //DateRange는 { from: Date, to: Date } 같은 형태
  setRange: (range: DateRange | undefined) => void;
  title: string;
  setTitle: (title: string) => void;
  description: string;
  setDescription: (desc: string) => void;
};

export default function PlanForm({
  range,
  setRange,
  title,
  setTitle,
  description,
  setDescription,
}: Props) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 w-full">
      <h2 className="text-xl font-bold mb-4">날짜 선택</h2>
      <DayPicker mode="range" selected={range} onSelect={setRange} /> 
      {/* 날짜 범위 선택 가능한 달력 표시. 선택값은 range이고, 선택 시 setRange 실행 */}

      {range?.from && range?.to && ( //날짜 범위가 선택되어 있으면 표시
        <p className="mt-4 text-gray-600 font-semibold">
          {format(range.from, 'yyyy-MM-dd')} ~ {format(range.to, 'yyyy-MM-dd')}
        </p> //(예: 2025-07-17 ~ 2025-07-19)
      )}

      <div className="mt-6">
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          여행 제목
        </label>
        <input //여행 제목 입력 필드
          type="text"
          placeholder="제목을 입력하세요"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 rounded border mb-3"
        />
        <textarea //여행 설명 입력 필드
          placeholder="설명을 입력하세요"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 rounded border"
        />
      </div>
    </div>
  );
}