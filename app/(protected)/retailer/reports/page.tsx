'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { reportService } from '@/services/reportService';
import { PageHeader, Button, SearchInput, Pagination, Tabs, Table, StatusBadge, useToast } from '@/components/ui';
import { formatCurrency, formatDateTime } from '@/utils/formatters';
import { ColumnDefinition } from '@/types/common';
import { Download, RefreshCw, FileText, Percent, ArrowLeftRight, ShieldCheck } from 'lucide-react';

export default function RetailerReportsPage() {
  const { session, isAuthenticated } = useAuth();
  const { toastSuccess, toastError } = useToast();
  const retailerId = session?.entityId || 'RET001';

  // Tabs (Scoped strictly to Retailer operational views)
  const [activeTab, setActiveTab] = useState('txn-report');

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [txnTypeFilter, setTxnTypeFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Report Datasets & Loading
  const [reportData, setReportData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const tabs = [
    { id: 'txn-report', label: 'Transaction Report', icon: <ArrowLeftRight className="w-4 h-4" /> },
    { id: 'comm-report', label: 'Commission Report', icon: <Percent className="w-4 h-4" /> },
    { id: 'wallet-report', label: 'Wallet Statement', icon: <FileText className="w-4 h-4" /> },
  ];

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      if (activeTab === 'txn-report') {
        const res = await reportService.getRetailerTransactionReport(retailerId, {
          searchQuery,
          type: txnTypeFilter !== 'ALL' ? (txnTypeFilter as any) : undefined,
          status: statusFilter !== 'ALL' ? statusFilter : undefined,
        });
        if (res.success && res.data) {
          setReportData(res.data.items);
        }
      } else if (activeTab === 'comm-report') {
        const commRes = await reportService.getRetailerCommissionReport(retailerId, {
          searchQuery,
          status: statusFilter !== 'ALL' ? statusFilter : undefined,
        });
        if (commRes.success && commRes.data) {
          setReportData(commRes.data.items);
        }
      } else if (activeTab === 'wallet-report') {
        const wltRes = await reportService.getRetailerWalletStatement(retailerId, {
          searchQuery,
          type: txnTypeFilter !== 'ALL' ? (txnTypeFilter as any) : undefined,
        });
        if (wltRes.success && wltRes.data) {
          setReportData(wltRes.data.items);
        }
      }
    } catch (err) {
      console.error('Failed to load Retailer report data:', err);
      toastError('Failed to load report data');
    } finally {
      setIsLoading(false);
    }
  }, [retailerId, activeTab, searchQuery, txnTypeFilter, statusFilter, toastError]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, searchQuery, txnTypeFilter, statusFilter]);

  const handleExportCsv = () => {
    if (reportData.length === 0) {
      toastError('No report records available to export');
      return;
    }
    reportService.exportToCsv(`Retailer_${retailerId}_${activeTab.toUpperCase()}`, reportData);
    toastSuccess('Report CSV exported successfully!');
  };

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return reportData.slice(start, start + pageSize);
  }, [reportData, currentPage, pageSize]);

  // Render Table Columns dynamically based on active tab
  const renderTable = () => {
    if (activeTab === 'txn-report') {
      const columns: ColumnDefinition<any>[] = [
        {
          key: 'transactionRef',
          header: 'Txn ID / Ref',
          render: (r) => (
            <div>
              <span className="font-mono font-bold text-indigo-600">{r.transactionRef || r.id}</span>
              {r.utr && r.utr !== 'N/A' && (
                <span className="block text-[10px] text-slate-400 font-mono">UTR: {r.utr}</span>
              )}
            </div>
          ),
        },
        {
          key: 'type',
          header: 'Type / Service',
          render: (r) => (
            <div>
              <span className="font-semibold text-slate-900">{r.type === 'PAY_IN' ? 'Pay-In Collection' : 'Pay-Out Disbursement'}</span>
              <span className="block text-[10px] text-slate-500">{r.service || r.paymentMode}</span>
            </div>
          ),
        },
        {
          key: 'amount',
          header: 'Principal Amount',
          align: 'right',
          render: (r) => <span className="font-bold text-slate-900 font-mono">{formatCurrency(r.amount)}</span>,
        },
        {
          key: 'fee',
          header: 'Charges',
          align: 'right',
          render: (r) => <span className="text-slate-600 font-mono">{formatCurrency(r.fee || 0)}</span>,
        },
        {
          key: 'gst',
          header: 'GST',
          align: 'right',
          render: (r) => <span className="text-slate-600 font-mono">{formatCurrency(r.gst || 0)}</span>,
        },
        {
          key: 'netAmount',
          header: 'Total Wallet Impact',
          align: 'right',
          render: (r) => <span className="font-bold text-indigo-700 font-mono">{formatCurrency(r.netAmount || r.amount)}</span>,
        },
        {
          key: 'status',
          header: 'Status',
          align: 'center',
          render: (r) => <StatusBadge status={r.status} size="sm" />,
        },
        {
          key: 'settlementStatus',
          header: 'Settlement',
          align: 'center',
          render: (r) => <StatusBadge status={r.settlementStatus || 'SETTLED'} size="sm" />,
        },
        {
          key: 'createdAt',
          header: 'Date & Time',
          render: (r) => <span className="text-slate-600 text-xs font-mono">{formatDateTime(r.createdAt)}</span>,
        },
      ];

      return (
        <Table
          columns={columns}
          data={paginatedData}
          keyExtractor={(r) => r.transactionRef || r.id}
          isLoading={isLoading}
          emptyTitle="No Transaction Records Found"
          emptyDescription="No outlet transactions match your selected search criteria."
        />
      );
    }

    if (activeTab === 'comm-report') {
      const columns: ColumnDefinition<any>[] = [
        {
          key: 'transactionRef',
          header: 'Txn ID / Ref',
          render: (r) => <span className="font-mono font-bold text-indigo-600">{r.transactionRef}</span>,
        },
        {
          key: 'serviceType',
          header: 'Service Category',
          render: (r) => <span className="text-slate-800 font-medium">{r.serviceType}</span>,
        },
        {
          key: 'transactionAmount',
          header: 'Principal Volume',
          align: 'right',
          render: (r) => <span className="font-bold text-slate-900 font-mono">{formatCurrency(r.transactionAmount)}</span>,
        },
        {
          key: 'mdCommissionRate',
          header: 'Plan Rule',
          align: 'center',
          render: (r) => (
            <span className="font-mono text-xs px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 font-semibold border border-indigo-200">
              {r.mdCommissionRate}
            </span>
          ),
        },
        {
          key: 'mdCommissionAmount',
          header: 'Earned Margin',
          align: 'right',
          render: (r) => <span className="font-bold text-emerald-600 font-mono">+{formatCurrency(r.mdCommissionAmount)}</span>,
        },
        {
          key: 'status',
          header: 'Status',
          align: 'center',
          render: (r) => <StatusBadge status={r.status === 'CREDITED' ? 'SUCCESS' : 'PENDING'} label={r.status} size="sm" />,
        },
        {
          key: 'createdDate',
          header: 'Credited Date',
          render: (r) => <span className="text-slate-600 text-xs font-mono">{formatDateTime(r.creditedDate || r.createdDate)}</span>,
        },
      ];

      return (
        <Table
          columns={columns}
          data={paginatedData}
          keyExtractor={(r, i) => r.id || String(i)}
          isLoading={isLoading}
          emptyTitle="No Commission Records Found"
          emptyDescription="No commission earnings match your selected search criteria."
        />
      );
    }

    if (activeTab === 'wallet-report') {
      const columns: ColumnDefinition<any>[] = [
        {
          key: 'referenceId',
          header: 'Ledger Reference',
          render: (r) => <span className="font-mono font-bold text-indigo-600">{r.referenceId || r.id}</span>,
        },
        {
          key: 'entryType',
          header: 'Movement Type',
          render: (r) => (
            <span className="font-semibold text-slate-800 uppercase tracking-wider text-[11px] font-mono">
              {r.entryType || r.movementType || 'LEDGER'}
            </span>
          ),
        },
        {
          key: 'description',
          header: 'Description',
          render: (r) => <span className="text-slate-700 text-xs">{r.description}</span>,
        },
        {
          key: 'direction',
          header: 'Direction',
          align: 'center',
          render: (r) => (
            <span
              className={`px-2 py-0.5 rounded text-xs font-bold font-mono ${
                r.direction === 'CREDIT' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
              }`}
            >
              {r.direction}
            </span>
          ),
        },
        {
          key: 'amount',
          header: 'Amount',
          align: 'right',
          render: (r) => (
            <span className={`font-bold font-mono ${r.direction === 'CREDIT' ? 'text-emerald-600' : 'text-rose-600'}`}>
              {r.direction === 'CREDIT' ? '+' : '-'}{formatCurrency(r.amount)}
            </span>
          ),
        },
        {
          key: 'closingBalance',
          header: 'Balance After',
          align: 'right',
          render: (r) => <span className="font-mono font-semibold text-slate-900">{formatCurrency(r.closingBalance || r.balanceAfter || 0)}</span>,
        },
        {
          key: 'createdAt',
          header: 'Posting Time',
          render: (r) => <span className="text-slate-600 text-xs font-mono">{formatDateTime(r.createdAt || r.timestamp)}</span>,
        },
      ];

      return (
        <Table
          columns={columns}
          data={paginatedData}
          keyExtractor={(r) => r.id}
          isLoading={isLoading}
          emptyTitle="No Wallet Statement Entries Found"
          emptyDescription="No wallet ledger records match your search criteria."
        />
      );
    }

    return null;
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <PageHeader
        title="Retailer Scoped Reports"
        description="Generate and export outlet transaction reports, commission summaries, and wallet statements."
        actions={
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={loadData}
              leftIcon={<RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />}
            >
              Refresh
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleExportCsv}
              leftIcon={<Download className="w-4 h-4" />}
            >
              Export Report CSV
            </Button>
          </div>
        }
      />

      {/* Security Scope Banner */}
      <div className="p-3 bg-indigo-50/60 border border-indigo-200 rounded-xl text-xs text-indigo-900 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0" />
          <span>Report security scope strictly limited to Retailer Account: <strong className="font-mono">{retailerId}</strong></span>
        </div>
        <span className="text-[11px] font-mono text-indigo-700 font-semibold bg-white px-2 py-0.5 rounded border border-indigo-200">
          Role: RETAILER
        </span>
      </div>

      {/* Tabs */}
      <Tabs items={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {/* Filter Bar */}
      <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex-1 min-w-[280px] max-w-md">
          <SearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search report entries by ID, Reference, or UTR..."
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Type Filter */}
          {activeTab === 'txn-report' && (
            <select
              value={txnTypeFilter}
              onChange={(e) => setTxnTypeFilter(e.target.value)}
              className="text-xs border border-slate-200 rounded-lg px-3 py-2 bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            >
              <option value="ALL">All Types</option>
              <option value="PAY_IN">Pay-In Collection</option>
              <option value="PAY_OUT">Pay-Out Disbursement</option>
            </select>
          )}

          {/* Status Filter */}
          {(activeTab === 'txn-report' || activeTab === 'comm-report') && (
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-xs border border-slate-200 rounded-lg px-3 py-2 bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            >
              <option value="ALL">All Statuses</option>
              <option value="SUCCESS">Success / Credited</option>
              <option value="PENDING">Pending</option>
              <option value="FAILED">Failed</option>
            </select>
          )}

          {(searchQuery || txnTypeFilter !== 'ALL' || statusFilter !== 'ALL') && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSearchQuery('');
                setTxnTypeFilter('ALL');
                setStatusFilter('ALL');
              }}
              className="text-xs text-slate-500 hover:text-slate-900"
            >
              Reset Filters
            </Button>
          )}
        </div>
      </div>

      {/* Report Table */}
      <div className="space-y-4">
        {renderTable()}

        {/* Pagination */}
        {reportData.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={Math.ceil(reportData.length / pageSize)}
            totalItems={reportData.length}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
          />
        )}
      </div>
    </div>
  );
}
