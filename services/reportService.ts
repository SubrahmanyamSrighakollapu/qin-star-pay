import {
  Transaction,
  LedgerEntry,
  Settlement,
  WalletAccount,
  ReportFilters,
  ApiPerformanceFilters,
  TransactionReportSummary,
  LedgerReportSummary,
  SettlementReportSummary,
  BalanceReportSummary,
  AccountSummary,
  ApiPerformanceSummary,
  PaginationState,
} from '@/types/domain';
import { ApiResponse } from '@/types/common';
import { transactionService } from './transactionService';
import { ledgerService } from './ledgerService';
import { walletService } from './walletService';
import { settlementService } from './settlementService';
import { APP_CONFIG } from '@/config';

export interface ReportListResult<T, S> {
  items: T[];
  pagination: PaginationState;
  summary: S;
}

export const reportService = {
  /**
   * Transaction Analytical Report
   */
  async getTransactionReport(
    filters?: ReportFilters,
    mode: 'ALL' | 'LIVE' | 'UNSETTLED' | 'ORDERS' = 'ALL',
    page = 1,
    pageSize = 10
  ): Promise<ApiResponse<ReportListResult<Transaction, TransactionReportSummary>>> {
    if (APP_CONFIG.useMockData) {
      await new Promise((res) => setTimeout(res, 200));

      const txRes = await transactionService.getTransactions({}, 1, 100);
      let items = txRes.data?.items || [];

      if (filters?.transactionType && filters.transactionType !== 'ALL') {
        items = items.filter((t) => t.type === filters.transactionType);
      }

      if (filters?.status && filters.status !== 'ALL') {
        items = items.filter((t) => t.status === filters.status);
      }

      if (filters?.searchQuery && filters.searchQuery.trim() !== '') {
        const q = filters.searchQuery.trim().toLowerCase();
        items = items.filter(
          (t) =>
            t.id.toLowerCase().includes(q) ||
            t.merchantName.toLowerCase().includes(q) ||
            (t.orderId && t.orderId.toLowerCase().includes(q)) ||
            (t.utr && t.utr.toLowerCase().includes(q))
        );
      }

      if (mode === 'LIVE') {
        items = items.slice(0, 5);
      } else if (mode === 'UNSETTLED') {
        items = items.filter((t) => t.status === 'SUCCESS' && t.type === 'PAY_IN');
      } else if (mode === 'ORDERS') {
        items = items.filter((t) => !!t.orderId);
      }

      const totalTransactions = items.length;
      const totalAmount = items.reduce((acc, t) => acc + t.amount, 0);

      const successfulItems = items.filter((t) => t.status === 'SUCCESS');
      const successfulCount = successfulItems.length;
      const successfulAmount = successfulItems.reduce((acc, t) => acc + t.amount, 0);

      const failedItems = items.filter((t) => t.status === 'FAILED');
      const failedCount = failedItems.length;
      const failedAmount = failedItems.reduce((acc, t) => acc + t.amount, 0);

      const pendingItems = items.filter((t) => t.status === 'PENDING' || t.status === 'PROCESSING');
      const pendingCount = pendingItems.length;
      const pendingAmount = pendingItems.reduce((acc, t) => acc + t.amount, 0);

      const successRate = totalTransactions > 0 ? Math.round((successfulCount / totalTransactions) * 1000) / 10 : 100;

      const summary: TransactionReportSummary = {
        totalTransactions,
        totalAmount,
        successfulCount,
        successfulAmount,
        failedCount,
        failedAmount,
        pendingCount,
        pendingAmount,
        successRate,
      };

      const totalItems = items.length;
      const totalPages = Math.ceil(totalItems / pageSize) || 1;
      const paginatedItems = items.slice((page - 1) * pageSize, page * pageSize);

      return {
        success: true,
        data: {
          items: paginatedItems,
          pagination: { page, pageSize, totalItems, totalPages },
          summary,
        },
        timestamp: new Date().toISOString(),
      };
    }

    return { success: false, data: null as unknown as ReportListResult<Transaction, TransactionReportSummary>, timestamp: new Date().toISOString() };
  },

  /**
   * Ledger Audit Report
   */
  async getLedgerReport(
    filters?: ReportFilters,
    page = 1,
    pageSize = 10
  ): Promise<ApiResponse<ReportListResult<LedgerEntry, LedgerReportSummary>>> {
    if (APP_CONFIG.useMockData) {
      await new Promise((res) => setTimeout(res, 200));

      const ledRes = await ledgerService.getLedgerEntries({}, 1, 100);
      let items = ledRes.data?.items || [];

      if (filters?.searchQuery) {
        const q = filters.searchQuery.toLowerCase();
        items = items.filter(
          (l) =>
            l.id.toLowerCase().includes(q) ||
            l.entityName.toLowerCase().includes(q) ||
            (l.referenceId && l.referenceId.toLowerCase().includes(q))
        );
      }

      if (filters?.direction && filters.direction !== 'ALL') {
        items = items.filter((l) => l.direction === filters.direction);
      }

      if (filters?.entryType && filters.entryType !== 'ALL') {
        items = items.filter((l) => l.entryType === filters.entryType);
      }

      const totalCredits = items.filter((l) => l.direction === 'CREDIT').reduce((acc, l) => acc + l.amount, 0);
      const totalDebits = items.filter((l) => l.direction === 'DEBIT').reduce((acc, l) => acc + l.amount, 0);
      const netMovement = totalCredits - totalDebits;

      const summary: LedgerReportSummary = {
        totalCredits,
        totalDebits,
        netMovement,
        entryCount: items.length,
      };

      const totalItems = items.length;
      const totalPages = Math.ceil(totalItems / pageSize) || 1;
      const paginatedItems = items.slice((page - 1) * pageSize, page * pageSize);

      return {
        success: true,
        data: {
          items: paginatedItems,
          pagination: { page, pageSize, totalItems, totalPages },
          summary,
        },
        timestamp: new Date().toISOString(),
      };
    }
    return { success: false, data: null as unknown as ReportListResult<LedgerEntry, LedgerReportSummary>, timestamp: new Date().toISOString() };
  },

  /**
   * Settlement Management Report
   */
  async getSettlementReport(
    filters?: ReportFilters,
    page = 1,
    pageSize = 10
  ): Promise<ApiResponse<ReportListResult<Settlement, SettlementReportSummary>>> {
    if (APP_CONFIG.useMockData) {
      await new Promise((res) => setTimeout(res, 200));

      const setRes = await settlementService.getSettlements({}, 1, 100);
      let items = setRes.data?.items || [];

      if (filters?.searchQuery) {
        const q = filters.searchQuery.toLowerCase();
        items = items.filter(
          (s) =>
            s.settlementId.toLowerCase().includes(q) ||
            s.entityName.toLowerCase().includes(q) ||
            (s.utr && s.utr.toLowerCase().includes(q))
        );
      }

      if (filters?.status && filters.status !== 'ALL') {
        items = items.filter((s) => s.status === filters.status);
      }

      const totalSettlements = items.length;
      const pendingCount = items.filter((s) => s.status === 'ELIGIBLE' || s.status === 'QUEUED').length;
      const processingCount = items.filter((s) => s.status === 'PROCESSING').length;
      const settledCount = items.filter((s) => s.status === 'SETTLED').length;
      const failedCount = items.filter((s) => s.status === 'FAILED').length;
      const grossSettlementAmount = items.reduce((acc, s) => acc + s.grossAmount, 0);
      const netSettlementAmount = items.reduce((acc, s) => acc + s.netSettlementAmount, 0);

      const summary: SettlementReportSummary = {
        totalSettlements,
        pendingCount,
        processingCount,
        settledCount,
        failedCount,
        grossSettlementAmount,
        netSettlementAmount,
      };

      const totalItems = items.length;
      const totalPages = Math.ceil(totalItems / pageSize) || 1;
      const paginatedItems = items.slice((page - 1) * pageSize, page * pageSize);

      return {
        success: true,
        data: {
          items: paginatedItems,
          pagination: { page, pageSize, totalItems, totalPages },
          summary,
        },
        timestamp: new Date().toISOString(),
      };
    }
    return { success: false, data: null as unknown as ReportListResult<Settlement, SettlementReportSummary>, timestamp: new Date().toISOString() };
  },

  /**
   * Balance Report across Master, Distributors, Retailers, Merchants
   */
  async getBalanceReport(
    filters?: ReportFilters,
    page = 1,
    pageSize = 10
  ): Promise<ApiResponse<ReportListResult<WalletAccount, BalanceReportSummary>>> {
    if (APP_CONFIG.useMockData) {
      await new Promise((res) => setTimeout(res, 200));

      const wltRes = await walletService.getWallets({}, 1, 100);
      let items = wltRes.data?.items || [];

      if (filters?.entityType && filters.entityType !== 'ALL') {
        items = items.filter((w) => w.entityType === filters.entityType);
      }

      if (filters?.searchQuery) {
        const q = filters.searchQuery.toLowerCase();
        items = items.filter(
          (w) =>
            w.walletId.toLowerCase().includes(q) ||
            w.entityName.toLowerCase().includes(q) ||
            w.entityCode.toLowerCase().includes(q)
        );
      }

      const totalAvailable = items.reduce((acc, w) => acc + w.availableBalance, 0);
      const totalLedger = items.reduce((acc, w) => acc + w.ledgerBalance, 0);
      const totalHold = items.reduce((acc, w) => acc + w.holdBalance, 0);
      const pendingSettlement = items.reduce((acc, w) => acc + w.pendingSettlement, 0);

      const summary: BalanceReportSummary = {
        totalAvailable,
        totalLedger,
        totalHold,
        pendingSettlement,
      };

      const totalItems = items.length;
      const totalPages = Math.ceil(totalItems / pageSize) || 1;
      const paginatedItems = items.slice((page - 1) * pageSize, page * pageSize);

      return {
        success: true,
        data: {
          items: paginatedItems,
          pagination: { page, pageSize, totalItems, totalPages },
          summary,
        },
        timestamp: new Date().toISOString(),
      };
    }
    return { success: false, data: null as unknown as ReportListResult<WalletAccount, BalanceReportSummary>, timestamp: new Date().toISOString() };
  },

  /**
   * Account Statement Breakdown Report
   */
  async getAccountSummary(): Promise<ApiResponse<AccountSummary[]>> {
    if (APP_CONFIG.useMockData) {
      await new Promise((res) => setTimeout(res, 200));

      const wltRes = await walletService.getWallets({}, 1, 100);
      const wallets = wltRes.data?.items || [];

      const summaries: AccountSummary[] = wallets.map((w) => ({
        entityId: w.entityId,
        entityName: w.entityName,
        entityType: w.entityType,
        walletId: w.walletId,
        openingBalance: w.ledgerBalance - 50000,
        totalCredits: 150000,
        totalDebits: 100000,
        closingBalance: w.availableBalance,
        holdBalance: w.holdBalance,
        pendingSettlement: w.pendingSettlement,
        transactionCount: 12,
        settlementCount: 3,
      }));

      return { success: true, data: summaries, timestamp: new Date().toISOString() };
    }
    return { success: false, data: [], timestamp: new Date().toISOString() };
  },

  /**
   * API Provider Performance Analytics
   */
  async getApiPerformance(
    filters?: ApiPerformanceFilters
  ): Promise<ApiResponse<ApiPerformanceSummary>> {
    if (APP_CONFIG.useMockData) {
      await new Promise((res) => setTimeout(res, 200));

      let providers: ApiPerformanceSummary['providers'] = [
        {
          provider: 'HDFC Bank',
          service: 'Pay-In & Pay-Out Gateway',
          apiType: 'PAY_IN',
          totalRequests: 1450,
          successCount: 1420,
          failedCount: 30,
          successRate: 97.9,
          avgResponseTimeMs: 185,
          providerAvailability: 99.8,
          status: 'HEALTHY',
        },
        {
          provider: 'ICICI Bank',
          service: 'IMPS Direct Node',
          apiType: 'SETTLEMENT',
          totalRequests: 890,
          successCount: 885,
          failedCount: 5,
          successRate: 99.4,
          avgResponseTimeMs: 142,
          providerAvailability: 99.9,
          status: 'HEALTHY',
        },
        {
          provider: 'Axis Bank',
          service: 'NEFT Clearance Gateway',
          apiType: 'PAY_OUT',
          totalRequests: 620,
          successCount: 580,
          failedCount: 40,
          successRate: 93.5,
          avgResponseTimeMs: 310,
          providerAvailability: 96.2,
          lastFailureAt: '2026-09-03T12:10:00Z',
          status: 'DEGRADED',
        },
        {
          provider: 'Cashfree Payments',
          service: 'UPI Collection Service',
          apiType: 'PAY_IN',
          totalRequests: 2100,
          successCount: 2085,
          failedCount: 15,
          successRate: 99.2,
          avgResponseTimeMs: 110,
          providerAvailability: 99.9,
          status: 'HEALTHY',
        },
        {
          provider: 'Razorpay Node',
          service: 'Cards & NetBanking Hub',
          apiType: 'PAY_IN',
          totalRequests: 950,
          successCount: 935,
          failedCount: 15,
          successRate: 98.4,
          avgResponseTimeMs: 165,
          providerAvailability: 99.5,
          status: 'HEALTHY',
        },
      ];

      if (filters?.provider && filters.provider !== 'ALL') {
        providers = providers.filter((p) => p.provider.toLowerCase().includes(filters.provider!.toLowerCase()));
      }

      const totalRequests = providers.reduce((acc, p) => acc + p.totalRequests, 0);
      const successCount = providers.reduce((acc, p) => acc + p.successCount, 0);
      const failedCount = providers.reduce((acc, p) => acc + p.failedCount, 0);
      const overallSuccessRate = totalRequests > 0 ? Math.round((successCount / totalRequests) * 1000) / 10 : 100;
      const avgResponseTimeMs = Math.round(providers.reduce((acc, p) => acc + p.avgResponseTimeMs, 0) / (providers.length || 1));
      const overallAvailability = Math.round((providers.reduce((acc, p) => acc + p.providerAvailability, 0) / (providers.length || 1)) * 10) / 10;

      return {
        success: true,
        data: {
          totalRequests,
          successCount,
          failedCount,
          overallSuccessRate,
          avgResponseTimeMs,
          overallAvailability,
          providers,
        },
        timestamp: new Date().toISOString(),
      };
    }

    return { success: false, data: null as unknown as ApiPerformanceSummary, timestamp: new Date().toISOString() };
  },

  /**
   * Reusable CSV Exporter for Report Data
   */
  exportToCsv(filename: string, rows: Record<string, unknown>[]) {
    if (!rows || rows.length === 0) return;

    const headers = Object.keys(rows[0]);
    const csvLines: string[] = [];
    csvLines.push(headers.join(','));

    for (const row of rows) {
      const values = headers.map((header) => {
        const val = row[header];
        if (val === null || val === undefined) return '""';
        const str = String(val).replace(/"/g, '""');
        return `"${str}"`;
      });
      csvLines.push(values.join(','));
    }

    const csvContent = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csvLines.join('\n'));
    const link = document.createElement('a');
    link.setAttribute('href', csvContent);
    link.setAttribute('download', `${filename}_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },
};
