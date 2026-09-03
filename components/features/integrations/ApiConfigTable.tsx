'use client';

import React from 'react';
import { Table } from '@/components/ui/Table';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Button } from '@/components/ui/Button';
import { ApiConfiguration } from '@/types/domain';
import { Key } from 'lucide-react';

export interface ApiConfigTableProps {
  data: ApiConfiguration[];
  isLoading?: boolean;
  onEditApiConfig: (config: ApiConfiguration) => void;
}

export const ApiConfigTable: React.FC<ApiConfigTableProps> = ({
  data,
  isLoading = false,
  onEditApiConfig,
}) => {
  const columns = [
    {
      key: 'providerName',
      header: 'Provider / Environment',
      render: (row: ApiConfiguration) => (
        <div>
          <div className="font-semibold text-xs text-slate-900">{row.providerName}</div>
          <div className="font-mono text-[11px] text-purple-700 font-bold">{row.environment}</div>
        </div>
      ),
    },
    {
      key: 'baseUrl',
      header: 'Base API URL',
      render: (row: ApiConfiguration) => (
        <span className="font-mono text-xs text-slate-700 truncate max-w-[260px] block">{row.baseUrl}</span>
      ),
    },
    {
      key: 'authType',
      header: 'Auth Type',
      align: 'center' as const,
      render: (row: ApiConfiguration) => (
        <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-slate-100 text-slate-800 border border-slate-200">
          {row.authType}
        </span>
      ),
    },
    {
      key: 'credentials',
      header: 'Masked Credentials',
      render: (row: ApiConfiguration) => (
        <div className="font-mono text-xs text-slate-600 space-y-0.5">
          {row.apiKeyMasked && (
            <div>API Key: <strong className="text-slate-900">{row.apiKeyMasked}</strong></div>
          )}
          {row.clientSecretMasked && (
            <div>Secret: <strong className="text-slate-900">{row.clientSecretMasked}</strong></div>
          )}
          {row.usernameMasked && (
            <div>User: <strong className="text-slate-900">{row.usernameMasked}</strong></div>
          )}
        </div>
      ),
    },
    {
      key: 'timeout',
      header: 'Timeout / Retries',
      align: 'center' as const,
      render: (row: ApiConfiguration) => (
        <span className="font-mono text-xs text-slate-700">{row.timeout}ms ({row.retryCount} retries)</span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      align: 'center' as const,
      render: (row: ApiConfiguration) => <StatusBadge status={row.status} size="sm" />,
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
          <Button variant="outline" size="sm" onClick={() => onEditApiConfig(row)} leftIcon={<Key className="w-3.5 h-3.5" />}>
            Configure Credentials
          </Button>
        )}
      />
    </div>
  );
};
