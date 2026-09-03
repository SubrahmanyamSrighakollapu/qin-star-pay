'use client';

import React from 'react';
import { Table } from '@/components/ui/Table';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Button } from '@/components/ui/Button';
import { Pagination } from '@/components/ui/Pagination';
import { ColumnDefinition } from '@/types/common';
import { SettlementBatch, PaginationState } from '@/types/domain';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { Eye } from 'lucide-react';

export interface SettlementBatchTableProps {
  batches: SettlementBatch[];
  pagination: PaginationState;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  onViewBatch: (batch: SettlementBatch) => void;
  isLoading?: boolean;
}

export const SettlementBatchTable: React.FC<SettlementBatchTableProps> = ({
  batches,
  pagination,
  onPageChange,
  onPageSizeChange,
  onViewBatch,
  isLoading = false,
}) => {
  const columns: ColumnDefinition<SettlementBatch>[] = [
    {
      key: 'batchId',
      header: 'Batch ID',
      render: (row) => (
        <span className="font-mono font-bold text-[var(--primary)] text-xs">{row.batchId}</span>
      ),
    },
    {
      key: 'provider',
      header: 'Clearing Provider',
      render: (row) => (
        <span className="font-semibold text-xs text-slate-900">{row.provider}</span>
      ),
    },
    {
      key: 'settlementCount',
      header: 'Settlement Count',
      align: 'center',
      render: (row) => (
        <span className="font-bold text-xs text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200">
          {row.settlementCount} Settlements
        </span>
      ),
    },
    {
      key: 'grossAmount',
      header: 'Gross Batch Volume',
      align: 'right',
      render: (row) => (
        <span className="font-mono font-semibold text-xs text-slate-700">
          {formatCurrency(row.grossAmount)}
        </span>
      ),
    },
    {
      key: 'netAmount',
      header: 'Net Batch Amount',
      align: 'right',
      render: (row) => (
        <span className="font-mono font-extrabold text-xs text-emerald-700">
          {formatCurrency(row.netAmount)}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Batch Status',
      align: 'center',
      render: (row) => <StatusBadge status={row.status} size="sm" />,
    },
    {
      key: 'createdAt',
      header: 'Created / Processed At',
      render: (row) => (
        <div>
          <div className="text-xs text-slate-800 font-medium">{formatDate(row.createdAt)}</div>
          <div className="text-[11px] text-slate-400 font-mono">
            {row.processedAt ? formatDate(row.processedAt) : 'Processing...'}
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto border border-[var(--border)] rounded-[var(--radius-xl)] bg-white shadow-xs">
        <Table
          columns={columns}
          data={batches}
          keyExtractor={(row) => row.batchId}
          isLoading={isLoading}
          renderActions={(row) => (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onViewBatch(row)}
              leftIcon={<Eye className="w-3.5 h-3.5" />}
              title="View Batch Details"
              aria-label="View Batch Details"
            >
              View Batch
            </Button>
          )}
        />
      </div>

      <Pagination
        currentPage={pagination.page}
        totalPages={pagination.totalPages}
        totalItems={pagination.totalItems}
        pageSize={pagination.pageSize}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
      />
    </div>
  );
};
