'use client';

import { useState } from 'react';
import { DayPicker } from 'react-day-picker';
import { format } from 'date-fns';
import 'react-day-picker/dist/style.css';
import type { DateRange } from 'react-day-picker';

export default function DateRangePicker() {
  const [range, setRange] = useState<DateRange | undefined>();

  return (
    <div className="flex flex-col items-center gap-2 p-4">
      <label className="font-semibold">여행 기간 선택</label>

      <DayPicker
        mode="range"
        selected={range}
        onSelect={(r: DateRange | undefined) =>
          setRange(r ?? { from: undefined, to: undefined })
        }
        modifiersClassNames={{
          selected: 'bg-pink-300 text-white rounded-full',
          range_start: 'bg-pink-300 text-white rounded-full',
          range_end: 'bg-pink-300 text-white rounded-full',
          range_middle: 'bg-pink-300 text-white rounded-full',
        }}
        className="rounded-xl border bg-white shadow-lg p-4"
      />

      {range?.from && range?.to && (
        <div className="text-sm text-gray-600 mt-1">
          선택한 기간: {format(range.from, 'yyyy-MM-dd')} ~ {format(range.to, 'yyyy-MM-dd')}
        </div>
      )}
    </div>
  );
}