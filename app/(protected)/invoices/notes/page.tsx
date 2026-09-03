'use client';

import React, { useState, useEffect } from 'react';
import { PageContainer } from '@/components/layout/PageContainer';
import { Card } from '@/components/ui/Card';
import { Table } from '@/components/ui/Table';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Button } from '@/components/ui/Button';
import { useModal } from '@/hooks/useModal';
import { invoiceService } from '@/services/invoiceService';
import { CreditDebitNote, Invoice } from '@/types/domain';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { CreateNoteModal } from '@/components/features/invoices/CreateNoteModal';
import { NoteDetailsModal } from '@/components/features/invoices/NoteDetailsModal';
import { FileText, ArrowUpRight, ArrowDownLeft, Eye } from 'lucide-react';

export default function CreditDebitNotesPage() {
  const [activeTab, setActiveTab] = useState<'ALL' | 'CREDIT_NOTE' | 'DEBIT_NOTE'>('ALL');
  const [notes, setNotes] = useState<CreditDebitNote[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const createNoteModal = useModal();
  const noteDetailsModal = useModal<CreditDebitNote>();

  const loadData = () => {
    setIsLoading(true);
    invoiceService.getNotes(activeTab).then((res) => {
      if (res.success && res.data) {
        setNotes(res.data);
      }
      setIsLoading(false);
    });

    invoiceService.getInvoices({}, 1, 100).then((res) => {
      if (res.success && res.data) {
        setInvoices(res.data.items);
      }
    });
  };

  useEffect(() => {
    let isCancelled = false;
    invoiceService.getNotes(activeTab).then((res) => {
      if (!isCancelled && res.success && res.data) {
        setNotes(res.data);
        setIsLoading(false);
      }
    });
    invoiceService.getInvoices({}, 1, 100).then((res) => {
      if (!isCancelled && res.success && res.data) {
        setInvoices(res.data.items);
      }
    });
    return () => {
      isCancelled = true;
    };
  }, [activeTab]);

  const handleCreateNote = async (
    invoiceId: string,
    noteType: 'CREDIT_NOTE' | 'DEBIT_NOTE',
    amount: number,
    reason: string
  ) => {
    await invoiceService.createNote(invoiceId, noteType, amount, reason);
    loadData();
  };

  const totalNotes = notes.length;
  const creditNotesCount = notes.filter((n) => n.noteType === 'CREDIT_NOTE').length;
  const debitNotesCount = notes.filter((n) => n.noteType === 'DEBIT_NOTE').length;

  const totalCreditAdjustment = notes
    .filter((n) => n.noteType === 'CREDIT_NOTE')
    .reduce((acc, n) => acc + n.totalAdjustment, 0);

  const totalDebitAdjustment = notes
    .filter((n) => n.noteType === 'DEBIT_NOTE')
    .reduce((acc, n) => acc + n.totalAdjustment, 0);

  const netAdjustment = totalDebitAdjustment - totalCreditAdjustment;

  const columns = [
    {
      key: 'noteId',
      header: 'Note ID / Invoice',
      render: (row: CreditDebitNote) => (
        <div>
          <span className="font-mono font-bold text-[var(--primary)] text-xs block">{row.noteId}</span>
          <span className="font-mono text-[11px] text-slate-500">Target: {row.invoiceId}</span>
        </div>
      ),
    },
    {
      key: 'entityName',
      header: 'Entity Name',
      render: (row: CreditDebitNote) => (
        <div>
          <div className="font-semibold text-xs text-slate-900">{row.entityName}</div>
          <div className="text-[11px] font-semibold text-purple-700">{row.entityType} • {row.entityCode}</div>
        </div>
      ),
    },
    {
      key: 'noteType',
      header: 'Note Type',
      align: 'center' as const,
      render: (row: CreditDebitNote) => (
        <span
          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-bold ${
            row.noteType === 'CREDIT_NOTE'
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              : 'bg-rose-50 text-rose-700 border border-rose-200'
          }`}
        >
          {row.noteType === 'CREDIT_NOTE' ? <ArrowDownLeft className="w-3 h-3" /> : <ArrowUpRight className="w-3 h-3" />}
          {row.noteType === 'CREDIT_NOTE' ? 'Credit Note' : 'Debit Note'}
        </span>
      ),
    },
    {
      key: 'adjustmentAmount',
      header: 'Fee Adjustment',
      align: 'right' as const,
      render: (row: CreditDebitNote) => (
        <span className="font-mono text-xs text-slate-700">{formatCurrency(row.adjustmentAmount)}</span>
      ),
    },
    {
      key: 'gstAdjustment',
      header: 'GST Adjust (@18%)',
      align: 'right' as const,
      render: (row: CreditDebitNote) => (
        <span className="font-mono text-xs text-purple-700 font-semibold">{formatCurrency(row.gstAdjustment)}</span>
      ),
    },
    {
      key: 'totalAdjustment',
      header: 'Total Net Adjust',
      align: 'right' as const,
      render: (row: CreditDebitNote) => (
        <span
          className={`font-mono font-extrabold text-xs ${
            row.noteType === 'CREDIT_NOTE' ? 'text-emerald-700' : 'text-rose-700'
          }`}
        >
          {row.noteType === 'CREDIT_NOTE' ? '-' : '+'}{formatCurrency(row.totalAdjustment)}
        </span>
      ),
    },
    {
      key: 'reason',
      header: 'Adjustment Reason',
      render: (row: CreditDebitNote) => (
        <span className="text-xs text-slate-700 font-medium line-clamp-1">{row.reason}</span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      align: 'center' as const,
      render: (row: CreditDebitNote) => <StatusBadge status={row.status} size="sm" />,
    },
    {
      key: 'createdAt',
      header: 'Issued Date',
      render: (row: CreditDebitNote) => (
        <span className="text-xs text-slate-500 font-mono whitespace-nowrap">{formatDate(row.createdAt)}</span>
      ),
    },
  ];

  return (
    <PageContainer
      title="Credit / Debit Notes"
      description="Manage financial adjustments, fee reversals, and tax corrections against previously issued invoices."
      actions={
        <Button variant="primary" size="sm" onClick={createNoteModal.open} leftIcon={<FileText className="w-3.5 h-3.5" />}>
          Create Note
        </Button>
      }
    >
      <div className="space-y-6">
        {/* Summary Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-4 bg-white border border-slate-200">
            <span className="text-xs font-semibold text-slate-500">Total Adjustment Notes</span>
            <div className="mt-1 font-mono font-extrabold text-base text-[var(--primary)]">{totalNotes} Notes</div>
            <span className="text-[11px] text-slate-400 block mt-0.5">Applied to billing history</span>
          </Card>

          <Card className="p-4 bg-white border border-slate-200">
            <span className="text-xs font-semibold text-slate-500">Credit Notes (-)</span>
            <div className="mt-1 font-mono font-extrabold text-base text-emerald-700">{formatCurrency(totalCreditAdjustment)}</div>
            <span className="text-[11px] text-emerald-600 block mt-0.5">{creditNotesCount} Reversal Notes</span>
          </Card>

          <Card className="p-4 bg-white border border-slate-200">
            <span className="text-xs font-semibold text-slate-500">Debit Notes (+)</span>
            <div className="mt-1 font-mono font-extrabold text-base text-rose-700">{formatCurrency(totalDebitAdjustment)}</div>
            <span className="text-[11px] text-rose-600 block mt-0.5">{debitNotesCount} Additional Charge Notes</span>
          </Card>

          <Card className="p-4 bg-white border border-slate-200">
            <span className="text-xs font-semibold text-slate-500">Net Invoice Exposure Shift</span>
            <div className={`mt-1 font-mono font-extrabold text-base ${netAdjustment >= 0 ? 'text-rose-800' : 'text-emerald-800'}`}>
              {netAdjustment >= 0 ? '+' : ''}{formatCurrency(netAdjustment)}
            </div>
            <span className="text-[11px] text-slate-500 block mt-0.5">Net audit shift</span>
          </Card>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-200 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('ALL')}
            className={`pb-3 px-4 border-b-2 transition-colors ${
              activeTab === 'ALL'
                ? 'border-[var(--primary)] text-[var(--primary)] font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            All Notes ({totalNotes})
          </button>
          <button
            onClick={() => setActiveTab('CREDIT_NOTE')}
            className={`pb-3 px-4 border-b-2 transition-colors ${
              activeTab === 'CREDIT_NOTE'
                ? 'border-[var(--primary)] text-[var(--primary)] font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Credit Notes ({creditNotesCount})
          </button>
          <button
            onClick={() => setActiveTab('DEBIT_NOTE')}
            className={`pb-3 px-4 border-b-2 transition-colors ${
              activeTab === 'DEBIT_NOTE'
                ? 'border-[var(--primary)] text-[var(--primary)] font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Debit Notes ({debitNotesCount})
          </button>
        </div>

        {/* Data Table with Actions Column */}
        <div className="overflow-x-auto border border-[var(--border)] rounded-[var(--radius-xl)] bg-white shadow-xs">
          <Table
            columns={columns}
            data={notes}
            keyExtractor={(row) => row.noteId}
            isLoading={isLoading}
            renderActions={(row) => (
              <Button variant="outline" size="sm" onClick={() => noteDetailsModal.open(row)} leftIcon={<Eye className="w-3.5 h-3.5" />}>
                View Note
              </Button>
            )}
          />
        </div>

        {/* Modals */}
        <CreateNoteModal
          isOpen={createNoteModal.isOpen}
          onClose={createNoteModal.close}
          invoices={invoices}
          onCreateNote={handleCreateNote}
        />

        <NoteDetailsModal
          isOpen={noteDetailsModal.isOpen}
          onClose={noteDetailsModal.close}
          note={noteDetailsModal.data}
          targetInvoice={invoices.find((i) => i.id === noteDetailsModal.data?.invoiceId)}
        />
      </div>
    </PageContainer>
  );
}
