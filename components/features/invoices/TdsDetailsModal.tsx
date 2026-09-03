'use client';

import React from 'react';
import Link from 'next/link';
import { Modal } from '@/components/ui/Modal';
import { Card } from '@/components/ui/Card';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Button } from '@/components/ui/Button';
import { TdsRecord } from '@/types/domain';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { Download, ExternalLink, ShieldCheck } from 'lucide-react';

export interface TdsDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  record: TdsRecord | null;
}

export const TdsDetailsModal: React.FC<TdsDetailsModalProps> = ({
  isOpen,
  onClose,
  record,
}) => {
  if (!record) return null;

  const handleDownloadCertificate = () => {
    const win = window.open('', '_blank');
    if (!win) return;
    win.document.write(`
      <html>
        <head>
          <title>Form 16A Certificate - ${record.certificateRef || record.tdsId}</title>
          <style>
            body { font-family: sans-serif; padding: 30px; font-size: 13px; color: #1e293b; }
            .header { border-b: 2px solid #0f172a; padding-bottom: 15px; margin-bottom: 20px; }
            .title { font-size: 20px; font-weight: bold; color: #0f172a; }
            .section { margin-top: 15px; }
            .table { width: 100%; border-collapse: collapse; margin-top: 15px; }
            .table th, .table td { border: 1px solid #cbd5e1; padding: 8px 12px; text-align: left; }
            .table th { background: #f8fafc; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="title">INCOME TAX DEPARTMENT — FORM 16A</div>
            <div>Certificate of Tax Deducted at Source under Section 194J</div>
            <div>Certificate Ref: ${record.certificateRef || 'TDS-CERT-2026-AUTO'}</div>
          </div>
          <div class="section">
            <strong>Deductee Name:</strong> ${record.entityName}<br/>
            <strong>PAN:</strong> ${record.panMasked}<br/>
            <strong>Invoice Reference:</strong> ${record.invoiceId}<br/>
            <strong>Deduction Date:</strong> ${new Date(record.deductionDate).toLocaleDateString()}
          </div>
          <table class="table">
            <thead>
              <tr><th>Taxable Amount (INR)</th><th>TDS Rate</th><th>TDS Amount Deducted (INR)</th><th>Deposit Status</th></tr>
            </thead>
            <tbody>
              <tr>
                <td>₹${record.taxableAmount.toFixed(2)}</td>
                <td>${record.tdsRate}%</td>
                <td>₹${record.tdsAmount.toFixed(2)}</td>
                <td>${record.status}</td>
              </tr>
            </tbody>
          </table>
          <script>window.print();</script>
        </body>
      </html>
    `);
    win.document.close();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="TDS Deduction Operational View" size="lg">
      <div className="space-y-4 text-xs">
        <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-lg">
          <div>
            <span className="font-mono font-extrabold text-sm text-[var(--primary)] block">{record.tdsId}</span>
            <span className="text-slate-500">Target Invoice: <strong>{record.invoiceId}</strong></span>
          </div>
          <StatusBadge status={record.status} size="sm" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Card title="Deductee Entity & PAN" subtitle="Tax identification info">
            <div className="space-y-1 text-slate-700">
              <div className="font-bold text-slate-900">{record.entityName}</div>
              <div className="text-[11px] font-semibold text-purple-700">{record.entityType}</div>
              <div>Masked PAN: <strong className="font-mono text-slate-900">{record.panMasked}</strong></div>
            </div>
          </Card>

          <Card title="TDS Financial Breakdown" subtitle="Calculated tax credit at source">
            <div className="space-y-1 font-mono text-slate-700">
              <div className="flex justify-between">
                <span>Taxable Amount:</span>
                <span className="font-bold">{formatCurrency(record.taxableAmount)}</span>
              </div>
              <div className="flex justify-between text-amber-700">
                <span>TDS Rate:</span>
                <span className="font-bold">{record.tdsRate}%</span>
              </div>
              <div className="border-t border-slate-200 pt-1 flex justify-between font-extrabold text-amber-800">
                <span>TDS Amount Deducted:</span>
                <span>{formatCurrency(record.tdsAmount)}</span>
              </div>
            </div>
          </Card>
        </div>

        <Card title="Filing & Certificate Status" subtitle="Form 16A details">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-slate-600">Deduction Date:</span>
              <span className="font-mono font-semibold text-slate-900">{formatDate(record.deductionDate)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-600">Certificate Reference:</span>
              <span className="font-mono font-bold text-slate-900">{record.certificateRef || 'Pending Filing'}</span>
            </div>

            {record.status === 'CERTIFICATE_AVAILABLE' && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center justify-between">
                <div className="flex items-center gap-2 text-emerald-900">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span className="font-semibold text-xs">Form 16A Verified & Available</span>
                </div>
                <Button variant="outline" size="sm" onClick={handleDownloadCertificate} leftIcon={<Download className="w-3.5 h-3.5" />}>
                  Download Form 16A
                </Button>
              </div>
            )}
          </div>
        </Card>

        <Card title="Financial References" subtitle="Linked transaction & invoice links">
          <div className="flex items-center justify-between p-2 bg-slate-50 border border-slate-200 rounded-lg">
            <span className="text-slate-700">Linked Invoice: <strong>{record.invoiceId}</strong></span>
            <Link href="/invoices">
              <span className="text-xs text-blue-600 flex items-center gap-1 font-semibold hover:underline">
                <span>View Invoice</span>
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
