'use client';

import React from 'react';
import { Table } from '@/components/ui/Table';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Button } from '@/components/ui/Button';
import { CallbackLog } from '@/types/domain';
import { formatDate } from '@/utils/formatters';
import { TraceReferenceBadge } from './TraceReferenceBadge';
import { Eye, RotateCcw } from 'lucide-react';

export interface CallbackLogTableProps {
  data: CallbackLog[];
  isLoading?: boolean;
  onViewLog: (log: CallbackLog) => void;
  onRetryProcessing: (log: CallbackLog) => void;
  onOpenTraceSearch?: (traceId: string) => void;
}

export const CallbackLogTable: React.FC<CallbackLogTableProps> = ({
  data,
  isLoading = false,
  onViewLog,
  onRetryProcessing,
  onOpenTraceSearch,
}) => {
  const columns = [
    {
      key: 'id',
      header: 'Callback ID / Ref',
      render: (row: CallbackLog) => (
        <div>
          <div className="flex items-center gap-1.5">
            <span className="font-mono font-bold text-[var(--primary)] text-xs">{row.id}</span>
            {row.isDuplicate && (
              <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300" title={`Duplicate of ${row.originalCallbackId}`}>
                DUPLICATE
              </span>
            )}
          </div>
          <span className="font-mono text-[11px] text-slate-500">{row.providerReference}</span>
        </div>
      ),
    },
    {
      key: 'providerName',
      header: 'Provider / Event',
      render: (row: CallbackLog) => (
        <div>
          <div className="font-semibold text-xs text-slate-900">{row.providerName}</div>
          <span className="px-1.5 py-0.2 rounded text-[10px] font-mono font-bold bg-blue-50 text-blue-900 border border-blue-200">
            {row.eventType}
          </span>
        </div>
      ),
    },
    {
      key: 'signatureVerification',
      header: 'Signature Status',
      align: 'center' as const,
      render: (row: CallbackLog) => <StatusBadge status={row.signatureVerification} size="sm" />,
    },
    {
      key: 'processingStatus',
      header: 'Processing Status',
      align: 'center' as const,
      render: (row: CallbackLog) => <StatusBadge status={row.processingStatus} size="sm" />,
    },
    {
      key: 'traceId',
      header: 'Trace Reference',
      render: (row: CallbackLog) => <TraceReferenceBadge traceId={row.traceId} onClick={onOpenTraceSearch} />,
    },
    {
      key: 'createdAt',
      header: 'Received At',
      render: (row: CallbackLog) => (
        <span className="text-xs text-slate-500 font-mono whitespace-nowrap">{formatDate(row.createdAt)}</span>
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
            {row.processingStatus === 'FAILED' && (
              <Button
                variant="outline"
                size="sm"
                className="px-2 text-amber-700 hover:bg-amber-50"
                onClick={() => onRetryProcessing(row)}
                title="Retry Internal Callback Processing"
                aria-label="Retry Internal Callback Processing"
              >
                <RotateCcw className="w-3.5 h-3.5 text-amber-600" />
              </Button>
            )}
          </div>
        )}
      />
    </div>
  );
};
