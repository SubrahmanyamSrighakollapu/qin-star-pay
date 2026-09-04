'use client';

import React, { useState, useEffect } from 'react';
import { PageContainer } from '@/components/layout/PageContainer';
import { useModal } from '@/hooks/useModal';
import { providerService, ProviderListResult } from '@/services/providerService';
import { Provider, ProviderFilters, TestConnectionResult } from '@/types/domain';
import { ProviderSummaryCards } from '@/components/features/integrations/ProviderSummaryCards';
import { ProviderFilterBar } from '@/components/features/integrations/ProviderFilterBar';
import { ProviderTable } from '@/components/features/integrations/ProviderTable';
import { ProviderDetailsDrawer } from '@/components/features/integrations/ProviderDetailsDrawer';
import { TestConnectionModal } from '@/components/features/integrations/TestConnectionModal';
import { EditProviderModal } from '@/components/features/integrations/EditProviderModal';

export default function ProvidersPage() {
  const [filters, setFilters] = useState<ProviderFilters>({});
  const [data, setData] = useState<ProviderListResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Modals & Drawers
  const detailsDrawer = useModal<Provider>();
  const testModal = useModal<Provider>();
  const editModal = useModal<Provider>();

  const loadProviders = () => {
    setIsLoading(true);
    providerService.getProviders(filters).then((res) => {
      if (res.success && res.data) {
        setData(res.data);
      }
      setIsLoading(false);
    });
  };

  useEffect(() => {
    let isCancelled = false;
    providerService.getProviders(filters).then((res) => {
      if (!isCancelled && res.success && res.data) {
        setData(res.data);
        setIsLoading(false);
      }
    });
    return () => {
      isCancelled = true;
    };
  }, [filters]);

  const handleToggleStatus = async (provider: Provider) => {
    await providerService.toggleProviderStatus(provider.id);
    loadProviders();
  };

  const handleSaveProvider = async (id: string, updates: Partial<Provider>) => {
    // In-memory update
    const prv = data?.items.find((p) => p.id === id);
    if (prv) {
      Object.assign(prv, updates);
    }
    loadProviders();
  };

  const handleTestConnection = async (providerId: string): Promise<TestConnectionResult> => {
    const res = await providerService.testConnection(providerId);
    return (
      res.data || {
        success: false,
        httpStatus: 500,
        responseTimeMs: 0,
        message: 'Connection failed',
        timestamp: new Date().toISOString(),
      }
    );
  };

  const summary = data?.summary || {
    totalProviders: 0,
    activeCount: 0,
    degradedCount: 0,
    downCount: 0,
    avgSuccessRate: 0,
  };

  return (
    <PageContainer
      title="Provider Management"
      description="Manage payment gateways, banking partners and service provider availability."
    >
      <div className="space-y-6">
        {/* Metric Summary Cards */}
        <ProviderSummaryCards summary={summary} />

        {/* Filter Bar */}
        <ProviderFilterBar
          onFilterChange={(f) => setFilters(f)}
          onReset={() => setFilters({})}
          isLoading={isLoading}
        />

        {/* Data Table */}
        <ProviderTable
          data={data?.items || []}
          isLoading={isLoading}
          onViewProvider={(prv) => detailsDrawer.open(prv)}
          onEditProvider={(prv) => editModal.open(prv)}
          onTestConnection={(prv) => testModal.open(prv)}
          onToggleStatus={handleToggleStatus}
        />

        {/* Drawers & Modals */}
        <ProviderDetailsDrawer
          isOpen={detailsDrawer.isOpen}
          onClose={detailsDrawer.close}
          provider={detailsDrawer.data}
          onTestConnection={(prv) => testModal.open(prv)}
          onToggleStatus={handleToggleStatus}
        />

        <TestConnectionModal
          isOpen={testModal.isOpen}
          onClose={testModal.close}
          provider={testModal.data}
          onTestConnection={handleTestConnection}
        />

        <EditProviderModal
          isOpen={editModal.isOpen}
          onClose={editModal.close}
          provider={editModal.data}
          onSave={handleSaveProvider}
        />
      </div>
    </PageContainer>
  );
}
