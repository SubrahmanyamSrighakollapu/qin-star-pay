'use client';

import React from 'react';
import { PageContainer } from '@/components/layout/PageContainer';
import { FinancialMetricCard } from '@/components/features/financial/FinancialMetricCard';
import { TrendingUp, Users, Store, Award, ArrowUpRight, CheckCircle, ChevronRight, BarChart3, Target } from 'lucide-react';
import Link from 'next/link';

export default function SalesDashboardPage() {
  const topPerformers = [
    { name: 'Apex National Network', type: 'Master Distributor', leads: 48, activeMerchants: 41, textVolume: '₹4.2 Cr' },
    { name: 'North Zone Distributors', type: 'Distributor', leads: 32, activeMerchants: 29, textVolume: '₹2.8 Cr' },
    { name: 'Capital Financial Services', type: 'Distributor', leads: 27, activeMerchants: 24, textVolume: '₹2.1 Cr' },
    { name: 'Metro Store Network', type: 'Merchant Group', leads: 19, activeMerchants: 18, textVolume: '₹1.6 Cr' },
  ];

  const acquisitionFunnel = [
    { stage: 'Prospects & New Inquiries', count: 124, percentage: '100%', color: 'bg-blue-500' },
    { stage: 'Documentation Submitted', count: 86, percentage: '69%', color: 'bg-indigo-500' },
    { stage: 'KYC & Compliance Verification', count: 62, percentage: '50%', color: 'bg-amber-500' },
    { stage: 'Account Activated & Transacting', count: 54, percentage: '43.5%', color: 'bg-emerald-500' },
  ];

  return (
    <PageContainer fullWidth className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white border border-[var(--border)] rounded-[var(--radius-xl)] p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold border border-emerald-200">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-[var(--text-primary)] tracking-tight">
                Sales Lead & Network Acquisition Workspace
              </h1>
              <p className="text-xs text-[var(--text-muted)]">
                Merchant Conversion Funnel, Network Growth Analytics & Partner Performance
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/admin/network/approvals"
            className="px-3.5 py-2 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
          >
            Review Network Approvals →
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <FinancialMetricCard
          label="Active Transacting Merchants"
          value="184"
          subtext="+14% vs last month"
          icon={<Store className="w-4 h-4 text-emerald-600" />}
          variant="success"
        />
        <FinancialMetricCard
          label="New Onboardings (This Month)"
          value="38"
          subtext="Target: 45 Accounts"
          icon={<Users className="w-4 h-4 text-blue-600" />}
          variant="primary"
        />
        <FinancialMetricCard
          label="Conversion SLA Success"
          value="68.4%"
          subtext="+4.2% Funnel Efficiency"
          icon={<Target className="w-4 h-4 text-indigo-600" />}
          variant="payin"
        />
        <FinancialMetricCard
          label="Network Volume Growth"
          value="₹18.4 Cr"
          subtext="+22.8% MoM Growth"
          icon={<BarChart3 className="w-4 h-4 text-purple-600" />}
          variant="payout"
        />
      </div>

      {/* Sales Acquisition Funnel & Regional Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Onboarding Funnel */}
        <div className="bg-white border border-[var(--border)] rounded-[var(--radius-xl)] p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-emerald-600" />
              <h2 className="text-sm font-bold text-slate-900">Merchant Onboarding Conversion Funnel</h2>
            </div>
            <span className="text-[11px] text-slate-500 font-semibold">Monthly Snapshot</span>
          </div>

          <div className="space-y-3 pt-1">
            {acquisitionFunnel.map((item, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-700">{item.stage}</span>
                  <span className="font-bold text-slate-900">
                    {item.count} <span className="text-[10px] text-slate-400">({item.percentage})</span>
                  </span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className={`h-full ${item.color} rounded-full transition-all duration-300`} style={{ width: item.percentage }} />
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-lg text-xs text-emerald-900 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Onboarding conversion velocity is operating <strong>18% faster</strong> than previous quarter SLA limits.</span>
          </div>
        </div>

        {/* Top Regional Growth Partners */}
        <div className="bg-white border border-[var(--border)] rounded-[var(--radius-xl)] p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-blue-600" />
              <h2 className="text-sm font-bold text-slate-900">Top Growth Network Partners</h2>
            </div>
            <Link href="/admin/users/distributors" className="text-xs text-[var(--primary)] font-bold hover:underline flex items-center gap-0.5">
              View All <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-2.5">
            {topPerformers.map((partner, idx) => (
              <div key={idx} className="p-3 bg-slate-50/80 hover:bg-blue-50/40 border border-slate-200/80 rounded-lg flex items-center justify-between transition-colors">
                <div className="space-y-0.5">
                  <div className="font-bold text-xs text-slate-900">{partner.name}</div>
                  <div className="text-[10px] text-slate-500 font-semibold">{partner.type} • {partner.activeMerchants} Active Merchants</div>
                </div>
                <div className="text-right space-y-0.5">
                  <div className="font-mono font-extrabold text-xs text-slate-900">{partner.textVolume}</div>
                  <div className="text-[10px] font-bold text-emerald-600 flex items-center justify-end gap-0.5">
                    <ArrowUpRight className="w-3 h-3" /> {partner.leads} Leads
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
