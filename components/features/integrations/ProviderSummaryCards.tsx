'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { ProviderSummary } from '@/types/domain';

export interface ProviderSummaryCardsProps {
  summary: ProviderSummary;
}

export const ProviderSummaryCards: React.FC<ProviderSummaryCardsProps> = ({ summary }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {/* 1. Total Providers */}
      <Card className="p-4 bg-white border border-slate-200">
        <span className="text-xs font-semibold text-slate-500">Total Partners</span>
        <div className="mt-1 font-mono font-extrabold text-base text-[var(--primary)]">
          {summary.totalProviders} Registered
        </div>
        <span className="text-[11px] text-slate-400 block mt-0.5">Payment gateways & banks</span>
      </Card>

      {/* 2. Active Providers */}
      <Card className="p-4 bg-white border border-slate-200">
        <span className="text-xs font-semibold text-slate-500">Active Gateways</span>
        <div className="mt-1 font-mono font-extrabold text-base text-emerald-700">
          {summary.activeCount} Active
        </div>
        <span className="text-[11px] text-emerald-600 block mt-0.5">Handling live transactions</span>
      </Card>

      {/* 3. Degraded */}
      <Card className="p-4 bg-white border border-slate-200">
        <span className="text-xs font-semibold text-slate-500">Degraded Health</span>
        <div className="mt-1 font-mono font-extrabold text-base text-amber-700">
          {summary.degradedCount} Degraded
        </div>
        <span className="text-[11px] text-amber-600 block mt-0.5">High response latency</span>
      </Card>

      {/* 4. Down */}
      <Card className="p-4 bg-white border border-slate-200">
        <span className="text-xs font-semibold text-slate-500">Gateway Outages</span>
        <div className="mt-1 font-mono font-extrabold text-base text-rose-700">
          {summary.downCount} Outages
        </div>
        <span className="text-[11px] text-rose-600 block mt-0.5">Failover rerouted</span>
      </Card>

      {/* 5. Average Success Rate */}
      <Card className="p-4 bg-white border border-slate-200">
        <span className="text-xs font-semibold text-slate-500">Avg Success Rate</span>
        <div className="mt-1 font-mono font-extrabold text-base text-purple-900">
          {summary.avgSuccessRate}%
        </div>
        <span className="text-[11px] text-purple-600 block mt-0.5">Active pool availability</span>
      </Card>
    </div>
  );
};
