'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowDownLeft, ArrowUpRight, ShieldCheck, Zap } from 'lucide-react';

export const RetailerQuickActions: React.FC = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {/* Pay-In Primary Action Card (Blue Financial Accent) */}
      <Link href="/retailer/pay-in" className="group block">
        <div className="p-5 rounded-2xl border-l-4 border-l-[var(--primary)] border border-[#E5EBF2] bg-white/95 hover:border-[var(--primary)]/60 shadow-xs hover:shadow-md transition-all duration-200 flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-[var(--primary)] bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                Collect Payment
              </span>
              <span className="flex items-center gap-1 text-[11px] text-slate-500 font-medium">
                <Zap className="w-3 h-3 text-[var(--primary)]" /> Instant UPI / QR
              </span>
            </div>
            <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2 group-hover:text-[var(--primary)] transition-colors">
              Pay-In Collection
            </h3>
            <p className="text-xs text-slate-500">
              Collect customer deposits via QR codes & UPI switches
            </p>
          </div>

          <div className="p-3 rounded-xl bg-blue-50 text-[var(--primary)] border border-blue-100 group-hover:scale-105 transition-transform shrink-0 ml-3">
            <ArrowDownLeft className="w-6 h-6 text-[var(--primary)]" />
          </div>
        </div>
      </Link>

      {/* Pay-Out Primary Action Card (Orange Financial Accent) */}
      <Link href="/retailer/pay-out" className="group block">
        <div className="p-5 rounded-2xl border-l-4 border-l-[var(--secondary)] border border-[#E5EBF2] bg-white/95 hover:border-[var(--secondary)]/60 shadow-xs hover:shadow-md transition-all duration-200 flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-[var(--secondary)] bg-orange-50 px-2 py-0.5 rounded border border-orange-100">
                Send Funds
              </span>
              <span className="flex items-center gap-1 text-[11px] text-slate-500 font-medium">
                <ShieldCheck className="w-3 h-3 text-[var(--secondary)]" /> Bank IMPS / NEFT
              </span>
            </div>
            <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2 group-hover:text-[var(--secondary)] transition-colors">
              Pay-Out Disbursement
            </h3>
            <p className="text-xs text-slate-500">
              Send funds directly to customer beneficiary bank accounts
            </p>
          </div>

          <div className="p-3 rounded-xl bg-orange-50 text-[var(--secondary)] border border-orange-100 group-hover:scale-105 transition-transform shrink-0 ml-3">
            <ArrowUpRight className="w-6 h-6 text-[var(--secondary)]" />
          </div>
        </div>
      </Link>
    </div>
  );
};
