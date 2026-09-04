import React from 'react';
import { RefreshCw, Shield, Clock } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { formatDate, formatDateTime } from '@/utils/formatters';


export interface MasterDistributorHeaderProps {
  name: string;
  code: string;
  businessName: string;
  lastRefreshedAt: string;
  onRefresh: () => void;
  isLoading?: boolean;
}

export const MasterDistributorHeader: React.FC<MasterDistributorHeaderProps> = ({
  name,
  code,
  businessName,
  lastRefreshedAt,
  onRefresh,
  isLoading = false,
}) => {
  return (
    <div className="bg-white border border-[var(--border)] rounded-[var(--radius-xl)] p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div className="flex items-start gap-3.5">
        <div className="w-11 h-11 rounded-xl bg-purple-700 text-white font-extrabold flex items-center justify-center text-sm shadow-md shrink-0 mt-0.5">
          MD
        </div>
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-xl font-extrabold text-[var(--text-primary)] tracking-tight">
              Welcome back, {name}
            </h1>
            <StatusBadge status="ACTIVE" label="Network Portal Active" size="sm" />
          </div>
          <p className="text-xs text-[var(--text-muted)] flex items-center gap-2">
            <span className="font-semibold text-slate-700">{businessName}</span>
            <span>•</span>
            <span className="font-mono text-purple-700 font-bold bg-purple-50 px-1.5 py-0.5 rounded-md border border-purple-200">
              {code}
            </span>
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between md:justify-end gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
        <div className="flex items-center gap-1.5 text-xs text-[var(--text-muted)] font-mono">
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          <span>Refreshed: {formatDateTime(lastRefreshedAt)}</span>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={onRefresh}
          isLoading={isLoading}
          leftIcon={<RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />}
        >
          Refresh Data
        </Button>
      </div>
    </div>
  );
};
