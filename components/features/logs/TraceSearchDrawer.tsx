'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Drawer } from '@/components/ui/Drawer';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { TraceSearchResult } from '@/types/domain';
import { logService } from '@/services/logService';
import { formatDate, formatCurrency } from '@/utils/formatters';
import { Search, GitCommit, ExternalLink } from 'lucide-react';

export interface TraceSearchDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  initialReferenceId?: string;
}

export const TraceSearchDrawer: React.FC<TraceSearchDrawerProps> = ({
  isOpen,
  onClose,
  initialReferenceId = '',
}) => {
  const [query, setQuery] = useState(initialReferenceId);
  const [result, setResult] = useState<TraceSearchResult | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (ref: string) => {
    if (!ref.trim()) return;
    setIsSearching(true);
    const res = await logService.traceByReference(ref.trim());
    if (res.success && res.data) {
      setResult(res.data);
    }
    setIsSearching(false);
  };

  useEffect(() => {
    let isCancelled = false;
    if (isOpen && initialReferenceId) {
      logService.traceByReference(initialReferenceId.trim()).then((res) => {
        if (!isCancelled && res.success && res.data) {
          setResult(res.data);
        }
      });
    }
    return () => {
      isCancelled = true;
    };
  }, [isOpen, initialReferenceId]);

  return (
    <Drawer isOpen={isOpen} onClose={onClose} title="Global Transaction Lifecycle Trace" size="xl" className="w-full md:w-[880px] md:max-w-[92vw]">
      <div className="space-y-6 text-xs">
        {/* Search Header */}
        <Card title="Trace Reference Lookup" subtitle="Trace end-to-end payment lifecycle across API requests, callbacks, webhooks, and audit logs">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSearch(query);
            }}
            className="flex gap-2"
          >
            <div className="flex-1">
              <Input
                placeholder="Enter Trace ID, Correlation ID, Transaction ID, UTR, Order ID..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                leftIcon={<Search className="w-4 h-4 text-slate-400" />}
              />
            </div>
            <Button variant="primary" size="sm" type="submit" isLoading={isSearching} leftIcon={<GitCommit className="w-3.5 h-3.5" />}>
              Search Trace
            </Button>
          </form>
        </Card>

        {result && (
          <div className="space-y-6">
            {/* Identity Banner */}
            <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-mono text-xs">
              <div>
                <span className="text-[11px] text-slate-500 font-sans block font-semibold">Matched Trace Correlation</span>
                <span className="font-extrabold text-purple-900 text-sm">{result.traceId}</span>
                <span className="text-[11px] text-slate-600 block mt-0.5">Correlation: <strong>{result.correlationId}</strong></span>
              </div>

              {result.transaction && (
                <Link href={`/transactions/${result.transaction.id}`} onClick={onClose}>
                  <Button variant="outline" size="sm" leftIcon={<ExternalLink className="w-3.5 h-3.5 text-blue-600" />}>
                    Open Transaction Record
                  </Button>
                </Link>
              )}
            </div>

            {/* Transaction Overview Card if found */}
            {result.transaction && (
              <Card title="Linked Core Transaction Record" subtitle={`Transaction ID: ${result.transaction.id}`}>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 font-mono text-xs">
                  <div>Amount: <strong className="text-sm font-extrabold text-slate-900">{formatCurrency(result.transaction.amount)}</strong></div>
                  <div>Type: <span className="font-bold text-purple-700">{result.transaction.type}</span></div>
                  <div>Mode: <span className="font-bold text-slate-900">{result.transaction.paymentMode}</span></div>
                  <div>Status: <StatusBadge status={result.transaction.status} size="sm" /></div>
                </div>
              </Card>
            )}

            {/* Chronological Event Timeline */}
            <Card title="End-to-End Chronological Event Flow" subtitle="Cross-module activity timeline">
              <div className="space-y-6 relative pl-6 border-l-2 border-slate-200 py-2">
                {/* 1. API Request Logs */}
                {result.apiLogs.map((api) => (
                  <div key={api.id} className="relative">
                    <div className="absolute -left-[31px] top-0.5 w-4 h-4 rounded-full bg-white border-2 border-blue-600 flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-bold text-slate-900 text-xs">API Request: {api.providerName} ({api.service})</span>
                        <span className="font-mono text-[11px] text-slate-400">{formatDate(api.createdAt)}</span>
                      </div>
                      <div className="font-mono text-[11px] text-slate-600">
                        {api.httpMethod} {api.endpoint} • HTTP {api.httpStatus} ({api.responseTimeMs}ms)
                      </div>
                    </div>
                  </div>
                ))}

                {/* 2. Callbacks */}
                {result.callbacks.map((cb) => (
                  <div key={cb.id} className="relative">
                    <div className="absolute -left-[31px] top-0.5 w-4 h-4 rounded-full bg-white border-2 border-emerald-600 flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-bold text-slate-900 text-xs">Inbound Callback: {cb.providerName}</span>
                        <span className="font-mono text-[11px] text-slate-400">{formatDate(cb.createdAt)}</span>
                      </div>
                      <div className="font-mono text-[11px] text-slate-600 flex items-center gap-2">
                        <span>Ref: {cb.providerReference}</span>
                        <StatusBadge status={cb.processingStatus} size="sm" />
                        {cb.isDuplicate && <span className="px-1.5 py-0.2 bg-amber-100 text-amber-900 font-bold rounded">DUPLICATE</span>}
                      </div>
                    </div>
                  </div>
                ))}

                {/* 3. Outbound Webhooks */}
                {result.webhooks.map((wh) => (
                  <div key={wh.id} className="relative">
                    <div className="absolute -left-[31px] top-0.5 w-4 h-4 rounded-full bg-white border-2 border-purple-600 flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-purple-600" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-bold text-slate-900 text-xs">Outbound Webhook: {wh.eventType}</span>
                        <span className="font-mono text-[11px] text-slate-400">{formatDate(wh.createdAt)}</span>
                      </div>
                      <div className="font-mono text-[11px] text-slate-600 flex items-center gap-2">
                        <span className="truncate max-w-[280px]">{wh.endpointUrl}</span>
                        <StatusBadge status={wh.status} size="sm" />
                      </div>
                    </div>
                  </div>
                ))}

                {/* 4. Activity Logs */}
                {result.activityLogs.map((act) => (
                  <div key={act.id} className="relative">
                    <div className="absolute -left-[31px] top-0.5 w-4 h-4 rounded-full bg-white border-2 border-amber-500 flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-bold text-slate-900 text-xs">Audit Action: {act.action}</span>
                        <span className="font-mono text-[11px] text-slate-400">{formatDate(act.createdAt)}</span>
                      </div>
                      <p className="text-slate-600">{act.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}
      </div>
    </Drawer>
  );
};
