import { LedgerEntry, LedgerFilters, PaginationState } from '@/types/domain';
import { ApiResponse } from '@/types/common';
import { mockLedgerEntries } from '@/mocks/mockWallet';
import { apiClient } from './apiClient';
import { APP_CONFIG } from '@/config';

const inMemoryLedger: LedgerEntry[] = [...mockLedgerEntries];

export interface LedgerListResult {
  items: LedgerEntry[];
  pagination: PaginationState;
}

export const ledgerService = {
  /**
   * Internal helper to record mock ledger entries synchronously with wallet adjustments.
   */
  addMockLedgerEntry(entryInput: Omit<LedgerEntry, 'id' | 'createdAt'>): LedgerEntry {
    const newEntry: LedgerEntry = {
      id: `led_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      createdAt: new Date().toISOString(),
      ...entryInput,
    };
    inMemoryLedger.unshift(newEntry);
    return newEntry;
  },

  async getLedgerEntries(
    filters?: LedgerFilters,
    page = 1,
    pageSize = 10
  ): Promise<ApiResponse<LedgerListResult>> {
    if (APP_CONFIG.useMockData) {
      await new Promise((res) => setTimeout(res, 200));

      let filtered = [...inMemoryLedger];

      if (filters?.entityType && filters.entityType !== 'ALL') {
        filtered = filtered.filter((l) => l.entityType === filters.entityType);
      }

      if (filters?.direction && filters.direction !== 'ALL') {
        filtered = filtered.filter((l) => l.direction === filters.direction);
      }

      if (filters?.entryType && filters.entryType !== 'ALL') {
        filtered = filtered.filter((l) => l.entryType === filters.entryType);
      }

      if (filters?.searchQuery && filters.searchQuery.trim() !== '') {
        const q = filters.searchQuery.trim().toLowerCase();
        filtered = filtered.filter(
          (l) =>
            l.id.toLowerCase().includes(q) ||
            l.walletId.toLowerCase().includes(q) ||
            l.entityName.toLowerCase().includes(q) ||
            (l.transactionId && l.transactionId.toLowerCase().includes(q)) ||
            (l.referenceId && l.referenceId.toLowerCase().includes(q))
        );
      }

      const totalItems = filtered.length;
      const totalPages = Math.ceil(totalItems / pageSize) || 1;
      const items = filtered.slice((page - 1) * pageSize, page * pageSize);

      return {
        success: true,
        data: {
          items,
          pagination: { page, pageSize, totalItems, totalPages },
        },
        timestamp: new Date().toISOString(),
      };
    }

    return apiClient.get<ApiResponse<LedgerListResult>>('/ledger/entries', {
      params: { ...filters, page, pageSize } as unknown as Record<string, string | number | boolean>,
    });
  },

  async getLedgerEntryById(id: string): Promise<ApiResponse<LedgerEntry | null>> {
    if (APP_CONFIG.useMockData) {
      await new Promise((res) => setTimeout(res, 150));
      const entry = inMemoryLedger.find((l) => l.id === id) || null;
      return {
        success: !!entry,
        data: entry,
        timestamp: new Date().toISOString(),
      };
    }
    return apiClient.get<ApiResponse<LedgerEntry>>(`/ledger/entries/${id}`);
  },
};
