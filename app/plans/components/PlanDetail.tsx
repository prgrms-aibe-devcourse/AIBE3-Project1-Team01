'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabase';

type PlanDetailProps = {
  planId: string;
  onEdit: (planId: string) => void;
  onDelete: () => void;
  deleteModalOpen: boolean;
  setDeleteModalOpen: (open: boolean) => void;
};

export default function PlanDetail({ planId, onEdit, onDelete, deleteModalOpen, setDeleteModalOpen }: PlanDetailProps) {
  const [plan, setPlan] = useState<any>(null);

  useEffect(() => {
    if (!planId) return;
    const fetchPlan = async () => {
      const { data } = await supabase
        .from('plans')
        .select('*')
        .eq('id', planId)
        .single();
      if (data) setPlan(data);
    };
    fetchPlan();
  }, [planId]);

  if (!plan) return <div>로딩중...</div>;

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white rounded-2xl shadow-lg mt-12">
      <h1 className="text-2xl font-bold mb-4">{plan.title}</h1>
      <p className="mb-2 text-gray-600">
        {plan.start_date} ~ {plan.end_date}
      </p>
      <p className="mb-6">{plan.description}</p>
      <div className="flex gap-4">
        <button
          className="px-4 py-2 bg-[#C9E6E5] text-[#413D3D] rounded-xl font-semibold shadow"
          onClick={() => onEdit(plan.id)}
        >
          수정하기
        </button>
        <button
          className="px-4 py-2 bg-[#F4CCC4] text-[#413D3D] rounded-xl font-semibold shadow"
          onClick={() => setDeleteModalOpen(true)}
        >
          삭제하기
        </button>
      </div>
    </div>
  );
} 