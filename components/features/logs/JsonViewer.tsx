'use client';

import React, { useState } from 'react';
import { sanitizeJsonPayload } from '@/utils/masking';
import { Copy, Check, ChevronDown, ChevronRight } from 'lucide-react';

export interface JsonViewerProps {
  title?: string;
  data: unknown;
  initiallyExpanded?: boolean;
}

export const JsonViewer: React.FC<JsonViewerProps> = ({
  title = 'Payload JSON',
  data,
  initiallyExpanded = true,
}) => {
  const [isExpanded, setIsExpanded] = useState(initiallyExpanded);
  const [isCopied, setIsCopied] = useState(false);

  const sanitizedData = sanitizeJsonPayload(data);
  const jsonString = JSON.stringify(sanitizedData, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="border border-slate-200 rounded-lg overflow-hidden bg-slate-900 text-slate-100 text-xs font-mono">
      <div className="px-3 py-2 bg-slate-800 border-b border-slate-700 flex items-center justify-between font-sans">
        <button
          type="button"
          onClick={() => setIsExpanded((prev) => !prev)}
          className="flex items-center gap-1.5 font-bold text-xs text-slate-200 hover:text-white cursor-pointer"
        >
          {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
          <span>{title}</span>
        </button>

        <button
          type="button"
          onClick={handleCopy}
          className="px-2 py-0.5 bg-slate-700 hover:bg-slate-600 rounded text-[11px] font-semibold text-slate-200 flex items-center gap-1 cursor-pointer"
        >
          {isCopied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-slate-300" />}
          <span>{isCopied ? 'Copied' : 'Copy JSON'}</span>
        </button>
      </div>

      {isExpanded && (
        <div className="p-3 overflow-x-auto max-h-80 no-scrollbar">
          <pre className="text-[11px] leading-relaxed text-emerald-300 whitespace-pre-wrap">{jsonString}</pre>
        </div>
      )}
    </div>
  );
};
