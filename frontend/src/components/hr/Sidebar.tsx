'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useState } from 'react';
import BrandLogo from '../BrandLogo';
import { SuperAdminIcon } from '@/components/superadmin/Icon';
import { AUTH_STORAGE_KEYS } from '@/constants/auth';

export default function HRSidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isLogoutLoading, setIsLogoutLoading] = useState(false);

  const handleLogout = async () => {
    setIsLogoutLoading(true);
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      if (typeof window !== 'undefined') sessionStorage.removeItem(AUTH_STORAGE_KEYS.authToken);
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setIsLogoutLoading(false);
    }
  };

  const menuItems = [
    { id: 'dashboard', name: 'Dashboard', href: '/hr/dashboard', icon: 'dashboard' },
    { id: 'employees', name: 'Employees', href: '/hr/employees', icon: 'users' },
    { id: 'attendance', name: 'Attendance', href: '/hr/attendance', icon: 'attendance' },
    { id: 'reports', name: 'Reports', href: '/hr/reports', icon: 'reports' },
    { id: 'leaves', name: 'Leave Approvals', href: '/hr/leaves', icon: 'check' },
    { id: 'profile', name: 'Profile', href: '/hr/profile', icon: 'profile' },
  ];

  return (
    <>
      <div
        className={`fixed inset-0 z-30 bg-black/50 transition-opacity duration-300 md:hidden ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      <aside
        className={`fixed left-0 top-0 z-40 h-screen w-64 transform border-r border-slate-200 bg-white text-slate-800 shadow-sm transition-[transform,box-shadow] duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex h-16 items-center justify-between border-b border-slate-100 px-4 md:px-5">
            <div className="flex items-center gap-3 overflow-hidden">
              <BrandLogo subtitle="Human Resources" />
            </div>
            <button
              type="button"
              className="rounded-xl p-2 text-slate-500 transition hover:bg-slate-100 md:hidden"
              onClick={onClose}
              aria-label="Close sidebar"
            >
              <SuperAdminIcon name="collapse" className="h-5 w-5 rotate-180" />
            </button>
          </div>

          <nav className="flex-1 min-h-0 space-y-1 p-3 pr-2 overflow-y-auto">
            {menuItems.map((item) => {
              const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  onClick={onClose}
                  className={`relative group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:shadow-sm ${
                    isActive
                      ? 'bg-[#2563EB] text-white shadow-lg shadow-blue-600/20'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                  title={item.name}
                >
                  {isActive && <span className="absolute left-0 top-1/2 -translate-y-1/2 h-10 w-1 rounded-r-full bg-[#2563EB]" />}
                  <span className={`flex h-10 w-10 min-w-[40px] items-center justify-center rounded-lg ${isActive ? 'bg-white/15' : 'bg-slate-100 text-slate-500 group-hover:bg-white'}`}>
                    <SuperAdminIcon name={item.icon as any} className="h-5 w-5" />
                  </span>
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto border-t border-slate-100 p-4">
            <button
              type="button"
              onClick={handleLogout}
              disabled={isLogoutLoading}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-600 transition hover:bg-rose-100"
            >
              <SuperAdminIcon name="logout" className="h-4 w-4" />
              <span>{isLogoutLoading ? 'Logging out...' : 'Logout'}</span>
            </button>
          </div>
        </div>
      </aside>

      <div className="md:hidden" />
    </>
  );
}
