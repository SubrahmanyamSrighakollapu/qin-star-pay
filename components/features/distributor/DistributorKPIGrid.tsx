'use client';

import React from 'react';
import { FinancialMetricCard } from '@/components/features/financial/FinancialMetricCard';
import { formatCurrency, formatNumber } from '@/utils/formatters';
import { DistributorDashboardSummary } from '@/services/distributorDashboardService';
import { Store, CheckCircle2, Clock, ArrowDownLeft, ArrowUpRight, Wallet, Sparkles } from 'lucide-react';

interface DistributorKPIGridProps {
  summary: DistributorDashboardSummary;
  isLoading?: boolean;
}

export const DistributorKPIGrid: React.FC<DistributorKPIGridProps> = ({ summary }) => {
  return (
    <div className="space-y-4">
      {/* 1. Primary Network & Financial Position Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <FinancialMetricCard
          label="Total Retailers"
          value={formatNumber(summary.totalRetailers)}
          subtext="Mapped retailers"
          icon={<Store className="w-3.5 h-3.5" />}
          variant="primary"
          isDominant
        />

        <FinancialMetricCard
          label="Active Retailers"
          value={formatNumber(summary.activeRetailers)}
          subtext={`${summary.pendingAdminApprovalRetailers} pending approval`}
          icon={<CheckCircle2 className="w-3.5 h-3.5" />}
          variant="success"
          isDominant
        />

        <FinancialMetricCard
          label="Available Wallet"
          value={formatCurrency(summary.walletBalance)}
          subtext={`Hold: ${formatCurrency(summary.walletHold || 0)}`}
          icon={<Wallet className="w-3.5 h-3.5" />}
          variant="payin"
          isDominant
        />

        <FinancialMetricCard
          label="Monthly Earnings"
          value={`+${formatCurrency(summary.thisMonthCommission)}`}
          subtext={`Today: +${formatCurrency(summary.todayCommission)}`}
          icon={<Sparkles className="w-3.5 h-3.5" />}
          variant="success"
          isDominant
        />
      </div>

      {/* 2. Operations & Volume Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-3">
        <FinancialMetricCard
          label="Pay-In Volume"
          value={formatCurrency(summary.todayPayInVolume)}
          subtext="Today's collections"
          icon={<ArrowDownLeft className="w-3.5 h-3.5" />}
          variant="payin"
        />

        <FinancialMetricCard
          label="Pay-Out Volume"
          value={formatCurrency(summary.todayPayOutVolume)}
          subtext="Today's disbursements"
          icon={<ArrowUpRight className="w-3.5 h-3.5" />}
          variant="payout"
        />

        <FinancialMetricCard
          label="Pending Admin Approval"
          value={summary.pendingAdminApprovalRetailers}
          subtext="Awaiting platform review"
          icon={<Clock className="w-3.5 h-3.5" />}
          variant="warning"
        />

        <FinancialMetricCard
          label="Today's Transactions"
          value={formatNumber(summary.todayTransactionsCount)}
          subtext="Processed network requests"
          icon={<CheckCircle2 className="w-3.5 h-3.5" />}
          variant="neutral"
        />
      </div>
    </div>
  );
};
