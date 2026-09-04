'use client';

import React, { useState, useEffect } from 'react';
import { PageContainer } from '@/components/layout/PageContainer';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';
import { ErrorState } from '@/components/ui/ErrorState';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';
import {
  retailerDashboardService,
  RetailerDashboardSummary,
} from '@/services/retailerDashboardService';

import { RetailerWalletHero } from '@/components/features/retailer/RetailerWalletHero';
import { RetailerQuickActions } from '@/components/features/retailer/RetailerQuickActions';
import { RetailerKPIGrid } from '@/components/features/retailer/RetailerKPIGrid';
import { RetailerAnalyticsSection } from '@/components/features/retailer/RetailerAnalyticsSection';
import { RetailerRecentTransactions } from '@/components/features/retailer/RetailerRecentTransactions';
import { RetailerCommissionSummary } from '@/components/features/retailer/RetailerCommissionSummary';
import { RetailerAttentionPanel } from '@/components/features/retailer/RetailerAttentionPanel';

import { RefreshCw, Calendar, Store, Building2 } from 'lucide-react';

export default function RetailerDashboardPage() {
  const { session } = useAuth();
  const [summary, setSummary] = useState<RetailerDashboardSummary | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<'today' | '7d' | 'month'>('today');

  const retailerId = session?.entityId || 'ret_001';

  const loadDashboard = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await retailerDashboardService.getDashboardSummary(retailerId);
      if (res.success && res.data) {
        setSummary(res.data);
      } else {
        setError(res.error?.message || 'Failed to load retailer dashboard data.');
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'An unexpected error occurred while loading dashboard.';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, [retailerId]);

  if (error) {
    return (
      <PageContainer title="Retailer Dashboard">
        <ErrorState
          title="Unable to load Retailer Command Center"
          description={error}
          onRetry={loadDashboard}
        />
      </PageContainer>
    );
  }

  const getTimeOfDayGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const retailerName = summary?.retailer?.name || session?.name || 'Metro Store #01';
  const retailerCode = summary?.retailer?.code || session?.entityId || 'RET001';
  const businessName = summary?.retailer?.businessName || 'Metro Store Retail Solutions';

  return (
    <PageContainer
      title={`${getTimeOfDayGreeting()}, ${retailerName}`}
      description="Retailer Financial Operations Command Center — Today's wallet activity and transaction performance."
      statusBadge={<StatusBadge status={summary?.retailer?.kycStatus || 'APPROVED'} label={`KYC ${summary?.retailer?.kycStatus || 'APPROVED'}`} />}
    >
      <div className="space-y-6">
        {/* Contextual Header & Quick Filter Bar */}
        <div className="bg-white/90 backdrop-blur-xs border border-[#E5EBF2] rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[var(--primary)] text-white font-extrabold text-xs flex items-center justify-center shadow-xs shrink-0">
              QSP
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base sm:text-lg font-bold text-[var(--text-primary)] leading-tight">
                  {businessName}
                </h2>
                <span className="text-xs font-mono font-bold text-slate-500">({retailerCode})</span>
              </div>
              <p className="text-xs text-[var(--text-muted)] mt-0.5 flex items-center gap-2 flex-wrap">
                <span>Distributor: <strong className="text-slate-700">{summary?.parentDistributor?.name || 'North Zone Distributor'}</strong></span>
                <span>•</span>
                <span>Master: <strong className="text-slate-700">{summary?.parentMasterDistributor?.name || 'Apex Network'}</strong></span>
              </p>
            </div>
          </div>

          {/* Period Selector & Manual Telemetry Refresh */}
          <div className="flex items-center gap-2.5 shrink-0 self-start md:self-auto">
            <div className="flex items-center bg-slate-100 p-1 rounded-[var(--radius-md)] text-xs font-medium border border-slate-200/60">
              <button
                type="button"
                onClick={() => setSelectedPeriod('today')}
                className={`px-3 py-1 rounded-sm transition-all cursor-pointer ${
                  selectedPeriod === 'today' ? 'bg-white text-[var(--primary)] font-bold shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Today
              </button>
              <button
                type="button"
                onClick={() => setSelectedPeriod('7d')}
                className={`px-3 py-1 rounded-sm transition-all cursor-pointer ${
                  selectedPeriod === '7d' ? 'bg-white text-[var(--primary)] font-bold shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                7 Days
              </button>
              <button
                type="button"
                onClick={() => setSelectedPeriod('month')}
                className={`px-3 py-1 rounded-sm transition-all cursor-pointer ${
                  selectedPeriod === 'month' ? 'bg-white text-[var(--primary)] font-bold shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                This Month
              </button>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={loadDashboard}
              isLoading={isLoading}
              title="Refresh telemetry"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-slate-600 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>

        {/* Bento Grid Composition with Mobile Responsive Order Handling */}
        <div className="flex flex-col space-y-6">
          {/* 1. Wallet Hero Surface (Order 1 everywhere) */}
          <div className="order-1">
            {summary && (
              <RetailerWalletHero
                wallet={summary.wallet}
                plan={summary.plan}
                retailerName={summary.retailer.name}
                retailerCode={summary.retailer.code}
                kycStatus={summary.retailer.kycStatus}
                isLoading={isLoading}
              />
            )}
          </div>

          {/* 2. Quick Actions Strip (Order 2 everywhere) */}
          <div className="order-2">
            <RetailerQuickActions />
          </div>

          {/* 3. Action Center / Operational Attention Panel (Order 3 on mobile, Order 6 on desktop) */}
          <div className="order-3 md:order-6">
            {summary && (
              <RetailerAttentionPanel
                attentionItems={summary.attentionItems}
                isLoading={isLoading}
              />
            )}
          </div>

          {/* 4. Today's Operational Performance KPIs (Order 4 on mobile, Order 3 on desktop) */}
          <div className="order-4 md:order-3">
            {summary && (
              <RetailerKPIGrid summary={summary} isLoading={isLoading} />
            )}
          </div>

          {/* 5. 7-Day Analytics & Status Breakdown (Order 7 on mobile, Order 4 on desktop) */}
          <div className="order-7 md:order-4">
            {summary && (
              <RetailerAnalyticsSection
                trendData={summary.trendData}
                transactionSummary={summary.transactionSummary}
                isLoading={isLoading}
              />
            )}
          </div>

          {/* 6. Recent Transactions & Commission Summary (Orders 5 & 6 on mobile, Order 5 on desktop) */}
          <div className="order-5 md:order-5 flex flex-col lg:grid lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8 order-1">
              {summary && (
                <RetailerRecentTransactions
                  transactions={summary.recentTransactions}
                  isLoading={isLoading}
                />
              )}
            </div>

            <div className="lg:col-span-4 order-2 space-y-6">
              {summary && (
                <RetailerCommissionSummary
                  commissionSummary={summary.commissionSummary}
                  planName={summary.plan?.name}
                  isLoading={isLoading}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
