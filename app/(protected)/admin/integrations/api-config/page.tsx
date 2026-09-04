'use client';

import React, { useState, useEffect } from 'react';
import { PageContainer } from '@/components/layout/PageContainer';
import { useModal } from '@/hooks/useModal';
import { providerService } from '@/services/providerService';
import { ApiConfiguration } from '@/types/domain';
import { ApiConfigTable } from '@/components/features/integrations/ApiConfigTable';
import { EditApiConfigModal } from '@/components/features/integrations/EditApiConfigModal';

export default function ApiConfigPage() {
  const [configs, setConfigs] = useState<ApiConfiguration[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const editModal = useModal<ApiConfiguration>();

  const loadConfigs = () => {
    setIsLoading(true);
    providerService.getApiConfigs().then((res) => {
      if (res.success && res.data) {
        setConfigs(res.data);
      }
      setIsLoading(false);
    });
  };

  useEffect(() => {
    let isCancelled = false;
    providerService.getApiConfigs().then((res) => {
      if (!isCancelled && res.success && res.data) {
        setConfigs(res.data);
        setIsLoading(false);
      }
    });
    return () => {
      isCancelled = true;
    };
  }, []);

  const handleSaveConfig = async (id: string, updates: Partial<ApiConfiguration>) => {
    await providerService.updateApiConfig(id, updates);
    loadConfigs();
  };

  return (
    <PageContainer
      title="API Configuration"
      description="Manage connection endpoints, authentication credentials, timeouts, and retry policies per provider."
    >
      <div className="space-y-6">
        <ApiConfigTable
          data={configs}
          isLoading={isLoading}
          onEditApiConfig={(cfg) => editModal.open(cfg)}
        />

        <EditApiConfigModal
          isOpen={editModal.isOpen}
          onClose={editModal.close}
          config={editModal.data}
          onSave={handleSaveConfig}
        />
      </div>
    </PageContainer>
  );
}
