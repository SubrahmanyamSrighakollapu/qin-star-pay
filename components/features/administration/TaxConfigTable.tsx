'use client';

import React from 'react';
import { Table } from '@/components/ui/Table';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { TaxConfigurationItem } from '@/types/domain';
import { formatDate } from '@/utils/formatters';

export interface TaxConfigTableProps {
  data: TaxConfigurationItem[];
  isLoading?: boolean;
}

export const TaxConfigTable: React.FC<TaxConfigTableProps> = ({
  data,
  isLoading = false,
}) => {
  const columns = [
    {
      key: 'code',
      header: 'Tax Code / Description',
      render: (row: TaxConfigurationItem) => (
        <div>
          <span className="font-mono font-bold text-[var(--primary)] text-xs block">{row.code}</span>
          <span className="text-xs text-slate-700">{row.description}</span>
        </div>
      ),
    },
    {
      key: 'taxType',
      header: 'Tax Type',
      align: 'center' as const,
      render: (row: TaxConfigurationItem) => (
        <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-purple-50 text-purple-900 border border-purple-200">
          {row.taxType}
        </span>
      ),
    },
    {
      key: 'ratePercentage',
      header: 'Rate (%)',
      align: 'right' as const,
      render: (row: TaxConfigurationItem) => (
        <span className="font-mono font-extrabold text-xs text-emerald-800">{row.ratePercentage}%</span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      align: 'center' as const,
      render: (row: TaxConfigurationItem) => <StatusBadge status={row.status} size="sm" />,
    },
    {
      key: 'effectiveFrom',
      header: 'Effective Date',
      render: (row: TaxConfigurationItem) => (
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
