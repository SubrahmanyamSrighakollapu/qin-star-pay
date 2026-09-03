'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import {
  ProviderFilters,
  ProviderType,
  ProviderStatus,
  IntegrationEnvironment,
  ProviderHealth,
} from '@/types/domain';
import { Search, Filter, RotateCcw } from 'lucide-react';

export interface ProviderFilterBarProps {
  onFilterChange: (filters: ProviderFilters) => void;
  onReset: () => void;
  isLoading?: boolean;
}

export const ProviderFilterBar: React.FC<ProviderFilterBarProps> = ({
  onFilterChange,
  onReset,
  isLoading = false,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [providerType, setProviderType] = useState<'ALL' | ProviderType>('ALL');
  const [status, setStatus] = useState<'ALL' | ProviderStatus>('ALL');
  const [environment, setEnvironment] = useState<'ALL' | IntegrationEnvironment>('ALL');
  const [health, setHealth] = useState<'ALL' | ProviderHealth>('ALL');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFilterChange({ searchQuery, providerType, status, environment, health });
  };

  const handleReset = () => {
    setSearchQuery('');
    setProviderType('ALL');
    setStatus('ALL');
    setEnvironment('ALL');
    setHealth('ALL');
    onReset();
  };

  return (
    <Card className="p-4 bg-white border border-slate-200">
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          <Input
            label="Search Provider"
            placeholder="Search provider name, code, URL..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftIcon={<Search className="w-4 h-4 text-slate-400" />}
          />

          <Select
            label="Provider Type"
            value={providerType}
            onChange={(e) => setProviderType(e.target.value as 'ALL' | ProviderType)}
            options={[
              { value: 'ALL', label: 'All Types' },
              { value: 'PAY_IN', label: 'Pay-In' },
              { value: 'PAY_OUT', label: 'Pay-Out' },
              { value: 'SETTLEMENT', label: 'Settlement' },
              { value: 'MULTI_SERVICE', label: 'Multi-Service' },
            ]}
          />

          <Select
            label="Environment"
            value={environment}
            onChange={(e) => setEnvironment(e.target.value as 'ALL' | IntegrationEnvironment)}
            options={[
              { value: 'ALL', label: 'All Environments' },
              { value: 'PRODUCTION', label: 'Production' },
              { value: 'SANDBOX', label: 'Sandbox' },
              { value: 'DEMO', label: 'Demo' },
            ]}
          />

          <Select
            label="Health Status"
            value={health}
            onChange={(e) => setHealth(e.target.value as 'ALL' | ProviderHealth)}
            options={[
              { value: 'ALL', label: 'All Health States' },
              { value: 'OPERATIONAL', label: 'Operational' },
              { value: 'DEGRADED', label: 'Degraded' },
              { value: 'DOWN', label: 'Down' },
            ]}
          />

          <Select
            label="Active Status"
            value={status}
            onChange={(e) => setStatus(e.target.value as 'ALL' | ProviderStatus)}
            options={[
              { value: 'ALL', label: 'All Statuses' },
              { value: 'ACTIVE', label: 'Active' },
              { value: 'INACTIVE', label: 'Inactive' },
              { value: 'MAINTENANCE', label: 'Maintenance' },
            ]}
          />
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
          <span className="text-[11px] text-slate-500">Filter payment gateways and banking partner connections.</span>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" type="button" onClick={handleReset} leftIcon={<RotateCcw className="w-3.5 h-3.5" />}>
              Reset
            </Button>
            <Button variant="primary" size="sm" type="submit" isLoading={isLoading} leftIcon={<Filter className="w-3.5 h-3.5" />}>
              Apply Filters
            </Button>
          </div>
        </div>
      </form>
    </Card>
  );
};
