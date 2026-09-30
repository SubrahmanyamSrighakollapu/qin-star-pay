'use client';

import React from 'react';
import { CheckCircle2, AlertCircle, TrendingUp } from 'lucide-react';
import { formatCurrency, formatNumber } from '@/utils/formatters';
import { RetailerDashboardSummary } from '@/services/retailerDashboardService';

interface RetailerKPIGridProps {
  summary: RetailerDashboardSummary;
  isLoading?: boolean;
}

export const RetailerKPIGrid: React.FC<RetailerKPIGridProps> = ({ summary, isLoading = false }) => {
  const { transactionSummary } = summary;

  if (isLoading) {
    return <div className="h-14 bg-slate-100 rounded-xl animate-pulse" />;
  }

  const totalVolume = transactionSummary.todayPayInVolume + transactionSummary.todayPayOutVolume;

  return (
    <div className="bg-white border border-slate-200/80 rounded-xl p-3 px-4 shadow-2xs">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-[var(--primary)]" />
          <span className="font-extrabold uppercase tracking-wider text-slate-500 text-[11px]">
            Today&apos;s Business Summary
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-0 divide-y sm:divide-y-0 sm:divide-x divide-slate-200/80 w-full lg:w-auto">
          {/* Total Transactions */}
          <div className="flex items-center justify-between sm:justify-start gap-2 py-2 sm:py-0 sm:px-4 sm:first:pl-0 whitespace-nowrap">
            <span className="text-slate-500 font-medium">Transactions:</span>
            <span className="font-mono font-bold text-slate-900 tabular-nums">
              {formatNumber(transactionSummary.todayCount)}
            </span>
          </div>

          {/* Combined Volume */}
          <div className="flex items-center justify-between sm:justify-start gap-2 py-2 sm:py-0 sm:px-4 whitespace-nowrap">
            <span className="text-slate-500 font-medium">Turnover Volume:</span>
            <span className="font-mono font-bold text-[var(--primary)] tabular-nums">
              {formatCurrency(totalVolume)}
            </span>
          </div>

          {/* Successful Count */}
          <div className="flex items-center justify-between sm:justify-start gap-2 py-2 sm:py-0 sm:px-4 whitespace-nowrap">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span className="text-slate-500 font-medium">Successful:</span>
            <span className="font-mono font-bold text-emerald-700 tabular-nums">
              {transactionSummary.successfulCount} ({transactionSummary.successRate}%)
            </span>
          </div>

          {/* Failed Count */}
          <div className="flex items-center justify-between sm:justify-start gap-2 py-2 sm:py-0 sm:px-4 whitespace-nowrap">
            <AlertCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
            <span className="text-slate-500 font-medium">Failed:</span>
            <span className="font-mono font-bold text-rose-700 tabular-nums">
              {transactionSummary.failedCount}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
