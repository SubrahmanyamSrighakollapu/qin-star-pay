'use client';

import React from 'react';
import { Table } from '@/components/ui/Table';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Button } from '@/components/ui/Button';
import { AdminUser } from '@/types/domain';
import { formatDate } from '@/utils/formatters';
import { Eye, Unlock, UserCheck, UserX } from 'lucide-react';

export interface AdminUserTableProps {
  data: AdminUser[];
  isLoading?: boolean;
  onViewUser: (user: AdminUser) => void;
  onStatusChange: (user: AdminUser, newStatus: AdminUser['status']) => void;
}

export const AdminUserTable: React.FC<AdminUserTableProps> = ({
  data,
  isLoading = false,
  onViewUser,
  onStatusChange,
}) => {
  const columns = [
    {
      key: 'id',
      header: 'User ID / Employee ID',
      render: (row: AdminUser) => (
        <div>
          <span className="font-mono font-bold text-[var(--primary)] text-xs block">{row.id}</span>
          <span className="font-mono text-[11px] text-purple-700 font-bold">{row.employeeId}</span>
        </div>
      ),
    },
    {
      key: 'name',
      header: 'Name / Email',
      render: (row: AdminUser) => (
        <div>
          <div className="font-semibold text-xs text-slate-900">{row.name}</div>
          <div className="font-mono text-[11px] text-slate-500">{row.email}</div>
        </div>
      ),
    },
    {
      key: 'department',
      header: 'Department / Role',
      render: (row: AdminUser) => (
        <div>
          <div className="font-semibold text-xs text-slate-800">{row.department}</div>
          <div className="flex flex-wrap gap-1 mt-0.5">
            {row.roleNames.map((role) => (
              <span key={role} className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-purple-50 text-purple-900 border border-purple-200">
                {role}
              </span>
            ))}
          </div>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      align: 'center' as const,
      render: (row: AdminUser) => <StatusBadge status={row.status} size="sm" />,
    },
    {
      key: 'lastLoginAt',
      header: 'Last Login',
      render: (row: AdminUser) => (
        <span className="text-xs text-slate-500 font-mono whitespace-nowrap">
          {row.lastLoginAt ? formatDate(row.lastLoginAt) : 'Never'}
        </span>
      ),
    },
    {
      key: 'createdAt',
      header: 'Created At',
      render: (row: AdminUser) => (
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
            <Button variant="outline" size="sm" onClick={() => onViewUser(row)} leftIcon={<Eye className="w-3.5 h-3.5" />}>
              View
            </Button>
            {row.status === 'ACTIVE' ? (
              <Button
                variant="outline"
                size="sm"
                className="px-2 text-rose-700 hover:bg-rose-50"
                onClick={() => onStatusChange(row, 'INACTIVE')}
                title="Deactivate Staff Account"
                aria-label="Deactivate Staff Account"
              >
                <UserX className="w-3.5 h-3.5 text-rose-600" />
              </Button>
            ) : row.status === 'LOCKED' ? (
              <Button
                variant="outline"
                size="sm"
                className="px-2 text-amber-700 hover:bg-amber-50"
                onClick={() => onStatusChange(row, 'ACTIVE')}
                title="Unlock Staff Account"
                aria-label="Unlock Staff Account"
              >
                <Unlock className="w-3.5 h-3.5 text-amber-600" />
              </Button>
            ) : (
              <Button
                variant="outline"
                size="sm"
                className="px-2 text-emerald-700 hover:bg-emerald-50"
                onClick={() => onStatusChange(row, 'ACTIVE')}
                title="Activate Staff Account"
                aria-label="Activate Staff Account"
              >
                <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
              </Button>
            )}
          </div>
        )}
      />
    </div>
  );
};
