'use client';

import React, { useState, useEffect } from 'react';
import { PageContainer } from '@/components/layout/PageContainer';
import { adminService } from '@/services/adminService';
import { Role } from '@/types/domain';
import { RoleTable } from '@/components/features/administration/RoleTable';
import { EditRoleModal } from '@/components/features/administration/EditRoleModal';
import { useModal } from '@/hooks/useModal';

export default function RolesPage() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const editModal = useModal<Role>();

  const loadRoles = () => {
    setIsLoading(true);
    adminService.getRoles().then((res) => {
      if (res.success && res.data) {
        setRoles(res.data);
        setIsLoading(false);
      }
    });
  };

  useEffect(() => {
    let isCancelled = false;
    adminService.getRoles().then((res) => {
      if (!isCancelled && res.success && res.data) {
        setRoles(res.data);
        setIsLoading(false);
      }
    });
    return () => {
      isCancelled = true;
    };
  }, []);

  const handleSavePermissions = async (roleId: string, permissions: string[], reason?: string) => {
    await adminService.updateRolePermissions(roleId, permissions, reason);
    loadRoles();
  };

  return (
    <PageContainer
      title="Roles & Permissions Management"
      description="Configure Role-Based Access Control (RBAC) definitions, custom roles, and module-level permission matrices."
    >
      <div className="space-y-6">
        <RoleTable
          data={roles}
          isLoading={isLoading}
          onEditRole={(role) => editModal.open(role)}
        />

        <EditRoleModal
          isOpen={editModal.isOpen}
          onClose={editModal.close}
          role={editModal.data}
          onSavePermissions={handleSavePermissions}
        />
      </div>
    </PageContainer>
  );
}
