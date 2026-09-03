'use client';

import React from 'react';
import { KPICard } from '@/components/ui/KPICard';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';
import { formatCurrency, formatNumber, formatPercentage } from '@/utils/formatters';
import { CheckCircle2, XCircle, Clock, Activity, Layers } from 'lucide-react';

export interface TransactionSummaryMetrics {
  totalAmount: number;
  successfulCount: number;
  failedCount: number;
  pendingCount: number;
  successRate: number;
  totalCount: number;
}

export interface TransactionSummaryCardsProps {
  metrics?: TransactionSummaryMetrics;
  isLoading?: boolean;
}

export const TransactionSummaryCards: React.FC<TransactionSummaryCardsProps> = ({
  metrics,
  isLoading = false,
}) => {
  if (isLoading || !metrics) {
    return <LoadingSkeleton variant="kpi" count={5} />;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      <KPICard
        title="Total Amount"
        value={formatCurrency(metrics.totalAmount)}
        accentColor="blue"
        icon={<Layers className="w-5 h-5 text-[var(--primary)]" />}
      />

      <KPICard
        title="Successful"
        value={formatNumber(metrics.successfulCount)}
        accentColor="green"
        icon={<CheckCircle2 className="w-5 h-5 text-emerald-600" />}
      />

      <KPICard
        title="Failed"
        value={formatNumber(metrics.failedCount)}
        accentColor="red"
        icon={<XCircle className="w-5 h-5 text-rose-600" />}
      />

      <KPICard
        title="Pending / Processing"
        value={formatNumber(metrics.pendingCount)}
        accentColor="gold"
        icon={<Clock className="w-5 h-5 text-amber-600" />}
      />

      <KPICard
        title="Success Rate"
        value={formatPercentage(metrics.successRate)}
        accentColor="purple"
        icon={<Activity className="w-5 h-5 text-purple-600" />}
      />
    </div>
  );
};
