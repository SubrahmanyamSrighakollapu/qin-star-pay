'use client';

import React from 'react';
import { ShieldCheck, Lock } from 'lucide-react';

interface TransactionSecurityNoticeProps {
  className?: string;
}

export const TransactionSecurityNotice: React.FC<TransactionSecurityNoticeProps> = ({
  className = '',
}) => {
  return (
    <div
      className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-slate-50 border border-slate-200/60 text-slate-500 text-[11px] font-medium ${className}`}
    >
      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
      <span>Secure transaction workspace</span>
      <span className="text-slate-300">•</span>
      <span className="flex items-center gap-1 text-slate-400">
        <Lock className="w-3 h-3 text-slate-400" /> Authenticated Session
      </span>
    </div>
  );
};
