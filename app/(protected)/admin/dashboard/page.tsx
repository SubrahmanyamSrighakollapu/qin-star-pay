'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { PageContainer } from '@/components/layout/PageContainer';
import { dashboardService } from '@/services/dashboardService';
import { hierarchyService } from '@/services/hierarchyService';
import { approvalService, PendingApprovalItem } from '@/services/approvalService';
import { FullDashboardData, DashboardFilters } from '@/types/dashboard';
import { ErrorState } from '@/components/ui/ErrorState';
import { EmptyState } from '@/components/ui/EmptyState';

import { DashboardHeader } from '@/components/features/dashboard/DashboardHeader';
import { DashboardFilterBar } from '@/components/features/dashboard/DashboardFilterBar';
import { DashboardKPIGrid } from '@/components/features/dashboard/DashboardKPIGrid';
import { DashboardCharts } from '@/components/features/dashboard/DashboardCharts';
import { RecentTransactionsTable } from '@/components/features/dashboard/RecentTransactionsTable';
import { ProviderHealthCard } from '@/components/features/dashboard/ProviderHealthCard';
import { BalanceOverviewCard } from '@/components/features/dashboard/BalanceOverviewCard';
import { QuickActionsCard } from '@/components/features/dashboard/QuickActionsCard';
import { OperationalAlertsCard } from '@/components/features/dashboard/OperationalAlertsCard';
import { NetworkHierarchyScaleCard } from '@/components/features/dashboard/NetworkHierarchyScaleCard';
import { AdminApprovalQueueCard } from '@/components/features/dashboard/AdminApprovalQueueCard';
import { PlatformActivityTimelineCard } from '@/components/features/dashboard/PlatformActivityTimelineCard';
import { ApprovalDetailDrawer, RejectionReasonModal } from '@/components/features/admin/network';
import { useToast } from '@/components/ui/Toast';
import { useAuth } from '@/context/AuthContext';
import KYCDashboardPage from '@/app/(protected)/kyc/dashboard/page';
import SalesDashboardPage from '@/app/(protected)/sales/dashboard/page';
import AccountsDashboardPage from '@/app/(protected)/accounts/dashboard/page';
import OperationsDashboardPage from '@/app/(protected)/operations/dashboard/page';

