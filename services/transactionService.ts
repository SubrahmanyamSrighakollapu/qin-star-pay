import {
  Transaction,
  TransactionFilters,
  PaginationState,
  PayoutRequestInput,
  PayInRequestInput,
  PayoutChargeBreakdown,
} from '@/types/domain';
import { ApiResponse } from '@/types/common';
import { mockTransactions } from '@/mocks/mockTransactions';
import { apiClient } from './apiClient';
import { APP_CONFIG } from '@/config';

const inMemoryTransactions: Transaction[] = [...mockTransactions];

export interface TransactionListResult {
  items: Transaction[];
  pagination: PaginationState;
}

export const transactionService = {
  /**
   * Fetches transactions with filtering and pagination.
   */
  async getTransactions(
    filters?: TransactionFilters,
    page = 1,
    pageSize = 10
  ): Promise<ApiResponse<TransactionListResult>> {
    if (APP_CONFIG.useMockData) {
      await new Promise((res) => setTimeout(res, 200));

      let filtered = [...inMemoryTransactions];

      if (filters?.type && filters.type !== 'ALL') {
        filtered = filtered.filter((t) => t.type === filters.type);
      }

      if (filters?.status && filters.status !== 'ALL') {
        filtered = filtered.filter((t) => t.status === filters.status);
      }

      if (filters?.merchantId && filters.merchantId !== '') {
        filtered = filtered.filter((t) => t.merchantName.toLowerCase().includes(filters.merchantId!.toLowerCase()));
      }

      if (filters?.providerId && filters.providerId !== '') {
        filtered = filtered.filter((t) => t.provider?.toLowerCase().includes(filters.providerId!.toLowerCase()));
      }

      if (filters?.searchQuery && filters.searchQuery.trim() !== '') {
        const q = filters.searchQuery.trim().toLowerCase();
        filtered = filtered.filter(
          (t) =>
            t.transactionRef.toLowerCase().includes(q) ||
            (t.orderId && t.orderId.toLowerCase().includes(q)) ||
            (t.utr && t.utr.toLowerCase().includes(q)) ||
            t.merchantName.toLowerCase().includes(q) ||
            (t.customerMobile && t.customerMobile.includes(q)) ||
            (t.customerName && t.customerName.toLowerCase().includes(q)) ||
            (t.beneficiaryName && t.beneficiaryName.toLowerCase().includes(q))
        );
      }

      const totalItems = filtered.length;
      const totalPages = Math.ceil(totalItems / pageSize) || 1;
      const startIndex = (page - 1) * pageSize;
      const paginatedItems = filtered.slice(startIndex, startIndex + pageSize);

      return {
        success: true,
        data: {
          items: paginatedItems,
          pagination: {
            page,
            pageSize,
            totalItems,
            totalPages,
          },
        },
        timestamp: new Date().toISOString(),
      };
    }

    return apiClient.get<ApiResponse<TransactionListResult>>('/transactions', {
      params: { ...filters, page, pageSize } as unknown as Record<string, string | number | boolean>,
    });
  },

  /**
   * Fetches Pay-In specific transactions.
   */
  async getPayinTransactions(
    filters?: TransactionFilters,
    page = 1,
    pageSize = 10
  ): Promise<ApiResponse<TransactionListResult>> {
    return this.getTransactions({ ...filters, type: 'PAY_IN' }, page, pageSize);
  },

  /**
   * Fetches Pay-Out specific transactions.
   */
  async getPayoutTransactions(
    filters?: TransactionFilters,
    page = 1,
    pageSize = 10
  ): Promise<ApiResponse<TransactionListResult>> {
    return this.getTransactions({ ...filters, type: 'PAY_OUT' }, page, pageSize);
  },

  /**
   * Search transactions by keyword/ID.
   */
  async searchTransactions(query: string, filters?: TransactionFilters): Promise<ApiResponse<TransactionListResult>> {
    return this.getTransactions({ ...filters, searchQuery: query }, 1, 50);
  },

  /**
   * Get single transaction details by ID or transactionRef.
   */
  async getTransactionById(idOrRef: string): Promise<ApiResponse<Transaction | null>> {
    if (APP_CONFIG.useMockData) {
      await new Promise((res) => setTimeout(res, 150));
      const tx =
        inMemoryTransactions.find((t) => t.id === idOrRef || t.transactionRef === idOrRef) || null;
      return {
        success: !!tx,
        data: tx,
        timestamp: new Date().toISOString(),
      };
    }
    return apiClient.get<ApiResponse<Transaction>>(`/transactions/${idOrRef}`);
  },

  /**
   * Mock calculation for Payout charges (Fee + GST + TDS).
   */
  calculateMockPayoutCharges(amount: number): PayoutChargeBreakdown {
    const fee = Math.max(10.0, +(amount * 0.001).toFixed(2)); // 0.1% or min ₹10
    const gst = +(fee * 0.18).toFixed(2); // 18% GST on fee
    const tds = +(amount * 0.001).toFixed(2); // 0.1% TDS
    const totalDebit = +(amount + fee + gst + tds).toFixed(2);

    return {
      amount,
      fee,
      gst,
      tds,
      totalDebit,
    };
  },

  /**
   * Create mock Pay-In Payment Request.
   */
  async createMockPayinRequest(input: PayInRequestInput): Promise<ApiResponse<Transaction>> {
    if (APP_CONFIG.useMockData) {
      await new Promise((res) => setTimeout(res, 400));
      const refNum = `QSP${new Date().getFullYear()}${String(Date.now()).slice(-6)}`;
      const newTx: Transaction = {
        id: `tx_${Date.now()}`,
        transactionRef: refNum,
        orderId: input.orderId || `ORD_${Date.now()}`,
        merchantName: input.merchantId || 'Apex Pay Solutions',
        distributorName: input.distributorId,
        retailerName: input.retailerId,
        type: 'PAY_IN',
        amount: input.amount,
        fee: +(input.amount * 0.001).toFixed(2),
        gst: +(input.amount * 0.00018).toFixed(2),
        netAmount: +(input.amount * 0.99882).toFixed(2),
        status: 'PENDING',
        paymentMode: 'UPI',
        provider: 'Provider A',
        service: input.service || 'UPI Payment Request',
        channel: 'Web',
        customerName: input.customerName,
        customerMobile: input.customerMobile,
        customerEmail: input.customerEmail,
        createdAt: new Date().toISOString(),
        timeline: [
          { timestamp: new Date().toLocaleTimeString(), event: 'Payment Request Generated', description: 'Mock Pay-In payment request created', status: 'COMPLETED' },
          { timestamp: new Date().toLocaleTimeString(), event: 'Awaiting Payer Action', description: 'Payment link sent to payer', status: 'PENDING' },
        ],
      };

      inMemoryTransactions.unshift(newTx);

      return {
        success: true,
        data: newTx,
        timestamp: new Date().toISOString(),
      };
    }

    return apiClient.post<ApiResponse<Transaction>>('/transactions/payin/request', input);
  },

  /**
   * Create mock Pay-Out initiation.
   */
  async createMockPayout(input: PayoutRequestInput): Promise<ApiResponse<Transaction>> {
    if (APP_CONFIG.useMockData) {
      await new Promise((res) => setTimeout(res, 500));
      const charges = this.calculateMockPayoutCharges(input.amount);
      const refNum = `QSP${new Date().getFullYear()}${String(Date.now()).slice(-6)}`;
      const newTx: Transaction = {
        id: `tx_${Date.now()}`,
        transactionRef: refNum,
        orderId: input.orderReference || `ORD_${Date.now()}`,
        referenceId: `REF_${Date.now()}`,
        utr: `UTR${Date.now()}`,
        merchantName: input.merchantId || 'Apex Pay Solutions',
        distributorName: input.distributorId,
        retailerName: input.retailerId,
        type: 'PAY_OUT',
        amount: input.amount,
        fee: charges.fee,
        gst: charges.gst,
        tds: charges.tds,
        netAmount: charges.totalDebit,
        status: 'PROCESSING',
        paymentMode: input.paymentMode,
        provider: 'Provider B',
        service: `${input.paymentMode} Disburser`,
        channel: 'Web',
        beneficiaryName: input.beneficiaryName,
        beneficiaryAccount: input.accountNumber ? `XXXXXX${input.accountNumber.slice(-4)}` : undefined,
        beneficiaryIfsc: input.ifscCode,
        beneficiaryBank: input.bankName || 'HDFC Bank',
        customerMobile: input.mobileNumber,
        accountNumberMasked: input.accountNumber ? `XXXXXX${input.accountNumber.slice(-4)}` : input.upiId,
        createdAt: new Date().toISOString(),
        timeline: [
          { timestamp: new Date().toLocaleTimeString(), event: 'Payout Initiated', description: 'Payout request received', status: 'COMPLETED' },
          { timestamp: new Date().toLocaleTimeString(), event: 'Wallet Validated', description: `Debited ₹${charges.totalDebit}`, status: 'COMPLETED' },
          { timestamp: new Date().toLocaleTimeString(), event: 'Sent to Bank Switch', description: 'Awaiting beneficiary bank acknowledgement', status: 'PENDING' },
        ],
        callbackSummary: {
          callbackReceived: false,
          processingStatus: 'AWAITING_CALLBACK',
          retryCount: 0,
        },
      };

      inMemoryTransactions.unshift(newTx);

      return {
        success: true,
        data: newTx,
        timestamp: new Date().toISOString(),
      };
    }

    return apiClient.post<ApiResponse<Transaction>>('/transactions/payout', input);
  },

  /**
   * Requery / Check Latest Status mock method.
   */
  async checkStatus(id: string): Promise<ApiResponse<Transaction>> {
    if (APP_CONFIG.useMockData) {
      await new Promise((res) => setTimeout(res, 400));
      const tx = inMemoryTransactions.find((t) => t.id === id || t.transactionRef === id);
      if (tx) {
        // If it was PROCESSING or PENDING, simulate transition to SUCCESS
        if (tx.status === 'PROCESSING' || tx.status === 'PENDING') {
          tx.status = 'SUCCESS';
          tx.updatedAt = new Date().toISOString();
          tx.timeline?.push({
            timestamp: new Date().toLocaleTimeString(),
            event: 'Status Check Requery',
            description: 'Provider confirmed transaction SUCCESS',
            status: 'COMPLETED',
          });
        }
        return {
          success: true,
          data: { ...tx },
          timestamp: new Date().toISOString(),
        };
      }
      return {
        success: false,
        data: null as unknown as Transaction,
        timestamp: new Date().toISOString(),
      };
    }
    return apiClient.post<ApiResponse<Transaction>>(`/transactions/${id}/check-status`);
  },
};
