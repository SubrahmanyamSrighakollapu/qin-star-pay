'use client';

import React from 'react';
import { ScopedDistributorSummary } from '@/services/distributorService';
import { FinancialMetricCard } from '@/components/features/financial/FinancialMetricCard';
import { Users, CheckCircle2, Clock, Store } from 'lucide-react';

interface DistributorSummaryCardsProps {
  summary: ScopedDistributorSummary;
  isLoading?: boolean;
}

export const DistributorSummaryCards: React.FC<DistributorSummaryCardsProps> = ({
  summary,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <FinancialMetricCard
        label="Total Distributors"
        value={summary.totalDistributors}
        subtext="Assigned to your network"
        icon={<Users className="w-3.5 h-3.5" />}
        variant="primary"
        isDominant
      />

      <FinancialMetricCard
        label="Active Distributors"
        value={summary.activeDistributors}
        subtext="Approved & transacting"
        icon={<CheckCircle2 className="w-3.5 h-3.5" />}
        variant="success"
      />

      <FinancialMetricCard
        label="Pending Admin Approval"
        value={summary.pendingApprovalDistributors || 0}
        subtext="Awaiting platform review"
        icon={<Clock className="w-3.5 h-3.5" />}
        variant="warning"
      />

      <FinancialMetricCard
        label="Retailers Managed"
        value={summary.totalRetailers}
        subtext="Across all your distributors"
        icon={<Store className="w-3.5 h-3.5" />}
        variant="neutral"
      />
    </div>
  );
};
