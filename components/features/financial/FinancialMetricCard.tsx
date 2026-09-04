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
  isDominant = false,
}) => {
  const variantStyles = {
    primary: {
      border: 'border-indigo-200/90',
      bg: 'bg-white',
      accentBar: 'bg-[#0F4C81]',
      label: 'text-slate-600',
      value: 'text-[#0F4C81]',
    },
    payin: {
      border: 'border-indigo-200/90',
      bg: 'bg-indigo-50/20',
      accentBar: 'bg-[#0F4C81]',
      label: 'text-indigo-900',
      value: 'text-[#0F4C81]',
    },
    payout: {
      border: 'border-orange-200/90',
      bg: 'bg-orange-50/20',
      accentBar: 'bg-[#F97316]',
      label: 'text-orange-900',
      value: 'text-[#F97316]',
    },
    success: {
      border: 'border-emerald-200/90',
      bg: 'bg-emerald-50/20',
      accentBar: 'bg-emerald-600',
      label: 'text-emerald-900',
      value: 'text-emerald-700',
    },
    warning: {
      border: 'border-amber-200/90',
      bg: 'bg-amber-50/20',
      accentBar: 'bg-amber-500',
      label: 'text-amber-900',
      value: 'text-amber-700',
    },
    danger: {
      border: 'border-rose-200/90',
      bg: 'bg-rose-50/20',
      accentBar: 'bg-rose-500',
      label: 'text-rose-900',
      value: 'text-rose-700',
    },
    neutral: {
      border: 'border-slate-200/90',
      bg: 'bg-white',
      accentBar: 'bg-slate-300',
      label: 'text-slate-500',
      value: 'text-slate-900',
    },
  };

  const style = variantStyles[variant];

  return (
    <div
      className={`p-4 rounded-xl border ${style.border} ${style.bg} shadow-xs relative overflow-hidden transition-all duration-200 hover:shadow-sm`}
    >
      <div className={`absolute top-0 left-0 right-0 h-1 ${style.accentBar}`} />
      <div className="flex items-center justify-between text-xs mb-1">
        <span className={`font-bold uppercase tracking-wider ${style.label} flex items-center gap-1.5`}>
          {icon}
          {label}
        </span>
      </div>
      <div
        className={`font-mono font-extrabold tracking-tight tabular-nums ${
          isDominant ? 'text-2xl md:text-3xl' : 'text-xl md:text-2xl'
        } ${style.value}`}
      >
        {value}
      </div>
      {subtext && <p className="text-[11px] text-slate-500 mt-1">{subtext}</p>}
    </div>
  );
};
