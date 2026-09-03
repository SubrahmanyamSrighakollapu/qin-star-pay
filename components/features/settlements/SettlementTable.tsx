'use client';

import React from 'react';
import { Table } from '@/components/ui/Table';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Button } from '@/components/ui/Button';
import { Pagination } from '@/components/ui/Pagination';
import { ColumnDefinition } from '@/types/common';
import { Settlement, PaginationState } from '@/types/domain';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { Eye, Play, RefreshCw } from 'lucide-react';

export interface SettlementTableProps {
  settlements: Settlement[];
  pagination: PaginationState;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  onViewDetails: (settlement: Settlement) => void;
  onProcessSettlement?: (settlement: Settlement) => void;
  onCheckStatus?: (settlement: Settlement) => void;
  isLoading?: boolean;
}

export const SettlementTable: React.FC<SettlementTableProps> = ({
  settlements,
  pagination,
  onPageChange,
  onPageSizeChange,
  onViewDetails,
  onProcessSettlement,
  onCheckStatus,
  isLoading = false,
}) => {
  const columns: ColumnDefinition<Settlement>[] = [
    {
      key: 'settlementId',
      header: 'Settlement ID / Mode',
      render: (row) => (
        <div>
          <span className="font-mono font-bold text-[var(--primary)] text-xs block">{row.settlementId}</span>
          <span className="text-[11px] font-mono text-slate-500">{row.settlementMode} • {row.settlementCycle}</span>
        </div>
      ),
    },
    {
      key: 'entityName',
      header: 'Target Entity',
      render: (row) => (
        <div>
          <div className="font-semibold text-xs text-slate-900">{row.entityName}</div>
          <div className="text-[11px] font-semibold text-purple-700">{row.entityType} ({row.entityCode})</div>
        </div>
      ),
    },
    {
      key: 'grossAmount',
      header: 'Gross Amount',
      align: 'right',
      render: (row) => (
        <span className="font-mono font-semibold text-xs text-slate-700">
          {formatCurrency(row.grossAmount)}
        </span>
      ),
    },
    {
      key: 'charges',
      header: 'Charges / Tax',
      align: 'right',
      render: (row) => {
        const totalDeductions = row.charges + row.tax + row.tds + row.holdAmount;
        return (
          <span className="font-mono text-xs text-rose-600 font-medium">
            -{formatCurrency(totalDeductions)}
          </span>
        );
      },
    },
    {
      key: 'netSettlementAmount',
      header: 'Net Settlement Amount',
      align: 'right',
      render: (row) => (
        <span className="font-mono font-extrabold text-xs text-emerald-700">
          {formatCurrency(row.netSettlementAmount)}
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
      key: 'scheduledAt',
      header: 'Scheduled / Settled Date',
      render: (row) => (
        <div>
          <div className="text-xs text-slate-800 font-medium">{formatDate(row.settledAt || row.scheduledAt)}</div>
          <div className="text-[11px] text-slate-400 font-mono">{row.provider}</div>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto border border-[var(--border)] rounded-[var(--radius-xl)] bg-white shadow-xs">
        <Table
          columns={columns}
          data={settlements}
          keyExtractor={(row) => row.settlementId}
          isLoading={isLoading}
          renderActions={(row) => (
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onViewDetails(row)}
                leftIcon={<Eye className="w-3.5 h-3.5" />}
                title="View Settlement Details"
                aria-label="View Settlement Details"
              >
                Details
              </Button>

              {onProcessSettlement && (row.status === 'ELIGIBLE' || row.status === 'QUEUED') && (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => onProcessSettlement(row)}
                  title="Process Settlement Batch"
                  aria-label="Process Settlement Batch"
                  className="px-2"
                >
                  <Play className="w-3.5 h-3.5 text-white" />
                </Button>
              )}

              {onCheckStatus && (row.status === 'PROCESSING' || row.status === 'QUEUED') && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onCheckStatus(row)}
                  title="Check Gateway Status"
                  aria-label="Check Gateway Status"
                  className="px-2 text-blue-600"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
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
