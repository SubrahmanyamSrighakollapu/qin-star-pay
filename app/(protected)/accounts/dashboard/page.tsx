'use client';

import React from 'react';
import { PageContainer } from '@/components/layout/PageContainer';
import { FinancialMetricCard } from '@/components/features/financial/FinancialMetricCard';
import { Landmark, Wallet, Receipt, DollarSign, ArrowRight, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function AccountsDashboardPage() {
  const systemPools = [
    { name: 'Pay-In Nodal Escrow Account', amount: '₹ 3,42,80,500.00', status: 'Balanced', bank: 'HDFC Bank - 502000123' },
    { name: 'Pay-Out Reserve Buffer Pool', amount: '₹ 1,12,50,000.00', status: 'Optimal Float', bank: 'ICICI Bank - 000405099' },
    { name: 'GST & Statutory Liability Escrow', amount: '₹ 24,18,420.00', status: 'Accrued', bank: 'Axis Bank - 918000441' },
    { name: 'TDS Deduction Master Fund', amount: '₹ 6,12,890.00', status: 'Quarterly Due', bank: 'State Bank of India' },
  ];

  const pendingSettlements = [
    { merchant: 'Apex National Network', batchId: 'SET_20260919_001', amount: '₹ 45,20,000.00', status: 'READY_TO_DISPATCH', date: 'Today 16:30' },
    { merchant: 'North Zone Distributor', batchId: 'SET_20260919_002', amount: '₹ 18,45,000.00', status: 'PENDING_BANK_ACK', date: 'Today 15:00' },
    { merchant: 'Capital Express Point', batchId: 'SET_20260919_003', amount: '₹ 6,10,500.00', status: 'IN_RECONCILIATION', date: 'Today 12:15' },
  ];

  return (
    <PageContainer fullWidth className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white border border-[var(--border)] rounded-[var(--radius-xl)] p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center font-bold border border-violet-200">
              <Landmark className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-[var(--text-primary)] tracking-tight">
                Finance & Accountant Control Desk
              </h1>
              <p className="text-xs text-[var(--text-muted)]">
                System Wallet Pool Governance, Daily Settlement Batches & Tax Reconciliations
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/admin/wallet/ledger"
            className="px-3.5 py-2 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
          >
            Open Financial Ledger →
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <FinancialMetricCard
          label="Total System Escrow Balance"
          value="₹ 4.85 Cr"
          subtext="Reconciled 100%"
          icon={<Wallet className="w-4 h-4 text-violet-600" />}
          variant="payin"
        />
        <FinancialMetricCard
          label="Pending Settlements Batch"
          value="₹ 69.75 L"
          subtext="3 Batches Ready"
          icon={<Landmark className="w-4 h-4 text-blue-600" />}
          variant="primary"
        />
        <FinancialMetricCard
          label="GST Collection (Month)"
          value="₹ 24.18 L"
          subtext="File Due Oct 20"
          icon={<Receipt className="w-4 h-4 text-emerald-600" />}
          variant="success"
        />
        <FinancialMetricCard
          label="TDS Deducted (Q3)"
          value="₹ 6.12 L"
          subtext="Form 26Q Compliant"
          icon={<DollarSign className="w-4 h-4 text-amber-600" />}
          variant="warning"
        />
      </div>

      {/* System Nodal Wallet Pools & Settlement Queue */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Nodal Escrow Pools */}
        <div className="bg-white border border-[var(--border)] rounded-[var(--radius-xl)] p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3">
            <div className="flex items-center gap-2">
              <Landmark className="w-4 h-4 text-violet-600" />
              <h2 className="text-sm font-bold text-slate-900">Nodal Escrow & Reserve Pools</h2>
            </div>
            <Link href="/admin/wallet/balances" className="text-xs text-[var(--primary)] font-bold hover:underline flex items-center gap-0.5">
              View Balances <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {systemPools.map((pool, idx) => (
              <div key={idx} className="p-3 bg-slate-50 border border-slate-200/80 rounded-lg flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="font-bold text-xs text-slate-900">{pool.name}</div>
                  <div className="text-[10px] text-slate-500 font-mono">{pool.bank}</div>
                </div>
                <div className="text-right space-y-0.5">
                  <div className="font-mono font-extrabold text-xs text-slate-900">{pool.amount}</div>
                  <span className="inline-block px-1.5 py-0.5 rounded text-[9px] font-extrabold bg-emerald-100 text-emerald-800 uppercase">
                    {pool.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pending Settlements Batch */}
        <div className="bg-white border border-[var(--border)] rounded-[var(--radius-xl)] p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3">
            <div className="flex items-center gap-2">
              <Receipt className="w-4 h-4 text-blue-600" />
              <h2 className="text-sm font-bold text-slate-900">Settlement Execution Queue</h2>
            </div>
            <Link href="/admin/settlements" className="text-xs text-[var(--primary)] font-bold hover:underline flex items-center gap-0.5">
              Manage Queue <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {pendingSettlements.map((item, idx) => (
              <div key={idx} className="p-3 bg-slate-50/80 border border-slate-200/80 rounded-lg flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="font-bold text-xs text-slate-900">{item.merchant}</div>
                  <div className="text-[10px] text-slate-500 font-mono">{item.batchId} • {item.date}</div>
                </div>
                <div className="text-right space-y-0.5">
                  <div className="font-mono font-extrabold text-xs text-slate-900">{item.amount}</div>
                  <span className="inline-block px-1.5 py-0.5 rounded text-[9px] font-extrabold bg-amber-100 text-amber-800 uppercase">
                    {item.status}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg text-xs text-blue-900 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
            <span>Nodal bank reconciliation is synced. <strong>₹0.00</strong> unreconciled variance.</span>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
