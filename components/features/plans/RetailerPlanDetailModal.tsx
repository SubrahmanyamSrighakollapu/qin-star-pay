import React from 'react';
import { RetailerPlan } from '@/types/domain';
import { Drawer } from '@/components/ui/Drawer';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Button } from '@/components/ui/Button';
import { formatDate } from '@/utils/formatters';
import { Layers, Users, Calendar, ShieldCheck, Edit2 } from 'lucide-react';

export interface RetailerPlanDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: RetailerPlan | null;
  onEdit?: (plan: RetailerPlan) => void;
}

export const RetailerPlanDetailModal: React.FC<RetailerPlanDetailModalProps> = ({
  isOpen,
  onClose,
  plan,
  onEdit,
}) => {
  if (!plan) return null;

  const payinRule = plan.commissionRules.find((r) => r.serviceType === 'PAY_IN');
  const payoutRule = plan.commissionRules.find((r) => r.serviceType === 'PAY_OUT');

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      position="right"
      size="md"
      title={`Plan Details — ${plan.name}`}
    >
      <div className="space-y-6">
        {/* Header Badge Card */}
        <div className="p-4 rounded-[var(--radius-lg)] bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[var(--primary)] text-white flex items-center justify-center font-bold">
              <Layers className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-sm">{plan.name}</span>
              <span className="text-xs font-mono text-slate-400">{plan.code}</span>
            </div>
          </div>

          <StatusBadge
            status={plan.status === 'ACTIVE' ? 'ACTIVE' : 'INACTIVE'}
            label={plan.status}
          />
        </div>

        {/* Plan Overview Information */}
        <div className="space-y-3">
          <h4 className="text-xs font-extrabold uppercase tracking-wider text-[var(--text-muted)] flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[var(--primary)]" />
            Plan Overview & Scope
          </h4>

          <div className="bg-white border border-slate-200 rounded-[var(--radius-lg)] p-4 space-y-3 text-xs">
            <div>
              <span className="font-semibold text-slate-500 block mb-0.5">Description</span>
              <p className="text-[var(--text-primary)] font-medium">
                {plan.description || 'No description provided for this commercial plan.'}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100">
              <div>
                <span className="font-semibold text-slate-500 block mb-0.5">Assigned Outlets</span>
                <span className="font-bold text-slate-800 font-mono flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-purple-600" />
                  {plan.assignedRetailersCount} Retailers
                </span>
              </div>

              <div>
                <span className="font-semibold text-slate-500 block mb-0.5">Created By</span>
                <span className="font-medium text-slate-800">{plan.createdBy}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Commission Structure Rules */}
        <div className="space-y-3">
          <h4 className="text-xs font-extrabold uppercase tracking-wider text-[var(--text-muted)]">
            Configured Commercial Rules
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Pay-In Rule */}
            <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-[var(--radius-md)] flex flex-col justify-between">
              <span className="text-[10px] font-extrabold uppercase text-emerald-900 tracking-wider">
                Pay-In Service Margin
              </span>
              <div className="my-2">
                <span className="text-xl font-bold font-mono text-emerald-700">
                  {payinRule
                    ? payinRule.commissionType === 'PERCENTAGE'
                      ? `${payinRule.value}%`
                      : `₹${payinRule.value.toFixed(2)}`
                    : 'N/A'}
                </span>
              </div>
              <span className="text-[10px] font-semibold text-emerald-800">
                Rule Type: {payinRule?.commissionType || 'Not Configured'}
              </span>
            </div>

            {/* Pay-Out Rule */}
            <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-[var(--radius-md)] flex flex-col justify-between">
              <span className="text-[10px] font-extrabold uppercase text-blue-900 tracking-wider">
                Pay-Out Service Fee
              </span>
              <div className="my-2">
                <span className="text-xl font-bold font-mono text-blue-700">
                  {payoutRule
                    ? payoutRule.commissionType === 'PERCENTAGE'
                      ? `${payoutRule.value}%`
                      : `₹${payoutRule.value.toFixed(2)}`
                    : 'N/A'}
                </span>
              </div>
              <span className="text-[10px] font-semibold text-blue-800">
                Rule Type: {payoutRule?.commissionType || 'Not Configured'}
              </span>
            </div>
          </div>
        </div>

        {/* Validity & Audit Info */}
        <div className="space-y-3">
          <h4 className="text-xs font-extrabold uppercase tracking-wider text-[var(--text-muted)] flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-slate-500" />
            Effective Timeline & Governance
          </h4>

          <div className="bg-white border border-slate-200 rounded-[var(--radius-lg)] p-4 space-y-2 text-xs font-mono">
            <div className="flex justify-between items-center py-1 border-b border-slate-100">
              <span className="text-slate-500 font-sans">Effective From</span>
              <span className="font-semibold text-slate-800">{formatDate(plan.effectiveFrom)}</span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-slate-100">
              <span className="text-slate-500 font-sans">Effective To</span>
              <span className="font-semibold text-slate-800">
                {plan.effectiveTo ? formatDate(plan.effectiveTo) : 'Indefinite / Active'}
              </span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-slate-100">
              <span className="text-slate-500 font-sans">Created At</span>
              <span className="font-semibold text-slate-800">{formatDate(plan.createdAt)}</span>
            </div>
            {plan.updatedAt && (
              <div className="flex justify-between items-center py-1">
                <span className="text-slate-500 font-sans">Last Updated At</span>
                <span className="font-semibold text-slate-800">{formatDate(plan.updatedAt)}</span>
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-[var(--border)] flex items-center justify-between">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>

          {onEdit && (
            <Button
              variant="primary"
              leftIcon={<Edit2 className="w-4 h-4" />}
              onClick={() => {
                onClose();
                onEdit(plan);
              }}
            >
              Edit Plan
            </Button>
          )}
        </div>
      </div>
    </Drawer>
  );
};
