'use client';

import React, { useState } from 'react';
import { FilterBar } from '@/components/ui/FilterBar';
import { Select } from '@/components/ui/Select';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { RotateCcw, Filter } from 'lucide-react';
import { DashboardFilters, TransactionTypeFilter, StatusFilter } from '@/types/dashboard';

export interface DashboardFilterBarProps {
  onApplyFilters: (filters: DashboardFilters) => void;
  onResetFilters: () => void;
  isLoading?: boolean;
}

export const DashboardFilterBar: React.FC<DashboardFilterBarProps> = ({
  onApplyFilters,
  onResetFilters,
  isLoading = false,
}) => {
  const [filters, setFilters] = useState<DashboardFilters>({
    type: 'ALL',
    status: 'ALL',
  });

  const activeCount = Object.values(filters).filter(
    (val) => val && val !== 'ALL' && val !== ''
  ).length;

  const handleApply = () => {
    onApplyFilters(filters);
  };

  const handleReset = () => {
    setFilters({ type: 'ALL', status: 'ALL' });
    onResetFilters();
  };

  return (
    <FilterBar
      title="Operational Filters"
      activeFilterCount={activeCount}
      onReset={handleReset}
    >
      <Select
        label="Transaction Type"
        value={filters.type || 'ALL'}
        onChange={(e) => setFilters((prev) => ({ ...prev, type: e.target.value as TransactionTypeFilter }))}
        options={[
          { value: 'ALL', label: 'All Types (Pay-In & Pay-Out)' },
          { value: 'PAY_IN', label: 'Pay-In Collections' },
          { value: 'PAY_OUT', label: 'Pay-Out Disbursements' },
        ]}
      />

      <Select
        label="Transaction Status"
        value={filters.status || 'ALL'}
        onChange={(e) => setFilters((prev) => ({ ...prev, status: e.target.value as StatusFilter }))}
        options={[
          { value: 'ALL', label: 'All Statuses' },
          { value: 'SUCCESS', label: 'Success Only' },
          { value: 'FAILED', label: 'Failed Only' },
          { value: 'PENDING', label: 'Pending' },
          { value: 'PROCESSING', label: 'Processing' },
          { value: 'REVERSED', label: 'Reversed' },
          { value: 'REFUNDED', label: 'Refunded' },
        ]}
      />

      <Select
        label="Merchant"
        value={filters.merchantId || ''}
        onChange={(e) => setFilters((prev) => ({ ...prev, merchantId: e.target.value }))}
        placeholder="All Merchants"
        options={[
          { value: 'mch_01', label: 'Apex Pay Solutions' },
          { value: 'mch_02', label: 'Zenith Retail' },
          { value: 'mch_03', label: 'Global Fintech Ltd' },
        ]}
      />

      <Select
        label="Provider / Gateway"
        value={filters.providerId || ''}
        onChange={(e) => setFilters((prev) => ({ ...prev, providerId: e.target.value }))}
        placeholder="All Providers"
        options={[
          { value: 'p_01', label: 'Provider A (Primary)' },
          { value: 'p_02', label: 'Provider B (Payout Switch)' },
          { value: 'p_03', label: 'Provider C (Bank IMPS)' },
        ]}
      />

      <Input
        label="Date Range"
        type="date"
        value={filters.dateRange || ''}
        onChange={(e) => setFilters((prev) => ({ ...prev, dateRange: e.target.value }))}
      />

      {/* Action Buttons Side-by-Side */}
      <div className="flex items-end gap-2">
        <Button
          variant="primary"
          size="md"
          fullWidth
          onClick={handleApply}
          isLoading={isLoading}
          leftIcon={<Filter className="w-3.5 h-3.5" />}
        >
          Apply Filters
        </Button>
        <Button
          variant="outline"
          size="md"
          onClick={handleReset}
          disabled={isLoading}
          title="Reset Filters"
          aria-label="Reset Filters"
          className="px-3 shrink-0"
        >
          <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
        </Button>
      </div>
    </FilterBar>
  );
};
