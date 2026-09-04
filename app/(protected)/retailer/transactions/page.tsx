'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { PageContainer } from '@/components/layout/PageContainer';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useAuth } from '@/context/AuthContext';
import { transactionService, TransactionListResult } from '@/services/transactionService';
import { reportService } from '@/services/reportService';
import { Transaction, TransactionFilters } from '@/types/domain';
import { formatCurrency, formatDateTime } from '@/utils/formatters';
import { TransactionDetailsDrawer } from '@/components/features/transactions/TransactionDetailsDrawer';
import {
  ArrowLeftRight,
  Search,
  Filter,
  Download,
  Eye,
  ArrowDownLeft,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  AlertTriangle,
  RefreshCw,
  Printer,
} from 'lucide-react';
import { PayInReceipt } from '@/components/features/retailer/PayInReceipt';
import { PayOutReceipt } from '@/components/features/retailer/PayOutReceipt';

export default function RetailerTransactionsPage() {
  const { session } = useAuth();
  const searchParams = useSearchParams();

  const retailerId = session?.entityId || 'ret_001';

  // Read URL params
  const typeParam = searchParams.get('type') || 'ALL';
  const txnIdParam = searchParams.get('transactionId') || '';

  // State
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // Filters
  const [searchQuery, setSearchQuery] = useState(txnIdParam);
  const [typeFilter, setTypeFilter] = useState<'ALL' | 'PAY_IN' | 'PAY_OUT'>(typeParam as any);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [paymentModeFilter, setPaymentModeFilter] = useState('ALL');

  // Detail Drawer State
  const [selectedTxn, setSelectedTxn] = useState<Transaction | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Receipt Modal State
  const [receiptTxn, setReceiptTxn] = useState<Transaction | null>(null);

  // Load Transactions
  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const filters: TransactionFilters = {
        type: typeFilter,
        status: statusFilter !== 'ALL' ? (statusFilter as any) : undefined,
        searchQuery: searchQuery.trim() || undefined,
      };

      const res = await transactionService.getTransactionsForRetailer(retailerId, filters, page, pageSize);
      if (res.success && res.data) {
        setTransactions(res.data.items);
        setTotalPages(res.data.pagination.totalPages);
        setTotalItems(res.data.pagination.totalItems);
      }
    } catch (err) {
      console.error('Failed to load transactions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [retailerId, typeFilter, statusFilter, page, searchQuery]);

  // Deep-link auto-open drawer if transactionId is passed
  useEffect(() => {
    if (txnIdParam) {
      transactionService.getTransactionByIdForRetailer(retailerId, txnIdParam).then((res) => {
        if (res.success && res.data) {
          setSelectedTxn(res.data);
          setIsDrawerOpen(true);
        }
      });
    }
  }, [txnIdParam, retailerId]);

  // KPI Calculations
  const payInCount = transactions.filter((t) => t.type === 'PAY_IN').length;
  const payOutCount = transactions.filter((t) => t.type === 'PAY_OUT').length;
  const successCount = transactions.filter((t) => t.status === 'SUCCESS').length;
  const pendingCount = transactions.filter((t) => t.status === 'PENDING').length;
  const failedCount = transactions.filter((t) => t.status === 'FAILED').length;
  const totalVolume = transactions
    .filter((t) => t.status === 'SUCCESS')
    .reduce((acc, curr) => acc + curr.amount, 0);

  // CSV Export
  const handleExportCsv = () => {
    const exportRows = transactions.map((t) => ({
      'Transaction ID': t.transactionRef,
      'Order ID': t.orderId || 'N/A',
      Type: t.type,
      Service: t.service || 'N/A',
      'Payment Mode': t.paymentMode,
      'Amount (₹)': t.amount,
      'Fee (₹)': t.fee,
      'GST (₹)': t.gst || 0,
      'Net Amount (₹)': t.netAmount,
      Status: t.status,
      'UTR / Ref': t.utr || t.referenceId || 'N/A',
      'Customer / Beneficiary': t.customerName || t.beneficiaryName || 'N/A',
      'Account / Mobile': t.accountNumberMasked || t.customerMobile || 'N/A',
      'Date & Time': formatDateTime(t.createdAt),
    }));

    reportService.exportToCsv(`Retailer_Transactions_${retailerId}`, exportRows);
  };

  return (
    <PageContainer
      title="Transaction History"
      description="Inspect and search your counter collection (Pay-In) and disbursement (Pay-Out) transactions."
      statusBadge={<StatusBadge status="ACTIVE" label="Approved Retailer" />}
      actions={
        <Button
          variant="outline"
          size="sm"
          onClick={handleExportCsv}
          leftIcon={<Download className="w-4 h-4" />}
          disabled={transactions.length === 0}
        >
          Export CSV
        </Button>
      }
    >
      <div className="space-y-6 max-w-7xl mx-auto">
        {/* KPI Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-2xs space-y-1">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Total Volume</span>
            <p className="text-xl font-extrabold text-slate-900 font-mono">{formatCurrency(totalVolume)}</p>
            <p className="text-[11px] text-slate-500">{totalItems} Total Recorded</p>
          </div>

          <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/50 shadow-2xs space-y-1">
            <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1">
              <ArrowDownLeft className="w-3.5 h-3.5 text-emerald-600" /> Pay-In Collections
            </span>
            <p className="text-xl font-extrabold text-emerald-900 font-mono">{payInCount} Txns</p>
            <p className="text-[11px] text-emerald-700">Counter Collections</p>
          </div>

          <div className="p-4 rounded-xl border border-indigo-200 bg-indigo-50/50 shadow-2xs space-y-1">
            <span className="text-[11px] font-bold text-indigo-800 uppercase tracking-wider flex items-center gap-1">
              <ArrowUpRight className="w-3.5 h-3.5 text-indigo-600" /> Pay-Out Disbursements
            </span>
            <p className="text-xl font-extrabold text-indigo-900 font-mono">{payOutCount} Txns</p>
            <p className="text-[11px] text-indigo-700">Disbursements</p>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-2xs space-y-1">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Status Breakdown</span>
            <div className="flex items-center gap-2 text-xs font-mono font-bold pt-1">
              <span className="text-emerald-700">{successCount} Succ</span>
              <span className="text-slate-300">•</span>
              <span className="text-amber-700">{pendingCount} Pend</span>
              <span className="text-slate-300">•</span>
              <span className="text-rose-700">{failedCount} Fail</span>
            </div>
            <p className="text-[11px] text-slate-500">Filtered Context</p>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <Card>
          <div className="p-4 flex flex-wrap items-center justify-between gap-4 border-b border-slate-100">
            <div className="flex flex-wrap items-center gap-3 flex-1">
              {/* Search */}
              <div className="relative min-w-[240px] flex-1 max-w-md">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setPage(1);
                  }}
                  placeholder="Search Txn ID, Ref, UTR, Customer, Mobile..."
                  className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-200"
                />
              </div>

              {/* Type Filter Tabs */}
              <div className="flex items-center p-1 bg-slate-100 rounded-lg border border-slate-200 text-xs">
                {(['ALL', 'PAY_IN', 'PAY_OUT'] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => {
                      setTypeFilter(t);
                      setPage(1);
                    }}
                    className={`px-3 py-1 rounded-md font-bold transition-all ${
                      typeFilter === t
                        ? 'bg-white text-slate-900 shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {t === 'ALL' ? 'All Types' : t === 'PAY_IN' ? 'Pay-In' : 'Pay-Out'}
                  </button>
                ))}
              </div>

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setPage(1);
                }}
                className="px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white font-medium"
              >
                <option value="ALL">All Statuses</option>
                <option value="SUCCESS">SUCCESS</option>
                <option value="PENDING">PENDING</option>
                <option value="FAILED">FAILED</option>
              </select>
            </div>

            <Button variant="ghost" size="sm" onClick={fetchTransactions} leftIcon={<RefreshCw className="w-3.5 h-3.5" />}>
              Refresh
            </Button>
          </div>

          {/* Transactions Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-bold border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">Txn ID / Date</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Service / Mode</th>
                  <th className="px-4 py-3">Customer / Beneficiary</th>
                  <th className="px-4 py-3 text-right">Amount (₹)</th>
                  <th className="px-4 py-3 text-right">Fee & GST</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">UTR / Ref</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono">
                {loading ? (
                  <tr>
                    <td colSpan={9} className="py-8 text-center text-slate-400">
                      <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-indigo-600" />
                      Loading retailer transactions...
                    </td>
                  </tr>
                ) : transactions.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-8 text-center text-slate-400">
                      No transactions found for the selected filters.
                    </td>
                  </tr>
                ) : (
                  transactions.map((txn) => (
                    <tr key={txn.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-4 py-3 font-semibold text-indigo-700">
                        <div>{txn.transactionRef}</div>
                        <div className="text-[10px] text-slate-400 font-normal">{formatDateTime(txn.createdAt)}</div>
                      </td>

                      <td className="px-4 py-3 font-sans">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold ${
                            txn.type === 'PAY_IN'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-indigo-100 text-indigo-800'
                          }`}
                        >
                          {txn.type === 'PAY_IN' ? (
                            <ArrowDownLeft className="w-3 h-3 text-emerald-600" />
                          ) : (
                            <ArrowUpRight className="w-3 h-3 text-indigo-600" />
                          )}
                          {txn.type}
                        </span>
                      </td>

                      <td className="px-4 py-3 font-sans">
                        <div className="font-semibold text-slate-800">{txn.service || 'Default Service'}</div>
                        <div className="text-[10px] font-mono text-slate-500">{txn.paymentMode}</div>
                      </td>

                      <td className="px-4 py-3 font-sans">
                        <div className="font-medium text-slate-900">
                          {txn.customerName || txn.beneficiaryName || 'Walk-in Customer'}
                        </div>
                        <div className="text-[10px] font-mono text-slate-400">
                          {txn.accountNumberMasked || txn.customerMobile || 'N/A'}
                        </div>
                      </td>

                      <td className="px-4 py-3 text-right font-bold text-slate-900">
                        {formatCurrency(txn.amount)}
                      </td>

                      <td className="px-4 py-3 text-right text-slate-600 text-[11px]">
                        <div>{formatCurrency(txn.fee)}</div>
                        <div className="text-[10px] text-slate-400">GST: {formatCurrency(txn.gst || 0)}</div>
                      </td>

                      <td className="px-4 py-3">
                        <StatusBadge status={txn.status} label={txn.status} size="sm" />
                      </td>

                      <td className="px-4 py-3 text-slate-600 text-[11px] truncate max-w-[120px]">
                        {txn.utr || txn.referenceId || 'N/A'}
                      </td>

                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedTxn(txn);
                              setIsDrawerOpen(true);
                            }}
                            leftIcon={<Eye className="w-3.5 h-3.5" />}
                          >
                            Details
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setReceiptTxn(txn)}
                            leftIcon={<Printer className="w-3.5 h-3.5" />}
                          >
                            Receipt
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="p-4 border-t border-slate-200 flex items-center justify-between text-xs">
            <span className="text-slate-500 font-mono">
              Page {page} of {totalPages} ({totalItems} records)
            </span>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
                Previous
              </Button>
              <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>
                Next
              </Button>
            </div>
          </div>
        </Card>

        {/* Transaction Detail Drawer */}
        <TransactionDetailsDrawer
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          transaction={selectedTxn}
        />

        {/* Printable Receipt Modal */}
        {receiptTxn && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto space-y-4 shadow-2xl">
              <div className="flex items-center justify-between border-b pb-3">
                <h3 className="font-bold text-slate-900 text-sm">Transaction Receipt</h3>
                <Button variant="ghost" size="sm" onClick={() => setReceiptTxn(null)}>
                  Close
                </Button>
              </div>

              {receiptTxn.type === 'PAY_IN' ? (
                <PayInReceipt transaction={receiptTxn} />
              ) : (
                <PayOutReceipt transaction={receiptTxn} />
              )}
            </div>
          </div>
        )}
      </div>
    </PageContainer>
  );
}
