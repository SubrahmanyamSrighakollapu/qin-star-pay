'use client';

import React from 'react';
import { Table } from '@/components/ui/Table';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Button } from '@/components/ui/Button';
import { Role } from '@/types/domain';
import { formatDate } from '@/utils/formatters';
import { Edit } from 'lucide-react';

export interface RoleTableProps {
  data: Role[];
  isLoading?: boolean;
  onEditRole: (role: Role) => void;
}

export const RoleTable: React.FC<RoleTableProps> = ({
  data,
  isLoading = false,
  onEditRole,
}) => {
  const columns = [
    {
      key: 'name',
      header: 'Role / Code',
      render: (row: Role) => (
        <div>
          <div className="font-semibold text-xs text-slate-900 flex items-center gap-1.5">
            <span>{row.name}</span>
            {row.isSystemRole && (
              <span className="px-1.5 py-0.2 rounded text-[10px] font-extrabold bg-blue-100 text-blue-900 border border-blue-200">
                SYSTEM
              </span>
            )}
          </div>
          <span className="font-mono text-[11px] text-purple-700 font-bold">{row.code}</span>
        </div>
      ),
    },
    {
      key: 'description',
      header: 'Description',
      render: (row: Role) => (
        <span className="text-xs text-slate-600 line-clamp-1 max-w-[280px] block">{row.description}</span>
      ),
    },
    {
      key: 'assignedUserCount',
      header: 'Staff Assigned',
      align: 'center' as const,
      render: (row: Role) => (
        <span className="font-mono font-bold text-xs text-slate-900">{row.assignedUserCount} Staff</span>
      ),
    },
    {
      key: 'permissions',
      header: 'Permissions',
      align: 'center' as const,
      render: (row: Role) => (
        <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-purple-50 text-purple-900 border border-purple-200">
          {row.permissions.includes('*') ? 'ALL (*)' : `${row.permissions.length} Tokens`}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      align: 'center' as const,
      render: (row: Role) => <StatusBadge status={row.status} size="sm" />,
    },
    {
      key: 'updatedAt',
      header: 'Last Updated',
      render: (row: Role) => (
        <span className="text-xs text-slate-500 font-mono whitespace-nowrap">{formatDate(row.updatedAt)}</span>
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
          <Button variant="outline" size="sm" onClick={() => onEditRole(row)} leftIcon={<Edit className="w-3.5 h-3.5" />}>
            Configure Matrix
          </Button>
        )}
      />
    </div>
  );
};
