import React from 'react';
import { KPICard } from '@/components/ui/KPICard';
import { formatCurrency, formatNumber } from '@/utils/formatters';
import { Users, Store, CheckCircle2, Clock, ArrowLeftRight, ArrowDownLeft, ArrowUpRight, Wallet, Percent } from 'lucide-react';
import Link from 'next/link';

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
  todayCommission,
  monthlyCommission,
  isLoading = false,
}) => {
  return (
    <div className="space-y-4">
      {/* Network Structure KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Direct Distributors"
          value={formatNumber(totalDistributors)}
          subtitle="Assigned distribution partners"
          icon={<Users className="w-5 h-5 text-purple-600" />}
          accentColor="purple"
          isLoading={isLoading}
        />

        <KPICard
          title="Total Outlets"
          value={formatNumber(totalRetailers)}
          subtitle="Retailers in distribution network"
          icon={<Store className="w-5 h-5 text-[var(--primary)]" />}
          accentColor="blue"
          isLoading={isLoading}
        />

        <KPICard
          title="Active Outlets"
          value={formatNumber(activeRetailers)}
          subtitle="Approved & active retail counters"
          icon={<CheckCircle2 className="w-5 h-5 text-emerald-600" />}
          accentColor="green"
          isLoading={isLoading}
        />

        <KPICard
          title="Awaiting Admin Approval"
          value={formatNumber(pendingRetailerApprovals)}
          subtitle="Pending platform onboarding review"
          icon={<Clock className="w-5 h-5 text-amber-600" />}
          accentColor="gold"
          isLoading={isLoading}
        />
      </div>

      {/* Financial & Operational Performance KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <KPICard
          title="Today's Txns"
          value={formatNumber(todayTransactionsCount)}
          subtitle="Processed network count"
          icon={<ArrowLeftRight className="w-4 h-4 text-blue-600" />}
          accentColor="blue"
          isLoading={isLoading}
        />

        <KPICard
          title="Today's Pay-In"
          value={formatCurrency(todayPayInVolume)}
          subtitle="Gross collection volume"
          icon={<ArrowDownLeft className="w-4 h-4 text-emerald-600" />}
          accentColor="green"
          isLoading={isLoading}
        />

        <KPICard
          title="Today's Pay-Out"
          value={formatCurrency(todayPayOutVolume)}
          subtitle="Gross disbursal volume"
          icon={<ArrowUpRight className="w-4 h-4 text-blue-700" />}
          accentColor="blue"
          isLoading={isLoading}
        />

        <KPICard
          title="MD Wallet"
          value={formatCurrency(walletBalance)}
          subtitle="Available Master balance"
          icon={<Wallet className="w-4 h-4 text-amber-600" />}
          accentColor="gold"
          isLoading={isLoading}
          badge={
            <Link href="/master-distributor/wallet" className="text-[10px] font-bold text-amber-700 hover:underline">
              View
            </Link>
          }
        />

        <KPICard
          title="Today's Earning"
          value={formatCurrency(todayCommission)}
          subtitle="Master commission today"
          icon={<Percent className="w-4 h-4 text-purple-600" />}
          accentColor="purple"
          isLoading={isLoading}
        />

        <KPICard
          title="MTD Earning"
          value={formatCurrency(monthlyCommission)}
          subtitle="Month-to-date commission"
          icon={<Percent className="w-4 h-4 text-purple-700" />}
          accentColor="purple"
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};
