'use client';

import React from 'react';
import { Drawer } from '@/components/ui/Drawer';
import { Card } from '@/components/ui/Card';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Button } from '@/components/ui/Button';
import { AdminUser, Role } from '@/types/domain';
import { formatDate } from '@/utils/formatters';
import { UserX, UserCheck, Unlock } from 'lucide-react';

export interface AdminUserDetailsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  user: AdminUser | null;
  roles: Role[];
  onStatusChange: (user: AdminUser, newStatus: AdminUser['status']) => void;
}

export const AdminUserDetailsDrawer: React.FC<AdminUserDetailsDrawerProps> = ({
  isOpen,
  onClose,
  user,
  roles,
  onStatusChange,
}) => {
  if (!user) return null;

  const userRoles = roles.filter((r) => user.roleIds.includes(r.id));
  const effectivePermissions = Array.from(new Set(userRoles.flatMap((r) => r.permissions)));

  return (
    <Drawer isOpen={isOpen} onClose={onClose} title="Administrative Staff Inspection" size="xl" className="w-full md:w-[880px] md:max-w-[92vw]">
      <div className="space-y-6 text-xs">
        {/* Header Banner */}
        <div className="p-4 bg-white border border-[var(--border)] rounded-[var(--radius-xl)] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-extrabold text-base md:text-lg text-[var(--primary)]">{user.name}</h2>
              <StatusBadge status={user.status} size="sm" />
            </div>
            <div className="text-xs text-[var(--text-muted)] mt-0.5">
              Emp ID: <strong className="font-mono text-purple-700">{user.employeeId}</strong> | Department: <strong>{user.department}</strong> | Created: <strong>{formatDate(user.createdAt)}</strong>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {user.status === 'ACTIVE' ? (
              <Button variant="outline" size="sm" className="text-rose-700 hover:bg-rose-50" onClick={() => onStatusChange(user, 'INACTIVE')} leftIcon={<UserX className="w-3.5 h-3.5" />}>
                Deactivate Staff
              </Button>
            ) : user.status === 'LOCKED' ? (
              <Button variant="outline" size="sm" className="text-amber-700 hover:bg-amber-50" onClick={() => onStatusChange(user, 'ACTIVE')} leftIcon={<Unlock className="w-3.5 h-3.5" />}>
                Unlock Account
              </Button>
            ) : (
              <Button variant="outline" size="sm" className="text-emerald-700 hover:bg-emerald-50" onClick={() => onStatusChange(user, 'ACTIVE')} leftIcon={<UserCheck className="w-3.5 h-3.5" />}>
                Activate Account
              </Button>
            )}
          </div>
        </div>

        {/* Profile Card */}
        <Card title="Staff Identity Profile" subtitle="Contact details & department assignment">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-slate-700">
            <div>Email: <strong className="font-mono text-slate-900 block">{user.email}</strong></div>
            <div>Mobile: <span className="font-mono text-slate-900 block">{user.mobile || 'N/A'}</span></div>
            <div>Department: <strong className="text-slate-900 block">{user.department}</strong></div>
            <div>Created By: <span className="text-slate-900 block">{user.createdBy}</span></div>
            <div>Last Login: <span className="font-mono text-slate-900 block">{user.lastLoginAt ? formatDate(user.lastLoginAt) : 'Never'}</span></div>
            <div>Account Status: <StatusBadge status={user.status} size="sm" /></div>
          </div>
        </Card>

        {/* Assigned Roles Card */}
        <Card title="Assigned System Roles" subtitle="RBAC role definitions">
          <div className="space-y-3">
            {userRoles.map((role) => (
              <div key={role.id} className="p-3 bg-purple-50/60 border border-purple-200 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-xs">{role.name}</span>
                    <span className="font-mono text-[10px] font-extrabold px-1.5 py-0.2 bg-purple-100 text-purple-900 rounded">{role.code}</span>
                  </div>
                  <p className="text-[11px] text-slate-600 mt-0.5">{role.description}</p>
                </div>
                <span className="text-[11px] font-mono font-bold text-purple-800 shrink-0">{role.permissions.length} Permissions</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Effective Permissions Matrix */}
        <Card title="Effective Permissions Union" subtitle="Evaluated permission tokens granted across all assigned roles">
          <div className="flex flex-wrap gap-1.5 max-h-60 overflow-y-auto p-2 border border-slate-200 rounded-lg bg-slate-50">
            {effectivePermissions.map((perm) => (
              <span key={perm} className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-white text-slate-800 border border-slate-200 shadow-2xs">
                {perm}
              </span>
            ))}
          </div>
        </Card>
      </div>
    </Drawer>
  );
};
