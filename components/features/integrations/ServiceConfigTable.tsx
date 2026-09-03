'use client';

import React from 'react';
import { Table } from '@/components/ui/Table';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Button } from '@/components/ui/Button';
import { ServiceConfiguration } from '@/types/domain';
import { formatCurrency } from '@/utils/formatters';
import { Settings } from 'lucide-react';

export interface ServiceConfigTableProps {
  data: ServiceConfiguration[];
  isLoading?: boolean;
  onEditServiceConfig: (config: ServiceConfiguration) => void;
}

export const ServiceConfigTable: React.FC<ServiceConfigTableProps> = ({
  data,
  isLoading = false,
  onEditServiceConfig,
}) => {
  const columns = [
    {
      key: 'service',
      header: 'Service Category',
      render: (row: ServiceConfiguration) => (
        <span className="font-bold text-xs text-[var(--primary)] uppercase">{row.service}</span>
      ),
    },
    {
      key: 'providerName',
      header: 'Mapped Provider',
      render: (row: ServiceConfiguration) => (
        <span className="font-semibold text-xs text-slate-900">{row.providerName}</span>
      ),
    },
    {
      key: 'supportedModes',
      header: 'Supported Modes',
      render: (row: ServiceConfiguration) => (
        <div className="flex flex-wrap gap-1">
          {row.supportedModes.map((m) => (
            <span key={m} className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-purple-50 text-purple-900 border border-purple-200">
              {m}
            </span>
          ))}
        </div>
      ),
    },
    {
      key: 'amountLimits',
      header: 'Min / Max Amount Range',
      render: (row: ServiceConfiguration) => (
        <span className="font-mono text-xs text-slate-700">
          {formatCurrency(row.minAmount)} – {formatCurrency(row.maxAmount)}
        </span>
      ),
    },
    {
      key: 'priority',
      header: 'Priority',
      align: 'center' as const,
      render: (row: ServiceConfiguration) => (
        <span className="font-mono font-bold text-xs text-slate-800">P{row.priority}</span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      align: 'center' as const,
      render: (row: ServiceConfiguration) => <StatusBadge status={row.status} size="sm" />,
    },
  ];

  return (
    <div className="overflow-x-auto border border-[var(--border)] rounded-[var(--radius-xl)] bg-white shadow-xs">
      <Table
        columns={columns}
        data={data}
        keyExtractor={(row) => row.id}
        isLoading={isLoading}
        renderActions={(row) => (
          <Button variant="outline" size="sm" onClick={() => onEditServiceConfig(row)} leftIcon={<Settings className="w-3.5 h-3.5" />}>
            Edit Limits
          </Button>
        )}
      />
    </div>
  );
};
