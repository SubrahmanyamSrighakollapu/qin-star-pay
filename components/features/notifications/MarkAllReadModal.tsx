'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { CheckCircle2, AlertTriangle } from 'lucide-react';

export interface MarkAllReadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  unreadCount: number;
}

export const MarkAllReadModal: React.FC<MarkAllReadModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  unreadCount,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleConfirm = async () => {
    setIsSubmitting(true);
    await onConfirm();
    setIsSubmitting(false);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Mark All Notifications Read" size="md">
      <div className="space-y-4 text-xs">
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-3 text-amber-900">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-sm block">Mark {unreadCount} unread notifications as read?</span>
            <p className="mt-0.5 text-xs text-amber-800 leading-normal">
              This will update the read status for all unread operational alerts across transactions, settlements, KYC, chargebacks, and system logs.
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
          <Button variant="outline" size="sm" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" size="sm" onClick={handleConfirm} isLoading={isSubmitting} leftIcon={<CheckCircle2 className="w-3.5 h-3.5" />}>
            Confirm Mark All Read
          </Button>
        </div>
      </div>
    </Modal>
  );
};
