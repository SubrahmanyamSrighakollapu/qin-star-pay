'use client';

import React from 'react';
import Link from 'next/link';
import { Modal } from '@/components/ui/Modal';
import { Card } from '@/components/ui/Card';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Button } from '@/components/ui/Button';
import { CreditDebitNote, Invoice } from '@/types/domain';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { ExternalLink, ArrowDownLeft, ArrowUpRight } from 'lucide-react';

export interface NoteDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  note: CreditDebitNote | null;
  targetInvoice?: Invoice | null;
}

export const NoteDetailsModal: React.FC<NoteDetailsModalProps> = ({
  isOpen,
  onClose,
  note,
  targetInvoice,
}) => {
  if (!note) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Credit / Debit Note Details" size="lg">
      <div className="space-y-4 text-xs">
        <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-lg">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono font-extrabold text-sm text-[var(--primary)]">{note.noteId}</span>
              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold ${
                  note.noteType === 'CREDIT_NOTE'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-rose-50 text-rose-700 border border-rose-200'
                }`}
              >
                {note.noteType === 'CREDIT_NOTE' ? <ArrowDownLeft className="w-3 h-3" /> : <ArrowUpRight className="w-3 h-3" />}
                {note.noteType === 'CREDIT_NOTE' ? 'Credit Note' : 'Debit Note'}
              </span>
            </div>
            <span className="text-slate-500 block mt-0.5">Target Invoice: <strong>{note.invoiceId}</strong></span>
          </div>
          <StatusBadge status={note.status} size="sm" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Card title="Target Entity" subtitle="Billed business details">
            <div className="space-y-1 text-slate-700">
              <div className="font-bold text-slate-900">{note.entityName}</div>
              <div className="text-[11px] font-semibold text-purple-700">{note.entityType} • {note.entityCode}</div>
              <div>Created By: <strong className="text-slate-900">{note.createdBy}</strong></div>
              <div>Issued Date: <span className="font-mono text-slate-700">{formatDate(note.createdAt)}</span></div>
            </div>
          </Card>

          <Card title="Adjustment Breakdown" subtitle="Financial impact math">
            <div className="space-y-1 font-mono text-slate-700">
              {targetInvoice && (
                <div className="flex justify-between text-slate-500 text-[11px]">
                  <span>Original Net Receivable:</span>
                  <span>{formatCurrency(targetInvoice.netReceivable)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Fee Adjustment:</span>
                <span>{formatCurrency(note.adjustmentAmount)}</span>
              </div>
              <div className="flex justify-between text-purple-700">
                <span>GST Adjustment (@18%):</span>
                <span>+{formatCurrency(note.gstAdjustment)}</span>
              </div>
              <div className="border-t border-slate-200 pt-1 flex justify-between font-extrabold text-[var(--primary)]">
                <span>Total Net Adjustment:</span>
                <span className={note.noteType === 'CREDIT_NOTE' ? 'text-emerald-700' : 'text-rose-700'}>
                  {note.noteType === 'CREDIT_NOTE' ? '-' : '+'}{formatCurrency(note.totalAdjustment)}
                </span>
              </div>
            </div>
          </Card>
        </div>

        <Card title="Adjustment Rationale & Audit" subtitle="Operational reason">
          <div className="space-y-2 text-slate-700">
            <div>
              <span className="font-semibold block text-slate-900">Reason:</span>
              <p className="p-2 bg-slate-50 border border-slate-200 rounded text-slate-800">{note.reason}</p>
            </div>
            {note.remarks && (
              <div>
                <span className="font-semibold block text-slate-900">Remarks:</span>
                <p className="text-slate-600 italic">{note.remarks}</p>
              </div>
            )}
          </div>
        </Card>

        <Card title="Linked References" subtitle="Navigable original invoice link">
          <div className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
            <span className="text-slate-700">Target Invoice ID: <strong className="font-mono">{note.invoiceId}</strong></span>
            <Link href="/invoices">
              <span className="text-xs text-blue-600 flex items-center gap-1 font-semibold hover:underline">
                <span>View Invoice Details</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </span>
            </Link>
          </div>
        </Card>

        <div className="flex justify-end pt-2 border-t border-slate-100">
          <Button variant="outline" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
};
