'use client';

import React, { useState, useEffect } from 'react';
import { PageContainer } from '@/components/layout/PageContainer';
import { Pagination } from '@/components/ui/Pagination';
import { useModal } from '@/hooks/useModal';
import { chargebackService, ChargebackListResult } from '@/services/chargebackService';
import { Chargeback, ChargebackFilters, PaginationState } from '@/types/domain';
import { ChargebackSummaryCards } from '@/components/features/chargebacks/ChargebackSummaryCards';
import { ChargebackFilterBar } from '@/components/features/chargebacks/ChargebackFilterBar';
import { ChargebackTable } from '@/components/features/chargebacks/ChargebackTable';
import { ChargebackDetailsDrawer } from '@/components/features/chargebacks/ChargebackDetailsDrawer';
import { AssignCaseModal } from '@/components/features/chargebacks/AssignCaseModal';
import { ResolveCaseModal } from '@/components/features/chargebacks/ResolveCaseModal';
import { ShieldAlert, FileText, CheckCircle2 } from 'lucide-react';

export default function ChargebacksPage() {
  const [activeTab, setActiveTab] = useState<'OPEN' | 'ALL' | 'EVIDENCE' | 'RESOLVED'>('OPEN');
  const [filters, setFilters] = useState<ChargebackFilters>({});
  const [data, setData] = useState<ChargebackListResult | null>(null);
  const [pagination, setPagination] = useState<PaginationState>({ page: 1, pageSize: 10, totalItems: 0, totalPages: 1 });
  const [isLoading, setIsLoading] = useState(true);

  // Drawers & Modals
  const detailsDrawer = useModal<Chargeback>();
  const assignModal = useModal<Chargeback>();
  const resolveModal = useModal<Chargeback>();

  const loadChargebacks = () => {
    setIsLoading(true);

    const activeFilters: ChargebackFilters = { ...filters };
    if (activeTab === 'OPEN') {
      activeFilters.status = 'UNDER_REVIEW';
    } else if (activeTab === 'EVIDENCE') {
      activeFilters.status = 'EVIDENCE_REQUIRED';
    } else if (activeTab === 'RESOLVED') {
      activeFilters.status = 'WON';
    }

    chargebackService.getChargebacks(activeFilters, pagination.page, pagination.pageSize).then((res) => {
      if (res.success && res.data) {
        setData(res.data);
        setPagination(res.data.pagination);
      }
      setIsLoading(false);
    });
  };

  useEffect(() => {
    let isCancelled = false;
    const activeFilters: ChargebackFilters = { ...filters };
    if (activeTab === 'OPEN') {
      activeFilters.status = 'UNDER_REVIEW';
    } else if (activeTab === 'EVIDENCE') {
      activeFilters.status = 'EVIDENCE_REQUIRED';
    } else if (activeTab === 'RESOLVED') {
      activeFilters.status = 'WON';
    }

    chargebackService.getChargebacks(activeFilters, pagination.page, pagination.pageSize).then((res) => {
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

  const handleAssign = async (chargebackId: string, assignedTo: string) => {
    await chargebackService.assignCase(chargebackId, assignedTo);
    loadChargebacks();
    if (detailsDrawer.data && detailsDrawer.data.chargebackId === chargebackId) {
      const updated = await chargebackService.getChargebackById(chargebackId);
      if (updated.data) detailsDrawer.open(updated.data);
    }
  };

  const handleResolve = async (chargebackId: string, resolution: 'WON' | 'LOST' | 'WITHDRAWN', reason: string) => {
    await chargebackService.resolveCase(chargebackId, resolution, reason);
    loadChargebacks();
    if (detailsDrawer.data && detailsDrawer.data.chargebackId === chargebackId) {
      const updated = await chargebackService.getChargebackById(chargebackId);
      if (updated.data) detailsDrawer.open(updated.data);
    }
  };

  const handleAddEvidence = async (chargebackId: string, docType: string, fileName: string) => {
    await chargebackService.addEvidence(chargebackId, docType, fileName);
    loadChargebacks();
    if (detailsDrawer.data && detailsDrawer.data.chargebackId === chargebackId) {
      const updated = await chargebackService.getChargebackById(chargebackId);
      if (updated.data) detailsDrawer.open(updated.data);
    }
  };

  const handleSubmitResponse = async (chargebackId: string, summary: string, explanation: string) => {
    await chargebackService.submitResponse(chargebackId, summary, explanation);
    loadChargebacks();
    if (detailsDrawer.data && detailsDrawer.data.chargebackId === chargebackId) {
      const updated = await chargebackService.getChargebackById(chargebackId);
      if (updated.data) detailsDrawer.open(updated.data);
    }
  };

  const summary = data?.summary || {
    openCases: 0,
    underReview: 0,
    evidenceRequired: 0,
    responseDueSoon: 0,
    wonCases: 0,
    lostCases: 0,
    totalDisputedAmount: 0,
    totalLossAmount: 0,
    winRate: 100,
  };

  return (
    <PageContainer
      title="Chargeback Management"
      description="Monitor payment disputes, evidence submissions, case deadlines and financial exposure."
    >
      <div className="space-y-6">
        {/* Metric Cards */}
        <ChargebackSummaryCards summary={summary} />

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 text-xs font-semibold overflow-x-auto">
          <button
            onClick={() => {
              setActiveTab('OPEN');
              setPagination((prev) => ({ ...prev, page: 1 }));
            }}
            className={`pb-3 px-4 border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === 'OPEN'
                ? 'border-[var(--primary)] text-[var(--primary)] font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
            <span>Open Cases ({summary.openCases})</span>
          </button>

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
            All Disputes List
          </button>

          <button
            onClick={() => {
              setActiveTab('EVIDENCE');
              setPagination((prev) => ({ ...prev, page: 1 }));
            }}
            className={`pb-3 px-4 border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === 'EVIDENCE'
                ? 'border-[var(--primary)] text-[var(--primary)] font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-purple-600" />
            <span>Evidence Queue ({summary.evidenceRequired})</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('RESOLVED');
              setPagination((prev) => ({ ...prev, page: 1 }));
            }}
            className={`pb-3 px-4 border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === 'RESOLVED'
                ? 'border-[var(--primary)] text-[var(--primary)] font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Resolved Cases ({summary.wonCases + summary.lostCases})</span>
          </button>
        </div>

        {/* Filter Bar */}
        <ChargebackFilterBar
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
        <ChargebackTable
          data={data?.items || []}
          isLoading={isLoading}
          onViewCase={(c) => detailsDrawer.open(c)}
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
        <ChargebackDetailsDrawer
          isOpen={detailsDrawer.isOpen}
          onClose={detailsDrawer.close}
          chargeback={detailsDrawer.data}
          onAssign={(c) => assignModal.open(c)}
          onResolve={(c) => resolveModal.open(c)}
          onAddEvidence={handleAddEvidence}
          onSubmitResponse={handleSubmitResponse}
        />

        <AssignCaseModal
          isOpen={assignModal.isOpen}
          onClose={assignModal.close}
          chargeback={assignModal.data}
          onAssign={handleAssign}
        />

        <ResolveCaseModal
          isOpen={resolveModal.isOpen}
          onClose={resolveModal.close}
          chargeback={resolveModal.data}
          onResolve={handleResolve}
        />
      </div>
    </PageContainer>
  );
}
