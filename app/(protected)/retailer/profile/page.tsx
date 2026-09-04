'use client';

import React from 'react';
import { PageContainer } from '@/components/layout/PageContainer';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { User, ShieldCheck, Phone, Mail, Store, Building2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { hierarchyService } from '@/services/hierarchyService';

export default function RetailerProfilePage() {
  const { session } = useAuth();

  const retailerId = session?.entityId || 'ret_001';
  const retailer = hierarchyService.getRetailerById(retailerId) || {
    id: 'ret_001',
    code: 'RET001',
    name: 'Metro Store #01',
    businessName: 'Metro Store Retail Solutions',
    email: 'ret001@qinstarpay.com',
    mobile: '9860066666',
    kycStatus: 'APPROVED',
    approvalStatus: 'APPROVED',
    accountStatus: 'ACTIVE',
    distributorId: 'dst_001',
    masterDistributorId: 'md_001',
    planId: 'plan_std_01',
  };

  const parentDst = hierarchyService.getDistributorById(retailer.distributorId);
  const parentMd = hierarchyService.getMasterDistributorById(retailer.masterDistributorId);

  return (
    <PageContainer
      title="Retailer Profile & Account Details"
      description="View your registered outlet credentials, parent hierarchy mapping, and KYC status."
      statusBadge={<StatusBadge status="ACTIVE" label="Approved Retailer" />}
    >
      <div className="bg-white border border-slate-200 rounded-xl p-6 max-w-3xl mx-auto space-y-6 shadow-xs">
        <div className="flex items-center gap-4 pb-4 border-b border-slate-100">
          <div className="w-14 h-14 rounded-2xl bg-amber-500 text-white font-bold text-lg flex items-center justify-center shadow-xs">
            RET
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-slate-900">{retailer.name}</h2>
              <StatusBadge status={retailer.kycStatus || 'APPROVED'} label={`KYC ${retailer.kycStatus || 'APPROVED'}`} size="sm" />
            </div>
            <p className="text-xs text-slate-500 font-mono mt-0.5">
              Code: <strong>{retailer.code}</strong> • {retailer.businessName}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-lg border border-slate-200 bg-slate-50/50 space-y-2">
            <h3 className="font-bold text-slate-700 uppercase tracking-wider text-[10px] flex items-center gap-1.5">
              <Store className="w-3.5 h-3.5 text-amber-600" /> Outlet Contact Info
            </h3>
            <div className="space-y-1.5 text-slate-800">
              <p className="flex items-center gap-1.5 font-mono"><Phone className="w-3.5 h-3.5 text-slate-400" /> {retailer.mobile}</p>
              <p className="flex items-center gap-1.5 font-mono"><Mail className="w-3.5 h-3.5 text-slate-400" /> {retailer.email}</p>
            </div>
          </div>

          <div className="p-4 rounded-lg border border-slate-200 bg-slate-50/50 space-y-2">
            <h3 className="font-bold text-slate-700 uppercase tracking-wider text-[10px] flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-blue-600" /> Parent Network Mapping
            </h3>
            <div className="space-y-1 text-slate-800">
              <p>Distributor: <strong>{parentDst?.name || 'North Zone Distributor'} ({parentDst?.code || 'DST001'})</strong></p>
              <p>Master Distributor: <strong>{parentMd?.name || 'Apex National Network'} ({parentMd?.code || 'MD001'})</strong></p>
            </div>
          </div>
        </div>

        <div className="p-4 bg-emerald-50/60 border border-emerald-200 rounded-lg text-xs text-emerald-900 flex items-center justify-between">
          <span className="flex items-center gap-1.5 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-600" /> Account Status is Active & Operational
          </span>
          <span className="font-mono text-[11px]">Role: RETAILER</span>
        </div>
      </div>
    </PageContainer>
  );
}
