import { hierarchyService } from '@/services/hierarchyService';
import { mockTransactions } from '@/mocks/mockTransactions';
import { Transaction, MasterDistributor, Distributor, Retailer } from '@/types/domain';
import { ApiResponse } from '@/types/common';

export interface MasterDistributorDashboardSummary {
  masterDistributor: MasterDistributor | null;
  totalDistributors: number;
  totalRetailers: number;
  activeRetailers: number;
  pendingRetailerApprovals: number;
  rejectedRetailers: number;

  todayTransactionsCount: number;
  todayPayInVolume: number;
  todayPayOutVolume: number;
  failedTransactionsCount: number;

  walletBalance: number;
  walletHold: number;
  walletId: string;
  walletLastUpdated: string;

  todayCommission: number;
  monthlyCommission: number;

  trendData: {
    date: string;
    payinVolume: number;
    payoutVolume: number;
    commission: number;
    count: number;
  }[];

  topDistributors: {
    id: string;
    code: string;
    name: string;
    retailersCount: number;
    todayTransactions: number;
    todayVolume: number;
    status: string;
  }[];

  recentTransactions: Transaction[];

  attentionItems: {
    id: string;
    title: string;
    description: string;
    severity: 'warning' | 'info' | 'danger';
    count?: number;
    href?: string;
  }[];

  networkActivity: {
    id: string;
    title: string;
    description: string;
    timestamp: string;
    type: 'retailer' | 'distributor' | 'commission' | 'transaction' | 'system';
  }[];
}

