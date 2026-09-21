'use client';

import React from 'react';
import { PageContainer } from '@/components/layout/PageContainer';
import { FinancialMetricCard } from '@/components/features/financial/FinancialMetricCard';
import { Activity, Plug, RotateCcw, CheckCircle2, ArrowRight, ShieldAlert, Cpu } from 'lucide-react';
import Link from 'next/link';

export default function OperationsDashboardPage() {
  const providersHealth = [
    { name: 'ICICI PayIn Gateway', successRate: '99.4%', latency: '180ms', status: 'HEALTHY', activeTxns: '1,420 / min' },
    { name: 'HDFC Payout Direct Routing', successRate: '98.9%', latency: '210ms', status: 'HEALTHY', activeTxns: '840 / min' },
    { name: 'Cashfree Backup Router', successRate: '99.8%', latency: '145ms', status: 'HEALTHY', activeTxns: 'Standby' },
    { name: 'NSDL AEPS & DMT Switch', successRate: '97.6%', latency: '320ms', status: 'DEGRADED', activeTxns: '410 / min' },
  ];

  const supportTickets = [
    { ticketId: 'TKT_99201', issue: 'Customer Double Debit Query', merchant: 'Star Mart #03', status: 'OPEN', priority: 'HIGH', date: '10 mins ago' },
    { ticketId: 'TKT_99184', issue: 'Bank Nodal Callback Delay', merchant: 'North Zone Distributor', status: 'IN_PROGRESS', priority: 'MEDIUM', date: '35 mins ago' },
    { ticketId: 'TKT_99150', issue: 'Chargeback Dispute Verification', merchant: 'Apex National Network', status: 'PENDING_DOCUMENT', priority: 'HIGH', date: '2 hours ago' },
  ];

  return (
    <PageContainer fullWidth className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white border border-[var(--border)] rounded-[var(--radius-xl)] p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center font-bold border border-sky-200">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-[var(--text-primary)] tracking-tight">
                Operations & Support Operations Center
              </h1>
              <p className="text-xs text-[var(--text-muted)]">
                Live Transaction Routing, Gateway SLA Health & Support Tickets Resolution Queue
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/admin/chargebacks"
            className="px-3.5 py-2 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
          >
            Disputes Queue →
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <FinancialMetricCard
          label="Live System Success Rate"
          value="99.2%"
          subtext="32 TPS Current Rate"
          icon={<CheckCircle2 className="w-4 h-4 text-emerald-600" />}
          variant="success"
        />
        <FinancialMetricCard
          label="Active Support Tickets"
          value="5"
          subtext="2 High Priority"
          icon={<ShieldAlert className="w-4 h-4 text-amber-600" />}
          variant="warning"
        />
        <FinancialMetricCard
          label="Gateway Provider SLA Health"
          value="98.9%"
          subtext="3 Healthy, 1 Degraded"
          icon={<Plug className="w-4 h-4 text-sky-600" />}
          variant="primary"
        />
        <FinancialMetricCard
          label="Active Chargebacks / Disputes"
          value="2"
          subtext="Within 7-day SLA"
          icon={<RotateCcw className="w-4 h-4 text-rose-600" />}
          variant="danger"
        />
      </div>

      {/* Gateway Health & Support Queue */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gateway Provider Health */}
        <div className="bg-white border border-[var(--border)] rounded-[var(--radius-xl)] p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3">
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-sky-600" />
              <h2 className="text-sm font-bold text-slate-900">Payment Gateway SLA Health Switch</h2>
            </div>
            <Link href="/admin/integrations/providers" className="text-xs text-[var(--primary)] font-bold hover:underline flex items-center gap-0.5">
              Provider Master <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {providersHealth.map((prov, idx) => (
              <div key={idx} className="p-3 bg-slate-50 border border-slate-200/80 rounded-lg flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="font-bold text-xs text-slate-900">{prov.name}</div>
                  <div className="text-[10px] text-slate-500 font-mono">Latency: {prov.latency} • {prov.activeTxns}</div>
                </div>
                <div className="text-right space-y-0.5">
                  <div className="font-mono font-extrabold text-xs text-slate-900">{prov.successRate}</div>
                  <span
                    className={`inline-block px-1.5 py-0.5 rounded text-[9px] font-extrabold uppercase ${
                      prov.status === 'HEALTHY'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {prov.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Support Tickets Queue */}
        <div className="bg-white border border-[var(--border)] rounded-[var(--radius-xl)] p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3">
            <div className="flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-amber-600" />
              <h2 className="text-sm font-bold text-slate-900">Support Escalations & Dispute Queue</h2>
            </div>
            <Link href="/admin/chargebacks" className="text-xs text-[var(--primary)] font-bold hover:underline flex items-center gap-0.5">
              Full Queue <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {supportTickets.map((tkt, idx) => (
              <div key={idx} className="p-3 bg-slate-50/80 border border-slate-200/80 rounded-lg flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="font-bold text-xs text-slate-900">{tkt.issue}</div>
                  <div className="text-[10px] text-slate-500 font-mono">{tkt.ticketId} • {tkt.merchant} ({tkt.date})</div>
                </div>
                <div className="text-right space-y-0.5">
                  <span className="inline-block px-1.5 py-0.5 rounded text-[9px] font-extrabold bg-rose-100 text-rose-800 uppercase">
                    {tkt.priority}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 bg-sky-50 border border-sky-100 rounded-lg text-xs text-sky-900 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0" />
            <span>Support Resolution SLA is on target. <strong>100%</strong> ticket response within 1 hour.</span>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
