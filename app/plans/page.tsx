'use client';

import { useState } from 'react';
import type { DateRange } from 'react-day-picker';
import PlanForm from '../plan/PlanForm';
import DayInputs from '../plan/DayInputs';

export default function PlanPage() {
  const [range, setRange] = useState<DateRange | undefined>();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dailyPlans, setDailyPlans] = useState<{
    [date: string]: { place: string; detail: string }[];
  }>({});

  const handleSave = async () => {
    if (!range?.from || !range?.to) return alert('날짜를 선택하세요.');

    const response = await fetch('/api/save-plan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title,
        description,
        start_date: range.from,
        end_date: range.to,
        dailyPlans,
      }),
    });

    if (response.ok) {
      alert('저장 완료!');
    } else {
      alert('저장 실패');
    }
  };

  return (
    <div className="bg-gradient-to-b from-pink-50 to-purple-50 min-h-screen py-12">
      <div className="container mx-auto flex gap-8">
        <div className="w-1/2">
          <PlanForm
            range={range}
            setRange={setRange}
            title={title}
            setTitle={setTitle}
            description={description}
            setDescription={setDescription}
          />
        </div>
        <div className="w-1/2">
          <DayInputs
            range={range}
            dailyPlans={dailyPlans}
            setDailyPlans={setDailyPlans}
          />
          <button
            onClick={handleSave}
            className="mt-6 px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
          >
            저장하기
          </button>
        </div>
      </div>
    </div>
  );
}