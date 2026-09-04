'use client';

import React from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { AlertTriangle, CheckCircle2, Info, ArrowRight } from 'lucide-react';

export interface RetailerAttentionPanelProps {
  attentionItems: {
    id: string;
    title: string;
    description: string;
    type: 'WARNING' | 'INFO' | 'SUCCESS';
    actionText?: string;
    actionUrl?: string;
  }[];
  isLoading?: boolean;
}

export const RetailerAttentionPanel: React.FC<RetailerAttentionPanelProps> = ({
  attentionItems,
  isLoading = false,
}) => {
  if (isLoading) {
    return <Card title="Needs Attention"><div className="h-24 bg-slate-100 rounded-lg animate-pulse" /></Card>;
  }

  return (
    <Card
      title={
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-600" />
          <span>Needs Attention</span>
        </div>
      }
      subtitle="Actionable operational alerts & account notifications"
    >
      {attentionItems.length === 0 ? (
        <div className="p-4 bg-emerald-50/70 border border-emerald-200/80 rounded-xl flex items-center gap-3 text-xs text-emerald-900">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <div>
            <div className="font-bold text-emerald-950">Everything looks good</div>
            <div className="text-emerald-800/90 text-[11px] mt-0.5">
              No pending issues or operational alerts currently require your attention.
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {attentionItems.map((item) => (
            <div
              key={item.id}
              className={`p-3.5 rounded-xl border text-xs space-y-1.5 transition-colors ${
                item.type === 'WARNING'
                  ? 'bg-amber-50/80 border-amber-200 text-amber-950'
                  : item.type === 'SUCCESS'
                  ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950'
                  : 'bg-blue-50/80 border-blue-200 text-blue-950'
              }`}
            >
              <div className="flex items-center justify-between font-bold">
                <div className="flex items-center gap-1.5">
                  {item.type === 'WARNING' ? (
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                  ) : (
                    <Info className="w-4 h-4 text-blue-600 shrink-0" />
                  )}
                  <span>{item.title}</span>
                </div>
              </div>

              <p className="text-slate-700 leading-relaxed text-[11px]">{item.description}</p>

              {item.actionText && item.actionUrl && (
                <div className="pt-1">
                  <Link href={item.actionUrl}>
                    <Button variant="ghost" size="sm" rightIcon={<ArrowRight className="w-3 h-3" />} className="px-0 h-auto text-xs font-bold text-[var(--primary)] hover:bg-transparent">
                      {item.actionText}
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};
