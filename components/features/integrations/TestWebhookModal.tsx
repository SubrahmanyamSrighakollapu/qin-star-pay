'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { WebhookConfiguration, TestConnectionResult } from '@/types/domain';
import { providerService } from '@/services/providerService';
import { Send, CheckCircle2 } from 'lucide-react';

export interface TestWebhookModalProps {
  isOpen: boolean;
  onClose: () => void;
  webhook: WebhookConfiguration | null;
}

export const TestWebhookModal: React.FC<TestWebhookModalProps> = ({
  isOpen,
  onClose,
  webhook,
}) => {
  const [isSending, setIsSending] = useState(false);
  const [result, setResult] = useState<TestConnectionResult | null>(null);

  if (!webhook) return null;

  const handleTest = async () => {
    setIsSending(true);
    setResult(null);
    const res = await providerService.testWebhook(webhook.id);
    if (res.success && res.data) {
      setResult(res.data);
    }
    setIsSending(false);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Mock Webhook Event Delivery Test" size="md">
      <div className="space-y-4 text-xs">
        <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
          <div className="font-bold text-slate-900">{webhook.eventType} ({webhook.direction})</div>
          <div className="text-[11px] text-purple-700 font-mono font-bold">Provider: {webhook.providerName}</div>
          <div className="font-mono text-slate-500 truncate">{webhook.endpointUrl}</div>
        </div>

        {isSending && (
          <div className="p-6 text-center space-y-2">
            <Send className="w-6 h-6 text-purple-600 animate-pulse mx-auto" />
            <div className="font-bold text-slate-800">Dispatching Mock Webhook Payload...</div>
            <p className="text-[11px] text-slate-500">Sending simulated POST callback to {webhook.endpointUrl}</p>
          </div>
        )}

        {result && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-900 space-y-1 font-mono text-xs">
            <div className="font-bold font-sans flex items-center gap-1.5 text-emerald-900">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
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
          <Button variant="primary" size="sm" onClick={handleTest} isLoading={isSending} leftIcon={<Send className="w-3.5 h-3.5" />}>
            Dispatch Mock Event
          </Button>
        </div>
      </div>
    </Modal>
  );
};
