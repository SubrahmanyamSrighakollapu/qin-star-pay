'use client';

import React from 'react';
import { PageContainer } from '@/components/layout/PageContainer';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Bell, ShieldCheck } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function RetailerNotificationsPage() {
  const { session } = useAuth();

  return (
    <PageContainer
      title="Retailer Notifications & Alerts"
      description="View operational alerts, system messages, and transaction updates."
      statusBadge={<StatusBadge status="ACTIVE" label="Approved Retailer" />}
    >
      <div className="bg-white border border-slate-200 rounded-xl p-8 max-w-3xl mx-auto space-y-6 text-center shadow-xs">
        <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mx-auto shadow-xs">
          <Bell className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-bold text-slate-900">Retailer Notification Center</h2>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Operational alerts, Pay-In/Pay-Out notifications, and wallet balance threshold alerts for your Retailer account.
          </p>
        </div>

        <div className="p-4 bg-amber-50/60 border border-amber-200 rounded-lg text-xs text-amber-900 flex items-center justify-center gap-2 max-w-md mx-auto">
          <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
          <span>Authenticated Counter Account: <strong className="font-mono">{session?.entityId || 'RET001'}</strong></span>
        </div>
      </div>
    </PageContainer>
  );
}