class MasterDistributorService {
  async getDashboardSummary(
    masterDistributorIdOrCode: string
  ): Promise<ApiResponse<MasterDistributorDashboardSummary>> {
    // 1. Resolve Master Distributor record
    const md =
      hierarchyService.getMasterDistributorById(masterDistributorIdOrCode) ||
      hierarchyService.getAllMasterDistributors()[0] ||
      null;

    const targetMdId = md ? md.id : 'md_001';

    // 2. Resolve Distributors and Retailers in MD network
    const networkDistributors = hierarchyService.getMasterDistributorDistributors(targetMdId);
    const networkRetailers = hierarchyService.getMasterDistributorRetailers(targetMdId);

    const totalDistributors = networkDistributors.length;
    const totalRetailers = networkRetailers.length;
    const activeRetailers = networkRetailers.filter(
      (r) => r.approvalStatus === 'APPROVED' && r.accountStatus === 'ACTIVE'
    ).length;
    const pendingRetailerApprovals = networkRetailers.filter(
      (r) => r.approvalStatus === 'PENDING_APPROVAL'
    ).length;
    const rejectedRetailers = networkRetailers.filter(
      (r) => r.approvalStatus === 'REJECTED'
    ).length;

    // 3. Scoped Transactions
    // In mock dataset, match transactions where distributor/retailer matches network or fallback to mock pool
    const networkDistributorNames = new Set(networkDistributors.map((d) => d.name));

    const scopedTransactions = mockTransactions.filter((tx) => {
      if (tx.distributorName && networkDistributorNames.has(tx.distributorName)) return true;
      return true; // Fallback to populate rich demo dashboard
    });

    const todayPayIn = scopedTransactions
      .filter((t) => t.type === 'PAY_IN' && t.status === 'SUCCESS')
      .reduce((sum, t) => sum + t.amount, 0);

    const todayPayOut = scopedTransactions
      .filter((t) => t.type === 'PAY_OUT' && (t.status === 'SUCCESS' || t.status === 'PROCESSING'))
      .reduce((sum, t) => sum + t.amount, 0);

    const failedCount = scopedTransactions.filter((t) => t.status === 'FAILED').length;

    // 4. Wallet & Commission Scoping
    const walletBalance = md?.id === 'md_002' ? 185400.00 : 245800.00;
    const todayCommission = md?.id === 'md_002' ? 980.00 : 1450.00;
    const monthlyCommission = md?.id === 'md_002' ? 18400.00 : 28950.00;

    // 5. 7-Day Trend Data
    const trendData = [
      { date: 'Aug 29', payinVolume: 42000, payoutVolume: 28000, commission: 380, count: 18 },
      { date: 'Aug 30', payinVolume: 65000, payoutVolume: 41000, commission: 540, count: 26 },
      { date: 'Aug 31', payinVolume: 51000, payoutVolume: 35000, commission: 460, count: 22 },
      { date: 'Sep 01', payinVolume: 89000, payoutVolume: 62000, commission: 820, count: 39 },
      { date: 'Sep 02', payinVolume: 74000, payoutVolume: 53000, commission: 690, count: 31 },
      { date: 'Sep 03', payinVolume: 112000, payoutVolume: 78000, commission: 1150, count: 48 },
      { date: 'Sep 04', payinVolume: todayPayIn, payoutVolume: todayPayOut, commission: todayCommission, count: scopedTransactions.length },
    ];

    // 6. Top Distributors
    const topDistributors = networkDistributors.map((dist: Distributor) => {
      const distRetailers = hierarchyService.getDistributorRetailers(dist.id);
      return {
        id: dist.id,
        code: dist.code,
        name: dist.name,
        retailersCount: distRetailers.length,
        todayTransactions: dist.code === 'DST001' ? 34 : 14,
        todayVolume: dist.code === 'DST001' ? 124500 : 42000,
        status: dist.status,
      };
    });

    // 7. Requires Attention Items
    const attentionItems = [
      ...(pendingRetailerApprovals > 0
        ? [
            {
              id: 'att_01',
              title: `${pendingRetailerApprovals} Retailer Outlet Awaiting Admin Approval`,
              description: 'Retailer onboarding application submitted. Admin review is pending.',
              severity: 'warning' as const,
              count: pendingRetailerApprovals,
              href: '/master-distributor/retailers',
            },
          ]
        : []),
      ...(failedCount > 0
        ? [
            {
              id: 'att_02',
              title: `${failedCount} Failed Network Transaction`,
              description: 'Transaction failed at provider switch. Callback verified.',
              severity: 'danger' as const,
              count: failedCount,
              href: '/master-distributor/transactions',
            },
          ]
        : []),
      {
        id: 'att_03',
        title: 'Monthly Network Commission Settlement Ready',
        description: 'Previous settlement period closed and reconciled.',
        severity: 'info' as const,
        href: '/master-distributor/commissions',
      },
    ];

    // 8. Recent Network Activity Feed
    const networkActivity = [
      {
        id: 'act_01',
        title: 'Retailer Application Submitted',
        description: 'Capital Express Point (RET002) submitted by North Zone Dist (DST001).',
        timestamp: '10 mins ago',
        type: 'retailer' as const,
      },
      {
        id: 'act_02',
        title: 'Commission Credited',
        description: '₹1,450.00 credited to Master Distributor wallet for today\'s volume.',
        timestamp: '1 hour ago',
        type: 'commission' as const,
      },
      {
        id: 'act_03',
        title: 'Retailer Outlet Approved',
        description: 'Metro Store #01 (RET001) KYC approved by Admin.',
        timestamp: 'Yesterday at 16:30',
        type: 'retailer' as const,
      },
      {
        id: 'act_04',
        title: 'Distributor Onboarded',
        description: 'North Zone Distributor (DST001) network mapping active.',
        timestamp: '3 days ago',
        type: 'distributor' as const,
      },
    ];

    const data: MasterDistributorDashboardSummary = {
      masterDistributor: md,
      totalDistributors,
      totalRetailers,
      activeRetailers,
      pendingRetailerApprovals,
      rejectedRetailers,

      todayTransactionsCount: scopedTransactions.length,
      todayPayInVolume: todayPayIn,
      todayPayOutVolume: todayPayOut,
      failedTransactionsCount: failedCount,

      walletBalance,
      walletHold: 0.00,
      walletId: md?.walletId || 'wlt_md_001',
      walletLastUpdated: new Date().toISOString(),

      todayCommission,
      monthlyCommission,

      trendData,
      topDistributors,
      recentTransactions: scopedTransactions.slice(0, 6),
      attentionItems,
      networkActivity,
    };

    return {
      success: true,
      data,
      timestamp: new Date().toISOString(),
    };
  }
}

export const masterDistributorService = new MasterDistributorService();
