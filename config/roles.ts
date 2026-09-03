/**
 * Role-Based Access Control (RBAC) foundation for Qin Star Pay.
 */

export const USER_ROLES = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  SALES: 'SALES',
  KYC: 'KYC',
  ACCOUNTS: 'ACCOUNTS',
  OPERATIONS: 'OPERATIONS',
  SUPPORT: 'SUPPORT',
  DISTRIBUTOR: 'DISTRIBUTOR',
  RETAILER: 'RETAILER',
  MERCHANT: 'MERCHANT',
} as const;

export type UserRole = keyof typeof USER_ROLES;

export interface UserContext {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  permissions: string[];
}

export const MOCK_CURRENT_USER: UserContext = {
  id: 'usr_admin_01',
  name: 'Qin Star Admin',
  email: 'admin@qinstarpay.com',
  role: 'SUPER_ADMIN',
  permissions: ['*'],
};

/**
 * Checks if a user has a specific permission.
 */
export function hasPermission(user: UserContext, requiredPermission: string): boolean {
  if (!user) return false;
  if (user.permissions.includes('*')) return true;
  return user.permissions.includes(requiredPermission);
}

/**
 * Checks if a user can access a route based on their role and permissions.
 */
export function canAccessRoute(
  user: UserContext,
  allowedRoles?: UserRole[],
  requiredPermissions?: string[]
): boolean {
  if (!user) return false;
  if (user.role === 'SUPER_ADMIN') return true;

  if (allowedRoles && allowedRoles.length > 0) {
    if (!allowedRoles.includes(user.role)) {
      return false;
    }
  }

  if (requiredPermissions && requiredPermissions.length > 0) {
    const hasAll = requiredPermissions.every((perm) => hasPermission(user, perm));
    if (!hasAll) return false;
  }

  return true;
}
