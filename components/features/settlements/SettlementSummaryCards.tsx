'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { formatCurrency } from '@/utils/formatters';
import { Clock, CheckCircle2, AlertTriangle, RefreshCw, Layers, ShieldCheck } from 'lucide-react';
import { SettlementOverviewData } from '@/services/settlementService';

export interface SettlementSummaryCardsProps {
  summary: SettlementOverviewData | null;
  isLoading?: boolean;
}

export const SettlementSummaryCards: React.FC<SettlementSummaryCardsProps> = ({
  summary,
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-24 bg-slate-100 rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  const data = summary || {
    pendingSettlement: 0,
    eligibleAmount: 0,
    processingAmount: 0,
    settledToday: 0,
    failedCount: 0,
    totalSettledAmount: 0,
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {/* 1. Pending Settlement */}
      <Card className="p-4 bg-white border border-slate-200">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500">Pending Settlement</span>
          <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
            <Clock className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2 font-mono font-extrabold text-base text-amber-900">
          {formatCurrency(data.pendingSettlement)}
        </div>
        <span className="text-[11px] text-slate-400 mt-0.5 block">Total un-cleared funds</span>
      </Card>

      {/* 2. Eligible for Settlement */}
      <Card className="p-4 bg-white border border-slate-200">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500">Eligible to Settle</span>
          <div className="w-8 h-8 rounded-lg bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-600">
            <ShieldCheck className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2 font-mono font-extrabold text-base text-purple-900">
          {formatCurrency(data.eligibleAmount)}
        </div>
        <span className="text-[11px] text-purple-600 font-medium mt-0.5 block">Ready for batch dispatch</span>
      </Card>

      {/* 3. In Processing */}
      <Card className="p-4 bg-white border border-slate-200">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500">Processing</span>
          <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
            <RefreshCw className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2 font-mono font-extrabold text-base text-blue-900">
          {formatCurrency(data.processingAmount)}
        </div>
        <span className="text-[11px] text-blue-600 font-medium mt-0.5 block">Queued at bank gateway</span>
      </Card>

      {/* 4. Settled Today */}
      <Card className="p-4 bg-white border border-slate-200">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500">Settled Today</span>
          <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2 font-mono font-extrabold text-base text-emerald-800">
          {formatCurrency(data.settledToday)}
        </div>
        <span className="text-[11px] text-emerald-600 font-medium mt-0.5 block">Bank UTR confirmed</span>
      </Card>

      {/* 5. Failed Settlements */}
      <Card className="p-4 bg-white border border-slate-200">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500">Failed Settlements</span>
          <div className="w-8 h-8 rounded-lg bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600">
            <AlertTriangle className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2 font-mono font-extrabold text-base text-rose-700">
          {data.failedCount} Settlement{data.failedCount === 1 ? '' : 's'}
        </div>
        <span className="text-[11px] text-rose-600 font-medium mt-0.5 block">Requires operational review</span>
      </Card>

      {/* 6. Total Settled Amount */}
      <Card className="p-4 bg-white border border-slate-200">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500">Total Settled</span>
          <div className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600">
            <Layers className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2 font-mono font-extrabold text-base text-slate-900">
          {formatCurrency(data.totalSettledAmount)}
        </div>
        <span className="text-[11px] text-slate-400 mt-0.5 block">Historical total settled</span>
      </Card>
    </div>
  );
};
