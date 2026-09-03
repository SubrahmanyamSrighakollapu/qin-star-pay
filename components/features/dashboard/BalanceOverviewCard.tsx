'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { BalanceOverview } from '@/types/dashboard';
import { formatCurrency } from '@/utils/formatters';

export interface BalanceOverviewCardProps {
  balance: BalanceOverview;
}

export const BalanceOverviewCard: React.FC<BalanceOverviewCardProps> = ({ balance }) => {
  return (
    <Card
      title="Balance Overview"
      subtitle="Financial wallet balances & reserves"
      action={
        <Link href="/wallet/balances">
          <Button variant="ghost" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
            Manage Wallet
          </Button>
        </Link>
      }
    >
      <div className="grid grid-cols-2 gap-4 text-xs">
        <div className="p-3.5 bg-blue-50/60 border border-blue-100 rounded-lg space-y-1">
          <span className="text-[var(--text-muted)] font-medium">Available Balance</span>
          <div className="text-base font-extrabold text-[var(--primary)] font-mono tabular-nums">
            {formatCurrency(balance.availableBalance)}
          </div>
        </div>

        <div className="p-3.5 bg-amber-50/60 border border-amber-100 rounded-lg space-y-1">
          <span className="text-[var(--text-muted)] font-medium">Pending Settlement</span>
          <div className="text-base font-extrabold text-amber-700 font-mono tabular-nums">
            {formatCurrency(balance.pendingSettlement)}
          </div>
        </div>

        <div className="p-3.5 bg-slate-100/70 border border-slate-200 rounded-lg space-y-1">
          <span className="text-[var(--text-muted)] font-medium">Lien / Hold Reserve</span>
          <div className="text-base font-bold text-slate-800 font-mono tabular-nums">
            {formatCurrency(balance.holdBalance)}
          </div>
        </div>

        <div className="p-3.5 bg-purple-50/60 border border-purple-100 rounded-lg space-y-1">
          <span className="text-[var(--text-muted)] font-medium">Master Float Pool</span>
          <div className="text-base font-bold text-purple-900 font-mono tabular-nums">
            {formatCurrency(balance.masterBalance, { compact: true })}
          </div>
        </div>
      </div>
    </Card>
  );
};
