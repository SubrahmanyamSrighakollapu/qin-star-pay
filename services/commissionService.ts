import { ApiResponse } from '@/types/common';
import { PaginationState } from '@/types/domain';
import { hierarchyService } from './hierarchyService';
import { transactionService } from './transactionService';
import { APP_CONFIG } from '@/config';

export interface MasterDistributorCommissionRecord {
  id: string;
  transactionId: string;
  transactionRef: string;
  retailerId: string;
  retailerName: string;
  distributorId: string;
  distributorName: string;
  serviceType: string;
  transactionAmount: number;
  mdCommissionRate: string;
  mdCommissionAmount: number;
  status: 'CREDITED' | 'PENDING' | 'REVERSED';
  createdDate: string;
  creditedDate?: string;
  walletReferenceId?: string;
}

export interface ScopedCommissionSummary {
  todayCommission: number;
  yesterdayCommission: number;
  thisMonthCommission: number;
  previousMonthCommission: number;
  pendingCommission: number;
  creditedCommission: number;
}

export interface CommissionFilters {
  searchQuery?: string;
  distributorId?: string;
  retailerId?: string;
  status?: string;
  serviceType?: string;
}

export interface CommissionListResult {
  items: MasterDistributorCommissionRecord[];
  pagination: PaginationState;
  summary: ScopedCommissionSummary;
}

