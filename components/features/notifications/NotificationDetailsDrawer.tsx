import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Drawer } from '@/components/ui/Drawer';
import { Card } from '@/components/ui/Card';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Button } from '@/components/ui/Button';
import { Notification } from '@/types/domain';
import { notificationService } from '@/services/notificationService';
import { formatDate } from '@/utils/formatters';
import { Copy, Check, CheckCircle2, ExternalLink, Clock } from 'lucide-react';

export interface NotificationDetailsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  notification: Notification | null;
  onMarkRead?: (notification: Notification) => void;
}

export const NotificationDetailsDrawer: React.FC<NotificationDetailsDrawerProps> = ({
  isOpen,
  onClose,
  notification,
  onMarkRead,
}) => {
  const [isCopied, setIsCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'TIMELINE'>('OVERVIEW');
  const router = useRouter();

  if (!notification) return null;

  const handleCopyId = () => {
    navigator.clipboard.writeText(notification.id);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleOpenRelatedRecord = () => {
    const route = notificationService.getRelatedRecordRoute(notification);
    onClose();
    router.push(route);
  };

  const isUnread = notification.status === 'UNREAD';

  return (
    <Drawer isOpen={isOpen} onClose={onClose} title="Notification Details" size="xl" className="w-full md:w-[880px] md:max-w-[92vw]">
      <div className="space-y-6 text-xs">
        {/* Sticky Identity Header */}
        <div className="sticky top-0 z-20 flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 bg-white/95 backdrop-blur-xs border border-[var(--border)] rounded-[var(--radius-xl)] shadow-xs">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="font-mono font-extrabold text-base md:text-lg text-[var(--primary)]">
                {notification.id}
              </span>
              <StatusBadge status={notification.severity} size="sm" />
              <StatusBadge status={notification.status} size="sm" />
              {notification.actionRequired && (
                <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-amber-100 text-amber-900 border border-amber-300">
                  Action Required
                </span>
              )}
            </div>
            <div className="text-xs text-[var(--text-muted)] mt-0.5">
              Module: <strong>{notification.sourceModule}</strong> | Created: <strong>{formatDate(notification.createdAt)}</strong>
            </div>
          </div>

          <div className="flex items-center flex-wrap gap-2 shrink-0">
            <Button variant="outline" size="sm" onClick={handleCopyId} className="whitespace-nowrap">
              {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600 mr-1" /> : <Copy className="w-3.5 h-3.5 mr-1" />}
              {isCopied ? 'Copied' : 'Copy ID'}
            </Button>

            {isUnread && onMarkRead && (
              <Button variant="outline" size="sm" onClick={() => onMarkRead(notification)} leftIcon={<CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}>
                Mark as Read
              </Button>
            )}

            <Button variant="primary" size="sm" onClick={handleOpenRelatedRecord} leftIcon={<ExternalLink className="w-3.5 h-3.5" />}>
              Open Related Record
            </Button>
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
            Event Overview & Metadata
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
            <span>Notification Lifecycle</span>
          </button>
        </div>

        {/* Tab 1: Event Overview & Metadata */}
        {activeTab === 'OVERVIEW' && (
          <div className="space-y-6">
            {/* Main Event Card */}
            <Card title={notification.title} subtitle={`Category: ${notification.category} • Event: ${notification.type}`}>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-sans leading-relaxed text-sm">
                {notification.message}
              </div>
            </Card>

            {/* Related Operational Record */}
            <Card title="Related Operational Record" subtitle="Direct link to source module">
              <div className="p-4 bg-purple-50/50 border border-purple-200 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="font-bold text-sm text-slate-900">{notification.relatedEntity || 'System Entity'}</div>
                  <div className="text-xs text-purple-700 font-mono">
                    Entity ID: <strong>{notification.entityId || 'N/A'}</strong> ({notification.entityType || notification.category})
                  </div>
                </div>

                <Button variant="primary" size="sm" onClick={handleOpenRelatedRecord} leftIcon={<ExternalLink className="w-3.5 h-3.5" />}>
                  Navigate to {notification.sourceModule}
                </Button>
              </div>
            </Card>

            {/* Event Metadata Inspector */}
            {notification.metadata && Object.keys(notification.metadata).length > 0 && (
              <Card title="Event Metadata Inspector" subtitle="Structured event-specific details">
                <div className="p-3 bg-slate-900 text-slate-100 rounded-lg font-mono text-xs overflow-x-auto space-y-1.5">
                  {Object.entries(notification.metadata).map(([key, val]) => (
                    <div key={key} className="flex justify-between border-b border-slate-800 pb-1">
                      <span className="text-purple-400 capitalize">{key}:</span>
                      <span className="text-emerald-400 font-bold">{String(val)}</span>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Overview Details Grid */}
            <Card title="Notification Attributes" subtitle="System registry data">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-slate-700">
                <div>Source Module: <strong className="text-slate-900">{notification.sourceModule}</strong></div>
                <div>Category: <strong className="text-slate-900">{notification.category}</strong></div>
                <div>Severity: <strong className="text-slate-900">{notification.severity}</strong></div>
                <div>Created At: <span className="font-mono text-slate-900">{formatDate(notification.createdAt)}</span></div>
                <div>Read At: <span className="font-mono text-slate-900">{notification.readAt ? formatDate(notification.readAt) : 'Unread'}</span></div>
                <div>Action Required: <strong className="text-slate-900">{notification.actionRequired ? 'Yes' : 'No'}</strong></div>
              </div>
            </Card>
          </div>
        )}

        {/* Tab 2: Lifecycle Timeline */}
        {activeTab === 'TIMELINE' && (
          <Card title="Notification Lifecycle Audit" subtitle="Chronological system event log">
            <div className="space-y-4 relative pl-6 border-l-2 border-slate-200 py-2">
              <div className="relative">
                <div className="absolute -left-[31px] top-0.5 w-4 h-4 rounded-full bg-white border-2 border-[var(--primary)] flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-[var(--primary)]" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">Operational Event Occurred</span>
                    <span className="text-[11px] font-mono text-slate-400">{formatDate(notification.createdAt)}</span>
                  </div>
                  <div className="text-[11px] font-semibold text-purple-700">Source: {notification.sourceModule}</div>
                  <p className="text-slate-600 mt-0.5">{notification.title}</p>
                </div>
              </div>

              <div className="relative">
                <div className="absolute -left-[31px] top-0.5 w-4 h-4 rounded-full bg-white border-2 border-[var(--primary)] flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-[var(--primary)]" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">Notification Dispatched</span>
                    <span className="text-[11px] font-mono text-slate-400">{formatDate(notification.createdAt)}</span>
                  </div>
                  <p className="text-slate-600 mt-0.5">Alert record {notification.id} created and dispatched to operations center.</p>
                </div>
              </div>

              {notification.readAt ? (
                <div className="relative">
                  <div className="absolute -left-[31px] top-0.5 w-4 h-4 rounded-full bg-white border-2 border-emerald-600 flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-emerald-900">Marked as Read by Operator</span>
                      <span className="text-[11px] font-mono text-slate-400">{formatDate(notification.readAt)}</span>
                    </div>
                    <p className="text-slate-600 mt-0.5">Notification reviewed and status set to READ.</p>
                  </div>
                </div>
              ) : (
                <div className="relative">
                  <div className="absolute -left-[31px] top-0.5 w-4 h-4 rounded-full bg-white border-2 border-amber-500 flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-amber-900">Awaiting Operator Review</span>
                    </div>
                    <p className="text-slate-600 mt-0.5">Notification is currently UNREAD.</p>
                  </div>
                </div>
              )}
            </div>
          </Card>
        )}
      </div>
    </Drawer>
  );
};
