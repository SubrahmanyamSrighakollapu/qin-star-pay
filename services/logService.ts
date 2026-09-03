import {
  ApiLog,
  ClientLog,
  CallbackLog,
  WebhookLog,
  LoginLog,
  ActivityLog,
  TraceSearchResult,
  ApiLogSummary,
  CallbackLogSummary,
  WebhookLogSummary,
  PaginationState,
  UserRole,
  Transaction,
} from '@/types/domain';
import { ApiResponse } from '@/types/common';
import {
  mockApiLogs,
  mockClientLogs,
  mockCallbackLogs,
  mockWebhookLogs,
  mockLoginLogs,
  mockActivityLogs,
} from '@/mocks/mockLogs';
import { mockTransactions } from '@/mocks/mockTransactions';
import { APP_CONFIG } from '@/config';

const inMemoryApiLogs: ApiLog[] = [...mockApiLogs];
const inMemoryClientLogs: ClientLog[] = [...mockClientLogs];
const inMemoryCallbackLogs: CallbackLog[] = [...mockCallbackLogs];
const inMemoryWebhookLogs: WebhookLog[] = [...mockWebhookLogs];
const inMemoryLoginLogs: LoginLog[] = [...mockLoginLogs];
const inMemoryActivityLogs: ActivityLog[] = [...mockActivityLogs];

export interface LogListResult<T> {
  items: T[];
  pagination: PaginationState;
}

