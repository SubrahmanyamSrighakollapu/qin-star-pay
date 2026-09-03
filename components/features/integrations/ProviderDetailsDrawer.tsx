'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Drawer } from '@/components/ui/Drawer';
import { Card } from '@/components/ui/Card';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Button } from '@/components/ui/Button';
import { Provider } from '@/types/domain';
import { formatDate } from '@/utils/formatters';
import { Copy, Check, Activity, ExternalLink, Clock, Power } from 'lucide-react';

export interface ProviderDetailsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  provider: Provider | null;
  onTestConnection?: (provider: Provider) => void;
  onToggleStatus?: (provider: Provider) => void;
}

export const ProviderDetailsDrawer: React.FC<ProviderDetailsDrawerProps> = ({
  isOpen,
  onClose,
  provider,
  onTestConnection,
  onToggleStatus,
}) => {
  const [isCopied, setIsCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'HEALTH_LOGS'>('OVERVIEW');

  if (!provider) return null;

  const handleCopyId = () => {
    navigator.clipboard.writeText(provider.id);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <Drawer isOpen={isOpen} onClose={onClose} title="Provider Operational View" size="xl" className="w-full md:w-[880px] md:max-w-[92vw]">
      <div className="space-y-6 text-xs">
        {/* Sticky Identity Header */}
        <div className="sticky top-0 z-20 flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 bg-white/95 backdrop-blur-xs border border-[var(--border)] rounded-[var(--radius-xl)] shadow-xs">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="font-mono font-extrabold text-base md:text-lg text-[var(--primary)]">
                {provider.name}
              </span>
              <StatusBadge status={provider.healthStatus} size="sm" />
              <StatusBadge status={provider.status} size="sm" />
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-800 border border-slate-200">
                {provider.environment}
              </span>
            </div>
            <div className="text-xs text-[var(--text-muted)] mt-0.5">
              Code: <strong className="font-mono">{provider.code}</strong> | Type: <strong>{provider.providerType}</strong> | Priority: <strong>P{provider.priority}</strong>
            </div>
          </div>

          <div className="flex items-center flex-wrap gap-2 shrink-0">
            <Button variant="outline" size="sm" onClick={handleCopyId} className="whitespace-nowrap">
              {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600 mr-1" /> : <Copy className="w-3.5 h-3.5 mr-1" />}
              {isCopied ? 'Copied' : 'Copy ID'}
            </Button>

            {onTestConnection && (
              <Button variant="outline" size="sm" onClick={() => onTestConnection(provider)} leftIcon={<Activity className="w-3.5 h-3.5 text-blue-600" />}>
                Test Connection
              </Button>
            )}

            {onToggleStatus && (
              <Button
                variant={provider.status === 'ACTIVE' ? 'outline' : 'primary'}
                size="sm"
                onClick={() => onToggleStatus(provider)}
                leftIcon={<Power className="w-3.5 h-3.5" />}
              >
                {provider.status === 'ACTIVE' ? 'Disable Provider' : 'Enable Provider'}
              </Button>
            )}
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-200 font-semibold">
          <button
            onClick={() => setActiveTab('OVERVIEW')}
            className={`pb-2.5 px-4 border-b-2 transition-colors ${
              activeTab === 'OVERVIEW'
                ? 'border-[var(--primary)] text-[var(--primary)] font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Overview & Performance
          </button>
          <button
            onClick={() => setActiveTab('HEALTH_LOGS')}
            className={`pb-2.5 px-4 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'HEALTH_LOGS'
                ? 'border-[var(--primary)] text-[var(--primary)] font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Health Check History</span>
          </button>
        </div>

        {/* Tab 1: Overview & Performance */}
        {activeTab === 'OVERVIEW' && (
          <div className="space-y-6">
            {/* Gateway Attributes Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Card title="API Endpoint & Authentication" subtitle="Technical connectivity settings">
                <div className="space-y-2 text-slate-700">
                  <div>Base URL: <strong className="font-mono text-slate-900 block truncate">{provider.baseUrl}</strong></div>
                  <div>Auth Type: <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-800 border border-slate-200">{provider.authType}</span></div>
                  <div>Gateway Timeout: <strong className="font-mono text-slate-900">{provider.timeout}ms</strong></div>
                  <div>Last Health Check: <span className="font-mono text-slate-500">{formatDate(provider.lastCheckedAt)}</span></div>
                </div>
              </Card>

              <Card title="Performance & Health Metrics" subtitle="Live availability telemetry">
                <div className="space-y-2 font-mono text-slate-700">
                  <div className="flex justify-between">
                    <span>Success Rate:</span>
                    <span className={`font-extrabold ${provider.successRate >= 98 ? 'text-emerald-700' : 'text-amber-700'}`}>
                      {provider.successRate}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Avg Latency:</span>
                    <span className="font-bold text-slate-900">{provider.avgResponseTime}ms</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Priority Ranking:</span>
                    <span className="font-bold text-purple-700">Priority {provider.priority}</span>
                  </div>
                </div>
              </Card>
            </div>

            {/* Supported Services & Modes */}
            <Card title="Capabilities & Transaction Modes" subtitle="Configured functional coverage">
              <div className="space-y-3">
                <div>
                  <span className="font-semibold text-slate-700 block mb-1">Supported Services:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {provider.supportedServices.map((svc) => (
                      <span key={svc} className="px-2.5 py-1 rounded text-xs font-mono font-bold bg-blue-50 text-blue-900 border border-blue-200">
                        {svc}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="font-semibold text-slate-700 block mb-1">Supported Payment Modes:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {provider.supportedModes.map((mode) => (
                      <span key={mode} className="px-2.5 py-1 rounded text-xs font-mono bg-purple-50 text-purple-900 border border-purple-200">
                        {mode}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Card>

            {/* Cross-Module Navigational Links */}
            <Card title="Cross-Module Operational Links" subtitle="Filtered logs & reports for this provider">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                <Link href="/reports/api-performance">
                  <div className="p-3 bg-white border border-slate-200 rounded-lg hover:border-[var(--primary)] transition-colors cursor-pointer space-y-1">
                    <span className="text-[11px] text-slate-400 font-semibold block">Performance Analytics</span>
                    <span className="text-xs font-bold text-blue-600 flex items-center gap-1">
                      <span>API Performance Report</span>
                      <ExternalLink className="w-3 h-3" />
                    </span>
                  </div>
                </Link>

                <Link href={`/transactions/all?searchQuery=${provider.name}`}>
                  <div className="p-3 bg-white border border-slate-200 rounded-lg hover:border-[var(--primary)] transition-colors cursor-pointer space-y-1">
                    <span className="text-[11px] text-slate-400 font-semibold block">Gateway Transactions</span>
                    <span className="text-xs font-bold text-blue-600 flex items-center gap-1">
                      <span>View Transactions</span>
                      <ExternalLink className="w-3 h-3" />
                    </span>
                  </div>
                </Link>

                <Link href="/integrations/webhooks">
                  <div className="p-3 bg-white border border-slate-200 rounded-lg hover:border-[var(--primary)] transition-colors cursor-pointer space-y-1">
                    <span className="text-[11px] text-slate-400 font-semibold block">Webhook Config</span>
                    <span className="text-xs font-bold text-blue-600 flex items-center gap-1">
                      <span>View Webhooks</span>
                      <ExternalLink className="w-3 h-3" />
                    </span>
                  </div>
                </Link>
              </div>
            </Card>
          </div>
        )}

        {/* Tab 2: Health Check History */}
        {activeTab === 'HEALTH_LOGS' && (
          <Card title="Health Check Telemetry Audit" subtitle="Simulated ping history">
            <div className="space-y-3 font-mono text-xs">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between">
                <div>
                  <div className="font-bold text-emerald-800">HTTP 200 OK — Ping Success</div>
                  <div className="text-[11px] text-slate-500">{formatDate(provider.lastCheckedAt)}</div>
                </div>
                <span className="font-bold text-slate-900">{provider.avgResponseTime}ms</span>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between">
                <div>
                  <div className="font-bold text-emerald-800">HTTP 200 OK — Scheduled Telemetry</div>
                  <div className="text-[11px] text-slate-500">03 Sep 2026 12:00 PM</div>
                </div>
                <span className="font-bold text-slate-900">{provider.avgResponseTime + 15}ms</span>
              </div>
            </div>
          </Card>
        )}
      </div>
    </Drawer>
  );
};
