'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { PageContainer } from '@/components/layout/PageContainer';
import { KPICard } from '@/components/ui/KPICard';
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
  ChevronRight,
  Layers,
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

  return (
    <PageContainer
      title="Commission Earnings"
      description="Track real-time commission earnings credited to your wallet from customer Pay-In & Pay-Out operations."
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
    >
      <div className="space-y-6">
        {/* KPI Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          <KPICard
            title="Today's Earnings"
            value={formatCurrency(summary.todayCommission)}
            icon={<TrendingUp className="w-4 h-4 text-emerald-600" />}
            trend={{ value: 'Real-time', isPositive: true }}
          />
          <KPICard
            title="Yesterday"
            value={formatCurrency(summary.yesterdayCommission)}
            icon={<Calendar className="w-4 h-4 text-slate-600" />}
          />
          <KPICard
            title="This Month"
            value={formatCurrency(summary.thisMonthCommission)}
            icon={<DollarSign className="w-4 h-4 text-indigo-600" />}
          />
          <KPICard
            title="Previous Month"
            value={formatCurrency(summary.previousMonthCommission)}
            icon={<FileText className="w-4 h-4 text-slate-600" />}
          />
          <KPICard
            title="Credited Total"
            value={formatCurrency(summary.creditedCommission)}
            icon={<CheckCircle2 className="w-4 h-4 text-emerald-600" />}
          />
          <KPICard
            title="Pending"
            value={formatCurrency(summary.pendingCommission)}
            icon={<Clock className="w-4 h-4 text-amber-600" />}
          />
        </div>

        {/* Filters & Controls */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-3">
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by Transaction ID or Reference..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setPage(1);
                }}
                className="w-full pl-9 pr-4 py-2 text-xs border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-medium">Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setPage(1);
                }}
                className="text-xs border border-slate-200 rounded-lg px-3 py-2 bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              >
                <option value="ALL">All Statuses</option>
                <option value="CREDITED">Credited</option>
                <option value="PENDING">Pending</option>
                <option value="REVERSED">Reversed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Commission Table */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3 whitespace-nowrap">Transaction ID</th>
                  <th className="px-4 py-3 whitespace-nowrap">Type / Service</th>
                  <th className="px-4 py-3 whitespace-nowrap text-right">Transaction Amount</th>
                  <th className="px-4 py-3 whitespace-nowrap text-center">Commission Rule</th>
                  <th className="px-4 py-3 whitespace-nowrap text-right">Earned Commission</th>
                  <th className="px-4 py-3 whitespace-nowrap text-center">Status</th>
                  <th className="px-4 py-3 whitespace-nowrap">Earned Date</th>
                  <th className="px-4 py-3 whitespace-nowrap text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {loading ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-8 text-center text-slate-400">
                      <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-indigo-600" />
                      Loading commission earnings...
                    </td>
                  </tr>
                ) : commissions.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-8 text-center text-slate-500">
                      No commission earnings found matching the criteria.
                    </td>
                  </tr>
                ) : (
                  commissions.map((comm) => {
                    const isPayIn = comm.serviceType.toLowerCase().includes('pay-in') || comm.serviceType.toLowerCase().includes('upi');
                    const ruleLabel = isPayIn ? `${comm.mdCommissionRate} Slab` : `${comm.mdCommissionRate} Fixed`;

                    return (
                      <tr key={comm.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className="font-mono text-slate-900 font-semibold">{comm.transactionRef}</span>
                          <span className="block text-[10px] text-slate-400 font-mono">{comm.id}</span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="flex items-center gap-1.5">
                            {isPayIn ? (
                              <ArrowDownRight className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            ) : (
                              <ArrowUpRight className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                            )}
                            <div>
                              <span className="font-semibold text-slate-800">
                                {isPayIn ? 'Pay-In Collection' : 'Pay-Out Disbursement'}
                              </span>
                              <span className="block text-[10px] text-slate-500">{comm.serviceType}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-right font-mono text-slate-900 font-semibold">
                          {formatCurrency(comm.transactionAmount)}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-center">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-mono font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                            {ruleLabel}
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-right font-mono font-bold text-emerald-600">
                          +{formatCurrency(comm.mdCommissionAmount)}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-center">
                          <StatusBadge
                            status={
                              comm.status === 'CREDITED'
                                ? 'SUCCESS'
                                : comm.status === 'REVERSED'
                                ? 'FAILED'
                                : 'PENDING'
                            }
                            label={comm.status}
                          />
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-slate-600 font-mono">
                          {formatDateTime(comm.createdDate)}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedCommission(comm);
                              setIsDrawerOpen(true);
                            }}
                          >
                            Details
                          </Button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {!loading && commissions.length > 0 && (
            <div className="p-4 border-t border-slate-100">
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={(p) => setPage(p)}
                totalItems={totalItems}
                pageSize={10}
              />
            </div>
          )}
        </div>
      </div>

      {/* Commission Detail Drawer */}
      <Drawer
        isOpen={isDrawerOpen}
        onClose={() => {
          setIsDrawerOpen(false);
          setSelectedCommission(null);
        }}
        size="lg"
        title={
          <div className="flex items-center gap-2">
            <span>Commission Detail</span>
            {selectedCommission && (
              <span className="font-mono text-xs px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200">
                +{formatCurrency(selectedCommission.mdCommissionAmount)}
              </span>
            )}
          </div>
        }
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
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500 font-medium">Posting Status</p>
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
                <p className="text-xs text-slate-500 font-medium">Earned Retailer Margin</p>
                <p className="text-xl font-bold text-emerald-600 font-mono mt-0.5">
                  +{formatCurrency(selectedCommission.mdCommissionAmount)}
                </p>
              </div>
            </div>

            {/* Calculation Breakdown */}
            <div className="p-4 rounded-xl border border-indigo-100 bg-indigo-50/40 space-y-3">
              <h4 className="text-xs font-bold text-indigo-900 uppercase tracking-wider flex items-center gap-1.5">
                <Percent className="w-4 h-4 text-indigo-600" /> Plan Rule & Earning Breakdown
              </h4>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <p className="text-slate-500">Transaction ID:</p>
                  <p className="font-bold text-slate-900 mt-0.5 font-mono">
                    {selectedCommission.transactionRef}
                  </p>
                </div>
                <div>
                  <p className="text-slate-500">Service Category:</p>
                  <p className="font-semibold text-slate-900 mt-0.5">
                    {selectedCommission.serviceType}
                  </p>
                </div>
                <div>
                  <p className="text-slate-500">Principal Volume:</p>
                  <p className="font-bold text-slate-900 mt-0.5 font-mono">
                    {formatCurrency(selectedCommission.transactionAmount)}
                  </p>
                </div>
                <div>
                  <p className="text-slate-500">Assigned Retailer Plan Rule:</p>
                  <p className="font-semibold text-indigo-700 mt-0.5 font-mono">
                    {selectedCommission.mdCommissionRate}
                  </p>
                </div>
                <div>
                  <p className="text-slate-500">Credited Commission:</p>
                  <p className="font-bold text-emerald-600 mt-0.5 font-mono">
                    +{formatCurrency(selectedCommission.mdCommissionAmount)}
                  </p>
                </div>
                <div>
                  <p className="text-slate-500">Ledger Reference:</p>
                  <p className="font-mono text-slate-800 mt-0.5">
                    {selectedCommission.walletReferenceId || 'LEDG_COMM_AUTOCREDIT'}
                  </p>
                </div>
              </div>
            </div>

            {/* Security Notice */}
            <div className="p-3 bg-emerald-50/60 border border-emerald-200 rounded-lg text-xs text-emerald-900 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                Commissions are calculated directly from transaction snapshot rules and credited straight to your operational wallet.
              </span>
            </div>

            {/* Timestamps */}
            <div className="p-4 rounded-lg border border-slate-200 bg-white space-y-2 text-xs text-slate-700">
              <div className="flex justify-between">
                <span className="text-slate-500">Earned Date & Time:</span>
                <span className="font-medium font-mono">{formatDateTime(selectedCommission.createdDate)}</span>
              </div>
              {selectedCommission.creditedDate && (
                <div className="flex justify-between">
                  <span className="text-slate-500">Wallet Credited Date:</span>
                  <span className="font-medium font-mono">{formatDateTime(selectedCommission.creditedDate)}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </Drawer>
    </PageContainer>
  );
}
