'use client';

import React from 'react';
import { Table } from '@/components/ui/Table';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Button } from '@/components/ui/Button';
import { Notification } from '@/types/domain';
import { formatDate } from '@/utils/formatters';
import { Eye } from 'lucide-react';

export interface NotificationTableProps {
  data: Notification[];
  isLoading?: boolean;
  onViewNotification: (notification: Notification) => void;
}

export const NotificationTable: React.FC<NotificationTableProps> = ({
  data,
  isLoading = false,
  onViewNotification,
}) => {
  const columns = [
    {
      key: 'id',
      header: 'Notification ID / Ref',
      render: (row: Notification) => (
        <div className="flex items-center gap-2">
          {row.status === 'UNREAD' && (
            <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" title="Unread notification" />
          )}
          <div>
            <span className="font-mono font-bold text-[var(--primary)] text-xs block">{row.id}</span>
            <span className="font-mono text-[11px] text-slate-500">{row.entityId || 'N/A'}</span>
          </div>
        </div>
      ),
    },
    {
      key: 'category',
      header: 'Category',
      align: 'center' as const,
      render: (row: Notification) => (
        <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-slate-100 text-slate-800 border border-slate-200">
          {row.category}
        </span>
      ),
    },
    {
      key: 'title',
      header: 'Event Title & Message',
      render: (row: Notification) => (
        <div>
          <div className={`text-xs ${row.status === 'UNREAD' ? 'font-bold text-slate-900' : 'font-semibold text-slate-700'}`}>
            {row.title}
          </div>
          <div className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{row.message}</div>
        </div>
      ),
    },
    {
      key: 'relatedEntity',
      header: 'Related Entity',
      render: (row: Notification) => (
        <div>
          <div className="font-semibold text-xs text-slate-900">{row.relatedEntity || 'System Operation'}</div>
          <div className="text-[11px] text-purple-700 font-semibold">{row.sourceModule}</div>
        </div>
      ),
    },
    {
      key: 'severity',
      header: 'Severity',
      align: 'center' as const,
      render: (row: Notification) => <StatusBadge status={row.severity} size="sm" />,
    },
    {
      key: 'status',
      header: 'Status',
      align: 'center' as const,
      render: (row: Notification) => <StatusBadge status={row.status} size="sm" />,
    },
    {
      key: 'createdAt',
      header: 'Created At',
      render: (row: Notification) => (
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
          <Button variant="outline" size="sm" onClick={() => onViewNotification(row)} leftIcon={<Eye className="w-3.5 h-3.5" />}>
            View
          </Button>
        )}
      />
    </div>
  );
};
