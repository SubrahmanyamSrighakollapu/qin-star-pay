'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowDownLeft, ArrowUpRight, Zap } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export const RetailerQuickActions: React.FC = () => {
  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-3.5 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-blue-50 text-[var(--primary)] border border-blue-100 flex items-center justify-center shrink-0">
          <Zap className="w-4 h-4 text-[var(--primary)]" />
        </div>
        <div>
          <h4 className="text-xs font-extrabold text-slate-900 leading-tight">
            Quick Counter Actions
          </h4>
          <p className="text-[11px] text-slate-500">
            Initiate instant customer deposit collection or disbursement
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 w-full sm:w-auto">
        <Link href="/retailer/pay-in" className="flex-1 sm:flex-initial">
          <Button
            variant="primary"
            size="sm"
            className="w-full sm:w-auto gap-2 text-xs font-bold shadow-2xs cursor-pointer h-9 px-4"
          >
            <ArrowDownLeft className="w-4 h-4" />
            <span>Collect Payment (Pay-In)</span>
          </Button>
        </Link>

        <Link href="/retailer/pay-out" className="flex-1 sm:flex-initial">
          <Button
            size="sm"
            className="w-full sm:w-auto gap-2 text-xs font-bold bg-[var(--secondary)] text-white hover:bg-orange-700 shadow-2xs cursor-pointer h-9 px-4"
          >
            <ArrowUpRight className="w-4 h-4" />
            <span>Send Funds (Pay-Out)</span>
          </Button>
        </Link>
      </div>
    </div>
  );
};
