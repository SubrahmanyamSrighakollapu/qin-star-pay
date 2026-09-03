'use client';

import React from 'react';
import { MOCK_CURRENT_USER } from '@/config/roles';
import { checkPermission, checkAnyPermission, checkAllPermissions } from '@/config/permissions';
import { AccessDenied } from './AccessDenied';

export interface PermissionGuardProps {
  permission?: string;
  anyPermissions?: string[];
  allPermissions?: string[];
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

export const PermissionGuard: React.FC<PermissionGuardProps> = ({
  permission,
  anyPermissions,
  allPermissions,
  fallback,
  children,
}) => {
  const user = MOCK_CURRENT_USER;

  let isAllowed = true;

  if (permission) {
    isAllowed = checkPermission(user, permission);
  } else if (anyPermissions && anyPermissions.length > 0) {
    isAllowed = checkAnyPermission(user, anyPermissions);
  } else if (allPermissions && allPermissions.length > 0) {
    isAllowed = checkAllPermissions(user, allPermissions);
  }

  if (!isAllowed) {
    return fallback ? <>{fallback}</> : <AccessDenied requiredPermission={permission} />;
  }

  return <>{children}</>;
};
