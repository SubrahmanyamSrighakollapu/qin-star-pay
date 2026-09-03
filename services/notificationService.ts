import {
  Notification,
  NotificationFilters,
  NotificationSummary,
  NotificationPreferenceItem,
  NotificationCategory,
  NotificationType,
  NotificationSeverity,
  PaginationState,
} from '@/types/domain';
import { ApiResponse } from '@/types/common';
import { mockNotifications, defaultNotificationPreferences } from '@/mocks/mockNotification';
import { APP_CONFIG } from '@/config';

const NOTIFICATIONS_STORAGE_KEY = 'qsp_notifications_v1';
const PREFERENCES_STORAGE_KEY = 'qsp_notification_prefs_v1';

// Initial state loader with localStorage support
const loadInitialNotifications = (): Notification[] => {
  if (typeof window === 'undefined') return [...mockNotifications];
  try {
    const stored = localStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch {
    // Fallback to mock data
  }
  return [...mockNotifications];
};

const loadInitialPreferences = (): NotificationPreferenceItem[] => {
  if (typeof window === 'undefined') return [...defaultNotificationPreferences];
  try {
    const stored = localStorage.getItem(PREFERENCES_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch {
    // Fallback
  }
  return [...defaultNotificationPreferences];
};

const inMemoryNotifications: Notification[] = loadInitialNotifications();
const inMemoryPreferences: NotificationPreferenceItem[] = loadInitialPreferences();

const saveNotifications = () => {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(inMemoryNotifications));
    } catch {
      // Ignore storage errors
    }
  }
};

const savePreferences = () => {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(PREFERENCES_STORAGE_KEY, JSON.stringify(inMemoryPreferences));
    } catch {
      // Ignore storage errors
    }
  }
};

export interface NotificationListResult {
  items: Notification[];
  pagination: PaginationState;
  summary: NotificationSummary;
}

