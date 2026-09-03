import React from 'react';
import { Inbox } from 'lucide-react';
import { cn } from '@/utils/cn';

export interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No Data Found',
  description = 'There are no records available at the moment.',
  icon,
  action,
  className,
}) => {
  return (
    <div
      className={cn(
        'w-full py-12 px-6 flex flex-col items-center justify-center text-center bg-white border border-[var(--border)] rounded-[var(--radius-lg)] shadow-xs',
        className
      )}
    >
      <div className="w-12 h-12 rounded-full bg-[var(--bg-secondary)] text-[var(--text-muted)] flex items-center justify-center mb-3">
        {icon || <Inbox className="w-6 h-6 stroke-[1.5]" />}
      </div>

      <h4 className="text-base font-semibold text-[var(--text-primary)] mb-1">{title}</h4>
      {description && (
        <p className="text-xs text-[var(--text-muted)] max-w-md leading-relaxed mb-4">
          {description}
        </p>
      )}

      {action && <div className="mt-1">{action}</div>}
    </div>
  );
};
