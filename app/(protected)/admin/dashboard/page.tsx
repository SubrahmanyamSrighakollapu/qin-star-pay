'use client';

import React, { useState, useEffect } from 'react';
import { PageContainer } from '@/components/layout/PageContainer';
import { dashboardService } from '@/services/dashboardService';
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

export default function AdminDashboardPage() {
  const [data, setData] = useState<FullDashboardData | null>(null);
  const [filters, setFilters] = useState<DashboardFilters>({});
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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
    setFilters((prev) => ({ ...prev }));
  };

  return (
    <PageContainer fullWidth className="space-y-6">
      {/* 1. Header Section */}
      <DashboardHeader
        lastRefreshedAt={data?.lastRefreshedAt || new Date().toISOString()}
        onRefresh={handleRefresh}
        isLoading={isLoading}
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
          {/* 3. 8 Financial KPI Metric Cards */}
          {data ? (
            <DashboardKPIGrid metrics={data.metrics} isLoading={isLoading} />
          ) : null}

          {/* 4. Analytics Charts Section (5 Charts) */}
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

          {/* 5. Live Operations Row: Recent Transactions Table & Provider Health */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <RecentTransactionsTable isLoading={isLoading} />
            </div>
            <div>
              {data && <ProviderHealthCard providers={data.providerHealth} />}
            </div>
          </div>

          {/* 6. Balances, Shortcuts & Alerts Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data && <BalanceOverviewCard balance={data.balanceOverview} />}
            <QuickActionsCard />
            {data && <OperationalAlertsCard alerts={data.alerts} />}
          </div>
        </div>
      )}
    </PageContainer>
  );
}
