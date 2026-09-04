import React from 'react';
import { MasterDistributorCommissionRecord } from '@/services/commissionService';
import { Drawer, StatusBadge, Button } from '@/components/ui';
import { formatCurrency, formatDateTime } from '@/utils/formatters';
import {
  Percent,
  Store,
  Building2,
  Calendar,
  CreditCard,
  CheckCircle2,
  Clock,
  ArrowRightLeft,
} from 'lucide-react';

interface CommissionDetailDrawerProps {
  commission: MasterDistributorCommissionRecord | null;
  isOpen: boolean;
  onClose: () => void;
}

export const CommissionDetailDrawer: React.FC<CommissionDetailDrawerProps> = ({
  commission,
  isOpen,
  onClose,
}) => {
  if (!commission) return null;

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
      title={
        <div className="flex items-center gap-2">
          <span>Commission Record</span>
          <span className="font-mono text-xs px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200">
            +{formatCurrency(commission.mdCommissionAmount)}
          </span>
        </div>
      }
      description={`Transaction Ref: ${commission.transactionRef} • Service: ${commission.serviceType}`}
      footer={
        <Button variant="outline" onClick={onClose} fullWidth>
          Close
        </Button>
      }
    >
      <div className="space-y-6">
        {/* Status Header */}
        <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 font-medium">Settlement Status</p>
            <div className="mt-1">
              <StatusBadge
                status={
                  commission.status === 'CREDITED'
                    ? 'SUCCESS'
                    : commission.status === 'REVERSED'
                    ? 'FAILED'
                    : 'PENDING'
                }
                label={commission.status}
              />
            </div>
          </div>

          <div className="text-right">
            <p className="text-xs text-slate-500 font-medium">Earned Amount</p>
            <p className="text-xl font-bold text-emerald-600 font-mono mt-0.5">
              +{formatCurrency(commission.mdCommissionAmount)}
            </p>
          </div>
        </div>

        {/* Calculation Details */}
        <div className="p-4 rounded-xl border border-indigo-100 bg-indigo-50/40 space-y-3">
          <h4 className="text-xs font-bold text-indigo-900 uppercase tracking-wider flex items-center gap-1.5">
            <Percent className="w-4 h-4 text-indigo-600" /> Commercial Calculation Breakdown
          </h4>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <p className="text-slate-500">Transaction Volume:</p>
              <p className="font-bold text-slate-900 mt-0.5 font-mono">
                {formatCurrency(commission.transactionAmount)}
              </p>
            </div>
            <div>
              <p className="text-slate-500">Applicable MD Rate:</p>
              <p className="font-semibold text-slate-900 mt-0.5 font-mono">
                {commission.mdCommissionRate}
              </p>
            </div>
            <div>
              <p className="text-slate-500">Net Earned Margin:</p>
              <p className="font-bold text-emerald-600 mt-0.5 font-mono">
                {formatCurrency(commission.mdCommissionAmount)}
              </p>
            </div>
            <div>
              <p className="text-slate-500">Wallet Reference ID:</p>
              <p className="font-mono text-slate-800 mt-0.5">
                {commission.walletReferenceId || 'N/A'}
              </p>
            </div>
          </div>
        </div>

        {/* Hierarchy Context */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-lg border border-slate-200 bg-white space-y-2 text-xs">
            <p className="font-bold text-slate-600 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <Store className="w-3.5 h-3.5 text-indigo-600" /> Generating Outlet
            </p>
            <p className="font-bold text-slate-900">{commission.retailerName}</p>
            <p className="text-slate-500 font-mono text-[11px]">ID: {commission.retailerId}</p>
          </div>

          <div className="p-4 rounded-lg border border-slate-200 bg-white space-y-2 text-xs">
            <p className="font-bold text-slate-600 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-indigo-600" /> Parent Distributor
            </p>
            <p className="font-semibold text-slate-900">{commission.distributorName}</p>
            <p className="text-slate-500 font-mono text-[11px]">ID: {commission.distributorId}</p>
          </div>
        </div>

        {/* Timestamps */}
        <div className="p-4 rounded-lg border border-slate-200 bg-white space-y-2 text-xs text-slate-700">
          <div className="flex justify-between">
            <span className="text-slate-500">Transaction Time:</span>
            <span className="font-medium">{formatDateTime(commission.createdDate)}</span>
          </div>
          {commission.creditedDate && (
            <div className="flex justify-between">
              <span className="text-slate-500">Credited Time:</span>
              <span className="font-medium">{formatDateTime(commission.creditedDate)}</span>
            </div>
          )}
        </div>
      </div>
    </Drawer>
  );
};