export default function AdminDashboardPage() {
  const { session } = useAuth();
  const { toastSuccess, toastError } = useToast();

  if (session?.role === 'KYC') {
    return <KYCDashboardPage />;
  }
  if (session?.role === 'SALES') {
    return <SalesDashboardPage />;
  }
  if (session?.role === 'ACCOUNTS') {
    return <AccountsDashboardPage />;
  }
  if (session?.role === 'OPERATIONS' || session?.role === 'SUPPORT') {
    return <OperationsDashboardPage />;
  }

  const [data, setData] = useState<FullDashboardData | null>(null);
  const [filters, setFilters] = useState<DashboardFilters>({});
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Real Network counts
  const [mdCount, setMdCount] = useState<number>(0);
  const [distributorCount, setDistributorCount] = useState<number>(0);
  const [retailerCount, setRetailerCount] = useState<number>(0);
  const [activeRetailersCount, setActiveRetailersCount] = useState<number>(0);

  // Approval Workload
  const [approvalItems, setApprovalItems] = useState<PendingApprovalItem[]>([]);

  // Approval Drawer & Rejection Modal State
  const [detailItem, setDetailItem] = useState<PendingApprovalItem | null>(null);
  const [detailDrawerOpen, setDetailDrawerOpen] = useState<boolean>(false);
  const [rejectingItem, setRejectingItem] = useState<PendingApprovalItem | null>(null);
  const [rejectionModalOpen, setRejectionModalOpen] = useState<boolean>(false);

  const loadNetworkAndApprovalData = () => {
    try {
      const mds = hierarchyService.getAllMasterDistributors();
      const dists = hierarchyService.getAllDistributors();
      const rets = hierarchyService.getAllRetailers();

      setMdCount(mds.length);
      setDistributorCount(dists.length);
      setRetailerCount(rets.length);
      setActiveRetailersCount(rets.filter((r) => r.accountStatus === 'ACTIVE').length);

      const items = approvalService.getApprovalItems('PENDING', 'ALL');
      setApprovalItems(items);
    } catch (e) {
      console.error('Failed to fetch hierarchy & approval metrics:', e);
    }
  };

  useEffect(() => {
    loadNetworkAndApprovalData();
  }, []);

  useEffect(() => {
    let isCancelled = false;
    dashboardService
      .getDashboardData(filters)
      .then((response) => {
        if (!isCancelled) {
          if (response.success && response.data) {
            setData(response.data);
            setError(null);
          } else {
            setError('Failed to load dashboard data.');
          }
          setIsLoading(false);
        }
      })
      .catch(() => {
        if (!isCancelled) {
          setError('An error occurred while fetching dashboard data.');
          setIsLoading(false);
        }
      });

    return () => {
      isCancelled = true;
    };
  }, [filters]);

  const handleApplyFilters = (newFilters: DashboardFilters) => {
    setIsLoading(true);
    setFilters(newFilters);
  };

  const handleResetFilters = () => {
    setIsLoading(true);
    setFilters({});
  };

  const handleRefresh = () => {
    setIsLoading(true);
    loadNetworkAndApprovalData();
    setFilters((prev) => ({ ...prev }));
  };

  // Approval Drawer Action Handlers
  const handleReviewItem = (item: PendingApprovalItem) => {
    setDetailItem(item);
    setDetailDrawerOpen(true);
  };

  const handleApprove = async (item: PendingApprovalItem) => {
    if (item.entityType === 'DISTRIBUTOR') {
      const res = await approvalService.approveDistributor(item.id, session?.userId || 'usr_admin_01');
      if (res.success && res.data) {
        toastSuccess(`Distributor "${res.data.code}" approved successfully!`);
        loadNetworkAndApprovalData();
      } else {
        toastError(res.error?.message || 'Failed to approve distributor.');
      }
    } else {
      const res = await approvalService.approveRetailer(item.id, session?.userId || 'usr_admin_01');
      if (res.success && res.data) {
        toastSuccess(`Retailer "${res.data.code}" approved successfully!`);
        loadNetworkAndApprovalData();
      } else {
        toastError(res.error?.message || 'Failed to approve retailer.');
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
      const res = await approvalService.rejectDistributor(
        rejectingItem.id,
        reason,
        session?.userId || 'usr_admin_01'
      );
      if (res.success && res.data) {
        toastSuccess(`Distributor "${res.data.code}" application rejected.`);
        loadNetworkAndApprovalData();
      } else {
        toastError(res.error?.message || 'Failed to reject distributor.');
      }
    } else {
      const res = await approvalService.rejectRetailer(
        rejectingItem.id,
        reason,
        session?.userId || 'usr_admin_01'
      );
      if (res.success && res.data) {
        toastSuccess(`Retailer "${res.data.code}" application rejected.`);
        loadNetworkAndApprovalData();
      } else {
        toastError(res.error?.message || 'Failed to reject retailer.');
      }
    }

    setRejectingItem(null);
  };

  const pendingApprovalsCount = approvalItems.filter((i) => i.approvalStatus === 'PENDING_APPROVAL').length;
  const suspendedCount = 0; // Derived from actual suspended accounts if any

  return (
    <PageContainer fullWidth className="space-y-6 pb-12">
      {/* 1. Platform Command Header */}
      <DashboardHeader
        title="Operations Command Center"
        subtitle="Platform Governance, Financial Operations & Multi-Tenant Network Control"
        lastRefreshedAt={data?.lastRefreshedAt || new Date().toISOString()}
        onRefresh={handleRefresh}
        isLoading={isLoading}
        networkCount={mdCount + distributorCount + retailerCount}
        pendingApprovalsCount={pendingApprovalsCount}
        todayTxnCount={data?.metrics.totalTransactions || 0}
      />

      {/* 2. Filter Bar Container */}
      <DashboardFilterBar
        onApplyFilters={handleApplyFilters}
        onResetFilters={handleResetFilters}
        isLoading={isLoading}
      />

      {/* Error State Fallback */}
      {error ? (
        <ErrorState
          title="Dashboard Data Failed to Load"
          description={error}
          onRetry={handleRefresh}
        />
      ) : !isLoading && data && data.metrics.totalTransactions === 0 ? (
        /* Empty State Fallback */
        <EmptyState
          title="No Transactions Found"
          description="There are no transaction records matching your selected filter criteria."
          action={
            <button
              type="button"
              onClick={handleResetFilters}
              className="px-4 py-2 bg-[var(--primary)] text-white text-xs font-semibold rounded-md hover:bg-[var(--primary-hover)] transition-colors"
            >
              Reset All Filters
            </button>
          }
        />
      ) : (
        /* Operational Dashboard Content */
        <div className="space-y-6">
          {/* 3. Platform Network Hierarchy Scale Visual */}
          <NetworkHierarchyScaleCard
            mdCount={mdCount}
            distributorCount={distributorCount}
            retailerCount={retailerCount}
            activeRetailersCount={activeRetailersCount}
            pendingApprovalsCount={pendingApprovalsCount}
            suspendedCount={suspendedCount}
          />

          {/* 4. Financial KPI Metric Cards (8 KPIs) */}
          {data ? (
            <DashboardKPIGrid metrics={data.metrics} isLoading={isLoading} />
          ) : null}

          {/* 5. Approval Workload Queue & Provider Health Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <AdminApprovalQueueCard
                items={approvalItems}
                onReviewItem={handleReviewItem}
              />
            </div>
            <div>
              {data && <ProviderHealthCard providers={data.providerHealth} />}
            </div>
          </div>

          {/* 6. Analytics Charts Section (5 Charts: Trend, Channels, Status, PayIn vs PayOut) */}
          {data ? (
            <DashboardCharts
              statusDistribution={data.statusDistribution}
              payInVsPayOut={data.payInVsPayOut}
              channelStats={data.channelStats}
              providerStats={data.providerStats}
              trendData={data.trendData}
              isLoading={isLoading}
            />
          ) : null}

          {/* 7. Financial Operations Snapshot & Quick Shortcuts */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data && <BalanceOverviewCard balance={data.balanceOverview} />}
            <QuickActionsCard />
            {data && <OperationalAlertsCard alerts={data.alerts} />}
          </div>

          {/* 8. Recent Platform Transactions Table */}
          <RecentTransactionsTable isLoading={isLoading} />

          {/* 9. Platform Activity & Governance Audit Stream */}
          <PlatformActivityTimelineCard />
        </div>
      )}

      {/* Approval Detail Drawer */}
      <ApprovalDetailDrawer
        item={detailItem}
        isOpen={detailDrawerOpen}
        onClose={() => setDetailDrawerOpen(false)}
        onApprove={handleApprove}
        onReject={handlePromptReject}
      />

      {/* Rejection Reason Modal */}
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

