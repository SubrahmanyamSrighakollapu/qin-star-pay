import React from 'react';
import { cn } from '@/utils/cn';

export type SkeletonVariant = 'table' | 'card' | 'kpi' | 'text' | 'circle';

export interface LoadingSkeletonProps {
  variant?: SkeletonVariant;
  count?: number;
  height?: string;
  width?: string;
  className?: string;
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  variant = 'text',
  count = 1,
  height,
  width,
  className,
}) => {
  const items = Array.from({ length: count });

  if (variant === 'table') {
    return (
      <div className={cn('w-full border border-[var(--border)] rounded-[var(--radius-lg)] bg-white overflow-hidden', className)}>
        <div className="h-10 bg-slate-100 animate-pulse border-b border-[var(--border)]" />
        <div className="divide-y divide-[var(--border-subtle)]">
          {items.map((_, i) => (
            <div key={i} className="p-4 flex items-center justify-between gap-4 animate-pulse">
              <div className="h-4 bg-slate-200 rounded-xs w-1/4" />
              <div className="h-4 bg-slate-200 rounded-xs w-1/5" />
              <div className="h-4 bg-slate-200 rounded-xs w-1/6" />
              <div className="h-4 bg-slate-200 rounded-xs w-1/8" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (variant === 'kpi') {
    return (
      <div className={cn('grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4', className)}>
        {items.map((_, i) => (
          <div key={i} className="p-5 bg-white border border-[var(--border)] rounded-[var(--radius-lg)] shadow-xs animate-pulse">
            <div className="h-3 w-20 bg-slate-200 rounded-xs mb-3" />
            <div className="h-7 w-32 bg-slate-200 rounded-xs mb-2" />
            <div className="h-3 w-16 bg-slate-100 rounded-xs" />
          </div>
        ))}
      </div>
    );
  }

  if (variant === 'card') {
    return (
      <div className={cn('p-5 bg-white border border-[var(--border)] rounded-[var(--radius-lg)] animate-pulse space-y-3', className)}>
        <div className="h-4 bg-slate-200 rounded-xs w-1/3" />
        <div className="h-20 bg-slate-100 rounded-md" />
        <div className="h-3 bg-slate-200 rounded-xs w-1/2" />
      </div>
    );
  }

  if (variant === 'circle') {
    return (
      <div
        style={{ width: width || '40px', height: height || '40px' }}
        className={cn('rounded-full bg-slate-200 animate-pulse', className)}
      />
    );
  }

  return (
    <div className={cn('space-y-2', className)}>
      {items.map((_, i) => (
        <div
          key={i}
          style={{ width: width || '100%', height: height || '16px' }}
          className="bg-slate-200 rounded-xs animate-pulse"
        />
      ))}
    </div>
  );
};
