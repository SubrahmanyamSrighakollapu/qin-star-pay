'use client';

import React from 'react';
import Link from 'next/link';
import { Table } from '@/components/ui/Table';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Button } from '@/components/ui/Button';
import { Pagination } from '@/components/ui/Pagination';
import { ColumnDefinition } from '@/types/common';
import { WalletAccount, PaginationState } from '@/types/domain';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { Eye, BookOpen, ArrowLeftRight, Lock, Unlock } from 'lucide-react';

export interface WalletTableProps {
  wallets: WalletAccount[];
  pagination: PaginationState;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  onViewWallet: (wallet: WalletAccount) => void;
  onCreditDebit?: (wallet: WalletAccount) => void;
  onToggleFreeze?: (wallet: WalletAccount) => void;
  isLoading?: boolean;
}

export const WalletTable: React.FC<WalletTableProps> = ({
  wallets,
  pagination,
  onPageChange,
  onPageSizeChange,
  onViewWallet,
  onCreditDebit,
  onToggleFreeze,
  isLoading = false,
}) => {
  const columns: ColumnDefinition<WalletAccount>[] = [
    {
      key: 'walletId',
      header: 'Wallet ID / Code',
      render: (row) => (
        <div>
          <span className="font-mono font-bold text-[var(--primary)] text-xs block">{row.walletId}</span>
          <span className="font-mono text-[11px] text-slate-500">{row.entityCode}</span>
        </div>
      ),
    },
    {
      key: 'entityName',
      header: 'Entity Name',
      render: (row) => (
        <div>
          <div className="font-semibold text-xs text-[var(--text-primary)]">{row.entityName}</div>
          <div className="text-[11px] font-semibold text-purple-700">{row.entityType}</div>
        </div>
      ),
    },
    {
      key: 'parentName',
      header: 'Mapped Parent',
      render: (row) => (
        <span className="text-xs text-slate-700 font-medium">
          {row.parentName || (row.entityType === 'MASTER' ? 'Treasury' : 'Direct')}
        </span>
      ),
    },
    {
      key: 'availableBalance',
      header: 'Available Balance',
      align: 'right',
      render: (row) => (
        <span className="font-mono font-extrabold text-xs text-[var(--primary)]">
          {formatCurrency(row.availableBalance)}
        </span>
      ),
    },
    {
      key: 'ledgerBalance',
      header: 'Ledger Balance',
      align: 'right',
      render: (row) => (
        <span className="font-mono font-semibold text-xs text-slate-800">
          {formatCurrency(row.ledgerBalance)}
        </span>
      ),
    },
    {
      key: 'holdBalance',
      header: 'Hold Balance',
      align: 'right',
      render: (row) => (
        <span className={`font-mono text-xs ${row.holdBalance > 0 ? 'text-rose-600 font-bold' : 'text-slate-500'}`}>
          {formatCurrency(row.holdBalance)}
        </span>
      ),
    },
    {
      key: 'pendingSettlement',
      header: 'Pending Settlement',
      align: 'right',
      render: (row) => (
        <span className="font-mono text-xs text-amber-700 font-medium">
          {formatCurrency(row.pendingSettlement)}
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
      key: 'updatedAt',
      header: 'Last Updated',
      render: (row) => (
        <span className="text-xs text-[var(--text-secondary)] whitespace-nowrap">
          {formatDate(row.updatedAt)}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto border border-[var(--border)] rounded-[var(--radius-xl)] bg-white shadow-xs">
        <Table
          columns={columns}
          data={wallets}
          keyExtractor={(row) => row.walletId}
          isLoading={isLoading}
          renderActions={(row) => (
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onViewWallet(row)}
                leftIcon={<Eye className="w-3.5 h-3.5" />}
                title="View Wallet Details"
                aria-label="View Wallet Details"
              >
                View Wallet
              </Button>

              <Link href={`/admin/wallet/ledger?searchQuery=${row.walletId}`}>
                <Button
                  variant="outline"
                  size="sm"
                  title="View Ledger"
                  aria-label="View Ledger"
                  className="px-2"
                >
                  <BookOpen className="w-3.5 h-3.5 text-slate-600" />
                </Button>
              </Link>

              {onCreditDebit && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onCreditDebit(row)}
                  title="Credit / Debit"
                  aria-label="Credit / Debit"
                  className="px-2"
                  disabled={row.status === 'FROZEN'}
                >
                  <ArrowLeftRight className="w-3.5 h-3.5 text-[var(--primary)]" />
                </Button>
              )}

              {onToggleFreeze && (
                <Button
                  variant={row.status === 'FROZEN' ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => onToggleFreeze(row)}
                  title={row.status === 'FROZEN' ? 'Unfreeze Wallet' : 'Freeze / Wallet Controls'}
                  aria-label={row.status === 'FROZEN' ? 'Unfreeze Wallet' : 'Freeze / Wallet Controls'}
                  className="px-2"
                >
                  {row.status === 'FROZEN' ? (
                    <Unlock className="w-3.5 h-3.5 text-emerald-500" />
                  ) : (
                    <Lock className="w-3.5 h-3.5 text-rose-600" />
                  )}
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
