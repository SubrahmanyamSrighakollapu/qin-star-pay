'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Provider, ProviderStatus, IntegrationEnvironment } from '@/types/domain';
import { Edit3 } from 'lucide-react';

export interface EditProviderModalProps {
  isOpen: boolean;
  onClose: () => void;
  provider: Provider | null;
  onSave: (id: string, updates: Partial<Provider>) => Promise<void>;
}

export const EditProviderModal: React.FC<EditProviderModalProps> = ({
  isOpen,
  onClose,
  provider,
  onSave,
}) => {
  const [environment, setEnvironment] = useState<IntegrationEnvironment>(provider?.environment || 'PRODUCTION');
  const [status, setStatus] = useState<ProviderStatus>(provider?.status || 'ACTIVE');
  const [priority, setPriority] = useState(provider?.priority?.toString() || '1');
  const [timeout, setTimeoutVal] = useState(provider?.timeout?.toString() || '3000');
  const [baseUrl, setBaseUrl] = useState(provider?.baseUrl || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!provider) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await onSave(provider.id, {
      environment,
      status,
      priority: parseInt(priority) || 1,
      timeout: parseInt(timeout) || 3000,
      baseUrl,
    });
    setIsSubmitting(false);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Provider Settings" size="md">
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
          <div className="font-bold text-slate-900">{provider.name}</div>
          <div className="font-mono text-[11px] text-purple-700">{provider.code} • {provider.providerType}</div>
        </div>

        <Input
          label="Base API URL"
          value={baseUrl}
          onChange={(e) => setBaseUrl(e.target.value)}
          required
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Select
            label="Environment"
            value={environment}
            onChange={(e) => setEnvironment(e.target.value as IntegrationEnvironment)}
            options={[
              { value: 'PRODUCTION', label: 'Production' },
              { value: 'SANDBOX', label: 'Sandbox' },
              { value: 'DEMO', label: 'Demo' },
            ]}
          />

          <Select
            label="Provider Status"
            value={status}
            onChange={(e) => setStatus(e.target.value as ProviderStatus)}
            options={[
              { value: 'ACTIVE', label: 'Active' },
              { value: 'INACTIVE', label: 'Inactive' },
              { value: 'MAINTENANCE', label: 'Maintenance' },
            ]}
          />

          <Input
            label="Failover Priority (1 = Highest)"
            type="number"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            required
          />

          <Input
            label="Gateway Timeout (ms)"
            type="number"
            value={timeout}
            onChange={(e) => setTimeoutVal(e.target.value)}
            required
          />
        </div>

        <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
          <Button variant="outline" size="sm" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" size="sm" type="submit" isLoading={isSubmitting} leftIcon={<Edit3 className="w-3.5 h-3.5" />}>
            Save Changes
          </Button>
        </div>
      </form>
    </Modal>
  );
};
