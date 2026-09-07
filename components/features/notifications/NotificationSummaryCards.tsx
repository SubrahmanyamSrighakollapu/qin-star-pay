'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { NotificationSummary } from '@/types/domain';
import { Bell, AlertOctagon, AlertTriangle, Calendar, CheckCircle2 } from 'lucide-react';

export interface NotificationSummaryCardsProps {
  summary: NotificationSummary;
}

export const NotificationSummaryCards: React.FC<NotificationSummaryCardsProps> = ({ summary }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
      {/* 1. Unread Notifications */}
      <Card className="p-3.5 bg-white border border-slate-200/80 shadow-xs hover:border-[var(--primary)] transition-all">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Unread Alerts</span>
          <div className="p-1.5 rounded-lg bg-blue-50 text-blue-700">
            <Bell className="w-3.5 h-3.5" />
          </div>
        </div>
        <div className="mt-2 font-mono font-extrabold text-lg text-[var(--primary)]">
          {summary.unreadCount} Unread
        </div>
        <span className="text-[10px] text-slate-400 block mt-0.5 font-medium">Requires attention</span>
      </Card>

      {/* 2. Critical Alerts */}
      <Card className="p-3.5 bg-white border border-slate-200/80 shadow-xs hover:border-rose-400 transition-all">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Critical Alerts</span>
          <div className="p-1.5 rounded-lg bg-rose-50 text-rose-700">
            <AlertOctagon className="w-3.5 h-3.5" />
          </div>
        </div>
        <div className="mt-2 font-mono font-extrabold text-lg text-rose-700">
          {summary.criticalCount} Critical
        </div>
        <span className="text-[10px] text-rose-600 block mt-0.5 font-medium">Immediate review</span>
      </Card>

      {/* 3. Action Required */}
      <Card className="p-3.5 bg-white border border-slate-200/80 shadow-xs hover:border-amber-400 transition-all">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Action Pending</span>
          <div className="p-1.5 rounded-lg bg-amber-50 text-amber-700">
            <AlertTriangle className="w-3.5 h-3.5" />
          </div>
        </div>
        <div className="mt-2 font-mono font-extrabold text-lg text-amber-700">
          {summary.actionRequiredCount} Tasks
        </div>
        <span className="text-[10px] text-amber-600 block mt-0.5 font-medium">Operational action</span>
      </Card>

      {/* 4. Generated Today */}
      <Card className="p-3.5 bg-white border border-slate-200/80 shadow-xs hover:border-slate-400 transition-all">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Generated Today</span>
          <div className="p-1.5 rounded-lg bg-slate-100 text-slate-700">
            <Calendar className="w-3.5 h-3.5" />
          </div>
        </div>
        <div className="mt-2 font-mono font-extrabold text-lg text-slate-900">
          {summary.todayCount} Today
        </div>
        <span className="text-[10px] text-slate-400 block mt-0.5 font-medium">Recent system events</span>
      </Card>

      {/* 5. Resolved / Read */}
      <Card className="p-3.5 bg-white border border-slate-200/80 shadow-xs hover:border-emerald-400 transition-all">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Resolved / Read</span>
          <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700">
            <CheckCircle2 className="w-3.5 h-3.5" />
          </div>
        </div>
        <div className="mt-2 font-mono font-extrabold text-lg text-emerald-700">
          {summary.readCount} Reviewed
        </div>
        <span className="text-[10px] text-emerald-600 block mt-0.5 font-medium">Cleared alerts</span>
      </Card>
    </div>
  );
};

