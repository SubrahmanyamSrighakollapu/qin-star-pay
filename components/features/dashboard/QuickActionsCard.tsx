'use client';

import React from 'react';
import Link from 'next/link';
import { Send, Search, Wallet, Landmark } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export const QuickActionsCard: React.FC = () => {
  return (
    <Card title="Quick Actions" subtitle="Operational shortcuts for platform tasks">
      <div className="grid grid-cols-2 gap-3">
        <Link href="/transactions/payout">
          <Button
            variant="outline"
            size="md"
            fullWidth
            leftIcon={<Send className="w-4 h-4 text-blue-600" />}
            className="justify-start text-xs font-semibold text-left"
          >
            Create Payout
          </Button>
        </Link>

        <Link href="/transactions/search">
          <Button
            variant="outline"
            size="md"
            fullWidth
            leftIcon={<Search className="w-4 h-4 text-amber-600" />}
            className="justify-start text-xs font-semibold text-left"
          >
            Search Transaction
          </Button>
        </Link>

        <Link href="/wallet/balances">
          <Button
            variant="outline"
            size="md"
            fullWidth
            leftIcon={<Wallet className="w-4 h-4 text-purple-600" />}
            className="justify-start text-xs font-semibold text-left"
          >
            Manage Wallet
          </Button>
        </Link>

        <Link href="/settlements">
          <Button
            variant="outline"
            size="md"
            fullWidth
            leftIcon={<Landmark className="w-4 h-4 text-emerald-600" />}
            className="justify-start text-xs font-semibold text-left"
          >
            View Settlements
          </Button>
        </Link>
      </div>
    </Card>
  );
};
