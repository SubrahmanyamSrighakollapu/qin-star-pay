import React from 'react';
import Link from 'next/link';
import { KPICard } from '@/components/ui/KPICard';
import { Store, CheckCircle2, Clock, AlertTriangle, ArrowDownLeft, ArrowUpRight, Wallet, Percent, ArrowLeftRight } from 'lucide-react';
import { formatCurrency } from '@/utils/formatters';
import { DistributorDashboardSummary } from '@/services/distributorDashboardService';

interface DistributorKPIGridProps {
  summary: DistributorDashboardSummary;
  isLoading?: boolean;
}

export const DistributorKPIGrid: React.FC<DistributorKPIGridProps> = ({ summary, isLoading = false }) => {
  return (
    <div className="space-y-6">
      {/* 1. Primary Network KPIs */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] flex items-center gap-1.5">
            <Store className="w-3.5 h-3.5 text-blue-600" />
            Retailer Network Summary
          </h3>
          <span className="text-xs text-[var(--text-muted)] font-medium">Directly Assigned Outlets</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <KPICard
            title="Total Retailers"
            value={summary.totalRetailers}
            subtitle="Mapped to your distributor code"
            icon={<Store className="w-4 h-4" />}
            accentColor="blue"
            isLoading={isLoading}
          />
          <KPICard
            title="Active Retailers"
            value={summary.activeRetailers}
            subtitle="Approved & active account status"
            icon={<CheckCircle2 className="w-4 h-4 text-emerald-600" />}
            accentColor="green"
            isLoading={isLoading}
          />
          <KPICard
            title="Pending Approval"
            value={summary.pendingAdminApprovalRetailers}
            subtitle="Awaiting Admin Approval"
            icon={<Clock className="w-4 h-4 text-amber-600" />}
            accentColor="gold"
            isLoading={isLoading}
          />
          <KPICard
            title="Inactive / Rejected"
            value={summary.inactiveRetailers}
            subtitle="Suspended or rejected applications"
            icon={<AlertTriangle className="w-4 h-4 text-rose-600" />}
            accentColor="red"
            isLoading={isLoading}
          />
        </div>
      </div>

      {/* 2. Financial KPI Group */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] flex items-center gap-1.5">
            <ArrowLeftRight className="w-3.5 h-3.5 text-emerald-600" />
            Financial & Commission Overview
          </h3>
          <span className="text-xs text-[var(--text-muted)] font-medium">Today's Scoped Business</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          <KPICard
            title="Today's Txns"
            value={summary.todayTransactionsCount}
            subtitle="Successful network requests"
            icon={<ArrowLeftRight className="w-4 h-4" />}
            accentColor="blue"
            isLoading={isLoading}
          />
          <KPICard
            title="Today's Pay-In"
            value={formatCurrency(summary.todayPayInVolume)}
            subtitle="Network collection volume"
            icon={<ArrowDownLeft className="w-4 h-4 text-blue-600" />}
            accentColor="blue"
            isLoading={isLoading}
          />
          <KPICard
            title="Today's Pay-Out"
            value={formatCurrency(summary.todayPayOutVolume)}
            subtitle="Disbursement volume"
            icon={<ArrowUpRight className="w-4 h-4 text-purple-600" />}
            accentColor="purple"
            isLoading={isLoading}
          />
          <KPICard
            title="Wallet Balance"
            value={formatCurrency(summary.walletBalance)}
            subtitle={
              <Link href="/distributor/wallet" className="text-xs font-semibold text-blue-600 hover:underline">
                View Wallet &rarr;
              </Link>
            }
            icon={<Wallet className="w-4 h-4 text-amber-600" />}
            accentColor="gold"
            isLoading={isLoading}
          />
          <KPICard
            title="Today's Commission"
            value={formatCurrency(summary.todayCommission)}
            subtitle="Earned distributor margin"
            icon={<Percent className="w-4 h-4 text-emerald-600" />}
            accentColor="green"
            isLoading={isLoading}
          />
          <KPICard
            title="Monthly Commission"
            value={formatCurrency(summary.thisMonthCommission)}
            subtitle="MTD credited margin"
            icon={<Percent className="w-4 h-4 text-emerald-600" />}
            accentColor="green"
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
};
