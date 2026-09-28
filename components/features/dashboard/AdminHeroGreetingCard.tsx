'use client';

import React from 'react';
import {
  ShieldCheck,
  Clock,
  RefreshCw,
  Store,
  Building2,
  Award,
  AlertTriangle,
  Filter,
  ArrowRight,
} from 'lucide-react';
import { MemberType } from '@/components/features/users/AddMemberModal';

export interface AdminHeroGreetingCardProps {
  adminName?: string;
  roleTitle?: string;
  lastRefreshedAt: string;
  onRefresh: () => void;
  isLoading?: boolean;
  pendingApprovalsCount: number;
  todayTxnCount: number;
  activeFilterCount?: number;
  onOpenAddMember: (role: MemberType) => void;
  onOpenFilterDrawer: () => void;
  onSelectTab?: (tab: 'PAY_IN' | 'PAY_OUT' | 'NETWORK_KYC') => void;
}

export const AdminHeroGreetingCard: React.FC<AdminHeroGreetingCardProps> = ({
  adminName = 'Admin',
  roleTitle = 'Platform Administrator',
  onRefresh,
  isLoading = false,
  pendingApprovalsCount,
  activeFilterCount = 0,
  onOpenAddMember,
  onOpenFilterDrawer,
  onSelectTab,
}) => {
  const lastLoginFormatted = 'Today at 09:42 AM';

  return (
    <div className="space-y-4">
      {/* Main Executive Header */}
      <div className="bg-white rounded-2xl border border-[#E5EAF1] p-6 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        {/* Left Info Column */}
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-extrabold text-[#0F172A] tracking-tight">
              Dashboard
            </h1>
          </div>
          <p className="text-sm text-[#64748B] font-medium">
            Monitor platform transactions, settlements and network activity.
          </p>

          {/* Contextual Status Meta */}
          <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-[#64748B]">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#F8FAFC] border border-[#E5EAF1] font-semibold text-[#334155]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#155EEF]" />
              {roleTitle}
            </span>

            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-700 font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              All Systems Operational
            </span>

            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[#64748B] font-medium">
              <Clock className="w-3.5 h-3.5 text-[#94A3B8]" />
              Last login: <strong className="text-[#334155]">{lastLoginFormatted}</strong>
            </span>
          </div>
        </div>

        {/* Right Actions Column */}
        <div className="flex flex-col items-start lg:items-end gap-3 shrink-0">
          {/* Top Tools: Operational Filters + Refresh */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onOpenFilterDrawer}
              className="px-3.5 py-2 bg-white hover:bg-[#F8FAFC] text-[#0F172A] text-xs font-semibold rounded-lg border border-[#E5EAF1] flex items-center gap-2 transition-all shadow-xs cursor-pointer"
            >
              <Filter className="w-3.5 h-3.5 text-[#64748B]" />
              <span>Operational Filters</span>
              {activeFilterCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-[#155EEF] text-white text-[10px] font-bold">
                  {activeFilterCount}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={onRefresh}
              className="p-2 bg-white hover:bg-[#F8FAFC] text-[#64748B] hover:text-[#0F172A] text-xs font-semibold rounded-lg border border-[#E5EAF1] transition-all shadow-xs cursor-pointer"
              title="Refresh Dashboard Data"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>

          {/* Quick Actions Group */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Primary Action */}
            <button
              type="button"
              onClick={() => onOpenAddMember('RETAILER')}
              className="px-3.5 py-2 bg-[#155EEF] hover:bg-[#1149B8] text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
            >
              <Store className="w-3.5 h-3.5" />
              + Add Retailer
            </button>

            {/* Secondary Outlined Actions */}
            <button
              type="button"
              onClick={() => onOpenAddMember('DISTRIBUTOR')}
              className="px-3.5 py-2 bg-white hover:bg-[#F8FAFC] text-[#334155] text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all border border-[#E5EAF1] shadow-xs cursor-pointer"
            >
              <Building2 className="w-3.5 h-3.5 text-[#64748B]" />
              + Add Distributor
            </button>

            <button
              type="button"
              onClick={() => onOpenAddMember('MASTER_DISTRIBUTOR')}
              className="px-3.5 py-2 bg-white hover:bg-[#F8FAFC] text-[#334155] text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all border border-[#E5EAF1] shadow-xs cursor-pointer"
            >
              <Award className="w-3.5 h-3.5 text-[#64748B]" />
              + Add Master Dist
            </button>
          </div>
        </div>
      </div>

      {/* Compact Pending KYC Actionable Attention Chip */}
      {pendingApprovalsCount > 0 && (
        <div className="bg-amber-50/80 border border-amber-200/90 rounded-xl px-4 py-2.5 flex items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2.5 text-amber-900 font-semibold">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              <strong>{pendingApprovalsCount} KYC applications</strong> require operational review and verification.
            </span>
          </div>
          <button
            type="button"
            onClick={() => onSelectTab && onSelectTab('NETWORK_KYC')}
            className="inline-flex items-center gap-1 text-amber-900 hover:text-amber-950 font-bold transition-colors cursor-pointer shrink-0"
          >
            <span>Review Applications</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};

