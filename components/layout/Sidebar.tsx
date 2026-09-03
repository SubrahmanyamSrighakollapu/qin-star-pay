'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronsLeft, ChevronsRight, Shield, LogOut } from 'lucide-react';
import { NAVIGATION_CONFIG, filterNavigationByRole } from '@/config/navigation';
import { UserContext } from '@/config/roles';
import { SidebarItem } from './SidebarItem';
import { ConfirmationDialog } from '@/components/ui/ConfirmationDialog';
import { useToast } from '@/components/ui/Toast';
import { cn } from '@/utils/cn';

export interface SidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  currentUser: UserContext;
  onNavigate?: () => void;
  className?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isCollapsed,
  onToggleCollapse,
  currentUser,
  onNavigate,
  className,
}) => {
  const navItems = filterNavigationByRole(NAVIGATION_CONFIG, currentUser);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const { toastSuccess } = useToast();

  const handleConfirmLogout = () => {
    setShowLogoutModal(false);
    toastSuccess('Signed out successfully.');
  };

  return (
    <aside
      className={cn(
        'bg-[var(--bg-sidebar)] text-white h-screen flex flex-col transition-all duration-200 z-40 border-r border-slate-800 shadow-lg shrink-0',
        isCollapsed ? 'w-[72px]' : 'w-[260px]',
        className
      )}
    >
      {/* Brand Header */}
      <div className="h-[64px] px-4 border-b border-slate-800 flex items-center justify-between shrink-0">
        <Link
          href="/dashboard"
          onClick={onNavigate}
          className="flex items-center gap-3 overflow-hidden select-none cursor-pointer"
        >
          <div className="w-9 h-9 rounded-lg bg-[var(--primary)] text-white font-bold flex items-center justify-center tracking-tighter shrink-0 shadow-md">
            QSP
          </div>

          {!isCollapsed && (
            <div className="flex flex-col truncate">
              <span className="font-extrabold text-sm tracking-wider text-white">
                QIN STAR PAY
              </span>
              <span className="text-[10px] text-slate-400 font-semibold tracking-wide uppercase">
                Operations Engine
              </span>
            </div>
          )}
        </Link>

        <button
          type="button"
          onClick={onToggleCollapse}
          className="hidden md:flex p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-md transition-colors cursor-pointer"
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? <ChevronsRight className="w-4 h-4" /> : <ChevronsLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1.5 no-scrollbar">
        {navItems.map((item) => (
          <SidebarItem
            key={item.id}
            item={item}
            isCollapsed={isCollapsed}
            onNavigate={onNavigate}
          />
        ))}
      </div>

      {/* Persistent Bottom User Profile & Status Panel */}
      <div className="p-3 border-t border-slate-800 bg-slate-950/60 shrink-0">
        <div className={cn('flex items-center gap-2.5', isCollapsed ? 'justify-center' : 'justify-between')}>
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-full bg-slate-800 text-slate-200 font-bold text-xs flex items-center justify-center shrink-0 border border-slate-700">
              <Shield className="w-4 h-4 text-[var(--primary)]" />
            </div>

            {!isCollapsed && (
              <div className="flex flex-col min-w-0 truncate">
                <span className="text-xs font-semibold text-slate-200 truncate">
                  {currentUser.name}
                </span>
                <span className="text-[10px] font-bold text-[var(--accent)] tracking-wider">
                  {currentUser.role}
                </span>
              </div>
            )}
          </div>

          {!isCollapsed && (
            <button
              type="button"
              onClick={() => setShowLogoutModal(true)}
              className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-md transition-colors cursor-pointer"
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
