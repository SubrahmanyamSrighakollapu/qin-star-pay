import { hierarchyService } from '@/services/hierarchyService';
import { mockTransactions } from '@/mocks/mockTransactions';
import { Transaction, Distributor, MasterDistributor, Retailer } from '@/types/domain';
import { ApiResponse } from '@/types/common';

export interface DistributorDashboardSummary {
  distributor: Distributor | null;
  parentMasterDistributor: MasterDistributor | null;

  // Network KPIs
  totalRetailers: number;
  activeRetailers: number;
  pendingAdminApprovalRetailers: number;
  inactiveRetailers: number;

  // Financial KPIs
  todayTransactionsCount: number;
  todayPayInVolume: number;
  todayPayOutVolume: number;
  failedTransactionsCount: number;

  // Wallet
  walletBalance: number;
  walletHold: number;
  walletPendingSettlement: number;
  walletId: string;
  walletLastUpdated: string;

  // Commission
  todayCommission: number;
  thisMonthCommission: number;
  pendingCommission: number;
  creditedCommission: number;

  // Trend Data
  trendData: {
    date: string;
    payinVolume: number;
    payoutVolume: number;
    commission: number;
    count: number;
  }[];

  // Top Performing Retailers
  topRetailers: {
    id: string;
    code: string;
    name: string;
    todayTransactions: number;
    todayVolume: number;
    commission: number;
    status: string;
    approvalStatus: string;
  }[];

  // Scoped Recent Transactions
  recentTransactions: Transaction[];

  // Requires Attention Items
  attentionItems: {
    id: string;
    title: string;
    description: string;
    severity: 'warning' | 'info' | 'danger';
    count?: number;
    href?: string;
  }[];

  // Recent Network Activity
  recentActivity: {
    id: string;
    title: string;
    description: string;
    timestamp: string;
    type: 'retailer' | 'commission' | 'transaction' | 'system' | 'wallet';
  }[];
}

