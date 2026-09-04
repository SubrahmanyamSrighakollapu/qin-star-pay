'use client';

import React from 'react';
import Link from 'next/link';
import { KPICard } from '@/components/ui/KPICard';
import { Wallet, ArrowDownLeft, ArrowUpRight, ArrowLeftRight, CheckCircle2, Clock, AlertTriangle, Percent } from 'lucide-react';
import { formatCurrency } from '@/utils/formatters';
import { RetailerDashboardSummary } from '@/services/retailerDashboardService';

interface RetailerKPIGridProps {
  summary: RetailerDashboardSummary;
  isLoading?: boolean;
}

export const RetailerKPIGrid: React.FC<RetailerKPIGridProps> = ({ summary, isLoading = false }) => {
  const { wallet, transactionSummary, commissionSummary } = summary;

  return (
    <div className="space-y-6">
      {/* Primary Financial & Operation Cards */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] flex items-center gap-1.5">
            <Wallet className="w-3.5 h-3.5 text-amber-600" />
            Wallet & Volume Overview
          </h3>
          <span className="text-xs text-[var(--text-muted)] font-medium">Real-time Balance & Turnaround</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <KPICard
            title="Available Wallet Balance"
            value={formatCurrency(wallet.availableBalance)}
            subtitle={
              <Link href="/retailer/wallet" className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1">
                View Wallet & Ledger &rarr;
              </Link>
            }
            icon={<Wallet className="w-4 h-4 text-amber-600" />}
            accentColor="gold"
            isLoading={isLoading}
          />

          <KPICard
            title="Today's Pay-In Volume"
            value={formatCurrency(transactionSummary.todayPayInVolume)}
            subtitle="Customer UPI & Collection"
            icon={<ArrowDownLeft className="w-4 h-4 text-emerald-600" />}
            accentColor="green"
            isLoading={isLoading}
          />

          <KPICard
            title="Today's Pay-Out Volume"
            value={formatCurrency(transactionSummary.todayPayOutVolume)}
            subtitle="Disbursement volume"
            icon={<ArrowUpRight className="w-4 h-4 text-blue-600" />}
            accentColor="blue"
            isLoading={isLoading}
          />

          <KPICard
            title="Today's Transactions"
            value={transactionSummary.todayCount}
            subtitle={`${transactionSummary.successRate}% Success Rate`}
            icon={<ArrowLeftRight className="w-4 h-4 text-purple-600" />}
            accentColor="purple"
            isLoading={isLoading}
          />
        </div>
      </div>

      {/* Secondary Status & Commission KPI Cards */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] flex items-center gap-1.5">
            <Percent className="w-3.5 h-3.5 text-emerald-600" />
            Status & Commission Earnings
          </h3>
          <span className="text-xs text-[var(--text-muted)] font-medium">Retailer Performance Breakdown</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <KPICard
            title="Successful"
            value={transactionSummary.successfulCount}
            subtitle="Cleared by bank switch"
            icon={<CheckCircle2 className="w-4 h-4 text-emerald-600" />}
            accentColor="green"
            isLoading={isLoading}
          />

          <KPICard
            title="Pending"
            value={transactionSummary.pendingCount}
            subtitle="Processing with provider"
            icon={<Clock className="w-4 h-4 text-amber-600" />}
            accentColor="gold"
            isLoading={isLoading}
          />

          <KPICard
            title="Failed"
            value={transactionSummary.failedCount}
            subtitle="Reversed / Error"
            icon={<AlertTriangle className="w-4 h-4 text-rose-600" />}
            accentColor="red"
            isLoading={isLoading}
          />

          <KPICard
            title="Today's Commission"
            value={`+${formatCurrency(commissionSummary.todayCommission)}`}
            subtitle="Credited to wallet"
            icon={<Percent className="w-4 h-4 text-emerald-600" />}
            accentColor="green"
            isLoading={isLoading}
          />

          <KPICard
            title="Monthly Earnings"
            value={`+${formatCurrency(commissionSummary.thisMonthCommission)}`}
            subtitle="MTD earned margin"
            icon={<Percent className="w-4 h-4 text-blue-600" />}
            accentColor="blue"
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
};
