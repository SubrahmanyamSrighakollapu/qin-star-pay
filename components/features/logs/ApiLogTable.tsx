'use client';

import React from 'react';
import { Table } from '@/components/ui/Table';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Button } from '@/components/ui/Button';
import { ApiLog } from '@/types/domain';
import { formatDate } from '@/utils/formatters';
import { TraceReferenceBadge } from './TraceReferenceBadge';
import { Eye } from 'lucide-react';

export interface ApiLogTableProps {
  data: ApiLog[];
  isLoading?: boolean;
  onViewLog: (log: ApiLog) => void;
  onOpenTraceSearch?: (traceId: string) => void;
}

export const ApiLogTable: React.FC<ApiLogTableProps> = ({
  data,
  isLoading = false,
  onViewLog,
  onOpenTraceSearch,
}) => {
  const columns = [
    {
      key: 'id',
      header: 'Log ID / Reference',
      render: (row: ApiLog) => (
        <div>
          <span className="font-mono font-bold text-[var(--primary)] text-xs block">{row.id}</span>
          <span className="font-mono text-[11px] text-slate-500">{row.requestReference}</span>
        </div>
      ),
    },
    {
      key: 'providerName',
      header: 'Provider / Service',
      render: (row: ApiLog) => (
        <div>
          <div className="font-semibold text-xs text-slate-900">{row.providerName}</div>
          <span className="px-1.5 py-0.2 rounded text-[10px] font-mono font-bold bg-blue-50 text-blue-900 border border-blue-200">
            {row.service}
          </span>
        </div>
      ),
    },
    {
      key: 'httpMethod',
      header: 'Method / Status',
      align: 'center' as const,
      render: (row: ApiLog) => (
        <div>
          <span className="font-mono font-bold text-xs text-purple-700">{row.httpMethod}</span>
          <div className={`font-mono text-[11px] font-bold ${row.httpStatus === 200 ? 'text-emerald-700' : 'text-rose-700'}`}>
            HTTP {row.httpStatus}
          </div>
        </div>
      ),
    },
    {
      key: 'resultStatus',
      header: 'Result',
      align: 'center' as const,
      render: (row: ApiLog) => <StatusBadge status={row.resultStatus} size="sm" />,
    },
    {
      key: 'responseTimeMs',
      header: 'Response Time',
      align: 'right' as const,
      render: (row: ApiLog) => (
        <span className="font-mono text-xs text-slate-700 font-bold">{row.responseTimeMs}ms</span>
      ),
    },
    {
      key: 'traceId',
      header: 'Trace Reference',
      render: (row: ApiLog) => <TraceReferenceBadge traceId={row.traceId} onClick={onOpenTraceSearch} />,
    },
    {
      key: 'createdAt',
      header: 'Date & Time',
      render: (row: ApiLog) => (
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
