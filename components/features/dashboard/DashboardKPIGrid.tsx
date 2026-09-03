'use client';

import React from 'react';
import {
  Wallet,
  ArrowDownLeft,
  ArrowUpRight,
  Landmark,
  CheckCircle2,
  XCircle,
  Activity,
  Layers,
} from 'lucide-react';
import { KPICard } from '@/components/ui/KPICard';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';
import { DashboardSummaryMetrics } from '@/types/dashboard';
import { formatCurrency, formatNumber, formatPercentage } from '@/utils/formatters';

export interface DashboardKPIGridProps {
  metrics: DashboardSummaryMetrics;
  isLoading?: boolean;
}

export const DashboardKPIGrid: React.FC<DashboardKPIGridProps> = ({
  metrics,
  isLoading = false,
}) => {
  if (isLoading) {
    return <LoadingSkeleton variant="kpi" count={8} />;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Available Balance */}
      <KPICard
        title="Available Balance"
        value={formatCurrency(metrics.availableBalance)}
        accentColor="blue"
        icon={<Wallet className="w-5 h-5" />}
        subtitle="Header & Master Wallet Feed"
      />

      {/* 2. Total Pay-In */}
      <KPICard
        title="Total Pay-In"
        value={formatCurrency(metrics.totalPayIn)}
        accentColor="blue"
        icon={<ArrowDownLeft className="w-5 h-5 text-emerald-600" />}
        trend={{
          value: `+${metrics.totalPayInTrend}%`,
          isPositive: true,
          label: 'vs previous period',
        }}
      />

      {/* 3. Total Pay-Out */}
      <KPICard
        title="Total Pay-Out"
        value={formatCurrency(metrics.totalPayOut)}
        accentColor="gold"
        icon={<ArrowUpRight className="w-5 h-5 text-amber-600" />}
        trend={{
          value: `${metrics.totalPayOutTrend}%`,
          isPositive: false,
          label: 'vs previous period',
        }}
      />

      {/* 4. Pending Settlement */}
      <KPICard
        title="Pending Settlement"
        value={formatCurrency(metrics.pendingSettlement)}
        accentColor="gold"
        icon={<Landmark className="w-5 h-5 text-amber-600" />}
        subtitle="Queued node clearances"
      />

      {/* 5. Successful Transactions */}
      <KPICard
        title="Successful Transactions"
        value={formatNumber(metrics.successfulTransactions)}
        accentColor="green"
        icon={<CheckCircle2 className="w-5 h-5 text-emerald-600" />}
        subtitle="Completed successfully"
      />

      {/* 6. Failed Transactions */}
      <KPICard
        title="Failed Transactions"
        value={formatNumber(metrics.failedTransactions)}
        accentColor="red"
        icon={<XCircle className="w-5 h-5 text-rose-600" />}
        subtitle="Declined / Bank errors"
      />

      {/* 7. Success Rate */}
      <KPICard
        title="Success Rate"
        value={formatPercentage(metrics.successRate, 2)}
        accentColor="purple"
        icon={<Activity className="w-5 h-5 text-purple-600" />}
        trend={{
          value: '+0.4%',
          isPositive: true,
          label: 'platform ratio',
        }}
      />

      {/* 8. Total Transactions */}
      <KPICard
        title="Total Transactions"
        value={formatNumber(metrics.totalTransactions)}
        accentColor="slate"
        icon={<Layers className="w-5 h-5 text-slate-600" />}
        subtitle="Total volume requests"
      />
    </div>
  );
};
