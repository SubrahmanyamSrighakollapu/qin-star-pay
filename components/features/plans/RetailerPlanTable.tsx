import React from 'react';
import { RetailerPlan } from '@/types/domain';
import { ColumnDefinition } from '@/types/common';
import { Table } from '@/components/ui/Table';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Button } from '@/components/ui/Button';
import { Eye, Edit2, Power, Users } from 'lucide-react';
import { formatDate } from '@/utils/formatters';

export interface RetailerPlanTableProps {
  plans: RetailerPlan[];
  isLoading?: boolean;
  onViewPlan: (plan: RetailerPlan) => void;
  onEditPlan: (plan: RetailerPlan) => void;
  onToggleStatus: (plan: RetailerPlan) => void;
}

export const RetailerPlanTable: React.FC<RetailerPlanTableProps> = ({
  plans,
  isLoading = false,
  onViewPlan,
  onEditPlan,
  onToggleStatus,
}) => {
  const columns: ColumnDefinition<RetailerPlan>[] = [
    {
      key: 'code',
      header: 'Plan ID & Code',
      render: (row: RetailerPlan) => (
        <div className="flex flex-col">
          <span className="font-mono font-bold text-xs text-[var(--primary)]">{row.code}</span>
          <span className="text-[10px] text-[var(--text-muted)] font-mono">{row.id}</span>
        </div>
      ),
    },
    {
      key: 'name',
      header: 'Plan Name',
      render: (row: RetailerPlan) => (
        <div className="flex flex-col max-w-xs">
          <span className="font-semibold text-xs text-[var(--text-primary)]">{row.name}</span>
          {row.description && (
            <span className="text-[11px] text-[var(--text-muted)] truncate">{row.description}</span>
          )}
        </div>
      ),
    },
    {
      key: 'payin',
      header: 'Pay-In Commission',
      render: (row: RetailerPlan) => {
        const payinRule = row.commissionRules.find((r) => r.serviceType === 'PAY_IN');
        if (!payinRule) return <span className="text-xs text-[var(--text-muted)]">N/A</span>;
        return (
          <div className="flex items-center gap-1.5">
            <span className="font-mono font-bold text-xs text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
              {payinRule.commissionType === 'PERCENTAGE'
                ? `${payinRule.value}%`
                : `₹${payinRule.value.toFixed(2)}`}
            </span>
            <span className="text-[10px] uppercase font-bold text-[var(--text-muted)]">
              ({payinRule.commissionType})
            </span>
          </div>
        );
      },
    },
    {
      key: 'payout',
      header: 'Pay-Out Commission',
      render: (row: RetailerPlan) => {
        const payoutRule = row.commissionRules.find((r) => r.serviceType === 'PAY_OUT');
        if (!payoutRule) return <span className="text-xs text-[var(--text-muted)]">N/A</span>;
        return (
          <div className="flex items-center gap-1.5">
            <span className="font-mono font-bold text-xs text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
              {payoutRule.commissionType === 'PERCENTAGE'
                ? `${payoutRule.value}%`
                : `₹${payoutRule.value.toFixed(2)}`}
            </span>
            <span className="text-[10px] uppercase font-bold text-[var(--text-muted)]">
              ({payoutRule.commissionType})
            </span>
          </div>
        );
      },
    },
    {
      key: 'assigned',
      header: 'Assigned Outlets',
      render: (row: RetailerPlan) => (
        <div className="flex items-center gap-1 text-xs font-semibold text-slate-700">
          <Users className="w-3.5 h-3.5 text-slate-400" />
          <span className="font-mono">{row.assignedRetailersCount}</span>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (row: RetailerPlan) => (
        <StatusBadge
          status={row.status === 'ACTIVE' ? 'ACTIVE' : 'INACTIVE'}
          label={row.status}
        />
      ),
    },
    {
      key: 'effectiveFrom',
      header: 'Effective From',
      render: (row: RetailerPlan) => (
        <span className="text-xs text-[var(--text-muted)] font-mono">
          {formatDate(row.effectiveFrom)}
        </span>
      ),
    },
    {
      key: 'updatedAt',
      header: 'Last Updated',
      render: (row: RetailerPlan) => (
        <span className="text-xs text-[var(--text-muted)] font-mono">
          {formatDate(row.updatedAt || row.createdAt)}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      render: (row: RetailerPlan) => (
        <div className="flex items-center justify-end gap-1.5">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onViewPlan(row)}
            title="View Details"
            aria-label={`View details for ${row.name}`}
          >
            <Eye className="w-3.5 h-3.5 text-slate-600" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEditPlan(row)}
            title="Edit Plan"
            aria-label={`Edit ${row.name}`}
          >
            <Edit2 className="w-3.5 h-3.5 text-blue-600" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => onToggleStatus(row)}
            title={row.status === 'ACTIVE' ? 'Deactivate Plan' : 'Activate Plan'}
            aria-label={`${row.status === 'ACTIVE' ? 'Deactivate' : 'Activate'} ${row.name}`}
          >
            <Power
              className={`w-3.5 h-3.5 ${
                row.status === 'ACTIVE' ? 'text-emerald-600 hover:text-rose-600' : 'text-slate-400 hover:text-emerald-600'
              }`}
            />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      data={plans}
      isLoading={isLoading}
      emptyTitle="No retailer plans found"
      emptyDescription="No records matching your filter criteria."
      keyExtractor={(item) => item.id}
    />
  );
};