class DistributorDashboardService {
  async getDashboardSummary(
    distributorIdOrCode: string
  ): Promise<ApiResponse<DistributorDashboardSummary>> {
    // 1. Resolve Distributor record
    const dist =
      hierarchyService.getDistributorById(distributorIdOrCode) ||
      hierarchyService.getAllDistributors()[0] ||
      null;

    const targetDistId = dist ? dist.id : 'dst_001';

    // 2. Resolve parent Master Distributor
    const parentMd = dist?.masterDistributorId
      ? hierarchyService.getMasterDistributorById(dist.masterDistributorId)
      : hierarchyService.getAllMasterDistributors()[0] || null;

    // 3. Resolve Retailers assigned directly to this Distributor
    const networkRetailers = hierarchyService.getDistributorRetailers(targetDistId);

    const totalRetailers = networkRetailers.length;
    const activeRetailers = networkRetailers.filter(
      (r) => r.approvalStatus === 'APPROVED' && r.accountStatus === 'ACTIVE'
    ).length;
    const pendingAdminApprovalRetailers = networkRetailers.filter(
      (r) => r.approvalStatus === 'PENDING_APPROVAL'
    ).length;
    const inactiveRetailers = networkRetailers.filter(
      (r) => r.accountStatus !== 'ACTIVE' && r.approvalStatus !== 'PENDING_APPROVAL'
    ).length;

    // 4. Scoped Transactions for this Distributor
    const networkRetailerNames = new Set(networkRetailers.map((r) => r.name.toLowerCase()));
    const networkRetailerIds = new Set(networkRetailers.map((r) => r.id));

    const scopedTransactions = mockTransactions.filter((tx) => {
      if (tx.distributorId === targetDistId) return true;
      if (tx.retailerId && networkRetailerIds.has(tx.retailerId)) return true;
      if (tx.retailerName && networkRetailerNames.has(tx.retailerName.toLowerCase())) return true;
      if (dist && tx.distributorName?.toLowerCase() === dist.name.toLowerCase()) return true;
      return true; // Fallback pool to populate rich demo metrics
    });

    const todayPayIn = 82500.00;
    const todayPayOut = 42000.00;
    const todayCount = 34; // Reconciled with MD Top Distributor row for DST001
    const failedCount = scopedTransactions.filter((t) => t.status === 'FAILED').length;

    // 5. Wallet & Commission Scoping for DST001
    const walletBalance = dist?.id === 'dst_002' ? 54200.00 : 85200.00;
    const walletHold = 0.00;
    const walletPendingSettlement = 2450.00;

    const todayCommission = dist?.id === 'dst_002' ? 420.00 : 680.00;
    const thisMonthCommission = dist?.id === 'dst_002' ? 8450.00 : 12450.00;
    const pendingCommission = 140.00;
    const creditedCommission = thisMonthCommission - pendingCommission;

    // 6. 7-Day Trend Data
    const trendData = [
      { date: 'Aug 29', payinVolume: 28000, payoutVolume: 14000, commission: 240, count: 12 },
      { date: 'Aug 30', payinVolume: 41000, payoutVolume: 22000, commission: 380, count: 18 },
      { date: 'Aug 31', payinVolume: 35000, payoutVolume: 18000, commission: 310, count: 15 },
      { date: 'Sep 01', payinVolume: 62000, payoutVolume: 32000, commission: 510, count: 26 },
      { date: 'Sep 02', payinVolume: 53000, payoutVolume: 28000, commission: 450, count: 22 },
      { date: 'Sep 03', payinVolume: 78000, payoutVolume: 39000, commission: 640, count: 31 },
      { date: 'Sep 04', payinVolume: todayPayIn, payoutVolume: todayPayOut, commission: todayCommission, count: todayCount },
    ];

    // 7. Top Performing Retailers rank-ordered
    const topRetailers = networkRetailers.map((ret: Retailer, idx: number) => {
      const volume = idx === 0 ? 54500 : idx === 1 ? 28000 : idx === 2 ? 0 : 42000;
      const txns = idx === 0 ? 18 : idx === 1 ? 10 : idx === 2 ? 0 : 6;
      const comm = idx === 0 ? 320 : idx === 1 ? 180 : idx === 2 ? 0 : 180;
      return {
        id: ret.id,
        code: ret.code,
        name: ret.name,
        todayTransactions: txns,
        todayVolume: volume,
        commission: comm,
        status: ret.accountStatus,
        approvalStatus: ret.approvalStatus,
      };
    }).sort((a, b) => b.todayVolume - a.todayVolume);

    // 8. Requires Attention Items
    const attentionItems = [
      ...(pendingAdminApprovalRetailers > 0
        ? [
            {
              id: 'dst_att_01',
              title: `${pendingAdminApprovalRetailers} Retailer Awaiting Admin Approval`,
              description: 'Retailer application submitted. Awaiting platform Admin review.',
              severity: 'warning' as const,
              count: pendingAdminApprovalRetailers,
              href: '/distributor/retailers',
            },
          ]
        : []),
      ...(failedCount > 0
        ? [
            {
              id: 'dst_att_02',
              title: `${failedCount} Failed Pay-Out Transaction`,
              description: 'Bank timeout or validation failure detected. Requery available.',
              severity: 'danger' as const,
              count: failedCount,
              href: '/distributor/transactions',
            },
          ]
        : []),
      {
        id: 'dst_att_03',
        title: 'Weekly Retailer Network Commission Credited',
        description: 'Commission credited directly to Distributor wallet.',
        severity: 'info' as const,
        href: '/distributor/commissions',
      },
    ];

    // 9. Recent Scoped Network Activity
    const recentActivity = [
      {
        id: 'dst_act_01',
        title: 'Retailer Application Submitted',
        description: 'Capital Express Point (RET002) submitted for Admin approval.',
        timestamp: '15 mins ago',
        type: 'retailer' as const,
      },
      {
        id: 'dst_act_02',
        title: 'Distributor Commission Credited',
        description: '₹680.00 credited to wallet for today\'s network volume.',
        timestamp: '1 hour ago',
        type: 'commission' as const,
      },
      {
        id: 'dst_act_03',
        title: 'Retailer Onboarding Approved',
        description: 'Metro Store #01 (RET001) KYC & account approved by Admin.',
        timestamp: 'Yesterday at 14:20',
        type: 'retailer' as const,
      },
      {
        id: 'dst_act_04',
        title: 'Wallet Credit Settlement',
        description: '₹50,000.00 credited from Master Distributor settlement.',
        timestamp: '3 days ago',
        type: 'wallet' as const,
      },
    ];

    const data: DistributorDashboardSummary = {
      distributor: dist,
      parentMasterDistributor: parentMd,

      totalRetailers,
      activeRetailers,
      pendingAdminApprovalRetailers,
      inactiveRetailers,

      todayTransactionsCount: todayCount,
      todayPayInVolume: todayPayIn,
      todayPayOutVolume: todayPayOut,
      failedTransactionsCount: failedCount,

      walletBalance,
      walletHold,
      walletPendingSettlement,
      walletId: dist?.walletId || 'wlt_dst_001',
      walletLastUpdated: new Date().toISOString(),

      todayCommission,
      thisMonthCommission,
      pendingCommission,
      creditedCommission,

      trendData,
      topRetailers,
      recentTransactions: scopedTransactions.slice(0, 6),
      attentionItems,
      recentActivity,
    };

    return {
      success: true,
      data,
      timestamp: new Date().toISOString(),
    };
  }
}

export const distributorDashboardService = new DistributorDashboardService();
