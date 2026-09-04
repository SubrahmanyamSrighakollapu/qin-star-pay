'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Bell, AlertTriangle, CheckCircle2, Info, AlertOctagon } from 'lucide-react';
import { notificationService } from '@/services/notificationService';
import { Notification } from '@/types/domain';
import { formatDate } from '@/utils/formatters';

import { useAuth } from '@/context/AuthContext';

export const NotificationMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { session } = useAuth();

  const getNotificationBasePath = () => {
    if (session?.role === 'RETAILER') return '/retailer/notifications';
    if (session?.role === 'DISTRIBUTOR') return '/distributor/notifications';
    if (session?.role === 'MASTER_DISTRIBUTOR') return '/master-distributor/notifications';
    return '/admin/notifications';
  };

  const loadNotifications = () => {
    notificationService.getNotifications({}, 1, 5).then((res) => {
      if (res.success && res.data) {
        setNotifications(res.data.items);
        setUnreadCount(res.data.summary.unreadCount);
      }
    });
  };

  useEffect(() => {
    loadNotifications();
    const interval = setInterval(loadNotifications, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMarkAllRead = async () => {
    await notificationService.markAllAsRead();
    loadNotifications();
  };

  const handleNotificationClick = async (notif: Notification) => {
    if (notif.status === 'UNREAD') {
      await notificationService.markAsRead(notif.id);
    }
    setIsOpen(false);
    router.push(`${getNotificationBasePath()}?notification=${notif.id}`);
  };

  const getSeverityIcon = (severity: Notification['severity']) => {
    switch (severity) {
      case 'CRITICAL':
        return <AlertOctagon className="w-4 h-4 text-rose-600 shrink-0" />;
      case 'WARNING':
        return <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />;
      case 'SUCCESS':
        return <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />;
      case 'INFO':
      default:
        return <Info className="w-4 h-4 text-blue-600 shrink-0" />;
    }
  };

  return (
    <div ref={containerRef} className="relative inline-block text-left">
      <button
        type="button"
        onClick={() => {
          setIsOpen((prev) => !prev);
          loadNotifications();
        }}
        className="relative p-2 text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] rounded-lg transition-colors cursor-pointer"
        aria-label="View operational notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 min-w-[16px] h-4 px-1 bg-rose-600 text-white text-[10px] font-extrabold rounded-full ring-2 ring-white flex items-center justify-center">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-[var(--border)] rounded-[var(--radius-xl)] shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
          {/* Header */}
          <div className="px-4 py-3 bg-[var(--bg-secondary)] border-b border-[var(--border-subtle)] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-bold text-xs text-[var(--text-primary)] uppercase tracking-wider">
                Operational Alerts
              </span>
              {unreadCount > 0 && (
                <span className="px-1.5 py-0.2 bg-rose-100 text-rose-800 text-[10px] font-extrabold rounded-full">
                  {unreadCount} unread
                </span>
              )}
            </div>

            {unreadCount > 0 && (
              <button
                type="button"
                onClick={handleMarkAllRead}
                className="text-[11px] font-semibold text-[var(--primary)] hover:underline cursor-pointer"
              >
                Mark all read
              </button>
            )}
          </div>

          {/* Notification List */}
          <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 no-scrollbar">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-400">No operational alerts</div>
            ) : (
              notifications.map((n) => (
                <button
                  key={n.id}
                  onClick={() => handleNotificationClick(n)}
                  className={`w-full text-left p-3 flex items-start gap-3 hover:bg-slate-50 transition-colors cursor-pointer ${
                    n.status === 'UNREAD' ? 'bg-blue-50/40' : ''
                  }`}
                >
                  <div className="mt-0.5">{getSeverityIcon(n.severity)}</div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className={`text-xs truncate ${n.status === 'UNREAD' ? 'font-bold text-slate-900' : 'font-semibold text-slate-700'}`}>
                        {n.title}
                      </span>
                      {n.status === 'UNREAD' && <div className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />}
                    </div>

                    <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5 leading-snug">{n.message}</p>

                    <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1 font-mono">
                      <span>{n.relatedEntity || n.sourceModule}</span>
                      <span>{formatDate(n.createdAt)}</span>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>

          {/* Footer Action */}
          <div className="p-2.5 bg-slate-50 border-t border-slate-200 text-center">
            <Link
              href={getNotificationBasePath()}
              onClick={() => setIsOpen(false)}
              className="text-xs font-bold text-[var(--primary)] hover:underline block"
            >
              View All Operational Notifications →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};
