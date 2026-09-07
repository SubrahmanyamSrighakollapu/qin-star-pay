'use client';

import React from 'react';
import { Retailer } from '@/types/domain';
import { hierarchyService } from '@/services/hierarchyService';
import { retailerPlanService } from '@/services/retailerPlanService';
import { Drawer } from '@/components/ui/Drawer';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { formatDate } from '@/utils/formatters';
import { Store, Network, Mail, Phone, Calendar, UserCheck, Percent, Wallet } from 'lucide-react';

export interface AdminRetailerDetailDrawerProps {
  retailer: Retailer | null;
  isOpen: boolean;
  onClose: () => void;
}

export const AdminRetailerDetailDrawer: React.FC<AdminRetailerDetailDrawerProps> = ({
  retailer,
  isOpen,
  onClose,
}) => {
  if (!retailer) return null;

  const parentMd = hierarchyService.getMasterDistributorById(retailer.masterDistributorId);
  const parentDst = hierarchyService.getDistributorById(retailer.distributorId);

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={`Retailer Outlet Details — ${retailer.name}`}
      description={`Code: ${retailer.code} • ${retailer.businessName}`}
      size="lg"
    >
      <div className="space-y-6">
        {/* Header Badge Strip */}
        <div className="p-4 rounded-xl bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-blue-600 text-white">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">{retailer.name}</h3>
              <p className="text-xs text-blue-200 font-mono">{retailer.code}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <StatusBadge
              status={retailer.approvalStatus}
              size="sm"
              label={
                retailer.approvalStatus === 'PENDING_APPROVAL'
                  ? 'Pending Approval'
                  : retailer.approvalStatus === 'REJECTED'
                  ? 'Rejected'
                  : 'Approved'
              }
            />
            <StatusBadge status={retailer.accountStatus} size="sm" />
          </div>
        </div>

        {/* Hierarchy Information */}
        <div className="p-4 rounded-xl border border-indigo-100 bg-indigo-50/40 space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-900 flex items-center gap-1.5">
            <Network className="w-4 h-4 text-indigo-600" />
            Parent Network Hierarchy
          </h4>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-slate-500 font-medium">Distributor</span>
              <p className="font-bold text-indigo-950 mt-0.5">
                {parentDst?.name || 'N/A'} ({parentDst?.code || retailer.distributorId})
              </p>
            </div>
            <div>
              <span className="text-slate-500 font-medium">Master Distributor</span>
              <p className="font-bold text-indigo-950 mt-0.5">
                {parentMd?.name || 'N/A'} ({parentMd?.code || retailer.masterDistributorId})
              </p>
            </div>
          </div>
        </div>

        {/* Profile Grid */}
        <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Retailer Profile Details</h4>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-slate-400 font-medium">Business / Store Name</span>
              <p className="font-semibold text-slate-900 mt-0.5">{retailer.businessName}</p>
            </div>
            <div>
              <span className="text-slate-400 font-medium flex items-center gap-1">
                <Percent className="w-3.5 h-3.5 text-indigo-600" /> Assigned Retailer Plan
              </span>
              <p className="font-mono font-bold text-indigo-700 mt-0.5">{retailer.planId}</p>
            </div>
            <div>
              <span className="text-slate-400 font-medium flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-slate-400" /> Email Address
              </span>
              <p className="font-mono text-slate-800 mt-0.5">{retailer.email}</p>
            </div>
            <div>
              <span className="text-slate-400 font-medium flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-slate-400" /> Mobile Number
              </span>
              <p className="font-semibold text-slate-800 mt-0.5">{retailer.mobile}</p>
            </div>
            <div>
              <span className="text-slate-400 font-medium flex items-center gap-1">
                <Wallet className="w-3.5 h-3.5 text-slate-400" /> Wallet ID
              </span>
              <p className="font-mono text-slate-800 mt-0.5">{retailer.walletId}</p>
            </div>
            <div>
              <span className="text-slate-400 font-medium flex items-center gap-1">
                <UserCheck className="w-3.5 h-3.5 text-indigo-600" /> Created By
              </span>
              <p className="font-semibold text-slate-900 mt-0.5">
                {retailer.createdByRole || 'DISTRIBUTOR'} ({retailer.createdByUserId})
              </p>
            </div>
            <div>
              <span className="text-slate-400 font-medium flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" /> Onboarded Date
              </span>
              <p className="font-medium text-slate-800 mt-0.5">{formatDate(retailer.createdAt)}</p>
            </div>
          </div>
        </div>
      </div>
    </Drawer>
  );
};