export const logService = {
  /**
   * API LOGS
   */
  async getApiSummary(): Promise<ApiResponse<ApiLogSummary>> {
    if (APP_CONFIG.useMockData) {
      await new Promise((res) => setTimeout(res, 100));

      const totalRequests = inMemoryApiLogs.length;
      const successCount = inMemoryApiLogs.filter((a) => a.resultStatus === 'SUCCESS').length;
      const failedCount = inMemoryApiLogs.filter((a) => a.resultStatus === 'FAILED').length;
      const timeoutCount = inMemoryApiLogs.filter((a) => a.resultStatus === 'TIMEOUT').length;
      const criticalErrors = inMemoryApiLogs.filter((a) => a.severity === 'CRITICAL' || a.severity === 'ERROR').length;

      const latencies = inMemoryApiLogs.map((a) => a.responseTimeMs);
      const avgResponseTimeMs = latencies.length
        ? Math.round(latencies.reduce((a, b) => a + b, 0) / latencies.length)
        : 0;

      return {
        success: true,
        data: { totalRequests, successCount, failedCount, avgResponseTimeMs, timeoutCount, criticalErrors },
        timestamp: new Date().toISOString(),
      };
    }
    return { success: false, data: null as unknown as ApiLogSummary, timestamp: new Date().toISOString() };
  },

  async getApiLogs(searchQuery?: string, page = 1, pageSize = 10): Promise<ApiResponse<LogListResult<ApiLog>>> {
    if (APP_CONFIG.useMockData) {
      await new Promise((res) => setTimeout(res, 150));

      let items = [...inMemoryApiLogs];
      if (searchQuery && searchQuery.trim() !== '') {
        const q = searchQuery.trim().toLowerCase();
        items = items.filter(
          (a) =>
            a.id.toLowerCase().includes(q) ||
            a.traceId.toLowerCase().includes(q) ||
            a.correlationId.toLowerCase().includes(q) ||
            a.requestReference.toLowerCase().includes(q) ||
            a.providerName.toLowerCase().includes(q) ||
            a.endpoint.toLowerCase().includes(q)
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
    return { success: false, data: null as unknown as LogListResult<ApiLog>, timestamp: new Date().toISOString() };
  },

  /**
   * CLIENT LOGS
   */
  async getClientLogs(searchQuery?: string, page = 1, pageSize = 10): Promise<ApiResponse<LogListResult<ClientLog>>> {
    if (APP_CONFIG.useMockData) {
      await new Promise((res) => setTimeout(res, 150));

      let items = [...inMemoryClientLogs];
      if (searchQuery && searchQuery.trim() !== '') {
        const q = searchQuery.trim().toLowerCase();
        items = items.filter(
          (c) =>
            c.id.toLowerCase().includes(q) ||
            c.clientEntity.toLowerCase().includes(q) ||
            c.requestReference.toLowerCase().includes(q)
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
    return { success: false, data: null as unknown as LogListResult<ClientLog>, timestamp: new Date().toISOString() };
  },

  /**
   * CALLBACK LOGS & DUPLICATE PROTECTION
   */
  async getCallbackSummary(): Promise<ApiResponse<CallbackLogSummary>> {
    if (APP_CONFIG.useMockData) {
      await new Promise((res) => setTimeout(res, 100));

      const totalReceived = inMemoryCallbackLogs.length;
      const processedCount = inMemoryCallbackLogs.filter((c) => c.processingStatus === 'PROCESSED').length;
      const failedCount = inMemoryCallbackLogs.filter((c) => c.processingStatus === 'FAILED').length;
      const duplicateCount = inMemoryCallbackLogs.filter((c) => c.processingStatus === 'DUPLICATE' || c.isDuplicate).length;
      const pendingCount = inMemoryCallbackLogs.filter((c) => c.processingStatus === 'RECEIVED' || c.processingStatus === 'PROCESSING').length;

      return {
        success: true,
        data: { totalReceived, processedCount, failedCount, duplicateCount, pendingCount },
        timestamp: new Date().toISOString(),
      };
    }
    return { success: false, data: null as unknown as CallbackLogSummary, timestamp: new Date().toISOString() };
  },

  async getCallbackLogs(searchQuery?: string, page = 1, pageSize = 10): Promise<ApiResponse<LogListResult<CallbackLog>>> {
    if (APP_CONFIG.useMockData) {
      await new Promise((res) => setTimeout(res, 150));

      let items = [...inMemoryCallbackLogs];
      if (searchQuery && searchQuery.trim() !== '') {
        const q = searchQuery.trim().toLowerCase();
        items = items.filter(
          (c) =>
            c.id.toLowerCase().includes(q) ||
            c.providerReference.toLowerCase().includes(q) ||
            (c.transactionId && c.transactionId.toLowerCase().includes(q)) ||
            c.providerName.toLowerCase().includes(q)
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
    return { success: false, data: null as unknown as LogListResult<CallbackLog>, timestamp: new Date().toISOString() };
  },

  async retryCallbackProcessing(id: string): Promise<ApiResponse<CallbackLog>> {
    if (APP_CONFIG.useMockData) {
      await new Promise((res) => setTimeout(res, 400));
      const cb = inMemoryCallbackLogs.find((c) => c.id === id);
      if (cb) {
        cb.processingStatus = 'PROCESSED';
        cb.signatureVerification = 'VERIFIED';
        cb.retryCount += 1;
        return { success: true, data: { ...cb }, timestamp: new Date().toISOString() };
      }
    }
    return { success: false, data: null as unknown as CallbackLog, timestamp: new Date().toISOString() };
  },

  /**
   * WEBHOOK LOGS & ATTEMPT HISTORY RETRY
   */
  async getWebhookSummary(): Promise<ApiResponse<WebhookLogSummary>> {
    if (APP_CONFIG.useMockData) {
      await new Promise((res) => setTimeout(res, 100));

      const totalWebhooks = inMemoryWebhookLogs.length;
      const deliveredCount = inMemoryWebhookLogs.filter((w) => w.status === 'DELIVERED').length;
      const failedCount = inMemoryWebhookLogs.filter((w) => w.status === 'FAILED').length;
      const pendingRetryCount = inMemoryWebhookLogs.filter((w) => w.status === 'RETRYING' || w.status === 'PENDING').length;
      const exhaustedCount = inMemoryWebhookLogs.filter((w) => w.status === 'EXHAUSTED').length;

      return {
        success: true,
        data: { totalWebhooks, deliveredCount, failedCount, pendingRetryCount, exhaustedCount },
        timestamp: new Date().toISOString(),
      };
    }
    return { success: false, data: null as unknown as WebhookLogSummary, timestamp: new Date().toISOString() };
  },

  async getWebhookLogs(searchQuery?: string, page = 1, pageSize = 10): Promise<ApiResponse<LogListResult<WebhookLog>>> {
    if (APP_CONFIG.useMockData) {
      await new Promise((res) => setTimeout(res, 150));

      let items = [...inMemoryWebhookLogs];
      if (searchQuery && searchQuery.trim() !== '') {
        const q = searchQuery.trim().toLowerCase();
        items = items.filter(
          (w) =>
            w.id.toLowerCase().includes(q) ||
            w.endpointUrl.toLowerCase().includes(q) ||
            (w.entityId && w.entityId.toLowerCase().includes(q)) ||
            w.providerName.toLowerCase().includes(q)
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
    return { success: false, data: null as unknown as LogListResult<WebhookLog>, timestamp: new Date().toISOString() };
  },

  async retryWebhookDelivery(id: string): Promise<ApiResponse<WebhookLog>> {
    if (APP_CONFIG.useMockData) {
      await new Promise((res) => setTimeout(res, 500));
      const wh = inMemoryWebhookLogs.find((w) => w.id === id);
      if (wh) {
        wh.attemptCount += 1;
        wh.lastAttemptAt = new Date().toISOString();
        wh.status = 'DELIVERED';
        wh.httpStatus = 200;
        wh.attemptHistory.push({
          attemptNumber: wh.attemptCount,
          timestamp: wh.lastAttemptAt,
          httpStatus: 200,
          status: 'DELIVERED',
        });
        return { success: true, data: { ...wh }, timestamp: new Date().toISOString() };
      }
    }
    return { success: false, data: null as unknown as WebhookLog, timestamp: new Date().toISOString() };
  },

  /**
   * LOGIN LOGS
   */
  async getLoginLogs(searchQuery?: string, page = 1, pageSize = 10): Promise<ApiResponse<LogListResult<LoginLog>>> {
    if (APP_CONFIG.useMockData) {
      await new Promise((res) => setTimeout(res, 150));

      let items = [...inMemoryLoginLogs];
      if (searchQuery && searchQuery.trim() !== '') {
        const q = searchQuery.trim().toLowerCase();
        items = items.filter(
          (l) =>
            l.id.toLowerCase().includes(q) ||
            l.userEmail.toLowerCase().includes(q) ||
            l.userName.toLowerCase().includes(q) ||
            l.ipAddress.toLowerCase().includes(q)
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
    return { success: false, data: null as unknown as LogListResult<LoginLog>, timestamp: new Date().toISOString() };
  },

  /**
   * ACTIVITY & AUDIT LOGS
   */
  async getActivityLogs(searchQuery?: string, page = 1, pageSize = 10): Promise<ApiResponse<LogListResult<ActivityLog>>> {
    if (APP_CONFIG.useMockData) {
      await new Promise((res) => setTimeout(res, 150));

      let items = [...inMemoryActivityLogs];
      if (searchQuery && searchQuery.trim() !== '') {
        const q = searchQuery.trim().toLowerCase();
        items = items.filter(
          (a) =>
            a.id.toLowerCase().includes(q) ||
            a.actorName.toLowerCase().includes(q) ||
            a.action.toLowerCase().includes(q) ||
            a.description.toLowerCase().includes(q)
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
    return { success: false, data: null as unknown as LogListResult<ActivityLog>, timestamp: new Date().toISOString() };
  },

  /**
   * Publish cross-module audit entry
   */
  async logActivity(
    action: string,
    module: string,
    entityType: ActivityLog['entityType'],
    entityId: string,
    description: string,
    previousValue?: string | Record<string, unknown>,
    newValue?: string | Record<string, unknown>,
    reason?: string,
    actorName = 'Super Admin',
    actorRole: UserRole = 'SUPER_ADMIN'
  ): Promise<ApiResponse<ActivityLog>> {
    if (APP_CONFIG.useMockData) {
      const newId = `ACT_${new Date().toISOString().split('T')[0].replace(/-/g, '')}_${String(inMemoryActivityLogs.length + 1).padStart(3, '0')}`;
      const newLog: ActivityLog = {
        id: newId,
        traceId: `TRACE_${new Date().toISOString().split('T')[0].replace(/-/g, '')}_001`,
        correlationId: `CORR_${new Date().toISOString().split('T')[0].replace(/-/g, '')}_001`,
        sourceModule: module,
        severity: 'INFO',
        status: 'COMPLETED',
        createdAt: new Date().toISOString(),
        entityType,
        entityId,
        action,
        module,
        actorId: 'usr_admin_01',
        actorName,
        actorRole,
        description,
        previousValue,
        newValue,
        reason,
        ipAddress: '103.21.124.99',
      };

      inMemoryActivityLogs.unshift(newLog);
      return { success: true, data: newLog, timestamp: new Date().toISOString() };
    }
    return { success: false, data: null as unknown as ActivityLog, timestamp: new Date().toISOString() };
  },

  /**
   * GLOBAL TRACE SEARCH
   */
  async traceByReference(referenceId: string): Promise<ApiResponse<TraceSearchResult>> {
    if (APP_CONFIG.useMockData) {
      await new Promise((res) => setTimeout(res, 250));

      const ref = referenceId.trim().toLowerCase();

      // Find matching transaction
      const transaction = mockTransactions.find(
        (t: Transaction) =>
          t.id.toLowerCase() === ref ||
          (t.referenceId && t.referenceId.toLowerCase() === ref) ||
          (t.utr && t.utr.toLowerCase() === ref)
      );

      // Find matching API logs
      const apiLogs = inMemoryApiLogs.filter(
        (a) =>
          a.id.toLowerCase() === ref ||
          a.traceId.toLowerCase() === ref ||
          a.correlationId.toLowerCase() === ref ||
          a.requestReference.toLowerCase() === ref ||
          (a.entityId && a.entityId.toLowerCase() === ref)
      );

      // Find matching Callbacks
      const callbacks = inMemoryCallbackLogs.filter(
        (c) =>
          c.id.toLowerCase() === ref ||
          c.traceId.toLowerCase() === ref ||
          c.correlationId.toLowerCase() === ref ||
          c.providerReference.toLowerCase() === ref ||
          (c.transactionId && c.transactionId.toLowerCase() === ref)
      );

      // Find matching Webhooks
      const webhooks = inMemoryWebhookLogs.filter(
        (w) =>
          w.id.toLowerCase() === ref ||
          w.traceId.toLowerCase() === ref ||
          w.correlationId.toLowerCase() === ref ||
          (w.entityId && w.entityId.toLowerCase() === ref)
      );

      // Find matching Activity Logs
      const activityLogs = inMemoryActivityLogs.filter(
        (act) =>
          act.id.toLowerCase() === ref ||
          act.traceId.toLowerCase() === ref ||
          act.correlationId.toLowerCase() === ref ||
          (act.entityId && act.entityId.toLowerCase() === ref)
      );

      return {
        success: true,
        data: {
          referenceId,
          traceId: apiLogs[0]?.traceId || callbacks[0]?.traceId || 'TRACE_20260903_001',
          correlationId: apiLogs[0]?.correlationId || callbacks[0]?.correlationId || 'CORR_20260903_001',
          transaction,
          apiLogs,
          callbacks,
          webhooks,
          activityLogs,
        },
        timestamp: new Date().toISOString(),
      };
    }
    return { success: false, data: null as unknown as TraceSearchResult, timestamp: new Date().toISOString() };
  },

  /**
   * CSV Export Generator for sanitized logs
   */
  exportLogsToCsv(logType: string, items: unknown[]): string {
    if (!items.length) return '';

    if (logType === 'API') {
      const headers = ['Log ID', 'Created At', 'Provider', 'Service', 'Method', 'Endpoint', 'HTTP Status', 'Result', 'Latency (ms)', 'Trace ID'];
      const rows = (items as ApiLog[]).map((a) => [
        a.id,
        a.createdAt,
        a.providerName,
        a.service,
        a.httpMethod,
        a.endpoint,
        a.httpStatus,
        a.resultStatus,
        a.responseTimeMs,
        a.traceId,
      ]);
      return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    }

    if (logType === 'ACTIVITY') {
      const headers = ['Activity ID', 'Created At', 'Actor', 'Role', 'Module', 'Action', 'Target Entity', 'Description'];
      const rows = (items as ActivityLog[]).map((a) => [
        a.id,
        a.createdAt,
        `"${a.actorName}"`,
        a.actorRole,
        a.module,
        a.action,
        a.entityId || 'N/A',
        `"${a.description.replace(/"/g, '""')}"`,
      ]);
      return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    }

    return '';
  },
};
