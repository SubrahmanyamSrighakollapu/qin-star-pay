'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { KYCDocument } from '@/types/domain';
import { ShieldCheck, ShieldAlert, FileText } from 'lucide-react';

export interface DocumentViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  document: KYCDocument | null;
  onVerify: (docId: string) => void;
  onReject: (docId: string, reason: string) => void;
}

export const DocumentViewerModal: React.FC<DocumentViewerModalProps> = ({
  isOpen,
  onClose,
  document: doc,
  onVerify,
  onReject,
}) => {
  const [rejectionReason, setRejectionReason] = useState('');
  const [isRejecting, setIsRejecting] = useState(false);

  if (!doc) return null;

  const handleVerify = () => {
    onVerify(doc.id);
    onClose();
  };

  const handleConfirmReject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectionReason.trim()) return;
    onReject(doc.id, rejectionReason.trim());
    setRejectionReason('');
    setIsRejecting(false);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Verify ${doc.title}`}
      description={`Document Reference: ${doc.documentNumberMasked}`}
      size="md"
    >
      <div className="space-y-4 text-xs">
        {/* Dummy Document Preview Container */}
        <div className="p-6 bg-slate-900 text-slate-100 rounded-lg flex flex-col items-center justify-center space-y-3 min-h-[220px]">
          <FileText className="w-12 h-12 text-[var(--primary)] animate-pulse" />
          <div className="text-center space-y-1">
            <span className="font-bold text-sm block">{doc.title}</span>
            <span className="font-mono text-xs text-slate-400 block">{doc.documentNumberMasked}</span>
            <span className="text-[10px] text-slate-500 block">Encrypted Document Storage ID: {doc.id}</span>
          </div>
          <div className="px-3 py-1 bg-slate-800 border border-slate-700 rounded text-[11px] text-slate-300">
            [Demo Preview Container — Confidential Verification Copy]
          </div>
        </div>

        <div className="flex justify-between items-center p-3 bg-slate-50 border border-slate-200 rounded-lg">
          <div>
            <span className="text-slate-500 block">Verification Status</span>
            <StatusBadge status={doc.status} size="sm" />
          </div>
          {doc.rejectionReason && (
            <div className="text-rose-800 text-right">
              <strong>Reason:</strong> {doc.rejectionReason}
            </div>
          )}
        </div>

        {isRejecting ? (
          <form onSubmit={handleConfirmReject} className="space-y-3 pt-2 border-t border-slate-200">
            <Input
              label="Reason for Document Rejection *"
              placeholder="e.g. Image blur, document expired, name mismatch"
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              required
            />
            <div className="flex justify-end gap-2">
              <Button variant="outline" size="sm" type="button" onClick={() => setIsRejecting(false)}>
                Cancel
              </Button>
              <Button variant="danger" size="sm" type="submit">
                Confirm Rejection
              </Button>
            </div>
          </form>
        ) : (
          <div className="flex justify-end gap-3 pt-2 border-t border-[var(--border-subtle)]">
            <Button variant="outline" size="sm" onClick={() => setIsRejecting(true)}>
              <ShieldAlert className="w-3.5 h-3.5 mr-1 text-rose-600" />
              Reject Document
            </Button>

            <Button variant="primary" size="sm" onClick={handleVerify}>
              <ShieldCheck className="w-3.5 h-3.5 mr-1" />
              Mark Document Verified
            </Button>
          </div>
        )}
      </div>
    </Modal>
  );
};
