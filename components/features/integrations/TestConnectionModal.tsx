'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Provider, TestConnectionResult } from '@/types/domain';
import { Activity, CheckCircle2, AlertTriangle } from 'lucide-react';

export interface TestConnectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  provider: Provider | null;
  onTestConnection: (providerId: string) => Promise<TestConnectionResult>;
}

export const TestConnectionModal: React.FC<TestConnectionModalProps> = ({
  isOpen,
  onClose,
  provider,
  onTestConnection,
}) => {
  const [isTesting, setIsTesting] = useState(false);
  const [result, setResult] = useState<TestConnectionResult | null>(null);

  if (!provider) return null;

  const handleTest = async () => {
    setIsTesting(true);
    setResult(null);
    const res = await onTestConnection(provider.id);
    setResult(res);
    setIsTesting(false);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Test Gateway Connection" size="md">
      <div className="space-y-4 text-xs">
        <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
          <div className="font-bold text-slate-900">{provider.name}</div>
          <div className="font-mono text-[11px] text-purple-700">{provider.code} • {provider.environment}</div>
          <div className="font-mono text-slate-500 truncate">{provider.baseUrl}</div>
        </div>

        {isTesting && (
          <div className="p-6 text-center space-y-2">
            <Activity className="w-6 h-6 text-blue-600 animate-spin mx-auto" />
            <div className="font-bold text-slate-800">Pinging Gateway Endpoint...</div>
            <p className="text-[11px] text-slate-500">Sending test ping payload to {provider.baseUrl}</p>
          </div>
        )}

        {result && (
          <div
            className={`p-3 border rounded-lg space-y-1.5 font-mono text-xs ${
              result.success
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                : 'bg-rose-50 border-rose-200 text-rose-900'
            }`}
          >
            <div className="font-bold font-sans flex items-center gap-1.5">
              {result.success ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertTriangle className="w-4 h-4 text-rose-600" />}
              <span>{result.message}</span>
            </div>
            <div className="flex justify-between text-[11px] pt-1">
              <span>HTTP Status: <strong>{result.httpStatus}</strong></span>
              <span>Response Time: <strong>{result.responseTimeMs}ms</strong></span>
            </div>
          </div>
        )}

        <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
          <Button variant="outline" size="sm" type="button" onClick={onClose}>
            Close
          </Button>
          <Button variant="primary" size="sm" onClick={handleTest} isLoading={isTesting} leftIcon={<Activity className="w-3.5 h-3.5" />}>
            Run Ping Test
          </Button>
        </div>
      </div>
    </Modal>
  );
};
