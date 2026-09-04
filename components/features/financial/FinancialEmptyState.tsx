'use client';

import React from 'react';
import { SearchX, FileQuestion, Inbox } from 'lucide-react';

interface FinancialEmptyStateProps {
  title?: string;
  description?: string;
  action?: React.ReactNode;
  icon?: React.ReactNode;
}

export const FinancialEmptyState: React.FC<FinancialEmptyStateProps> = ({
  title = 'No records found',
  description = 'Try adjusting your search criteria or filter parameters.',
  action,
  icon,
}) => {
  return (
    <div className="py-12 px-4 text-center space-y-3 max-w-sm mx-auto animate-fadeIn">
      <div className="w-12 h-12 rounded-2xl bg-slate-100 border border-slate-200/80 text-slate-400 flex items-center justify-center mx-auto">
        {icon || <SearchX className="w-6 h-6" />}
      </div>
      <div className="space-y-1">
        <h3 className="text-sm font-bold text-slate-800">{title}</h3>
        <p className="text-xs text-slate-500 leading-relaxed">{description}</p>
      </div>
      {action && <div className="pt-2">{action}</div>}
    </div>
  );
};
