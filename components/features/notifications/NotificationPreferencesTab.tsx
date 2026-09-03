'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { notificationService } from '@/services/notificationService';
import { NotificationPreferenceItem, NotificationType } from '@/types/domain';
import { Lock, Bell, Mail } from 'lucide-react';

export const NotificationPreferencesTab: React.FC = () => {
  const [preferences, setPreferences] = useState<NotificationPreferenceItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadPreferences = () => {
    setIsLoading(true);
    notificationService.getPreferences().then((res) => {
      if (res.success && res.data) {
        setPreferences(res.data);
      }
      setIsLoading(false);
    });
  };

  useEffect(() => {
    let isCancelled = false;
    notificationService.getPreferences().then((res) => {
      if (!isCancelled && res.success && res.data) {
        setPreferences(res.data);
        setIsLoading(false);
      }
    });
    return () => {
      isCancelled = true;
    };
  }, []);

  const handleToggle = async (type: NotificationType, field: 'inAppEnabled' | 'emailEnabled', currentVal: boolean) => {
    await notificationService.updatePreference(type, field, !currentVal);
    loadPreferences();
  };

  if (isLoading) {
    return <div className="p-8 text-center text-xs text-slate-400">Loading notification preferences...</div>;
  }

  // Group by category
  const categories = Array.from(new Set(preferences.map((p) => p.category)));

  return (
    <div className="space-y-6 text-xs">
      <Card
        title="Notification Delivery Preferences"
        subtitle="Configure in-app alerts and email dispatches by operational event category"
      >
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-900 text-xs flex items-center gap-2 mb-4">
          <Lock className="w-4 h-4 text-blue-700 shrink-0" />
          <span>
            <strong>Mandatory Alert Rule:</strong> Critical payment operations alerts (Settlements, Reconciliation Mismatch, Chargeback Deadlines, Provider Outages) have mandatory In-App dispatch enabled to prevent missed operational SLA actions.
          </span>
        </div>

        <div className="space-y-6">
          {categories.map((cat) => {
            const catItems = preferences.filter((p) => p.category === cat);
            return (
              <div key={cat} className="space-y-2">
                <div className="font-bold text-xs uppercase tracking-wider text-[var(--primary)] border-b border-slate-200 pb-1">
                  {cat} Events
                </div>

                <div className="divide-y divide-slate-100 border border-slate-200 rounded-lg overflow-hidden bg-white">
                  {catItems.map((item) => (
                    <div key={item.type} className="p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900">{item.label}</span>
                          <StatusBadge status={item.severity} size="sm" />
                          {item.inAppMandatory && (
                            <span className="px-1.5 py-0.2 bg-amber-100 text-amber-900 text-[10px] font-bold rounded flex items-center gap-1">
                              <Lock className="w-2.5 h-2.5" />
                              <span>Mandatory</span>
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] font-mono text-slate-500">{item.type}</span>
                      </div>

                      <div className="flex items-center gap-6 shrink-0">
                        {/* In-App Toggle */}
                        <label className="flex items-center gap-2 cursor-pointer select-none">
                          <Bell className="w-3.5 h-3.5 text-slate-400" />
                          <span className="text-slate-700">In-App</span>
                          <input
                            type="checkbox"
                            checked={item.inAppEnabled}
                            disabled={item.inAppMandatory}
                            onChange={() => handleToggle(item.type, 'inAppEnabled', item.inAppEnabled)}
                            className="w-4 h-4 accent-[var(--primary)] rounded cursor-pointer disabled:opacity-50"
                          />
                        </label>

                        {/* Email Toggle */}
                        <label className="flex items-center gap-2 cursor-pointer select-none">
                          <Mail className="w-3.5 h-3.5 text-slate-400" />
                          <span className="text-slate-700">Email</span>
                          <input
                            type="checkbox"
                            checked={item.emailEnabled}
                            onChange={() => handleToggle(item.type, 'emailEnabled', item.emailEnabled)}
                            className="w-4 h-4 accent-[var(--primary)] rounded cursor-pointer"
                          />
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
};
