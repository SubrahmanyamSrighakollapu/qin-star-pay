'use client';

import React from 'react';
import { ShieldCheck, AlertTriangle, XCircle } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { ProviderHealthItem } from '@/types/dashboard';
import { formatPercentage } from '@/utils/formatters';

export interface ProviderHealthCardProps {
  providers: ProviderHealthItem[];
}

const statusBadgeStyles = {
  OPERATIONAL: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  DEGRADED: 'bg-amber-50 text-amber-700 border-amber-200',
  DOWN: 'bg-rose-50 text-rose-700 border-rose-200',
};

const statusIcon = {
  OPERATIONAL: <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />,
  DEGRADED: <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />,
  DOWN: <XCircle className="w-4 h-4 text-rose-600 shrink-0" />,
};

export const ProviderHealthCard: React.FC<ProviderHealthCardProps> = ({ providers }) => {
  return (
    <Card
      title="Provider / API Status"
      subtitle="Real-time third-party gateway monitoring"
      noPadding
    >
      <div className="divide-y divide-[var(--border-subtle)] text-xs">
        {providers.map((p) => (
          <div key={p.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/50 transition-colors">
            <div className="flex items-center gap-3">
              {statusIcon[p.payInStatus]}
              <div>
                <div className="font-semibold text-[var(--text-primary)]">{p.providerName}</div>
                <div className="text-[11px] text-[var(--text-muted)] mt-0.5">
                  Checked {p.lastChecked} • Success Ratio: <strong className="text-[var(--text-primary)]">{formatPercentage(p.successRate)}</strong>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] text-[var(--text-muted)]">Pay-In:</span>
              <span className={`px-2 py-0.5 rounded-md text-[11px] font-bold border ${statusBadgeStyles[p.payInStatus]}`}>
                {p.payInStatus}
              </span>

              <span className="text-[11px] text-[var(--text-muted)] ml-2">Pay-Out:</span>
              <span className={`px-2 py-0.5 rounded-md text-[11px] font-bold border ${statusBadgeStyles[p.payOutStatus]}`}>
                {p.payOutStatus}
              </span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
