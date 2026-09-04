'use client';

import React, { useState, useEffect } from 'react';
import { PageContainer } from '@/components/layout/PageContainer';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';
import { ErrorState } from '@/components/ui/ErrorState';
import { Card } from '@/components/ui/Card';
import { useAuth } from '@/context/AuthContext';
import {
  retailerDashboardService,
  RetailerDashboardSummary,
} from '@/services/retailerDashboardService';
import { RetailerQuickActions } from '@/components/features/retailer/RetailerQuickActions';
import { RetailerKPIGrid } from '@/components/features/retailer/RetailerKPIGrid';
import { RetailerPlanSummaryCard } from '@/components/features/retailer/RetailerPlanSummaryCard';
import { RetailerRecentTransactions } from '@/components/features/retailer/RetailerRecentTransactions';
import { Store, Building2, ShieldCheck, AlertTriangle, Info, Calendar, Phone, Mail, User } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';

export default function RetailerDashboardPage() {
  const { session } = useAuth();
  const [summary, setSummary] = useState<RetailerDashboardSummary | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const retailerId = session?.entityId || 'ret_001';

  useEffect(() => {
    let isMounted = true;
    async function loadDashboard() {
      setIsLoading(true);
      setError(null);

      try {
        const res = await retailerDashboardService.getDashboardSummary(retailerId);
        if (isMounted) {
          if (res.success && res.data) {
            setSummary(res.data);
          } else {
            setError(res.error?.message || 'Failed to load retailer counter metrics.');
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
  }, [retailerId]);

  if (error) {
    return (
      <PageContainer title="Retailer Dashboard">
        <ErrorState
          title="Unable to load Retailer Dashboard"
          description={error}
          onRetry={() => window.location.reload()}
        />
      </PageContainer>
    );
  }

  const retailerName = summary?.retailer?.name || session?.name || 'Metro Store #01';
  const retailerCode = summary?.retailer?.code || session?.entityId || 'RET001';
  const businessName = summary?.retailer?.businessName || 'Metro Store Retail Solutions';
  const parentDstName = summary?.parentDistributor?.name || 'North Zone Distributor';
  const parentDstCode = summary?.parentDistributor?.code || 'DST001';
  const parentMdName = summary?.parentMasterDistributor?.name || 'Apex National Network';

  return (
    <PageContainer
      title="Retailer Counter Workspace"
      description="Manage transactions, monitor operating wallet balance, and track earned commissions."
      statusBadge={<StatusBadge status="ACTIVE" label="Approved Retailer" />}
    >
      <div className="space-y-6">
        {/* Contextual Header Bar */}
        <div className="bg-white border border-[var(--border)] rounded-[var(--radius-xl)] p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-amber-500 text-white font-extrabold text-sm flex items-center justify-center shadow-xs shrink-0">
              RET
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg font-bold text-[var(--text-primary)]">
                  Welcome, {retailerName}
                </h2>
                <StatusBadge status={summary?.retailer?.kycStatus || 'APPROVED'} label={`KYC ${summary?.retailer?.kycStatus || 'APPROVED'}`} size="sm" />
              </div>
              <p className="text-xs text-[var(--text-muted)] mt-0.5 flex items-center gap-2 flex-wrap font-mono">
                <span>Code: <strong className="text-slate-700">{retailerCode}</strong></span>
                <span>•</span>
                <span>{businessName}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-700">
            <Building2 className="w-4 h-4 text-blue-600 shrink-0" />
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block leading-none mb-0.5">
                Assigned Distributor Network
              </span>
              <span className="font-semibold text-slate-900">
                {parentDstName} <span className="font-mono text-blue-600 font-bold">({parentDstCode})</span>
              </span>
            </div>
          </div>
        </div>

        {/* 1. Primary Operational Quick Actions */}
        <RetailerQuickActions />

        {/* 2. Primary & Secondary Financial KPIs */}
        {isLoading || !summary ? (
          <LoadingSkeleton variant="card" count={4} />
        ) : (
          <RetailerKPIGrid summary={summary} isLoading={isLoading} />
        )}

        {/* 3. 7-Day Transaction Activity Trend Chart */}
        {summary && (
          <Card
            title="7-Day Transaction Activity"
            subtitle="Daily Pay-In collections vs Pay-Out disbursements volume"
          >
            <div className="h-64 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={summary.trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} tickFormatter={(val) => `₹${val >= 1000 ? `${(val/1000).toFixed(0)}k` : val}`} />
                  <Tooltip
                    formatter={(val: any) => [val != null ? `₹${Number(val).toLocaleString('en-IN')}` : '', '']}
                    contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                  />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                  <Bar dataKey="payInVolume" name="Pay-In Collection (₹)" fill="#10b981" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="payOutVolume" name="Pay-Out Disbursement (₹)" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        )}

        {/* 4. Recent Transactions & Plan Summary */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2">
            {summary && (
              <RetailerRecentTransactions transactions={summary.recentTransactions} isLoading={isLoading} />
            )}
          </div>

          <div className="xl:col-span-1 space-y-6">
            {summary && (
              <RetailerPlanSummaryCard plan={summary.plan} isLoading={isLoading} />
            )}

            {/* Account Profile Card */}
            {summary && (
              <Card
                title={
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-blue-600" />
                    <span>Outlet Identity</span>
                  </div>
                }
                subtitle="Registered credentials & contact profile"
              >
                <div className="space-y-3 text-xs pt-1">
                  <div className="flex items-center justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">Retailer ID:</span>
                    <span className="font-mono font-bold text-slate-900">{summary.retailer.id}</span>
                  </div>
                  <div className="flex items-center justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">Mobile Number:</span>
                    <span className="font-mono font-semibold text-slate-800 flex items-center gap-1">
                      <Phone className="w-3 h-3 text-slate-400" /> {summary.retailer.mobile}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">Email Address:</span>
                    <span className="font-mono text-slate-800 flex items-center gap-1">
                      <Mail className="w-3 h-3 text-slate-400" /> {summary.retailer.email}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">Master Distributor:</span>
                    <span className="font-semibold text-slate-800">{parentMdName}</span>
                  </div>
                  <div className="flex items-center justify-between py-1">
                    <span className="text-slate-500">KYC Status:</span>
                    <StatusBadge status={summary.retailer.kycStatus || 'APPROVED'} size="sm" />
                  </div>
                </div>
              </Card>
            )}

            {/* Attention Items Feed */}
            {summary && summary.attentionItems.length > 0 && (
              <div className="space-y-3">
                {summary.attentionItems.map((item) => (
                  <div
                    key={item.id}
                    className={`p-4 rounded-xl border text-xs space-y-1 ${
                      item.type === 'WARNING'
                        ? 'bg-amber-50/80 border-amber-200 text-amber-900'
                        : item.type === 'SUCCESS'
                        ? 'bg-emerald-50/80 border-emerald-200 text-emerald-900'
                        : 'bg-blue-50/80 border-blue-200 text-blue-900'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 font-bold">
                      <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>{item.title}</span>
                    </div>
                    <p className="text-slate-700 leading-relaxed">{item.description}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
