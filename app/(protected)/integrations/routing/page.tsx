'use client';

import React, { useState, useEffect } from 'react';
import { PageContainer } from '@/components/layout/PageContainer';
import { Button } from '@/components/ui/Button';
import { useModal } from '@/hooks/useModal';
import { providerService } from '@/services/providerService';
import { RoutingRule, Provider, IntegrationServiceType, TransactionMode, EntityType } from '@/types/domain';
import { RoutingRuleTable } from '@/components/features/integrations/RoutingRuleTable';
import { CreateRoutingRuleModal } from '@/components/features/integrations/CreateRoutingRuleModal';
import { RoutingSimulatorCard } from '@/components/features/integrations/RoutingSimulatorCard';
import { Plus } from 'lucide-react';

export default function RoutingPage() {
  const [rules, setRules] = useState<RoutingRule[]>([]);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const createModal = useModal();

  const loadData = () => {
    setIsLoading(true);
    Promise.all([providerService.getRoutingRules(), providerService.getProviders()]).then(([ruleRes, prvRes]) => {
      if (ruleRes.success && ruleRes.data) setRules(ruleRes.data);
      if (prvRes.success && prvRes.data) setProviders(prvRes.data.items);
      setIsLoading(false);
    });
  };

  useEffect(() => {
    let isCancelled = false;
    Promise.all([providerService.getRoutingRules(), providerService.getProviders()]).then(([ruleRes, prvRes]) => {
      if (!isCancelled) {
        if (ruleRes.success && ruleRes.data) setRules(ruleRes.data);
        if (prvRes.success && prvRes.data) setProviders(prvRes.data.items);
        setIsLoading(false);
      }
    });
    return () => {
      isCancelled = true;
    };
  }, []);

  const handleCreateRule = async (
    service: IntegrationServiceType,
    transactionType: 'PAY_IN' | 'PAY_OUT' | 'SETTLEMENT',
    primaryProviderId: string,
    secondaryProviderId: string,
    minAmount: number,
    maxAmount: number,
    mode: TransactionMode | 'ALL',
    entityType: EntityType | 'ALL',
    priority: number
  ) => {
    await providerService.createRoutingRule(
      service,
      transactionType,
      primaryProviderId,
      secondaryProviderId,
      minAmount,
      maxAmount,
      mode,
      entityType,
      priority
    );
    loadData();
  };

  return (
    <PageContainer
      title="Transaction Routing"
      description="Configure provider selection rules for Pay-In, Pay-Out, and Settlement processing with automatic failover fallback."
      actions={
        <Button variant="primary" size="sm" onClick={createModal.open} leftIcon={<Plus className="w-3.5 h-3.5" />}>
          New Failover Rule
        </Button>
      }
    >
      <div className="space-y-6">
        {/* Routing Simulator */}
        <RoutingSimulatorCard />

        {/* Routing Rules Table */}
        <div className="space-y-3">
          <div className="font-bold text-xs uppercase tracking-wider text-slate-700">Active Routing Rules ({rules.length})</div>
          <RoutingRuleTable data={rules} isLoading={isLoading} />
        </div>

        {/* Modal */}
        <CreateRoutingRuleModal
          isOpen={createModal.isOpen}
          onClose={createModal.close}
          providers={providers}
          onCreateRule={handleCreateRule}
        />
      </div>
    </PageContainer>
  );
}
