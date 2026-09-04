'use client';

import React, { useState, useEffect } from 'react';
import { PageContainer } from '@/components/layout/PageContainer';
import { Table } from '@/components/ui/Table';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { adminService } from '@/services/adminService';
import { PaymentMasterItem } from '@/types/domain';

export default function MasterConfigPage() {
  const [items, setItems] = useState<PaymentMasterItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isCancelled = false;
    adminService.getPaymentMasters().then((res) => {
      if (!isCancelled && res.success && res.data) {
        setItems(res.data);
        setIsLoading(false);
      }
    });
    return () => {
      isCancelled = true;
    };
  }, []);

  const columns = [
    {
      key: 'code',
      header: 'Code / Name',
      render: (row: PaymentMasterItem) => (
        <div>
          <span className="font-mono font-bold text-[var(--primary)] text-xs block">{row.code}</span>
          <span className="font-semibold text-xs text-slate-900">{row.name}</span>
        </div>
      ),
    },
    {
      key: 'category',
      header: 'Category',
      render: (row: PaymentMasterItem) => (
        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-50 text-blue-900 border border-blue-200">
          {row.category}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      align: 'center' as const,
      render: (row: PaymentMasterItem) => <StatusBadge status={row.status} size="sm" />,
    },
  ];

  return (
    <PageContainer
      title="Payment Masters & System Constants"
      description="Centralized master configurations for payment modes, transaction types, settlement modes, and provider types."
    >
      <div className="space-y-6">
        <div className="overflow-x-auto border border-[var(--border)] rounded-[var(--radius-xl)] bg-white shadow-xs">
          <Table
            columns={columns}
            data={items}
            keyExtractor={(row) => row.id}
            isLoading={isLoading}
          />
        </div>
      </div>
    </PageContainer>
  );
}
