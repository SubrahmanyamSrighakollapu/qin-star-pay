import React, { useState } from 'react';
import { Eye, EyeOff, Copy, Check } from 'lucide-react';
import { maskBankAccount, maskApiKey, maskPhoneNumber, maskEmail, maskPan, maskGst } from '@/utils/masking';
import { cn } from '@/utils/cn';

export type MaskType = 'bankAccount' | 'apiKey' | 'phone' | 'email' | 'pan' | 'gst' | 'custom';

export interface MaskedValueProps {
  value: string;
  type?: MaskType;
  canToggle?: boolean;
  canCopy?: boolean;
  className?: string;
  maskChar?: string;
}

export const MaskedValue: React.FC<MaskedValueProps> = ({
  value,
  type = 'custom',
  canToggle = true,
  canCopy = true,
  className,
}) => {
  const [isRevealed, setIsRevealed] = useState(false);
  const [copied, setCopied] = useState(false);

  const getMaskedDisplay = () => {
    switch (type) {
      case 'bankAccount':
        return maskBankAccount(value);
      case 'apiKey':
        return maskApiKey(value);
      case 'phone':
        return maskPhoneNumber(value);
      case 'email':
        return maskEmail(value);
      case 'pan':
        return maskPan(value);
      case 'gst':
        return maskGst(value);
      default:
        if (!value) return '••••';
        return value.length > 4 ? `••••••••${value.slice(-4)}` : '••••••••';
    }
  };

  const handleCopy = () => {
    if (!value) return;
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={cn('inline-flex items-center gap-1.5 text-xs font-mono text-[var(--text-secondary)]', className)}>
      <span className="tabular-nums font-semibold tracking-wider">
        {isRevealed ? value : getMaskedDisplay()}
      </span>

      {canToggle && (
        <button
          type="button"
          onClick={() => setIsRevealed((prev) => !prev)}
          className="p-1 text-[var(--text-muted)] hover:text-[var(--text-primary)] rounded-xs hover:bg-[var(--bg-secondary)] transition-colors cursor-pointer"
          title={isRevealed ? 'Mask value' : 'Reveal sensitive value'}
          aria-label={isRevealed ? 'Mask value' : 'Reveal sensitive value'}
        >
          {isRevealed ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
        </button>
      )}

      {canCopy && (
        <button
          type="button"
          onClick={handleCopy}
          className="p-1 text-[var(--text-muted)] hover:text-[var(--text-primary)] rounded-xs hover:bg-[var(--bg-secondary)] transition-colors cursor-pointer"
          title="Copy full value"
          aria-label="Copy full value"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
        </button>
      )}
    </div>
  );
};
