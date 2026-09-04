import React from 'react';
import Link from 'next/link';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';
import { getDefaultRouteForRole } from '@/services/mockAuthService';

export interface AccessDeniedViewProps {
  message?: string;
}

export const AccessDeniedView: React.FC<AccessDeniedViewProps> = ({
  message = 'You do not have permission to access this page. Your authenticated role does not have authorization for this area.',
}) => {
  const { session } = useAuth();
  const defaultRoute = session ? getDefaultRouteForRole(session.role) : '/login';

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
      <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-600 border border-rose-200 flex items-center justify-center mb-5 shadow-xs">
        <ShieldAlert className="w-8 h-8" />
      </div>

      <span className="text-xs font-extrabold uppercase tracking-widest text-rose-600 mb-1">
        403 — Access Denied
      </span>

      <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)] tracking-tight mb-3">
        Unauthorized Area Access
      </h1>

      <p className="text-xs sm:text-sm text-[var(--text-muted)] max-w-md leading-relaxed mb-6">
        {message}
      </p>

      <Link href={defaultRoute}>
        <Button variant="primary" leftIcon={<ArrowLeft className="w-4 h-4" />}>
          Go to My Dashboard
        </Button>
      </Link>
    </div>
  );
};
