'use client';

import React, { useState, useEffect } from 'react';
import { PageContainer } from '@/components/layout/PageContainer';
import { Card } from '@/components/ui/Card';
import { Table } from '@/components/ui/Table';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { invoiceService } from '@/services/invoiceService';
import { TaxRecord, ReportDateRange } from '@/types/domain';
import { formatCurrency } from '@/utils/formatters';
import { ReportDateRangePicker } from '@/components/features/reports/ReportDateRangePicker';
import { ReportExportMenu } from '@/components/features/reports/ReportExportMenu';
import { reportService } from '@/services/reportService';


export default function TaxSummaryPage() {
  const [dateRange, setDateRange] = useState<ReportDateRange>({ preset: 'THIS_MONTH' });
  const [records, setRecords] = useState<TaxRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isCancelled = false;
    invoiceService.getTaxSummary().then((res) => {
      if (!isCancelled && res.success && res.data) {
        setRecords(res.data);
        setIsLoading(false);
      }
    });
    return () => {
      isCancelled = true;
    };
  }, [dateRange]);

  const handleExportCsv = () => {
    const exportRows = records.map((r) => ({
      'Filing Period': r.period,
      'Taxable Revenue (INR)': r.taxableRevenue,
      'Total GST (INR)': r.totalGst,
      'CGST (INR)': r.cgst,
      'SGST (INR)': r.sgst,
      'IGST (INR)': r.igst,
      'GST Adjustments (INR)': r.gstAdjustments,
      'Net GST Liability (INR)': r.netGstLiability,
      'Filing Status': r.status,
    }));
    reportService.exportToCsv('GST_Tax_Summary_Report', exportRows);
  };

  const totalTaxable = records.reduce((acc, r) => acc + r.taxableRevenue, 0);
  const totalGst = records.reduce((acc, r) => acc + r.totalGst, 0);
  const totalAdjustments = records.reduce((acc, r) => acc + r.gstAdjustments, 0);
  const netGstLiability = records.reduce((acc, r) => acc + r.netGstLiability, 0);

  const columns = [
    {
      key: 'period',
      header: 'Filing Period',
      render: (row: TaxRecord) => (
        <span className="font-mono font-bold text-xs text-[var(--primary)]">{row.period}</span>
      ),
    },
    {
      key: 'taxableRevenue',
      header: 'Taxable Revenue',
      align: 'right' as const,
      render: (row: TaxRecord) => (
        <span className="font-mono text-xs text-slate-800 font-semibold">{formatCurrency(row.taxableRevenue)}</span>
      ),
    },
    {
      key: 'cgst',
      header: 'CGST (@9%)',
      align: 'right' as const,
      render: (row: TaxRecord) => (
        <span className="font-mono text-xs text-slate-600">{formatCurrency(row.cgst)}</span>
      ),
    },
    {
      key: 'sgst',
      header: 'SGST (@9%)',
      align: 'right' as const,
      render: (row: TaxRecord) => (
        <span className="font-mono text-xs text-slate-600">{formatCurrency(row.sgst)}</span>
      ),
    },
    {
      key: 'igst',
      header: 'IGST (@18%)',
      align: 'right' as const,
      render: (row: TaxRecord) => (
        <span className="font-mono text-xs text-purple-700 font-medium">{formatCurrency(row.igst)}</span>
      ),
    },
    {
      key: 'gstAdjustments',
      header: 'GST Adjustments',
      align: 'right' as const,
      render: (row: TaxRecord) => (
        <span className="font-mono text-xs text-amber-700 font-semibold">-{formatCurrency(row.gstAdjustments)}</span>
      ),
    },
    {
      key: 'netGstLiability',
      header: 'Net GST Liability',
      align: 'right' as const,
      render: (row: TaxRecord) => (
        <span className="font-mono font-extrabold text-xs text-purple-900">{formatCurrency(row.netGstLiability)}</span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      align: 'center' as const,
      render: (row: TaxRecord) => <StatusBadge status={row.status} size="sm" />,
    },
  ];

  return (
    <PageContainer
      title="GST & Tax Summary"
      description="Monitor taxable platform revenue, GST collections, tax adjustments and filing-period exposure."
      actions={<ReportExportMenu onExportCsv={handleExportCsv} reportTitle="GST Summary" disabled={!records.length} />}
    >
      <div className="space-y-6">
        {/* Summary Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-4 bg-white border border-slate-200">
            <span className="text-xs font-semibold text-slate-500">Taxable Platform Revenue</span>
            <div className="mt-1 font-mono font-extrabold text-base text-[var(--primary)]">{formatCurrency(totalTaxable)}</div>
            <span className="text-[11px] text-slate-400 block mt-0.5">Platform service revenue</span>
          </Card>

          <Card className="p-4 bg-white border border-slate-200">
            <span className="text-xs font-semibold text-slate-500">Gross GST Collected</span>
            <div className="mt-1 font-mono font-extrabold text-base text-purple-900">{formatCurrency(totalGst)}</div>
            <span className="text-[11px] text-purple-600 block mt-0.5">18% output GST</span>
          </Card>

          <Card className="p-4 bg-white border border-slate-200">
            <span className="text-xs font-semibold text-slate-500">GST Credit Reversals</span>
            <div className="mt-1 font-mono font-extrabold text-base text-amber-700">-{formatCurrency(totalAdjustments)}</div>
            <span className="text-[11px] text-amber-600 block mt-0.5">Credit Note tax offsets</span>
          </Card>

          <Card className="p-4 bg-white border border-slate-200">
            <span className="text-xs font-semibold text-slate-500">Net GST Liability</span>
            <div className="mt-1 font-mono font-extrabold text-base text-purple-950">{formatCurrency(netGstLiability)}</div>
            <span className="text-[11px] text-purple-600 block mt-0.5">Filing period due</span>
          </Card>
        </div>

        {/* Date Filter Bar */}
        <Card className="p-4 bg-white border border-slate-200">
          <ReportDateRangePicker value={dateRange} onChange={(d) => setDateRange(d)} />
        </Card>

        {/* Data Table */}
        <div className="overflow-x-auto border border-[var(--border)] rounded-[var(--radius-xl)] bg-white shadow-xs">
          <Table columns={columns} data={records} keyExtractor={(row) => row.period} isLoading={isLoading} />
        </div>
      </div>
    </PageContainer>
  );
}
