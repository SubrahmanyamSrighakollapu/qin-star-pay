'use client';

import React from 'react';
import { FinancialMetricCard } from '@/components/features/financial/FinancialMetricCard';
import { formatCurrency, formatNumber } from '@/utils/formatters';
import { Users, Store, CheckCircle2, Clock, ArrowDownLeft, ArrowUpRight, Wallet, Percent, Sparkles } from 'lucide-react';

export interface MasterDistributorKPIGridProps {
  totalDistributors: number;
  totalRetailers: number;
  activeRetailers: number;
  pendingRetailerApprovals: number;

  todayTransactionsCount: number;
  todayPayInVolume: number;
  todayPayOutVolume: number;

  walletBalance: number;
  walletHold?: number;
  todayCommission: number;
  monthlyCommission: number;

  isLoading?: boolean;
}

export const MasterDistributorKPIGrid: React.FC<MasterDistributorKPIGridProps> = ({
  totalDistributors,
  totalRetailers,
  activeRetailers,
  pendingRetailerApprovals,
  todayTransactionsCount,
  todayPayInVolume,
  todayPayOutVolume,
  walletBalance,
  walletHold = 0,
  todayCommission,
  monthlyCommission,
}) => {
  return (
    <div className="space-y-4">
      {/* 1. Primary Network & Financial Position Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <FinancialMetricCard
          label="Distributors"
          value={formatNumber(totalDistributors)}
          subtext="Assigned distribution partners"
          icon={<Users className="w-3.5 h-3.5" />}
          variant="primary"
          isDominant
        />

        <FinancialMetricCard
          label="Total Outlets"
          value={formatNumber(totalRetailers)}
          subtext={`${activeRetailers} active, ${pendingRetailerApprovals} pending`}
          icon={<Store className="w-3.5 h-3.5" />}
          variant="neutral"
          isDominant
        />

        <FinancialMetricCard
          label="Available Wallet"
          value={formatCurrency(walletBalance)}
          subtext={`Hold: ${formatCurrency(walletHold)}`}
          icon={<Wallet className="w-3.5 h-3.5" />}
          variant="payin"
          isDominant
        />

        <FinancialMetricCard
          label="This Month Earnings"
          value={`+${formatCurrency(monthlyCommission)}`}
          subtext={`Today: +${formatCurrency(todayCommission)}`}
          icon={<Sparkles className="w-3.5 h-3.5" />}
          variant="success"
          isDominant
        />
      </div>

      {/* 2. Operations & Volume Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-3">
        <FinancialMetricCard
          label="Pay-In Volume"
          value={formatCurrency(todayPayInVolume)}
          subtext="Today's collections"
          icon={<ArrowDownLeft className="w-3.5 h-3.5" />}
          variant="payin"
        />

        <FinancialMetricCard
          label="Pay-Out Volume"
          value={formatCurrency(todayPayOutVolume)}
          subtext="Today's disbursements"
          icon={<ArrowUpRight className="w-3.5 h-3.5" />}
          variant="payout"
        />

        <FinancialMetricCard
          label="Active Outlets"
          value={activeRetailers}
          subtext="Approved retail counters"
          icon={<CheckCircle2 className="w-3.5 h-3.5" />}
          variant="success"
        />

        <FinancialMetricCard
          label="Pending Approvals"
          value={pendingRetailerApprovals}
          subtext="Awaiting platform review"
          icon={<Clock className="w-3.5 h-3.5" />}
          variant="warning"
        />
      </div>
    </div>
  );
};
