'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowDownLeft, ArrowUpRight, ShieldCheck, Zap } from 'lucide-react';

export const RetailerQuickActions: React.FC = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {/* Pay-In Primary Action Card */}
      <Link href="/retailer/pay-in" className="group block">
        <div className="p-5 rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-900 via-emerald-800 to-slate-900 text-white shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-300 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-700/50">
                Customer Payment
              </span>
              <span className="flex items-center gap-1 text-[11px] text-emerald-200">
                <Zap className="w-3 h-3 text-amber-300" /> Instant Collection
              </span>
            </div>
            <h3 className="text-xl font-extrabold text-white flex items-center gap-2 group-hover:text-emerald-200 transition-colors">
              Pay-In (Collection)
            </h3>
            <p className="text-xs text-emerald-100/80">
              Generate QR codes, collect UPI payments & customer deposits
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-white/10 border border-white/20 backdrop-blur-md group-hover:scale-105 transition-transform shrink-0 ml-3">
            <ArrowDownLeft className="w-7 h-7 text-emerald-300" />
          </div>
        </div>
      </Link>

      {/* Pay-Out Primary Action Card */}
      <Link href="/retailer/pay-out" className="group block">
        <div className="p-5 rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-900 via-sky-900 to-slate-900 text-white shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-sky-300 bg-sky-950/60 px-2 py-0.5 rounded border border-sky-700/50">
                Bank Disbursement
              </span>
              <span className="flex items-center gap-1 text-[11px] text-sky-200">
                <ShieldCheck className="w-3 h-3 text-emerald-300" /> Wallet Backed
              </span>
            </div>
            <h3 className="text-xl font-extrabold text-white flex items-center gap-2 group-hover:text-sky-200 transition-colors">
              Pay-Out (Disbursement)
            </h3>
            <p className="text-xs text-sky-100/80">
              Disburse IMPS, NEFT & UPI transfer directly to beneficiary banks
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-white/10 border border-white/20 backdrop-blur-md group-hover:scale-105 transition-transform shrink-0 ml-3">
            <ArrowUpRight className="w-7 h-7 text-sky-300" />
          </div>
        </div>
      </Link>
    </div>
  );
};
