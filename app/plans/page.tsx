'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import type { DateRange } from 'react-day-picker';
import PlanForm from './PlanForm';
import DayInputs from './DayInputs'; 
import LoginModal from '../login/LoginModal';
import SignupModal from '../signup/SignupModal';

export default function PlanPage() {
  const [range, setRange] = useState<DateRange | undefined>(); //여행 날짜 범위를 저장하는 상태 (from, to로 구성됨)
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dailyPlans, setDailyPlans] = useState<{
    [date: string]: { place: string; detail: string }[];
  }>({}); //날짜별 일정 dailyPlans는 날짜별로 배열을 가짐 (한 날짜에 여러 장소 가능)
  const router = useRouter();
  const { user } = useAuth();
  const searchParams = useSearchParams(); 
  const planId = searchParams.get('id');
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);

  
  // 모달 간 전환 함수
  const handleSwitchToSignup = () => {
    setShowLoginModal(false);
    setShowSignupModal(true);
  };

  const handleSwitchToLogin = () => {
    setShowSignupModal(false);
    setShowLoginModal(true);
  };

  // 수정 모드일 경우 planId 기반으로 데이터 불러오기
  useEffect(() => {
    const fetchPlan = async () => {
      if (!planId) return; // 없으면 새로 작성하는 중이므로 아무것도 안 함

      const { data: plan, error: planError } = await supabase
        .from('plans')
        .select('*')
        .eq('id', planId)
        .eq('user_id', user?.id)
        .single();

      if (planError || !plan) return;

      setTitle(plan.title);
      setDescription(plan.description);
      setRange({
        from: new Date(plan.start_date),
        to: new Date(plan.end_date),
      });

      const { data: items } = await supabase
        .from('plan_items')
        .select('*')
        .eq('plan_id', planId)
        .order('order', { ascending: true });

      const grouped: { [date: string]: { place: string; detail: string }[] } = {};
      items?.forEach((item) => {
        if (!grouped[item.date]) grouped[item.date] = [];
        grouped[item.date].push({ place: item.place, detail: item.detail });
      });

      setDailyPlans(grouped);
    };

    fetchPlan();
  }, [planId]);

  const handleSave = async () => {
    
    if (!user) {
      const confirmLogin = window.confirm("로그인이 필요합니다. 로그인하시겠습니까?");
      if (confirmLogin) {
        setShowLoginModal(true); // 로그인 모달 열기
      }
      return;
    }
  
      if (!range || !range.from || !range.to) {
        alert("날짜는 반드시 선택해야 합니다.");
        return;
      }
  
      //수정 모드일 경우 (planId가 있음)
      if (planId) {
        const { error: updateError } = await supabase
          .from('plans')
          .update({
            title,
            description,
            start_date: range.from.toISOString().slice(0, 10),
            end_date: range.to.toISOString().slice(0, 10),
          })
          .eq('id', planId)
          .eq('user_id', user?.id);
  
        if (updateError) {
          alert('계획 수정 실패');
          return;
        }
  
        //기존 일정 항목 삭제 후 다시 삽입
        await supabase.from('plan_items').delete().eq('plan_id', planId);
  
        const itemsToInsert = Object.entries(dailyPlans).flatMap(([date, entries]) =>
          entries.map((entry, idx) => ({
            date,
            place: entry.place,
            detail: entry.detail,
            order: idx,
            plan_id: planId,
          }))
        );
  
        await supabase.from('plan_items').insert(itemsToInsert);
        alert('수정 완료!');
      } else {
        //새로 작성 모드일 경우 (planId 없음)
        const { data: planInsertData, error: planInsertError } = await supabase
          .from('plans')
          .insert({
            title,
            description,
            start_date: range.from.toISOString().slice(0, 10),
            end_date: range.to.toISOString().slice(0, 10),
            user_id: user?.id,
          })
          .select()
          .single();
  
        if (planInsertError || !planInsertData) {
          alert('저장 실패');
          return;
        }
  
        const planId = planInsertData.id;
  
        const itemsToInsert = Object.entries(dailyPlans).flatMap(([date, entries]) =>
          entries.map((entry, idx) => ({
            date,
            place: entry.place,
            detail: entry.detail,
            order: idx,
            plan_id: planId,
          }))
        );
  
        await supabase.from('plan_items').insert(itemsToInsert);
        alert('저장 완료!');
      }
  
      router.push('/plans/list');
    };

    return (
      <div className="min-h-screen bg-[#F6EFEF] py-12">
        <div className="container mx-auto p-6 max-w-6xl">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* 왼쪽: 달력+제목+설명 */}
            <div className="w-full md:w-1/3">
              <PlanForm
                range={range}
                setRange={setRange}
                title={title}
                setTitle={setTitle}
                description={description}
                setDescription={setDescription}
              />
            </div>
      
            {/* 오른쪽: 일정 입력 */}
            <div className="w-full flex-1">
              <DayInputs
                range={range}
                dailyPlans={dailyPlans}
                setDailyPlans={setDailyPlans}
              />
              <div className="text-right mt-6">
                <button
                  onClick={handleSave}
                  className="px-8 py-3 bg-[#F4CCC4] text-[#2B2323] font-bold rounded-2xl shadow-lg transition-all text-lg"
                >
                  {planId ? '수정하기' : '저장하기'}
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* 로그인/회원가입 모달 렌더링 */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onSignup={handleSwitchToSignup}
      />
      <SignupModal
        isOpen={showSignupModal}
        onClose={() => setShowSignupModal(false)}
        onLogin={handleSwitchToLogin}
      />
      </div>
    );
  };
  