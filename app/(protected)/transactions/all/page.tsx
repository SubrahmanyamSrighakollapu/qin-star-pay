'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { PageContainer } from '@/components/layout/PageContainer';
import { Button } from '@/components/ui/Button';
import { Drawer } from '@/components/ui/Drawer';
import { useModal } from '@/hooks/useModal';
import { transactionService, TransactionListResult } from '@/services/transactionService';
import { Transaction, TransactionFilters, PaginationState } from '@/types/domain';
import { TransactionSummaryCards } from '@/components/features/transactions/TransactionSummaryCards';
import { TransactionFilterBar } from '@/components/features/transactions/TransactionFilterBar';
import { TransactionTable } from '@/components/features/transactions/TransactionTable';
import { TransactionDetailsDrawer } from '@/components/features/transactions/TransactionDetailsDrawer';
import { CreatePayInModal } from '@/components/features/transactions/CreatePayInModal';
import { CreatePayoutForm } from '@/components/features/transactions/CreatePayoutForm';
import { Send, ArrowDownLeft } from 'lucide-react';

export default function AllTransactionsPage() {
  const [data, setData] = useState<TransactionListResult | null>(null);
  const [filters, setFilters] = useState<TransactionFilters>({});
  const [pagination, setPagination] = useState<PaginationState>({
    page: 1,
    pageSize: 10,
    totalItems: 0,
    totalPages: 1,
  });

  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Modals & Drawers
  const detailDrawer = useModal<Transaction>();
  const [isPayInModalOpen, setIsPayInModalOpen] = useState(false);
  const [isPayoutModalOpen, setIsPayoutModalOpen] = useState(false);

  const fetchTransactions = useCallback(
    async (activeFilters?: TransactionFilters, page = 1, pageSize = 10) => {
      setIsLoading(true);
      try {
        const res = await transactionService.getTransactions(activeFilters, page, pageSize);
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
    transactionService.getTransactions(filters, pagination.page, pagination.pageSize).then((res) => {
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
    setFilters(newFilters);
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handleResetFilters = () => {
    setIsLoading(true);
    setFilters({});
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handlePageChange = (newPage: number) => {
    setIsLoading(true);
    setPagination((prev) => ({ ...prev, page: newPage }));
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setIsLoading(true);
    setPagination((prev) => ({ ...prev, page: 1, pageSize: newPageSize }));
  };

  // Compute page summary metrics
  const items = data?.items || [];
  const totalAmount = items.reduce((acc, t) => acc + t.amount, 0);
  const successfulCount = items.filter((t) => t.status === 'SUCCESS').length;
  const failedCount = items.filter((t) => t.status === 'FAILED').length;
  const pendingCount = items.filter((t) => t.status === 'PENDING' || t.status === 'PROCESSING').length;
  const successRate = items.length > 0 ? (successfulCount / items.length) * 100 : 0;

  return (
    <PageContainer
      title="All Transactions"
      description="Monitor and manage Pay-In collections and Pay-Out disbursements."
      actions={
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsPayInModalOpen(true)}
            leftIcon={<ArrowDownLeft className="w-4 h-4 text-emerald-600" />}
          >
            Create Pay-In
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsPayoutModalOpen(true)}
            leftIcon={<Send className="w-4 h-4" />}
          >
            Create Payout
          </Button>
        </div>
      }
      className="space-y-6"
    >
      {/* 1. Page Summary Metrics */}
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

      {/* 2. Unified Filter Bar */}
      <TransactionFilterBar
        onApplyFilters={handleApplyFilters}
        onResetFilters={handleResetFilters}
        isLoading={isLoading}
      />

      {/* 3. Transaction Data Table */}
      <TransactionTable
        transactions={items}
        pagination={pagination}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        onViewDetails={(tx) => detailDrawer.open(tx)}
        isLoading={isLoading}
      />

      {/* Unified 880px Transaction Details Drawer */}
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

      {/* Create Payout Wizard Drawer */}
      <Drawer
        isOpen={isPayoutModalOpen}
        onClose={() => setIsPayoutModalOpen(false)}
        title="Create Payout Request"
        description="Initiate merchant disbursement"
        size="lg"
      >
        <CreatePayoutForm />
      </Drawer>
    </PageContainer>
  );
}
