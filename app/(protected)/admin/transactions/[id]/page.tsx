'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { PageContainer } from '@/components/layout/PageContainer';
import { transactionService } from '@/services/transactionService';
import { Transaction } from '@/types/domain';
import { TransactionDetailsView } from '@/components/features/transactions/TransactionDetailsView';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';
import { ErrorState } from '@/components/ui/ErrorState';

export default function TransactionDetailPage() {
  const params = useParams();
  const id = (params?.id as string) || '';

  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDetail = useCallback(async () => {
    if (!id) return;
    setIsLoading(true);
    setError(null);
    try {
      const res = await transactionService.getTransactionById(id);
      if (res.success && res.data) {
        setTransaction(res.data);
      } else {
        setError(`Transaction "${id}" not found.`);
      }
    } catch {
      setError('An error occurred while loading transaction details.');
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    let isCancelled = false;
    if (id) {
      transactionService.getTransactionById(id).then((res) => {
        if (!isCancelled) {
          if (res.success && res.data) {
            setTransaction(res.data);
            setError(null);
          } else {
            setError(`Transaction "${id}" not found.`);
          }
          setIsLoading(false);
        }
      });
    }
    return () => {
      isCancelled = true;
    };
  }, [id]);

  return (
    <PageContainer
      title={transaction ? `Transaction ${transaction.transactionRef}` : 'Transaction Details'}
      description="Operational audit details, provider lifecycle events & webhook callback logs."
      className="space-y-6"
    >
      {isLoading ? (
        <LoadingSkeleton variant="card" count={3} />
      ) : error || !transaction ? (
        <ErrorState
          title="Transaction Not Found"
          description={error || 'Unable to locate transaction record.'}
          onRetry={fetchDetail}
        />
      ) : (
        <TransactionDetailsView transaction={transaction} onRefresh={fetchDetail} />
      )}
    </PageContainer>
  );
}
