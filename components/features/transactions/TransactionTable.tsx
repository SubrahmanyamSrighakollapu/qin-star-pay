'use client';

import React from 'react';
import Link from 'next/link';
import { Eye, Copy, Check } from 'lucide-react';
import { Table } from '@/components/ui/Table';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Button } from '@/components/ui/Button';
import { Pagination } from '@/components/ui/Pagination';
import { ColumnDefinition } from '@/types/common';
import { Transaction, PaginationState } from '@/types/domain';
import { formatCurrency, formatDateTime } from '@/utils/formatters';

export interface TransactionTableProps {
  transactions: Transaction[];
  pagination: PaginationState;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  onViewDetails: (transaction: Transaction) => void;
  isLoading?: boolean;
}

export const TransactionTable: React.FC<TransactionTableProps> = ({
  transactions,
  pagination,
  onPageChange,
  onPageSizeChange,
  onViewDetails,
  isLoading = false,
}) => {
  const [copiedId, setCopiedId] = React.useState<string | null>(null);

  const handleCopyRef = (ref: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(ref);
    setCopiedId(ref);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const columns: ColumnDefinition<Transaction>[] = [
    {
      key: 'transactionRef',
      header: 'Transaction ID',
      render: (row) => (
        <div className="flex items-center gap-1.5 group">
          <Link
            href={`/admin/transactions/${row.id}`}
            className="font-mono font-bold text-[var(--primary)] text-xs hover:underline"
          >
            {row.transactionRef}
          </Link>
          <button
            type="button"
            onClick={(e) => handleCopyRef(row.transactionRef, e)}
            className="opacity-0 group-hover:opacity-100 p-0.5 text-slate-400 hover:text-slate-700 transition-opacity"
            title="Copy Transaction ID"
          >
            {copiedId === row.transactionRef ? (
              <Check className="w-3 h-3 text-emerald-600" />
            ) : (
              <Copy className="w-3 h-3" />
            )}
          </button>
        </div>
      ),
    },
    {
      key: 'type',
      header: 'Type',
      align: 'center',
      render: (row) => (
        <span
          className={`px-2 py-0.5 rounded-sm text-[11px] font-bold ${
            row.type === 'PAY_IN'
              ? 'bg-blue-50 text-blue-700 border border-blue-200'
              : row.type === 'PAY_OUT'
              ? 'bg-amber-50 text-amber-700 border border-amber-200'
              : 'bg-purple-50 text-purple-700 border border-purple-200'
          }`}
        >
          {row.type}
        </span>
      ),
    },
    {
      key: 'merchantName',
      header: 'Merchant / Retailer',
      render: (row) => (
        <div>
          <div className="font-semibold text-xs text-[var(--text-primary)]">{row.merchantName}</div>
          <div className="text-[11px] text-[var(--text-muted)]">
            {row.retailerName || row.distributorName || 'Direct'}
          </div>
        </div>
      ),
    },
    {
      key: 'amount',
      header: 'Amount',
      align: 'right',
      render: (row) => (
        <span className="font-bold text-[var(--text-primary)] tabular-nums">
          {formatCurrency(row.amount)}
        </span>
      ),
    },
    {
      key: 'provider',
      header: 'Provider',
      render: (row) => (
        <span className="text-xs text-slate-700 font-medium whitespace-nowrap">
          {row.provider || 'Provider A'}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      align: 'center',
      render: (row) => <StatusBadge status={row.status} size="sm" />,
    },
    {
      key: 'createdAt',
      header: 'Date & Time',
      render: (row) => (
        <span className="text-xs text-[var(--text-secondary)] whitespace-nowrap">
          {formatDateTime(row.createdAt)}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto border border-[var(--border)] rounded-[var(--radius-xl)] bg-white shadow-xs">
        <Table
          columns={columns}
          data={transactions}
          keyExtractor={(row) => row.id}
          isLoading={isLoading}
          renderActions={(row) => (
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onViewDetails(row)}
                leftIcon={<Eye className="w-3.5 h-3.5" />}
              >
                View
              </Button>
            </div>
          )}
        />
      </div>

      {/* Pagination Controls */}
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
