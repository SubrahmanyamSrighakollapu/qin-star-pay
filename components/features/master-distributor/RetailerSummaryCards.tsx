import React from 'react';
import { ScopedRetailerSummary } from '@/services/retailerService';
import { Store, CheckCircle2, Clock, XCircle } from 'lucide-react';

interface RetailerSummaryCardsProps {
  summary: ScopedRetailerSummary;
  isLoading?: boolean;
}

export const RetailerSummaryCards: React.FC<RetailerSummaryCardsProps> = ({
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
      title: 'Total Retailers',
      value: summary.totalRetailers,
      subtext: 'In your distributor network',
      icon: Store,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50 border-indigo-100',
    },
    {
      title: 'Active Retailers',
      value: summary.activeRetailers,
      subtext: 'Approved & transacting',
      icon: CheckCircle2,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50 border-emerald-100',
    },
    {
      title: 'Pending Admin Approval',
      value: summary.pendingApprovalRetailers,
      subtext: 'Awaiting platform review',
      icon: Clock,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50 border-amber-100',
    },
    {
      title: 'Inactive / Rejected',
      value: summary.inactiveRetailers,
      subtext: 'Requires action or review',
      icon: XCircle,
      color: 'text-rose-600',
      bgColor: 'bg-rose-50 border-rose-100',
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
