import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { cn } from '@/utils/cn';

export interface KPITrend {
  value: string | number;
  isPositive?: boolean;
  label?: string;
}

export interface KPICardProps {
  title: string;
  value: React.ReactNode;
  subtitle?: string;
  trend?: KPITrend;
  icon?: React.ReactNode;
  badge?: React.ReactNode;
  isLoading?: boolean;
  className?: string;
  accentColor?: 'blue' | 'gold' | 'green' | 'red' | 'purple' | 'slate';
}

const accentStyles = {
  blue: 'text-[var(--primary)] bg-[var(--primary-light)]',
  gold: 'text-[var(--accent-hover)] bg-[var(--accent-light)]',
  green: 'text-[var(--success)] bg-[var(--success-light)]',
  red: 'text-[var(--danger)] bg-[var(--danger-light)]',
  purple: 'text-purple-600 bg-purple-50',
  slate: 'text-slate-600 bg-slate-100',
};

export const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  subtitle,
  trend,
  icon,
  badge,
  isLoading = false,
  className,
  accentColor = 'blue',
}) => {
  if (isLoading) {
    return (
      <div className={cn('p-5 bg-white border border-[var(--border)] rounded-[var(--radius-lg)] shadow-xs animate-pulse', className)}>
        <div className="flex items-center justify-between">
          <div className="h-3.5 w-24 bg-slate-200 rounded-xs" />
          <div className="w-9 h-9 bg-slate-100 rounded-lg" />
        </div>
        <div className="h-7 w-36 bg-slate-200 rounded-xs mt-3 mb-2" />
        <div className="h-3 w-20 bg-slate-100 rounded-xs" />
      </div>
    );
  }

  return (
    <div className={cn('p-5 bg-white border border-[var(--border)] rounded-[var(--radius-lg)] shadow-xs flex flex-col justify-between transition-all duration-200 hover:border-slate-300', className)}>
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
          {title}
        </span>
        {icon && (
          <div className={cn('w-9 h-9 rounded-lg flex items-center justify-center shrink-0', accentStyles[accentColor])}>
            {icon}
          </div>
        )}
      </div>

      <div className="my-2 flex items-baseline justify-between gap-2">
        <div className="text-2xl font-bold text-[var(--text-primary)] tracking-tight tabular-nums">
          {value}
        </div>
        {badge && <div>{badge}</div>}
      </div>

      <div className="flex items-center justify-between text-xs text-[var(--text-muted)]">
        {trend && (
          <div className="flex items-center gap-1 font-medium">
            <span
              className={cn(
                'inline-flex items-center text-xs font-semibold px-1.5 py-0.5 rounded-sm',
                trend.isPositive
                  ? 'text-emerald-700 bg-emerald-50'
                  : 'text-rose-700 bg-rose-50'
              )}
            >
              {trend.isPositive ? (
                <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
              ) : (
                <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" />
              )}
              {trend.value}
            </span>
            {trend.label && <span className="text-[var(--text-muted)]">{trend.label}</span>}
          </div>
        )}

        {subtitle && !trend && <span>{subtitle}</span>}
      </div>
    </div>
  );
};
