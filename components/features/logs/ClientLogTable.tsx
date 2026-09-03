'use client';

import React from 'react';
import { Table } from '@/components/ui/Table';
import { Button } from '@/components/ui/Button';
import { ClientLog } from '@/types/domain';
import { formatDate } from '@/utils/formatters';
import { TraceReferenceBadge } from './TraceReferenceBadge';
import { Eye } from 'lucide-react';

export interface ClientLogTableProps {
  data: ClientLog[];
  isLoading?: boolean;
  onViewLog: (log: ClientLog) => void;
  onOpenTraceSearch?: (traceId: string) => void;
}

export const ClientLogTable: React.FC<ClientLogTableProps> = ({
  data,
  isLoading = false,
  onViewLog,
  onOpenTraceSearch,
}) => {
  const columns = [
    {
      key: 'id',
      header: 'Client Log ID',
      render: (row: ClientLog) => (
        <div>
          <span className="font-mono font-bold text-[var(--primary)] text-xs block">{row.id}</span>
          <span className="font-mono text-[11px] text-slate-500">{row.requestReference}</span>
        </div>
      ),
    },
    {
      key: 'clientEntity',
      header: 'Client / Entity ID',
      render: (row: ClientLog) => (
        <div>
          <div className="font-semibold text-xs text-slate-900">{row.clientEntity}</div>
          <div className="font-mono text-[11px] text-purple-700">{row.clientId} • {row.environment}</div>
        </div>
      ),
    },
    {
      key: 'endpoint',
      header: 'Endpoint / Method',
      render: (row: ClientLog) => (
        <div>
          <span className="font-mono text-xs text-slate-900 block truncate max-w-[200px]">{row.endpoint}</span>
          <span className="font-mono text-[10px] text-purple-700 font-bold">{row.httpMethod}</span>
        </div>
      ),
    },
    {
      key: 'httpStatus',
      header: 'Status / Latency',
      align: 'center' as const,
      render: (row: ClientLog) => (
        <div>
          <span className={`font-mono font-bold text-xs ${row.httpStatus === 200 ? 'text-emerald-700' : 'text-rose-700'}`}>
            HTTP {row.httpStatus}
          </span>
          <div className="font-mono text-[10px] text-slate-500">{row.responseTimeMs}ms</div>
        </div>
      ),
    },
    {
      key: 'ipAddress',
      header: 'IP Address',
      render: (row: ClientLog) => (
        <span className="font-mono text-xs text-slate-700">{row.ipAddress}</span>
      ),
    },
    {
      key: 'traceId',
      header: 'Trace Reference',
      render: (row: ClientLog) => <TraceReferenceBadge traceId={row.traceId} onClick={onOpenTraceSearch} />,
    },
    {
      key: 'createdAt',
      header: 'Date & Time',
      render: (row: ClientLog) => (
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
          <Button variant="outline" size="sm" onClick={() => onViewLog(row)} leftIcon={<Eye className="w-3.5 h-3.5" />}>
            View
          </Button>
        )}
      />
    </div>
  );
};
