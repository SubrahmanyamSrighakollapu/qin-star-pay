import React, { useState, useEffect, useRef } from 'react';
import { Menu, RefreshCw, Wallet, Search, Eye, ChevronDown, Check, X } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { walletService } from '@/services/walletService';
import { formatCurrency } from '@/utils/formatters';
import { getBreadcrumbsForPath } from '@/utils/breadcrumbs';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { UserContext, UserRole } from '@/config/roles';
import { NotificationMenu } from './NotificationMenu';
import { UserMenu } from './UserMenu';
import { Tooltip } from '@/components/ui/Tooltip';
import { useAuth } from '@/context/AuthContext';

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
  const { session, previewRole, setPreviewRole } = useAuth();
  const [balance, setBalance] = useState<number | null>(9953681.66);
  const [isRefreshingBalance, setIsRefreshingBalance] = useState(false);
  const [isPortalMenuOpen, setIsPortalMenuOpen] = useState(false);
  const portalMenuRef = useRef<HTMLDivElement>(null);

  const breadcrumbs = getBreadcrumbsForPath(pathname || '/dashboard');
  const currentPageTitle = breadcrumbs[breadcrumbs.length - 1]?.label || 'Dashboard';

  const isAdmin = session?.role === 'ADMIN' || session?.role === 'SUPER_ADMIN';

  const loadBalance = async () => {
    try {
      if (session?.role === 'RETAILER' && session.entityId) {
        const res = await walletService.getRetailerWallet(session.entityId);
        if (res.success && res.data) {
          setBalance(res.data.availableBalance);
          return;
        }
      } else if (session?.role === 'DISTRIBUTOR' && session.entityId) {
        const res = await walletService.getDistributorWallet(session.entityId);
        if (res.success && res.data) {
          setBalance(res.data.availableBalance);
          return;
        }
      } else if (session?.role === 'MASTER_DISTRIBUTOR' && session.entityId) {
        const res = await walletService.getMasterDistributorWallet(session.entityId);
        if (res.success && res.data) {
          setBalance(res.data.availableBalance);
          return;
        }
      }
      const res = await walletService.getBalance();
      if (res.success && res.data) {
        setBalance(res.data.availableBalance);
      }
    } catch {
      // Fallback
    }
  };

  useEffect(() => {
    loadBalance();
  }, [session]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (portalMenuRef.current && !portalMenuRef.current.contains(event.target as Node)) {
        setIsPortalMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleRefreshBalance = async () => {
    setIsRefreshingBalance(true);
    await loadBalance();
    setTimeout(() => setIsRefreshingBalance(false), 300);
  };

  return (
    <header className="h-[64px] bg-white/95 backdrop-blur-sm border-b border-[#E8EDF3] px-3 sm:px-4 md:px-6 flex items-center justify-between sticky top-0 z-30 shadow-2xs">
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

      {/* Center Area: Hidden placeholder global search removed as per UI Phase 1.1 rules */}

      {/* Right Area: Admin Role Preview Switcher, Wallet Indicator, Notifications & Profile */}
      <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
        {/* Admin Portal Preview Switcher & Banner */}
        {isAdmin && (
          <div ref={portalMenuRef} className="relative hidden md:block">
            <button
              type="button"
              onClick={() => setIsPortalMenuOpen((prev) => !prev)}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-[var(--radius-md)] text-xs font-medium border transition-all cursor-pointer ${
                previewRole
                  ? 'bg-amber-50 text-amber-900 border-amber-300 font-semibold'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <Eye className="w-3.5 h-3.5 text-[var(--primary)] shrink-0" />
              <span>Viewing as: <strong className="font-semibold">{previewRole || 'Admin'}</strong></span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {isPortalMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white border border-[var(--border)] rounded-[var(--radius-xl)] shadow-popover z-50 py-1 text-xs">
                <div className="px-3 py-1.5 font-bold text-[10px] uppercase tracking-wider text-slate-400 border-b border-slate-100">
                  Switch Portal View
                </div>
                {[
                  { label: 'Admin Portal (Full Access)', role: null },
                  { label: 'Master Distributor Portal', role: 'MASTER_DISTRIBUTOR' as UserRole },
                  { label: 'Distributor Portal', role: 'DISTRIBUTOR' as UserRole },
                  { label: 'Retailer Portal', role: 'RETAILER' as UserRole },
                ].map((item) => {
                  const isSelected = previewRole === item.role || (!previewRole && item.role === null);
                  return (
                    <button
                      key={item.label}
                      type="button"
                      onClick={() => {
                        onRoleChange(item.role || 'ADMIN');
                        setPreviewRole(item.role);
                        setIsPortalMenuOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer ${
                        isSelected ? 'font-bold text-[var(--primary)] bg-blue-50/50' : 'text-slate-700'
                      }`}
                    >
                      <span>{item.label}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-[var(--primary)]" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Active Portal Preview Banner */}
        {previewRole && (
          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 bg-amber-500/10 border border-amber-300/80 rounded-[var(--radius-md)] text-xs font-semibold text-amber-900 animate-in fade-in duration-150">
            <Eye className="w-3.5 h-3.5 text-amber-700 shrink-0" />
            <span>Previewing {previewRole}</span>
            <button
              type="button"
              onClick={() => {
                onRoleChange('ADMIN');
                setPreviewRole(null);
              }}
              className="ml-1 p-0.5 text-amber-900 hover:text-rose-700 font-bold cursor-pointer"
              title="Exit Preview"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Wallet Balance Indicator — STRICTLY for Wallet Roles (Retailer, Distributor, Master Distributor) */}
        {(previewRole === 'RETAILER' || previewRole === 'DISTRIBUTOR' || previewRole === 'MASTER_DISTRIBUTOR' ||
          (!previewRole && (session?.role === 'RETAILER' || session?.role === 'DISTRIBUTOR' || session?.role === 'MASTER_DISTRIBUTOR'))) && (
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-blue-50/70 border border-blue-200/80 rounded-[var(--radius-md)] text-xs">
            <Wallet className="w-4 h-4 text-[var(--primary)] shrink-0" />
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-bold text-slate-500 leading-none">
                Wallet Balance
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
        )}

        {/* Notifications Popover */}
        <NotificationMenu />

        {/* User Menu Popover */}
        <UserMenu currentUser={currentUser} onRoleChange={onRoleChange} />
      </div>
    </header>
  );
};
