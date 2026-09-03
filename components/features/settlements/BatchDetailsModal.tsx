'use client';

import React from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { SettlementBatch } from '@/types/domain';
import { formatCurrency, formatDate } from '@/utils/formatters';

export interface BatchDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  batch: SettlementBatch | null;
}

export const BatchDetailsModal: React.FC<BatchDetailsModalProps> = ({
  isOpen,
  onClose,
  batch,
}) => {
  if (!batch) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Settlement Batch — ${batch.batchId}`}
      description="Batch clearance details"
      size="md"
    >
      <div className="space-y-4 text-xs">
        <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
          <div className="flex justify-between py-1 border-b border-slate-200">
            <span className="text-slate-500">Batch ID:</span>
            <span className="font-mono font-bold text-[var(--primary)]">{batch.batchId}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-slate-200">
            <span className="text-slate-500">Clearing Provider:</span>
            <span className="font-semibold">{batch.provider}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-slate-200">
            <span className="text-slate-500">Settlement Count:</span>
            <span className="font-bold text-purple-700">{batch.settlementCount} Settlements</span>
          </div>
          <div className="flex justify-between py-1 border-b border-slate-200">
            <span className="text-slate-500">Gross Volume:</span>
            <span className="font-mono font-semibold">{formatCurrency(batch.grossAmount)}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-slate-200">
            <span className="text-slate-500">Net Settled Amount:</span>
            <span className="font-mono font-extrabold text-emerald-700 text-sm">
              {formatCurrency(batch.netAmount)}
            </span>
          </div>
          <div className="flex justify-between py-1 border-b border-slate-200">
            <span className="text-slate-500">Batch Status:</span>
            <StatusBadge status={batch.status} size="sm" />
          </div>
          <div className="flex justify-between py-1">
            <span className="text-slate-500">Created / Processed:</span>
            <span className="font-medium">{formatDate(batch.createdAt)}</span>
          </div>
        </div>

        <div className="p-3 bg-blue-50/60 border border-blue-200 rounded-lg space-y-1">
          <span className="font-bold text-blue-900 block">Attached Settlement Payload IDs:</span>
          <div className="flex flex-wrap gap-1.5 pt-1">
            {batch.settlementIds.map((id) => (
              <span key={id} className="font-mono font-bold text-[11px] bg-white px-2 py-0.5 border border-blue-200 rounded text-blue-950">
                {id}
              </span>
            ))}
          </div>
        </div>

        <div className="flex justify-end pt-2 border-t border-slate-200">
          <Button variant="primary" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
};
