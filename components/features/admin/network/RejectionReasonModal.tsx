import React, { useState } from 'react';
import { Modal, Button, FormField } from '@/components/ui';
import { AlertTriangle } from 'lucide-react';

interface RejectionReasonModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => Promise<void>;
  entityName: string;
  entityCode: string;
  entityType: string;
}

export const RejectionReasonModal: React.FC<RejectionReasonModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  entityName,
  entityCode,
  entityType,
}) => {
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) {
      setError('Please provide a mandatory rejection reason for audit log.');
      return;
    }

    setIsSubmitting(true);
    try {
      await onConfirm(reason.trim());
      setReason('');
      setError('');
      onClose();
    } catch (err) {
      console.error('Rejection failed:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Reject ${entityType} — ${entityCode}`}
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <div>
            <strong className="font-semibold">Rejection Warning:</strong>
            <p className="mt-0.5">
              Rejecting <strong>{entityName}</strong> will block login eligibility and prevent their portal access.
            </p>
          </div>
        </div>

        <FormField label="Rejection Reason *" error={error}>
          <textarea
            value={reason}
            onChange={(e) => {
              setReason(e.target.value);
              if (error) setError('');
            }}
            rows={4}
            placeholder="Specify why this account application is rejected (e.g. Incomplete GST document, invalid PAN registration...)"
            className="w-full p-3 text-xs bg-white text-slate-900 border border-slate-300 rounded-lg focus:outline-hidden focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
          />
        </FormField>

        <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-200">
          <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" variant="danger" isLoading={isSubmitting}>
            Confirm Rejection
          </Button>
        </div>
      </form>
    </Modal>
  );
};
