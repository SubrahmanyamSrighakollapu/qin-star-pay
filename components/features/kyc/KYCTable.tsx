'use client';

import React from 'react';
import { Table } from '@/components/ui/Table';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Button } from '@/components/ui/Button';
import { Pagination } from '@/components/ui/Pagination';
import { ColumnDefinition } from '@/types/common';
import { KYCApplication, PaginationState } from '@/types/domain';
import { formatDate } from '@/utils/formatters';
import { ShieldCheck, Eye } from 'lucide-react';

export interface KYCTableProps {
  applications: KYCApplication[];
  pagination: PaginationState;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  onReview: (app: KYCApplication) => void;
  isLoading?: boolean;
}

export const KYCTable: React.FC<KYCTableProps> = ({
  applications,
  pagination,
  onPageChange,
  onPageSizeChange,
  onReview,
  isLoading = false,
}) => {
  const columns: ColumnDefinition<KYCApplication>[] = [
    {
      key: 'id',
      header: 'Application ID',
      render: (row) => (
        <span className="font-mono font-bold text-[var(--primary)] text-xs">{row.id}</span>
      ),
    },
    {
      key: 'entityName',
      header: 'Entity / Business',
      render: (row) => (
        <div>
          <div className="font-semibold text-xs text-[var(--text-primary)]">{row.entityName}</div>
          <div className="text-[11px] text-[var(--text-muted)]">{row.businessType}</div>
        </div>
      ),
    },
    {
      key: 'entityType',
      header: 'Type',
      align: 'center',
      render: (row) => (
        <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-slate-100 text-slate-800 border border-slate-200">
          {row.entityType}
        </span>
      ),
    },
    {
      key: 'panNumberMasked',
      header: 'PAN Number',
      render: (row) => (
        <span className="font-mono text-xs text-slate-800">{row.panNumberMasked}</span>
      ),
    },
    {
      key: 'assignedTo',
      header: 'Assigned To',
      render: (row) => (
        <span className="text-xs text-slate-700">{row.assignedTo || 'Unassigned'}</span>
      ),
    },
    {
      key: 'status',
      header: 'KYC Status',
      align: 'center',
      render: (row) => <StatusBadge status={row.status} size="sm" />,
    },
    {
      key: 'submittedAt',
      header: 'Submitted Date',
      render: (row) => (
        <span className="text-xs text-[var(--text-secondary)] whitespace-nowrap">
          {formatDate(row.submittedAt)}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto border border-[var(--border)] rounded-[var(--radius-xl)] bg-white shadow-xs">
        <Table
          columns={columns}
          data={applications}
          keyExtractor={(row) => row.id}
          isLoading={isLoading}
          renderActions={(row) => (
            <Button
              variant={row.status === 'APPROVED' ? 'outline' : 'primary'}
              size="sm"
              onClick={() => onReview(row)}
              leftIcon={row.status === 'APPROVED' ? <Eye className="w-3.5 h-3.5" /> : <ShieldCheck className="w-3.5 h-3.5" />}
            >
              {row.status === 'APPROVED' ? 'View' : 'Review'}
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
