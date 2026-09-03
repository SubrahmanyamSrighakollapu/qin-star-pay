'use client';

import React from 'react';
import { Table } from '@/components/ui/Table';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Button } from '@/components/ui/Button';
import { Provider } from '@/types/domain';
import { Eye, Activity, Edit3, Power } from 'lucide-react';

export interface ProviderTableProps {
  data: Provider[];
  isLoading?: boolean;
  onViewProvider: (provider: Provider) => void;
  onEditProvider: (provider: Provider) => void;
  onTestConnection: (provider: Provider) => void;
  onToggleStatus: (provider: Provider) => void;
}

export const ProviderTable: React.FC<ProviderTableProps> = ({
  data,
  isLoading = false,
  onViewProvider,
  onEditProvider,
  onTestConnection,
  onToggleStatus,
}) => {
  const columns = [
    {
      key: 'name',
      header: 'Provider / Code',
      render: (row: Provider) => (
        <div>
          <div className="font-semibold text-xs text-slate-900">{row.name}</div>
          <div className="font-mono text-[11px] text-purple-700 font-bold">{row.code} • {row.environment}</div>
        </div>
      ),
    },
    {
      key: 'providerType',
      header: 'Provider Type',
      align: 'center' as const,
      render: (row: Provider) => (
        <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-slate-100 text-slate-800 border border-slate-200">
          {row.providerType}
        </span>
      ),
    },
    {
      key: 'supportedServices',
      header: 'Supported Services',
      render: (row: Provider) => (
        <div className="flex flex-wrap gap-1 max-w-[220px]">
          {row.supportedServices.map((svc) => (
            <span key={svc} className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-blue-50 text-blue-800 border border-blue-200">
              {svc}
            </span>
          ))}
        </div>
      ),
    },
    {
      key: 'priority',
      header: 'Priority',
      align: 'center' as const,
      render: (row: Provider) => (
        <span className="font-mono font-bold text-xs text-slate-800">P{row.priority}</span>
      ),
    },
    {
      key: 'successRate',
      header: 'Success Rate',
      align: 'right' as const,
      render: (row: Provider) => (
        <span
          className={`font-mono font-extrabold text-xs ${
            row.successRate >= 98 ? 'text-emerald-700' : row.successRate >= 90 ? 'text-amber-700' : 'text-rose-700'
          }`}
        >
          {row.successRate}%
        </span>
      ),
    },
    {
      key: 'avgResponseTime',
      header: 'Avg Latency',
      align: 'right' as const,
      render: (row: Provider) => (
        <span className="font-mono text-xs text-slate-700">{row.avgResponseTime}ms</span>
      ),
    },
    {
      key: 'healthStatus',
      header: 'Health',
      align: 'center' as const,
      render: (row: Provider) => <StatusBadge status={row.healthStatus} size="sm" />,
    },
    {
      key: 'status',
      header: 'Status',
      align: 'center' as const,
      render: (row: Provider) => <StatusBadge status={row.status} size="sm" />,
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
          <div className="flex items-center gap-1">
            <Button variant="outline" size="sm" onClick={() => onViewProvider(row)} leftIcon={<Eye className="w-3.5 h-3.5" />}>
              View
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="px-2"
              onClick={() => onTestConnection(row)}
              title="Test Gateway Connection"
              aria-label="Test Gateway Connection"
            >
              <Activity className="w-3.5 h-3.5 text-blue-600" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="px-2"
              onClick={() => onEditProvider(row)}
              title="Edit Settings"
              aria-label="Edit Settings"
            >
              <Edit3 className="w-3.5 h-3.5 text-slate-600" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="px-2"
              onClick={() => onToggleStatus(row)}
              title={row.status === 'ACTIVE' ? 'Disable Provider' : 'Enable Provider'}
              aria-label={row.status === 'ACTIVE' ? 'Disable Provider' : 'Enable Provider'}
            >
              <Power className={`w-3.5 h-3.5 ${row.status === 'ACTIVE' ? 'text-rose-600' : 'text-emerald-600'}`} />
            </Button>
          </div>
        )}
      />
    </div>
  );
};
