'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { DateRangePreset, ReportDateRange } from '@/types/domain';
import { Calendar } from 'lucide-react';

export interface ReportDateRangePickerProps {
  value: ReportDateRange;
  onChange: (dateRange: ReportDateRange) => void;
}

export const ReportDateRangePicker: React.FC<ReportDateRangePickerProps> = ({
  value,
  onChange,
}) => {
  const [showCustom, setShowCustom] = useState(value.preset === 'CUSTOM');
  const [startDate, setStartDate] = useState(value.startDate || '');
  const [endDate, setEndDate] = useState(value.endDate || '');

  const presets: { key: DateRangePreset; label: string }[] = [
    { key: 'TODAY', label: 'Today' },
    { key: 'YESTERDAY', label: 'Yesterday' },
    { key: 'LAST_7_DAYS', label: 'Last 7 Days' },
    { key: 'LAST_30_DAYS', label: 'Last 30 Days' },
    { key: 'THIS_MONTH', label: 'This Month' },
    { key: 'PREVIOUS_MONTH', label: 'Previous Month' },
    { key: 'CUSTOM', label: 'Custom' },
  ];

  const handleSelectPreset = (preset: DateRangePreset) => {
    if (preset === 'CUSTOM') {
      setShowCustom(true);
      onChange({ preset: 'CUSTOM', startDate, endDate });
    } else {
      setShowCustom(false);
      onChange({ preset });
    }
  };

  const handleCustomApply = () => {
    onChange({ preset: 'CUSTOM', startDate, endDate });
  };

  return (
    <div className="space-y-2 text-xs">
      <label className="font-semibold text-slate-700 flex items-center gap-1.5">
        <Calendar className="w-3.5 h-3.5 text-slate-500" />
        <span>Date Range Filter</span>
      </label>
      <div className="flex flex-wrap gap-1.5">
        {presets.map((p) => (
          <button
            key={p.key}
            type="button"
            onClick={() => handleSelectPreset(p.key)}
            className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors ${
              value.preset === p.key
                ? 'bg-[var(--primary)] text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {showCustom && (
        <div className="flex items-center gap-2 pt-2">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="px-2 py-1 border border-slate-300 rounded text-xs text-slate-800"
          />
          <span className="text-slate-400">to</span>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="px-2 py-1 border border-slate-300 rounded text-xs text-slate-800"
          />
          <Button variant="outline" size="sm" type="button" onClick={handleCustomApply}>
            Set Range
          </Button>
        </div>
      )}
    </div>
  );
};
