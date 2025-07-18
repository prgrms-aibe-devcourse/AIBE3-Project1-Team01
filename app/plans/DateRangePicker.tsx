'use client';

import { useState } from 'react';
import { DayPicker } from 'react-day-picker';
import { format } from 'date-fns';
import type { DateRange } from 'react-day-picker';
import 'react-day-picker/dist/style.css';

export default function DateRangePicker() {
  const [range, setRange] = useState<DateRange | undefined>();

  return (
    <div className="p-4">
      <DayPicker
        mode="range"
        selected={range}
        onSelect={(r: DateRange | undefined) => setRange(r ?? { from: undefined, to: undefined })}
        className="rounded-xl border bg-[#F6EFEF] shadow-lg p-4"
      />
      
    </div>
  );
}