import React from 'react';
import { ScopedDistributorSummary } from '@/services/distributorService';
import { Users, CheckCircle2, Clock, Store } from 'lucide-react';

interface DistributorSummaryCardsProps {
  summary: ScopedDistributorSummary;
  isLoading?: boolean;
}

export const DistributorSummaryCards: React.FC<DistributorSummaryCardsProps> = ({
  summary,
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-24 rounded-xl border border-slate-200 bg-slate-50 animate-pulse p-4"
          />
        ))}
      </div>
    );
  }

  const cards = [
    {
      title: 'Total Distributors',
      value: summary.totalDistributors,
      subtext: 'Assigned to your network',
      icon: Users,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50 border-indigo-100',
    },
    {
      title: 'Active Distributors',
      value: summary.activeDistributors,
      subtext: 'Approved & transacting',
      icon: CheckCircle2,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50 border-emerald-100',
    },
    {
      title: 'Pending Admin Approval',
      value: summary.pendingApprovalDistributors || 0,
      subtext: 'Awaiting platform review',
      icon: Clock,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50 border-amber-100',
    },
    {
      title: 'Total Retailers Managed',
      value: summary.totalRetailers,
      subtext: 'Across all your distributors',
      icon: Store,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 border-blue-100',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow flex items-start justify-between"
          >
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                {card.title}
              </p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">{card.value}</h3>
              <p className="text-xs text-slate-500 mt-0.5">{card.subtext}</p>
            </div>
            <div className={`p-2.5 rounded-lg border ${card.bgColor}`}>
              <Icon className={`w-5 h-5 ${card.color}`} />
            </div>
          </div>
        );
      })}
    </div>
  );
};
