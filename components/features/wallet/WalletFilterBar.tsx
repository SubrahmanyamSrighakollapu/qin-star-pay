'use client';

import React, { useState } from 'react';
import { FilterBar } from '@/components/ui/FilterBar';
import { Select } from '@/components/ui/Select';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Filter, RotateCcw } from 'lucide-react';
import { WalletFilters } from '@/types/domain';

export interface WalletFilterBarProps {
  onApplyFilters: (filters: WalletFilters) => void;
  onResetFilters: () => void;
  isLoading?: boolean;
  showDistributorFilter?: boolean;
}

export const WalletFilterBar: React.FC<WalletFilterBarProps> = ({
  onApplyFilters,
  onResetFilters,
  isLoading = false,
  showDistributorFilter = false,
}) => {
  const [filters, setFilters] = useState<WalletFilters>({
    status: 'ALL',
    distributorId: 'ALL',
  });

  const activeCount = Object.values(filters).filter(
    (val) => val && val !== 'ALL' && val !== ''
  ).length;

  const handleApply = () => {
    onApplyFilters(filters);
  };

  const handleReset = () => {
    setFilters({ status: 'ALL', distributorId: 'ALL' });
    onResetFilters();
  };

  return (
    <FilterBar
      title="Wallet Filters"
      activeFilterCount={activeCount}
      onReset={handleReset}
    >
      <Input
        label="Search Wallet / Entity"
        placeholder="Wallet ID, Code, Entity Name..."
        value={filters.searchQuery || ''}
        onChange={(e) => setFilters((prev) => ({ ...prev, searchQuery: e.target.value }))}
      />

      <Select
        label="Wallet Status"
        value={filters.status || 'ALL'}
        onChange={(e) => setFilters((prev) => ({ ...prev, status: e.target.value as WalletFilters['status'] }))}
        options={[
          { value: 'ALL', label: 'All Statuses' },
          { value: 'ACTIVE', label: 'Active' },
          { value: 'FROZEN', label: 'Frozen' },
          { value: 'SUSPENDED', label: 'Suspended' },
        ]}
      />

      {showDistributorFilter && (
        <Select
          label="Mapped Distributor"
          value={filters.distributorId || 'ALL'}
          onChange={(e) => setFilters((prev) => ({ ...prev, distributorId: e.target.value }))}
          options={[
            { value: 'ALL', label: 'All Distributors' },
            { value: 'North Zone Dist', label: 'North Zone Dist' },
            { value: 'West Coast Agency', label: 'West Coast Agency' },
            { value: 'South Region Hub', label: 'South Region Hub' },
          ]}
        />
      )}

      <div className="flex items-end gap-2">
        <Button
          variant="primary"
          size="md"
          fullWidth
          onClick={handleApply}
          isLoading={isLoading}
          leftIcon={<Filter className="w-3.5 h-3.5" />}
        >
          Apply
        </Button>
        <Button
          variant="outline"
          size="md"
          onClick={handleReset}
          disabled={isLoading}
          title="Reset Filters"
          className="px-3 shrink-0"
        >
          <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
        </Button>
      </div>
    </FilterBar>
  );
};
