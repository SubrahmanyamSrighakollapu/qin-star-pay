'use client';

import React from 'react';
import { KPICard } from '@/components/ui/KPICard';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';
import { Wallet, Scale, Lock, Clock } from 'lucide-react';
import { formatCurrency } from '@/utils/formatters';

export interface WalletSummaryMetrics {
  totalAvailable: number;
  totalLedger: number;
  totalHold: number;
  totalPendingSettlement: number;
}

export interface WalletSummaryCardsProps {
  metrics?: WalletSummaryMetrics;
  isLoading?: boolean;
}

export const WalletSummaryCards: React.FC<WalletSummaryCardsProps> = ({
  metrics,
  isLoading = false,
}) => {
  if (isLoading || !metrics) {
    return <LoadingSkeleton variant="kpi" count={4} />;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <KPICard
        title="Total Available Balance"
        value={formatCurrency(metrics.totalAvailable)}
        accentColor="blue"
        icon={<Wallet className="w-5 h-5 text-[var(--primary)]" />}
      />

      <KPICard
        title="Total Ledger Balance"
        value={formatCurrency(metrics.totalLedger)}
        accentColor="green"
        icon={<Scale className="w-5 h-5 text-emerald-600" />}
      />

      <KPICard
        title="Total Hold Balance"
        value={formatCurrency(metrics.totalHold)}
        accentColor="red"
        icon={<Lock className="w-5 h-5 text-rose-600" />}
      />

      <KPICard
        title="Pending Settlement"
        value={formatCurrency(metrics.totalPendingSettlement)}
        accentColor="gold"
        icon={<Clock className="w-5 h-5 text-amber-600" />}
      />
    </div>
  );
};
