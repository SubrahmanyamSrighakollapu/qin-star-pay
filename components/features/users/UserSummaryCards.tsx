'use client';

import React from 'react';
import { KPICard } from '@/components/ui/KPICard';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';
import { Users, CheckCircle2, ShieldAlert, Clock, UserCheck } from 'lucide-react';

export interface UserSummaryMetrics {
  total: number;
  active: number;
  blocked: number;
  kycPending?: number;
}

export interface UserSummaryCardsProps {
  titlePrefix?: string;
  metrics?: UserSummaryMetrics;
  fourthCardTitle?: string;
  fourthCardValue?: string | number;
  isLoading?: boolean;
}

export const UserSummaryCards: React.FC<UserSummaryCardsProps> = ({
  titlePrefix = '',
  metrics,
  fourthCardTitle,
  fourthCardValue,
  isLoading = false,
}) => {
  if (isLoading || !metrics) {
    return <LoadingSkeleton variant="kpi" count={4} />;
  }

  const isCustomFourth = fourthCardTitle !== undefined;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <KPICard
        title={`Total ${titlePrefix}`}
        value={metrics.total.toLocaleString('en-IN')}
        accentColor="blue"
        icon={<Users className="w-5 h-5 text-[var(--primary)]" />}
      />

      <KPICard
        title="Active Accounts"
        value={metrics.active.toLocaleString('en-IN')}
        accentColor="green"
        icon={<CheckCircle2 className="w-5 h-5 text-emerald-600" />}
      />

      <KPICard
        title="Blocked / Suspended"
        value={metrics.blocked.toLocaleString('en-IN')}
        accentColor="red"
        icon={<ShieldAlert className="w-5 h-5 text-rose-600" />}
      />

      <KPICard
        title={fourthCardTitle || 'KYC Pending'}
        value={(fourthCardValue !== undefined
          ? fourthCardValue
          : metrics.kycPending || 0
        ).toLocaleString('en-IN')}
        accentColor={isCustomFourth ? 'purple' : 'gold'}
        icon={
          isCustomFourth ? (
            <UserCheck className="w-5 h-5 text-purple-600" />
          ) : (
            <Clock className="w-5 h-5 text-amber-600" />
          )
        }
      />
    </div>
  );
};
