'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { PageContainer } from '@/components/layout/PageContainer';
import { Card } from '@/components/ui/Card';
import { Table } from '@/components/ui/Table';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Pagination } from '@/components/ui/Pagination';
import { reportService, ReportListResult } from '@/services/reportService';
import { Transaction, TransactionReportSummary, ReportFilters, ReportDateRange, PaginationState } from '@/types/domain';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { ReportDateRangePicker } from '@/components/features/reports/ReportDateRangePicker';
import { ReportExportMenu } from '@/components/features/reports/ReportExportMenu';
import { Search, Filter, RotateCcw, Eye, ArrowUpRight, ArrowDownLeft, Activity } from 'lucide-react';

export default function TransactionReportPage() {
  const [activeMode, setActiveMode] = useState<'ALL' | 'LIVE' | 'UNSETTLED' | 'ORDERS'>('ALL');
  const [dateRange, setDateRange] = useState<ReportDateRange>({ preset: 'THIS_MONTH' });
  const [searchQuery, setSearchQuery] = useState('');
  const [transactionType, setTransactionType] = useState<'ALL' | 'PAY_IN' | 'PAY_OUT'>('ALL');
  const [status, setStatus] = useState('ALL');

  const [data, setData] = useState<ReportListResult<Transaction, TransactionReportSummary> | null>(null);
  const [pagination, setPagination] = useState<PaginationState>({ page: 1, pageSize: 10, totalItems: 0, totalPages: 1 });
  const [isLoading, setIsLoading] = useState(true);

  const loadReport = () => {
    setIsLoading(true);
    const filters: ReportFilters = {
      dateRange,
      searchQuery,
      transactionType,
      status,
    };
    reportService.getTransactionReport(filters, activeMode, pagination.page, pagination.pageSize).then((res) => {
      if (res.success && res.data) {
        setData(res.data);
        setPagination(res.data.pagination);
      }
      setIsLoading(false);
    });
  };

  useEffect(() => {
    let isCancelled = false;
    const filters: ReportFilters = {
      dateRange,
      searchQuery,
      transactionType,
      status,
    };
    reportService.getTransactionReport(filters, activeMode, pagination.page, pagination.pageSize).then((res) => {
      if (!isCancelled && res.success && res.data) {
        setData(res.data);
        setPagination(res.data.pagination);
        setIsLoading(false);
      }
    });
    return () => {
      isCancelled = true;
    };
  }, [activeMode, dateRange, searchQuery, transactionType, status, pagination.page, pagination.pageSize]);

  const handleExportCsv = () => {
    if (!data?.items) return;
    const exportRows = data.items.map((t) => ({
      'Transaction ID': t.id,
      'Type': t.type,
      'Order ID': t.orderId || 'N/A',
      'Merchant Name': t.merchantName,
      'Amount (INR)': t.amount,
      'Fee (INR)': t.fee,
      'Net Amount (INR)': t.netAmount,
      'Status': t.status,
      'Payment Mode': t.paymentMode,
      'Provider': t.provider || 'N/A',
      'Created At': t.createdAt,
    }));
    reportService.exportToCsv(`Transaction_Report_${activeMode}`, exportRows);
  };

  const summary = data?.summary || {
    totalTransactions: 0,
    totalAmount: 0,
    successfulCount: 0,
    successfulAmount: 0,
    failedCount: 0,
    failedAmount: 0,
    pendingCount: 0,
    pendingAmount: 0,
    successRate: 100,
  };

  const columns = [
    {
      key: 'id',
      header: 'Transaction ID / Order',
      render: (row: Transaction) => (
        <div>
          <span className="font-mono font-bold text-[var(--primary)] text-xs block">{row.id}</span>
          <span className="font-mono text-[11px] text-slate-500">{row.orderId || row.referenceId || 'Direct'}</span>
        </div>
      ),
    },
    {
      key: 'type',
      header: 'Type',
      render: (row: Transaction) => (
        <span
          className={`inline-flex items-center gap-1 font-bold text-xs ${
            row.type === 'PAY_IN' ? 'text-emerald-700' : 'text-rose-700'
          }`}
        >
          {row.type === 'PAY_IN' ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownLeft className="w-3.5 h-3.5" />}
          {row.type}
        </span>
      ),
    },
    {
      key: 'merchantName',
      header: 'Merchant / Retailer',
      render: (row: Transaction) => (
        <div>
          <div className="font-semibold text-xs text-slate-900">{row.merchantName}</div>
          <div className="text-[11px] text-slate-400">{row.channel || 'API Gateway'}</div>
        </div>
      ),
    },
    {
      key: 'amount',
      header: 'Amount',
      align: 'right' as const,
      render: (row: Transaction) => (
        <span className="font-mono font-extrabold text-xs text-slate-900">
          {formatCurrency(row.amount)}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      align: 'center' as const,
      render: (row: Transaction) => <StatusBadge status={row.status} size="sm" />,
    },
    {
      key: 'createdAt',
      header: 'Date & Time',
      render: (row: Transaction) => (
        <span className="text-xs text-slate-600 font-mono whitespace-nowrap">
          {formatDate(row.createdAt)}
        </span>
      ),
    },
  ];

  return (
    <PageContainer
      title="Transaction Report"
      description="Analytical transaction volumes, success ratios, unsettled queues, and exportable reports."
      actions={
        <ReportExportMenu onExportCsv={handleExportCsv} reportTitle="Transaction Report" disabled={!data?.items?.length} />
      }
    >
      <div className="space-y-6">
        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          <Card className="p-4 bg-white border border-slate-200">
            <span className="text-xs font-semibold text-slate-500">Total Volume</span>
            <div className="mt-1 font-mono font-extrabold text-base text-slate-900">{formatCurrency(summary.totalAmount)}</div>
            <span className="text-[11px] text-slate-400 block mt-0.5">{summary.totalTransactions} Transactions</span>
          </Card>

          <Card className="p-4 bg-white border border-slate-200">
            <span className="text-xs font-semibold text-slate-500">Successful Volume</span>
            <div className="mt-1 font-mono font-extrabold text-base text-emerald-700">{formatCurrency(summary.successfulAmount)}</div>
            <span className="text-[11px] text-emerald-600 block mt-0.5">{summary.successfulCount} Successful</span>
          </Card>

          <Card className="p-4 bg-white border border-slate-200">
            <span className="text-xs font-semibold text-slate-500">Failed Volume</span>
            <div className="mt-1 font-mono font-extrabold text-base text-rose-700">{formatCurrency(summary.failedAmount)}</div>
            <span className="text-[11px] text-rose-600 block mt-0.5">{summary.failedCount} Failed</span>
          </Card>

          <Card className="p-4 bg-white border border-slate-200">
            <span className="text-xs font-semibold text-slate-500">Pending / Processing</span>
            <div className="mt-1 font-mono font-extrabold text-base text-amber-700">{formatCurrency(summary.pendingAmount)}</div>
            <span className="text-[11px] text-amber-600 block mt-0.5">{summary.pendingCount} In Pipeline</span>
          </Card>

          <Card className="p-4 bg-white border border-slate-200">
            <span className="text-xs font-semibold text-slate-500">Success Ratio</span>
            <div className="mt-1 font-mono font-extrabold text-base text-purple-900">{summary.successRate}%</div>
            <span className="text-[11px] text-purple-600 block mt-0.5">Overall clearance</span>
          </Card>

          <Card className="p-4 bg-white border border-slate-200">
            <span className="text-xs font-semibold text-slate-500">Report Mode</span>
            <div className="mt-1 font-bold text-sm text-[var(--primary)]">{activeMode}</div>
            <span className="text-[11px] text-slate-400 block mt-0.5">Active analytical view</span>
          </Card>
        </div>

        {/* Tab Sub-modes */}
        <div className="flex border-b border-slate-200 text-xs font-semibold overflow-x-auto">
          <button
            onClick={() => {
              setActiveMode('ALL');
              setPagination((prev) => ({ ...prev, page: 1 }));
            }}
            className={`pb-3 px-4 border-b-2 whitespace-nowrap transition-colors ${
              activeMode === 'ALL'
                ? 'border-[var(--primary)] text-[var(--primary)] font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            All Transactions Report
          </button>
          <button
            onClick={() => {
              setActiveMode('LIVE');
              setPagination((prev) => ({ ...prev, page: 1 }));
            }}
            className={`pb-3 px-4 border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeMode === 'LIVE'
                ? 'border-[var(--primary)] text-[var(--primary)] font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Activity className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
            <span>Live / Recent Window</span>
          </button>
          <button
            onClick={() => {
              setActiveMode('UNSETTLED');
              setPagination((prev) => ({ ...prev, page: 1 }));
            }}
            className={`pb-3 px-4 border-b-2 whitespace-nowrap transition-colors ${
              activeMode === 'UNSETTLED'
                ? 'border-[var(--primary)] text-[var(--primary)] font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Unsettled Transactions
          </button>
          <button
            onClick={() => {
              setActiveMode('ORDERS');
              setPagination((prev) => ({ ...prev, page: 1 }));
            }}
            className={`pb-3 px-4 border-b-2 whitespace-nowrap transition-colors ${
              activeMode === 'ORDERS'
                ? 'border-[var(--primary)] text-[var(--primary)] font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Created Orders Report
          </button>
        </div>

        {/* Filter Bar */}
        <Card className="p-4 bg-white border border-slate-200">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              loadReport();
            }}
            className="space-y-4 text-xs"
          >
            <ReportDateRangePicker value={dateRange} onChange={(d) => setDateRange(d)} />

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-2 border-t border-slate-100">
              <Input
                label="Search Query"
                placeholder="Search Transaction ID, Order, UTR..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                leftIcon={<Search className="w-4 h-4 text-slate-400" />}
              />

              <Select
                label="Transaction Type"
                value={transactionType}
                onChange={(e) => setTransactionType(e.target.value as 'ALL' | 'PAY_IN' | 'PAY_OUT')}
                options={[
                  { value: 'ALL', label: 'All Types' },
                  { value: 'PAY_IN', label: 'Pay-In' },
                  { value: 'PAY_OUT', label: 'Pay-Out' },
                ]}
              />

              <Select
                label="Transaction Status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                options={[
                  { value: 'ALL', label: 'All Statuses' },
                  { value: 'SUCCESS', label: 'Success' },
                  { value: 'FAILED', label: 'Failed' },
                  { value: 'PENDING', label: 'Pending' },
                  { value: 'PROCESSING', label: 'Processing' },
                ]}
              />
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <span className="text-[11px] text-slate-500">Filtered data dynamically calculates summary metrics.</span>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setTransactionType('ALL');
                    setStatus('ALL');
                    setDateRange({ preset: 'THIS_MONTH' });
                    loadReport();
                  }}
                  leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
                >
                  Reset
                </Button>
                <Button variant="primary" size="sm" type="submit" isLoading={isLoading} leftIcon={<Filter className="w-3.5 h-3.5" />}>
                  Apply Filters
                </Button>
              </div>
            </div>
          </form>
        </Card>

        {/* Data Table */}
        <div className="overflow-x-auto border border-[var(--border)] rounded-[var(--radius-xl)] bg-white shadow-xs">
          <Table
            columns={columns}
            data={data?.items || []}
            keyExtractor={(row) => row.id}
            isLoading={isLoading}
            renderActions={(row) => (
              <Link href={`/transactions/${row.id}`}>
                <Button variant="outline" size="sm" leftIcon={<Eye className="w-3.5 h-3.5" />}>
                  View
                </Button>
              </Link>
            )}
          />
        </div>

        <Pagination
          currentPage={pagination.page}
          totalPages={pagination.totalPages}
          totalItems={pagination.totalItems}
          pageSize={pagination.pageSize}
          onPageChange={(page) => setPagination((prev) => ({ ...prev, page }))}
          onPageSizeChange={(pageSize) => setPagination((prev) => ({ ...prev, page: 1, pageSize }))}
        />
      </div>
    </PageContainer>
  );
}
