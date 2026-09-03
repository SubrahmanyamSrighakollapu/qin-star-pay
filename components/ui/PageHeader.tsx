import React from 'react';
import { BreadcrumbItem } from '@/types/common';
import { Breadcrumb } from './Breadcrumb';
import { cn } from '@/utils/cn';

export interface PageHeaderProps {
  title: string;
  description?: string;
  breadcrumbs?: BreadcrumbItem[];
  actions?: React.ReactNode;
  statusBadge?: React.ReactNode;
  className?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  breadcrumbs,
  actions,
  statusBadge,
  className,
}) => {
  return (
    <div className={cn('flex flex-col gap-2 pb-5 border-b border-[var(--border)] mb-6', className)}>
      {breadcrumbs && breadcrumbs.length > 0 && (
        <Breadcrumb items={breadcrumbs} className="mb-1" />
      )}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl md:text-2xl font-bold text-[var(--text-primary)] tracking-tight">
              {title}
            </h1>
            {statusBadge && <div>{statusBadge}</div>}
          </div>
          {description && (
            <p className="text-xs md:text-sm text-[var(--text-muted)] mt-1 max-w-3xl leading-relaxed">
              {description}
            </p>
          )}
        </div>

        {actions && <div className="flex items-center gap-2.5 shrink-0">{actions}</div>}
      </div>
    </div>
  );
};
