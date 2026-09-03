'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';
import { cn } from '@/utils/cn';

export type ToastVariant = 'success' | 'error' | 'warning' | 'info';

export interface ToastItem {
  id: string;
  message: string;
  variant: ToastVariant;
}

interface ToastContextType {
  showToast: (message: string, variant?: ToastVariant) => void;
  toastSuccess: (message: string) => void;
  toastError: (message: string) => void;
  toastWarning: (message: string) => void;
  toastInfo: (message: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback((message: string, variant: ToastVariant = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, variant }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  }, [removeToast]);

  const toastSuccess = useCallback((message: string) => showToast(message, 'success'), [showToast]);
  const toastError = useCallback((message: string) => showToast(message, 'error'), [showToast]);
  const toastWarning = useCallback((message: string) => showToast(message, 'warning'), [showToast]);
  const toastInfo = useCallback((message: string) => showToast(message, 'info'), [showToast]);

  const iconMap: Record<ToastVariant, ReactNode> = {
    success: <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />,
    error: <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />,
    warning: <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />,
    info: <Info className="w-4 h-4 text-blue-600 shrink-0" />,
  };

  const bgMap: Record<ToastVariant, string> = {
    success: 'bg-emerald-50 border-emerald-200 text-emerald-950',
    error: 'bg-rose-50 border-rose-200 text-rose-950',
    warning: 'bg-amber-50 border-amber-200 text-amber-950',
    info: 'bg-blue-50 border-blue-200 text-blue-950',
  };

  return (
    <ToastContext.Provider value={{ showToast, toastSuccess, toastError, toastWarning, toastInfo }}>
      {children}
      {/* Floating Toast Portal Container */}
      <div className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-2.5 max-w-md pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={cn(
              'pointer-events-auto flex items-center justify-between gap-3 px-4 py-3 rounded-xl border shadow-lg text-xs font-semibold animate-in slide-in-from-bottom-5 duration-200',
              bgMap[toast.variant]
            )}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              {iconMap[toast.variant]}
              <span className="truncate">{toast.message}</span>
            </div>
            <button
              type="button"
              onClick={() => removeToast(toast.id)}
              className="p-1 hover:bg-black/5 rounded transition-colors text-slate-500 hover:text-slate-900 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    // Fallback if rendered outside provider
    return {
      showToast: (m: string) => console.log('Toast:', m),
      toastSuccess: (m: string) => console.log('Success Toast:', m),
      toastError: (m: string) => console.log('Error Toast:', m),
      toastWarning: (m: string) => console.log('Warning Toast:', m),
      toastInfo: (m: string) => console.log('Info Toast:', m),
    };
  }
  return context;
};
