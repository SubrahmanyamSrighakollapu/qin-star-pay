'use client';

import React from 'react';
import { RefreshCw, Clock, Building2, Store } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { formatDateTime } from '@/utils/formatters';

export interface DistributorHeaderProps {
  name: string;
  code: string;
  businessName: string;
  parentMdName: string;
  parentMdCode: string;
  lastRefreshedAt: string;
  onRefresh: () => void;
  isLoading?: boolean;
}

export const DistributorHeader: React.FC<DistributorHeaderProps> = ({
  name,
  code,
  businessName,
  parentMdName,
  parentMdCode,
  lastRefreshedAt,
  onRefresh,
  isLoading = false,
}) => {
  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#0F4C81] to-indigo-700 text-white font-extrabold flex items-center justify-center text-sm shadow-xs shrink-0 ring-4 ring-indigo-50">
          DST
        </div>
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="text-xl md:text-2xl font-extrabold text-slate-900 tracking-tight">
              Welcome back, {name}
            </h1>
            <span className="text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-indigo-50 text-[#0F4C81] border border-indigo-200">
              {code}
            </span>
            <StatusBadge status="ACTIVE" label="Distributor Portal Active" size="sm" />
          </div>
          <p className="text-xs text-slate-500 flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-slate-700 flex items-center gap-1">
              <Store className="w-3.5 h-3.5 text-slate-400" /> {businessName}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5 text-slate-400" /> Parent MD: <strong className="text-slate-700">{parentMdName}</strong> ({parentMdCode})
            </span>
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between md:justify-end gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
        <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
          <Clock className="w-3.5 h-3.5" />
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
