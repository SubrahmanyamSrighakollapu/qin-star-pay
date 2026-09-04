'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { RetailerPlan } from '@/types/domain';
import { ShieldCheck, Percent, CreditCard, Award, Info } from 'lucide-react';
import { formatCurrency, formatDate } from '@/utils/formatters';

interface RetailerPlanSummaryCardProps {
  plan: RetailerPlan | null | undefined;
  isLoading?: boolean;
}

export const RetailerPlanSummaryCard: React.FC<RetailerPlanSummaryCardProps> = ({ plan, isLoading = false }) => {
  if (isLoading) {
    return (
      <Card title="Assigned Commercial Plan" subtitle="Active pricing schedule for your retailer outlet">
        <div className="p-4 space-y-3 animate-pulse">
          <div className="h-6 bg-slate-100 rounded w-1/3" />
          <div className="h-16 bg-slate-100 rounded" />
        </div>
      </Card>
    );
  }

  const planName = plan?.name || 'Standard Retailer Plan';
  const planCode = plan?.code || 'PLAN_STD_01';
  const payinRules = plan?.commissionRules?.filter((r) => r.serviceType === 'PAY_IN') || [];
  const payoutRules = plan?.commissionRules?.filter((r) => r.serviceType === 'PAY_OUT') || [];

  const payinSummaryText = payinRules.length > 0
    ? payinRules.map((r) => r.commissionType === 'PERCENTAGE' ? `${r.value}%` : formatCurrency(r.value)).join(', ')
    : '0.25% (UPI Collection)';

  const payoutSummaryText = payoutRules.length > 0
    ? payoutRules.map((r) => r.commissionType === 'PERCENTAGE' ? `${r.value}%` : formatCurrency(r.value)).join(', ')
    : '₹ 3.50 flat per transaction';

  return (
    <Card
      title={
        <div className="flex items-center gap-2">
          <Award className="w-4 h-4 text-amber-500" />
          <span>Assigned Commercial Plan</span>
        </div>
      }
      subtitle="Authorized pricing schedule & commission rules for your counter"
    >
      <div className="space-y-4 pt-1">
        {/* Main Plan Badge */}
        <div className="p-4 rounded-xl border border-amber-200/80 bg-gradient-to-r from-amber-50/60 via-amber-50/30 to-white flex flex-wrap items-center justify-between gap-3">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <h4 className="font-bold text-slate-900 text-sm">{planName}</h4>
              <StatusBadge status={plan?.status || 'ACTIVE'} size="sm" />
            </div>
            <p className="text-xs text-slate-500 font-mono">Code: {planCode}</p>
          </div>

          <div className="px-3 py-1 rounded-lg bg-amber-100/70 border border-amber-300/60 text-amber-900 font-mono text-xs font-bold flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-amber-700" /> Admin Assigned
          </div>
        </div>

        {/* Commission Rule Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3 rounded-lg border border-slate-200 bg-white space-y-1">
            <p className="font-bold text-slate-500 uppercase tracking-wider text-[10px] flex items-center gap-1">
              <Percent className="w-3.5 h-3.5 text-emerald-600" /> Pay-In Commission Margin
            </p>
            <p className="font-bold text-slate-900 font-mono text-sm">{payinSummaryText}</p>
            <p className="text-[11px] text-slate-500">Credited automatically on UPI collection</p>
          </div>

          <div className="p-3 rounded-lg border border-slate-200 bg-white space-y-1">
            <p className="font-bold text-slate-500 uppercase tracking-wider text-[10px] flex items-center gap-1">
              <CreditCard className="w-3.5 h-3.5 text-blue-600" /> Pay-Out Commission Margin
            </p>
            <p className="font-bold text-slate-900 font-mono text-sm">{payoutSummaryText}</p>
            <p className="text-[11px] text-slate-500">Credited automatically on IMPS disbursement</p>
          </div>
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100">
          <span className="flex items-center gap-1">
            <Info className="w-3.5 h-3.5 text-slate-400" /> Plan rates are read-only and governed by network admin configuration.
          </span>
          {plan?.createdAt && <span>Effective: {formatDate(plan.createdAt)}</span>}
        </div>
      </div>
    </Card>
  );
};
