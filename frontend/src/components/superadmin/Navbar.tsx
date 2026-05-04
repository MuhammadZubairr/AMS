/**
 * Super Admin Navbar/Header Component
 */

'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { SuperAdminIcon } from './Icon';
import { BrandLogo } from '../BrandLogo';

export function Navbar({
  title,
  sidebarCollapsed,
  onMobileMenuClick,
  onCollapseToggle,
}: {
  title: string;
  sidebarCollapsed: boolean;
  onMobileMenuClick: () => void;
  onCollapseToggle: () => void;
}) {
  const router = useRouter();
  const { user, logout } = useAuth() as {
    user: { name?: string; role?: string } | null;
    logout: () => Promise<void>;
  };
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onDocumentClick = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', onDocumentClick);
    return () => document.removeEventListener('mousedown', onDocumentClick);
  }, []);

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  return (
    <header
      className={`fixed right-0 top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur-sm shadow-sm transition-[left,box-shadow] duration-300 md:px-6 ${
        sidebarCollapsed ? 'md:left-20' : 'md:left-72'
      }`}
    >
      <button
        type="button"
        onClick={onMobileMenuClick}
        className="rounded-xl p-2 text-slate-600 transition hover:bg-slate-100 md:hidden"
        aria-label="Toggle sidebar"
      >
        <SuperAdminIcon name="menu" className="h-6 w-6" />
      </button>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onCollapseToggle}
          className="hidden rounded-xl p-2 text-slate-600 transition hover:bg-slate-100 md:inline-flex"
          aria-label="Collapse sidebar"
        >
          <SuperAdminIcon name="collapse" className={`h-5 w-5 transition-transform ${sidebarCollapsed ? 'rotate-180' : ''}`} />
        </button>
        <BrandLogo compact />
        <h1 className="text-lg font-semibold text-slate-900">{title}</h1>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          className="relative rounded-full p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
          aria-label="Notifications"
        >
          <SuperAdminIcon name="bell" className="h-5 w-5" />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[#2563EB] ring-2 ring-white" />
        </button>

        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-2 py-1.5 shadow-sm transition hover:border-slate-300"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#2563EB] text-sm font-semibold text-white">
              {user?.name?.charAt(0).toUpperCase() || 'S'}
            </div>
            <div className="hidden text-left sm:block">
              <p className="text-sm font-semibold text-slate-900">{user?.name || 'Super Admin'}</p>
              <p className="text-xs capitalize text-slate-500">{user?.role || 'superadmin'}</p>
            </div>
          </button>

          {isMenuOpen && (
            <div className="absolute right-0 mt-3 w-56 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-900/10">
              <button
                type="button"
                onClick={() => {
                  router.push('/superadmin/profile');
                  setIsMenuOpen(false);
                }}
                className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm text-slate-700 transition hover:bg-slate-50"
              >
                <SuperAdminIcon name="profile" className="h-4 w-4 text-slate-500" />
                Profile
              </button>
              <button
                type="button"
                onClick={() => {
                  router.push('/superadmin/profile');
                  setIsMenuOpen(false);
                }}
                className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm text-slate-700 transition hover:bg-slate-50"
              >
                <SuperAdminIcon name="password" className="h-4 w-4 text-slate-500" />
                Change Password
              </button>
              <div className="h-px bg-slate-100" />
              <button
                type="button"
                onClick={handleLogout}
                className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm text-rose-600 transition hover:bg-rose-50"
              >
                <SuperAdminIcon name="logout" className="h-4 w-4" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
