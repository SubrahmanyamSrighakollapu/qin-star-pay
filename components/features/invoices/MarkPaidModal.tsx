'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Invoice } from '@/types/domain';
import { formatCurrency } from '@/utils/formatters';
import { CheckCircle2 } from 'lucide-react';

export interface MarkPaidModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoice: Invoice | null;
  onMarkPaid: (invoiceId: string, receivedAmount: number, utr: string, remarks: string) => Promise<void>;
}

export const MarkPaidModal: React.FC<MarkPaidModalProps> = ({
  isOpen,
  onClose,
  invoice,
  onMarkPaid,
}) => {
  const [receivedAmount, setReceivedAmount] = useState(invoice?.outstandingAmount?.toString() || '');
  const [utr, setUtr] = useState('');
  const [remarks, setRemarks] = useState('Payment received via bank transfer.');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!invoice) return null;

  const parsedAmount = parseFloat(receivedAmount) || 0;
  const isPartPayment = parsedAmount < invoice.outstandingAmount;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (parsedAmount <= 0 || !utr.trim()) return;
    setIsSubmitting(true);
    await onMarkPaid(invoice.id, parsedAmount, utr, remarks);
    setIsSubmitting(false);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Record Invoice Payment" size="md">
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
          <div className="font-semibold text-slate-900">Invoice ID: {invoice.id}</div>
          <div className="text-[11px] text-slate-500">Entity: {invoice.entityName}</div>
          <div className="flex justify-between text-[11px] font-mono pt-1">
            <span>Net Receivable: <strong>{formatCurrency(invoice.netReceivable)}</strong></span>
            <span className="text-rose-700 font-bold">Outstanding: {formatCurrency(invoice.outstandingAmount)}</span>
          </div>
        </div>

        <Input
          label="Received Payment Amount (₹)"
          type="number"
          placeholder={invoice.outstandingAmount.toString()}
          value={receivedAmount}
          onChange={(e) => setReceivedAmount(e.target.value)}
          required
        />

        <Input
          label="Bank UTR / Transaction Reference"
          placeholder="e.g. UTR2026090388192"
          value={utr}
          onChange={(e) => setUtr(e.target.value)}
          required
        />

        <Input
          label="Payment Remarks"
          placeholder="e.g. Cleared via ICICI IMPS auto collection"
          value={remarks}
          onChange={(e) => setRemarks(e.target.value)}
        />

        {isPartPayment ? (
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-900 text-xs">
            <span className="font-bold block">Part Payment Notice:</span>
            Received ₹{parsedAmount}. Remaining outstanding: ₹{Math.max(0, invoice.outstandingAmount - parsedAmount)}. Status will become <strong>PARTIALLY_PAID</strong>.
          </div>
        ) : (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-900 text-xs">
            <span className="font-bold block">Full Payment Notice:</span>
            Invoice will be marked as fully <strong>PAID</strong>.
          </div>
        )}

        <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
          <Button variant="outline" size="sm" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" size="sm" type="submit" isLoading={isSubmitting} leftIcon={<CheckCircle2 className="w-3.5 h-3.5" />}>
            Record Payment
          </Button>
        </div>
      </form>
    </Modal>
  );
};
