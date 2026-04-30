'use client';

import useAuth from '@/hooks/useAuth';

export default function Logout() {
  const { logout } = useAuth();

  return (
    <button
      onClick={logout}
      className="rounded-xl border border-slate-300 px-4 py-2 transition hover:bg-slate-100"
    >
      Logout
    </button>
  );
}
