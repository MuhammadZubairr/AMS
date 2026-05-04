/**
 * Super Admin Sidebar Navigation
 */

'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { SIDEBAR_MENU } from '@/constants/superadmin';
import { useAuth } from '@/hooks/useAuth';
import { SuperAdminIcon } from './Icon';
import BrandLogo from '../BrandLogo';

interface SidebarProps {
  collapsed: boolean;
  mobileOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ collapsed, mobileOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 flex min-h-0 w-72 flex-col overflow-hidden border-r border-slate-200 bg-white/95 shadow-sm backdrop-blur-sm transition-[transform,width,box-shadow] duration-300 ease-in-out md:translate-x-0 ${
        collapsed ? 'md:w-20' : 'md:w-72'
      } ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}
    >
      <div className="flex h-16 items-center justify-between border-b border-slate-100 px-4 md:px-5">
        <div className="flex items-center gap-3 overflow-hidden">
          {collapsed ? <BrandLogo compact /> : <BrandLogo subtitle="Super Admin" />}
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
        {SIDEBAR_MENU.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.id}
              href={item.href}
              onClick={onClose}
              className={`relative group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:shadow-sm ${
                isActive
                  ? 'bg-[#2563EB] text-white shadow-lg shadow-blue-600/20'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              } ${collapsed ? 'md:justify-center md:px-3' : ''}`}
              title={collapsed ? item.label : undefined}
            >
              {!collapsed && isActive && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 h-10 w-1 rounded-r-full bg-[#2563EB]" />
              )}
              <span className={`flex h-10 w-10 min-w-[40px] items-center justify-center rounded-lg ${isActive ? 'bg-white/15' : 'bg-slate-100 text-slate-500 group-hover:bg-white'}`}>
                <SuperAdminIcon name={item.icon} className="h-5 w-5" />
              </span>
              <span className={`${collapsed ? 'md:hidden' : ''}`}>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto border-t border-slate-100 p-4">
        <button
          type="button"
          onClick={handleLogout}
          className={`flex w-full items-center justify-center gap-2 rounded-2xl bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-600 transition hover:bg-rose-100 ${
            collapsed ? 'md:px-3' : ''
          }`}
        >
          <SuperAdminIcon name="logout" className="h-4 w-4" />
          <span className={`${collapsed ? 'md:hidden' : ''}`}>Logout</span>
        </button>
      </div>
    </aside>
  );
}
