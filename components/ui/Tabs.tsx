import React from 'react';
import { TabItem } from '@/types/common';
import { cn } from '@/utils/cn';

export interface TabsProps {
  items: TabItem[];
  activeTab: string;
  onChange: (tabId: string) => void;
  variant?: 'line' | 'pills';
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({
  items,
  activeTab,
  onChange,
  variant = 'line',
  className,
}) => {
  return (
    <div
      className={cn(
        'flex items-center gap-1 overflow-x-auto no-scrollbar',
        variant === 'line' ? 'border-b border-[var(--border)]' : 'p-1 bg-[var(--bg-secondary)] rounded-[var(--radius-md)]',
        className
      )}
      role="tablist"
    >
      {items.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            disabled={tab.disabled}
            onClick={() => onChange(tab.id)}
            className={cn(
              'inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold transition-all whitespace-nowrap select-none cursor-pointer',
              tab.disabled ? 'opacity-40 cursor-not-allowed' : '',
              variant === 'line'
                ? isActive
                  ? 'text-[var(--primary)] border-b-2 border-[var(--primary)] font-bold'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] border-b-2 border-transparent'
                : isActive
                ? 'bg-white text-[var(--text-primary)] shadow-xs rounded-[var(--radius-sm)] font-bold'
                : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] rounded-[var(--radius-sm)]'
            )}
          >
            {tab.icon && <span className="w-4 h-4 shrink-0">{tab.icon}</span>}
            <span>{tab.label}</span>
            {tab.badge !== undefined && (
              <span
                className={cn(
                  'px-1.5 py-0.2 rounded-full text-[10px] font-bold',
                  isActive
                    ? 'bg-[var(--primary-light)] text-[var(--primary)]'
                    : 'bg-slate-200 text-slate-600'
                )}
              >
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
