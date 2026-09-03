'use client';

import React from 'react';
import Link from 'next/link';
import { Eye, ArrowRight } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Table } from '@/components/ui/Table';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Button } from '@/components/ui/Button';
import { Drawer } from '@/components/ui/Drawer';
import { MaskedValue } from '@/components/ui/MaskedValue';
import { ColumnDefinition } from '@/types/common';
import { Transaction } from '@/types/domain';
import { formatCurrency, formatDateTime } from '@/utils/formatters';
import { mockTransactions } from '@/mocks/mockTransactions';
import { useModal } from '@/hooks/useModal';

export interface RecentTransactionsTableProps {
  isLoading?: boolean;
}

export const RecentTransactionsTable: React.FC<RecentTransactionsTableProps> = ({
  isLoading = false,
}) => {
  const detailDrawer = useModal<Transaction>();

  const columns: ColumnDefinition<Transaction>[] = [
    {
      key: 'transactionRef',
      header: 'Transaction ID',
      render: (row) => (
        <span className="font-mono font-bold text-[var(--primary)] text-xs">
          {row.transactionRef}
        </span>
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
          <div className="text-[11px] text-[var(--text-muted)]">{row.distributorName || 'Direct'}</div>
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
    <>
      <Card
        title="Recent Transactions"
        subtitle="Latest live operations across Pay-In & Pay-Out switches"
        noPadding
        action={
          <Link href="/transactions/all">
            <Button variant="ghost" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
              View All
            </Button>
          </Link>
        }
      >
        <div className="overflow-x-auto">
          <Table
            columns={columns}
            data={mockTransactions}
            keyExtractor={(row) => row.id}
            isLoading={isLoading}
            renderActions={(row) => (
              <Button
                variant="outline"
                size="sm"
                onClick={() => detailDrawer.open(row)}
                leftIcon={<Eye className="w-3.5 h-3.5" />}
              >
                View
              </Button>
            )}
          />
        </div>
      </Card>

      {/* Transaction Quick Detail Drawer (Placeholder Preview) */}
      <Drawer
        isOpen={detailDrawer.isOpen}
        onClose={detailDrawer.close}
        title="Transaction Detail Preview"
        description="Operational audit details and raw logs"
        footer={
          <div className="flex items-center justify-between w-full">
            <Link href="/transactions/all">
              <Button variant="outline" size="sm" onClick={detailDrawer.close}>
                Open in Transactions Module
              </Button>
            </Link>
            <Button variant="primary" size="sm" onClick={detailDrawer.close}>
              Close
            </Button>
          </div>
        }
      >
        {detailDrawer.data && (
          <div className="space-y-4 text-xs">
            <div className="p-3.5 bg-[var(--bg-secondary)] rounded-lg border border-[var(--border)] space-y-1">
              <span className="text-[var(--text-muted)]">Reference Number:</span>
              <div className="font-mono font-bold text-sm text-[var(--primary)]">
                {detailDrawer.data.transactionRef}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between py-1.5 border-b border-[var(--border-subtle)]">
                <span className="text-[var(--text-muted)]">Transaction Type:</span>
                <span className="font-bold">{detailDrawer.data.type}</span>
              </div>

              <div className="flex justify-between py-1.5 border-b border-[var(--border-subtle)]">
                <span className="text-[var(--text-muted)]">Merchant Name:</span>
                <span className="font-semibold">{detailDrawer.data.merchantName}</span>
              </div>

              <div className="flex justify-between py-1.5 border-b border-[var(--border-subtle)]">
                <span className="text-[var(--text-muted)]">Provider Gateway:</span>
                <span className="font-semibold">{detailDrawer.data.provider || 'Provider A'}</span>
              </div>

              <div className="flex justify-between py-1.5 border-b border-[var(--border-subtle)]">
                <span className="text-[var(--text-muted)]">Amount:</span>
                <span className="font-bold text-[var(--primary)]">
                  {formatCurrency(detailDrawer.data.amount)}
                </span>
              </div>

              <div className="flex justify-between py-1.5 border-b border-[var(--border-subtle)]">
                <span className="text-[var(--text-muted)]">Platform Fee:</span>
                <span>{formatCurrency(detailDrawer.data.fee)}</span>
              </div>

              <div className="flex justify-between py-1.5 border-b border-[var(--border-subtle)]">
                <span className="text-[var(--text-muted)]">Net Settlement:</span>
                <span className="font-semibold">{formatCurrency(detailDrawer.data.netAmount)}</span>
              </div>

              <div className="flex justify-between py-1.5 border-b border-[var(--border-subtle)]">
                <span className="text-[var(--text-muted)]">Status:</span>
                <StatusBadge status={detailDrawer.data.status} size="sm" />
              </div>

              <div className="flex justify-between py-1.5 border-b border-[var(--border-subtle)]">
                <span className="text-[var(--text-muted)]">Payment Mode:</span>
                <span className="font-semibold">{detailDrawer.data.paymentMode}</span>
              </div>

              <div className="flex justify-between py-1.5 border-b border-[var(--border-subtle)]">
                <span className="text-[var(--text-muted)]">Masked Account:</span>
                <MaskedValue value={detailDrawer.data.accountNumberMasked || '123456784582'} type="bankAccount" />
              </div>

              <div className="flex justify-between py-1.5">
                <span className="text-[var(--text-muted)]">Created At:</span>
                <span>{formatDateTime(detailDrawer.data.createdAt)}</span>
              </div>
            </div>
          </div>
        )}
      </Drawer>
    </>
  );
};
