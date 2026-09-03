'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { NavigationItem } from '@/config/navigation';
import { IconRenderer } from './IconRenderer';
import { cn } from '@/utils/cn';

export interface SidebarItemProps {
  item: NavigationItem;
  isCollapsed: boolean;
  onNavigate?: () => void;
}

export const SidebarItem: React.FC<SidebarItemProps> = ({
  item,
  isCollapsed,
  onNavigate,
}) => {
  const pathname = usePathname();
  const hasChildren = item.children && item.children.length > 0;

  // Check if item or any of its children match current route
  const isChildActive = (child: NavigationItem) => {
    if (!child.path) return false;
    if (child.path === '/invoices') {
      return pathname === '/invoices' || pathname === '/invoices/list';
    }
    return pathname === child.path || pathname.startsWith(`${child.path}/`);
  };

  const isParentActive = !!(hasChildren && item.children?.some(isChildActive));
  const isDirectActive = item.path ? pathname === item.path || (item.path !== '/dashboard' && pathname.startsWith(`${item.path}/`)) : false;
  const isActive = isDirectActive || isParentActive;

  // Declarative accordion state: defaults to true if parent is active
  const [userToggled, setUserToggled] = useState<boolean | null>(null);
  const isOpen = userToggled !== null ? userToggled : isParentActive;
  const [showPopover, setShowPopover] = useState(false);

  const handleParentClick = () => {
    if (!isCollapsed) {
      setUserToggled(!isOpen);
    }
  };

  // Handle single item click
  if (!hasChildren && item.path) {
    return (
      <div className="relative group">
        <Link
          href={item.path}
          onClick={onNavigate}
          className={cn(
            'flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-medium transition-all duration-150 select-none cursor-pointer',
            isActive
              ? 'bg-[var(--primary)] text-white font-bold shadow-xs'
              : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
          )}
        >
          <IconRenderer name={item.iconName} className="w-4 h-4 shrink-0" />
          {!isCollapsed && <span className="truncate">{item.label}</span>}
          {item.badge && !isCollapsed && (
            <span className="ml-auto px-1.5 py-0.2 bg-blue-500/30 text-blue-200 text-[10px] font-bold rounded-full">
              {item.badge}
            </span>
          )}
        </Link>

        {/* Collapsed Tooltip */}
        {isCollapsed && (
          <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2.5 py-1 bg-slate-900 text-white text-xs font-semibold rounded-md shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity z-50 whitespace-nowrap border border-slate-700">
            {item.label}
          </div>
        )}
      </div>
    );
  }

  // Parent Item with Accordion Submenu
  return (
    <div className="relative">
      <div
        className="relative"
        onMouseEnter={() => isCollapsed && setShowPopover(true)}
        onMouseLeave={() => isCollapsed && setShowPopover(false)}
      >
        <button
          type="button"
          onClick={handleParentClick}
          className={cn(
            'w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-medium transition-all duration-150 select-none cursor-pointer text-left',
            isActive
              ? 'bg-slate-800/90 text-white font-semibold border-l-2 border-[var(--primary)]'
              : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
          )}
        >
          <div className="flex items-center gap-3">
            <IconRenderer name={item.iconName} className="w-4 h-4 shrink-0 text-slate-400" />
            {!isCollapsed && <span className="truncate">{item.label}</span>}
          </div>

          {!isCollapsed && (
            <div className="shrink-0 text-slate-400">
              {isOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
            </div>
          )}
        </button>

        {/* Collapsed Hover Submenu Popover */}
        {isCollapsed && showPopover && (
          <div className="absolute left-full top-0 ml-2 w-52 bg-slate-900 border border-slate-700 rounded-lg shadow-xl py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
            <div className="px-3 py-1 text-[11px] font-bold text-slate-400 uppercase border-b border-slate-800 mb-1">
              {item.label}
            </div>
            {item.children?.map((child) => {
              const isChildItemActive = isChildActive(child);
              return (
                <Link
                  key={child.id}
                  href={child.path || '#'}
                  onClick={onNavigate}
                  className={cn(
                    'block px-3 py-1.5 text-xs transition-colors',
                    isChildItemActive
                      ? 'text-white font-bold bg-[var(--primary)]'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  )}
                >
                  {child.label}
                </Link>
              );
            })}
          </div>
        )}
      </div>

      {/* Expanded Accordion Submenu */}
      {!isCollapsed && isOpen && (
        <div className="mt-1 ml-4 pl-3 border-l border-slate-800 space-y-1">
          {item.children?.map((child) => {
            const isChildItemActive = isChildActive(child);
            return (
              <Link
                key={child.id}
                href={child.path || '#'}
                onClick={onNavigate}
                className={cn(
                  'block px-3 py-2 rounded-md text-xs transition-colors select-none cursor-pointer',
                  isChildItemActive
                    ? 'bg-[var(--primary)]/90 text-white font-bold shadow-xs'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/40'
                )}
              >
                {child.label}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};
