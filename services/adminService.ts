import {
  AdminUser,
  Role,
  TransactionLimit,
  FeeRule,
  TaxConfigurationItem,
  PaymentMasterItem,
  ReasonCode,
  PlatformSettings,
  AdminSummary,
  PaginationState,
} from '@/types/domain';
import { ApiResponse } from '@/types/common';
import {
  mockAdminUsers,
  mockRoles,
  mockTransactionLimits,
  mockFeeRules,
  mockTaxConfigurations,
  mockPaymentMasters,
  mockReasonCodes,
  mockPlatformSettings,
} from '@/mocks/mockAdmin';
import { resolvePermissionDependencies, PERMISSION_GROUPS } from '@/config/permissions';
import { logService } from './logService';
import { APP_CONFIG } from '@/config';

const inMemoryAdminUsers: AdminUser[] = [...mockAdminUsers];
const inMemoryRoles: Role[] = [...mockRoles];
const inMemoryTransactionLimits: TransactionLimit[] = [...mockTransactionLimits];
const inMemoryFeeRules: FeeRule[] = [...mockFeeRules];
const inMemoryTaxConfigurations: TaxConfigurationItem[] = [...mockTaxConfigurations];
const inMemoryPaymentMasters: PaymentMasterItem[] = [...mockPaymentMasters];
const inMemoryReasonCodes: ReasonCode[] = [...mockReasonCodes];
let inMemoryPlatformSettings: PlatformSettings = { ...mockPlatformSettings };

export interface AdminListResult<T> {
  items: T[];
  pagination: PaginationState;
}

