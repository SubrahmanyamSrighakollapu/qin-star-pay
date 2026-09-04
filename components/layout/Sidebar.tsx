'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronsLeft, ChevronsRight, Shield, LogOut } from 'lucide-react';
import { filterNavigationByRole, getNavigationForRole, NavigationItem } from '@/config/navigation';
import { UserContext } from '@/config/roles';
import { SidebarItem } from './SidebarItem';
import { ConfirmationDialog } from '@/components/ui/ConfirmationDialog';
import { useToast } from '@/components/ui/Toast';
import { cn } from '@/utils/cn';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export interface SidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  currentUser: UserContext;
  onNavigate?: () => void;
  className?: string;
}

function getCategoryForNavItem(id: string): string | null {
  if (id === 'dashboard' || id === 'md-dashboard' || id === 'dst-dashboard' || id === 'ret-dashboard') return 'MAIN';
  if (id === 'network-management' || id === 'transactions' || id === 'users' || id === 'kyc' || id === 'ret-payin' || id === 'ret-payout' || id === 'md-distributors' || id === 'dst-retailers') return 'OPERATIONS';
  if (id === 'wallet' || id === 'settlements' || id === 'reports' || id === 'chargebacks' || id === 'invoices' || id === 'md-wallet' || id === 'dst-wallet' || id === 'ret-wallet' || id === 'md-commissions' || id === 'dst-commissions' || id === 'ret-commissions') return 'FINANCE';
  if (id === 'integrations' || id === 'logs' || id === 'administration') return 'SYSTEM';
  if (id === 'notifications' || id === 'dst-notifications' || id === 'ret-notifications' || id === 'dst-profile' || id === 'ret-profile') return 'ACCOUNT';
  return null;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isCollapsed,
  onToggleCollapse,
  currentUser,
  onNavigate,
  className,
}) => {
  const router = useRouter();
  const { logout } = useAuth();

  const baseNav = getNavigationForRole(currentUser.role);
  const navItems = filterNavigationByRole(baseNav, currentUser);

  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const { toastSuccess } = useToast();

  const handleConfirmLogout = () => {
    setShowLogoutModal(false);
    logout();
    toastSuccess('Signed out successfully.');
    router.push('/login');
  };

  // Group nav items with category headers
  let lastCategory: string | null = null;

  return (
    <aside
      className={cn(
        'bg-white text-slate-800 h-screen flex flex-col transition-all duration-200 z-40 border-r border-slate-200/80 shadow-xs shrink-0 overflow-hidden select-none',
        isCollapsed ? 'w-[72px]' : 'w-[260px]',
        className
      )}
    >
      {/* Brand Header with Official Logo Asset */}
      <div className="h-[64px] px-3.5 border-b border-slate-200/80 flex items-center justify-between shrink-0 bg-white">
        <Link
          href="/dashboard"
          onClick={onNavigate}
          className={cn(
            'flex items-center gap-2.5 overflow-hidden cursor-pointer group',
            isCollapsed ? 'mx-auto justify-center' : ''
          )}
        >
          <div className="w-10 h-10 rounded-lg bg-blue-50/80 p-1 flex items-center justify-center shrink-0 shadow-2xs border border-blue-100 group-hover:border-[var(--primary-200)] transition-colors">
            <Image
              src="/logo.jpeg"
              alt="Qin Star Pay Logo"
              width={32}
              height={32}
              className="object-contain rounded-xs"
              priority
            />
          </div>

          {!isCollapsed && (
            <div className="flex flex-col truncate">
              <span className="font-extrabold text-sm tracking-wider text-slate-900 leading-tight">
                QIN STAR PAY
              </span>
              <span className="text-[10px] text-[var(--secondary)] font-extrabold tracking-widest uppercase">
                Fintech Workspace
              </span>
            </div>
          )}
        </Link>

        {!isCollapsed && (
          <button
            type="button"
            onClick={onToggleCollapse}
            className="hidden md:flex p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100/80 rounded-md transition-colors cursor-pointer"
            aria-label="Collapse sidebar"
          >
            <ChevronsLeft className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Expand Button for Collapsed Mode */}
      {isCollapsed && (
        <div className="hidden md:flex justify-center py-2 border-b border-slate-100 bg-slate-50/50">
          <button
            type="button"
            onClick={onToggleCollapse}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
            aria-label="Expand sidebar"
          >
            <ChevronsRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Navigation List with Optional Subtle Category Headings */}
      <div className="flex-1 overflow-y-auto px-2.5 py-3 space-y-1 no-scrollbar">
        {navItems.map((item: NavigationItem, index: number) => {
          const category = getCategoryForNavItem(item.id);
          const prevCategory = index > 0 ? getCategoryForNavItem(navItems[index - 1].id) : null;
          const showCategoryHeader = !isCollapsed && category && category !== prevCategory;

          return (
            <React.Fragment key={item.id}>
              {showCategoryHeader && (
                <div className="px-3 pt-3.5 pb-1 text-[10px] font-extrabold tracking-widest text-slate-400 uppercase select-none">
                  {category}
                </div>
              )}
              <SidebarItem
                item={item}
                isCollapsed={isCollapsed}
                onNavigate={onNavigate}
              />
            </React.Fragment>
          );
        })}
      </div>

      {/* Section 8: Support Card & App Version */}
      {!isCollapsed && (
        <div className="px-3 py-2 shrink-0">
          <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-100/90 text-xs space-y-1">
            <div className="flex items-center gap-1.5 font-extrabold text-[var(--primary)]">
              <span>🎧 Need Help?</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-tight">
              Contact Operations Support for immediate assistance.
            </p>
            <button
              type="button"
              onClick={() => toastSuccess('Contact Support: support@qinstarpay.com | Helpline: 1800-103-STAR')}
              className="mt-1 text-[11px] font-bold text-[var(--primary)] hover:underline cursor-pointer flex items-center gap-1"
            >
              Contact Support →
            </button>
          </div>
          <div className="mt-2 text-center text-[10px] font-mono font-semibold text-slate-400">
            Qin Star Pay v1.0.0
          </div>
        </div>
      )}

      {/* Persistent Bottom User Profile & Status Panel */}
      <div className="p-3 border-t border-slate-200/80 bg-slate-50/70 shrink-0">
        <div className={cn('flex items-center gap-2.5', isCollapsed ? 'justify-center' : 'justify-between')}>
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-full bg-blue-50 text-[var(--primary)] font-bold text-xs flex items-center justify-center shrink-0 border border-blue-100">
              <Shield className="w-4 h-4 text-[var(--primary)]" />
            </div>

            {!isCollapsed && (
              <div className="flex flex-col min-w-0 truncate">
                <span className="text-xs font-semibold text-slate-800 truncate leading-tight">
                  {currentUser.name}
                </span>
                <span className="text-[10px] font-extrabold text-[var(--secondary)] tracking-wider">
                  {currentUser.role}
                </span>
              </div>
            )}
          </div>

          {!isCollapsed && (
            <button
              type="button"
              onClick={() => setShowLogoutModal(true)}
              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors cursor-pointer"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      <ConfirmationDialog
        isOpen={showLogoutModal}
        onConfirm={handleConfirmLogout}
        onCancel={() => setShowLogoutModal(false)}
        title="Sign Out of Qin Star Pay?"
        message="Are you sure you want to sign out of your session? Unsaved changes will be discarded."
        confirmText="Sign Out"
        cancelText="Cancel"
        variant="warning"
      />
    </aside>
  );
};
