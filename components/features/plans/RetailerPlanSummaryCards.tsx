import React from 'react';
import { KPICard } from '@/components/ui/KPICard';
import { Layers, CheckCircle2, XCircle, Users } from 'lucide-react';

export interface RetailerPlanSummaryCardsProps {
  totalPlans: number;
  activePlans: number;
  inactivePlans: number;
  assignedRetailers: number;
  isLoading?: boolean;
}

export const RetailerPlanSummaryCards: React.FC<RetailerPlanSummaryCardsProps> = ({
  totalPlans,
  activePlans,
  inactivePlans,
  assignedRetailers,
  isLoading = false,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <KPICard
        title="Total Plans"
        value={totalPlans}
        subtitle="Configured commercial structures"
        icon={<Layers className="w-5 h-5 text-[var(--primary)]" />}
        accentColor="blue"
        isLoading={isLoading}
      />
      <KPICard
        title="Active Plans"
        value={activePlans}
        subtitle="Available for new assignment"
        icon={<CheckCircle2 className="w-5 h-5 text-emerald-600" />}
        accentColor="green"
        isLoading={isLoading}
      />
      <KPICard
        title="Inactive Plans"
        value={inactivePlans}
        subtitle="Archived / deprecated plans"
        icon={<XCircle className="w-5 h-5 text-slate-500" />}
        accentColor="slate"
        isLoading={isLoading}
      />
      <KPICard
        title="Assigned Retailers"
        value={assignedRetailers}
        subtitle="Outlets mapped to active plans"
        icon={<Users className="w-5 h-5 text-purple-600" />}
        accentColor="purple"
        isLoading={isLoading}
      />
    </div>
  );
};
