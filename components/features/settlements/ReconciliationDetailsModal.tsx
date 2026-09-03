'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { SettlementReconciliation } from '@/types/domain';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { ShieldCheck, AlertTriangle } from 'lucide-react';

export interface ReconciliationDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  record: SettlementReconciliation | null;
  onResolve?: (reconciliationId: string, action: 'MATCH' | 'MANUAL_REVIEW', remarks?: string) => Promise<void>;
}

export const ReconciliationDetailsModal: React.FC<ReconciliationDetailsModalProps> = ({
  isOpen,
  onClose,
  record,
  onResolve,
}) => {
  const [remarks, setRemarks] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!record) return null;

  const handleResolve = async (action: 'MATCH' | 'MANUAL_REVIEW') => {
    if (!onResolve) return;
    setIsSubmitting(true);
    try {
      await onResolve(record.reconciliationId, action, remarks);
      setRemarks('');
      onClose();
    } catch {
      // Fallback
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Reconciliation Record — ${record.reconciliationId}`}
      description={`Internal vs Clearing Provider Comparison for ${record.settlementId}`}
      size="md"
    >
      <div className="space-y-4 text-xs">
        <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
          <div className="flex justify-between py-1 border-b border-slate-200">
            <span className="text-slate-500">Reconciliation ID:</span>
            <span className="font-mono font-bold text-[var(--primary)]">{record.reconciliationId}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-slate-200">
            <span className="text-slate-500">Target Settlement:</span>
            <span className="font-mono font-bold text-slate-800">{record.settlementId}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-slate-200">
            <span className="text-slate-500">Target Entity:</span>
            <span className="font-semibold">{record.entityName}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-slate-200">
            <span className="text-slate-500">Internal Engine Amount:</span>
            <span className="font-mono font-bold text-slate-900">{formatCurrency(record.internalAmount)}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-slate-200">
            <span className="text-slate-500">Provider Cleared Amount:</span>
            <span className="font-mono font-bold text-slate-900">{formatCurrency(record.providerAmount)}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-slate-200">
            <span className="text-slate-500">Variance / Discrepancy:</span>
            <span className={`font-mono font-extrabold text-sm ${record.difference > 0 ? 'text-rose-700' : 'text-emerald-700'}`}>
              {record.difference > 0 ? `+${formatCurrency(record.difference)}` : '₹0.00 (Perfect Match)'}
            </span>
          </div>
          <div className="flex justify-between py-1 border-b border-slate-200">
            <span className="text-slate-500">Reconciliation Status:</span>
            <StatusBadge status={record.reconciliationStatus} size="sm" />
          </div>
          <div className="flex justify-between py-1">
            <span className="text-slate-500">Bank UTR / Ref:</span>
            <span className="font-mono">{record.utr || record.bankReference || '—'}</span>
          </div>
        </div>

        {record.remarks && (
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-amber-900">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
              <span>Operational Discrepancy Remarks:</span>
            </div>
            <p className="text-amber-800">{record.remarks}</p>
          </div>
        )}

        {record.reconciledBy && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg flex justify-between">
            <span className="text-emerald-900 font-medium">Reconciled By:</span>
            <span className="font-bold text-emerald-950">{record.reconciledBy} ({record.reconciledAt ? formatDate(record.reconciledAt) : '—'})</span>
          </div>
        )}

        {record.reconciliationStatus === 'MISMATCHED' && onResolve && (
          <div className="space-y-3 pt-2 border-t border-slate-200">
            <Input
              label="Manual Reconciliation Review Remarks *"
              placeholder="e.g. Verified fee difference with clearing bank"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              required
            />

            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleResolve('MANUAL_REVIEW')}
                isLoading={isSubmitting}
              >
                Flag for Review
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => handleResolve('MATCH')}
                isLoading={isSubmitting}
                leftIcon={<ShieldCheck className="w-3.5 h-3.5" />}
              >
                Mark as Reconciled
              </Button>
            </div>
          </div>
        )}

        <div className="flex justify-end pt-2 border-t border-slate-200">
          <Button variant="outline" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
};
