'use client';

import React from 'react';

interface FinancialPageHeaderProps {
  title: string;
  subtitle: string;
  statusBadge?: React.ReactNode;
  actions?: React.ReactNode;
}

export const FinancialPageHeader: React.FC<FinancialPageHeaderProps> = ({
  title,
  subtitle,
  statusBadge,
  actions,
}) => {
  return (
    <div className="p-5 md:p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all">
      <div className="space-y-1">
        <div className="flex items-center gap-3 flex-wrap">
          <h1 className="text-xl md:text-2xl font-extrabold text-slate-900 tracking-tight">
            {title}
          </h1>
          {statusBadge}
        </div>
        <p className="text-xs md:text-sm text-slate-500 max-w-2xl">{subtitle}</p>
      </div>

      {actions && (
        <div className="flex items-center gap-2.5 shrink-0 border-t md:border-t-0 border-slate-100 pt-3 md:pt-0">
          {actions}
        </div>
      )}
    </div>
  );
};
