'use client';

import React, { useState } from 'react';
import { PageContainer } from '@/components/layout/PageContainer';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useModal } from '@/hooks/useModal';
import { CreditDebitFormModal } from '@/components/features/wallet/CreditDebitFormModal';
import { BulkCreditDebitModal } from '@/components/features/wallet/BulkCreditDebitModal';
import { ArrowLeftRight, Upload, ShieldCheck } from 'lucide-react';

export default function CreditDebitPage() {
  const creditDebitModal = useModal();
  const bulkModal = useModal();
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  const handleAdjustmentSuccess = () => {
    setSuccessNotice('Wallet balance adjustment applied and logged to financial audit ledger successfully.');
    setTimeout(() => setSuccessNotice(null), 5000);
  };

  return (
    <PageContainer
      title="Credit / Debit Wallet Adjustments"
      description="Controlled finance administration screen for manual wallet balance credits, debits, and batch adjustments."
      actions={
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => bulkModal.open()}
            leftIcon={<Upload className="w-4 h-4" />}
          >
            Bulk Credit / Debit
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={() => creditDebitModal.open()}
            leftIcon={<ArrowLeftRight className="w-4 h-4" />}
          >
            New Wallet Adjustment
          </Button>
        </div>
      }
      className="space-y-6"
    >
      {successNotice && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center gap-2 text-xs text-emerald-950 font-semibold">
          <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{successNotice}</span>
        </div>
      )}

      {/* Hero Guidance Card */}
      <Card
        title="Finance Control & Governance"
        subtitle="Important guidelines for manual wallet balance adjustments"
      >
        <div className="space-y-4 text-xs">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
              <span className="font-bold text-slate-900 block">1. Strict Permission Gating</span>
              <p className="text-slate-600 text-[11px]">
                Wallet adjustments require `WALLET_CREDIT` or `WALLET_DEBIT` role permissions.
              </p>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
              <span className="font-bold text-slate-900 block">2. Automatic Ledger Entry</span>
              <p className="text-slate-600 text-[11px]">
                Every manual credit or debit automatically creates an immutable financial audit ledger entry.
              </p>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
              <span className="font-bold text-slate-900 block">3. Overdraft Protection</span>
              <p className="text-slate-600 text-[11px]">
                Debit operations validate that requested amount does not exceed current available balance.
              </p>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <Button
              variant="primary"
              size="md"
              onClick={() => creditDebitModal.open()}
              leftIcon={<ArrowLeftRight className="w-4 h-4" />}
            >
              Initiate Wallet Credit / Debit →
            </Button>
          </div>
        </div>
      </Card>

      {/* Credit / Debit Form Modal */}
      <CreditDebitFormModal
        isOpen={creditDebitModal.isOpen}
        onClose={creditDebitModal.close}
        onSuccess={handleAdjustmentSuccess}
      />

      {/* Bulk Credit / Debit Modal */}
      <BulkCreditDebitModal
        isOpen={bulkModal.isOpen}
        onClose={bulkModal.close}
        onSuccess={handleAdjustmentSuccess}
      />
    </PageContainer>
  );
}
