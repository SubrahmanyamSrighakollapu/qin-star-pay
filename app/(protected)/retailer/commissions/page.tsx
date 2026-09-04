'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { PageContainer } from '@/components/layout/PageContainer';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Button } from '@/components/ui/Button';
import { Drawer } from '@/components/ui/Drawer';
import { Pagination } from '@/components/ui/Pagination';
import { useAuth } from '@/context/AuthContext';
import {
  commissionService,
  MasterDistributorCommissionRecord,
  ScopedCommissionSummary,
} from '@/services/commissionService';
import { formatCurrency, formatDateTime } from '@/utils/formatters';

// Financial Foundation Components
import { FinancialPageHeader } from '@/components/features/financial/FinancialPageHeader';
import { FinancialMetricCard } from '@/components/features/financial/FinancialMetricCard';
import { FinancialEmptyState } from '@/components/features/financial/FinancialEmptyState';
import { TransactionTypeBadge } from '@/components/features/financial/TransactionTypeBadge';

import {
  Percent,
  Search,
  RefreshCw,
  TrendingUp,
  Clock,
  CheckCircle2,
  Calendar,
  FileText,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  Award,
  X,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

export default function RetailerCommissionsPage() {
  const { session } = useAuth();
  const retailerId = session?.entityId || 'RET001';

  // State
  const [commissions, setCommissions] = useState<MasterDistributorCommissionRecord[]>([]);
  const [summary, setSummary] = useState<ScopedCommissionSummary>({
    todayCommission: 0,
    yesterdayCommission: 0,
    thisMonthCommission: 0,
    previousMonthCommission: 0,
    pendingCommission: 0,
    creditedCommission: 0,
  });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // Selected for Drawer
  const [selectedCommission, setSelectedCommission] = useState<MasterDistributorCommissionRecord | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const fetchCommissions = useCallback(async () => {
    setLoading(true);
    try {
      const res = await commissionService.getCommissionsForRetailer(
        retailerId,
        {
          searchQuery,
          status: statusFilter,
        },
        page,
        10
      );

      if (res.success && res.data) {
        setCommissions(res.data.items);
        setSummary(res.data.summary);
        setTotalPages(res.data.pagination.totalPages);
        setTotalItems(res.data.pagination.totalItems);
      }
    } catch (err) {
      console.error('Failed to load retailer commissions', err);
    } finally {
      setLoading(false);
    }
  }, [retailerId, searchQuery, statusFilter, page]);

  useEffect(() => {
    fetchCommissions();
  }, [fetchCommissions]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setStatusFilter('ALL');
    setPage(1);
  };

  return (
    <PageContainer>
      <div className="space-y-6 max-w-7xl mx-auto">
        {/* Page Header */}
        <FinancialPageHeader
          title="Commission Earnings"
          subtitle="Track real-time commission earnings credited to your wallet from customer Pay-In & Pay-Out operations."
          statusBadge={<StatusBadge status="ACTIVE" label="Approved Retailer" />}
          actions={
            <Button
              variant="outline"
              size="sm"
              onClick={fetchCommissions}
              isLoading={loading}
              leftIcon={<RefreshCw className="w-4 h-4" />}
            >
              Refresh
            </Button>
          }
        />

        {/* Earnings Hero Surface & Assigned Plan Context Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Main Earnings Summary Hero (~68% width) */}
          <div className="lg:col-span-8 p-6 rounded-2xl bg-gradient-to-br from-white via-emerald-50/20 to-slate-50 border border-emerald-200/80 shadow-xs space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-900 block">
                    RETAILER EARNINGS
                  </span>
                  <span className="text-[11px] text-slate-500">Real-time credited margin</span>
                </div>
              </div>
              <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                This Month: +{formatCurrency(summary.thisMonthCommission)}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
              <div className="p-3 rounded-xl bg-white border border-slate-200/80 space-y-0.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Today</span>
                <p className="text-lg font-bold font-mono text-emerald-700">+{formatCurrency(summary.todayCommission)}</p>
              </div>

              <div className="p-3 rounded-xl bg-white border border-slate-200/80 space-y-0.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Yesterday</span>
                <p className="text-lg font-bold font-mono text-slate-800">+{formatCurrency(summary.yesterdayCommission)}</p>
              </div>

              <div className="p-3 rounded-xl bg-white border border-slate-200/80 space-y-0.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Credited Total</span>
                <p className="text-lg font-bold font-mono text-emerald-700">+{formatCurrency(summary.creditedCommission)}</p>
              </div>

              <div className="p-3 rounded-xl bg-white border border-slate-200/80 space-y-0.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Pending</span>
                <p className="text-lg font-bold font-mono text-amber-700">+{formatCurrency(summary.pendingCommission)}</p>
              </div>
            </div>
          </div>

          {/* Read-Only Assigned Retailer Commercial Plan (~32% width) */}
          <div className="lg:col-span-4 p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-[#0F4C81]" />
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-900">
                    Assigned Plan Context
                  </span>
                </div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                  Read Only
                </span>
              </div>
              <p className="text-sm font-extrabold text-slate-900">Standard Retailer Plan</p>
              <p className="text-[11px] text-slate-500">Commercial rates applied automatically to your transactions.</p>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 font-mono text-xs">
              <div className="p-2.5 rounded-lg bg-indigo-50/50 border border-indigo-100 space-y-0.5">
                <span className="text-[10px] font-sans text-indigo-900 block font-semibold">Pay-In Rate</span>
                <span className="font-bold text-[#0F4C81]">0.25% Percentage</span>
              </div>
              <div className="p-2.5 rounded-lg bg-orange-50/50 border border-orange-100 space-y-0.5">
                <span className="text-[10px] font-sans text-orange-900 block font-semibold">Pay-Out Rate</span>
                <span className="font-bold text-[#F97316]">₹5.00 Fixed</span>
              </div>
            </div>
          </div>
        </div>

        {/* Commission Table Workspace */}
        <div className="bg-white border border-slate-200/90 rounded-2xl shadow-xs overflow-hidden">
          {/* Controls Bar */}
          <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-3 bg-slate-50/50">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Search by Transaction ID or Reference..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setPage(1);
                  }}
                  className="w-full pl-9 pr-3.5 py-2 text-xs font-mono border border-slate-300 rounded-xl focus:outline-hidden focus:border-[#0F4C81] focus:ring-2 focus:ring-indigo-100 bg-white"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setPage(1);
                }}
                className="px-3 py-2 text-xs font-semibold border border-slate-300 rounded-xl bg-white focus:outline-hidden focus:border-[#0F4C81]"
              >
                <option value="ALL">All Statuses</option>
                <option value="CREDITED">Credited</option>
                <option value="PENDING">Pending</option>
                <option value="REVERSED">Reversed</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              {(searchQuery || statusFilter !== 'ALL') && (
                <Button variant="outline" size="sm" onClick={handleResetFilters} leftIcon={<X className="w-3.5 h-3.5" />}>
                  Reset
                </Button>
              )}
            </div>
          </div>

          {/* Table Surface (Scrolls internally) */}
          <div className="overflow-x-auto">
            {loading ? (
              <div className="py-16 text-center text-xs text-slate-400 space-y-2">
                <RefreshCw className="w-6 h-6 animate-spin mx-auto text-[#0F4C81]" />
                <p>Loading commission earnings...</p>
              </div>
            ) : commissions.length === 0 ? (
              <FinancialEmptyState
                title="No commission records found"
                description="Commission earnings will appear after eligible successful transactions."
                action={
                  <Button variant="outline" size="sm" onClick={handleResetFilters}>
                    Reset Filters
                  </Button>
                }
              />
            ) : (
              <table className="w-full text-left border-collapse min-w-[850px]">
                <thead>
                  <tr className="border-b border-slate-200/80 bg-slate-50/70 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    <th className="py-3 px-4">Transaction Ref / ID</th>
                    <th className="py-3 px-4">Type / Service</th>
                    <th className="py-3 px-4 text-right">Principal Amount</th>
                    <th className="py-3 px-4 text-center">Applied Rule / Rate</th>
                    <th className="py-3 px-4 text-right">Earned Commission</th>
                    <th className="py-3 px-4 text-center">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs font-mono">
                  {commissions.map((comm) => {
                    const isPayIn = comm.serviceType.toLowerCase().includes('pay-in') || comm.serviceType.toLowerCase().includes('upi');

                    return (
                      <tr
                        key={comm.id}
                        className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                        onClick={() => {
                          setSelectedCommission(comm);
                          setIsDrawerOpen(true);
                        }}
                      >
                        {/* Transaction ID */}
                        <td className="py-3.5 px-4">
                          <span className="font-bold text-slate-900 group-hover:text-[#0F4C81] transition-colors block">
                            {comm.transactionRef}
                          </span>
                          <span className="text-[11px] text-slate-400">{formatDateTime(comm.createdDate)}</span>
                        </td>

                        {/* Type / Service */}
                        <td className="py-3.5 px-4 font-sans whitespace-nowrap">
                          <TransactionTypeBadge type={isPayIn ? 'PAY_IN' : 'PAY_OUT'} size="sm" />
                          <span className="block text-[10px] text-slate-500 mt-0.5">{comm.serviceType}</span>
                        </td>

                        {/* Principal Amount */}
                        <td className="py-3.5 px-4 text-right font-bold text-slate-900">
                          {formatCurrency(comm.transactionAmount)}
                        </td>

                        {/* Applied Rule / Rate */}
                        <td className="py-3.5 px-4 text-center font-sans">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-indigo-50 text-[#0F4C81] border border-indigo-200">
                            {comm.mdCommissionRate}
                          </span>
                        </td>

                        {/* Earned Commission */}
                        <td className="py-3.5 px-4 text-right font-bold text-emerald-600 text-sm">
                          +{formatCurrency(comm.mdCommissionAmount)}
                        </td>

                        {/* Status */}
                        <td className="py-3.5 px-4 text-center whitespace-nowrap font-sans">
                          <StatusBadge
                            status={
                              comm.status === 'CREDITED'
                                ? 'SUCCESS'
                                : comm.status === 'REVERSED'
                                ? 'FAILED'
                                : 'PENDING'
                            }
                            label={comm.status}
                            size="sm"
                          />
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-4 text-right whitespace-nowrap font-sans" onClick={(event) => event.stopPropagation()}>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedCommission(comm);
                              setIsDrawerOpen(true);
                            }}
                            leftIcon={<Eye className="w-3.5 h-3.5" />}
                          >
                            Details
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex justify-between items-center">
              <span className="text-xs text-slate-500 font-mono">
                Showing {commissions.length} of {totalItems} items
              </span>
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={(p) => setPage(p)}
              />
            </div>
          )}
        </div>

        {/* Commission Detail Drawer */}
        <Drawer
          isOpen={isDrawerOpen}
          onClose={() => {
            setIsDrawerOpen(false);
            setSelectedCommission(null);
          }}
          size="lg"
          title="Commission Earning Detail"
          description={selectedCommission ? `Transaction Ref: ${selectedCommission.transactionRef}` : ''}
          footer={
            <Button
              variant="outline"
              onClick={() => {
                setIsDrawerOpen(false);
                setSelectedCommission(null);
              }}
              fullWidth
            >
              Close
            </Button>
          }
        >
          {selectedCommission && (
            <div className="space-y-6">
              {/* Header Banner */}
              <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/60 flex items-center justify-between">
                <div>
                  <p className="text-xs text-emerald-900 font-bold uppercase tracking-wider">Posting Status</p>
                  <div className="mt-1">
                    <StatusBadge
                      status={
                        selectedCommission.status === 'CREDITED'
                          ? 'SUCCESS'
                          : selectedCommission.status === 'REVERSED'
                          ? 'FAILED'
                          : 'PENDING'
                      }
                      label={selectedCommission.status}
                    />
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-emerald-900 font-bold uppercase tracking-wider">Retailer Margin</p>
                  <p className="text-xl font-bold text-emerald-700 font-mono mt-0.5">
                    +{formatCurrency(selectedCommission.mdCommissionAmount)}
                  </p>
                </div>
              </div>

              {/* Calculation Breakdown */}
              <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-3 font-mono text-xs">
                <h4 className="font-bold text-slate-900 font-sans text-xs uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-2">
                  <Percent className="w-4 h-4 text-[#0F4C81]" /> Transaction Snapshot Rule
                </h4>

                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div>
                    <span className="text-slate-400 text-[10px] block font-sans">Transaction Ref</span>
                    <span className="font-bold text-slate-900">{selectedCommission.transactionRef}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block font-sans">Service Category</span>
                    <span className="font-semibold text-slate-900 font-sans">{selectedCommission.serviceType}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block font-sans">Principal Amount</span>
                    <span className="font-bold text-slate-900">{formatCurrency(selectedCommission.transactionAmount)}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block font-sans">Snapshot Commercial Rate</span>
                    <span className="font-bold text-[#0F4C81]">{selectedCommission.mdCommissionRate}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block font-sans">Earned Commission</span>
                    <span className="font-bold text-emerald-600">+{formatCurrency(selectedCommission.mdCommissionAmount)}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block font-sans">Wallet Reference</span>
                    <span className="text-slate-700">{selectedCommission.walletReferenceId || 'LEDG_COMM_CREDIT'}</span>
                  </div>
                </div>
              </div>

              {/* Timestamps */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2 text-xs text-slate-700 font-mono">
                <div className="flex justify-between">
                  <span className="text-slate-500 font-sans">Earned Timestamp:</span>
                  <span className="font-semibold">{formatDateTime(selectedCommission.createdDate)}</span>
                </div>
                {selectedCommission.creditedDate && (
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-sans">Wallet Credit Timestamp:</span>
                    <span className="font-semibold text-emerald-700">{formatDateTime(selectedCommission.creditedDate)}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </Drawer>
      </div>
    </PageContainer>
  );
}
