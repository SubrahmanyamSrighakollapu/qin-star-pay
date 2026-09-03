'use client';

import React from 'react';
import Link from 'next/link';
import { AlertCircle, AlertTriangle, Info, ArrowRight } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { OperationalAlert } from '@/types/dashboard';

export interface OperationalAlertsCardProps {
  alerts: OperationalAlert[];
}

export const OperationalAlertsCard: React.FC<OperationalAlertsCardProps> = ({ alerts }) => {
  return (
    <Card title="Needs Attention" subtitle="Immediate operational issues & alerts">
      <div className="space-y-3 text-xs">
        {alerts.map((a) => (
          <div
            key={a.id}
            className={`p-3 rounded-lg border flex items-start justify-between gap-3 ${
              a.type === 'DANGER'
                ? 'bg-rose-50/60 border-rose-200 text-rose-950'
                : a.type === 'WARNING'
                ? 'bg-amber-50/60 border-amber-200 text-amber-950'
                : 'bg-blue-50/60 border-blue-200 text-blue-950'
            }`}
          >
            <div className="flex items-start gap-2.5">
              <div className="mt-0.5 shrink-0">
                {a.type === 'DANGER' ? (
                  <AlertCircle className="w-4 h-4 text-rose-600" />
                ) : a.type === 'WARNING' ? (
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                ) : (
                  <Info className="w-4 h-4 text-blue-600" />
                )}
              </div>
              <div>
                <div className="font-bold">{a.title}</div>
                <div className="text-[11px] opacity-80 mt-0.5">{a.message}</div>
              </div>
            </div>

            {a.actionPath && (
              <Link
                href={a.actionPath}
                className="shrink-0 p-1 hover:bg-white/80 rounded transition-colors text-[var(--primary)]"
                title="Review Issue"
              >
                <ArrowRight className="w-4 h-4" />
              </Link>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
};
