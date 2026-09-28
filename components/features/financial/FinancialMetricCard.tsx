'use client';

import React from 'react';

interface FinancialMetricCardProps {
  label: string;
  value: string | number;
  subtext?: string;
  icon?: React.ReactNode;
  variant?: 'primary' | 'payin' | 'payout' | 'success' | 'warning' | 'danger' | 'neutral';
  isDominant?: boolean;
}

export const FinancialMetricCard: React.FC<FinancialMetricCardProps> = ({
  label,
  value,
  subtext,
  icon,
  variant = 'neutral',
}) => {
  // Softly tinted icon background colors for intentional accenting
  const iconTintStyles = {
    primary: 'bg-blue-50 text-[#155EEF]',
    payin: 'bg-emerald-50 text-emerald-600',
    payout: 'bg-amber-50 text-amber-600',
    success: 'bg-emerald-50 text-emerald-600',
    warning: 'bg-amber-50 text-amber-600',
    danger: 'bg-rose-50 text-rose-600',
    neutral: 'bg-slate-100 text-slate-600',
  };

  const iconStyle = iconTintStyles[variant] || iconTintStyles.neutral;

  return (
    <div className="p-5 bg-white border border-[#E5EAF1] rounded-xl shadow-xs flex flex-col justify-between transition-all duration-200 hover:border-slate-300">
      {/* Top: Icon + Label */}
      <div className="flex items-center justify-between gap-3">
        <span className="text-[12px] font-semibold uppercase tracking-wider text-[#64748B]">
          {label}
        </span>
        {icon && (
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${iconStyle}`}>
            {icon}
          </div>
        )}
      </div>

      {/* Middle: Dominant Financial Value */}
      <div className="mt-3 mb-1">
        <div className="text-[28px] leading-tight font-extrabold text-[#0F172A] tracking-tight tabular-nums font-mono">
          {value}
        </div>
      </div>

      {/* Bottom: Context / Subtext */}
      {subtext && (
        <div className="mt-1 flex items-center text-xs text-[#64748B] font-medium">
          {subtext.startsWith('+') || subtext.includes('Growth') ? (
            <span className="inline-flex items-center text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60">
              {subtext}
            </span>
          ) : (
            <span className="text-[12px] text-[#64748B]">{subtext}</span>
          )}
        </div>
      )}
    </div>
  );
};

