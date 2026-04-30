'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import useAuth from '@/hooks/useAuth';
import EmployeeSidebar from './Sidebar';

export default function EmployeeLayout({ title, children }) {
  const [isOpen, setIsOpen] = useState(false);
  const { logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-slate-50 text-slate-900">
        <EmployeeSidebar
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          onLogout={handleLogout}
        />

        <div className="md:ml-64">
          <header className="sticky top-0 z-20 border-b border-blue-100 bg-white">
            <div className="flex items-center gap-3 px-4 py-3">
              <button
                type="button"
                aria-label="Open menu"
                onClick={() => setIsOpen(true)}
                className="rounded-lg border border-blue-200 px-3 py-2 text-blue-700 md:hidden"
              >
                Menu
              </button>
              <h1 className="text-xl font-bold text-slate-900">{title}</h1>
            </div>
          </header>

          <section className="mx-auto w-full max-w-xl px-4 py-5 sm:max-w-2xl">
            {children}
          </section>
        </div>
      </main>
    </ProtectedRoute>
  );
}
