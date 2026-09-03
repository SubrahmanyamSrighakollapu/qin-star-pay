'use client';

import React from 'react';
import { Table } from '@/components/ui/Table';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Button } from '@/components/ui/Button';
import { Pagination } from '@/components/ui/Pagination';
import { ColumnDefinition } from '@/types/common';
import { SettlementReconciliation, PaginationState } from '@/types/domain';
import { formatCurrency } from '@/utils/formatters';
import { Eye, ShieldCheck } from 'lucide-react';

export interface ReconciliationTableProps {
  records: SettlementReconciliation[];
  pagination: PaginationState;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  onViewRecord: (record: SettlementReconciliation) => void;
  onResolveMismatch?: (record: SettlementReconciliation) => void;
  isLoading?: boolean;
}

export const ReconciliationTable: React.FC<ReconciliationTableProps> = ({
  records,
  pagination,
  onPageChange,
  onPageSizeChange,
  onViewRecord,
  onResolveMismatch,
  isLoading = false,
}) => {
  const columns: ColumnDefinition<SettlementReconciliation>[] = [
    {
      key: 'reconciliationId',
      header: 'Rec ID / Settlement ID',
      render: (row) => (
        <div>
          <span className="font-mono font-bold text-[var(--primary)] text-xs block">{row.reconciliationId}</span>
          <span className="text-[11px] font-mono text-slate-500">{row.settlementId}</span>
        </div>
      ),
    },
    {
      key: 'entityName',
      header: 'Target Entity',
      render: (row) => (
        <span className="font-semibold text-xs text-slate-900">{row.entityName}</span>
      ),
    },
    {
      key: 'internalAmount',
      header: 'Internal Amount',
      align: 'right',
      render: (row) => (
        <span className="font-mono font-semibold text-xs text-slate-700">
          {formatCurrency(row.internalAmount)}
        </span>
      ),
    },
    {
      key: 'providerAmount',
      header: 'Provider Amount',
      align: 'right',
      render: (row) => (
        <span className="font-mono font-semibold text-xs text-slate-700">
          {formatCurrency(row.providerAmount)}
        </span>
      ),
    },
    {
      key: 'difference',
      header: 'Difference',
      align: 'right',
      render: (row) => (
        <span
          className={`font-mono font-extrabold text-xs ${
            row.difference > 0 ? 'text-rose-600' : 'text-emerald-700'
          }`}
        >
          {row.difference > 0 ? `+${formatCurrency(row.difference)}` : '₹0.00'}
        </span>
      ),
    },
    {
      key: 'reconciliationStatus',
      header: 'Rec Status',
      align: 'center',
      render: (row) => <StatusBadge status={row.reconciliationStatus} size="sm" />,
    },
    {
      key: 'utr',
      header: 'UTR / Bank Ref',
      render: (row) => (
        <div>
          <div className="font-mono text-xs font-bold text-slate-800">{row.utr || '—'}</div>
          <div className="font-mono text-[11px] text-slate-400">{row.bankReference || '—'}</div>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto border border-[var(--border)] rounded-[var(--radius-xl)] bg-white shadow-xs">
        <Table
          columns={columns}
          data={records}
          keyExtractor={(row) => row.reconciliationId}
          isLoading={isLoading}
          renderActions={(row) => (
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onViewRecord(row)}
                leftIcon={<Eye className="w-3.5 h-3.5" />}
                title="View Reconciliation Details"
                aria-label="View Reconciliation Details"
              >
                Inspect
              </Button>

              {onResolveMismatch && row.reconciliationStatus === 'MISMATCHED' && (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => onResolveMismatch(row)}
                  leftIcon={<ShieldCheck className="w-3.5 h-3.5" />}
                  title="Resolve Discrepancy"
                  aria-label="Resolve Discrepancy"
                  className="px-2"
                >
                  Resolve
                </Button>
              )}
            </div>
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
