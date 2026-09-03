'use client';

import React from 'react';
import { Table } from '@/components/ui/Table';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { ReasonCode } from '@/types/domain';

export interface ReasonCodeTableProps {
  data: ReasonCode[];
  isLoading?: boolean;
}

export const ReasonCodeTable: React.FC<ReasonCodeTableProps> = ({
  data,
  isLoading = false,
}) => {
  const columns = [
    {
      key: 'code',
      header: 'Code / Label',
      render: (row: ReasonCode) => (
        <div>
          <span className="font-mono font-bold text-[var(--primary)] text-xs block">{row.code}</span>
          <span className="font-semibold text-xs text-slate-900">{row.label}</span>
        </div>
      ),
    },
    {
      key: 'category',
      header: 'Category',
      render: (row: ReasonCode) => (
        <span className="px-1.5 py-0.2 rounded text-[10px] font-mono font-bold bg-blue-50 text-blue-900 border border-blue-200">
          {row.category}
        </span>
      ),
    },
    {
      key: 'description',
      header: 'Description',
      render: (row: ReasonCode) => (
        <span className="text-xs text-slate-600 leading-relaxed">{row.description}</span>
      ),
    },
    {
      key: 'requiresRemarks',
      header: 'Mandatory Remarks',
      align: 'center' as const,
      render: (row: ReasonCode) => (
        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${row.requiresRemarks ? 'bg-amber-100 text-amber-900 border border-amber-300' : 'bg-slate-100 text-slate-700'}`}>
          {row.requiresRemarks ? 'REQUIRED' : 'OPTIONAL'}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      align: 'center' as const,
      render: (row: ReasonCode) => <StatusBadge status={row.status} size="sm" />,
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
