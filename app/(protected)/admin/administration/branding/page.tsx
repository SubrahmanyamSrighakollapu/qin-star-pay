'use client';

import React, { useState, useEffect } from 'react';
import { PageContainer } from '@/components/layout/PageContainer';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { adminService } from '@/services/adminService';
import { BrandingConfig } from '@/types/domain';
import { BrandingPreviewCard } from '@/components/features/administration/BrandingPreviewCard';
import { useToast } from '@/components/ui/Toast';
import { Save } from 'lucide-react';

export default function BrandingPage() {
  const [branding, setBranding] = useState<BrandingConfig | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    let isCancelled = false;
    adminService.getPlatformSettings().then((res) => {
      if (!isCancelled && res.success && res.data) {
        setBranding(res.data.branding);
      }
    });
    return () => {
      isCancelled = true;
    };
  }, []);

  const { toastSuccess } = useToast();

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!branding) return;
    setIsSaving(true);
    await adminService.updatePlatformSettings({ branding });
    setIsSaving(false);
    toastSuccess('Branding configuration updated successfully.');
  };

  if (!branding) return null;

  return (
    <PageContainer
      title="Branding & Identity"
      description="Configure platform logo, primary brand colors, login page titles, and operational support text."
    >
      <form onSubmit={handleSave} className="space-y-6 text-xs">
        {/* Live Preview Component */}
        <BrandingPreviewCard branding={branding} />

        {/* Branding Configuration Inputs */}
        <Card title="Brand Identity Parameters" subtitle="Customize platform appearance assets">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Platform Name"
              value={branding.platformName}
              onChange={(e) => setBranding({ ...branding, platformName: e.target.value })}
            />
            <Input
              label="Primary Brand Color (Hex)"
              value={branding.primaryBrandColor}
              onChange={(e) => setBranding({ ...branding, primaryBrandColor: e.target.value })}
            />
            <Input
              label="Login Page Title"
              value={branding.loginPageTitle}
              onChange={(e) => setBranding({ ...branding, loginPageTitle: e.target.value })}
            />
            <Input
              label="Support Footer Text"
              value={branding.supportText}
              onChange={(e) => setBranding({ ...branding, supportText: e.target.value })}
            />
          </div>
        </Card>

        <div className="flex justify-end">
          <Button variant="primary" size="sm" type="submit" isLoading={isSaving} leftIcon={<Save className="w-3.5 h-3.5" />}>
            Save Branding Configuration
          </Button>
        </div>
      </form>
    </PageContainer>
  );
}
