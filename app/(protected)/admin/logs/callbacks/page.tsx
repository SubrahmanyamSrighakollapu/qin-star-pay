'use client';

import React, { useState, useEffect } from 'react';
import { PageContainer } from '@/components/layout/PageContainer';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Pagination } from '@/components/ui/Pagination';
import { useModal } from '@/hooks/useModal';
import { logService, LogListResult } from '@/services/logService';
import { CallbackLog, CallbackLogSummary, PaginationState } from '@/types/domain';
import { CallbackLogTable } from '@/components/features/logs/CallbackLogTable';
import { LogDetailsDrawer } from '@/components/features/logs/LogDetailsDrawer';
import { TraceSearchDrawer } from '@/components/features/logs/TraceSearchDrawer';
import { Search } from 'lucide-react';

export default function CallbackLogsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [data, setData] = useState<LogListResult<CallbackLog> | null>(null);
  const [summary, setSummary] = useState<CallbackLogSummary | null>(null);
  const [pagination, setPagination] = useState<PaginationState>({ page: 1, pageSize: 10, totalItems: 0, totalPages: 1 });
  const [isLoading, setIsLoading] = useState(true);

  // Modals & Drawers
  const detailsDrawer = useModal<CallbackLog>();
  const traceDrawer = useModal<string>();

  const loadLogs = () => {
    setIsLoading(true);
    Promise.all([
      logService.getCallbackLogs(searchQuery, pagination.page, pagination.pageSize),
      logService.getCallbackSummary(),
    ]).then(([logsRes, sumRes]) => {
      if (logsRes.success && logsRes.data) {
        setData(logsRes.data);
        setPagination(logsRes.data.pagination);
      }
      if (sumRes.success && sumRes.data) {
        setSummary(sumRes.data);
      }
      setIsLoading(false);
    });
  };

  useEffect(() => {
    let isCancelled = false;
    Promise.all([
      logService.getCallbackLogs(searchQuery, pagination.page, pagination.pageSize),
      logService.getCallbackSummary(),
    ]).then(([logsRes, sumRes]) => {
      if (!isCancelled) {
        if (logsRes.success && logsRes.data) {
          setData(logsRes.data);
          setPagination(logsRes.data.pagination);
        }
        if (sumRes.success && sumRes.data) {
          setSummary(sumRes.data);
        }
        setIsLoading(false);
      }
    });
    return () => {
      isCancelled = true;
    };
  }, [searchQuery, pagination.page, pagination.pageSize]);

  const handleRetryProcessing = async (callback: CallbackLog) => {
    await logService.retryCallbackProcessing(callback.id);
    loadLogs();
  };

  const sum = summary || {
    totalReceived: 0,
    processedCount: 0,
    failedCount: 0,
    duplicateCount: 0,
    pendingCount: 0,
  };

  return (
    <PageContainer
      title="Callback Logs"
      description="Track inbound provider payment callbacks, signature verification status, processing idempotency, and duplicate callback protection."
    >
      <div className="space-y-6">
        {/* KPI Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <Card className="p-4 bg-white border border-slate-200">
            <span className="text-xs font-semibold text-slate-500">Callbacks Received</span>
            <div className="mt-1 font-mono font-extrabold text-base text-[var(--primary)]">
              {sum.totalReceived} Callbacks
            </div>
            <span className="text-[11px] text-slate-400 block mt-0.5">Inbound payment events</span>
          </Card>

          <Card className="p-4 bg-white border border-slate-200">
            <span className="text-xs font-semibold text-slate-500">Processed</span>
            <div className="mt-1 font-mono font-extrabold text-base text-emerald-700">
              {sum.processedCount} Processed
            </div>
            <span className="text-[11px] text-emerald-600 block mt-0.5">State applied</span>
          </Card>

          <Card className="p-4 bg-white border border-slate-200">
            <span className="text-xs font-semibold text-slate-500">Duplicates Filtered</span>
            <div className="mt-1 font-mono font-extrabold text-base text-amber-700">
              {sum.duplicateCount} Duplicates
            </div>
            <span className="text-[11px] text-amber-600 block mt-0.5">Double-post prevented</span>
          </Card>

          <Card className="p-4 bg-white border border-slate-200">
            <span className="text-xs font-semibold text-slate-500">Failed Processing</span>
            <div className="mt-1 font-mono font-extrabold text-base text-rose-700">
              {sum.failedCount} Failed
            </div>
            <span className="text-[11px] text-rose-600 block mt-0.5">Signature mismatch</span>
          </Card>

          <Card className="p-4 bg-white border border-slate-200">
            <span className="text-xs font-semibold text-slate-500">Pending</span>
            <div className="mt-1 font-mono font-extrabold text-base text-slate-900">
              {sum.pendingCount} Pending
            </div>
            <span className="text-[11px] text-slate-400 block mt-0.5">Queue processing</span>
          </Card>
        </div>

        {/* Filter Bar */}
        <Card className="p-4 bg-white border border-slate-200">
          <Input
            placeholder="Search Callback ID, Provider Reference, Transaction ID, Provider Name..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPagination((prev) => ({ ...prev, page: 1 }));
            }}
            leftIcon={<Search className="w-4 h-4 text-slate-400" />}
          />
        </Card>

        {/* Table View */}
        <CallbackLogTable
          data={data?.items || []}
          isLoading={isLoading}
          onViewLog={(log) => detailsDrawer.open(log)}
          onRetryProcessing={handleRetryProcessing}
          onOpenTraceSearch={(tId) => traceDrawer.open(tId)}
        />

        <Pagination
          currentPage={pagination.page}
          totalPages={pagination.totalPages}
          totalItems={pagination.totalItems}
          pageSize={pagination.pageSize}
          onPageChange={(page) => setPagination((prev) => ({ ...prev, page }))}
          onPageSizeChange={(pageSize) => setPagination((prev) => ({ ...prev, page: 1, pageSize }))}
        />

        {/* Drawers */}
        <LogDetailsDrawer
          isOpen={detailsDrawer.isOpen}
          onClose={detailsDrawer.close}
          log={detailsDrawer.data}
          onOpenTraceSearch={(tId) => traceDrawer.open(tId)}
        />

        <TraceSearchDrawer
          isOpen={traceDrawer.isOpen}
          onClose={traceDrawer.close}
          initialReferenceId={traceDrawer.data || ''}
        />
      </div>
    </PageContainer>
  );
}
