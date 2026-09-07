'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { ProviderSummary } from '@/types/domain';
import { Server, CheckCircle2, AlertTriangle, XCircle, Activity } from 'lucide-react';

export interface ProviderSummaryCardsProps {
  summary: ProviderSummary;
}

export const ProviderSummaryCards: React.FC<ProviderSummaryCardsProps> = ({ summary }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
      {/* 1. Total Providers */}
      <Card className="p-3.5 bg-white border border-slate-200/80 shadow-xs hover:border-[var(--primary)] transition-all">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Total Partners</span>
          <div className="p-1.5 rounded-lg bg-blue-50 text-blue-700">
            <Server className="w-3.5 h-3.5" />
          </div>
        </div>
        <div className="mt-2 font-mono font-extrabold text-lg text-[var(--primary)]">
          {summary.totalProviders}
        </div>
        <span className="text-[10px] text-slate-400 block mt-0.5 font-medium">Payment gateways & banks</span>
      </Card>

      {/* 2. Active Providers */}
      <Card className="p-3.5 bg-white border border-slate-200/80 shadow-xs hover:border-emerald-400 transition-all">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Active Gateways</span>
          <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700">
            <CheckCircle2 className="w-3.5 h-3.5" />
          </div>
        </div>
        <div className="mt-2 font-mono font-extrabold text-lg text-emerald-700">
          {summary.activeCount} Active
        </div>
        <span className="text-[10px] text-emerald-600 block mt-0.5 font-medium">Handling live transactions</span>
      </Card>

      {/* 3. Degraded */}
      <Card className="p-3.5 bg-white border border-slate-200/80 shadow-xs hover:border-amber-400 transition-all">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Degraded Health</span>
          <div className="p-1.5 rounded-lg bg-amber-50 text-amber-700">
            <AlertTriangle className="w-3.5 h-3.5" />
          </div>
        </div>
        <div className="mt-2 font-mono font-extrabold text-lg text-amber-700">
          {summary.degradedCount} Degraded
        </div>
        <span className="text-[10px] text-amber-600 block mt-0.5 font-medium">High response latency</span>
      </Card>

      {/* 4. Down */}
      <Card className="p-3.5 bg-white border border-slate-200/80 shadow-xs hover:border-rose-400 transition-all">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Gateway Outages</span>
          <div className="p-1.5 rounded-lg bg-rose-50 text-rose-700">
            <XCircle className="w-3.5 h-3.5" />
          </div>
        </div>
        <div className="mt-2 font-mono font-extrabold text-lg text-rose-700">
          {summary.downCount} Outages
        </div>
        <span className="text-[10px] text-rose-600 block mt-0.5 font-medium font-mono">Failover rerouted</span>
      </Card>

      {/* 5. Average Success Rate */}
      <Card className="p-3.5 bg-white border border-slate-200/80 shadow-xs hover:border-purple-400 transition-all">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Avg Success Rate</span>
          <div className="p-1.5 rounded-lg bg-purple-50 text-purple-700">
            <Activity className="w-3.5 h-3.5" />
          </div>
        </div>
        <div className="mt-2 font-mono font-extrabold text-lg text-purple-900">
          {summary.avgSuccessRate}%
        </div>
        <span className="text-[10px] text-purple-600 block mt-0.5 font-medium">Active pool availability</span>
      </Card>
    </div>
  );
};

