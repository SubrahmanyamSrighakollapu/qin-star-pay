'use client';

import React, { useState, useEffect } from 'react';
import { PageContainer } from '@/components/layout/PageContainer';
import { adminService } from '@/services/adminService';
import { FeeRule } from '@/types/domain';
import { FeeRuleTable } from '@/components/features/administration/FeeRuleTable';
import { FeeCalculatorCard } from '@/components/features/administration/FeeCalculatorCard';

export default function FeesPage() {
  const [feeRules, setFeeRules] = useState<FeeRule[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isCancelled = false;
    adminService.getFeeRules().then((res) => {
      if (!isCancelled && res.success && res.data) {
        setFeeRules(res.data);
        setIsLoading(false);
      }
    });
    return () => {
      isCancelled = true;
    };
  }, []);

  return (
    <PageContainer
      title="Fee & Charge Master"
      description="Manage platform commercial fee structures, disburse service charges, percentage and flat rate rules, and GST applicability."
    >
      <div className="space-y-6">
        {/* Interactive Calculation Simulator */}
        <FeeCalculatorCard feeRules={feeRules} />

        {/* Master Rules Table */}
        <FeeRuleTable data={feeRules} isLoading={isLoading} />
      </div>
    </PageContainer>
  );
}
