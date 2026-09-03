'use client';

import React from 'react';
import { GitCommit } from 'lucide-react';

export interface TraceReferenceBadgeProps {
  traceId: string;
  onClick?: (traceId: string) => void;
}

export const TraceReferenceBadge: React.FC<TraceReferenceBadgeProps> = ({ traceId, onClick }) => {
  return (
    <button
      type="button"
      onClick={() => onClick && onClick(traceId)}
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-purple-50 text-purple-900 border border-purple-200 hover:bg-purple-100 transition-colors cursor-pointer"
      title="Click to view full end-to-end lifecycle trace"
    >
      <GitCommit className="w-3 h-3 text-purple-600 shrink-0" />
      <span>{traceId}</span>
    </button>
  );
};
