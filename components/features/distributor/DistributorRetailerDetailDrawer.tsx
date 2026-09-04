import React, { useState, useEffect } from 'react';
import { Retailer, RetailerPlan } from '@/types/domain';
import { retailerService } from '@/services/retailerService';
import { retailerPlanService } from '@/services/retailerPlanService';
import { hierarchyService } from '@/services/hierarchyService';
import { Drawer } from '@/components/ui/Drawer';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Tabs } from '@/components/ui/Tabs';
import { formatCurrency, formatDateTime } from '@/utils/formatters';
import {
  User,
  Building2,
  Mail,
  Phone,
  Calendar,
  Wallet,
  ArrowLeftRight,
  Percent,
  ShieldCheck,
  Tag,
  AlertTriangle,
  Info,
  Clock,
} from 'lucide-react';

interface DistributorRetailerDetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  retailer: Retailer | null;
}

export const DistributorRetailerDetailDrawer: React.FC<DistributorRetailerDetailDrawerProps> = ({
  isOpen,
  onClose,
  retailer,
}) => {
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [planDetails, setPlanDetails] = useState<RetailerPlan | null>(null);
  const [walletSummary, setWalletSummary] = useState<any>(null);
  const [txnSummary, setTxnSummary] = useState<any>(null);
  const [commSummary, setCommSummary] = useState<any>(null);

  useEffect(() => {
    if (retailer) {
      // Load Plan details
      if (retailer.planId) {
        retailerPlanService.getPlanById(retailer.planId).then((res) => {
          if (res.success && res.data) setPlanDetails(res.data);
        });
      } else {
        setPlanDetails(null);
      }

      // Load Scoped Summaries
      setWalletSummary(retailerService.getRetailerWalletSummary(retailer.id));
      setTxnSummary(retailerService.getRetailerTransactionSummary(retailer.id));
      setCommSummary(retailerService.getRetailerCommissionSummary(retailer.id));
    }
  }, [retailer]);

  if (!retailer) return null;

  const parentMd = hierarchyService.getMasterDistributorById(retailer.masterDistributorId);
  const parentDst = hierarchyService.getDistributorById(retailer.distributorId);

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'plan', label: 'Retailer Plan' },
    { id: 'financials', label: 'Wallet & Activity' },
    { id: 'governance', label: 'Approval & Audit' },
  ];

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={`Retailer Details — ${retailer.name}`}
      description={`Code: ${retailer.code} | Registered ID: ${retailer.id}`}
      size="lg"
    >
      <div className="space-y-5">
        {/* Status Header Strip */}
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div>
            <span className="text-slate-400 font-bold uppercase text-[10px] block leading-none mb-1">
              Store / Business Name
            </span>
            <span className="font-bold text-slate-900 text-sm">{retailer.businessName}</span>
          </div>

          <div className="flex items-center gap-3">
            <div>
              <span className="text-slate-400 font-bold uppercase text-[10px] block leading-none mb-1">
                Approval Status
              </span>
              <StatusBadge status={retailer.approvalStatus || 'APPROVED'} size="sm" />
            </div>

            <div>
              <span className="text-slate-400 font-bold uppercase text-[10px] block leading-none mb-1">
                Account Status
              </span>
              <StatusBadge status={retailer.accountStatus || 'ACTIVE'} size="sm" />
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <Tabs items={tabs} activeTab={activeTab} onChange={setActiveTab} />

        {/* Tab 1: Overview */}
        {activeTab === 'overview' && (
          <div className="space-y-4 text-xs">
            {/* Rejection Banner */}
            {retailer.approvalStatus === 'REJECTED' && (
              <div className="bg-rose-50 border border-rose-200 rounded-lg p-3.5 flex items-start gap-2.5 text-rose-900">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold">Application Rejected by Admin</h4>
                  <p className="text-[11px] mt-0.5">{retailer.rejectionReason || 'No specific rejection reason supplied.'}</p>
                </div>
              </div>
            )}

            {/* Pending Banner */}
            {retailer.approvalStatus === 'PENDING_APPROVAL' && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3.5 flex items-start gap-2.5 text-amber-900">
                <Clock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold">Awaiting Admin Approval</h4>
                  <p className="text-[11px] mt-0.5">Retailer application submitted and pending platform Admin review.</p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white border border-slate-200 rounded-lg p-4 space-y-3">
                <h4 className="font-bold text-slate-700 text-xs uppercase tracking-wider border-b pb-2 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-blue-600" /> Contact & Identification
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">Retailer Name:</span>
                    <span className="font-bold text-slate-900">{retailer.name}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">Business Name:</span>
                    <span className="font-semibold text-slate-800">{retailer.businessName}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">Email Address:</span>
                    <span className="font-mono text-slate-700">{retailer.email}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">Mobile Number:</span>
                    <span className="font-mono text-slate-700">{retailer.mobile}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">KYC Status:</span>
                    <StatusBadge status={retailer.kycStatus || 'APPROVED'} size="sm" />
                  </div>
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-lg p-4 space-y-3">
                <h4 className="font-bold text-slate-700 text-xs uppercase tracking-wider border-b pb-2 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-blue-600" /> Network Hierarchy
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">Master Distributor:</span>
                    <span className="font-bold text-slate-900">{parentMd?.name || 'Apex National Network'} ({parentMd?.code || 'MD001'})</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">Distributor Partner:</span>
                    <span className="font-semibold text-slate-800">{parentDst?.name || 'North Zone Distributor'} ({parentDst?.code || 'DST001'})</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">Created By Role:</span>
                    <span className="font-mono text-slate-700">{retailer.createdByRole || 'DISTRIBUTOR'}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">Created Date:</span>
                    <span className="font-mono text-slate-700">{formatDateTime(retailer.createdAt)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Retailer Plan */}
        {activeTab === 'plan' && (
          <div className="space-y-4 text-xs">
            <div className="bg-white border border-slate-200 rounded-lg p-4 space-y-3">
              <h4 className="font-bold text-slate-700 text-xs uppercase tracking-wider border-b pb-2 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-blue-600" /> Commercial Retailer Plan Settings
              </h4>

              {planDetails ? (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-lg border border-slate-100">
                    <div>
                      <span className="text-slate-400 font-bold uppercase text-[10px] block">Plan Name</span>
                      <span className="font-bold text-slate-900 text-sm">{planDetails.name}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 font-bold uppercase text-[10px] block">Plan Code</span>
                      <span className="font-mono font-bold text-blue-600 text-sm">{planDetails.code}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {(() => {
                      const payinRule = planDetails.commissionRules?.find((r) => r.serviceType === 'PAY_IN');
                      const payoutRule = planDetails.commissionRules?.find((r) => r.serviceType === 'PAY_OUT');
                      const payinRate = payinRule ? payinRule.value : 0.10;
                      const payoutRate = payoutRule ? payoutRule.value : 1.00;
                      return (
                        <>
                          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
                            <span className="text-emerald-700 font-bold uppercase text-[10px] block">Pay-In Commission Rate</span>
                            <span className="font-mono font-extrabold text-emerald-900 text-lg">
                              {payinRate}%
                            </span>
                            <span className="text-[10px] text-emerald-700 block mt-0.5">Applied to retailer payin collection volume</span>
                          </div>

                          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                            <span className="text-blue-700 font-bold uppercase text-[10px] block">Pay-Out Fixed Fee / Margin</span>
                            <span className="font-mono font-extrabold text-blue-900 text-lg">
                              ₹{payoutRate}
                            </span>
                            <span className="text-[10px] text-blue-700 block mt-0.5">Per successful payout transaction</span>
                          </div>
                        </>
                      );
                    })()}
                  </div>
                </div>
              ) : (
                <p className="text-slate-500 italic">No commercial plan assigned to this retailer.</p>
              )}
            </div>
          </div>
        )}

        {/* Tab 3: Financials & Activity */}
        {activeTab === 'financials' && (
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg">
                <span className="text-slate-400 font-bold uppercase text-[10px] block">Available Wallet Balance</span>
                <span className="font-mono font-extrabold text-slate-900 text-lg">
                  {formatCurrency(walletSummary?.balance || 0)}
                </span>
                <span className="text-[10px] text-slate-500 block mt-0.5 font-mono">ID: {walletSummary?.walletId}</span>
              </div>

              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg">
                <span className="text-slate-400 font-bold uppercase text-[10px] block">Today's Transactions</span>
                <span className="font-mono font-extrabold text-slate-900 text-lg">
                  {txnSummary?.todayTxnsCount || 0}
                </span>
                <span className="text-[10px] text-emerald-600 block mt-0.5 font-semibold">
                  {txnSummary?.successfulCount || 0} Success / {txnSummary?.failedCount || 0} Failed
                </span>
              </div>

              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg">
                <span className="text-slate-400 font-bold uppercase text-[10px] block">Monthly Earned Commission</span>
                <span className="font-mono font-extrabold text-emerald-700 text-lg">
                  {formatCurrency(commSummary?.monthlyEarned || 0)}
                </span>
                <span className="text-[10px] text-slate-500 block mt-0.5">Retailer plan margin</span>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Governance & Audit */}
        {activeTab === 'governance' && (
          <div className="space-y-3 text-xs bg-white border border-slate-200 rounded-lg p-4">
            <h4 className="font-bold text-slate-700 text-xs uppercase tracking-wider border-b pb-2 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600" /> Audit & Governance Log
            </h4>

            <div className="space-y-2">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Submitted By:</span>
                <span className="font-mono text-slate-800">{retailer.createdByUserId || 'usr_dst_01'} ({retailer.createdByRole || 'DISTRIBUTOR'})</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Submission Timestamp:</span>
                <span className="font-mono text-slate-700">{formatDateTime(retailer.createdAt)}</span>
              </div>
              {retailer.approvedAt && (
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Admin Approved At:</span>
                  <span className="font-mono text-emerald-700 font-bold">{formatDateTime(retailer.approvedAt)}</span>
                </div>
              )}
              {retailer.rejectedAt && (
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Admin Rejected At:</span>
                  <span className="font-mono text-rose-700 font-bold">{formatDateTime(retailer.rejectedAt)}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </Drawer>
  );
};
