import React from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { AlertCircle, CheckCircle2, Clock, Wallet, Percent, Store, ArrowRight } from 'lucide-react';

export interface AttentionItem {
  id: string;
  title: string;
  description: string;
  severity: 'warning' | 'info' | 'danger';
  count?: number;
  href?: string;
}

export interface ActivityItem {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  type: 'retailer' | 'commission' | 'transaction' | 'system' | 'wallet';
}

interface DistributorAttentionCardProps {
  attentionItems: AttentionItem[];
  recentActivity: ActivityItem[];
  isLoading?: boolean;
}

export const DistributorAttentionCard: React.FC<DistributorAttentionCardProps> = ({
  attentionItems,
  recentActivity,
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Requires Attention">
          <div className="space-y-3 p-4 animate-pulse">
            <div className="h-12 bg-slate-100 rounded-md" />
            <div className="h-12 bg-slate-100 rounded-md" />
          </div>
        </Card>
        <Card title="Recent Network Activity">
          <div className="space-y-3 p-4 animate-pulse">
            <div className="h-12 bg-slate-100 rounded-md" />
            <div className="h-12 bg-slate-100 rounded-md" />
          </div>
        </Card>
      </div>
    );
  }

  const severityStyles = {
    warning: 'bg-amber-50/80 border-amber-200 text-amber-900',
    danger: 'bg-rose-50/80 border-rose-200 text-rose-900',
    info: 'bg-blue-50/80 border-blue-200 text-blue-900',
  };

  const severityIcons = {
    warning: <Clock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />,
    danger: <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />,
    info: <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />,
  };

  const activityIcons = {
    retailer: <Store className="w-3.5 h-3.5 text-blue-600" />,
    commission: <Percent className="w-3.5 h-3.5 text-emerald-600" />,
    transaction: <AlertCircle className="w-3.5 h-3.5 text-purple-600" />,
    wallet: <Wallet className="w-3.5 h-3.5 text-amber-600" />,
    system: <Clock className="w-3.5 h-3.5 text-slate-600" />,
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Requires Attention */}
      <Card title="Requires Attention" subtitle="Important items requiring distributor awareness">
        <div className="space-y-3">
          {attentionItems.length === 0 ? (
            <p className="text-xs text-[var(--text-muted)] italic py-2">No pending attention items.</p>
          ) : (
            attentionItems.map((item) => (
              <div
                key={item.id}
                className={`p-3.5 border rounded-[var(--radius-lg)] flex items-start justify-between gap-3 text-xs transition-all ${
                  severityStyles[item.severity]
                }`}
              >
                <div className="flex items-start gap-2.5">
                  {severityIcons[item.severity]}
                  <div>
                    <h4 className="font-bold">{item.title}</h4>
                    <p className="text-[11px] opacity-90 mt-0.5">{item.description}</p>
                  </div>
                </div>
                {item.href && (
                  <Link
                    href={item.href}
                    className="shrink-0 text-[11px] font-bold text-blue-700 hover:underline flex items-center gap-1 mt-0.5"
                  >
                    View <ArrowRight className="w-3 h-3" />
                  </Link>
                )}
              </div>
            ))
          )}
        </div>
      </Card>

      {/* Recent Network Activity */}
      <Card title="Recent Network Activity" subtitle="Live updates across assigned retailers and wallet events">
        <div className="space-y-3">
          {recentActivity.map((act) => (
            <div
              key={act.id}
              className="flex items-start justify-between p-2.5 border-b border-[var(--border-subtle)] last:border-0 text-xs"
            >
              <div className="flex items-start gap-2.5">
                <div className="w-7 h-7 rounded-md bg-slate-100 flex items-center justify-center shrink-0 mt-0.5">
                  {activityIcons[act.type]}
                </div>
                <div>
                  <h4 className="font-bold text-[var(--text-primary)]">{act.title}</h4>
                  <p className="text-[11px] text-[var(--text-muted)] mt-0.5">{act.description}</p>
                </div>
              </div>
              <span className="text-[10px] font-mono text-[var(--text-muted)] shrink-0 pl-2">
                {act.timestamp}
              </span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
