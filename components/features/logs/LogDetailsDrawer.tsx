'use client';

import React, { useState } from 'react';
import { Drawer } from '@/components/ui/Drawer';
import { Card } from '@/components/ui/Card';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Button } from '@/components/ui/Button';
import { BaseLog, ApiLog, CallbackLog, WebhookLog, LoginLog, ActivityLog } from '@/types/domain';
import { formatDate } from '@/utils/formatters';
import { sanitizeHeaders } from '@/utils/masking';
import { JsonViewer } from './JsonViewer';
import { TraceReferenceBadge } from './TraceReferenceBadge';
import { Copy, Check, GitCommit, Clock, AlertTriangle } from 'lucide-react';

export interface LogDetailsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  log: BaseLog | null;
  onOpenTraceSearch?: (traceId: string) => void;
}

export const LogDetailsDrawer: React.FC<LogDetailsDrawerProps> = ({
  isOpen,
  onClose,
  log,
  onOpenTraceSearch,
}) => {
  const [isCopied, setIsCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'INSPECTOR' | 'TIMELINE'>('INSPECTOR');

  if (!log) return null;

  const handleCopyId = () => {
    navigator.clipboard.writeText(log.id);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const apiLog = log as ApiLog;
  const callbackLog = log as CallbackLog;
  const webhookLog = log as WebhookLog;
  const loginLog = log as LoginLog;
  const activityLog = log as ActivityLog;

  return (
    <Drawer isOpen={isOpen} onClose={onClose} title="Log Record Inspection" size="xl" className="w-full md:w-[880px] md:max-w-[92vw]">
      <div className="space-y-6 text-xs">
        {/* Sticky Identity Header */}
        <div className="sticky top-0 z-20 flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 bg-white/95 backdrop-blur-xs border border-[var(--border)] rounded-[var(--radius-xl)] shadow-xs">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="font-mono font-extrabold text-base md:text-lg text-[var(--primary)]">
                {log.id}
              </span>
              <StatusBadge status={log.severity} size="sm" />
              <StatusBadge status={log.status} size="sm" />
              <TraceReferenceBadge traceId={log.traceId} onClick={onOpenTraceSearch} />
            </div>
            <div className="text-xs text-[var(--text-muted)] mt-0.5">
              Source: <strong>{log.sourceModule}</strong> | Correlation: <strong className="font-mono">{log.correlationId}</strong> | Created: <strong>{formatDate(log.createdAt)}</strong>
            </div>
          </div>

          <div className="flex items-center flex-wrap gap-2 shrink-0">
            <Button variant="outline" size="sm" onClick={handleCopyId} className="whitespace-nowrap">
              {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600 mr-1" /> : <Copy className="w-3.5 h-3.5 mr-1" />}
              {isCopied ? 'Copied' : 'Copy ID'}
            </Button>

            {onOpenTraceSearch && (
              <Button variant="primary" size="sm" onClick={() => onOpenTraceSearch(log.traceId)} leftIcon={<GitCommit className="w-3.5 h-3.5" />}>
                Trace Full Lifecycle
              </Button>
            )}
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-200 font-semibold">
          <button
            onClick={() => setActiveTab('INSPECTOR')}
            className={`pb-2.5 px-4 border-b-2 transition-colors ${
              activeTab === 'INSPECTOR'
                ? 'border-[var(--primary)] text-[var(--primary)] font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Payload & Header Inspector
          </button>
          <button
            onClick={() => setActiveTab('TIMELINE')}
            className={`pb-2.5 px-4 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'TIMELINE'
                ? 'border-[var(--primary)] text-[var(--primary)] font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Trace Timeline</span>
          </button>
        </div>

        {/* Tab 1: Inspector */}
        {activeTab === 'INSPECTOR' && (
          <div className="space-y-6">
            {/* API / Callback Specific Details */}
            {apiLog.endpoint && (
              <Card title="HTTP Endpoint & Latency" subtitle="Request metadata">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-700 font-mono text-xs">
                  <div>Provider: <strong className="font-sans text-slate-900">{apiLog.providerName}</strong></div>
                  <div>HTTP Method: <strong className="text-purple-700">{apiLog.httpMethod}</strong></div>
                  <div className="col-span-1 sm:col-span-2">Endpoint: <strong className="text-slate-900 truncate block">{apiLog.endpoint}</strong></div>
                  <div>HTTP Status: <strong className={apiLog.httpStatus === 200 ? 'text-emerald-700' : 'text-rose-700'}>{apiLog.httpStatus}</strong></div>
                  <div>Latency: <strong className="text-slate-900">{apiLog.responseTimeMs}ms</strong></div>
                </div>
              </Card>
            )}

            {/* Error Information Block */}
            {apiLog.errorMessage && (
              <div className="p-4 bg-rose-50 border border-rose-200 rounded-lg text-rose-900 space-y-1 font-mono text-xs">
                <div className="font-bold text-sm font-sans flex items-center gap-1.5 text-rose-950">
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                  <span>Execution Exception: {apiLog.internalErrorCode || 'ERR_API_FAILURE'}</span>
                </div>
                <p className="font-sans text-rose-800 mt-1">{apiLog.errorMessage}</p>
                {apiLog.providerErrorCode && <div>Provider Error Code: <strong>{apiLog.providerErrorCode}</strong></div>}
              </div>
            )}

            {/* Sanitized Headers */}
            {apiLog.requestHeaders && (
              <Card title="Sanitized Request Headers" subtitle="Authentication tokens & sensitive headers are masked">
                <div className="p-3 bg-slate-900 text-slate-100 rounded-lg font-mono text-xs space-y-1">
                  {Object.entries(sanitizeHeaders(apiLog.requestHeaders)).map(([key, val]) => (
                    <div key={key} className="flex justify-between border-b border-slate-800 pb-1">
                      <span className="text-purple-400">{key}:</span>
                      <span className="text-emerald-400 font-bold">{val}</span>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Payloads */}
            {apiLog.requestPayloadSanitized && (
              <JsonViewer title="Sanitized Request Payload" data={apiLog.requestPayloadSanitized} />
            )}

            {apiLog.responsePayloadSanitized && (
              <JsonViewer title="Sanitized Response Payload" data={apiLog.responsePayloadSanitized} />
            )}

            {callbackLog.payloadSanitized && (
              <JsonViewer title="Callback Event Payload" data={callbackLog.payloadSanitized} />
            )}

            {webhookLog.payloadSanitized && (
              <JsonViewer title="Webhook Payload" data={webhookLog.payloadSanitized} />
            )}

            {/* Login Specific Details */}
            {loginLog.userEmail && (
              <Card title="User Session Metadata" subtitle="Authentication log inspection">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-700">
                  <div>User: <strong className="text-slate-900">{loginLog.userName} ({loginLog.userEmail})</strong></div>
                  <div>Role: <span className="font-bold text-purple-700">{loginLog.userRole}</span></div>
                  <div>IP Address: <span className="font-mono text-slate-900">{loginLog.ipAddress}</span></div>
                  <div>Device / Browser: <span className="text-slate-900">{loginLog.device} • {loginLog.browser} ({loginLog.os})</span></div>
                  <div>Auth Method: <strong className="text-slate-900">{loginLog.authMethod}</strong></div>
                  <div>Session Duration: <strong className="text-slate-900">{loginLog.sessionDuration || 'N/A'}</strong></div>
                </div>
              </Card>
            )}

            {/* Activity Specific Details */}
            {activityLog.action && (
              <Card title="Activity Audit Detail" subtitle="State change inspection">
                <div className="space-y-3 text-slate-800 text-xs">
                  <div>Actor: <strong>{activityLog.actorName} ({activityLog.actorRole})</strong></div>
                  <div>Action: <span className="font-bold font-mono text-purple-700">{activityLog.action}</span></div>
                  <div>Description: <p className="mt-1 p-2 bg-slate-50 border border-slate-200 rounded">{activityLog.description}</p></div>
                  {activityLog.previousValue && (
                    <JsonViewer title="Previous State (Before)" data={activityLog.previousValue} initiallyExpanded={false} />
                  )}
                  {activityLog.newValue && (
                    <JsonViewer title="New State (After)" data={activityLog.newValue} initiallyExpanded={true} />
                  )}
                </div>
              </Card>
            )}
          </div>
        )}

        {/* Tab 2: Timeline */}
        {activeTab === 'TIMELINE' && (
          <Card title="Trace Audit Log" subtitle="Chronological system lifecycle steps">
            <div className="space-y-4 relative pl-6 border-l-2 border-slate-200 py-2">
              <div className="relative">
                <div className="absolute -left-[31px] top-0.5 w-4 h-4 rounded-full bg-white border-2 border-[var(--primary)] flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-[var(--primary)]" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">Log Entry Generated</span>
                    <span className="text-[11px] font-mono text-slate-400">{formatDate(log.createdAt)}</span>
                  </div>
                  <p className="text-slate-600 mt-0.5">Recorded log ID {log.id} under trace ID {log.traceId}.</p>
                </div>
              </div>
            </div>
          </Card>
        )}
      </div>
    </Drawer>
  );
};
