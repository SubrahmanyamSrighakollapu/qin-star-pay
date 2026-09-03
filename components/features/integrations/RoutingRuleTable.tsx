'use client';

import React from 'react';
import { Table } from '@/components/ui/Table';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { RoutingRule } from '@/types/domain';
import { formatCurrency } from '@/utils/formatters';
import { ArrowRight } from 'lucide-react';

export interface RoutingRuleTableProps {
  data: RoutingRule[];
  isLoading?: boolean;
}

export const RoutingRuleTable: React.FC<RoutingRuleTableProps> = ({
  data,
  isLoading = false,
}) => {
  const columns = [
    {
      key: 'id',
      header: 'Rule ID / Type',
      render: (row: RoutingRule) => (
        <div>
          <span className="font-mono font-bold text-[var(--primary)] text-xs block">{row.id}</span>
          <span className="text-[11px] font-semibold text-purple-700">{row.transactionType}</span>
        </div>
      ),
    },
    {
      key: 'primaryProviderName',
      header: 'Primary → Fallback Provider',
      render: (row: RoutingRule) => (
        <div className="flex items-center gap-2 text-xs">
          <span className="font-bold text-slate-900">{row.primaryProviderName}</span>
          <ArrowRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="font-semibold text-purple-700">{row.secondaryProviderName}</span>
        </div>
      ),
    },
    {
      key: 'amountRange',
      header: 'Amount Range',
      render: (row: RoutingRule) => (
        <span className="font-mono text-xs text-slate-700">
          {formatCurrency(row.minAmount)} – {formatCurrency(row.maxAmount)}
        </span>
      ),
    },
    {
      key: 'mode',
      header: 'Mode / Entity',
      align: 'center' as const,
      render: (row: RoutingRule) => (
        <div>
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-800 border border-slate-200">
            {row.mode}
          </span>
          <div className="text-[10px] text-slate-500 mt-0.5">{row.entityType}</div>
        </div>
      ),
    },
    {
      key: 'priority',
      header: 'Priority',
      align: 'center' as const,
      render: (row: RoutingRule) => (
        <span className="font-mono font-bold text-xs text-slate-800">P{row.priority}</span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      align: 'center' as const,
      render: (row: RoutingRule) => <StatusBadge status={row.status} size="sm" />,
    },
  ];

  return (
    <div className="overflow-x-auto border border-[var(--border)] rounded-[var(--radius-xl)] bg-white shadow-xs">
      <Table columns={columns} data={data} keyExtractor={(row) => row.id} isLoading={isLoading} />
    </div>
  );
};
