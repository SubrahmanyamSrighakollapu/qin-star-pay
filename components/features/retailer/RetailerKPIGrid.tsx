'use client';

import React from 'react';
import { ArrowDownLeft, ArrowUpRight, ArrowLeftRight, CheckCircle2, AlertCircle, Clock, TrendingUp } from 'lucide-react';
import { formatCurrency } from '@/utils/formatters';
import { RetailerDashboardSummary } from '@/services/retailerDashboardService';

interface RetailerKPIGridProps {
  summary: RetailerDashboardSummary;
  isLoading?: boolean;
}

export const RetailerKPIGrid: React.FC<RetailerKPIGridProps> = ({ summary, isLoading = false }) => {
  const { transactionSummary } = summary;

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-28 bg-slate-100 rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-[var(--primary)]" />
          <span>Today's Operational Performance</span>
        </h3>
        <span className="text-xs text-slate-400 font-medium hidden sm:inline">Live counter telemetry</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Today's Pay-In (Blue Accent) */}
        <div className="bg-white/95 border-l-4 border-l-[var(--primary)] border border-[#E5EBF2] rounded-2xl p-4.5 shadow-xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-1.5">
            <span className="font-bold text-slate-700">Today's Pay-In</span>
            <div className="w-7 h-7 rounded-lg bg-blue-50 text-[var(--primary)] border border-blue-100 flex items-center justify-center">
              <ArrowDownLeft className="w-4 h-4 text-[var(--primary)]" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[var(--primary)] font-mono tabular-nums tracking-tight">
            {formatCurrency(transactionSummary.todayPayInVolume)}
          </div>
          <div className="text-[11px] text-blue-700 font-semibold mt-1.5 flex items-center gap-1">
            <span>↑ 8.4%</span>
            <span className="text-slate-400 font-normal">vs yesterday</span>
          </div>
        </div>

        {/* 2. Today's Pay-Out (Orange Accent) */}
        <div className="bg-white/95 border-l-4 border-l-[var(--secondary)] border border-[#E5EBF2] rounded-2xl p-4.5 shadow-xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-1.5">
            <span className="font-bold text-slate-700">Today's Pay-Out</span>
            <div className="w-7 h-7 rounded-lg bg-orange-50 text-[var(--secondary)] border border-orange-100 flex items-center justify-center">
              <ArrowUpRight className="w-4 h-4 text-[var(--secondary)]" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono tabular-nums tracking-tight">
            {formatCurrency(transactionSummary.todayPayOutVolume)}
          </div>
          <div className="text-[11px] text-[var(--secondary)] font-semibold mt-1.5 flex items-center gap-1">
            <span>↑ 12.1%</span>
            <span className="text-slate-400 font-normal">vs yesterday</span>
          </div>
        </div>

        {/* 3. Today's Transactions Count */}
        <div className="bg-white/95 border-l-4 border-l-slate-400 border border-[#E5EBF2] rounded-2xl p-4.5 shadow-xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-1.5">
            <span className="font-bold text-slate-700">Today's Transactions</span>
            <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center">
              <ArrowLeftRight className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono tabular-nums tracking-tight">
            {transactionSummary.todayCount}
          </div>
          <div className="text-[11px] text-slate-500 mt-1.5 flex items-center gap-2">
            <span className="text-emerald-700 font-bold">{transactionSummary.successfulCount} ok</span>
            <span>•</span>
            <span className="text-amber-700 font-bold">{transactionSummary.pendingCount} pend</span>
            <span>•</span>
            <span className="text-rose-700 font-bold">{transactionSummary.failedCount} fail</span>
          </div>
        </div>

        {/* 4. Success Rate */}
        <div className="bg-white/95 border-l-4 border-l-emerald-500 border border-[#E5EBF2] rounded-2xl p-4.5 shadow-xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-1.5">
            <span className="font-bold text-slate-700">Success Rate</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600 font-mono tabular-nums tracking-tight">
            {transactionSummary.successRate}%
          </div>
          <div className="w-full bg-slate-200/80 h-1.5 rounded-full overflow-hidden mt-2">
            <div
              className="bg-emerald-500 h-full rounded-full transition-all duration-300"
              style={{ width: `${Math.min(100, Math.max(0, transactionSummary.successRate))}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
