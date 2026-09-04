import React from 'react';
import { Card } from '@/components/ui/Card';
import { AlertTriangle, Clock, Info, CheckCircle2, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

export interface AttentionItem {
  id: string;
  title: string;
  description: string;
  severity: 'warning' | 'info' | 'danger';
  count?: number;
  href?: string;
}

export interface NetworkActivityItem {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  type: 'retailer' | 'distributor' | 'commission' | 'transaction' | 'system';
}

export interface MasterDistributorAttentionCardProps {
  attentionItems: AttentionItem[];
  activityFeed: NetworkActivityItem[];
}

export const MasterDistributorAttentionCard: React.FC<MasterDistributorAttentionCardProps> = ({
  attentionItems,
  activityFeed,
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Requires Attention Card */}
      <Card title="Requires Attention" subtitle="Action items and notifications across your agency network">
        <div className="space-y-3">
          {attentionItems.map((item) => (
            <div
              key={item.id}
              className={`p-3.5 rounded-[var(--radius-lg)] border flex items-start justify-between gap-3 text-xs ${
                item.severity === 'warning'
                  ? 'bg-amber-50/80 border-amber-200 text-amber-900'
                  : item.severity === 'danger'
                  ? 'bg-rose-50/80 border-rose-200 text-rose-900'
                  : 'bg-blue-50/80 border-blue-200 text-blue-900'
              }`}
            >
              <div className="flex items-start gap-2.5">
                {item.severity === 'warning' ? (
                  <Clock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                ) : item.severity === 'danger' ? (
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                ) : (
                  <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                )}
                <div>
                  <span className="font-extrabold block">{item.title}</span>
                  <span className="text-[11px] opacity-90">{item.description}</span>
                </div>
              </div>

              {item.href && (
                <Link
                  href={item.href}
                  className="text-[11px] font-bold underline shrink-0 hover:opacity-80 flex items-center gap-0.5"
                >
                  <span>View</span>
                  <ArrowUpRight className="w-3 h-3" />
                </Link>
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Network Activity Timeline */}
      <Card title="Recent Network Activity" subtitle="Real-time operational events from your distribution network">
        <div className="space-y-3">
          {activityFeed.map((act) => (
            <div key={act.id} className="flex items-start gap-3 text-xs p-2.5 rounded-md hover:bg-slate-50 transition-colors">
              <div className="w-7 h-7 rounded-full bg-slate-100 border border-slate-200 text-slate-600 flex items-center justify-center shrink-0 mt-0.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[var(--primary)]" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">{act.title}</span>
                  <span className="text-[10px] text-slate-400 font-mono">{act.timestamp}</span>
                </div>
                <p className="text-[11px] text-slate-600 mt-0.5">{act.description}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
