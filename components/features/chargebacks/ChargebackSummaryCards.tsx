'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { ChargebackSummary } from '@/types/domain';
import { formatCurrency } from '@/utils/formatters';

export interface ChargebackSummaryCardsProps {
  summary: ChargebackSummary;
}

export const ChargebackSummaryCards: React.FC<ChargebackSummaryCardsProps> = ({ summary }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4">
      {/* 1. Open Cases */}
      <Card className="p-4 bg-white border border-slate-200">
        <span className="text-xs font-semibold text-slate-500">Open Cases</span>
        <div className="mt-1 font-mono font-extrabold text-base text-[var(--primary)]">
          {summary.openCases} Cases
        </div>
        <span className="text-[11px] text-slate-400 block mt-0.5">Active representments</span>
      </Card>

      {/* 2. Under Review */}
      <Card className="p-4 bg-white border border-slate-200">
        <span className="text-xs font-semibold text-slate-500">Under Review</span>
        <div className="mt-1 font-mono font-extrabold text-base text-amber-700">
          {summary.underReview} Cases
        </div>
        <span className="text-[11px] text-amber-600 block mt-0.5">Risk team evaluation</span>
      </Card>

      {/* 3. Evidence Required */}
      <Card className="p-4 bg-white border border-slate-200">
        <span className="text-xs font-semibold text-slate-500">Evidence Required</span>
        <div className="mt-1 font-mono font-extrabold text-base text-purple-900">
          {summary.evidenceRequired} Cases
        </div>
        <span className="text-[11px] text-purple-600 block mt-0.5">Awaiting merchant POD</span>
      </Card>

      {/* 4. Response Due Soon */}
      <Card className="p-4 bg-white border border-slate-200">
        <span className="text-xs font-semibold text-slate-500">Response Due Soon</span>
        <div className="mt-1 font-mono font-extrabold text-base text-rose-700">
          {summary.responseDueSoon} Cases
        </div>
        <span className="text-[11px] text-rose-600 block mt-0.5">Deadline approaching</span>
      </Card>

      {/* 5. Won Cases */}
      <Card className="p-4 bg-white border border-slate-200">
        <span className="text-xs font-semibold text-slate-500">Won Cases</span>
        <div className="mt-1 font-mono font-extrabold text-base text-emerald-700">
          {summary.wonCases} Won
        </div>
        <span className="text-[11px] text-emerald-600 block mt-0.5">Representment accepted</span>
      </Card>

      {/* 6. Lost Cases */}
      <Card className="p-4 bg-white border border-slate-200">
        <span className="text-xs font-semibold text-slate-500">Lost Cases</span>
        <div className="mt-1 font-mono font-extrabold text-base text-rose-800">
          {summary.lostCases} Lost
        </div>
        <span className="text-[11px] text-rose-600 block mt-0.5">Booked financial loss</span>
      </Card>

      {/* 7. Total Disputed Amount */}
      <Card className="p-4 bg-white border border-slate-200">
        <span className="text-xs font-semibold text-slate-500">Total Disputed Volume</span>
        <div className="mt-1 font-mono font-extrabold text-base text-slate-900">
          {formatCurrency(summary.totalDisputedAmount)}
        </div>
        <span className="text-[11px] font-semibold text-emerald-700 block mt-0.5">Win Rate: {summary.winRate}%</span>
      </Card>
    </div>
  );
};
