'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShieldAlert, ArrowLeft, LayoutDashboard } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export interface AccessDeniedProps {
  message?: string;
  requiredPermission?: string;
}

export const AccessDenied: React.FC<AccessDeniedProps> = ({
  message = 'You do not have permission to access this resource or administrative workspace.',
  requiredPermission,
}) => {
  const router = Router();

  function Router() {
    return useRouter();
  }

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
      <div className="w-16 h-16 rounded-full bg-rose-50 border border-rose-200 flex items-center justify-center mb-4 shadow-xs">
        <ShieldAlert className="w-8 h-8 text-rose-600" />
      </div>

      <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">403 — Access Denied</h1>
      <p className="mt-2 text-sm text-slate-600 max-w-md leading-relaxed">{message}</p>

      {requiredPermission && (
        <div className="mt-3 px-3 py-1 bg-slate-100 border border-slate-200 rounded text-xs font-mono text-slate-700">
          Required Permission Token: <strong>{requiredPermission}</strong>
        </div>
      )}

      <div className="mt-6 flex items-center gap-3">
        <Button variant="outline" size="sm" onClick={() => router.back()} leftIcon={<ArrowLeft className="w-4 h-4" />}>
          Go Back
        </Button>
        <Link href="/dashboard">
          <Button variant="primary" size="sm" leftIcon={<LayoutDashboard className="w-4 h-4" />}>
            Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
};
