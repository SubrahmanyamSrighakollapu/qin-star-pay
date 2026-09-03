import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { cn } from '@/utils/cn';
import { Button } from './Button';

export interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
  actionText?: string;
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Failed to load data',
  description = 'An unexpected error occurred while communicating with backend services.',
  onRetry,
  actionText = 'Retry Request',
  className,
}) => {
  return (
    <div
      className={cn(
        'w-full py-10 px-6 flex flex-col items-center justify-center text-center bg-rose-50/50 border border-[var(--danger-border)] rounded-[var(--radius-lg)]',
        className
      )}
    >
      <div className="w-11 h-11 rounded-full bg-[var(--danger-light)] text-[var(--danger)] flex items-center justify-center mb-3">
        <AlertCircle className="w-6 h-6" />
      </div>

      <h4 className="text-base font-semibold text-rose-900 mb-1">{title}</h4>
      <p className="text-xs text-rose-700 max-w-md leading-relaxed mb-4">{description}</p>

      {onRetry && (
        <Button
          variant="danger"
          size="sm"
          onClick={onRetry}
          leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
        >
          {actionText}
        </Button>
      )}
    </div>
  );
};
