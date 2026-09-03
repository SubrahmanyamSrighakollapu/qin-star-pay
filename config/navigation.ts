import { UserContext, canAccessRoute, UserRole } from './roles';

export interface NavigationItem {
  id: string;
  label: string;
  iconName?: string;
  path?: string;
  roles?: UserRole[];
  requiredPermissions?: string[];
  children?: NavigationItem[];
  badge?: string | number;
}

export const NAVIGATION_CONFIG: NavigationItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    iconName: 'LayoutDashboard',
    path: '/dashboard',
  },
  {
    id: 'transactions',
    label: 'Transactions',
    iconName: 'ArrowLeftRight',
    roles: ['SUPER_ADMIN', 'OPERATIONS', 'ACCOUNTS', 'SUPPORT'],
    children: [
      { id: 'payin', label: 'Pay-In', path: '/transactions/payin' },
      { id: 'payout', label: 'Pay-Out', path: '/transactions/payout' },
      { id: 'all-txns', label: 'All Transactions', path: '/transactions/all' },
      { id: 'txn-search', label: 'Transaction Search', path: '/transactions/search' },
    ],
  },
  {
    id: 'users',
    label: 'Users',
    iconName: 'Users',
    roles: ['SUPER_ADMIN', 'SALES', 'SUPPORT', 'OPERATIONS'],
    children: [
      { id: 'distributors', label: 'Distributors', path: '/users/distributors' },
      { id: 'retailers', label: 'Retailers', path: '/users/retailers' },
      { id: 'merchants', label: 'Merchants', path: '/users/merchants' },
      { id: 'backoffice', label: 'Back Office Users', path: '/users/backoffice' },
      { id: 'mapping', label: 'User Mapping', path: '/users/mapping' },
    ],
  },
  {
    id: 'kyc',
    label: 'KYC & Onboarding',
    iconName: 'ShieldCheck',
    path: '/kyc',
    roles: ['SUPER_ADMIN', 'KYC', 'OPERATIONS'],
  },
  {
    id: 'wallet',
    label: 'Wallet & Ledger',
    iconName: 'Wallet',
    roles: ['SUPER_ADMIN', 'ACCOUNTS', 'OPERATIONS'],
    children: [
      { id: 'balances', label: 'Available Balances', path: '/wallet/balances' },
      { id: 'credit-debit', label: 'Credit / Debit', path: '/wallet/credit-debit' },
      { id: 'debit-requests', label: 'Debit Requests', path: '/wallet/debit-requests' },
      { id: 'ledger', label: 'Ledger', path: '/wallet/ledger' },
    ],
  },
  {
    id: 'settlements',
    label: 'Settlements',
    iconName: 'Landmark',
    path: '/settlements',
    roles: ['SUPER_ADMIN', 'ACCOUNTS', 'OPERATIONS'],
  },
  {
    id: 'reports',
    label: 'Reports',
    iconName: 'BarChart3',
    roles: ['SUPER_ADMIN', 'ACCOUNTS', 'SALES', 'OPERATIONS'],
    children: [
      { id: 'txn-report', label: 'Transaction Report', path: '/reports/transactions' },
      { id: 'ledger-report', label: 'Ledger Report', path: '/reports/ledger' },
      { id: 'settlement-report', label: 'Settlement Report', path: '/reports/settlements' },
      { id: 'balance-report', label: 'Balance Report', path: '/reports/balance' },
      { id: 'chargeback-report', label: 'Chargeback Report', path: '/reports/chargebacks' },
      { id: 'api-perf-report', label: 'API Performance', path: '/reports/api-performance' },
    ],
  },
  {
    id: 'chargebacks',
    label: 'Chargebacks',
    iconName: 'RotateCcw',
    path: '/chargebacks',
    roles: ['SUPER_ADMIN', 'OPERATIONS', 'ACCOUNTS'],
  },
  {
    id: 'invoices',
    label: 'Invoices & Tax',
    iconName: 'Receipt',
    roles: ['SUPER_ADMIN', 'ACCOUNTS'],
    children: [
      { id: 'invoices-list', label: 'Invoices', path: '/invoices' },
      { id: 'notes', label: 'Credit / Debit Notes', path: '/invoices/notes' },
      { id: 'tax-summary', label: 'GST & Tax Summary', path: '/invoices/tax-summary' },
      { id: 'tds', label: 'TDS Management', path: '/invoices/tds' },
    ],
  },
  {
    id: 'notifications',
    label: 'Notifications',
    iconName: 'Bell',
    path: '/notifications',
    roles: ['SUPER_ADMIN', 'OPERATIONS', 'SUPPORT', 'ACCOUNTS'],
  },
  {
    id: 'integrations',
    label: 'Integrations',
    iconName: 'Plug',
    roles: ['SUPER_ADMIN', 'OPERATIONS'],
    children: [
      { id: 'providers', label: 'Providers', path: '/integrations/providers' },
      { id: 'api-config', label: 'API Configuration', path: '/integrations/api-config' },
      { id: 'service-config', label: 'Service Configuration', path: '/integrations/service-config' },
      { id: 'routing', label: 'Transaction Routing', path: '/integrations/routing' },
      { id: 'webhooks', label: 'Webhooks', path: '/integrations/webhooks' },
    ],
  },
  {
    id: 'logs',
    label: 'Logs',
    iconName: 'Terminal',
    roles: ['SUPER_ADMIN', 'OPERATIONS', 'SUPPORT'],
    children: [
      { id: 'api-logs', label: 'API Logs', path: '/logs/api' },
      { id: 'client-logs', label: 'Client Logs', path: '/logs/client' },
      { id: 'callback-logs', label: 'Callback Logs', path: '/logs/callbacks' },
      { id: 'webhook-logs', label: 'Webhook Logs', path: '/logs/webhooks' },
      { id: 'login-logs', label: 'Login Logs', path: '/logs/login' },
      { id: 'activity-logs', label: 'Activity Logs', path: '/logs/activity' },
    ],
  },
  {
    id: 'administration',
    label: 'Administration',
    iconName: 'Settings',
    roles: ['SUPER_ADMIN'],
    children: [
      { id: 'admin-users', label: 'Admin Users', path: '/administration/users' },
      { id: 'roles', label: 'Roles & Permissions', path: '/administration/roles' },
      { id: 'limits', label: 'Transaction Limits', path: '/administration/limits' },
      { id: 'fees', label: 'Fee & Charge Master', path: '/administration/fees' },
      { id: 'tax', label: 'Tax Configuration', path: '/administration/tax' },
      { id: 'payment-masters', label: 'Payment Masters', path: '/administration/config' },
      { id: 'reason-codes', label: 'Reason Code Master', path: '/administration/reason-codes' },
      { id: 'settings', label: 'Platform Settings', path: '/administration/settings' },
      { id: 'branding', label: 'Branding', path: '/administration/branding' },
      { id: 'security', label: 'Security Settings', path: '/administration/security' },
    ],
  },
];

/**
 * Recursively filters navigation items based on current user role and permissions.
 */
export function filterNavigationByRole(
  items: NavigationItem[],
  user: UserContext
): NavigationItem[] {
  if (!user) return [];
  if (user.role === 'SUPER_ADMIN') return items;

  return items
    .filter((item) => canAccessRoute(user, item.roles, item.requiredPermissions))
    .map((item) => {
      if (item.children) {
        return {
          ...item,
          children: filterNavigationByRole(item.children, user),
        };
      }
      return item;
    })
    .filter((item) => !item.children || item.children.length > 0);
}
