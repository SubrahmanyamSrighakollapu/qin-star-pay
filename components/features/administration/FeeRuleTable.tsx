'use client';

import React from 'react';
import { Table } from '@/components/ui/Table';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { FeeRule } from '@/types/domain';
import { formatCurrency, formatDate } from '@/utils/formatters';

export interface FeeRuleTableProps {
  data: FeeRule[];
  isLoading?: boolean;
}

export const FeeRuleTable: React.FC<FeeRuleTableProps> = ({
  data,
  isLoading = false,
}) => {
  const columns = [
    {
      key: 'code',
      header: 'Fee Code / Name',
      render: (row: FeeRule) => (
        <div>
          <span className="font-mono font-bold text-[var(--primary)] text-xs block">{row.code}</span>
          <span className="font-semibold text-xs text-slate-900">{row.name}</span>
        </div>
      ),
    },
    {
      key: 'transactionType',
      header: 'Type / Entity',
      render: (row: FeeRule) => (
        <div>
          <span className="px-1.5 py-0.2 rounded text-[10px] font-mono font-bold bg-blue-50 text-blue-900 border border-blue-200">
            {row.transactionType}
          </span>
          <div className="text-[11px] text-slate-500">{row.entityType}</div>
        </div>
      ),
    },
    {
      key: 'calculationType',
      header: 'Calculation / Value',
      align: 'right' as const,
      render: (row: FeeRule) => (
        <div className="font-mono text-xs">
          <span className="font-extrabold text-purple-900">
            {row.calculationType === 'PERCENTAGE' ? `${row.value}%` : formatCurrency(row.value)}
          </span>
          <div className="text-[10px] text-slate-500">
            Min: {formatCurrency(row.minimumFee)} | Max: {formatCurrency(row.maximumFee)}
          </div>
        </div>
      ),
    },
    {
      key: 'gstApplicable',
      header: 'GST Applicable',
      align: 'center' as const,
      render: (row: FeeRule) => (
        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${row.gstApplicable ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' : 'bg-slate-100 text-slate-700'}`}>
          {row.gstApplicable ? 'GST @18%' : 'EXEMPT'}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      align: 'center' as const,
      render: (row: FeeRule) => <StatusBadge status={row.status} size="sm" />,
    },
    {
      key: 'effectiveFrom',
      header: 'Effective From',
      render: (row: FeeRule) => (
        <span className="text-xs text-slate-500 font-mono whitespace-nowrap">{formatDate(row.effectiveFrom)}</span>
      ),
    },
  ];

  return (
    <div className="overflow-x-auto border border-[var(--border)] rounded-[var(--radius-xl)] bg-white shadow-xs">
      <Table
        columns={columns}
        data={data}
        keyExtractor={(row) => row.id}
        isLoading={isLoading}
      />
    </div>
  );
};
