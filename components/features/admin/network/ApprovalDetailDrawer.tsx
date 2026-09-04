import React from 'react';
import { PendingApprovalItem } from '@/services/approvalService';
import { Drawer, StatusBadge, Button } from '@/components/ui';
import { formatDateTime } from '@/utils/formatters';
import {
  Building2,
  User,
  Mail,
  Phone,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Network,
  Clock,
  Percent,
} from 'lucide-react';

interface ApprovalDetailDrawerProps {
  item: PendingApprovalItem | null;
  isOpen: boolean;
  onClose: () => void;
  onApprove: (item: PendingApprovalItem) => void;
  onReject: (item: PendingApprovalItem) => void;
}

export const ApprovalDetailDrawer: React.FC<ApprovalDetailDrawerProps> = ({
  item,
  isOpen,
  onClose,
  onApprove,
  onReject,
}) => {
  if (!item) return null;

  const isDistributor = item.entityType === 'DISTRIBUTOR';

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      size="xl"
      title={
        <div className="flex items-center gap-2">
          <span>{item.name}</span>
          <span className="font-mono text-xs px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 font-semibold border border-indigo-200">
            {item.code}
          </span>
        </div>
      }
      description={`${item.businessName} • ${item.entityType}`}
      footer={
        <div className="flex items-center justify-between w-full">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>

          {item.approvalStatus === 'PENDING_APPROVAL' && (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  onClose();
                  onReject(item);
                }}
                leftIcon={<XCircle className="w-4 h-4 text-rose-600" />}
                className="text-rose-600 border-rose-200 hover:bg-rose-50"
              >
                Reject Request
              </Button>

              <Button
                variant="primary"
                onClick={() => {
                  onClose();
                  onApprove(item);
                }}
                leftIcon={<CheckCircle2 className="w-4 h-4" />}
              >
                Approve & Activate
              </Button>
            </div>
          )}
        </div>
      }
    >
      <div className="space-y-6">
        {/* Status Header */}
        <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div>
              <p className="text-xs text-slate-500 font-medium">Approval Status</p>
              <div className="mt-1">
                <StatusBadge
                  status={item.approvalStatus}
                  label={
                    item.approvalStatus === 'PENDING_APPROVAL'
                      ? 'Pending Admin Approval'
                      : item.approvalStatus === 'REJECTED'
                      ? 'Rejected'
                      : 'Approved'
                  }
                />
              </div>
            </div>
            <div className="h-8 w-px bg-slate-300" />
            <div>
              <p className="text-xs text-slate-500 font-medium">KYC Status</p>
              <div className="mt-1">
                <StatusBadge status={item.kycStatus || 'APPROVED'} />
              </div>
            </div>
          </div>

          <div className="text-right">
            <p className="text-xs text-slate-500 font-medium">Submitted On</p>
            <p className="text-xs font-semibold text-slate-700 mt-1 flex items-center gap-1 justify-end">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              {formatDateTime(item.createdAt)}
            </p>
          </div>
        </div>

        {/* Creator Info Alert */}
        <div className="p-4 rounded-xl border border-indigo-200 bg-indigo-50/50 space-y-1 text-xs">
          <p className="font-bold text-indigo-900 uppercase tracking-wider flex items-center gap-1.5">
            <Network className="w-4 h-4 text-indigo-600" /> Source & Creator Metadata
          </p>
          <div className="grid grid-cols-2 gap-2 pt-1 text-slate-700">
            <div>
              <span className="text-slate-500">Created By User ID:</span>{' '}
              <span className="font-mono text-slate-900 font-semibold">{item.createdByUserId}</span>
            </div>
            <div>
              <span className="text-slate-500">Creator Role:</span>{' '}
              <span className="font-semibold text-slate-900">{item.createdByRole}</span>
            </div>
            <div>
              <span className="text-slate-500">Parent Master Distributor:</span>{' '}
              <span className="font-semibold text-slate-900">
                {item.parentMasterDistributorName} ({item.parentMasterDistributorCode})
              </span>
            </div>
            {!isDistributor && (
              <div>
                <span className="text-slate-500">Parent Distributor:</span>{' '}
                <span className="font-semibold text-slate-900">
                  {item.parentDistributorName} ({item.parentDistributorCode})
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Profile & Business Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-lg border border-slate-200 bg-white space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100 text-xs font-bold text-slate-600 uppercase tracking-wider">
              <User className="w-4 h-4 text-indigo-600" /> Contact Profile
            </div>
            <div className="space-y-2 text-xs">
              <div>
                <span className="text-slate-500">Full Name:</span>{' '}
                <span className="font-semibold text-slate-900">{item.name}</span>
              </div>
              <div>
                <span className="text-slate-500">Email:</span>{' '}
                <span className="font-mono text-slate-800">{item.email}</span>
              </div>
              <div>
                <span className="text-slate-500">Mobile:</span>{' '}
                <span className="font-mono text-slate-800">{item.mobile}</span>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-lg border border-slate-200 bg-white space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100 text-xs font-bold text-slate-600 uppercase tracking-wider">
              <Building2 className="w-4 h-4 text-indigo-600" /> Business Credentials
            </div>
            <div className="space-y-2 text-xs">
              <div>
                <span className="text-slate-500">Business Entity Name:</span>{' '}
                <span className="font-semibold text-slate-900">{item.businessName}</span>
              </div>
              <div>
                <span className="text-slate-500">Entity Type:</span>{' '}
                <span className="text-slate-800">{item.entityType}</span>
              </div>
              {item.planId && (
                <div>
                  <span className="text-slate-500">Assigned Retailer Plan ID:</span>{' '}
                  <span className="font-mono text-indigo-700 font-semibold">{item.planId}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Rejection Metadata if rejected */}
        {item.approvalStatus === 'REJECTED' && (item.rawEntity as any).rejectionReason && (
          <div className="p-4 rounded-xl border border-rose-200 bg-rose-50 text-xs space-y-1">
            <p className="font-bold text-rose-900 uppercase tracking-wider flex items-center gap-1.5">
              <XCircle className="w-4 h-4 text-rose-600" /> Rejection Decision Metadata
            </p>
            <p className="text-slate-700 pt-1">
              <strong>Reason:</strong> {(item.rawEntity as any).rejectionReason}
            </p>
            {(item.rawEntity as any).rejectedByUserId && (
              <p className="text-slate-500">
                Rejected by: {(item.rawEntity as any).rejectedByUserId} at{' '}
                {formatDateTime((item.rawEntity as any).rejectedAt)}
              </p>
            )}
          </div>
        )}
      </div>
    </Drawer>
  );
};
