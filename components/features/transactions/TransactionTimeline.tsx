'use client';

import React from 'react';
import { CheckCircle2, Clock, XCircle, Info } from 'lucide-react';
import { TransactionTimelineEvent } from '@/types/domain';

export interface TransactionTimelineProps {
  timeline?: TransactionTimelineEvent[];
}

const statusIcon = {
  COMPLETED: <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />,
  PENDING: <Clock className="w-4 h-4 text-amber-600 shrink-0" />,
  FAILED: <XCircle className="w-4 h-4 text-rose-600 shrink-0" />,
  INFO: <Info className="w-4 h-4 text-blue-600 shrink-0" />,
};

export const TransactionTimeline: React.FC<TransactionTimelineProps> = ({ timeline }) => {
  if (!timeline || timeline.length === 0) {
    return (
      <div className="text-xs text-[var(--text-muted)] p-4 text-center">
        No timeline event logs recorded.
      </div>
    );
  }

  return (
    <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
      {timeline.map((item, idx) => (
        <div key={idx} className="relative flex items-start gap-3 text-xs">
          <div className="absolute -left-6 top-0.5 bg-white p-0.5 rounded-full ring-2 ring-white">
            {statusIcon[item.status]}
          </div>

          <div className="flex-1 bg-slate-50 border border-slate-200/80 rounded-lg p-3 space-y-0.5">
            <div className="flex items-center justify-between gap-2">
              <span className="font-bold text-[var(--text-primary)]">{item.event}</span>
              <span className="font-mono text-[10px] text-[var(--text-muted)] shrink-0">
                {item.timestamp}
              </span>
            </div>
            <p className="text-[11px] text-[var(--text-secondary)]">{item.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};
