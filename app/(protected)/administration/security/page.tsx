'use client';

import React, { useState, useEffect } from 'react';
import { PageContainer } from '@/components/layout/PageContainer';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { adminService } from '@/services/adminService';
import { SecuritySettings } from '@/types/domain';
import { useToast } from '@/components/ui/Toast';
import { Save } from 'lucide-react';

export default function SecurityPage() {
  const [security, setSecurity] = useState<SecuritySettings | null>(null);
  const [reason, setReason] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    let isCancelled = false;
    adminService.getPlatformSettings().then((res) => {
      if (!isCancelled && res.success && res.data) {
        setSecurity(res.data.security);
      }
    });
    return () => {
      isCancelled = true;
    };
  }, []);

  const { toastSuccess } = useToast();

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!security) return;
    setIsSaving(true);
    await adminService.updatePlatformSettings({ security }, reason);
    setIsSaving(false);
    toastSuccess('Security settings updated successfully.');
  };

  if (!security) return null;

  return (
    <PageContainer
      title="Security Settings"
      description="Configure session timeout parameters, failed login lockout rules, password policies, and MFA enforcement."
    >
      <form onSubmit={handleSave} className="space-y-6 text-xs">
        <Card title="Session & Account Lockout Policies" subtitle="Authentication session security">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Session Inactivity Timeout (Minutes)"
              type="number"
              value={security.sessionTimeoutMinutes}
              onChange={(e) => setSecurity({ ...security, sessionTimeoutMinutes: Number(e.target.value) })}
            />
            <Input
              label="Max Failed Login Attempts"
              type="number"
              value={security.maxLoginAttempts}
              onChange={(e) => setSecurity({ ...security, maxLoginAttempts: Number(e.target.value) })}
            />
            <Input
              label="Account Lock Duration (Minutes)"
              type="number"
              value={security.accountLockDurationMinutes}
              onChange={(e) => setSecurity({ ...security, accountLockDurationMinutes: Number(e.target.value) })}
            />
            <Input
              label="Password Expiry Window (Days)"
              type="number"
              value={security.passwordExpiryDays}
              onChange={(e) => setSecurity({ ...security, passwordExpiryDays: Number(e.target.value) })}
            />
          </div>
        </Card>

        <Card title="Password Complexity & MFA" subtitle="Credential strength policies">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Minimum Password Length"
              type="number"
              value={security.passwordMinLength}
              onChange={(e) => setSecurity({ ...security, passwordMinLength: Number(e.target.value) })}
            />
            <div className="flex items-center gap-2 pt-6">
              <input
                type="checkbox"
                id="mfa"
                checked={security.mfaRequired}
                onChange={(e) => setSecurity({ ...security, mfaRequired: e.target.checked })}
                className="w-4 h-4 text-purple-700 rounded border-slate-300 focus:ring-purple-500"
              />
              <label htmlFor="mfa" className="font-bold text-slate-900 cursor-pointer">
                Mandatory Multi-Factor Authentication (MFA / TOTP)
              </label>
            </div>
          </div>
        </Card>

        <Card title="Audit Change Reason" subtitle="Reason logged in central activity audit trail">
          <Input
            placeholder="e.g. Enforced mandatory MFA requirement for administrative staff per security audit."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
        </Card>

        <div className="flex justify-end">
          <Button variant="primary" size="sm" type="submit" isLoading={isSaving} leftIcon={<Save className="w-3.5 h-3.5" />}>
            Save Security Policies
          </Button>
        </div>
      </form>
    </PageContainer>
  );
}
