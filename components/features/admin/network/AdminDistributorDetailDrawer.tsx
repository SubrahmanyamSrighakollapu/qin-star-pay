'use client';

import React from 'react';
import { Distributor } from '@/types/domain';
import { hierarchyService } from '@/services/hierarchyService';
import { Drawer } from '@/components/ui/Drawer';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { formatDate } from '@/utils/formatters';
import { Building2, Store, Users, Network, Mail, Phone, Calendar, UserCheck } from 'lucide-react';

export interface AdminDistributorDetailDrawerProps {
  distributor: Distributor | null;
  isOpen: boolean;
  onClose: () => void;
}

export const AdminDistributorDetailDrawer: React.FC<AdminDistributorDetailDrawerProps> = ({
  distributor,
  isOpen,
  onClose,
}) => {
  if (!distributor) return null;

  const parentMd = hierarchyService.getMasterDistributorById(distributor.masterDistributorId);
  const retailers = hierarchyService.getDistributorRetailers(distributor.id);

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={`Distributor Details — ${distributor.name}`}
      description={`Code: ${distributor.code} • Parent MD: ${parentMd?.name || 'N/A'}`}
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
              <h3 className="font-bold text-sm text-white">{distributor.name}</h3>
              <p className="text-xs text-indigo-200 font-mono">{distributor.code}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <StatusBadge
              status={distributor.approvalStatus || 'APPROVED'}
              size="sm"
              label={
                distributor.approvalStatus === 'PENDING_APPROVAL'
                  ? 'Pending Approval'
                  : distributor.approvalStatus === 'REJECTED'
                  ? 'Rejected'
                  : 'Approved'
              }
            />
            <StatusBadge status={distributor.status} size="sm" />
          </div>
        </div>

        {/* Overview Information Grid */}
        <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Distributor Profile & Metadata</h4>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-slate-400 font-medium">Business Name</span>
              <p className="font-semibold text-slate-900 mt-0.5">{distributor.businessName}</p>
            </div>
            <div>
              <span className="text-slate-400 font-medium flex items-center gap-1">
                <Network className="w-3.5 h-3.5 text-indigo-600" /> Parent Master Distributor
              </span>
              <p className="font-bold text-indigo-950 mt-0.5">{parentMd?.name || 'N/A'} ({parentMd?.code || distributor.masterDistributorId})</p>
            </div>
            <div>
              <span className="text-slate-400 font-medium flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-slate-400" /> Email Address
              </span>
              <p className="font-mono text-slate-800 mt-0.5">{distributor.email}</p>
            </div>
            <div>
              <span className="text-slate-400 font-medium flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-slate-400" /> Mobile Number
              </span>
              <p className="font-semibold text-slate-800 mt-0.5">{distributor.mobile}</p>
            </div>
            <div>
              <span className="text-slate-400 font-medium flex items-center gap-1">
                <UserCheck className="w-3.5 h-3.5 text-indigo-600" /> Created By Context
              </span>
              <p className="font-semibold text-slate-900 mt-0.5">
                {distributor.createdByRole || 'ADMIN'} ({distributor.createdByUserId || 'System'})
              </p>
            </div>
            <div>
              <span className="text-slate-400 font-medium flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" /> Creation Date
              </span>
              <p className="font-medium text-slate-800 mt-0.5">{formatDate(distributor.createdAt)}</p>
            </div>
          </div>
        </div>

        {/* Managed Retailer Outlets */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-900 tracking-tight flex items-center gap-1.5">
              <Store className="w-3.5 h-3.5 text-blue-600" />
              Retailers Network ({retailers.length})
            </h4>
            <span className="text-[11px] text-slate-500 font-medium">Outlets under this distributor</span>
          </div>

          {retailers.length === 0 ? (
            <p className="text-xs text-slate-400 p-3 bg-slate-50 rounded-lg text-center font-medium">
              No Retailers currently attached to this Distributor.
            </p>
          ) : (
            <div className="divide-y divide-slate-100 rounded-xl border border-slate-200 overflow-hidden text-xs">
              {retailers.map((r) => (
                <div key={r.id} className="p-2.5 bg-white flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-900">{r.name}</span>
                    <span className="ml-2 font-mono text-[10px] text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded">
                      {r.code}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusBadge status={r.approvalStatus} size="sm" />
                    <StatusBadge status={r.accountStatus} size="sm" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Drawer>
  );
};
