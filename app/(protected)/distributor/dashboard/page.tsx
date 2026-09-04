'use client';

import React, { useState, useEffect } from 'react';
import { PageContainer } from '@/components/layout/PageContainer';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';
import { ErrorState } from '@/components/ui/ErrorState';
import { useAuth } from '@/context/AuthContext';
import {
  distributorDashboardService,
  DistributorDashboardSummary,
} from '@/services/distributorDashboardService';
import { DistributorKPIGrid } from '@/components/features/distributor/DistributorKPIGrid';
import { DistributorNetworkOverview } from '@/components/features/distributor/DistributorNetworkOverview';
import { DistributorTopRetailers } from '@/components/features/distributor/DistributorTopRetailers';
import { DistributorRecentTransactions } from '@/components/features/distributor/DistributorRecentTransactions';
import { DistributorAttentionCard } from '@/components/features/distributor/DistributorAttentionCard';
import { Store, Building2, ShieldCheck } from 'lucide-react';

export default function DistributorDashboardPage() {
  const { session } = useAuth();
  const [summary, setSummary] = useState<DistributorDashboardSummary | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const distributorId = session?.entityId || 'dst_001';

  useEffect(() => {
    let isMounted = true;
    async function loadDashboard() {
      setIsLoading(true);
      setError(null);

      try {
        const res = await distributorDashboardService.getDashboardSummary(distributorId);
        if (isMounted) {
          if (res.success && res.data) {
            setSummary(res.data);
          } else {
            setError(res.error?.message || 'Failed to load distributor dashboard metrics.');
          }
        }
      } catch (err: unknown) {
        if (isMounted) {
          const message = err instanceof Error ? err.message : 'An unexpected error occurred while loading dashboard.';
          setError(message);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadDashboard();

    return () => {
      isMounted = false;
    };
  }, [distributorId]);

  if (error) {
    return (
      <PageContainer title="Distributor Dashboard">
        <ErrorState
          title="Unable to load Distributor Dashboard"
          description={error}
          onRetry={() => window.location.reload()}
        />
      </PageContainer>
    );
  }

  const distName = summary?.distributor?.name || session?.name || 'North Zone Distributor';
  const distCode = summary?.distributor?.code || session?.entityId || 'DST001';
  const businessName = summary?.distributor?.businessName || 'North Zone Distribution Enterprises';
  const parentMdName = summary?.parentMasterDistributor?.name || 'Apex National Network';
  const parentMdCode = summary?.parentMasterDistributor?.code || 'MD001';

  return (
    <PageContainer
      title="Distributor Dashboard"
      description="Monitor your retailer network, transactions, wallet and commission performance."
      statusBadge={<StatusBadge status="ACTIVE" label="Distributor Workspace" />}
    >
      <div className="space-y-6">
        {/* Contextual Header Bar */}
        <div className="bg-white border border-[var(--border)] rounded-[var(--radius-xl)] p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-blue-600 text-white font-extrabold text-sm flex items-center justify-center shadow-xs shrink-0">
              DST
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg font-bold text-[var(--text-primary)]">
                  Welcome back, {distName}
                </h2>
                <StatusBadge status="ACTIVE" size="sm" />
              </div>
              <p className="text-xs text-[var(--text-muted)] mt-0.5 flex items-center gap-2 flex-wrap font-mono">
                <span>Code: <strong className="text-slate-700">{distCode}</strong></span>
                <span>•</span>
                <span>{businessName}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-700">
            <Building2 className="w-4 h-4 text-blue-600 shrink-0" />
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block leading-none mb-0.5">
                Parent Master Distributor
              </span>
              <span className="font-semibold text-slate-900">
                {parentMdName} <span className="font-mono text-blue-600 font-bold">({parentMdCode})</span>
              </span>
            </div>
          </div>
        </div>

        {/* 1. Primary Network & Financial KPIs */}
        {isLoading || !summary ? (
          <LoadingSkeleton variant="card" count={6} />
        ) : (
          <DistributorKPIGrid summary={summary} isLoading={isLoading} />
        )}

        {/* 2. 7-Day Trend Charts */}
        {summary && (
          <DistributorNetworkOverview trendData={summary.trendData} isLoading={isLoading} />
        )}

        {/* 3. Top Performing Retailers & Recent Transactions */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-1">
            {summary && (
              <DistributorTopRetailers topRetailers={summary.topRetailers} isLoading={isLoading} />
            )}
          </div>
          <div className="xl:col-span-2">
            {summary && (
              <DistributorRecentTransactions transactions={summary.recentTransactions} isLoading={isLoading} />
            )}
          </div>
        </div>

        {/* 4. Requires Attention & Recent Activity */}
        {summary && (
          <DistributorAttentionCard
            attentionItems={summary.attentionItems}
            recentActivity={summary.recentActivity}
            isLoading={isLoading}
          />
        )}
      </div>
    </PageContainer>
  );
}
