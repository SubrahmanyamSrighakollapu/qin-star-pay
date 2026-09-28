'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';
import {
  Sprout,
  Package,
  Tractor,
  FlaskConical,
  CreditCard,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Save,
  RotateCcw,
} from 'lucide-react';

export interface ServicePermission {
  id: string;
  name: string;
  key: string;
  description: string;
  icon: React.ReactNode;
  enabled: boolean;
}

const DEFAULT_SERVICES: ServicePermission[] = [
  {
    id: 'crop-listing',
    name: 'Crop Listing',
    key: 'isCropListingEnabled',
    description: 'Create and manage crop and produce inventory listings on the platform marketplace.',
    icon: <Sprout className="w-5 h-5 text-emerald-600" />,
    enabled: true,
  },
  {
    id: 'seed-fertilizer',
    name: 'Seed & Fertilizer Orders',
    key: 'isSeedFertilizerEnabled',
    description: 'Place bulk procurement orders for high-grade seeds, fertilizers, and crop nutrients.',
    icon: <Package className="w-5 h-5 text-blue-600" />,
    enabled: true,
  },
  {
    id: 'equipment-rental',
    name: 'Equipment Rental',
    key: 'isEquipmentRentalEnabled',
    description: 'Request tractor, harvester, and heavy agricultural machinery rentals on demand.',
    icon: <Tractor className="w-5 h-5 text-amber-600" />,
    enabled: true,
  },
  {
    id: 'soil-testing',
    name: 'Soil Testing',
    key: 'isSoilTestingEnabled',
    description: 'Request agricultural soil quality testing services and lab report diagnostics.',
    icon: <FlaskConical className="w-5 h-5 text-indigo-600" />,
    enabled: false,
  },
  {
    id: 'payout-settlement',
    name: 'Payout / Settlement',
    key: 'isPayoutSettlementEnabled',
    description: 'Process direct bank payouts, nodal settlements, and sales proceeds clearance.',
    icon: <CreditCard className="w-5 h-5 text-purple-600" />,
    enabled: true,
  },
];

export const UserServiceSettings: React.FC = () => {
  const { toastSuccess, toastInfo } = useToast();
  const [selectedRole, setSelectedRole] = useState<'RETAILER' | 'DISTRIBUTOR' | 'MASTER_DISTRIBUTOR'>('RETAILER');
  const [services, setServices] = useState<ServicePermission[]>(DEFAULT_SERVICES);

  const handleToggle = (id: string) => {
    setServices((prev) =>
      prev.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s))
    );
  };

  const handleSave = () => {
    toastSuccess(`Service settings for ${selectedRole.replace('_', ' ')} updated successfully!`);
  };

  const handleReset = () => {
    setServices(DEFAULT_SERVICES);
    toastInfo('Settings reset to default configuration.');
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Role Filter Selector */}
      <div className="bg-white rounded-2xl border border-[#E5EAF1] p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-[#0F172A] flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#155EEF]" />
            User Service Settings (UserServiceSettings)
          </h1>
          <p className="text-xs text-[#64748B] mt-1 font-medium">
            Configure granular service flags and feature permissions on a per-user or per-tier basis.
          </p>
        </div>

        {/* Tier Selector */}
        <div className="flex items-center gap-1.5 bg-[#F8FAFC] p-1 rounded-xl border border-[#E5EAF1] shrink-0">
          <button
            type="button"
            onClick={() => setSelectedRole('RETAILER')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              selectedRole === 'RETAILER'
                ? 'bg-[#155EEF] text-white shadow-xs'
                : 'text-[#64748B] hover:text-[#0F172A]'
            }`}
          >
            Retailer Tier
          </button>
          <button
            type="button"
            onClick={() => setSelectedRole('DISTRIBUTOR')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              selectedRole === 'DISTRIBUTOR'
                ? 'bg-[#155EEF] text-white shadow-xs'
                : 'text-[#64748B] hover:text-[#0F172A]'
            }`}
          >
            Distributor (DS)
          </button>
          <button
            type="button"
            onClick={() => setSelectedRole('MASTER_DISTRIBUTOR')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              selectedRole === 'MASTER_DISTRIBUTOR'
                ? 'bg-[#155EEF] text-white shadow-xs'
                : 'text-[#64748B] hover:text-[#0F172A]'
            }`}
          >
            Master Dist (MD)
          </button>
        </div>
      </div>

      {/* Controlled Service Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {services.map((service) => (
          <div
            key={service.id}
            className="bg-white border border-[#E5EAF1] rounded-2xl p-5 shadow-xs flex flex-col justify-between transition-all duration-200 hover:border-slate-300"
          >
            <div>
              <div className="flex items-center justify-between gap-3 mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-[#F8FAFC] border border-[#E5EAF1] flex items-center justify-center shrink-0">
                    {service.icon}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#0F172A]">{service.name}</h3>
                    <code className="text-[10px] text-[#64748B] font-mono">{service.key}</code>
                  </div>
                </div>

                <span
                  className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold inline-flex items-center gap-1 ${
                    service.enabled
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-slate-100 text-slate-600 border border-slate-200'
                  }`}
                >
                  {service.enabled ? (
                    <>
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Enabled
                    </>
                  ) : (
                    <>
                      <XCircle className="w-3 h-3 text-slate-400" /> Disabled
                    </>
                  )}
                </span>
              </div>

              <p className="text-xs text-[#64748B] font-normal leading-relaxed mt-2">
                {service.description}
              </p>
            </div>

            <div className="pt-4 border-t border-[#E5EAF1] mt-4 flex items-center justify-between">
              <span className="text-xs font-medium text-[#64748B]">Operational Status</span>
              <button
                type="button"
                onClick={() => handleToggle(service.id)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  service.enabled ? 'bg-[#155EEF]' : 'bg-slate-200'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                    service.enabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Sticky Action Footer */}
      <div className="bg-white rounded-2xl border border-[#E5EAF1] p-4 shadow-xs flex items-center justify-between gap-3">
        <Button
          variant="outline"
          onClick={handleReset}
          leftIcon={<RotateCcw className="w-4 h-4 text-[#64748B]" />}
        >
          Reset Defaults
        </Button>
        <Button
          variant="primary"
          onClick={handleSave}
          leftIcon={<Save className="w-4 h-4" />}
        >
          Save Service Permissions
        </Button>
      </div>
    </div>
  );
};
