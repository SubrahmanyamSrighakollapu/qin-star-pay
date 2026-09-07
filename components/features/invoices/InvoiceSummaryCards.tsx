'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { InvoiceSummary } from '@/types/domain';
import { formatCurrency } from '@/utils/formatters';
import { FileText, Clock, CheckCircle2, Percent, ShieldCheck, AlertCircle } from 'lucide-react';

export interface InvoiceSummaryCardsProps {
  summary: InvoiceSummary;
}

export const InvoiceSummaryCards: React.FC<InvoiceSummaryCardsProps> = ({ summary }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
      {/* 1. Total Invoiced */}
      <Card className="p-3.5 bg-white border border-slate-200/80 shadow-xs hover:border-[var(--primary)] transition-all">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Total Net Invoiced</span>
          <div className="p-1.5 rounded-lg bg-blue-50 text-blue-700">
            <FileText className="w-3.5 h-3.5" />
          </div>
        </div>
        <div className="mt-2 font-mono font-extrabold text-base text-[var(--primary)] truncate">
          {formatCurrency(summary.totalInvoiced)}
        </div>
        <span className="text-[10px] text-slate-400 block mt-0.5 font-medium">{summary.totalInvoices} Invoices Total</span>
      </Card>

      {/* 2. Outstanding Amount */}
      <Card className="p-3.5 bg-white border border-slate-200/80 shadow-xs hover:border-rose-400 transition-all">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Outstanding Balance</span>
          <div className="p-1.5 rounded-lg bg-rose-50 text-rose-700">
            <Clock className="w-3.5 h-3.5" />
          </div>
        </div>
        <div className="mt-2 font-mono font-extrabold text-base text-rose-700 truncate">
          {formatCurrency(summary.outstandingAmount)}
        </div>
        <span className="text-[10px] text-rose-600 block mt-0.5 font-medium">Pending collection</span>
      </Card>

      {/* 3. Paid Amount */}
      <Card className="p-3.5 bg-white border border-slate-200/80 shadow-xs hover:border-emerald-400 transition-all">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Total Collected</span>
          <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700">
            <CheckCircle2 className="w-3.5 h-3.5" />
          </div>
        </div>
        <div className="mt-2 font-mono font-extrabold text-base text-emerald-700 truncate">
          {formatCurrency(summary.paidAmount)}
        </div>
        <span className="text-[10px] text-emerald-600 block mt-0.5 font-medium">Cleared payments</span>
      </Card>

      {/* 4. GST Collected */}
      <Card className="p-3.5 bg-white border border-slate-200/80 shadow-xs hover:border-purple-400 transition-all">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">GST Collected (18%)</span>
          <div className="p-1.5 rounded-lg bg-purple-50 text-purple-700">
            <Percent className="w-3.5 h-3.5" />
          </div>
        </div>
        <div className="mt-2 font-mono font-extrabold text-base text-purple-900 truncate">
          {formatCurrency(summary.gstCollected)}
        </div>
        <span className="text-[10px] text-purple-600 block mt-0.5 font-medium">Output GST liability</span>
      </Card>

      {/* 5. TDS Deducted */}
      <Card className="p-3.5 bg-white border border-slate-200/80 shadow-xs hover:border-amber-400 transition-all">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">TDS Deducted</span>
          <div className="p-1.5 rounded-lg bg-amber-50 text-amber-700">
            <ShieldCheck className="w-3.5 h-3.5" />
          </div>
        </div>
        <div className="mt-2 font-mono font-extrabold text-base text-amber-700 truncate">
          {formatCurrency(summary.tdsDeducted)}
        </div>
        <span className="text-[10px] text-amber-600 block mt-0.5 font-medium">Form 16A tax credit</span>
      </Card>

      {/* 6. Overdue Count */}
      <Card className="p-3.5 bg-white border border-slate-200/80 shadow-xs hover:border-rose-500 transition-all">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Overdue Invoices</span>
          <div className="p-1.5 rounded-lg bg-rose-100 text-rose-800">
            <AlertCircle className="w-3.5 h-3.5" />
          </div>
        </div>
        <div className="mt-2 font-mono font-extrabold text-base text-rose-800">
          {summary.overdueCount} Overdue
        </div>
        <span className="text-[10px] text-rose-600 block mt-0.5 font-medium">Requires follow-up</span>
      </Card>
    </div>
  );
};

