'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../../../context/Authcontext';
import { supabase } from '@/lib/supabase';
import { format } from 'date-fns';
import Link from 'next/link';

type Plan = {
  id: number;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
};

export default function PlansListPage() {
  const { user } = useAuth();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const testUserId = '72ede0c0-a9bd-4dd9-bcae-93d121378256'; // 테스트용 ID
  
  useEffect(() => {
    
    //if (!user?.id) return;

    const fetchPlans = async () => {
        const { data, error } = await supabase
          .from('plans')
          .select('*')
          .eq('user_id', testUserId) // 이후 user?.id 로 바꾸면 됨
          .order('start_date', { ascending: true });
  
        if (error) console.error('불러오기 실패:', error.message);
        else setPlans(data || []);
  
        setLoading(false);
      };
  
      fetchPlans();
    }, [user]);
  
    const handleDelete = async (planId: number) => {
      const ok = confirm('정말 삭제하시겠습니까?');
      if (!ok) return;
  
      // 항목 먼저 삭제
      await supabase.from('plan_items').delete().eq('plan_id', planId);
  
      // 계획 삭제
      const { error } = await supabase
        .from('plans')
        .delete()
        .eq('id', planId)
        .eq('user_id', testUserId); // 나중에 user?.id로 교체
  
      if (error) {
        alert('삭제 실패');
        console.error(error);
      } else {
        alert('삭제 완료!');
        setPlans((prev) => prev.filter((plan) => plan.id !== planId)); // 프론트 반영
      }
    };

//   if (!user) return <p className="p-4">로그인이 필요합니다.</p>;
  if (loading) return <p className="p-4">불러오는 중...</p>;

return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">나의 여행 계획</h1>
      {plans.length === 0 ? (
        <p className="text-gray-500">아직 저장된 계획이 없어요.</p>
      ) : (
        <ul className="space-y-4">
          {plans.map((plan) => (
            <li key={plan.id} className="border rounded-lg p-4 shadow hover:shadow-md">
              <div>
                <h2 className="text-lg font-semibold">{plan.title}</h2>
                <p className="text-sm text-gray-600">
                  {format(new Date(plan.start_date), 'yyyy-MM-dd')} ~{' '}
                  {format(new Date(plan.end_date), 'yyyy-MM-dd')}
                </p>
                <p className="text-gray-700 mt-1">{plan.description}</p>

                {/* 버튼 영역 */}
                <div className="mt-3 flex gap-2">
                  <Link
                    href={`/plans?id=${plan.id}`}
                    className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
                  >
                    수정
                  </Link>
                  <button
                    onClick={() => handleDelete(plan.id)}
                    className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
                  >
                    삭제
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}