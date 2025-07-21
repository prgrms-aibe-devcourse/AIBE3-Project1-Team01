'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { supabase } from '../../../lib/supabase';
import Header from '../../components/Header';
import DeleteModal from '../components/DeleteModal';

export default function PlanDetailPage() {
  const router = useRouter();
  const params = useParams();
  const planId = params?.id as string;

  const [plan, setPlan] = useState<any>(null);
  const [planItems, setPlanItems] = useState<any[]>([]);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  useEffect(() => {
    if (!planId) return;

    const fetchPlan = async () => {
      const { data: plan } = await supabase
        .from('plans')
        .select('*')
        .eq('id', planId)
        .single();
      setPlan(plan);

      const { data: items } = await supabase
        .from('plan_items')
        .select('*')
        .eq('plan_id', planId)
        .order('order', { ascending: true });
      setPlanItems(items || []);
    };

    fetchPlan();
  }, [planId]);

  const handleEdit = () => {
    router.push(`/plans?id=${planId}`);
  };

  const handleDelete = async () => {
    setDeleteModalOpen(false);
    await supabase.from('plan_items').delete().eq('plan_id', planId);
    await supabase.from('plans').delete().eq('id', planId);
    router.push('/plans/list');
  };

  if (!plan) return <div>로딩중...</div>;

  const grouped: Record<string, any[]> = planItems.reduce((acc, item) => {
    if (!acc[item.date]) acc[item.date] = [];
    acc[item.date].push(item);
    return acc;
  }, {} as Record<string, any[]>);

  return (
    <>
      <Header />
      <div className="min-h-screen bg-[#F6EFEF] py-1">
        <div className="max-w-2xl mx-auto p-8 bg-white rounded-2xl shadow-lg mt-12">
        <h1 className="text-2xl font-bold mb-3">
        {plan.title}
        <span className="text-sm font-normal text-gray-400 ml-3 align-middle relative top-[1px]">
            {plan.start_date} ~ {plan.end_date}
        </span>
        </h1>
          <p className="mb-3">{plan.description}</p>
          <hr className="my-6 border-t border-gray-200" />

          <h2 className="text-lg font-bold mt-6 mb-2 text-gray-700">세부 일정</h2>
          {Object.keys(grouped).length === 0 ? (
            <p className="text-gray-400">등록된 일정이 없습니다.</p>
          ) : (
            Object.entries(grouped).map(([date, items]) => (
              <div key={date} className="pl-1 pt-1 pb-4">
                <div className="font-semibold mb-2 text-[#B84A39]">{date}</div>
                <ol className="list-decimal pl-5 space-y-2 pl-5">
                {items.map((item, idx) => (
                    <li key={idx} className="text-gray-700 font-medium pb-1">
                    <div>{item.place}</div>
                    {item.detail && (
                        <div className="text-gray-600">{item.detail}</div>
                    )}
                    </li>
                ))}
                </ol>
              </div>
            ))
          )}

          <div className="flex gap-4 mt-8 justify-end w-full self-end">
            <button
              className="px-4 py-2 bg-[#E0E0E0] text-[#413D3D] rounded-xl font-semibold shadow"
              onClick={() => router.push('/plans/list')}
            >
              전체 리스트
            </button>
            <button
              className="px-4 py-2 bg-[#C9E6E5] text-[#413D3D] rounded-xl font-semibold shadow"
              onClick={handleEdit}
            >
              수정
            </button>
            <button
              className="px-4 py-2 bg-[#F4CCC4] text-[#413D3D] rounded-xl font-semibold shadow"
              onClick={() => setDeleteModalOpen(true)}
            >
              삭제
            </button>
          </div>
        </div>
      </div>

      <DeleteModal
        open={deleteModalOpen}
        onConfirm={handleDelete}
        onCancel={() => setDeleteModalOpen(false)}
      />
      <footer className="bg-white/60 backdrop-blur-md py-9 text-sm text-gray-600 mt-auto relative px-6 flex items-center">
        {/* 배경 이미지 */}
        <div
          className="absolute inset-y-0 left-16 w-40 bg-no-repeat bg-left bg-contain pointer-events-none"
          style={{ backgroundImage: "url('/images/h1trip-logo.png')" }}
        />
        {/* 텍스트 */}
        <p className="relative z-10 text-center w-full">
          © 2025 h1 Trip. 모든 여행자들의 꿈을 응원합니다. 🌟
        </p>
      </footer>
    </>
  );
}




