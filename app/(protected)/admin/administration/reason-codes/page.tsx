'use client';

import React, { useState, useEffect } from 'react';
import { PageContainer } from '@/components/layout/PageContainer';
import { adminService } from '@/services/adminService';
import { ReasonCode } from '@/types/domain';
import { ReasonCodeTable } from '@/components/features/administration/ReasonCodeTable';

export default function ReasonCodesPage() {
  const [reasonCodes, setReasonCodes] = useState<ReasonCode[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isCancelled = false;
    adminService.getReasonCodes().then((res) => {
      if (!isCancelled && res.success && res.data) {
        setReasonCodes(res.data);
        setIsLoading(false);
      }
    });
    return () => {
      isCancelled = true;
    };
  }, []);

  return (
    <PageContainer
      title="Reason Code Master"
      description="Centralized operational reason codes for KYC rejections, wallet adjustments, settlement exceptions, and dispute resolutions."
    >
      <div className="space-y-6">
        <ReasonCodeTable data={reasonCodes} isLoading={isLoading} />
      </div>
    </PageContainer>
  );
}
