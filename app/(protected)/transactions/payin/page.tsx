'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { PageContainer } from '@/components/layout/PageContainer';
import { Button } from '@/components/ui/Button';
import { useModal } from '@/hooks/useModal';
import { transactionService, TransactionListResult } from '@/services/transactionService';
import { Transaction, TransactionFilters, PaginationState } from '@/types/domain';
import { TransactionSummaryCards } from '@/components/features/transactions/TransactionSummaryCards';
import { TransactionFilterBar } from '@/components/features/transactions/TransactionFilterBar';
import { TransactionTable } from '@/components/features/transactions/TransactionTable';
import { TransactionDetailsDrawer } from '@/components/features/transactions/TransactionDetailsDrawer';
import { CreatePayInModal } from '@/components/features/transactions/CreatePayInModal';
import { ArrowDownLeft } from 'lucide-react';

export default function PayInTransactionsPage() {
  const [data, setData] = useState<TransactionListResult | null>(null);
  const [filters, setFilters] = useState<TransactionFilters>({ type: 'PAY_IN' });
  const [pagination, setPagination] = useState<PaginationState>({
    page: 1,
    pageSize: 10,
    totalItems: 0,
    totalPages: 1,
  });

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const detailDrawer = useModal<Transaction>();
  const [isPayInModalOpen, setIsPayInModalOpen] = useState(false);

  const fetchTransactions = useCallback(
    async (activeFilters?: TransactionFilters, page = 1, pageSize = 10) => {
      setIsLoading(true);
      try {
        const res = await transactionService.getPayinTransactions(activeFilters, page, pageSize);
        if (res.success && res.data) {
          setData(res.data);
          setPagination(res.data.pagination);
        }
      } catch {
        // Fallback
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    let isCancelled = false;
    transactionService.getPayinTransactions(filters, pagination.page, pagination.pageSize).then((res) => {
      if (!isCancelled && res.success && res.data) {
        setData(res.data);
        setPagination(res.data.pagination);
        setIsLoading(false);
      }
    });
    return () => {
      isCancelled = true;
    };
  }, [filters, pagination.page, pagination.pageSize]);

  const handleApplyFilters = (newFilters: TransactionFilters) => {
    setIsLoading(true);
    setFilters({ ...newFilters, type: 'PAY_IN' });
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handleResetFilters = () => {
    setIsLoading(true);
    setFilters({ type: 'PAY_IN' });
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  // Compute summary metrics for Pay-In
  const items = data?.items || [];
  const totalAmount = items.reduce((acc, t) => acc + t.amount, 0);
  const successfulCount = items.filter((t) => t.status === 'SUCCESS').length;
  const failedCount = items.filter((t) => t.status === 'FAILED').length;
  const pendingCount = items.filter((t) => t.status === 'PENDING' || t.status === 'PROCESSING').length;
  const successRate = items.length > 0 ? (successfulCount / items.length) * 100 : 0;

  return (
    <PageContainer
      title="Pay-In Transactions"
      description="Monitor incoming payments, UPI collections and gateway traffic."
      actions={
        <Button
          variant="primary"
          size="sm"
          onClick={() => setIsPayInModalOpen(true)}
          leftIcon={<ArrowDownLeft className="w-4 h-4" />}
        >
          Create Payment Request
        </Button>
      }
      className="space-y-6"
    >
      {/* 1. Pay-In Metrics */}
      <TransactionSummaryCards
        metrics={{
          totalAmount,
          successfulCount,
          failedCount,
          pendingCount,
          successRate,
          totalCount: pagination.totalItems,
        }}
        isLoading={isLoading}
      />

      {/* 2. Filter Bar */}
      <TransactionFilterBar
        onApplyFilters={handleApplyFilters}
        onResetFilters={handleResetFilters}
        isLoading={isLoading}
        hideTypeFilter
      />

      {/* 3. Transaction Data Table */}
      <TransactionTable
        transactions={items}
        pagination={pagination}
        onPageChange={(page) => {
          setIsLoading(true);
          setPagination((prev) => ({ ...prev, page }));
        }}
        onPageSizeChange={(pageSize) => {
          setIsLoading(true);
          setPagination((prev) => ({ ...prev, page: 1, pageSize }));
        }}
        onViewDetails={(tx) => detailDrawer.open(tx)}
        isLoading={isLoading}
      />

      {/* Unified 880px Details Drawer */}
      <TransactionDetailsDrawer
        isOpen={detailDrawer.isOpen}
        onClose={detailDrawer.close}
        transaction={detailDrawer.data}
        onRefresh={() => fetchTransactions(filters, pagination.page, pagination.pageSize)}
      />

      {/* Create Pay-In Request Modal */}
      <CreatePayInModal
        isOpen={isPayInModalOpen}
        onClose={() => setIsPayInModalOpen(false)}
        onSuccess={() => fetchTransactions(filters, 1, pagination.pageSize)}
      />
    </PageContainer>
  );
}
