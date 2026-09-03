'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { PageContainer } from '@/components/layout/PageContainer';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { useModal } from '@/hooks/useModal';
import { walletService, DebitRequestListResult } from '@/services/walletService';
import { PaginationState } from '@/types/domain';
import { DebitRequestsTable } from '@/components/features/wallet/DebitRequestsTable';
import { CreateDebitRequestModal } from '@/components/features/wallet/CreateDebitRequestModal';
import { PlusCircle } from 'lucide-react';

export default function DebitRequestsPage() {
  const [data, setData] = useState<DebitRequestListResult | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [pagination, setPagination] = useState<PaginationState>({
    page: 1,
    pageSize: 10,
    totalItems: 0,
    totalPages: 1,
  });

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const createModal = useModal();

  const fetchDebitRequests = useCallback(
    async (status = 'ALL', page = 1, pageSize = 10) => {
      setIsLoading(true);
      try {
        const res = await walletService.getDebitRequests(status, page, pageSize);
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
    walletService
      .getDebitRequests(statusFilter, pagination.page, pagination.pageSize)
      .then((res) => {
        if (!isCancelled && res.success && res.data) {
          setData(res.data);
          setPagination(res.data.pagination);
          setIsLoading(false);
        }
      });
    return () => {
      isCancelled = true;
    };
  }, [statusFilter, pagination.page, pagination.pageSize]);

  const handleReviewRequest = async (
    requestId: string,
    action: 'APPROVE' | 'REJECT' | 'PROCESS',
    remarks?: string
  ) => {
    await walletService.reviewDebitRequest(requestId, action, remarks);
    fetchDebitRequests(statusFilter, pagination.page, pagination.pageSize);
  };

  const requests = data?.items || [];

  return (
    <PageContainer
      title="Debit Requests Queue"
      description="Review, approve, and process wallet debit requests submitted by operational teams."
      actions={
        <Button
          variant="primary"
          size="sm"
          onClick={() => createModal.open()}
          leftIcon={<PlusCircle className="w-4 h-4" />}
        >
          Create Debit Request
        </Button>
      }
      className="space-y-6"
    >
      {/* Filter Bar */}
      <div className="p-4 bg-white border border-[var(--border)] rounded-[var(--radius-xl)] flex items-center justify-between gap-4">
        <Select
          label="Filter by Request Status"
          value={statusFilter}
          onChange={(e) => {
            setIsLoading(true);
            setStatusFilter(e.target.value);
            setPagination((prev) => ({ ...prev, page: 1 }));
          }}
          options={[
            { value: 'ALL', label: 'All Statuses' },
            { value: 'PENDING', label: 'Pending' },
            { value: 'APPROVED', label: 'Approved' },
            { value: 'PROCESSED', label: 'Processed' },
            { value: 'REJECTED', label: 'Rejected' },
          ]}
          className="max-w-xs"
        />

        <div className="text-xs text-slate-500 font-medium">
          Showing {requests.length} request{requests.length === 1 ? '' : 's'}
        </div>
      </div>

      {/* Requests Data Table */}
      <DebitRequestsTable
        requests={requests}
        pagination={pagination}
        onPageChange={(page) => {
          setIsLoading(true);
          setPagination((prev) => ({ ...prev, page }));
        }}
        onPageSizeChange={(pageSize) => {
          setIsLoading(true);
          setPagination((prev) => ({ ...prev, page: 1, pageSize }));
        }}
        onReviewRequest={handleReviewRequest}
        isLoading={isLoading}
      />

      {/* Create Debit Request Modal */}
      <CreateDebitRequestModal
        isOpen={createModal.isOpen}
        onClose={createModal.close}
        onSuccess={() => fetchDebitRequests(statusFilter, pagination.page, pagination.pageSize)}
      />
    </PageContainer>
  );
}
