'use client';

import useAuth from '@/hooks/useAuth';
import type { LogoutProps } from '@/types/components';

/**
 * Logout Button Component
 * Handles user logout action and navigation
 */
export default function Logout({ className = '', onLogout }: LogoutProps) {
  const { logout } = useAuth();

  const handleLogout = async (): Promise<void> => {
    await logout();
    onLogout?.();
  };

  return (
    <button
      onClick={handleLogout}
      className={`rounded-xl border border-slate-300 px-4 py-2 transition hover:bg-slate-100 ${className}`}
    >
      Logout
    </button>
  );
}
