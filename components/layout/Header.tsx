'use client';

import React, { useState } from 'react';
import { Menu, RefreshCw, Wallet, Search } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { walletService } from '@/services/walletService';
import { formatCurrency } from '@/utils/formatters';
import { getBreadcrumbsForPath } from '@/utils/breadcrumbs';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { UserContext, UserRole } from '@/config/roles';
import { NotificationMenu } from './NotificationMenu';
import { UserMenu } from './UserMenu';
import { Tooltip } from '@/components/ui/Tooltip';

export interface HeaderProps {
  onToggleSidebar: () => void;
  currentUser: UserContext;
  onRoleChange: (newRole: UserRole) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onToggleSidebar,
  currentUser,
  onRoleChange,
}) => {
  const pathname = usePathname();
  const [balance, setBalance] = useState<number | null>(9953681.66);
  const [isRefreshingBalance, setIsRefreshingBalance] = useState(false);

  const breadcrumbs = getBreadcrumbsForPath(pathname || '/dashboard');
  const currentPageTitle = breadcrumbs[breadcrumbs.length - 1]?.label || 'Dashboard';

  const handleRefreshBalance = async () => {
    setIsRefreshingBalance(true);
    try {
      const res = await walletService.getBalance();
      if (res.success && res.data) {
        setBalance(res.data.availableBalance);
      }
    } catch {
      // Fallback
    } finally {
      setTimeout(() => setIsRefreshingBalance(false), 300);
    }
  };

  return (
    <header className="h-[64px] bg-[var(--bg-header)] border-b border-[var(--border)] px-3 sm:px-4 md:px-6 flex items-center justify-between sticky top-0 z-30 shadow-xs">
      {/* Left Area: Sidebar/Drawer Toggle & Page Title / Breadcrumbs */}
      <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="p-2 text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] rounded-lg transition-colors cursor-pointer shrink-0"
          aria-label="Toggle Navigation Sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex flex-col min-w-0">
          <div className="hidden md:block">
            <Breadcrumb items={breadcrumbs} showHomeIcon={false} />
          </div>
          <h1 className="text-sm sm:text-base font-bold text-[var(--text-primary)] leading-tight tracking-tight truncate">
            {currentPageTitle}
          </h1>
        </div>
      </div>

      {/* Center Area: Global Search Input Foundation (Visible on Large Desktop XL >= 1280px) */}
      <div className="hidden xl:flex items-center flex-1 max-w-md mx-6">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)] pointer-events-none" />
          <input
            type="text"
            placeholder="Search transaction, UTR, merchant, retailer..."
            className="w-full h-[36px] pl-9 pr-4 bg-slate-100/70 border border-slate-200 rounded-[var(--radius-md)] text-xs text-[var(--text-primary)] placeholder:text-[var(--text-disabled)] transition-all focus:bg-white focus:outline-hidden focus:border-[var(--border-focus)] focus:ring-1 focus:ring-[var(--border-focus)]"
          />
        </div>
      </div>

      {/* Right Area: Balance Badge, Notifications & Profile */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Header Balance Metric (Visible on 2XL Desktop >= 1536px to prevent header compression on tablet) */}
        <div className="hidden 2xl:flex items-center gap-2 px-3 py-1.5 bg-blue-50/70 border border-blue-200/80 rounded-[var(--radius-md)] text-xs">
          <Wallet className="w-4 h-4 text-[var(--primary)] shrink-0" />
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-bold text-blue-950/70 leading-none">
              Available Balance
            </span>
            <span className="font-mono font-bold text-xs text-[var(--primary)] tabular-nums leading-tight">
              {formatCurrency(balance)}
            </span>
          </div>

          <Tooltip content="Refresh Balance">
            <button
              type="button"
              onClick={handleRefreshBalance}
              disabled={isRefreshingBalance}
              className="p-1 text-blue-700 hover:text-blue-900 rounded-xs transition-colors cursor-pointer ml-1"
              aria-label="Refresh balance"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshingBalance ? 'animate-spin' : ''}`} />
            </button>
          </Tooltip>
        </div>

        {/* Notifications Popover (High priority on tablet/mobile) */}
        <NotificationMenu />

        {/* Divider */}
        <div className="h-6 w-px bg-[var(--border)] hidden sm:block" />

        {/* User Menu Popover (High priority on tablet/mobile) */}
        <UserMenu currentUser={currentUser} onRoleChange={onRoleChange} />
      </div>
    </header>
  );
};
