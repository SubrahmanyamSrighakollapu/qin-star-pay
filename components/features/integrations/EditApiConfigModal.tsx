'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { ApiConfiguration, AuthType } from '@/types/domain';
import { Key, Lock } from 'lucide-react';

export interface EditApiConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: ApiConfiguration | null;
  onSave: (id: string, updates: Partial<ApiConfiguration>) => Promise<void>;
}

export const EditApiConfigModal: React.FC<EditApiConfigModalProps> = ({
  isOpen,
  onClose,
  config,
  onSave,
}) => {
  const [authType, setAuthType] = useState<AuthType>(config?.authType || 'API_KEY');
  const [baseUrl, setBaseUrl] = useState(config?.baseUrl || '');
  const [timeout, setTimeoutVal] = useState(config?.timeout?.toString() || '3000');
  const [retryCount, setRetryCount] = useState(config?.retryCount?.toString() || '3');
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [secretInput, setSecretInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!config) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const updates: Partial<ApiConfiguration> = {
      authType,
      baseUrl,
      timeout: parseInt(timeout) || 3000,
      retryCount: parseInt(retryCount) || 3,
    };

    if (apiKeyInput.trim()) {
      const len = apiKeyInput.trim().length;
      updates.apiKeyMasked = `••••••••${apiKeyInput.trim().slice(Math.max(0, len - 4))}`;
    }
    if (secretInput.trim()) {
      const len = secretInput.trim().length;
      updates.clientSecretMasked = `••••••••••••${secretInput.trim().slice(Math.max(0, len - 4))}`;
    }

    await onSave(config.id, updates);
    setIsSubmitting(false);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Configure API Credentials" size="md">
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
          <div className="font-bold text-slate-900">{config.providerName}</div>
          <div className="font-mono text-[11px] text-purple-700">Environment: {config.environment}</div>
        </div>

        <Input
          label="Base API URL"
          value={baseUrl}
          onChange={(e) => setBaseUrl(e.target.value)}
          required
        />

        <Select
          label="Authentication Type"
          value={authType}
          onChange={(e) => setAuthType(e.target.value as AuthType)}
          options={[
            { value: 'API_KEY', label: 'API Key Header' },
            { value: 'BEARER_TOKEN', label: 'Bearer Token' },
            { value: 'BASIC_AUTH', label: 'Basic Auth' },
            { value: 'OAUTH', label: 'OAuth 2.0 Client Credentials' },
            { value: 'CUSTOM', label: 'Custom Token Signature' },
          ]}
        />

        {/* Masked Secret Input Notice */}
        <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg space-y-2">
          <div className="font-bold text-purple-900 flex items-center gap-1.5 font-sans">
            <Lock className="w-3.5 h-3.5 text-purple-700" />
            <span>Encrypted Secret Key Masking</span>
          </div>

          <Input
            label="Update API Key (Leave blank to keep existing masked key)"
            type="password"
            placeholder={config.apiKeyMasked || '••••••••••••'}
            value={apiKeyInput}
            onChange={(e) => setApiKeyInput(e.target.value)}
          />

          <Input
            label="Update Client Secret (Leave blank to keep existing masked secret)"
            type="password"
            placeholder={config.clientSecretMasked || '••••••••••••'}
            value={secretInput}
            onChange={(e) => setSecretInput(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="Timeout (ms)"
            type="number"
            value={timeout}
            onChange={(e) => setTimeoutVal(e.target.value)}
            required
          />

          <Input
            label="Retry Count"
            type="number"
            value={retryCount}
            onChange={(e) => setRetryCount(e.target.value)}
            required
          />
        </div>

        <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
          <Button variant="outline" size="sm" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" size="sm" type="submit" isLoading={isSubmitting} leftIcon={<Key className="w-3.5 h-3.5" />}>
            Save Credentials
          </Button>
        </div>
      </form>
    </Modal>
  );
};
