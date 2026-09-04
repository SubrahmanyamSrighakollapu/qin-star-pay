'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { AccessDeniedView } from '@/components/features/auth/AccessDeniedView';
import { Transaction, Distributor, Retailer, TransactionFilters } from '@/types/domain';
import { transactionService } from '@/services/transactionService';
import { hierarchyService } from '@/services/hierarchyService';
import { reportService } from '@/services/reportService';
import {
  MasterDistributorTransactionFilterBar,
} from '@/components/features/master-distributor';
import { TransactionSummaryCards } from '@/components/features/transactions/TransactionSummaryCards';
import { TransactionTable } from '@/components/features/transactions/TransactionTable';
import { TransactionDetailsDrawer } from '@/components/features/transactions/TransactionDetailsDrawer';
import { PageHeader, Button, useToast } from '@/components/ui';
import { Download } from 'lucide-react';

function MasterDistributorTransactionsContent() {
  const { session, isAuthenticated } = useAuth();
  const searchParams = useSearchParams();
  const { toastSuccess, toastError } = useToast();

  const isAuthorized =
    isAuthenticated &&
    session &&
    (session.role === 'MASTER_DISTRIBUTOR' || session.role === 'ADMIN' || session.role === 'SUPER_ADMIN');

  const masterDistributorId = session?.entityId || 'md_001';

  // Read URL query parameters
  const initialType = searchParams.get('type') || 'ALL';
  const initialDst = searchParams.get('distributorId') || 'ALL';
  const initialRet = searchParams.get('retailerId') || 'ALL';

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState(initialType);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [distributorFilter, setDistributorFilter] = useState(initialDst);
  const [retailerFilter, setRetailerFilter] = useState(initialRet);
  const [paymentModeFilter, setPaymentModeFilter] = useState('ALL');

  // Data & Pagination
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [distributors, setDistributors] = useState<Distributor[]>([]);
  const [retailers, setRetailers] = useState<Retailer[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Selected Transaction for Drawer
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Sync URL query parameters if changed
  useEffect(() => {
    if (searchParams.get('type')) setTypeFilter(searchParams.get('type')!);
    if (searchParams.get('distributorId')) setDistributorFilter(searchParams.get('distributorId')!);
    if (searchParams.get('retailerId')) setRetailerFilter(searchParams.get('retailerId')!);
  }, [searchParams]);

  // Load Scoped Metadata & Transactions
  const loadData = async () => {
    setIsLoading(true);
    try {
      const dstList = hierarchyService.getMasterDistributorDistributors(masterDistributorId);
      setDistributors(dstList);

      const retList = hierarchyService.getMasterDistributorRetailers(masterDistributorId);
      setRetailers(retList);

      const filters: TransactionFilters = {
        type: typeFilter !== 'ALL' ? (typeFilter as any) : undefined,
        status: statusFilter !== 'ALL' ? statusFilter : undefined,
        distributorId: distributorFilter !== 'ALL' ? distributorFilter : undefined,
        retailerId: retailerFilter !== 'ALL' ? retailerFilter : undefined,
        searchQuery: searchQuery || undefined,
      };

      const res = await transactionService.getTransactionsForMasterDistributor(
        masterDistributorId,
        filters,
        1,
        100
      );

      if (res.success && res.data) {
        setTransactions(res.data.items);
      }
    } catch (err) {
      console.error('Failed to load scoped transactions:', err);
      toastError('Failed to load network transactions');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthorized) {
      loadData();
    }
  }, [
    isAuthorized,
    masterDistributorId,
    typeFilter,
    statusFilter,
    distributorFilter,
    retailerFilter,
    searchQuery,
  ]);

  // Filtered dataset for payment mode and client-side refinements
  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      if (paymentModeFilter !== 'ALL' && t.paymentMode !== paymentModeFilter) {
        return false;
      }
      return true;
    });
  }, [transactions, paymentModeFilter]);

  // Paginated dataset
  const paginatedTransactions = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredTransactions.slice(start, start + pageSize);
  }, [filteredTransactions, currentPage, pageSize]);

  // Reset pagination on filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [
    searchQuery,
    typeFilter,
    statusFilter,
    distributorFilter,
    retailerFilter,
    paymentModeFilter,
  ]);

  if (!isAuthorized) {
    return (
      <AccessDeniedView message="You do not have authorization to view network transactions for this Master Distributor account." />
    );
  }

  const handleResetFilters = () => {
    setSearchQuery('');
    setTypeFilter('ALL');
    setStatusFilter('ALL');
    setDistributorFilter('ALL');
    setRetailerFilter('ALL');
    setPaymentModeFilter('ALL');
  };

  const handleExportCsv = () => {
    if (filteredTransactions.length === 0) {
      toastError('No transactions available to export');
      return;
    }
    const exportRows = filteredTransactions.map((t) => ({
      'Transaction ID': t.transactionRef,
      Type: t.type,
      Status: t.status,
      Amount: t.amount,
      Fee: t.fee,
      GST: t.gst || 0,
      'Net Amount': t.netAmount,
      'Retailer Name': t.retailerName || t.merchantName,
      'Distributor Name': t.distributorName || 'Direct',
      'Payment Mode': t.paymentMode,
      UTR: t.utr || '',
      'Date & Time': t.createdAt,
    }));
    reportService.exportToCsv('MD_Transactions_Report', exportRows);
    toastSuccess('Transactions CSV exported successfully!');
  };

  const isFiltered =
    searchQuery ||
    typeFilter !== 'ALL' ||
    statusFilter !== 'ALL' ||
    distributorFilter !== 'ALL' ||
    retailerFilter !== 'ALL' ||
    paymentModeFilter !== 'ALL';

  // Compute summary metrics for KPI cards
  const summaryMetrics = useMemo(() => {
    const totalCount = filteredTransactions.length;
    const totalAmount = filteredTransactions.reduce((acc, t) => acc + t.amount, 0);
    const successfulCount = filteredTransactions.filter((t) => t.status === 'SUCCESS').length;
    const failedCount = filteredTransactions.filter((t) => t.status === 'FAILED').length;
    const pendingCount = filteredTransactions.filter((t) => t.status === 'PENDING' || t.status === 'PROCESSING').length;
    const successRate = totalCount > 0 ? Math.round((successfulCount / totalCount) * 1000) / 10 : 100;
    return {
      totalAmount,
      successfulCount,
      failedCount,
      pendingCount,
      successRate,
      totalCount,
    };
  }, [filteredTransactions]);

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <PageHeader
        title="Network Transactions"
        description="Monitor, search, and audit all Pay-In and Pay-Out transactions generated by outlets within your network"
        actions={
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportCsv}
            leftIcon={<Download className="w-4 h-4 text-indigo-600" />}
          >
            Export CSV
          </Button>
        }
      />

      {/* KPI Summary Cards */}
      <TransactionSummaryCards metrics={summaryMetrics} isLoading={isLoading} />


      {/* Filter Bar */}
      <MasterDistributorTransactionFilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        typeFilter={typeFilter}
        onTypeChange={setTypeFilter}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        distributorFilter={distributorFilter}
        onDistributorChange={setDistributorFilter}
        retailerFilter={retailerFilter}
        onRetailerChange={setRetailerFilter}
        paymentModeFilter={paymentModeFilter}
        onPaymentModeChange={setPaymentModeFilter}
        distributors={distributors}
        retailers={retailers}
        onReset={handleResetFilters}
        isFiltered={!!isFiltered}
        onRefresh={loadData}
        isLoading={isLoading}
      />

      {/* Main Transactions Table */}
      <div className="space-y-4">
        <TransactionTable
          transactions={paginatedTransactions}
          pagination={{
            page: currentPage,
            pageSize,
            totalItems: filteredTransactions.length,
            totalPages: Math.ceil(filteredTransactions.length / pageSize) || 1,
          }}
          onPageChange={setCurrentPage}
          onViewDetails={(tx) => {
            setSelectedTx(tx);
            setDrawerOpen(true);
          }}
          isLoading={isLoading}
        />
      </div>

      {/* Transaction Details Drawer */}
      <TransactionDetailsDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        transaction={selectedTx}
        onRefresh={loadData}
      />
    </div>
  );
}

export default function MasterDistributorTransactionsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-500">Loading transactions...</div>}>
      <MasterDistributorTransactionsContent />
    </Suspense>
  );
}
