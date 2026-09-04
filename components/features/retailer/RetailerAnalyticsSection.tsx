'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { CheckCircle2, Clock, AlertTriangle, Activity } from 'lucide-react';
import { formatCurrency } from '@/utils/formatters';

export interface RetailerAnalyticsSectionProps {
  trendData: {
    date: string;
    payInVolume: number;
    payOutVolume: number;
    transactionsCount: number;
  }[];
  transactionSummary: {
    todayCount: number;
    todayPayInVolume: number;
    todayPayOutVolume: number;
    successfulCount: number;
    pendingCount: number;
    failedCount: number;
    successRate: number;
  };
  isLoading?: boolean;
}

export const RetailerAnalyticsSection: React.FC<RetailerAnalyticsSectionProps> = ({
  trendData,
  transactionSummary,
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-pulse">
        <div className="lg:col-span-8 h-72 bg-slate-100 rounded-xl" />
        <div className="lg:col-span-4 h-72 bg-slate-100 rounded-xl" />
      </div>
    );
  }

  const { successfulCount, pendingCount, failedCount, todayCount, successRate } = transactionSummary;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* 7-Day Transaction Activity Chart (8 Cols Desktop / 65%) */}
      <div className="lg:col-span-8">
        <Card
          title={
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-[var(--primary)]" />
                <span>Transaction Activity</span>
              </div>
              <div className="flex items-center gap-4 text-xs font-medium text-slate-500">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[var(--primary)]" />
                  <span>Pay-In Collection</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[var(--secondary)]" />
                  <span>Pay-Out Disbursement</span>
                </div>
              </div>
            </div>
          }
          subtitle="Daily volume comparison over the past 7 days"
        >
          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <defs>
                  <linearGradient id="payInGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0F4C81" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#0F4C81" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="payOutGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F97316" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#F97316" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  tickFormatter={(val) => `₹${val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val}`}
                />
                <Tooltip
                  formatter={(val: any, name: any) => [
                    `₹${Number(val).toLocaleString('en-IN')}`,
                    name === 'payInVolume' ? 'Pay-In Volume' : 'Pay-Out Volume',
                  ]}
                  contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}
                />
                <Area
                  type="monotone"
                  dataKey="payInVolume"
                  stroke="#0F4C81"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#payInGradient)"
                />
                <Area
                  type="monotone"
                  dataKey="payOutVolume"
                  stroke="#F97316"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#payOutGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Transaction Status Breakdown Card (4 Cols Desktop / 35%) */}
      <div className="lg:col-span-4">
        <Card
          title="Transaction Status"
          subtitle="Real-time execution status breakdown"
        >
          <div className="space-y-4 pt-1">
            {/* Top Score Banner */}
            <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-xl flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-500 block leading-none mb-1">
                  Overall Success Rate
                </span>
                <span className="text-2xl font-extrabold text-emerald-600 font-mono">
                  {successRate}%
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-slate-800 block">{todayCount} Total</span>
                <span className="text-[10px] text-slate-500">Processed today</span>
              </div>
            </div>

            {/* Stacked Horizontal Bar Chart */}
            <div className="space-y-1.5 pt-1">
              <div className="flex justify-between text-[11px] text-slate-500 font-medium">
                <span>Distribution Breakdown</span>
                <span className="font-mono font-bold text-slate-700">{todayCount > 0 ? '100%' : '0%'}</span>
              </div>

              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden flex gap-0.5 p-0.5 border border-slate-200/60">
                <div
                  className="bg-emerald-500 h-full rounded-l-full transition-all duration-300"
                  style={{ width: `${todayCount > 0 ? (successfulCount / todayCount) * 100 : 100}%` }}
                  title={`Successful: ${successfulCount}`}
                />
                <div
                  className="bg-amber-500 h-full transition-all duration-300"
                  style={{ width: `${todayCount > 0 ? (pendingCount / todayCount) * 100 : 0}%` }}
                  title={`Pending: ${pendingCount}`}
                />
                <div
                  className="bg-rose-500 h-full rounded-r-full transition-all duration-300"
                  style={{ width: `${todayCount > 0 ? (failedCount / todayCount) * 100 : 0}%` }}
                  title={`Failed: ${failedCount}`}
                />
              </div>
            </div>

            {/* Sleek Minimal Status List */}
            <div className="space-y-2 text-xs pt-1">
              <div className="flex items-center justify-between py-1.5 px-2 rounded-md hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span className="font-semibold text-slate-800">Successful</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-slate-900">{successfulCount}</span>
                  <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-1.5 py-0.2 rounded">
                    {todayCount > 0 ? Math.round((successfulCount / todayCount) * 100) : 0}%
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between py-1.5 px-2 rounded-md hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <span className="font-semibold text-slate-800">Pending</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-slate-900">{pendingCount}</span>
                  <span className="text-[10px] text-amber-700 font-semibold bg-amber-50 px-1.5 py-0.2 rounded">
                    {todayCount > 0 ? Math.round((pendingCount / todayCount) * 100) : 0}%
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between py-1.5 px-2 rounded-md hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                  <span className="font-semibold text-slate-800">Failed</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-slate-900">{failedCount}</span>
                  <span className="text-[10px] text-rose-700 font-semibold bg-rose-50 px-1.5 py-0.2 rounded">
                    {todayCount > 0 ? Math.round((failedCount / todayCount) * 100) : 0}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
