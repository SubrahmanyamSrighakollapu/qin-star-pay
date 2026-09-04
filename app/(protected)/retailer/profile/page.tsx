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
      description="View your registered Retailer credentials, parent hierarchy mapping, and KYC status."
      statusBadge={<StatusBadge status={retailer.accountStatus || 'ACTIVE'} label="Approved Retailer" />}
    >
      <div className="space-y-6">
        {/* Top Header Card */}
        <div className="bg-white border border-[var(--border)] rounded-[var(--radius-xl)] p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[var(--primary)] text-white font-extrabold text-lg flex items-center justify-center shadow-xs">
              QSP
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl font-bold text-slate-900">{retailer.name}</h2>
                <StatusBadge status={retailer.kycStatus || 'APPROVED'} label={`KYC ${retailer.kycStatus || 'APPROVED'}`} size="sm" />
              </div>
              <p className="text-xs text-slate-500 font-mono mt-0.5">
                Code: <strong className="text-slate-800">{retailer.code}</strong> • {retailer.businessName}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg shrink-0">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Account Active & Operational</span>
          </div>
        </div>

        {/* Structured 2-Column Info Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column: Contact & Account Details */}
          <div className="bg-white border border-[var(--border)] rounded-[var(--radius-xl)] p-5 shadow-xs space-y-4">
            <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-3">
              <Store className="w-4 h-4 text-[var(--primary)]" /> Retailer Contact Information
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Retailer ID:</span>
                <span className="font-mono font-bold text-slate-900">{retailer.id}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Business Name:</span>
                <span className="font-semibold text-slate-800">{retailer.businessName}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Registered Mobile:</span>
                <span className="font-mono text-slate-800 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-400" /> {retailer.mobile}
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Email Address:</span>
                <span className="font-mono text-slate-800 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-slate-400" /> {retailer.email}
                </span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-500">KYC Status:</span>
                <StatusBadge status={retailer.kycStatus || 'APPROVED'} size="sm" />
              </div>
            </div>
          </div>

          {/* Right Column: Parent Hierarchy & Commercial Plan */}
          <div className="bg-white border border-[var(--border)] rounded-[var(--radius-xl)] p-5 shadow-xs space-y-4">
            <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-3">
              <Building2 className="w-4 h-4 text-[var(--secondary)]" /> Parent Network Mapping
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Parent Distributor:</span>
                <span className="font-semibold text-slate-900">
                  {parentDst?.name || 'North Zone Distributor'} <span className="font-mono text-blue-600 font-bold">({parentDst?.code || 'DST001'})</span>
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Parent Master Distributor:</span>
                <span className="font-semibold text-slate-900">
                  {parentMd?.name || 'Apex National Network'} <span className="font-mono text-blue-600 font-bold">({parentMd?.code || 'MD001'})</span>
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Assigned Plan ID:</span>
                <span className="font-mono font-bold text-slate-800">{retailer.planId || 'plan_std_01'}</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-500">Security Scope Role:</span>
                <span className="font-mono font-bold text-[var(--primary)]">RETAILER</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
