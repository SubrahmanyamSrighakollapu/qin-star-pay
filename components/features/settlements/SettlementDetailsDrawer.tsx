'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Drawer } from '@/components/ui/Drawer';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Settlement } from '@/types/domain';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { Copy, Check, ExternalLink, RefreshCw, Layers, Building2, AlertTriangle } from 'lucide-react';

export interface SettlementDetailsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  settlement: Settlement | null;
  onCheckStatus?: (settlement: Settlement) => void;
}

export const SettlementDetailsDrawer: React.FC<SettlementDetailsDrawerProps> = ({
  isOpen,
  onClose,
  settlement,
  onCheckStatus,
}) => {
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'TRANSACTIONS' | 'LEDGER'>('OVERVIEW');
  const [isCopied, setIsCopied] = useState(false);

  if (!settlement) return null;

  const handleCopyId = () => {
    navigator.clipboard.writeText(settlement.settlementId);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={`Settlement Details — ${settlement.settlementId}`}
      size="lg"
      className="p-0 bg-[var(--bg-app)] w-full md:w-[880px]"
    >
      <div className="space-y-6">
        {/* Sticky Identity Header */}
        <div className="sticky top-0 z-20 flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 bg-white/95 backdrop-blur-xs border border-[var(--border)] rounded-[var(--radius-xl)] shadow-xs">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="font-mono font-extrabold text-base md:text-lg text-[var(--primary)]">
                {settlement.settlementId}
              </span>
              <StatusBadge status={settlement.status} size="sm" />
            </div>
            <div className="text-xs text-[var(--text-muted)] mt-0.5">
              Entity: <strong>{settlement.entityName}</strong> ({settlement.entityCode}) | Cycle: <strong>{settlement.settlementCycle}</strong>
            </div>
          </div>

          <div className="flex items-center flex-wrap gap-2 shrink-0">
            <Button variant="outline" size="sm" onClick={handleCopyId} className="whitespace-nowrap">
              {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600 mr-1" /> : <Copy className="w-3.5 h-3.5 mr-1" />}
              {isCopied ? 'Copied' : 'Copy ID'}
            </Button>
            {onCheckStatus && (
              <Button
                variant="primary"
                size="sm"
                onClick={() => onCheckStatus(settlement)}
                leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
                className="whitespace-nowrap"
              >
                Check Latest Status
              </Button>
            )}
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('OVERVIEW')}
            className={`pb-2.5 px-4 border-b-2 transition-colors ${
              activeTab === 'OVERVIEW'
                ? 'border-[var(--primary)] text-[var(--primary)]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Overview & Breakdown
          </button>
          <button
            onClick={() => setActiveTab('TRANSACTIONS')}
            className={`pb-2.5 px-4 border-b-2 transition-colors ${
              activeTab === 'TRANSACTIONS'
                ? 'border-[var(--primary)] text-[var(--primary)]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Included Pay-Ins ({settlement.includedTransactions.length})
          </button>
          <button
            onClick={() => setActiveTab('LEDGER')}
            className={`pb-2.5 px-4 border-b-2 transition-colors ${
              activeTab === 'LEDGER'
                ? 'border-[var(--primary)] text-[var(--primary)]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Ledger & Audit Trail
          </button>
        </div>

        {/* TAB 1: OVERVIEW & BREAKDOWN */}
        {activeTab === 'OVERVIEW' && (
          <div className="space-y-6 text-xs">
            {/* Amount Breakdown Card */}
            <Card title="Configurable Settlement Breakdown" subtitle="Gross to Net financial calculation">
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-2 font-mono">
                <div className="flex justify-between text-slate-700">
                  <span>Gross Transaction Volume ({settlement.includedTransactions.length} txns):</span>
                  <span className="font-bold">{formatCurrency(settlement.grossAmount)}</span>
                </div>
                <div className="flex justify-between text-rose-600">
                  <span>Platform Fee Charges (1.00%):</span>
                  <span>-{formatCurrency(settlement.charges)}</span>
                </div>
                <div className="flex justify-between text-rose-600">
                  <span>GST (18% on fees):</span>
                  <span>-{formatCurrency(settlement.tax)}</span>
                </div>
                <div className="flex justify-between text-rose-600">
                  <span>TDS Withholding (10% on fees):</span>
                  <span>-{formatCurrency(settlement.tds)}</span>
                </div>
                {settlement.holdAmount > 0 && (
                  <div className="flex justify-between text-rose-600">
                    <span>Lien Hold Amount:</span>
                    <span>-{formatCurrency(settlement.holdAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between pt-2 border-t border-slate-300 font-extrabold text-sm text-emerald-800">
                  <span>Net Settlement Amount Payable:</span>
                  <span>{formatCurrency(settlement.netSettlementAmount)}</span>
                </div>
              </div>
            </Card>

            {/* Beneficiary & Provider Bank Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card title="Beneficiary Account Details" subtitle="Destination bank account">
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">Bank Name:</span>
                    <span className="font-semibold text-slate-800 inline-flex items-center gap-1">
                      <Building2 className="w-3.5 h-3.5 text-slate-500" />
                      {settlement.bankName}
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">Account Number:</span>
                    <span className="font-mono font-bold text-slate-900">{settlement.accountNumberMasked}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">IFSC Code:</span>
                    <span className="font-mono font-semibold">{settlement.ifscCode}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-500">Settlement Mode:</span>
                    <span className="font-bold text-[var(--primary)]">{settlement.settlementMode}</span>
                  </div>
                </div>
              </Card>

              <Card title="Provider & Bank Reference" subtitle="Clearance metadata">
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">Clearing Provider:</span>
                    <span className="font-semibold text-slate-800">{settlement.provider}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">Bank UTR:</span>
                    <span className="font-mono font-extrabold text-emerald-700">{settlement.utr || '— Pending UTR —'}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">Bank Reference:</span>
                    <span className="font-mono">{settlement.bankReference || '—'}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-500">Scheduled Clearance:</span>
                    <span className="font-medium">{formatDate(settlement.scheduledAt)}</span>
                  </div>
                </div>
              </Card>
            </div>

            {/* Failure Info Card (if failed) */}
            {settlement.status === 'FAILED' && (
              <div className="p-4 bg-rose-50 border border-rose-200 rounded-lg space-y-1 text-xs">
                <div className="flex items-center gap-2 font-bold text-rose-800">
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                  <span>Settlement Failure Information</span>
                </div>
                <div className="text-rose-700">
                  Code: <strong className="font-mono">{settlement.failureCode || 'BANK_REJECTED'}</strong>
                </div>
                <div className="text-rose-900 font-medium">
                  {settlement.failureReason || 'Clearance rejected by recipient bank node.'}
                </div>
              </div>
            )}

            {/* Lifecycle Timeline */}
            <Card title="Processing Lifecycle Timeline" subtitle="Step-by-step clearance audit">
              <div className="space-y-3">
                {settlement.timeline.map((event, idx) => (
                  <div key={idx} className="flex gap-3 text-xs">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-2.5 h-2.5 rounded-full mt-1 ${
                          event.status === 'COMPLETED'
                            ? 'bg-emerald-500'
                            : event.status === 'FAILED'
                            ? 'bg-rose-500'
                            : 'bg-amber-400'
                        }`}
                      />
                      {idx < settlement.timeline.length - 1 && <div className="w-0.5 h-full bg-slate-200 my-1" />}
                    </div>
                    <div className="flex-1 pb-3">
                      <div className="flex justify-between">
                        <span className="font-bold text-slate-900">{event.event}</span>
                        <span className="text-[11px] font-mono text-slate-400">{formatDate(event.timestamp)}</span>
                      </div>
                      <p className="text-[11px] text-slate-600 mt-0.5">{event.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* TAB 2: INCLUDED TRANSACTIONS */}
        {activeTab === 'TRANSACTIONS' && (
          <div className="space-y-4 text-xs">
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg flex justify-between items-center">
              <span className="text-blue-900 font-medium">
                {settlement.includedTransactions.length} Pay-In Transactions attached to settlement payload
              </span>
              <span className="font-mono font-bold text-blue-950">
                Gross: {formatCurrency(settlement.grossAmount)}
              </span>
            </div>

            <div className="overflow-x-auto border border-slate-200 rounded-lg bg-white">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-semibold text-slate-600">
                    <th className="p-2.5">Transaction ID</th>
                    <th className="p-2.5">Type</th>
                    <th className="p-2.5 text-right">Gross Amount</th>
                    <th className="p-2.5 text-right">Charges</th>
                    <th className="p-2.5 text-right">Net Settlement</th>
                    <th className="p-2.5">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {settlement.includedTransactions.map((tx) => (
                    <tr key={tx.transactionId} className="hover:bg-slate-50/70">
                      <td className="p-2.5 font-mono font-bold text-[var(--primary)]">{tx.transactionId}</td>
                      <td className="p-2.5 font-semibold text-emerald-700">{tx.type}</td>
                      <td className="p-2.5 font-mono text-right">{formatCurrency(tx.grossAmount)}</td>
                      <td className="p-2.5 font-mono text-right text-rose-600">-{formatCurrency(tx.charges)}</td>
                      <td className="p-2.5 font-mono font-bold text-right text-emerald-800">
                        {formatCurrency(tx.netSettlementAmount)}
                      </td>
                      <td className="p-2.5">
                        <Link
                          href={`/transactions/${tx.transactionId}`}
                          className="text-[var(--primary)] font-semibold hover:underline inline-flex items-center gap-1"
                        >
                          <span>View</span>
                          <ExternalLink className="w-3 h-3" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: LEDGER IMPACT */}
        {activeTab === 'LEDGER' && (
          <div className="space-y-4 text-xs">
            <Card title="Ledger Integration Status" subtitle="Financial audit trail link">
              <div className="space-y-3">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
                  <div className="flex justify-between py-1 border-b border-slate-200">
                    <span className="text-slate-500">Target Wallet ID:</span>
                    <span className="font-mono font-bold text-[var(--primary)]">{settlement.walletId}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200">
                    <span className="text-slate-500">Ledger Entry Type:</span>
                    <span className="font-semibold text-purple-700">SETTLEMENT</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200">
                    <span className="text-slate-500">Settlement Reference:</span>
                    <span className="font-mono font-bold">{settlement.settlementId}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-500">Bank UTR Link:</span>
                    <span className="font-mono text-emerald-700 font-bold">{settlement.utr || '— Pending UTR —'}</span>
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <Link href={`/wallet/ledger?searchQuery=${settlement.settlementId}`}>
                    <Button variant="outline" size="sm" leftIcon={<Layers className="w-3.5 h-3.5" />}>
                      View Financial Audit Ledger →
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </Drawer>
  );
};
