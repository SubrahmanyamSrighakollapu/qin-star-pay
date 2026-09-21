'use client';

import React, { useState, useEffect } from 'react';
import { PageContainer } from '@/components/layout/PageContainer';
import { approvalService, PendingApprovalItem } from '@/services/approvalService';
import { ApprovalDetailDrawer, RejectionReasonModal } from '@/components/features/admin/network';
import { useToast } from '@/components/ui/Toast';
import { useAuth } from '@/context/AuthContext';
import { ShieldCheck, Clock, CheckCircle2, XCircle, FileText, Search, RefreshCw, UserCheck } from 'lucide-react';
import { FinancialMetricCard } from '@/components/features/financial/FinancialMetricCard';

export default function KYCDashboardPage() {
  const { session } = useAuth();
  const { toastSuccess, toastError } = useToast();

  const [approvalItems, setApprovalItems] = useState<PendingApprovalItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'ALL' | 'DISTRIBUTOR' | 'RETAILER'>('ALL');
  const [isLoading, setIsLoading] = useState(false);

  // Drawer and modal states
  const [detailItem, setDetailItem] = useState<PendingApprovalItem | null>(null);
  const [detailDrawerOpen, setDetailDrawerOpen] = useState(false);
  const [rejectingItem, setRejectingItem] = useState<PendingApprovalItem | null>(null);
  const [rejectionModalOpen, setRejectionModalOpen] = useState(false);

  const loadKYCData = () => {
    setIsLoading(true);
    try {
      const items = approvalService.getApprovalItems('PENDING', 'ALL');
      setApprovalItems(items);
    } catch (e) {
      console.error('Failed to load KYC queue:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadKYCData();
  }, []);

  const handleReviewItem = (item: PendingApprovalItem) => {
    setDetailItem(item);
    setDetailDrawerOpen(true);
  };

  const handleApprove = async (item: PendingApprovalItem) => {
    if (item.entityType === 'DISTRIBUTOR') {
      const res = await approvalService.approveDistributor(item.id, session?.userId || 'usr_kyc_01');
      if (res.success && res.data) {
        toastSuccess(`Distributor "${res.data.code}" KYC & onboarding approved!`);
        loadKYCData();
      } else {
        toastError(res.error?.message || 'Failed to approve KYC.');
      }
    } else {
      const res = await approvalService.approveRetailer(item.id, session?.userId || 'usr_kyc_01');
      if (res.success && res.data) {
        toastSuccess(`Retailer "${res.data.code}" KYC & onboarding approved!`);
        loadKYCData();
      } else {
        toastError(res.error?.message || 'Failed to approve KYC.');
      }
    }
  };

  const handlePromptReject = (item: PendingApprovalItem) => {
    setRejectingItem(item);
    setRejectionModalOpen(true);
  };

  const handleConfirmReject = async (reason: string) => {
    if (!rejectingItem) return;

    if (rejectingItem.entityType === 'DISTRIBUTOR') {
      const res = await approvalService.rejectDistributor(rejectingItem.id, reason, session?.userId || 'usr_kyc_01');
      if (res.success && res.data) {
        toastSuccess(`Distributor "${res.data.code}" rejected.`);
        loadKYCData();
      } else {
        toastError(res.error?.message || 'Failed to reject KYC.');
      }
    } else {
      const res = await approvalService.rejectRetailer(rejectingItem.id, reason, session?.userId || 'usr_kyc_01');
      if (res.success && res.data) {
        toastSuccess(`Retailer "${res.data.code}" rejected.`);
        loadKYCData();
      } else {
        toastError(res.error?.message || 'Failed to reject KYC.');
      }
    }
    setRejectingItem(null);
  };

  const filteredItems = approvalItems.filter((item) => {
    const matchesType = filterType === 'ALL' || item.entityType === filterType;
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.mobile.includes(searchTerm);
    return matchesType && matchesSearch;
  });

  const pendingCount = approvalItems.length;

  return (
    <PageContainer fullWidth className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white border border-[var(--border)] rounded-[var(--radius-xl)] p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold border border-amber-200">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-[var(--text-primary)] tracking-tight">
                KYC & Onboarding Approval Workspace
              </h1>
              <p className="text-xs text-[var(--text-muted)]">
                Document Verification Desk, Identity SLA Audits & Network Approvals Queue
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={loadKYCData}
            className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh Queue
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <FinancialMetricCard
          label="Pending Verification Queue"
          value={pendingCount}
          subtext="+3 new today"
          icon={<Clock className="w-4 h-4 text-amber-600" />}
          variant="warning"
        />
        <FinancialMetricCard
          label="Approved (This Month)"
          value="148"
          subtext="98.2% Approval Rate"
          icon={<CheckCircle2 className="w-4 h-4 text-emerald-600" />}
          variant="success"
        />
        <FinancialMetricCard
          label="Rejected / Clarification"
          value="6"
          subtext="1.8% Rejection Rate"
          icon={<XCircle className="w-4 h-4 text-rose-600" />}
          variant="danger"
        />
        <FinancialMetricCard
          label="Avg Verification SLA"
          value="14 mins"
          subtext="SLA Limit: 24 Hours"
          icon={<UserCheck className="w-4 h-4 text-blue-600" />}
          variant="primary"
        />
      </div>

      {/* Main Worktable Card */}
      <div className="bg-white border border-[var(--border)] rounded-[var(--radius-xl)] p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-[var(--border-subtle)] pb-4">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-[var(--primary)]" />
            <h2 className="text-sm font-bold text-[var(--text-primary)]">
              Verification Desk ({filteredItems.length})
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search name, code, email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:border-[var(--primary)] focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg text-xs font-semibold text-slate-600">
              <button
                type="button"
                onClick={() => setFilterType('ALL')}
                className={`px-2.5 py-1 rounded-md cursor-pointer transition-colors ${filterType === 'ALL' ? 'bg-white text-slate-900 shadow-xs' : 'hover:text-slate-900'}`}
              >
                All ({approvalItems.length})
              </button>
              <button
                type="button"
                onClick={() => setFilterType('DISTRIBUTOR')}
                className={`px-2.5 py-1 rounded-md cursor-pointer transition-colors ${filterType === 'DISTRIBUTOR' ? 'bg-white text-slate-900 shadow-xs' : 'hover:text-slate-900'}`}
              >
                Distributors
              </button>
              <button
                type="button"
                onClick={() => setFilterType('RETAILER')}
                className={`px-2.5 py-1 rounded-md cursor-pointer transition-colors ${filterType === 'RETAILER' ? 'bg-white text-slate-900 shadow-xs' : 'hover:text-slate-900'}`}
              >
                Retailers
              </button>
            </div>
          </div>
        </div>

        {/* Verification Items Table */}
        {filteredItems.length === 0 ? (
          <div className="p-12 text-center space-y-2">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
            <h3 className="text-sm font-bold text-slate-800">KYC Verification Queue Clear</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              All pending partner onboarding applications have been verified. New submissions will appear here automatically.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                <tr>
                  <th className="p-3">Partner Entity</th>
                  <th className="p-3">Type</th>
                  <th className="p-3">Contact Details</th>
                  <th className="p-3">Parent Network</th>
                  <th className="p-3">Submitted At</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-blue-50/40 transition-colors">
                    <td className="p-3">
                      <div className="font-bold text-slate-900">{item.name}</div>
                      <div className="text-[10px] text-slate-500 font-mono">{item.code}</div>
                    </td>
                    <td className="p-3">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                          item.entityType === 'DISTRIBUTOR'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-teal-100 text-teal-800'
                        }`}
                      >
                        {item.entityType}
                      </span>
                    </td>
                    <td className="p-3 space-y-0.5">
                      <div className="text-slate-700">{item.email}</div>
                      <div className="text-slate-400 font-mono text-[11px]">+91 {item.mobile}</div>
                    </td>
                    <td className="p-3 text-slate-600 font-medium">
                      {item.parentDistributorName || item.parentMasterDistributorName || 'Direct Admin'}
                    </td>
                    <td className="p-3 text-slate-500 font-mono text-[11px]">
                      {new Date(item.createdAt).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    <td className="p-3 text-right">
                      <button
                        type="button"
                        onClick={() => handleReviewItem(item)}
                        className="px-3 py-1.5 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white text-xs font-bold rounded-md transition-colors cursor-pointer"
                      >
                        Review Documents & Verification
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Approval Drawer & Rejection Reason Modal */}
      <ApprovalDetailDrawer
        item={detailItem}
        isOpen={detailDrawerOpen}
        onClose={() => setDetailDrawerOpen(false)}
        onApprove={handleApprove}
        onReject={handlePromptReject}
      />

      {rejectingItem && (
        <RejectionReasonModal
          isOpen={rejectionModalOpen}
          onClose={() => setRejectionModalOpen(false)}
          onConfirm={handleConfirmReject}
          entityName={rejectingItem.name}
          entityCode={rejectingItem.code}
          entityType={rejectingItem.entityType}
        />
      )}
    </PageContainer>
  );
}
