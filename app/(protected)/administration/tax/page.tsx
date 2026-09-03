'use client';

import React, { useState, useEffect } from 'react';
import { PageContainer } from '@/components/layout/PageContainer';
import { adminService } from '@/services/adminService';
import { TaxConfigurationItem } from '@/types/domain';
import { TaxConfigTable } from '@/components/features/administration/TaxConfigTable';

export default function TaxPage() {
  const [taxItems, setTaxItems] = useState<TaxConfigurationItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isCancelled = false;
    adminService.getTaxConfigurations().then((res) => {
      if (!isCancelled && res.success && res.data) {
        setTaxItems(res.data);
        setIsLoading(false);
      }
    });
    return () => {
      isCancelled = true;
    };
  }, []);

  return (
    <PageContainer
      title="Tax Configuration"
      description="Configure GST rate parameters, TDS withholding percentages under Section 194O, and effective versioning dates."
    >
      <div className="space-y-6">
        <TaxConfigTable data={taxItems} isLoading={isLoading} />
      </div>
    </PageContainer>
  );
}
