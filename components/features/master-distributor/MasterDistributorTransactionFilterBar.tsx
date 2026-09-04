import React from 'react';
import { SearchInput, Select, Button } from '@/components/ui';
import { Distributor, Retailer } from '@/types/domain';
import { RefreshCw, Filter } from 'lucide-react';

export interface MasterDistributorTransactionFilterBarProps {
  searchQuery: string;
  onSearchChange: (val: string) => void;
  typeFilter: string;
  onTypeChange: (val: string) => void;
  statusFilter: string;
  onStatusChange: (val: string) => void;
  distributorFilter: string;
  onDistributorChange: (val: string) => void;
  retailerFilter: string;
  onRetailerChange: (val: string) => void;
  paymentModeFilter: string;
  onPaymentModeChange: (val: string) => void;
  distributors: Distributor[];
  retailers: Retailer[];
  onReset: () => void;
  isFiltered: boolean;
  onRefresh?: () => void;
  isLoading?: boolean;
}

export const MasterDistributorTransactionFilterBar: React.FC<
  MasterDistributorTransactionFilterBarProps
> = ({
  searchQuery,
  onSearchChange,
  typeFilter,
  onTypeChange,
  statusFilter,
  onStatusChange,
  distributorFilter,
  onDistributorChange,
  retailerFilter,
  onRetailerChange,
  paymentModeFilter,
  onPaymentModeChange,
  distributors,
  retailers,
  onReset,
  isFiltered,
  onRefresh,
  isLoading = false,
}) => {
  return (
    <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-xs space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex-1 min-w-[280px] max-w-md">
          <SearchInput
            value={searchQuery}
            onChange={onSearchChange}
            placeholder="Search Txn ID, Order ID, UTR, Retailer, Mobile..."
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <div className="w-36">
            <Select
              value={typeFilter}
              onChange={(e) => onTypeChange(e.target.value)}
              options={[
                { label: 'All Types', value: 'ALL' },
                { label: 'Pay-In', value: 'PAY_IN' },
                { label: 'Pay-Out', value: 'PAY_OUT' },
              ]}
            />
          </div>

          <div className="w-40">
            <Select
              value={statusFilter}
              onChange={(e) => onStatusChange(e.target.value)}
              options={[
                { label: 'All Statuses', value: 'ALL' },
                { label: 'SUCCESS', value: 'SUCCESS' },
                { label: 'PENDING', value: 'PENDING' },
                { label: 'PROCESSING', value: 'PROCESSING' },
                { label: 'FAILED', value: 'FAILED' },
                { label: 'REVERSED', value: 'REVERSED' },
              ]}
            />
          </div>

          <div className="w-44">
            <Select
              value={distributorFilter}
              onChange={(e) => onDistributorChange(e.target.value)}
              options={[
                { label: 'All Distributors', value: 'ALL' },
                ...distributors.map((d) => ({
                  label: `${d.name} (${d.code})`,
                  value: d.id,
                })),
              ]}
            />
          </div>

          <div className="w-44">
            <Select
              value={retailerFilter}
              onChange={(e) => onRetailerChange(e.target.value)}
              options={[
                { label: 'All Retailers', value: 'ALL' },
                ...retailers.map((r) => ({
                  label: `${r.name} (${r.code})`,
                  value: r.id,
                })),
              ]}
            />
          </div>

          <div className="w-36">
            <Select
              value={paymentModeFilter}
              onChange={(e) => onPaymentModeChange(e.target.value)}
              options={[
                { label: 'All Modes', value: 'ALL' },
                { label: 'UPI', value: 'UPI' },
                { label: 'IMPS', value: 'IMPS' },
                { label: 'NEFT', value: 'NEFT' },
                { label: 'RTGS', value: 'RTGS' },
                { label: 'CARD', value: 'CARD' },
              ]}
            />
          </div>

          {isFiltered && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onReset}
              className="text-xs text-slate-500 hover:text-slate-900"
            >
              Reset Filters
            </Button>
          )}

          {onRefresh && (
            <Button
              variant="outline"
              size="sm"
              onClick={onRefresh}
              leftIcon={<RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />}
            >
              Refresh
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
