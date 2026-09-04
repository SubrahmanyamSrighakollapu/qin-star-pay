'use client';

import React, { useSyncExternalStore } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  Legend,
  ComposedChart,
  Line,
  CartesianGrid,
} from 'recharts';
import { Card } from '@/components/ui/Card';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';
import { formatCurrency, formatNumber } from '@/utils/formatters';

export interface TrendPoint {
  date: string;
  payinVolume: number;
  payoutVolume: number;
  commission: number;
  count: number;
}

export interface MasterDistributorChartsProps {
  trendData: TrendPoint[];
  isLoading?: boolean;
}

const emptySubscribe = () => () => {};

export const MasterDistributorCharts: React.FC<MasterDistributorChartsProps> = ({
  trendData,
  isLoading = false,
}) => {
  const isMounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  if (isLoading || !isMounted) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LoadingSkeleton variant="card" count={2} />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Chart 1: 7-Day Pay-In vs Pay-Out Volume Trend */}
      <Card title="7-Day Network Volume Trend" subtitle="Daily Pay-In vs Pay-Out processed volume (₹)">
        <div className="h-[260px] w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={trendData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="date" tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
              <YAxis tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} tickFormatter={(val) => `₹${val / 1000}k`} />
              <RechartsTooltip
                formatter={(val: unknown) => [formatCurrency(Number(val || 0)), '']}
                contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }}
              />
              <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: '12px' }} />
              <Bar dataKey="payinVolume" name="Pay-In Volume" fill="#10b981" radius={[4, 4, 0, 0]} barSize={16} />
              <Bar dataKey="payoutVolume" name="Pay-Out Volume" fill="#2563eb" radius={[4, 4, 0, 0]} barSize={16} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Chart 2: Commission & Transaction Count Trend */}
      <Card title="Commission & Transaction Trend" subtitle="Master Distributor daily earnings and network count">
        <div className="h-[260px] w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={trendData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="date" tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
              <YAxis yAxisId="left" tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} tickFormatter={(val) => `₹${val}`} />
              <YAxis yAxisId="right" orientation="right" tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
              <RechartsTooltip
                formatter={(val: unknown, name: unknown) => [
                  name === 'Master Commission' ? formatCurrency(Number(val || 0)) : formatNumber(Number(val || 0)),
                  name === 'Master Commission' ? 'Earning' : 'Txn Count',
                ]}
                contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }}
              />
              <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: '12px' }} />
              <Bar yAxisId="left" dataKey="commission" name="Master Commission" fill="#9333ea" radius={[4, 4, 0, 0]} barSize={18} />
              <Line yAxisId="right" type="monotone" dataKey="count" name="Transaction Count" stroke="#f59e0b" strokeWidth={2.5} dot={{ r: 4 }} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
};
