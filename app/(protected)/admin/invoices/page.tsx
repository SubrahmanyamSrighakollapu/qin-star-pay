'use client';

import React, { useState, useEffect } from 'react';
import { PageContainer } from '@/components/layout/PageContainer';
import { Button } from '@/components/ui/Button';
import { Pagination } from '@/components/ui/Pagination';
import { useModal } from '@/hooks/useModal';
import { invoiceService, InvoiceListResult } from '@/services/invoiceService';
import { Invoice, InvoiceFilters, InvoiceType, EntityType, PaginationState } from '@/types/domain';
import { InvoiceSummaryCards } from '@/components/features/invoices/InvoiceSummaryCards';
import { InvoiceFilterBar } from '@/components/features/invoices/InvoiceFilterBar';
import { InvoiceTable } from '@/components/features/invoices/InvoiceTable';
import { InvoiceDetailsDrawer } from '@/components/features/invoices/InvoiceDetailsDrawer';
import { GenerateInvoiceModal } from '@/components/features/invoices/GenerateInvoiceModal';
import { MarkPaidModal } from '@/components/features/invoices/MarkPaidModal';
import { FilePlus } from 'lucide-react';

export default function InvoicesPage() {
  const [activeTab, setActiveTab] = useState<'ALL' | 'OUTSTANDING' | 'PAID' | 'OVERDUE' | 'DRAFTS'>('ALL');
  const [filters, setFilters] = useState<InvoiceFilters>({});
  const [data, setData] = useState<InvoiceListResult | null>(null);
  const [pagination, setPagination] = useState<PaginationState>({ page: 1, pageSize: 10, totalItems: 0, totalPages: 1 });
  const [isLoading, setIsLoading] = useState(true);

  // Modals & Drawers
  const detailsDrawer = useModal<Invoice>();
  const generateModal = useModal();
  const markPaidModal = useModal<Invoice>();

  const loadInvoices = () => {
    setIsLoading(true);

    const activeFilters: InvoiceFilters = { ...filters };
    if (activeTab === 'OUTSTANDING') {
      activeFilters.status = 'ISSUED';
    } else if (activeTab === 'PAID') {
      activeFilters.status = 'PAID';
    } else if (activeTab === 'OVERDUE') {
      activeFilters.status = 'OVERDUE';
    } else if (activeTab === 'DRAFTS') {
      activeFilters.status = 'DRAFT';
    }

    invoiceService.getInvoices(activeFilters, pagination.page, pagination.pageSize).then((res) => {
      if (res.success && res.data) {
        setData(res.data);
        setPagination(res.data.pagination);
      }
      setIsLoading(false);
    });
  };

  useEffect(() => {
    let isCancelled = false;
    const activeFilters: InvoiceFilters = { ...filters };
    if (activeTab === 'OUTSTANDING') {
      activeFilters.status = 'ISSUED';
    } else if (activeTab === 'PAID') {
      activeFilters.status = 'PAID';
    } else if (activeTab === 'OVERDUE') {
      activeFilters.status = 'OVERDUE';
    } else if (activeTab === 'DRAFTS') {
      activeFilters.status = 'DRAFT';
    }

    invoiceService.getInvoices(activeFilters, pagination.page, pagination.pageSize).then((res) => {
      if (!isCancelled && res.success && res.data) {
        setData(res.data);
        setPagination(res.data.pagination);
        setIsLoading(false);
      }
    });
    return () => {
      isCancelled = true;
    };
  }, [activeTab, filters, pagination.page, pagination.pageSize]);

  const handleGenerateInvoice = async (
    entityId: string,
    entityName: string,
    entityCode: string,
    entityType: EntityType,
    invoiceType: InvoiceType,
    taxableAmount: number,
    gstRate: number,
    tdsApplicable: boolean,
    tdsRate: number,
    billingPeriod: string,
    description: string
  ) => {
    await invoiceService.generateInvoice(
      entityId,
      entityName,
      entityCode,
      entityType,
      invoiceType,
      { taxableAmount, gstRate, tdsApplicable, tdsRate },
      billingPeriod,
      description
    );
    loadInvoices();
  };

  const handleMarkPaid = async (
    invoiceId: string,
    receivedAmount: number,
    utr: string,
    remarks: string
  ) => {
    await invoiceService.markInvoicePaid(invoiceId, receivedAmount, utr, remarks);
    loadInvoices();
    if (detailsDrawer.data && detailsDrawer.data.id === invoiceId) {
      const updated = await invoiceService.getInvoiceById(invoiceId);
      if (updated.data) detailsDrawer.open(updated.data);
    }
  };

  const handleDownloadInvoice = (inv: Invoice) => {
    const win = window.open('', '_blank');
    if (!win) return;
    win.document.write(`
      <html>
        <head>
          <title>Invoice - ${inv.id}</title>
          <style>
            body { font-family: sans-serif; padding: 30px; font-size: 13px; color: #1e293b; }
            .header { display: flex; justify-content: space-between; border-b: 2px solid #0f172a; pb: 15px; margin-bottom: 20px; }
            .title { font-size: 24px; font-weight: bold; color: #0f172a; }
            .table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            .table th, .table td { border: 1px solid #cbd5e1; padding: 8px 12px; text-align: left; }
            .table th { background: #f8fafc; }
            .text-right { text-align: right; }
            .summary { margin-top: 20px; text-align: right; font-family: monospace; }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <div class="title">QIN STAR PAY</div>
              <div>Platform Operations Engine</div>
              <div>GSTIN: 36QSPAY9981P1Z0</div>
            </div>
            <div style="text-align: right">
              <h2 style="margin:0">${inv.id}</h2>
              <div>Issue Date: ${new Date(inv.issueDate).toLocaleDateString()}</div>
              <div>Due Date: ${new Date(inv.dueDate).toLocaleDateString()}</div>
            </div>
          </div>
          <div>
            <strong>Billed To:</strong> ${inv.entityName} (${inv.entityCode})<br/>
            <strong>GSTIN:</strong> ${inv.gstin || 'N/A'}<br/>
            <strong>Billing Period:</strong> ${inv.billingPeriod}
          </div>
          <table class="table">
            <thead>
              <tr><th>Description</th><th>Qty</th><th class="text-right">Taxable Amount</th><th class="text-right">GST (18%)</th><th class="text-right">Total</th></tr>
            </thead>
            <tbody>
              ${inv.lineItems
                .map(
                  (li) => `
                <tr>
                  <td>${li.description}</td>
                  <td>${li.quantity}</td>
                  <td class="text-right">₹${li.taxableAmount.toFixed(2)}</td>
                  <td class="text-right">₹${li.gstAmount.toFixed(2)}</td>
                  <td class="text-right">₹${li.totalAmount.toFixed(2)}</td>
                </tr>
              `
                )
                .join('')}
            </tbody>
          </table>
          <div class="summary">
            <div>Taxable Value: ₹${inv.taxableAmount.toFixed(2)}</div>
            <div>GST Amount: ₹${inv.gstAmount.toFixed(2)}</div>
            <div>Gross Total: ₹${inv.grossAmount.toFixed(2)}</div>
            <div>TDS Deducted: -₹${inv.tdsAmount.toFixed(2)}</div>
            <h3 style="margin-top:5px">Net Receivable: ₹${inv.netReceivable.toFixed(2)}</h3>
          </div>
          <script>window.print();</script>
        </body>
      </html>
    `);
    win.document.close();
  };

  const summary = data?.summary || {
    totalInvoiced: 0,
    outstandingAmount: 0,
    paidAmount: 0,
    gstCollected: 0,
    tdsDeducted: 0,
    overdueCount: 0,
    totalInvoices: 0,
  };

  return (
    <PageContainer
      title="Invoice Management"
      description="Manage platform fee invoices, tax components, payment status, and financial references across commercial entities."
      actions={
        <Button variant="primary" size="sm" onClick={generateModal.open} leftIcon={<FilePlus className="w-3.5 h-3.5" />}>
          Generate Invoice
        </Button>
      }
    >
      <div className="space-y-6">
        {/* Summary Metric Cards */}
        <InvoiceSummaryCards summary={summary} />

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-200 text-xs font-semibold overflow-x-auto">
          <button
            onClick={() => {
              setActiveTab('ALL');
              setPagination((prev) => ({ ...prev, page: 1 }));
            }}
            className={`pb-3 px-4 border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'ALL'
                ? 'border-[var(--primary)] text-[var(--primary)] font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            All Invoices ({summary.totalInvoices})
          </button>
          <button
            onClick={() => {
              setActiveTab('OUTSTANDING');
              setPagination((prev) => ({ ...prev, page: 1 }));
            }}
            className={`pb-3 px-4 border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'OUTSTANDING'
                ? 'border-[var(--primary)] text-[var(--primary)] font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Outstanding Invoices
          </button>
          <button
            onClick={() => {
              setActiveTab('PAID');
              setPagination((prev) => ({ ...prev, page: 1 }));
            }}
            className={`pb-3 px-4 border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'PAID'
                ? 'border-[var(--primary)] text-[var(--primary)] font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Paid Invoices
          </button>
          <button
            onClick={() => {
              setActiveTab('OVERDUE');
              setPagination((prev) => ({ ...prev, page: 1 }));
            }}
            className={`pb-3 px-4 border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'OVERDUE'
                ? 'border-[var(--primary)] text-[var(--primary)] font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Overdue ({summary.overdueCount})
          </button>
          <button
            onClick={() => {
              setActiveTab('DRAFTS');
              setPagination((prev) => ({ ...prev, page: 1 }));
            }}
            className={`pb-3 px-4 border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'DRAFTS'
                ? 'border-[var(--primary)] text-[var(--primary)] font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Drafts
          </button>
        </div>

        {/* Filter Bar */}
        <InvoiceFilterBar
          onFilterChange={(f) => {
            setFilters(f);
            setPagination((prev) => ({ ...prev, page: 1 }));
          }}
          onReset={() => {
            setFilters({});
            setPagination((prev) => ({ ...prev, page: 1 }));
          }}
          isLoading={isLoading}
        />

        {/* Data Table */}
        <InvoiceTable
          data={data?.items || []}
          isLoading={isLoading}
          onViewInvoice={(inv) => detailsDrawer.open(inv)}
          onDownloadInvoice={handleDownloadInvoice}
        />

        <Pagination
          currentPage={pagination.page}
          totalPages={pagination.totalPages}
          totalItems={pagination.totalItems}
          pageSize={pagination.pageSize}
          onPageChange={(page) => setPagination((prev) => ({ ...prev, page }))}
          onPageSizeChange={(pageSize) => setPagination((prev) => ({ ...prev, page: 1, pageSize }))}
        />

        {/* Drawers & Modals */}
        <InvoiceDetailsDrawer
          isOpen={detailsDrawer.isOpen}
          onClose={detailsDrawer.close}
          invoice={detailsDrawer.data}
          onMarkPaid={(inv) => markPaidModal.open(inv)}
          onDownload={handleDownloadInvoice}
        />

        <GenerateInvoiceModal
          isOpen={generateModal.isOpen}
          onClose={generateModal.close}
          onGenerate={handleGenerateInvoice}
        />

        <MarkPaidModal
          isOpen={markPaidModal.isOpen}
          onClose={markPaidModal.close}
          invoice={markPaidModal.data}
          onMarkPaid={handleMarkPaid}
        />
      </div>
    </PageContainer>
  );
}