class CommissionService {
  async getCommissionsForMasterDistributor(
    masterDistributorId: string,
    filters?: CommissionFilters,
    page = 1,
    pageSize = 10
  ): Promise<ApiResponse<CommissionListResult>> {
    if (APP_CONFIG.useMockData) {
      await new Promise((res) => setTimeout(res, 200));

      const txRes = await transactionService.getTransactionsForMasterDistributor(masterDistributorId, {}, 1, 100);
      const transactions = txRes.data?.items || [];

      // Generate historical commission records based on transaction snapshots
      const mockCommissions: MasterDistributorCommissionRecord[] = transactions.map((t, idx) => {
        const isPayIn = t.type === 'PAY_IN';
        const rateStr = isPayIn ? '0.10%' : '₹ 1.00';
        const commAmt = isPayIn ? +(t.amount * 0.001).toFixed(2) : 1.00;
        const status: 'CREDITED' | 'PENDING' | 'REVERSED' =
          t.status === 'SUCCESS' ? 'CREDITED' : t.status === 'REVERSED' ? 'REVERSED' : 'PENDING';

        return {
          id: `comm_${t.id}`,
          transactionId: t.id,
          transactionRef: t.transactionRef,
          retailerId: t.retailerId || `ret_00${(idx % 5) + 1}`,
          retailerName: t.retailerName || t.merchantName || `Metro Outlet #${idx + 1}`,
          distributorId: t.distributorId || `dst_00${(idx % 3) + 1}`,
          distributorName: t.distributorName || `North Zone Dist`,
          serviceType: t.service || (isPayIn ? 'UPI Pay-In Switch' : 'IMPS Payout Switch'),
          transactionAmount: t.amount,
          mdCommissionRate: rateStr,
          mdCommissionAmount: commAmt,
          status,
          createdDate: t.createdAt,
          creditedDate: status === 'CREDITED' ? t.updatedAt || t.createdAt : undefined,
          walletReferenceId: status === 'CREDITED' ? `COMM_CREDIT_99${idx + 10}` : undefined,
        };
      });

      // Filter by distributorId security check
      if (filters?.distributorId && filters.distributorId !== 'ALL') {
        const dst = hierarchyService.getDistributorById(filters.distributorId);
        if (!dst || dst.masterDistributorId !== masterDistributorId) {
          return {
            success: true,
            data: {
              items: [],
              pagination: { page: 1, pageSize, totalItems: 0, totalPages: 1 },
              summary: {
                todayCommission: 0,
                yesterdayCommission: 0,
                thisMonthCommission: 0,
                previousMonthCommission: 0,
                pendingCommission: 0,
                creditedCommission: 0,
              },
            },
            timestamp: new Date().toISOString(),
          };
        }
      }

      let filtered = [...mockCommissions];

      if (filters?.status && filters.status !== 'ALL') {
        filtered = filtered.filter((c) => c.status === filters.status);
      }

      if (filters?.distributorId && filters.distributorId !== 'ALL') {
        filtered = filtered.filter((c) => c.distributorId === filters.distributorId);
      }

      if (filters?.retailerId && filters.retailerId !== 'ALL') {
        filtered = filtered.filter((c) => c.retailerId === filters.retailerId);
      }

      if (filters?.searchQuery && filters.searchQuery.trim() !== '') {
        const q = filters.searchQuery.trim().toLowerCase();
        filtered = filtered.filter(
          (c) =>
            c.transactionRef.toLowerCase().includes(q) ||
            c.retailerName.toLowerCase().includes(q) ||
            c.distributorName.toLowerCase().includes(q)
        );
      }

      // Compute summary
      const todayCommission = masterDistributorId === 'md_002' ? 980.0 : 1450.0;
      const yesterdayCommission = masterDistributorId === 'md_002' ? 840.0 : 1150.0;
      const thisMonthCommission = masterDistributorId === 'md_002' ? 18400.0 : 28950.0;
      const previousMonthCommission = masterDistributorId === 'md_002' ? 16200.0 : 24100.0;
      const pendingCommission = filtered.filter((c) => c.status === 'PENDING').reduce((s, c) => s + c.mdCommissionAmount, 0);
      const creditedCommission = filtered.filter((c) => c.status === 'CREDITED').reduce((s, c) => s + c.mdCommissionAmount, 0);

      const summary: ScopedCommissionSummary = {
        todayCommission,
        yesterdayCommission,
        thisMonthCommission,
        previousMonthCommission,
        pendingCommission,
        creditedCommission,
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

    return {
      success: false,
      data: null as unknown as CommissionListResult,
      timestamp: new Date().toISOString(),
    };
  }

  async getCommissionsForDistributor(
    distributorId: string,
    filters?: CommissionFilters,
    page = 1,
    pageSize = 10
  ): Promise<ApiResponse<CommissionListResult>> {
    if (APP_CONFIG.useMockData) {
      await new Promise((res) => setTimeout(res, 200));

      const txRes = await transactionService.getTransactionsForDistributor(distributorId, {}, 1, 100);
      const transactions = txRes.data?.items || [];

      // Generate historical commission records based on transaction snapshots for Distributor
      const mockCommissions: MasterDistributorCommissionRecord[] = transactions.map((t, idx) => {
        const isPayIn = t.type === 'PAY_IN';
        const rateStr = isPayIn ? '0.15%' : '₹ 2.00';
        const commAmt = isPayIn ? +(t.amount * 0.0015).toFixed(2) : 2.00;
        const status: 'CREDITED' | 'PENDING' | 'REVERSED' =
          t.status === 'SUCCESS' ? 'CREDITED' : t.status === 'REVERSED' ? 'REVERSED' : 'PENDING';

        return {
          id: `dst_comm_${t.id}`,
          transactionId: t.id,
          transactionRef: t.transactionRef,
          retailerId: t.retailerId || `ret_00${(idx % 5) + 1}`,
          retailerName: t.retailerName || t.merchantName || `Metro Outlet #${idx + 1}`,
          distributorId: distributorId,
          distributorName: 'North Zone Distributor',
          serviceType: t.service || (isPayIn ? 'UPI Pay-In Switch' : 'IMPS Payout Switch'),
          transactionAmount: t.amount,
          mdCommissionRate: rateStr,
          mdCommissionAmount: commAmt,
          status,
          createdDate: t.createdAt,
          creditedDate: status === 'CREDITED' ? t.updatedAt || t.createdAt : undefined,
          walletReferenceId: status === 'CREDITED' ? `COMM_DST_99${idx + 10}` : undefined,
        };
      });

      let filtered = [...mockCommissions];

      if (filters?.status && filters.status !== 'ALL') {
        filtered = filtered.filter((c) => c.status === filters.status);
      }

      if (filters?.retailerId && filters.retailerId !== 'ALL') {
        filtered = filtered.filter((c) => c.retailerId === filters.retailerId);
      }

      if (filters?.searchQuery && filters.searchQuery.trim() !== '') {
        const q = filters.searchQuery.trim().toLowerCase();
        filtered = filtered.filter(
          (c) =>
            c.transactionRef.toLowerCase().includes(q) ||
            c.retailerName.toLowerCase().includes(q)
        );
      }

      const todayCommission = distributorId === 'dst_002' ? 420.0 : 680.0;
      const yesterdayCommission = distributorId === 'dst_002' ? 380.0 : 540.0;
      const thisMonthCommission = distributorId === 'dst_002' ? 8450.0 : 12450.0;
      const previousMonthCommission = distributorId === 'dst_002' ? 7200.0 : 10800.0;
      const pendingCommission = 140.0;
      const creditedCommission = thisMonthCommission - pendingCommission;

      const summary: ScopedCommissionSummary = {
        todayCommission,
        yesterdayCommission,
        thisMonthCommission,
        previousMonthCommission,
        pendingCommission,
        creditedCommission,
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

    return {
      success: false,
      data: null as unknown as CommissionListResult,
      timestamp: new Date().toISOString(),
    };
  }

  async getCommissionsForRetailer(
    retailerId: string,
    filters?: CommissionFilters,
    page = 1,
    pageSize = 10
  ): Promise<ApiResponse<CommissionListResult>> {
    if (APP_CONFIG.useMockData) {
      await new Promise((res) => setTimeout(res, 200));

      const txRes = await transactionService.getTransactionsForRetailer(retailerId, {}, 1, 100);
      const transactions = txRes.data?.items || [];

      const mockCommissions: MasterDistributorCommissionRecord[] = transactions.map((t, idx) => {
        const isPayIn = t.type === 'PAY_IN';
        const rateStr = isPayIn ? '0.25%' : '₹ 3.50';
        const commAmt = isPayIn ? +(t.amount * 0.0025).toFixed(2) : 3.50;
        const status: 'CREDITED' | 'PENDING' | 'REVERSED' =
          t.status === 'SUCCESS' ? 'CREDITED' : t.status === 'REVERSED' ? 'REVERSED' : 'PENDING';

        return {
          id: `ret_comm_${t.id}`,
          transactionId: t.id,
          transactionRef: t.transactionRef,
          retailerId: retailerId,
          retailerName: 'Metro Store #01',
          distributorId: 'dst_001',
          distributorName: 'North Zone Distributor',
          serviceType: t.service || (isPayIn ? 'UPI Pay-In Switch' : 'IMPS Payout Switch'),
          transactionAmount: t.amount,
          mdCommissionRate: rateStr,
          mdCommissionAmount: commAmt,
          status,
          createdDate: t.createdAt,
          creditedDate: status === 'CREDITED' ? t.updatedAt || t.createdAt : undefined,
          walletReferenceId: status === 'CREDITED' ? `COMM_RET_99${idx + 10}` : undefined,
        };
      });

      let filtered = [...mockCommissions];

      if (filters?.status && filters.status !== 'ALL') {
        filtered = filtered.filter((c) => c.status === filters.status);
      }

      if (filters?.searchQuery && filters.searchQuery.trim() !== '') {
        const q = filters.searchQuery.trim().toLowerCase();
        filtered = filtered.filter((c) => c.transactionRef.toLowerCase().includes(q));
      }

      const todayCommission = retailerId === 'ret_002' ? 180.0 : 345.50;
      const yesterdayCommission = retailerId === 'ret_002' ? 140.0 : 280.0;
      const thisMonthCommission = retailerId === 'ret_002' ? 4200.0 : 6450.0;
      const previousMonthCommission = retailerId === 'ret_002' ? 3800.0 : 5800.0;
      const pendingCommission = 45.0;
      const creditedCommission = thisMonthCommission - pendingCommission;

      const summary: ScopedCommissionSummary = {
        todayCommission,
        yesterdayCommission,
        thisMonthCommission,
        previousMonthCommission,
        pendingCommission,
        creditedCommission,
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

    return {
      success: false,
      data: null as unknown as CommissionListResult,
      timestamp: new Date().toISOString(),
    };
  }
}

export const commissionService = new CommissionService();
