'use client';

import React, { useState } from 'react';
import { Table } from '@/components/ui/Table';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Pagination } from '@/components/ui/Pagination';
import { ColumnDefinition } from '@/types/common';
import { DebitRequest, PaginationState } from '@/types/domain';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { CheckCircle2, XCircle, ArrowRight, Eye } from 'lucide-react';

export interface DebitRequestsTableProps {
  requests: DebitRequest[];
  pagination: PaginationState;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  onReviewRequest: (requestId: string, action: 'APPROVE' | 'REJECT' | 'PROCESS', remarks?: string) => Promise<void>;
  isLoading?: boolean;
}

export const DebitRequestsTable: React.FC<DebitRequestsTableProps> = ({
  requests,
  pagination,
  onPageChange,
  onPageSizeChange,
  onReviewRequest,
  isLoading = false,
}) => {
  const [selectedRequest, setSelectedRequest] = useState<DebitRequest | null>(null);
  const [reviewAction, setReviewAction] = useState<'APPROVE' | 'REJECT' | 'PROCESS' | null>(null);
  const [viewingDetailRequest, setViewingDetailRequest] = useState<DebitRequest | null>(null);
  const [remarks, setRemarks] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOpenReviewModal = (r: DebitRequest, action: 'APPROVE' | 'REJECT' | 'PROCESS') => {
    setSelectedRequest(r);
    setReviewAction(action);
    setRemarks('');
  };

  const handleConfirmReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRequest || !reviewAction) return;
    setIsSubmitting(true);
    try {
      await onReviewRequest(selectedRequest.id, reviewAction, remarks);
      setSelectedRequest(null);
      setReviewAction(null);
    } catch {
      // Fallback
    } finally {
      setIsSubmitting(false);
    }
  };

  const columns: ColumnDefinition<DebitRequest>[] = [
    {
      key: 'id',
      header: 'Request ID',
      render: (row) => (
        <span className="font-mono font-bold text-[var(--primary)] text-xs">{row.id}</span>
      ),
    },
    {
      key: 'entityName',
      header: 'Entity / Wallet',
      render: (row) => (
        <div>
          <div className="font-semibold text-xs text-slate-900">{row.entityName}</div>
          <div className="text-[11px] font-mono text-slate-500">{row.walletId}</div>
        </div>
      ),
    },
    {
      key: 'amount',
      header: 'Requested Amount',
      align: 'right',
      render: (row) => (
        <span className="font-mono font-extrabold text-xs text-rose-700">
          {formatCurrency(row.amount)}
        </span>
      ),
    },
    {
      key: 'reason',
      header: 'Reason',
      render: (row) => (
        <span className="text-xs text-slate-700 font-medium">{row.reason}</span>
      ),
    },
    {
      key: 'requestedBy',
      header: 'Requested By',
      render: (row) => (
        <div>
          <div className="text-xs text-slate-800 font-medium">{row.requestedBy}</div>
          <div className="text-[11px] text-slate-400">{formatDate(row.requestedAt)}</div>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      align: 'center',
      render: (row) => <StatusBadge status={row.status} size="sm" />,
    },
  ];

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto border border-[var(--border)] rounded-[var(--radius-xl)] bg-white shadow-xs">
        <Table
          columns={columns}
          data={requests}
          keyExtractor={(row) => row.id}
          isLoading={isLoading}
          renderActions={(row) => (
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setViewingDetailRequest(row)}
                title="View Audit Details"
                aria-label="View Audit Details"
                className="px-2"
              >
                <Eye className="w-3.5 h-3.5 text-slate-600" />
              </Button>

              {row.status === 'PENDING' && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleOpenReviewModal(row, 'REJECT')}
                    className="px-2 text-rose-600"
                    title="Reject Request"
                    aria-label="Reject Request"
                  >
                    <XCircle className="w-3.5 h-3.5 mr-1" /> Reject
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleOpenReviewModal(row, 'APPROVE')}
                    className="px-2"
                    title="Approve Request"
                    aria-label="Approve Request"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Approve
                  </Button>
                </>
              )}

              {row.status === 'APPROVED' && (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleOpenReviewModal(row, 'PROCESS')}
                  leftIcon={<ArrowRight className="w-3.5 h-3.5" />}
                  title="Process & Debit Wallet"
                  aria-label="Process & Debit Wallet"
                >
                  Process & Debit
                </Button>
              )}
            </div>
          )}
        />
      </div>

      <Pagination
        currentPage={pagination.page}
        totalPages={pagination.totalPages}
        totalItems={pagination.totalItems}
        pageSize={pagination.pageSize}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
      />

      {/* Review Modal */}
      <Modal
        isOpen={!!selectedRequest && !!reviewAction}
        onClose={() => setSelectedRequest(null)}
        title={`Confirm Debit Request ${reviewAction}`}
        description={selectedRequest ? `Target Request: ${selectedRequest.id}` : ''}
        size="sm"
      >
        {selectedRequest && reviewAction && (
          <form onSubmit={handleConfirmReview} className="space-y-4 text-xs">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-500">Entity Name:</span>
                <span className="font-bold">{selectedRequest.entityName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Requested Amount:</span>
                <span className="font-mono font-bold text-rose-700">{formatCurrency(selectedRequest.amount)}</span>
              </div>
            </div>

            <Input
              label="Reviewer Remarks / Feedback *"
              placeholder="e.g. Approved per finance committee review"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              required
            />

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
              <Button variant="outline" size="sm" type="button" onClick={() => setSelectedRequest(null)}>
                Cancel
              </Button>
              <Button
                variant={reviewAction === 'REJECT' ? 'danger' : 'primary'}
                size="sm"
                type="submit"
                isLoading={isSubmitting}
              >
                Confirm {reviewAction}
              </Button>
            </div>
          </form>
        )}
      </Modal>

      {/* View Debit Request Audit Details Modal */}
      <Modal
        isOpen={!!viewingDetailRequest}
        onClose={() => setViewingDetailRequest(null)}
        title="Debit Request Audit Details"
        description={viewingDetailRequest ? `Request Reference: ${viewingDetailRequest.id}` : ''}
        size="sm"
      >
        {viewingDetailRequest && (
          <div className="space-y-4 text-xs">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-500">Request ID:</span>
                <span className="font-mono font-bold text-[var(--primary)]">{viewingDetailRequest.id}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-500">Entity Name:</span>
                <span className="font-semibold">{viewingDetailRequest.entityName}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-500">Target Wallet ID:</span>
                <span className="font-mono">{viewingDetailRequest.walletId}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-500">Requested Amount:</span>
                <span className="font-mono font-bold text-rose-700">{formatCurrency(viewingDetailRequest.amount)}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-500">Request Status:</span>
                <StatusBadge status={viewingDetailRequest.status} size="sm" />
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Requested By & Date:</span>
                <span className="font-medium">{viewingDetailRequest.requestedBy} ({formatDate(viewingDetailRequest.requestedAt)})</span>
              </div>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-500">Reason:</span>
                <span className="font-semibold">{viewingDetailRequest.reason}</span>
              </div>
              {viewingDetailRequest.remarks && (
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-500">Remarks:</span>
                  <span>{viewingDetailRequest.remarks}</span>
                </div>
              )}
              {viewingDetailRequest.reviewedBy && (
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-500">Reviewed By:</span>
                  <span>{viewingDetailRequest.reviewedBy} ({viewingDetailRequest.reviewedAt ? formatDate(viewingDetailRequest.reviewedAt) : '—'})</span>
                </div>
              )}
              {viewingDetailRequest.processedAt && (
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Processed Date:</span>
                  <span className="font-mono text-emerald-700">{formatDate(viewingDetailRequest.processedAt)}</span>
                </div>
              )}
              {viewingDetailRequest.rejectedBy && (
                <div className="flex justify-between py-1 text-rose-700">
                  <span className="text-slate-500">Rejected By:</span>
                  <span>{viewingDetailRequest.rejectedBy} ({viewingDetailRequest.rejectedAt ? formatDate(viewingDetailRequest.rejectedAt) : '—'})</span>
                </div>
              )}
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-200">
              <Button variant="primary" size="sm" onClick={() => setViewingDetailRequest(null)}>
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
