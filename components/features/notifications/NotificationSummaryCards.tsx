'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { NotificationSummary } from '@/types/domain';

export interface NotificationSummaryCardsProps {
  summary: NotificationSummary;
}

export const NotificationSummaryCards: React.FC<NotificationSummaryCardsProps> = ({ summary }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {/* 1. Unread Notifications */}
      <Card className="p-4 bg-white border border-slate-200">
        <span className="text-xs font-semibold text-slate-500">Unread Notifications</span>
        <div className="mt-1 font-mono font-extrabold text-base text-[var(--primary)]">
          {summary.unreadCount} Unread
        </div>
        <span className="text-[11px] text-slate-400 block mt-0.5">Requires attention</span>
      </Card>

      {/* 2. Critical Alerts */}
      <Card className="p-4 bg-white border border-slate-200">
        <span className="text-xs font-semibold text-slate-500">Critical Alerts</span>
        <div className="mt-1 font-mono font-extrabold text-base text-rose-700">
          {summary.criticalCount} Critical
        </div>
        <span className="text-[11px] text-rose-600 block mt-0.5">Immediate review</span>
      </Card>

      {/* 3. Action Required */}
      <Card className="p-4 bg-white border border-slate-200">
        <span className="text-xs font-semibold text-slate-500">Action Required</span>
        <div className="mt-1 font-mono font-extrabold text-base text-amber-700">
          {summary.actionRequiredCount} Action Pending
        </div>
        <span className="text-[11px] text-amber-600 block mt-0.5">Operational task</span>
      </Card>

      {/* 4. Generated Today */}
      <Card className="p-4 bg-white border border-slate-200">
        <span className="text-xs font-semibold text-slate-500">Generated Today</span>
        <div className="mt-1 font-mono font-extrabold text-base text-slate-900">
          {summary.todayCount} Today
        </div>
        <span className="text-[11px] text-slate-400 block mt-0.5">Recent system events</span>
      </Card>

      {/* 5. Resolved / Read */}
      <Card className="p-4 bg-white border border-slate-200">
        <span className="text-xs font-semibold text-slate-500">Resolved / Read</span>
        <div className="mt-1 font-mono font-extrabold text-base text-emerald-700">
          {summary.readCount} Reviewed
        </div>
        <span className="text-[11px] text-emerald-600 block mt-0.5">Cleared alerts</span>
      </Card>
    </div>
  );
};
