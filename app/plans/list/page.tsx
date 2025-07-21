'use client';

import { useEffect, useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import { supabase } from "../../../lib/supabase";
import { format } from "date-fns";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AlertModal from "../components/AlertModal";
import Header from "../../components/Header";

type Plan = {
  id: number;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
};

export default function PlansListPage() {
  const { user, isLoading } = useAuth();
  const [plans, setPlans] = useState<Plan[]>([]);
  const router = useRouter();
  const [alert, setAlert] = useState({
    isOpen: false,
    message: '',
    showCancel: false,
    onConfirm: undefined as (() => void) | undefined,
  });

  useEffect(() => {
    if (!user?.id) return;

    const fetchPlans = async () => {
      const { data, error } = await supabase
        .from("plans")
        .select("*")
        .eq("user_id", user?.id)
        .order("start_date", { ascending: true });

      if (error) {
        setAlert({
          isOpen: true,
          message: "불러오기 실패",
          showCancel: false,
          onConfirm: undefined,
        });
      } else {
        setPlans(data || []);
      }
    };

    fetchPlans();
  }, [user]);

  const handleDelete = async (targetId: number) => {
    await supabase.from("plan_items").delete().eq("plan_id", targetId);

    const { error } = await supabase
      .from("plans")
      .delete()
      .eq("id", targetId)
      .eq("user_id", user?.id);

    if (error) {
      setAlert({
        isOpen: true,
        message: "삭제 실패",
        showCancel: false,
        onConfirm: undefined,
      });
    } else {
      setPlans((prev) => prev.filter((plan) => plan.id !== targetId));
    }
  };

  if (isLoading) return <p className="p-4">로딩중...</p>;
  if (!user) return <p className="p-4">로그인이 필요합니다.</p>;

  return (
    <>
      <Header />
      <div className="min-h-screen bg-[#F6EFEF] py-12">
        <div className="max-w-2xl mx-auto p-6 bg-white/80 backdrop-blur-md border rounded-2xl shadow-xl">
          <h1 className="text-2xl font-bold mb-6 pl-2 text-gray-800">나의 여행 일정</h1>
          {plans.length === 0 ? (
            <p className="text-gray-500">아직 저장된 일정이 없어요.</p>
          ) : (
            <ul className="space-y-4">
              {plans.map((plan) => (
                <li
                  key={plan.id}
                  className="border border-pink-100 rounded-xl p-5 shadow bg-white/90 hover:shadow-lg transition-all cursor-pointer"
                  onClick={() => router.push(`/plans/${plan.id}`)}
                >
                  <div>
                    <h2 className="text-lg font-semibold text-gray-800">{plan.title}</h2>
                    <p className="text-sm text-[#B84A39] font-semibold">
                      {format(new Date(plan.start_date), "yyyy-MM-dd")} ~ {format(new Date(plan.end_date), "yyyy-MM-dd")}
                    </p>
                    <p className="text-gray-700 mt-1">{plan.description}</p>
                    <div className="mt-3 flex gap-2 justify-end">
                      <Link
                        href={`/plans?id=${plan.id}`}
                        className="px-4 py-2 bg-[#C9E6E5] text-[#413D3D] rounded-xl text-sm font-semibold shadow"
                        onClick={e => e.stopPropagation()}
                      >
                        수정
                      </Link>
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          setAlert({
                            isOpen: true,
                            message: "정말 삭제하시겠습니까?",
                            showCancel: true,
                            onConfirm: () => handleDelete(plan.id),
                          });
                        }}
                        className="px-4 py-2 bg-[#F4CCC4] text-[#413D3D] rounded-xl text-sm font-semibold shadow"
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

        <AlertModal
          isOpen={alert.isOpen}
          message={alert.message}
          onConfirm={() => {
            alert.onConfirm?.();
            setAlert({ ...alert, isOpen: false });
          }}
          onClose={() => setAlert({ ...alert, isOpen: false })}
          showCancel={alert.showCancel}
          confirmText={alert.showCancel ? '삭제' : '확인'}
          cancelText="취소"
        />
      </div>

      <footer className="bg-white/60 backdrop-blur-md py-9 text-sm text-gray-600 mt-auto relative px-6 flex items-center">
        <div
          className="absolute inset-y-0 left-16 w-40 bg-no-repeat bg-left bg-contain pointer-events-none"
          style={{ backgroundImage: "url('/images/h1trip-logo.png')" }}
        />
        <p className="relative z-10 text-center w-full">
          © 2025 h1 Trip. 모든 여행자들의 꿈을 응원합니다. 🌟
        </p>
      </footer>
    </>
  );
}
