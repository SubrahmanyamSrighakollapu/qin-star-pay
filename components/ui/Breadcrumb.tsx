import React from 'react';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import { BreadcrumbItem } from '@/types/common';
import { cn } from '@/utils/cn';

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
  showHomeIcon?: boolean;
  className?: string;
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({
  items,
  showHomeIcon = true,
  className,
}) => {
  return (
    <nav aria-label="Breadcrumb" className={cn('flex items-center text-xs text-[var(--text-muted)]', className)}>
      <ol className="flex items-center gap-1.5 flex-wrap">
        {showHomeIcon && (
          <li className="flex items-center gap-1.5">
            <Link
              href="/"
              className="hover:text-[var(--primary)] transition-colors flex items-center"
              aria-label="Home"
            >
              <Home className="w-3.5 h-3.5" />
            </Link>
            {items.length > 0 && <ChevronRight className="w-3 h-3 text-[var(--border-strong)]" />}
          </li>
        )}

        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={index} className="flex items-center gap-1.5">
              {item.href && !isLast ? (
                <Link href={item.href} className="hover:text-[var(--primary)] transition-colors">
                  {item.label}
                </Link>
              ) : (
                <span className={cn('font-semibold', isLast ? 'text-[var(--text-primary)]' : '')}>
                  {item.label}
                </span>
              )}

              {!isLast && <ChevronRight className="w-3 h-3 text-[var(--border-strong)]" />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
