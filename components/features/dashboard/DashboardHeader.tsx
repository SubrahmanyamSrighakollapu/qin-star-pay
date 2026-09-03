'use client';

import React from 'react';
import { RefreshCw, Clock } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { formatDateTime } from '@/utils/formatters';

export interface DashboardHeaderProps {
  lastRefreshedAt: string;
  onRefresh: () => void;
  isLoading?: boolean;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  lastRefreshedAt,
  onRefresh,
  isLoading = false,
}) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[var(--border)]">
      <div>
        <h1 className="text-xl md:text-2xl font-extrabold text-[var(--text-primary)] tracking-tight">
          Dashboard Overview
        </h1>
        <p className="text-xs text-[var(--text-muted)] mt-1">
          Monitor transactions, balances, settlements and payment performance.
        </p>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        <div className="hidden sm:flex items-center gap-1.5 text-xs text-[var(--text-muted)] bg-slate-100 px-3 py-1.5 rounded-[var(--radius-md)] border border-slate-200">
          <Clock className="w-3.5 h-3.5" />
          <span>Refreshed: <strong>{formatDateTime(lastRefreshedAt)}</strong></span>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={onRefresh}
          isLoading={isLoading}
          leftIcon={<RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />}
        >
          Refresh Data
        </Button>
      </div>
    </div>
  );
};
