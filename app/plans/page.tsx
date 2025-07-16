import DateRangePicker from '@/components/DateRangePicker';

export default function PlanPage() {
  return (
    <div className="bg-gradient-to-b from-pink-50 to-purple-50 min-h-screen py-12">
      <div className="container mx-auto flex justify-center items-start">
        <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-lg">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">여행 계획 만들기</h1>
          <DateRangePicker />
        </div>
      </div>
    </div>
  );
}