export const notificationService = {
  /**
   * Calculate notification summary metrics dynamically from state.
   */
  async getSummary(): Promise<ApiResponse<NotificationSummary>> {
    if (APP_CONFIG.useMockData) {
      await new Promise((res) => setTimeout(res, 100));

      const totalNotifications = inMemoryNotifications.length;
      const unreadCount = inMemoryNotifications.filter((n) => n.status === 'UNREAD').length;
      const criticalCount = inMemoryNotifications.filter((n) => n.severity === 'CRITICAL').length;
      const actionRequiredCount = inMemoryNotifications.filter((n) => n.actionRequired && n.status === 'UNREAD').length;
      const readCount = inMemoryNotifications.filter((n) => n.status === 'READ').length;

      const todayStr = new Date().toISOString().split('T')[0];
      const todayCount = inMemoryNotifications.filter((n) => n.createdAt.startsWith(todayStr)).length;

      return {
        success: true,
        data: {
          totalNotifications,
          unreadCount,
          criticalCount,
          actionRequiredCount,
          todayCount,
          readCount,
        },
        timestamp: new Date().toISOString(),
      };
    }
    return { success: false, data: null as unknown as NotificationSummary, timestamp: new Date().toISOString() };
  },

  /**
   * Fetch notifications with filtering & pagination.
   */
  async getNotifications(
    filters?: NotificationFilters,
    page = 1,
    pageSize = 10
  ): Promise<ApiResponse<NotificationListResult>> {
    if (APP_CONFIG.useMockData) {
      await new Promise((res) => setTimeout(res, 150));

      let filtered = [...inMemoryNotifications];

      if (filters?.category && filters.category !== 'ALL') {
        filtered = filtered.filter((n) => n.category === filters.category);
      }

      if (filters?.severity && filters.severity !== 'ALL') {
        filtered = filtered.filter((n) => n.severity === filters.severity);
      }

      if (filters?.status && filters.status !== 'ALL') {
        filtered = filtered.filter((n) => n.status === filters.status);
      }

      if (filters?.searchQuery && filters.searchQuery.trim() !== '') {
        const q = filters.searchQuery.trim().toLowerCase();
        filtered = filtered.filter(
          (n) =>
            n.id.toLowerCase().includes(q) ||
            n.title.toLowerCase().includes(q) ||
            n.message.toLowerCase().includes(q) ||
            (n.entityId && n.entityId.toLowerCase().includes(q)) ||
            (n.relatedEntity && n.relatedEntity.toLowerCase().includes(q))
        );
      }

      const summaryRes = await this.getSummary();
      const summary = summaryRes.data || {
        totalNotifications: 0,
        unreadCount: 0,
        criticalCount: 0,
        actionRequiredCount: 0,
        todayCount: 0,
        readCount: 0,
      };

      const totalItems = filtered.length;
      const totalPages = Math.ceil(totalItems / pageSize) || 1;
      const items = filtered.slice((page - 1) * pageSize, page * pageSize);

      return {
        success: true,
        data: {
          items,
          pagination: { page, pageSize, totalItems, totalPages },
          summary,
        },
        timestamp: new Date().toISOString(),
      };
    }

    return { success: false, data: null as unknown as NotificationListResult, timestamp: new Date().toISOString() };
  },

  /**
   * Fetch single notification by ID.
   */
  async getNotificationById(id: string): Promise<ApiResponse<Notification | null>> {
    if (APP_CONFIG.useMockData) {
      await new Promise((res) => setTimeout(res, 100));
      const notif = inMemoryNotifications.find((n) => n.id === id) || null;
      return {
        success: !!notif,
        data: notif,
        timestamp: new Date().toISOString(),
      };
    }
    return { success: false, data: null, timestamp: new Date().toISOString() };
  },

  /**
   * Mark a single notification as read.
   */
  async markAsRead(id: string): Promise<ApiResponse<Notification>> {
    if (APP_CONFIG.useMockData) {
      await new Promise((res) => setTimeout(res, 150));
      const notif = inMemoryNotifications.find((n) => n.id === id);
      if (notif) {
        notif.status = 'READ';
        notif.readAt = new Date().toISOString();
        saveNotifications();
        return { success: true, data: { ...notif }, timestamp: new Date().toISOString() };
      }
      return { success: false, data: null as unknown as Notification, timestamp: new Date().toISOString() };
    }
    return { success: false, data: null as unknown as Notification, timestamp: new Date().toISOString() };
  },

  /**
   * Mark all unread notifications as read.
   */
  async markAllAsRead(): Promise<ApiResponse<number>> {
    if (APP_CONFIG.useMockData) {
      await new Promise((res) => setTimeout(res, 200));
      let count = 0;
      const now = new Date().toISOString();
      inMemoryNotifications.forEach((n) => {
        if (n.status === 'UNREAD') {
          n.status = 'READ';
          n.readAt = now;
          count++;
        }
      });
      saveNotifications();
      return { success: true, data: count, timestamp: new Date().toISOString() };
    }
    return { success: false, data: 0, timestamp: new Date().toISOString() };
  },

  /**
   * Create a new operational notification (e.g. from cross-module events).
   */
  async createNotification(
    category: NotificationCategory,
    type: NotificationType,
    severity: NotificationSeverity,
    title: string,
    message: string,
    entityType?: Notification['entityType'],
    entityId?: string,
    relatedEntity?: string,
    sourceModule = 'OPERATIONS',
    actionRequired = false,
    metadata?: Record<string, string | number | boolean>
  ): Promise<ApiResponse<Notification>> {
    if (APP_CONFIG.useMockData) {
      const newId = `NTF_20260903_${String(inMemoryNotifications.length + 1).padStart(3, '0')}`;
      const newNotif: Notification = {
        id: newId,
        category,
        type,
        severity,
        title,
        message,
        entityType,
        entityId,
        relatedEntity,
        sourceModule,
        status: 'UNREAD',
        actionRequired,
        createdAt: new Date().toISOString(),
        readAt: null,
        metadata,
      };

      inMemoryNotifications.unshift(newNotif);
      saveNotifications();
      return { success: true, data: newNotif, timestamp: new Date().toISOString() };
    }
    return { success: false, data: null as unknown as Notification, timestamp: new Date().toISOString() };
  },

  /**
   * Get notification preferences.
   */
  async getPreferences(): Promise<ApiResponse<NotificationPreferenceItem[]>> {
    if (APP_CONFIG.useMockData) {
      await new Promise((res) => setTimeout(res, 100));
      return { success: true, data: [...inMemoryPreferences], timestamp: new Date().toISOString() };
    }
    return { success: false, data: [], timestamp: new Date().toISOString() };
  },

  /**
   * Update preference toggle state.
   */
  async updatePreference(
    type: NotificationType,
    field: 'inAppEnabled' | 'emailEnabled',
    enabled: boolean
  ): Promise<ApiResponse<NotificationPreferenceItem[]>> {
    if (APP_CONFIG.useMockData) {
      await new Promise((res) => setTimeout(res, 150));
      const item = inMemoryPreferences.find((p) => p.type === type);
      if (item) {
        if (field === 'inAppEnabled' && item.inAppMandatory) {
          // Cannot disable mandatory in-app alerts
          return { success: false, data: inMemoryPreferences, timestamp: new Date().toISOString() };
        }
        item[field] = enabled;
        savePreferences();
      }
      return { success: true, data: [...inMemoryPreferences], timestamp: new Date().toISOString() };
    }
    return { success: false, data: [], timestamp: new Date().toISOString() };
  },

  /**
   * Resolve operational route for related record action button.
   */
  getRelatedRecordRoute(notification: Notification): string {
    if (notification.entityType === 'TRANSACTION' || notification.category === 'TRANSACTION') {
      return `/transactions/${notification.entityId || 'QSP20260903001'}`;
    }
    if (notification.entityType === 'SETTLEMENT' || notification.category === 'SETTLEMENT') {
      return '/settlements';
    }
    if (notification.entityType === 'CHARGEBACK' || notification.category === 'CHARGEBACK') {
      return '/chargebacks';
    }
    if (notification.entityType === 'INVOICE' || notification.category === 'INVOICE') {
      return '/invoices';
    }
    if (notification.entityType === 'KYC' || notification.category === 'KYC') {
      return '/kyc';
    }
    if (notification.entityType === 'WALLET' || notification.category === 'WALLET') {
      return '/wallet/balances';
    }
    if (notification.category === 'RECONCILIATION') {
      return '/settlements';
    }
    return '/dashboard';
  },
};
