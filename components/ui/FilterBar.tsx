import React from 'react';
import { Filter, RotateCcw } from 'lucide-react';
import { cn } from '@/utils/cn';
import { Button } from './Button';

export interface FilterBarProps {
  children?: React.ReactNode;
  searchSlot?: React.ReactNode;
  onReset?: () => void;
  activeFilterCount?: number;
  className?: string;
  title?: string;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  children,
  searchSlot,
  onReset,
  activeFilterCount = 0,
  className,
  title = 'Filters',
}) => {
  return (
    <div
      className={cn(
        'w-full p-4 bg-white border border-[var(--border)] rounded-[var(--radius-lg)] shadow-xs flex flex-col gap-4',
        className
      )}
    >
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {searchSlot && <div className="flex-1 max-w-md">{searchSlot}</div>}

        <div className="flex items-center justify-between sm:justify-end gap-2 shrink-0">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
            <Filter className="w-3.5 h-3.5 text-[var(--primary)]" />
            <span>{title}</span>
            {activeFilterCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-[var(--primary-light)] text-[var(--primary)] text-[11px] font-bold flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </div>

          {onReset && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onReset}
              leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
              className="text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)]"
            >
              Reset Filters
            </Button>
          )}
        </div>
      </div>

      {children && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 pt-3 border-t border-[var(--border-subtle)]">
          {children}
        </div>
      )}
    </div>
  );
};
