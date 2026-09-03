'use client';

import React, { useState } from 'react';
import { FilterBar } from '@/components/ui/FilterBar';
import { Select } from '@/components/ui/Select';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Filter, RotateCcw } from 'lucide-react';
import { UserFilters } from '@/types/domain';

export interface UserFilterBarProps {
  onApplyFilters: (filters: UserFilters) => void;
  onResetFilters: () => void;
  isLoading?: boolean;
  showDistributorFilter?: boolean;
  showRoleFilter?: boolean;
}

export const UserFilterBar: React.FC<UserFilterBarProps> = ({
  onApplyFilters,
  onResetFilters,
  isLoading = false,
  showDistributorFilter = false,
  showRoleFilter = false,
}) => {
  const [filters, setFilters] = useState<UserFilters>({
    status: 'ALL',
    kycStatus: 'ALL',
    role: 'ALL',
    distributorId: 'ALL',
  });

  const activeCount = Object.values(filters).filter(
    (val) => val && val !== 'ALL' && val !== ''
  ).length;

  const handleApply = () => {
    onApplyFilters(filters);
  };

  const handleReset = () => {
    setFilters({ status: 'ALL', kycStatus: 'ALL', role: 'ALL', distributorId: 'ALL' });
    onResetFilters();
  };

  return (
    <FilterBar
      title="User Filters"
      activeFilterCount={activeCount}
      onReset={handleReset}
    >
      <Input
        label="Search User / Entity"
        placeholder="Code, Name, Email, Mobile..."
        value={filters.searchQuery || ''}
        onChange={(e) => setFilters((prev) => ({ ...prev, searchQuery: e.target.value }))}
      />

      <Select
        label="Account Status"
        value={filters.status || 'ALL'}
        onChange={(e) => setFilters((prev) => ({ ...prev, status: e.target.value }))}
        options={[
          { value: 'ALL', label: 'All Statuses' },
          { value: 'ACTIVE', label: 'Active' },
          { value: 'INACTIVE', label: 'Inactive' },
          { value: 'BLOCKED', label: 'Blocked' },
          { value: 'PENDING', label: 'Pending' },
        ]}
      />

      <Select
        label="KYC Status"
        value={filters.kycStatus || 'ALL'}
        onChange={(e) => setFilters((prev) => ({ ...prev, kycStatus: e.target.value }))}
        options={[
          { value: 'ALL', label: 'All KYC Statuses' },
          { value: 'APPROVED', label: 'Approved' },
          { value: 'UNDER_REVIEW', label: 'Under Review' },
          { value: 'PENDING', label: 'Pending' },
          { value: 'REJECTED', label: 'Rejected' },
        ]}
      />

      {showRoleFilter && (
        <Select
          label="Internal Role"
          value={filters.role || 'ALL'}
          onChange={(e) => setFilters((prev) => ({ ...prev, role: e.target.value }))}
          options={[
            { value: 'ALL', label: 'All Roles' },
            { value: 'SUPER_ADMIN', label: 'Super Admin' },
            { value: 'KYC_MANAGER', label: 'KYC Manager' },
            { value: 'SALES_LEAD', label: 'Sales Lead' },
            { value: 'OPERATIONS', label: 'Operations' },
          ]}
        />
      )}

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
