import React, { ReactNode } from 'react';
import { ColumnDefinition } from '@/types/common';
import { cn } from '@/utils/cn';
import { LoadingSkeleton } from './LoadingSkeleton';
import { EmptyState } from './EmptyState';

export interface TableProps<T> {
  columns: ColumnDefinition<T>[];
  data: T[];
  keyExtractor: (row: T, index: number) => string | number;
  isLoading?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  onRowClick?: (row: T) => void;
  className?: string;
  actionHeader?: ReactNode;
  renderActions?: (row: T) => ReactNode;
}

export function Table<T>({
  columns,
  data,
  keyExtractor,
  isLoading = false,
  emptyTitle = 'No data available',
  emptyDescription = 'There are no records matching the current query.',
  onRowClick,
  className,
  actionHeader = 'Actions',
  renderActions,
}: TableProps<T>) {
  if (isLoading) {
    return <LoadingSkeleton variant="table" count={5} />;
  }

  if (!data || data.length === 0) {
    return <EmptyState title={emptyTitle} description={emptyDescription} className="my-4" />;
  }

  return (
    <div className={cn('w-full overflow-x-auto border border-[var(--border)] rounded-[var(--radius-lg)] bg-white shadow-xs', className)}>
      <table className="w-full text-left border-collapse text-sm">
        <thead>
          <tr className="bg-[var(--bg-secondary)] border-b border-[var(--border)] text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider">
            {columns.map((col) => (
              <th
                key={col.key}
                style={{ width: col.width }}
                className={cn(
                  'px-4 py-3 font-semibold select-none',
                  col.align === 'center'
                    ? 'text-center'
                    : col.align === 'right'
                    ? 'text-right'
                    : 'text-left'
                )}
              >
                {col.header}
              </th>
            ))}
            {renderActions && (
              <th className="px-4 py-3 text-right font-semibold select-none">{actionHeader}</th>
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--border-subtle)] text-[var(--text-primary)]">
          {data.map((row, index) => {
            const key = keyExtractor(row, index);
            return (
              <tr
                key={key}
                onClick={() => onRowClick && onRowClick(row)}
                className={cn(
                  'transition-colors hover:bg-slate-50/80',
                  onRowClick ? 'cursor-pointer' : ''
                )}
              >
                {columns.map((col) => {
                  const cellValue = (row as Record<string, unknown>)[col.key];
                  return (
                    <td
                      key={col.key}
                      className={cn(
                        'px-4 py-3.5 align-middle text-xs font-normal tabular-nums',
                        col.align === 'center'
                          ? 'text-center'
                          : col.align === 'right'
                          ? 'text-right'
                          : 'text-left'
                      )}
                    >
                      {col.render ? col.render(row, index) : (cellValue as ReactNode) ?? '-'}
                    </td>
                  );
                })}
                {renderActions && (
                  <td className="px-4 py-3 text-right align-middle shrink-0">
                    <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                      {renderActions(row)}
                    </div>
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
