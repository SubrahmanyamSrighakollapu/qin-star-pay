export type TransactionTypeFilter = 'ALL' | 'PAY_IN' | 'PAY_OUT';

export type StatusFilter =
  | 'ALL'
  | 'SUCCESS'
  | 'FAILED'
  | 'PENDING'
  | 'PROCESSING'
  | 'REVERSED'
  | 'REFUNDED';

export interface DashboardFilters {
  dateRange?: string;
  distributorId?: string;
  retailerId?: string;
  merchantId?: string;
  serviceId?: string;
  providerId?: string;
  type?: TransactionTypeFilter;
  status?: StatusFilter;
}

export interface DashboardSummaryMetrics {
  availableBalance: number;
  totalPayIn: number;
  totalPayInTrend: number;
  totalPayOut: number;
  totalPayOutTrend: number;
  pendingSettlement: number;
  successfulTransactions: number;
  failedTransactions: number;
  successRate: number;
  totalTransactions: number;
}

export interface StatusDistributionItem {
  name: string;
  value: number;
  count: number;
  percentage: number;
  color: string;
}

export interface PayInVsPayOutItem {
  name: string;
  amount: number;
  count: number;
  color: string;
}

export interface ChannelStatsItem {
  channel: string;
  count: number;
  amount: number;
}

export interface ProviderStatsItem {
  providerName: string;
  volume: number;
  successRate: number;
  totalAmount: number;
}

export interface TransactionTrendPoint {
  date: string;
  amount: number;
  payinAmount: number;
  payoutAmount: number;
  count: number;
}

export interface ProviderHealthItem {
  id: string;
  providerName: string;
  payInStatus: 'OPERATIONAL' | 'DEGRADED' | 'DOWN';
  payOutStatus: 'OPERATIONAL' | 'DEGRADED' | 'DOWN';
  successRate: number;
  lastChecked: string;
}

export interface BalanceOverview {
  masterBalance: number;
  availableBalance: number;
  holdBalance: number;
  pendingSettlement: number;
}

export interface OperationalAlert {
  id: string;
  title: string;
  message: string;
  type: 'DANGER' | 'WARNING' | 'INFO';
  timestamp: string;
  actionPath?: string;
}

export interface FullDashboardData {
  metrics: DashboardSummaryMetrics;
  statusDistribution: StatusDistributionItem[];
  payInVsPayOut: PayInVsPayOutItem[];
  channelStats: ChannelStatsItem[];
  providerStats: ProviderStatsItem[];
  trendData: TransactionTrendPoint[];
  providerHealth: ProviderHealthItem[];
  balanceOverview: BalanceOverview;
  alerts: OperationalAlert[];
  lastRefreshedAt: string;
}
