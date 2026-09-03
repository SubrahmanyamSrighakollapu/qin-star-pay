'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { InvoiceSummary } from '@/types/domain';
import { formatCurrency } from '@/utils/formatters';

export interface InvoiceSummaryCardsProps {
  summary: InvoiceSummary;
}

export const InvoiceSummaryCards: React.FC<InvoiceSummaryCardsProps> = ({ summary }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {/* 1. Total Invoiced */}
      <Card className="p-4 bg-white border border-slate-200">
        <span className="text-xs font-semibold text-slate-500">Total Net Invoiced</span>
        <div className="mt-1 font-mono font-extrabold text-base text-[var(--primary)]">
          {formatCurrency(summary.totalInvoiced)}
        </div>
        <span className="text-[11px] text-slate-400 block mt-0.5">{summary.totalInvoices} Invoices Total</span>
      </Card>

      {/* 2. Outstanding Amount */}
      <Card className="p-4 bg-white border border-slate-200">
        <span className="text-xs font-semibold text-slate-500">Outstanding Amount</span>
        <div className="mt-1 font-mono font-extrabold text-base text-rose-700">
          {formatCurrency(summary.outstandingAmount)}
        </div>
        <span className="text-[11px] text-rose-600 block mt-0.5">Pending collection</span>
      </Card>

      {/* 3. Paid Amount */}
      <Card className="p-4 bg-white border border-slate-200">
        <span className="text-xs font-semibold text-slate-500">Total Collected</span>
        <div className="mt-1 font-mono font-extrabold text-base text-emerald-700">
          {formatCurrency(summary.paidAmount)}
        </div>
        <span className="text-[11px] text-emerald-600 block mt-0.5">Cleared payments</span>
      </Card>

      {/* 4. GST Collected */}
      <Card className="p-4 bg-white border border-slate-200">
        <span className="text-xs font-semibold text-slate-500">GST Collected (@18%)</span>
        <div className="mt-1 font-mono font-extrabold text-base text-purple-900">
          {formatCurrency(summary.gstCollected)}
        </div>
        <span className="text-[11px] text-purple-600 block mt-0.5">Tax liability</span>
      </Card>

      {/* 5. TDS Deducted */}
      <Card className="p-4 bg-white border border-slate-200">
        <span className="text-xs font-semibold text-slate-500">TDS Deducted (@10%)</span>
        <div className="mt-1 font-mono font-extrabold text-base text-amber-700">
          {formatCurrency(summary.tdsDeducted)}
        </div>
        <span className="text-[11px] text-amber-600 block mt-0.5">Tax credit at source</span>
      </Card>

      {/* 6. Overdue Count */}
      <Card className="p-4 bg-white border border-slate-200">
        <span className="text-xs font-semibold text-slate-500">Overdue Invoices</span>
        <div className="mt-1 font-mono font-extrabold text-base text-rose-800">
          {summary.overdueCount} Overdue
        </div>
        <span className="text-[11px] text-rose-600 block mt-0.5">Requires follow-up</span>
      </Card>
    </div>
  );
};
