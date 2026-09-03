'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Invoice } from '@/types/domain';
import { formatCurrency } from '@/utils/formatters';
import { FileText } from 'lucide-react';

export interface CreateNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoices: Invoice[];
  onCreateNote: (invoiceId: string, noteType: 'CREDIT_NOTE' | 'DEBIT_NOTE', amount: number, reason: string) => Promise<void>;
}

export const CreateNoteModal: React.FC<CreateNoteModalProps> = ({
  isOpen,
  onClose,
  invoices,
  onCreateNote,
}) => {
  const [selectedInvoiceId, setSelectedInvoiceId] = useState(invoices[0]?.id || 'INV_20260903_001');
  const [noteType, setNoteType] = useState<'CREDIT_NOTE' | 'DEBIT_NOTE'>('CREDIT_NOTE');
  const [adjustmentAmount, setAdjustmentAmount] = useState('2000');
  const [reason, setReason] = useState('Fee reversal for disputed transaction');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedInvoice = invoices.find((i) => i.id === selectedInvoiceId) || invoices[0];

  const parsedAmount = parseFloat(adjustmentAmount) || 0;
  const gstAdjustment = Math.round(parsedAmount * 0.18 * 100) / 100;
  const totalAdjustment = Math.round((parsedAmount + gstAdjustment) * 100) / 100;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (parsedAmount <= 0 || !reason.trim()) return;
    setIsSubmitting(true);
    await onCreateNote(selectedInvoiceId, noteType, parsedAmount, reason);
    setIsSubmitting(false);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create Credit / Debit Note" size="md">
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <Select
          label="Target Original Invoice"
          value={selectedInvoiceId}
          onChange={(e) => setSelectedInvoiceId(e.target.value)}
          options={invoices.map((inv) => ({
            value: inv.id,
            label: `${inv.id} — ${inv.entityName} (${formatCurrency(inv.netReceivable)})`,
          }))}
        />

        <Select
          label="Note Type"
          value={noteType}
          onChange={(e) => setNoteType(e.target.value as 'CREDIT_NOTE' | 'DEBIT_NOTE')}
          options={[
            { value: 'CREDIT_NOTE', label: 'Credit Note (Reduces Invoice Exposure)' },
            { value: 'DEBIT_NOTE', label: 'Debit Note (Increases Invoice Exposure)' },
          ]}
        />

        <Input
          label="Fee Adjustment Amount (₹)"
          type="number"
          placeholder="2000"
          value={adjustmentAmount}
          onChange={(e) => setAdjustmentAmount(e.target.value)}
          required
        />

        <Input
          label="Reason for Adjustment"
          placeholder="e.g. Disputed transaction fee waiver or SLA credit"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          required
        />

        {selectedInvoice && (
          <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg space-y-1 font-mono text-xs">
            <div className="font-bold text-purple-900 font-sans">Adjustment Financial Impact:</div>
            <div className="flex justify-between text-slate-700">
              <span>Fee Adjustment:</span>
              <span>{formatCurrency(parsedAmount)}</span>
            </div>
            <div className="flex justify-between text-purple-700">
              <span>GST Adjustment (@18%):</span>
              <span>+{formatCurrency(gstAdjustment)}</span>
            </div>
            <div className="border-t border-purple-200 pt-1 flex justify-between font-extrabold text-[var(--primary)]">
              <span>Total Adjustment:</span>
              <span>{formatCurrency(totalAdjustment)}</span>
            </div>
            <div className="text-[11px] font-sans text-purple-800 pt-1">
              Updated Invoice Net Balance: <strong>{formatCurrency(
                noteType === 'CREDIT_NOTE'
                  ? Math.max(0, selectedInvoice.netReceivable - totalAdjustment)
                  : selectedInvoice.netReceivable + totalAdjustment
              )}</strong>
            </div>
          </div>
        )}

        <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
          <Button variant="outline" size="sm" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" size="sm" type="submit" isLoading={isSubmitting} leftIcon={<FileText className="w-3.5 h-3.5" />}>
            Issue Note
          </Button>
        </div>
      </form>
    </Modal>
  );
};
