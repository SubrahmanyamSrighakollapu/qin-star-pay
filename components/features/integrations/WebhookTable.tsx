'use client';

import React from 'react';
import { Table } from '@/components/ui/Table';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Button } from '@/components/ui/Button';
import { WebhookConfiguration } from '@/types/domain';
import { formatDate } from '@/utils/formatters';
import { Send, Lock } from 'lucide-react';

export interface WebhookTableProps {
  data: WebhookConfiguration[];
  isLoading?: boolean;
  onTestWebhook: (webhook: WebhookConfiguration) => void;
}

export const WebhookTable: React.FC<WebhookTableProps> = ({
  data,
  isLoading = false,
  onTestWebhook,
}) => {
  const columns = [
    {
      key: 'id',
      header: 'Webhook ID / Provider',
      render: (row: WebhookConfiguration) => (
        <div>
          <span className="font-mono font-bold text-[var(--primary)] text-xs block">{row.id}</span>
          <span className="font-semibold text-xs text-slate-900">{row.providerName}</span>
        </div>
      ),
    },
    {
      key: 'eventType',
      header: 'Event Type / Direction',
      render: (row: WebhookConfiguration) => (
        <div>
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-50 text-blue-900 border border-blue-200">
            {row.eventType}
          </span>
          <div className="font-mono text-[10px] text-purple-700 font-bold mt-0.5">{row.direction}</div>
        </div>
      ),
    },
    {
      key: 'endpointUrl',
      header: 'Endpoint URL',
      render: (row: WebhookConfiguration) => (
        <span className="font-mono text-xs text-slate-700 truncate max-w-[260px] block">{row.endpointUrl}</span>
      ),
    },
    {
      key: 'signatureKeyMasked',
      header: 'Signature Key',
      render: (row: WebhookConfiguration) => (
        <span className="font-mono text-xs text-slate-600 flex items-center gap-1">
          <Lock className="w-3 h-3 text-purple-600 shrink-0" />
          <strong className="text-slate-900">{row.signatureKeyMasked}</strong>
        </span>
      ),
    },
    {
      key: 'lastReceivedAt',
      header: 'Last Received / Failures',
      render: (row: WebhookConfiguration) => (
        <div>
          <span className="font-mono text-xs text-slate-500 block">
            {row.lastReceivedAt ? formatDate(row.lastReceivedAt) : 'Never'}
          </span>
          {row.failureCount > 0 ? (
            <span className="text-[10px] font-bold text-rose-600">{row.failureCount} Failures</span>
          ) : (
            <span className="text-[10px] text-emerald-600 font-bold">0 Failures</span>
          )}
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      align: 'center' as const,
      render: (row: WebhookConfiguration) => <StatusBadge status={row.status} size="sm" />,
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
          <Button variant="outline" size="sm" onClick={() => onTestWebhook(row)} leftIcon={<Send className="w-3.5 h-3.5" />}>
            Test Webhook
          </Button>
        )}
      />
    </div>
  );
};