export const adminService = {
  /**
   * Summary Dashboard KPI
   */
  async getSummary(): Promise<ApiResponse<AdminSummary>> {
    if (APP_CONFIG.useMockData) {
      await new Promise((res) => setTimeout(res, 100));

      const totalAdminUsers = inMemoryAdminUsers.length;
      const activeAdminUsers = inMemoryAdminUsers.filter((u) => u.status === 'ACTIVE').length;
      const inactiveAdminUsers = inMemoryAdminUsers.filter((u) => u.status === 'INACTIVE').length;
      const lockedAdminUsers = inMemoryAdminUsers.filter((u) => u.status === 'LOCKED').length;

      const superAdminsCount = inMemoryAdminUsers.filter((u) => u.roleNames.includes('Super Admin')).length;
      const totalRoles = inMemoryRoles.length;
      const systemRolesCount = inMemoryRoles.filter((r) => r.isSystemRole).length;
      const customRolesCount = inMemoryRoles.filter((r) => !r.isSystemRole).length;
      const activeRolesCount = inMemoryRoles.filter((r) => r.status === 'ACTIVE').length;

      const totalPermissions = PERMISSION_GROUPS.reduce((acc, g) => acc + g.permissions.length, 0);

      return {
        success: true,
        data: {
          totalAdminUsers,
          activeAdminUsers,
          inactiveAdminUsers,
          lockedAdminUsers,
          superAdminsCount,
          totalRoles,
          systemRolesCount,
          customRolesCount,
          activeRolesCount,
          configuredPermissionsCount: totalPermissions,
          activeLimitRules: inMemoryTransactionLimits.filter((l) => l.status === 'ACTIVE').length,
          activeFeeRules: inMemoryFeeRules.filter((f) => f.status === 'ACTIVE').length,
        },
        timestamp: new Date().toISOString(),
      };
    }
    return { success: false, data: null as unknown as AdminSummary, timestamp: new Date().toISOString() };
  },

  /**
   * ADMIN USERS
   */
  async getAdminUsers(searchQuery?: string, page = 1, pageSize = 10): Promise<ApiResponse<AdminListResult<AdminUser>>> {
    if (APP_CONFIG.useMockData) {
      await new Promise((res) => setTimeout(res, 150));

      let items = [...inMemoryAdminUsers];
      if (searchQuery && searchQuery.trim() !== '') {
        const q = searchQuery.trim().toLowerCase();
        items = items.filter(
          (u) =>
            u.id.toLowerCase().includes(q) ||
            u.employeeId.toLowerCase().includes(q) ||
            u.name.toLowerCase().includes(q) ||
            u.email.toLowerCase().includes(q) ||
            u.department.toLowerCase().includes(q)
        );
      }

      const totalItems = items.length;
      const totalPages = Math.ceil(totalItems / pageSize) || 1;
      const paged = items.slice((page - 1) * pageSize, page * pageSize);

      return {
        success: true,
        data: { items: paged, pagination: { page, pageSize, totalItems, totalPages } },
        timestamp: new Date().toISOString(),
      };
    }
    return { success: false, data: null as unknown as AdminListResult<AdminUser>, timestamp: new Date().toISOString() };
  },

  async createAdminUser(data: Omit<AdminUser, 'id' | 'createdAt' | 'createdBy' | 'roleNames'>): Promise<ApiResponse<AdminUser>> {
    if (APP_CONFIG.useMockData) {
      await new Promise((res) => setTimeout(res, 300));

      const newId = `usr_adm_${String(inMemoryAdminUsers.length + 1).padStart(2, '0')}`;
      const matchedRoles = inMemoryRoles.filter((r) => data.roleIds.includes(r.id));
      const roleNames = matchedRoles.map((r) => r.name);

      const newAdmin: AdminUser = {
        ...data,
        id: newId,
        roleNames,
        createdAt: new Date().toISOString(),
        createdBy: 'Vikramaditya Sharma',
      };

      inMemoryAdminUsers.unshift(newAdmin);

      // Audit Log
      await logService.logActivity(
        'ADMIN_USER_CREATED',
        'ADMINISTRATION',
        'USER',
        newId,
        `Created internal admin user ${data.name} (${data.email}) in ${data.department} department.`,
        undefined,
        { name: data.name, email: data.email, roles: roleNames }
      );

      return { success: true, data: newAdmin, timestamp: new Date().toISOString() };
    }
    return { success: false, data: null as unknown as AdminUser, timestamp: new Date().toISOString() };
  },

  async updateAdminUserStatus(id: string, newStatus: AdminUser['status']): Promise<ApiResponse<AdminUser>> {
    if (APP_CONFIG.useMockData) {
      await new Promise((res) => setTimeout(res, 250));

      const admin = inMemoryAdminUsers.find((u) => u.id === id);
      if (!admin) {
        return { success: false, data: null as unknown as AdminUser, errorCode: 'NOT_FOUND', message: 'Admin user not found', timestamp: new Date().toISOString() };
      }

      // Lockout Protection: Prevent deactivating the only active Super Admin
      if (newStatus !== 'ACTIVE' && admin.roleNames.includes('Super Admin')) {
        const activeSuperAdmins = inMemoryAdminUsers.filter((u) => u.roleNames.includes('Super Admin') && u.status === 'ACTIVE');
        if (activeSuperAdmins.length <= 1) {
          return {
            success: false,
            data: null as unknown as AdminUser,
            errorCode: 'SUPER_ADMIN_LOCKOUT_PREVENTED',
            message: 'Action blocked: Cannot deactivate or lock the only remaining active Super Admin account.',
            timestamp: new Date().toISOString(),
          };
        }
      }

      const previousStatus = admin.status;
      admin.status = newStatus;

      // Audit Log
      await logService.logActivity(
        'ADMIN_USER_STATUS_CHANGE',
        'ADMINISTRATION',
        'USER',
        id,
        `Changed status for admin user ${admin.name} from ${previousStatus} to ${newStatus}.`,
        { status: previousStatus },
        { status: newStatus }
      );

      return { success: true, data: { ...admin }, timestamp: new Date().toISOString() };
    }
    return { success: false, data: null as unknown as AdminUser, timestamp: new Date().toISOString() };
  },

  /**
   * ROLES & PERMISSIONS
   */
  async getRoles(): Promise<ApiResponse<Role[]>> {
    if (APP_CONFIG.useMockData) {
      await new Promise((res) => setTimeout(res, 100));
      return { success: true, data: [...inMemoryRoles], timestamp: new Date().toISOString() };
    }
    return { success: false, data: [], timestamp: new Date().toISOString() };
  },

  async createRole(data: Omit<Role, 'id' | 'isSystemRole' | 'assignedUserCount' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Role>> {
    if (APP_CONFIG.useMockData) {
      await new Promise((res) => setTimeout(res, 300));

      const resolvedPermissions = resolvePermissionDependencies(data.permissions);
      const newId = `role_${data.code.toLowerCase()}`;
      const newRole: Role = {
        ...data,
        id: newId,
        permissions: resolvedPermissions,
        isSystemRole: false,
        assignedUserCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      inMemoryRoles.push(newRole);

      await logService.logActivity(
        'ROLE_CREATED',
        'ADMINISTRATION',
        'SYSTEM',
        newId,
        `Created new custom role ${data.name} (${data.code}) with ${resolvedPermissions.length} permissions.`,
        undefined,
        { name: data.name, permissionsCount: resolvedPermissions.length }
      );

      return { success: true, data: newRole, timestamp: new Date().toISOString() };
    }
    return { success: false, data: null as unknown as Role, timestamp: new Date().toISOString() };
  },

  async updateRolePermissions(id: string, newPermissions: string[], reason?: string): Promise<ApiResponse<Role>> {
    if (APP_CONFIG.useMockData) {
      await new Promise((res) => setTimeout(res, 300));

      const role = inMemoryRoles.find((r) => r.id === id);
      if (!role) {
        return { success: false, data: null as unknown as Role, errorCode: 'NOT_FOUND', message: 'Role not found', timestamp: new Date().toISOString() };
      }

      const previousPermissions = [...role.permissions];
      const resolvedPermissions = resolvePermissionDependencies(newPermissions);
      role.permissions = resolvedPermissions;
      role.updatedAt = new Date().toISOString();

      await logService.logActivity(
        'ROLE_PERMISSION_CHANGED',
        'ADMINISTRATION',
        'SYSTEM',
        id,
        `Updated permissions for role ${role.name}. Previous: ${previousPermissions.length}, New: ${resolvedPermissions.length}.`,
        { permissionsCount: previousPermissions.length },
        { permissionsCount: resolvedPermissions.length },
        reason || 'Administrative role permission update'
      );

      return { success: true, data: { ...role }, timestamp: new Date().toISOString() };
    }
    return { success: false, data: null as unknown as Role, timestamp: new Date().toISOString() };
  },

  /**
   * TRANSACTION LIMITS
   */
  async getTransactionLimits(): Promise<ApiResponse<TransactionLimit[]>> {
    if (APP_CONFIG.useMockData) {
      await new Promise((res) => setTimeout(res, 100));
      return { success: true, data: [...inMemoryTransactionLimits], timestamp: new Date().toISOString() };
    }
    return { success: false, data: [], timestamp: new Date().toISOString() };
  },

  async createTransactionLimit(data: Omit<TransactionLimit, 'id'>): Promise<ApiResponse<TransactionLimit>> {
    if (APP_CONFIG.useMockData) {
      await new Promise((res) => setTimeout(res, 250));

      const newId = `LIMIT_${data.scopeType}_${String(inMemoryTransactionLimits.length + 1).padStart(3, '0')}`;
      const newLimit: TransactionLimit = { ...data, id: newId };
      inMemoryTransactionLimits.unshift(newLimit);

      await logService.logActivity(
        'TRANSACTION_LIMIT_CREATED',
        'ADMINISTRATION',
        'SYSTEM',
        newId,
        `Created transaction limit rule for ${data.scopeType} (${data.scopeName || 'Global'}) max ₹${data.maxPerTransaction}.`,
        undefined,
        { scopeType: data.scopeType, max: data.maxPerTransaction }
      );

      return { success: true, data: newLimit, timestamp: new Date().toISOString() };
    }
    return { success: false, data: null as unknown as TransactionLimit, timestamp: new Date().toISOString() };
  },

  /**
   * Resolve limit precedence: Scope + TxType + Mode > Scope + TxType > Scope > Global + TxType + Mode > Global + TxType > Global Default
   */
  resolveEffectiveLimit(
    paramsOrId?: {
      entityType?: 'RETAILER' | 'MERCHANT' | 'DISTRIBUTOR' | 'GLOBAL';
      entityId?: string;
      transactionType?: 'PAY_IN' | 'PAY_OUT' | 'ALL';
      paymentMode?: string;
    } | string,
    legacyTxType: 'PAY_IN' | 'PAY_OUT' = 'PAY_OUT'
  ): TransactionLimit {
    let entityId: string | undefined;
    let txType: 'PAY_IN' | 'PAY_OUT' | 'ALL' = legacyTxType;
    let mode: string | undefined;

    if (typeof paramsOrId === 'object' && paramsOrId !== null) {
      entityId = paramsOrId.entityId;
      txType = paramsOrId.transactionType || 'ALL';
      mode = paramsOrId.paymentMode;
    } else if (typeof paramsOrId === 'string') {
      entityId = paramsOrId;
      txType = legacyTxType;
    }

    const activeLimits = inMemoryTransactionLimits.filter((l) => l.status === 'ACTIVE');

    // 1. Scope + Transaction Type + Mode
    if (entityId && mode) {
      const match = activeLimits.find(
        (l) => l.scopeId === entityId && (l.transactionType === txType || l.transactionType === 'ALL') && (l.paymentMode === mode || l.paymentMode === 'ALL')
      );
      if (match) return match;
    }

    // 2. Scope + Transaction Type
    if (entityId) {
      const match = activeLimits.find(
        (l) => l.scopeId === entityId && (l.transactionType === txType || l.transactionType === 'ALL')
      );
      if (match) return match;
    }

    // 3. Global + Transaction Type + Mode
    if (mode) {
      const match = activeLimits.find(
        (l) => l.scopeType === 'GLOBAL' && (l.transactionType === txType || l.transactionType === 'ALL') && (l.paymentMode === mode || l.paymentMode === 'ALL')
      );
      if (match) return match;
    }

    // 4. Global + Transaction Type
    const globalTxMatch = activeLimits.find(
      (l) => l.scopeType === 'GLOBAL' && (l.transactionType === txType || l.transactionType === 'ALL')
    );
    if (globalTxMatch) return globalTxMatch;

    // 5. Fallback Default
    return activeLimits[0] || {
      id: 'LIMIT_DEFAULT_FALLBACK',
      scopeType: 'GLOBAL',
      transactionType: txType,
      paymentMode: 'ALL',
      minPerTransaction: 10,
      maxPerTransaction: 200000,
      dailyAmountLimit: 1000000,
      dailyCountLimit: 500,
      monthlyAmountLimit: 25000000,
      monthlyCountLimit: 10000,
      status: 'ACTIVE',
      effectiveFrom: new Date().toISOString(),
    };
  },

  /**
   * Central Service-Level Transaction Limit Validation
   */
  validateTransactionLimit(params: {
    entityType?: 'RETAILER' | 'MERCHANT' | 'DISTRIBUTOR' | 'GLOBAL';
    entityId?: string;
    transactionType: 'PAY_IN' | 'PAY_OUT';
    paymentMode?: string;
    amount: number;
  }): {
    allowed: boolean;
    reason?: string;
    resolvedLimit: TransactionLimit;
    minPerTransaction: number;
    maxPerTransaction: number;
  } {
    const resolvedLimit = this.resolveEffectiveLimit({
      entityType: params.entityType,
      entityId: params.entityId,
      transactionType: params.transactionType,
      paymentMode: params.paymentMode,
    });

    const min = resolvedLimit.minPerTransaction || 10;
    const max = resolvedLimit.maxPerTransaction || 200000;

    if (params.amount < min) {
      return {
        allowed: false,
        reason: `Transaction amount (₹${params.amount.toLocaleString('en-IN')}) is below the minimum allowed limit of ₹${min.toLocaleString('en-IN')}.`,
        resolvedLimit,
        minPerTransaction: min,
        maxPerTransaction: max,
      };
    }

    if (params.amount > max) {
      return {
        allowed: false,
        reason: `Transaction amount (₹${params.amount.toLocaleString('en-IN')}) exceeds your per-transaction ${params.transactionType} limit of ₹${max.toLocaleString('en-IN')}.`,
        resolvedLimit,
        minPerTransaction: min,
        maxPerTransaction: max,
      };
    }

    return {
      allowed: true,
      resolvedLimit,
      minPerTransaction: min,
      maxPerTransaction: max,
    };
  },

  /**
   * FEE & CHARGE MASTERS
   */
  async getFeeRules(): Promise<ApiResponse<FeeRule[]>> {
    if (APP_CONFIG.useMockData) {
      await new Promise((res) => setTimeout(res, 100));
      return { success: true, data: [...inMemoryFeeRules], timestamp: new Date().toISOString() };
    }
    return { success: false, data: [], timestamp: new Date().toISOString() };
  },

  calculateFeePreview(amount: number, feeRule: FeeRule, gstRate = 18.0) {
    let baseFee = 0;
    if (feeRule.calculationType === 'PERCENTAGE') {
      baseFee = (amount * feeRule.value) / 100;
      if (feeRule.minimumFee && baseFee < feeRule.minimumFee) baseFee = feeRule.minimumFee;
      if (feeRule.maximumFee && baseFee > feeRule.maximumFee) baseFee = feeRule.maximumFee;
    } else {
      baseFee = feeRule.value;
    }

    const gstAmount = feeRule.gstApplicable ? (baseFee * gstRate) / 100 : 0;
    const totalCharges = baseFee + gstAmount;
    const netSettlement = amount - totalCharges;

    return {
      transactionAmount: amount,
      baseFee,
      gstAmount,
      totalCharges,
      netSettlement,
    };
  },

  /**
   * TAX CONFIGURATIONS, MASTERS & REASON CODES
   */
  async getTaxConfigurations(): Promise<ApiResponse<TaxConfigurationItem[]>> {
    if (APP_CONFIG.useMockData) {
      await new Promise((res) => setTimeout(res, 100));
      return { success: true, data: [...inMemoryTaxConfigurations], timestamp: new Date().toISOString() };
    }
    return { success: false, data: [], timestamp: new Date().toISOString() };
  },

  async getPaymentMasters(): Promise<ApiResponse<PaymentMasterItem[]>> {
    if (APP_CONFIG.useMockData) {
      await new Promise((res) => setTimeout(res, 100));
      return { success: true, data: [...inMemoryPaymentMasters], timestamp: new Date().toISOString() };
    }
    return { success: false, data: [], timestamp: new Date().toISOString() };
  },

  async getReasonCodes(): Promise<ApiResponse<ReasonCode[]>> {
    if (APP_CONFIG.useMockData) {
      await new Promise((res) => setTimeout(res, 100));
      return { success: true, data: [...inMemoryReasonCodes], timestamp: new Date().toISOString() };
    }
    return { success: false, data: [], timestamp: new Date().toISOString() };
  },

  /**
   * PLATFORM & BRANDING & SECURITY SETTINGS
   */
  async getPlatformSettings(): Promise<ApiResponse<PlatformSettings>> {
    if (APP_CONFIG.useMockData) {
      await new Promise((res) => setTimeout(res, 100));
      return { success: true, data: { ...inMemoryPlatformSettings }, timestamp: new Date().toISOString() };
    }
    return { success: false, data: null as unknown as PlatformSettings, timestamp: new Date().toISOString() };
  },

  async updatePlatformSettings(data: Partial<PlatformSettings>, reason?: string): Promise<ApiResponse<PlatformSettings>> {
    if (APP_CONFIG.useMockData) {
      await new Promise((res) => setTimeout(res, 300));

      const previous = { ...inMemoryPlatformSettings };
      inMemoryPlatformSettings = {
        ...inMemoryPlatformSettings,
        ...data,
      };

      await logService.logActivity(
        'PLATFORM_SETTING_CHANGED',
        'ADMINISTRATION',
        'SYSTEM',
        'SYS_CONFIG',
        'Updated platform configuration settings.',
        previous as unknown as Record<string, unknown>,
        inMemoryPlatformSettings as unknown as Record<string, unknown>,
        reason || 'Platform settings configuration update'
      );

      return { success: true, data: { ...inMemoryPlatformSettings }, timestamp: new Date().toISOString() };
    }
    return { success: false, data: null as unknown as PlatformSettings, timestamp: new Date().toISOString() };
  },
};
