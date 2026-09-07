'use client';

import React from 'react';
import { MasterDistributor } from '@/types/domain';
import { hierarchyService } from '@/services/hierarchyService';
import { Drawer } from '@/components/ui/Drawer';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { formatDate } from '@/utils/formatters';
import { Building2, Users, Store, Wallet, ShieldCheck, Mail, Phone, Calendar } from 'lucide-react';

export interface MasterDistributorDetailDrawerProps {
  md: MasterDistributor | null;
  isOpen: boolean;
  onClose: () => void;
}

export const MasterDistributorDetailDrawer: React.FC<MasterDistributorDetailDrawerProps> = ({
  md,
  isOpen,
  onClose,
}) => {
  if (!md) return null;

  const subDistributors = hierarchyService.getMasterDistributorDistributors(md.id);
  const retailers = hierarchyService.getMasterDistributorRetailers(md.id);

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={`Master Distributor Details — ${md.name}`}
      description={`Code: ${md.code} • ${md.businessName}`}
      size="lg"
    >
      <div className="space-y-6">
        {/* Header Badge Strip */}
        <div className="p-4 rounded-xl bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-indigo-600 text-white">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">{md.name}</h3>
              <p className="text-xs text-indigo-200 font-mono">{md.code}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <StatusBadge status={md.status} size="sm" />
          </div>
        </div>

        {/* Overview Information Grid */}
        <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Business & Contact Overview</h4>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-slate-400 font-medium">Business Name</span>
              <p className="font-semibold text-slate-900 mt-0.5">{md.businessName}</p>
            </div>
            <div>
              <span className="text-slate-400 font-medium">Wallet ID</span>
              <p className="font-mono text-slate-700 font-semibold mt-0.5">{md.walletId}</p>
            </div>
            <div>
              <span className="text-slate-400 font-medium flex items-center gap-1">
                <Mail className="w-3 h-3 text-slate-400" /> Email Address
              </span>
              <p className="font-mono text-slate-800 mt-0.5">{md.email}</p>
            </div>
            <div>
              <span className="text-slate-400 font-medium flex items-center gap-1">
                <Phone className="w-3 h-3 text-slate-400" /> Mobile Number
              </span>
              <p className="font-semibold text-slate-800 mt-0.5">{md.mobile}</p>
            </div>
            <div>
              <span className="text-slate-400 font-medium flex items-center gap-1">
                <Calendar className="w-3 h-3 text-slate-400" /> Registered On
              </span>
              <p className="font-medium text-slate-800 mt-0.5">{formatDate(md.createdAt)}</p>
            </div>
            <div>
              <span className="text-slate-400 font-medium">Commission Plan</span>
              <p className="font-mono font-semibold text-indigo-700 mt-0.5">
                PayIn: {(md.commissionConfig?.payinRate || 0) * 100}% • PayOut: ₹{md.commissionConfig?.payoutRate || 0}
              </p>
            </div>
          </div>
        </div>

        {/* Managed Network Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-xl border border-indigo-100 bg-indigo-50/50 space-y-1">
            <div className="flex items-center justify-between text-indigo-800">
              <span className="text-xs font-bold uppercase tracking-wider">Sub-Distributors</span>
              <Users className="w-4 h-4 text-indigo-600" />
            </div>
            <p className="text-2xl font-extrabold text-indigo-950">{subDistributors.length}</p>
            <p className="text-[11px] text-indigo-700 font-medium">Middle tier distributors attached</p>
          </div>

          <div className="p-4 rounded-xl border border-blue-100 bg-blue-50/50 space-y-1">
            <div className="flex items-center justify-between text-blue-800">
              <span className="text-xs font-bold uppercase tracking-wider">Managed Retailers</span>
              <Store className="w-4 h-4 text-blue-600" />
            </div>
            <p className="text-2xl font-extrabold text-blue-950">{retailers.length}</p>
            <p className="text-[11px] text-blue-700 font-medium">Retailer outlets in network</p>
          </div>
        </div>

        {/* Sub-Distributors Preview List */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold text-slate-900 tracking-tight flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-indigo-600" />
            Sub-Distributors Network ({subDistributors.length})
          </h4>
          {subDistributors.length === 0 ? (
            <p className="text-xs text-slate-400 p-3 bg-slate-50 rounded-lg text-center font-medium">
              No Distributors attached to this Master Distributor.
            </p>
          ) : (
            <div className="divide-y divide-slate-100 rounded-xl border border-slate-200 overflow-hidden text-xs">
              {subDistributors.map((d) => (
                <div key={d.id} className="p-2.5 bg-white flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-900">{d.name}</span>
                    <span className="ml-2 font-mono text-[10px] text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded">
                      {d.code}
                    </span>
                  </div>
                  <StatusBadge status={d.status} size="sm" />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Drawer>
  );
};
