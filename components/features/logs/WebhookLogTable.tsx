'use client';

import React from 'react';
import { Table } from '@/components/ui/Table';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Button } from '@/components/ui/Button';
import { WebhookLog } from '@/types/domain';
import { formatDate } from '@/utils/formatters';
import { TraceReferenceBadge } from './TraceReferenceBadge';
import { Eye, RotateCcw } from 'lucide-react';

export interface WebhookLogTableProps {
  data: WebhookLog[];
  isLoading?: boolean;
  onViewLog: (log: WebhookLog) => void;
  onRetryWebhook: (log: WebhookLog) => void;
  onOpenTraceSearch?: (traceId: string) => void;
}

export const WebhookLogTable: React.FC<WebhookLogTableProps> = ({
  data,
  isLoading = false,
  onViewLog,
  onRetryWebhook,
  onOpenTraceSearch,
}) => {
  const columns = [
    {
      key: 'id',
      header: 'Webhook Log ID',
      render: (row: WebhookLog) => (
        <div>
          <span className="font-mono font-bold text-[var(--primary)] text-xs block">{row.id}</span>
          <span className="font-mono text-[10px] text-purple-700 font-bold">{row.direction}</span>
        </div>
      ),
    },
    {
      key: 'eventType',
      header: 'Event Type / Target Endpoint',
      render: (row: WebhookLog) => (
        <div>
          <span className="px-1.5 py-0.2 rounded text-[10px] font-mono font-bold bg-blue-50 text-blue-900 border border-blue-200">
            {row.eventType}
          </span>
          <div className="font-mono text-[11px] text-slate-700 truncate max-w-[240px] block mt-0.5">{row.endpointUrl}</div>
        </div>
      ),
    },
    {
      key: 'attempts',
      header: 'Attempts / Latency',
      align: 'center' as const,
      render: (row: WebhookLog) => (
        <div>
          <span className="font-mono font-bold text-xs text-slate-900">{row.attemptCount} Attempts</span>
          <div className="font-mono text-[10px] text-slate-500">HTTP {row.httpStatus}</div>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Delivery Status',
      align: 'center' as const,
      render: (row: WebhookLog) => <StatusBadge status={row.status} size="sm" />,
    },
    {
      key: 'traceId',
      header: 'Trace Reference',
      render: (row: WebhookLog) => <TraceReferenceBadge traceId={row.traceId} onClick={onOpenTraceSearch} />,
    },
    {
      key: 'lastAttemptAt',
      header: 'Last Attempt',
      render: (row: WebhookLog) => (
        <span className="text-xs text-slate-500 font-mono whitespace-nowrap">{formatDate(row.lastAttemptAt)}</span>
      ),
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
            <Button variant="outline" size="sm" onClick={() => onViewLog(row)} leftIcon={<Eye className="w-3.5 h-3.5" />}>
              View
            </Button>
            {row.status !== 'DELIVERED' && (
              <Button
                variant="outline"
                size="sm"
                className="px-2 text-purple-700 hover:bg-purple-50"
                onClick={() => onRetryWebhook(row)}
                title="Retry Webhook Delivery"
                aria-label="Retry Webhook Delivery"
              >
                <RotateCcw className="w-3.5 h-3.5 text-purple-600" />
              </Button>
            )}
          </div>
        )}
      />
    </div>
  );
};
