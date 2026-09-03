'use client';

import React from 'react';
import { Table } from '@/components/ui/Table';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Button } from '@/components/ui/Button';
import { Invoice } from '@/types/domain';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { Eye, Download } from 'lucide-react';

export interface InvoiceTableProps {
  data: Invoice[];
  isLoading?: boolean;
  onViewInvoice: (invoice: Invoice) => void;
  onDownloadInvoice: (invoice: Invoice) => void;
}

export const InvoiceTable: React.FC<InvoiceTableProps> = ({
  data,
  isLoading = false,
  onViewInvoice,
  onDownloadInvoice,
}) => {
  const columns = [
    {
      key: 'id',
      header: 'Invoice ID / Period',
      render: (row: Invoice) => (
        <div>
          <span className="font-mono font-bold text-[var(--primary)] text-xs block">{row.id}</span>
          <span className="text-[11px] text-slate-500">{row.billingPeriod}</span>
        </div>
      ),
    },
    {
      key: 'entityName',
      header: 'Entity',
      render: (row: Invoice) => (
        <div>
          <div className="font-semibold text-xs text-slate-900">{row.entityName}</div>
          <div className="text-[11px] font-semibold text-purple-700">{row.entityType} • {row.entityCode}</div>
        </div>
      ),
    },
    {
      key: 'invoiceType',
      header: 'Invoice Type',
      align: 'center' as const,
      render: (row: Invoice) => (
        <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-slate-100 text-slate-800 border border-slate-200">
          {row.invoiceType}
        </span>
      ),
    },
    {
      key: 'taxableAmount',
      header: 'Taxable Value',
      align: 'right' as const,
      render: (row: Invoice) => (
        <span className="font-mono text-xs text-slate-700">{formatCurrency(row.taxableAmount)}</span>
      ),
    },
    {
      key: 'gstAmount',
      header: 'GST (@18%)',
      align: 'right' as const,
      render: (row: Invoice) => (
        <span className="font-mono text-xs text-purple-700 font-semibold">{formatCurrency(row.gstAmount)}</span>
      ),
    },
    {
      key: 'tdsAmount',
      header: 'TDS',
      align: 'right' as const,
      render: (row: Invoice) => (
        <span className="font-mono text-xs text-amber-700">{formatCurrency(row.tdsAmount)}</span>
      ),
    },
    {
      key: 'netReceivable',
      header: 'Total Receivable',
      align: 'right' as const,
      render: (row: Invoice) => (
        <div>
          <span className="font-mono font-extrabold text-xs text-slate-900 block">{formatCurrency(row.netReceivable)}</span>
          {row.outstandingAmount > 0 && row.status !== 'PAID' && (
            <span className="text-[10px] font-mono text-rose-600 font-bold block">
              Due: {formatCurrency(row.outstandingAmount)}
            </span>
          )}
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      align: 'center' as const,
      render: (row: Invoice) => <StatusBadge status={row.status} size="sm" />,
    },
    {
      key: 'dueDate',
      header: 'Issued / Due Date',
      render: (row: Invoice) => (
        <div>
          <div className="text-xs text-slate-800 font-mono">{formatDate(row.issueDate)}</div>
          <div className="text-[11px] font-mono text-rose-600">Due: {formatDate(row.dueDate)}</div>
        </div>
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
        renderActions={(row) => (
          <div className="flex items-center gap-1">
            <Button variant="outline" size="sm" onClick={() => onViewInvoice(row)} leftIcon={<Eye className="w-3.5 h-3.5" />}>
              View
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="px-2"
              onClick={() => onDownloadInvoice(row)}
              title="Download Printable Invoice"
              aria-label="Download Printable Invoice"
            >
              <Download className="w-3.5 h-3.5 text-slate-600" />
            </Button>
          </div>
        )}
      />
    </div>
  );
};
