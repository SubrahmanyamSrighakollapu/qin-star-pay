'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import {
  NotificationFilters,
  NotificationCategory,
  NotificationSeverity,
  NotificationStatus,
  ReportDateRange,
} from '@/types/domain';
import { ReportDateRangePicker } from '@/components/features/reports/ReportDateRangePicker';
import { Search, Filter, RotateCcw } from 'lucide-react';

export interface NotificationFilterBarProps {
  onFilterChange: (filters: NotificationFilters) => void;
  onReset: () => void;
  isLoading?: boolean;
}

export const NotificationFilterBar: React.FC<NotificationFilterBarProps> = ({
  onFilterChange,
  onReset,
  isLoading = false,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState<'ALL' | NotificationCategory>('ALL');
  const [severity, setSeverity] = useState<'ALL' | NotificationSeverity>('ALL');
  const [status, setStatus] = useState<'ALL' | NotificationStatus>('ALL');
  const [dateRange, setDateRange] = useState<ReportDateRange>({ preset: 'THIS_MONTH' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFilterChange({ searchQuery, category, severity, status, dateRange });
  };

  const handleReset = () => {
    setSearchQuery('');
    setCategory('ALL');
    setSeverity('ALL');
    setStatus('ALL');
    setDateRange({ preset: 'THIS_MONTH' });
    onReset();
  };

  return (
    <Card className="p-4 bg-white border border-slate-200 space-y-4 text-xs">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <Input
            label="Search Notification"
            placeholder="ID, Title, Message, Entity, Reference..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftIcon={<Search className="w-4 h-4 text-slate-400" />}
          />

          <Select
            label="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value as 'ALL' | NotificationCategory)}
            options={[
              { value: 'ALL', label: 'All Categories' },
              { value: 'TRANSACTION', label: 'Transactions' },
              { value: 'KYC', label: 'KYC' },
              { value: 'WALLET', label: 'Wallet' },
              { value: 'SETTLEMENT', label: 'Settlements' },
              { value: 'RECONCILIATION', label: 'Reconciliation' },
              { value: 'CHARGEBACK', label: 'Chargebacks' },
              { value: 'INVOICE', label: 'Invoices' },
              { value: 'TAX', label: 'Tax' },
              { value: 'PROVIDER', label: 'Provider / Integrations' },
              { value: 'SECURITY', label: 'Security' },
              { value: 'SYSTEM', label: 'System' },
            ]}
          />

          <Select
            label="Severity Level"
            value={severity}
            onChange={(e) => setSeverity(e.target.value as 'ALL' | NotificationSeverity)}
            options={[
              { value: 'ALL', label: 'All Severities' },
              { value: 'CRITICAL', label: 'Critical' },
              { value: 'WARNING', label: 'Warning' },
              { value: 'SUCCESS', label: 'Success' },
              { value: 'INFO', label: 'Info' },
            ]}
          />

          <Select
            label="Read Status"
            value={status}
            onChange={(e) => setStatus(e.target.value as 'ALL' | NotificationStatus)}
            options={[
              { value: 'ALL', label: 'All Statuses' },
              { value: 'UNREAD', label: 'Unread' },
              { value: 'READ', label: 'Read' },
            ]}
          />
        </div>

        <ReportDateRangePicker value={dateRange} onChange={(d) => setDateRange(d)} />

        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
          <span className="text-[11px] text-slate-500">Filter operational alerts across payment system modules.</span>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" type="button" onClick={handleReset} leftIcon={<RotateCcw className="w-3.5 h-3.5" />}>
              Reset
            </Button>
            <Button variant="primary" size="sm" type="submit" isLoading={isLoading} leftIcon={<Filter className="w-3.5 h-3.5" />}>
              Apply Filters
            </Button>
          </div>
        </div>
      </form>
    </Card>
  );
};
