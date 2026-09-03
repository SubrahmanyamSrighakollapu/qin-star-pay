'use client';

import React from 'react';
import { MOCK_CURRENT_USER } from '@/config/roles';
import { checkPermission } from '@/config/permissions';
import { Button, ButtonProps } from '@/components/ui/Button';

export interface PermissionButtonProps extends ButtonProps {
  requiredPermission?: string;
  hideIfUnauthorized?: boolean;
}

export const PermissionButton: React.FC<PermissionButtonProps> = ({
  requiredPermission,
  hideIfUnauthorized = false,
  disabled,
  title,
  children,
  ...props
}) => {
  const user = MOCK_CURRENT_USER;
  const isAuthorized = requiredPermission ? checkPermission(user, requiredPermission) : true;

  if (!isAuthorized && hideIfUnauthorized) {
    return null;
  }

  return (
    <Button
      {...props}
      disabled={disabled || !isAuthorized}
      title={!isAuthorized ? `Requires permission: ${requiredPermission}` : title}
    >
      {children}
    </Button>
  );
};
