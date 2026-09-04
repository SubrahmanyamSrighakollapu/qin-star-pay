'use client';

import React, { useState, useEffect } from 'react';
import { PageContainer } from '@/components/layout/PageContainer';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Pagination } from '@/components/ui/Pagination';
import { useModal } from '@/hooks/useModal';
import { logService, LogListResult } from '@/services/logService';
import { WebhookLog, WebhookLogSummary, PaginationState } from '@/types/domain';
import { WebhookLogTable } from '@/components/features/logs/WebhookLogTable';
import { LogDetailsDrawer } from '@/components/features/logs/LogDetailsDrawer';
import { TraceSearchDrawer } from '@/components/features/logs/TraceSearchDrawer';
import { Search } from 'lucide-react';

export default function WebhookLogsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [data, setData] = useState<LogListResult<WebhookLog> | null>(null);
  const [summary, setSummary] = useState<WebhookLogSummary | null>(null);
  const [pagination, setPagination] = useState<PaginationState>({ page: 1, pageSize: 10, totalItems: 0, totalPages: 1 });
  const [isLoading, setIsLoading] = useState(true);

  // Modals & Drawers
  const detailsDrawer = useModal<WebhookLog>();
  const traceDrawer = useModal<string>();

  const loadLogs = () => {
    setIsLoading(true);
    Promise.all([
      logService.getWebhookLogs(searchQuery, pagination.page, pagination.pageSize),
      logService.getWebhookSummary(),
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
      logService.getWebhookLogs(searchQuery, pagination.page, pagination.pageSize),
      logService.getWebhookSummary(),
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

  const handleRetryWebhook = async (webhook: WebhookLog) => {
    await logService.retryWebhookDelivery(webhook.id);
    loadLogs();
  };

  const sum = summary || {
    totalWebhooks: 0,
    deliveredCount: 0,
    failedCount: 0,
    pendingRetryCount: 0,
    exhaustedCount: 0,
  };

  return (
    <PageContainer
      title="Webhook Logs"
      description="Monitor inbound and outbound webhook event delivery, attempt retry histories, and delivery status logs."
    >
      <div className="space-y-6">
        {/* KPI Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <Card className="p-4 bg-white border border-slate-200">
            <span className="text-xs font-semibold text-slate-500">Total Webhooks</span>
            <div className="mt-1 font-mono font-extrabold text-base text-[var(--primary)]">
              {sum.totalWebhooks} Webhooks
            </div>
            <span className="text-[11px] text-slate-400 block mt-0.5">Dispatched & received</span>
          </Card>

          <Card className="p-4 bg-white border border-slate-200">
            <span className="text-xs font-semibold text-slate-500">Delivered</span>
            <div className="mt-1 font-mono font-extrabold text-base text-emerald-700">
              {sum.deliveredCount} Delivered
            </div>
            <span className="text-[11px] text-emerald-600 block mt-0.5">HTTP 200 OK</span>
          </Card>

          <Card className="p-4 bg-white border border-slate-200">
            <span className="text-xs font-semibold text-slate-500">Pending Retries</span>
            <div className="mt-1 font-mono font-extrabold text-base text-amber-700">
              {sum.pendingRetryCount} Retrying
            </div>
            <span className="text-[11px] text-amber-600 block mt-0.5">Scheduled retry queue</span>
          </Card>

          <Card className="p-4 bg-white border border-slate-200">
            <span className="text-xs font-semibold text-slate-500">Exhausted</span>
            <div className="mt-1 font-mono font-extrabold text-base text-rose-700">
              {sum.exhaustedCount} Exhausted
            </div>
            <span className="text-[11px] text-rose-600 block mt-0.5">Max attempts reached</span>
          </Card>

          <Card className="p-4 bg-white border border-slate-200">
            <span className="text-xs font-semibold text-slate-500">Failed</span>
            <div className="mt-1 font-mono font-extrabold text-base text-slate-900">
              {sum.failedCount} Failed
            </div>
            <span className="text-[11px] text-slate-400 block mt-0.5">Endpoint errors</span>
          </Card>
        </div>

        {/* Filter Bar */}
        <Card className="p-4 bg-white border border-slate-200">
          <Input
            placeholder="Search Webhook ID, Endpoint URL, Event Type, Provider Name..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPagination((prev) => ({ ...prev, page: 1 }));
            }}
            leftIcon={<Search className="w-4 h-4 text-slate-400" />}
          />
        </Card>

        {/* Table View */}
        <WebhookLogTable
          data={data?.items || []}
          isLoading={isLoading}
          onViewLog={(log) => detailsDrawer.open(log)}
          onRetryWebhook={handleRetryWebhook}
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
