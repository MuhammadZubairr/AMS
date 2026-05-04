'use client';

import BrandLogo from './BrandLogo';
import Logout from './Logout';
import type { NavbarProps } from '@/types/components';
import { ROUTES } from '@/constants/routes';

const NAV_LINKS = [
  { href: ROUTES.DASHBOARD, label: 'Dashboard' },
  { href: ROUTES.EMPLOYEES, label: 'Employees' },
  { href: ROUTES.ATTENDANCE, label: 'Attendance' },
  { href: ROUTES.REPORTS, label: 'Reports' },
] as const;

/**
 * Navbar Component
 * Primary navigation header for the application
 */
export default function Navbar({}: NavbarProps) {
  return (
    <header className="sticky top-0 z-20 border-b border-blue-100 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div className="flex items-center justify-between gap-4">
          <BrandLogo subtitle="Attendance Management" />
        </div>
        <nav className="flex w-full items-center gap-2 overflow-x-auto pb-1 text-sm font-medium text-slate-600 sm:gap-3 lg:w-auto lg:flex-wrap lg:justify-end">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="shrink-0 rounded-full px-3 py-2 transition hover:bg-blue-50 hover:text-blue-700"
            >
              {link.label}
            </a>
          ))}
          <div className="shrink-0 pl-1">
            <Logout />
          </div>
        </nav>
      </div>
    </header>
  );
}
