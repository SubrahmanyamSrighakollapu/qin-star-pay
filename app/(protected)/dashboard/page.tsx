'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { getDefaultRouteForRole } from '@/services/mockAuthService';

export default function LegacyDashboardRedirect() {
  const router = useRouter();
  const { session } = useAuth();

  useEffect(() => {
    if (session?.role) {
      router.replace(getDefaultRouteForRole(session.role));
    } else {
      router.replace('/admin/dashboard');
    }
  }, [session, router]);

  return null;
}
