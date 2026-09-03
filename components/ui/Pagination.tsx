import React from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { cn } from '@/utils/cn';
import { Button } from './Button';

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems?: number;
  pageSize?: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  pageSizeOptions?: number[];
  className?: string;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  totalItems,
  pageSize = 10,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 25, 50, 100],
  className,
}) => {
  const safeTotalPages = Math.max(1, totalPages);
  const startItem = totalItems ? (currentPage - 1) * pageSize + 1 : 0;
  const endItem = totalItems ? Math.min(currentPage * pageSize, totalItems) : 0;

  return (
    <div
      className={cn(
        'w-full flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 bg-white border border-[var(--border)] rounded-[var(--radius-lg)] shadow-xs text-xs text-[var(--text-secondary)]',
        className
      )}
    >
      <div className="flex items-center gap-4">
        {totalItems !== undefined ? (
          <span className="tabular-nums font-medium">
            Showing <strong className="text-[var(--text-primary)]">{startItem}</strong> to{' '}
            <strong className="text-[var(--text-primary)]">{endItem}</strong> of{' '}
            <strong className="text-[var(--text-primary)]">{totalItems}</strong> entries
          </span>
        ) : (
          <span>
            Page <strong className="text-[var(--text-primary)]">{currentPage}</strong> of{' '}
            <strong className="text-[var(--text-primary)]">{safeTotalPages}</strong>
          </span>
        )}

        {onPageSizeChange && (
          <div className="flex items-center gap-2">
            <span className="text-[var(--text-muted)]">Per page:</span>
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              className="h-7 px-2 bg-slate-50 border border-[var(--border)] rounded-[var(--radius-sm)] text-xs text-[var(--text-primary)] focus:outline-hidden focus:border-[var(--border-focus)] cursor-pointer"
            >
              {pageSizeOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(1)}
          disabled={currentPage <= 1}
          aria-label="First page"
          className="h-8 w-8 p-0"
        >
          <ChevronsLeft className="w-4 h-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          aria-label="Previous page"
          className="h-8 w-8 p-0"
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>

        <span className="px-3 text-xs font-semibold tabular-nums">
          {currentPage} / {safeTotalPages}
        </span>

        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= safeTotalPages}
          aria-label="Next page"
          className="h-8 w-8 p-0"
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(safeTotalPages)}
          disabled={currentPage >= safeTotalPages}
          aria-label="Last page"
          className="h-8 w-8 p-0"
        >
          <ChevronsRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};
