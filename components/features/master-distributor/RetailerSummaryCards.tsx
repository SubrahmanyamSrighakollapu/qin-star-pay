'use client';

import React from 'react';
import { ScopedRetailerSummary } from '@/services/retailerService';
import { FinancialMetricCard } from '@/components/features/financial/FinancialMetricCard';
import { Store, CheckCircle2, Clock, XCircle } from 'lucide-react';

interface RetailerSummaryCardsProps {
  summary: ScopedRetailerSummary;
  isLoading?: boolean;
}

export const RetailerSummaryCards: React.FC<RetailerSummaryCardsProps> = ({
  summary,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <FinancialMetricCard
        label="Total Retailers"
        value={summary.totalRetailers}
        subtext="In your distributor network"
        icon={<Store className="w-3.5 h-3.5" />}
        variant="primary"
        isDominant
      />

      <FinancialMetricCard
        label="Active Retailers"
        value={summary.activeRetailers}
        subtext="Approved & transacting"
        icon={<CheckCircle2 className="w-3.5 h-3.5" />}
        variant="success"
      />

      <FinancialMetricCard
        label="Pending Admin Approval"
        value={summary.pendingApprovalRetailers}
        subtext="Awaiting platform review"
        icon={<Clock className="w-3.5 h-3.5" />}
        variant="warning"
      />

      <FinancialMetricCard
        label="Inactive / Rejected"
        value={summary.inactiveRetailers}
        subtext="Requires action or review"
        icon={<XCircle className="w-3.5 h-3.5" />}
        variant="danger"
      />
    </div>
  );
};
