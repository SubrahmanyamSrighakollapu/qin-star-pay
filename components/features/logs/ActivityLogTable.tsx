'use client';

import React from 'react';
import { Table } from '@/components/ui/Table';
import { Button } from '@/components/ui/Button';
import { ActivityLog } from '@/types/domain';
import { formatDate } from '@/utils/formatters';
import { TraceReferenceBadge } from './TraceReferenceBadge';
import { Eye } from 'lucide-react';

export interface ActivityLogTableProps {
  data: ActivityLog[];
  isLoading?: boolean;
  onViewLog: (log: ActivityLog) => void;
  onOpenTraceSearch?: (traceId: string) => void;
}

export const ActivityLogTable: React.FC<ActivityLogTableProps> = ({
  data,
  isLoading = false,
  onViewLog,
  onOpenTraceSearch,
}) => {
  const columns = [
    {
      key: 'id',
      header: 'Activity ID',
      render: (row: ActivityLog) => (
        <div>
          <span className="font-mono font-bold text-[var(--primary)] text-xs block">{row.id}</span>
          <span className="font-mono text-[11px] text-purple-700 font-bold">{row.module}</span>
        </div>
      ),
    },
    {
      key: 'actorName',
      header: 'Actor / Role',
      render: (row: ActivityLog) => (
        <div>
          <div className="font-semibold text-xs text-slate-900">{row.actorName}</div>
          <span className="font-mono text-[11px] text-slate-500 font-bold">{row.actorRole}</span>
        </div>
      ),
    },
    {
      key: 'action',
      header: 'Action & Description',
      render: (row: ActivityLog) => (
        <div>
          <span className="px-1.5 py-0.2 rounded text-[10px] font-mono font-bold bg-purple-50 text-purple-900 border border-purple-200">
            {row.action}
          </span>
          <div className="text-xs text-slate-700 line-clamp-1 mt-0.5">{row.description}</div>
        </div>
      ),
    },
    {
      key: 'entityId',
      header: 'Target Entity',
      render: (row: ActivityLog) => (
        <div>
          <div className="font-semibold text-xs text-slate-900">{row.entityId || 'System'}</div>
          <div className="text-[10px] text-slate-500">{row.entityType}</div>
        </div>
      ),
    },
    {
      key: 'traceId',
      header: 'Trace Reference',
      render: (row: ActivityLog) => <TraceReferenceBadge traceId={row.traceId} onClick={onOpenTraceSearch} />,
    },
    {
      key: 'createdAt',
      header: 'Date & Time',
      render: (row: ActivityLog) => (
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
