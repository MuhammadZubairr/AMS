'use client';

import { useRouter } from 'next/navigation';
import { useMe, useLogout } from './useAuthQuery';
import { ROUTES } from '@/constants/routes';
import type { LoginResponse } from '@/types/auth';

/**
 * useAuth Hook
 * Authentication state management and utilities
 * Provides user data, authentication status, and logout functionality
 */

export interface UseAuthReturn {
  user: LoginResponse['user'] | undefined;
  setUser: () => void;
  isAuthenticated: boolean;
  loading: boolean;
  logout: () => Promise<void>;
}

export function useAuth(): UseAuthReturn {
  const router = useRouter();
  const meQuery = useMe();
  const logoutMutation = useLogout();
  
  const logout = async (): Promise<void> => {
    await logoutMutation.mutateAsync();
    router.push(ROUTES.AUTH.LOGIN);
  };

  const isAuthenticated = Boolean(meQuery.data?.user) && meQuery.isSuccess;

  return {
    user: meQuery.data?.user,
    setUser: () => {},
    isAuthenticated,
    // Keep loading true while the `me` query is in-flight to avoid
    // redirecting the user back to login before authentication resolves.
    loading: meQuery.isLoading,
    logout,
  };
}

export default useAuth;
