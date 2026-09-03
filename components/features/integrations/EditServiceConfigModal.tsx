'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { ServiceConfiguration } from '@/types/domain';
import { Settings } from 'lucide-react';

export interface EditServiceConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: ServiceConfiguration | null;
  onSave: (id: string, updates: Partial<ServiceConfiguration>) => Promise<void>;
}

export const EditServiceConfigModal: React.FC<EditServiceConfigModalProps> = ({
  isOpen,
  onClose,
  config,
  onSave,
}) => {
  const [minAmount, setMinAmount] = useState(config?.minAmount?.toString() || '1');
  const [maxAmount, setMaxAmount] = useState(config?.maxAmount?.toString() || '100000');
  const [priority, setPriority] = useState(config?.priority?.toString() || '1');
  const [status, setStatus] = useState<'ACTIVE' | 'INACTIVE'>(config?.status || 'ACTIVE');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!config) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const minVal = parseFloat(minAmount) || 0;
    const maxVal = parseFloat(maxAmount) || 0;
    if (minVal > maxVal) return;

    setIsSubmitting(true);
    await onSave(config.id, {
      minAmount: minVal,
      maxAmount: maxVal,
      priority: parseInt(priority) || 1,
      status,
    });
    setIsSubmitting(false);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Configure Service Provider Mapping" size="md">
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
          <div className="font-bold text-slate-900">{config.service} — {config.providerName}</div>
          <div className="text-[11px] text-slate-500">Supported Modes: {config.supportedModes.join(', ')}</div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="Minimum Amount (₹)"
            type="number"
            value={minAmount}
            onChange={(e) => setMinAmount(e.target.value)}
            required
          />

          <Input
            label="Maximum Amount (₹)"
            type="number"
            value={maxAmount}
            onChange={(e) => setMaxAmount(e.target.value)}
            required
          />

          <Input
            label="Service Priority (1 = Highest)"
            type="number"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            required
          />

          <Select
            label="Status"
            value={status}
            onChange={(e) => setStatus(e.target.value as 'ACTIVE' | 'INACTIVE')}
            options={[
              { value: 'ACTIVE', label: 'Active' },
              { value: 'INACTIVE', label: 'Inactive' },
            ]}
          />
        </div>

        <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
          <Button variant="outline" size="sm" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" size="sm" type="submit" isLoading={isSubmitting} leftIcon={<Settings className="w-3.5 h-3.5" />}>
            Save Service Config
          </Button>
        </div>
      </form>
    </Modal>
  );
};
