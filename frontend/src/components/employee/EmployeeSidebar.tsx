'use client';

import { useState } from 'react';
import BrandLogo from '../BrandLogo';
import type { EmployeeSidebarProps } from '@/types/components';
import { ROUTES } from '@/constants/routes';

interface NavLink {
  href: string;
  label: string;
  icon: string;
}

const links: NavLink[] = [
  { href: ROUTES.EMPLOYEE.DASHBOARD, label: 'Dashboard', icon: '📊' },
  { href: ROUTES.EMPLOYEE.MY_ATTENDANCE, label: 'My Attendance', icon: '📋' },
  { href: ROUTES.EMPLOYEE.ATTENDANCE_HISTORY, label: 'Attendance History', icon: '📅' },
  { href: ROUTES.EMPLOYEE.LEAVE_REQUESTS, label: 'Leave Requests', icon: '🎯' },
  { href: ROUTES.EMPLOYEE.PROFILE, label: 'Profile', icon: '👤' },
];

/**
 * Employee Sidebar Component
 * Collapsible navigation sidebar for employee dashboard
 * Fully responsive with mobile-first design
 */
export default function EmployeeSidebar({ className = '' }: EmployeeSidebarProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg transition hover:bg-blue-700 lg:hidden"
        aria-label="Toggle sidebar"
      >
        <svg
          className={`h-6 w-6 transition-transform ${isOpen ? 'rotate-90' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
        </svg>
      </button>

      {/* Sidebar Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-10 bg-black/50 lg:hidden"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed inset-y-0 left-0 z-20 w-72 transform border-r border-blue-100 bg-white shadow-xl transition-transform duration-300 lg:relative lg:inset-auto lg:transform-none lg:shadow-[0_12px_30px_rgba(15,23,42,0.05)] ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } ${className}`}
      >
        <div className="flex h-full flex-col">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between gap-3 border-b border-blue-100 p-4 lg:p-5">
            <BrandLogo compact />
            <button
              onClick={() => setIsOpen(false)}
              className="lg:hidden"
              aria-label="Close sidebar"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 space-y-2 overflow-y-auto p-4 lg:p-5">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 rounded-lg border border-transparent px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
              >
                <span className="text-lg">{link.icon}</span>
                <span>{link.label}</span>
              </a>
            ))}
          </nav>

          {/* Sidebar Footer */}
          <div className="border-t border-blue-100 p-4 lg:p-5">
            <p className="text-xs text-slate-500">Version 1.0</p>
          </div>
        </div>
      </aside>
    </>
  );
}
