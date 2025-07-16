'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useAuth } from '../../context/Authcontext';
import type { DateRange } from 'react-day-picker';
import PlanForm from '../plan/PlanForm';
import DayInputs from '../plan/DayInputs'; 


export default function PlanPage() {
  const [range, setRange] = useState<DateRange | undefined>(); //여행 날짜 범위를 저장하는 상태 (from, to로 구성됨)
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dailyPlans, setDailyPlans] = useState<{
    [date: string]: { place: string; detail: string }[];
  }>({}); //날짜별 일정 dailyPlans는 날짜별로 배열을 가짐 (한 날짜에 여러 장소 가능)
  const router = useRouter();
  const { user } = useAuth();

  const handleSave = async () => {
    const testUserId = '72ede0c0-a9bd-4dd9-bcae-93d121378256'; //테스트용 유저 ID. 이후 삭제

    // if (!user) {
    //   alert("로그인이 필요합니다.");
    //   return;
    // }

    if (!range || !range.from || !range.to) {
      alert("날짜는 반드시 선택해야 합니다.");
      return;
    }

    const { data: planInsertData, error: planInsertError } = await supabase
      .from('plans')
      .insert({
        title,
        description,
        start_date: range.from.toISOString().slice(0, 10), //toISOString().slice(0,10)은 날짜를 YYYY-MM-DD 형식으로 자르기 위함.
        end_date: range.to.toISOString().slice(0, 10),
        user_id: testUserId // 테스트용 유저 ID 사용. 이후 user_id: user.id로 수정
      })
      .select()
      .single();

    if (planInsertError || !planInsertData) {
      alert('여행 계획 저장에 실패했습니다.');
      console.error(planInsertError);
      return;
    }
    //저장 중 에러가 있거나 결과가 없으면 알림 띄우고 함수 종료.

    const planId = planInsertData.id;

    //dailyPlans 객체를 평평한 배열로 변환하고, 각 항목을 순서와 함께 저장.
    const itemsToInsert = Object.entries(dailyPlans).flatMap(([date, entries]) =>
      entries.map((entry, idx) => ({
        date,
        place: entry.place,
        detail: entry.detail,
        order: idx,
        plan_id: planId,
      }))
    );

    const { error: itemInsertError } = await supabase
      .from('plan_items')
      .insert(itemsToInsert);

    if (itemInsertError) {
      alert('일정 항목 저장 중 오류가 발생했습니다.');
      console.error(itemInsertError);
    } else {
      alert('저장 완료!');
      router.push('/plans/list');
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