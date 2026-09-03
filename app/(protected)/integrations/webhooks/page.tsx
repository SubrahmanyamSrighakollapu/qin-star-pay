'use client';

import React, { useState, useEffect } from 'react';
import { PageContainer } from '@/components/layout/PageContainer';
import { Button } from '@/components/ui/Button';
import { useModal } from '@/hooks/useModal';
import { providerService } from '@/services/providerService';
import { WebhookConfiguration, Provider, WebhookEventType, WebhookDirection, AuthType } from '@/types/domain';
import { WebhookTable } from '@/components/features/integrations/WebhookTable';
import { CreateWebhookModal } from '@/components/features/integrations/CreateWebhookModal';
import { TestWebhookModal } from '@/components/features/integrations/TestWebhookModal';
import { Plus } from 'lucide-react';

export default function WebhooksPage() {
  const [webhooks, setWebhooks] = useState<WebhookConfiguration[]>([]);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const createModal = useModal();
  const testModal = useModal<WebhookConfiguration>();

  useEffect(() => {
    let isCancelled = false;
    Promise.all([providerService.getWebhooks(), providerService.getProviders()]).then(([whRes, prvRes]) => {
      if (!isCancelled) {
        if (whRes.success && whRes.data) setWebhooks(whRes.data);
        if (prvRes.success && prvRes.data) setProviders(prvRes.data.items);
        setIsLoading(false);
      }
    });
    return () => {
      isCancelled = true;
    };
  }, []);

  const handleCreateWebhook = async (
    providerId: string,
    eventType: WebhookEventType,
    direction: WebhookDirection,
    endpointUrl: string,
    authType: AuthType,
    signatureKey: string
  ) => {
    const prv = providers.find((p) => p.id === providerId);
    const newId = `WH_20260903_${String(webhooks.length + 1).padStart(3, '0')}`;
    const maskKey = signatureKey.trim()
      ? `whsec_••••••••${signatureKey.trim().slice(Math.max(0, signatureKey.trim().length - 4))}`
      : 'whsec_••••••••9912';

    const newWh: WebhookConfiguration = {
      id: newId,
      providerId,
      providerName: prv?.name || 'Partner Gateway',
      eventType,
      direction,
      endpointUrl,
      authType,
      signatureKeyMasked: maskKey,
      retryCount: 3,
      timeout: 5000,
      status: 'ACTIVE',
      failureCount: 0,
      updatedAt: new Date().toISOString(),
    };

    setWebhooks((prev) => [newWh, ...prev]);
  };

  return (
    <PageContainer
      title="Webhook Configuration"
      description="Manage inbound and outbound payment event notification endpoints, HMAC signature verification, and delivery retry policies."
      actions={
        <Button variant="primary" size="sm" onClick={createModal.open} leftIcon={<Plus className="w-3.5 h-3.5" />}>
          New Webhook Endpoint
        </Button>
      }
    >
      <div className="space-y-6">
        <WebhookTable
          data={webhooks}
          isLoading={isLoading}
          onTestWebhook={(wh) => testModal.open(wh)}
        />

        <CreateWebhookModal
          isOpen={createModal.isOpen}
          onClose={createModal.close}
          providers={providers}
          onCreateWebhook={handleCreateWebhook}
        />

        <TestWebhookModal
          isOpen={testModal.isOpen}
          onClose={testModal.close}
          webhook={testModal.data}
        />
      </div>
    </PageContainer>
  );
}
