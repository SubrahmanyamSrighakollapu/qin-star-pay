'use client';

import React, { useState, useEffect } from 'react';
import { PageContainer } from '@/components/layout/PageContainer';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { adminService } from '@/services/adminService';
import { PlatformSettings } from '@/types/domain';
import { useToast } from '@/components/ui/Toast';
import { Save } from 'lucide-react';

export default function PlatformSettingsPage() {
  const [settings, setSettings] = useState<PlatformSettings | null>(null);
  const [reason, setReason] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    let isCancelled = false;
    adminService.getPlatformSettings().then((res) => {
      if (!isCancelled && res.success && res.data) {
        setSettings(res.data);
      }
    });
    return () => {
      isCancelled = true;
    };
  }, []);

  const { toastSuccess } = useToast();

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    setIsSaving(true);
    await adminService.updatePlatformSettings(settings, reason);
    setIsSaving(false);
    toastSuccess('Platform settings saved successfully.');
  };

  if (!settings) return null;

  return (
    <PageContainer
      title="Platform Settings"
      description="Configure platform defaults, currency, timezone, transaction timeouts, and cut-off parameters."
    >
      <form onSubmit={handleSave} className="space-y-6 text-xs">
        <Card title="General Platform Metadata" subtitle="Core platform defaults">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Platform Name"
              value={settings.general.platformName}
              onChange={(e) =>
                setSettings({ ...settings, general: { ...settings.general, platformName: e.target.value } })
              }
            />
            <Input
              label="Support Email"
              value={settings.general.supportEmail}
              onChange={(e) =>
                setSettings({ ...settings, general: { ...settings.general, supportEmail: e.target.value } })
              }
            />
            <Input
              label="Default Currency"
              value={settings.general.defaultCurrency}
              disabled
            />
            <Input
              label="Timezone"
              value={settings.general.timezone}
              onChange={(e) =>
                setSettings({ ...settings, general: { ...settings.general, timezone: e.target.value } })
              }
            />
          </div>
        </Card>

        <Card title="Transaction Processing Defaults" subtitle="Timeouts and status check parameters">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Gateway Timeout Threshold (ms)"
              type="number"
              value={settings.transaction.defaultTimeoutMs}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  transaction: { ...settings.transaction, defaultTimeoutMs: Number(e.target.value) },
                })
              }
            />
            <Input
              label="Max Retry Attempts"
              type="number"
              value={settings.transaction.maxRetryCount}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  transaction: { ...settings.transaction, maxRetryCount: Number(e.target.value) },
                })
              }
            />
          </div>
        </Card>

        <Card title="Settlement Cut-Off & Defaults" subtitle="Cut-off time and minimum settlement amounts">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Daily Settlement Cut-Off Time"
              value={settings.settlement.cutoffTime}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  settlement: { ...settings.settlement, cutoffTime: e.target.value },
                })
              }
            />
            <Input
              label="Minimum Settlement Amount (₹)"
              type="number"
              value={settings.settlement.minimumSettlementAmount}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  settlement: { ...settings.settlement, minimumSettlementAmount: Number(e.target.value) },
                })
              }
            />
          </div>
        </Card>

        <Card title="Audit Change Reason" subtitle="Reason logged in central activity audit trail">
          <Input
            placeholder="e.g. Updated settlement cutoff time to 18:00 IST per bank nodal schedule."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
        </Card>

        <div className="flex justify-end">
          <Button variant="primary" size="sm" type="submit" isLoading={isSaving} leftIcon={<Save className="w-3.5 h-3.5" />}>
            Save Platform Settings
          </Button>
        </div>
      </form>
    </PageContainer>
  );
}
