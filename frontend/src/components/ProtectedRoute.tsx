'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useAuth from '@/hooks/useAuth';
import type { ProtectedRouteProps } from '@/types/components';
import { ROUTES } from '@/constants/routes';

/**
 * ProtectedRoute Component
 * Wraps routes that require authentication
 * Redirects to login if user is not authenticated
 * Shows loading shell during auth state resolution
 */
export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter();
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push(ROUTES.AUTH.LOGIN);
    }
  }, [isAuthenticated, loading, router]);

  // Render loading shell while auth state settles (avoids blank screen)
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-slate-600 font-medium">Preparing your dashboard...</p>
          <p className="text-xs text-slate-500">Loading your profile and data</p>
        </div>
      </div>
    );
  }

  // Unauthenticated users should have already been redirected,
  // but render nothing if somehow still here (shouldn't happen)
  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
