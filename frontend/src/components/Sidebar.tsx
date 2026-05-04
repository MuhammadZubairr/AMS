import BrandLogo from './BrandLogo';
import type { SidebarProps } from '@/types/components';
import { ROUTES } from '@/constants/routes';

interface NavLink {
  href: string;
  label: string;
}

const links: NavLink[] = [
  { href: ROUTES.DASHBOARD, label: 'Dashboard' },
  { href: ROUTES.EMPLOYEES, label: 'Employees' },
  { href: ROUTES.ATTENDANCE, label: 'Attendance' },
  { href: ROUTES.REPORTS, label: 'Reports' },
];

/**
 * Sidebar Component
 * Secondary navigation sidebar with quick access links
 */
export default function Sidebar({ className = '' }: SidebarProps) {
  return (
    <aside className={`w-full rounded-3xl border border-blue-100 bg-white p-4 shadow-[0_12px_30px_rgba(15,23,42,0.05)] lg:w-72 lg:shrink-0 lg:p-5 ${className}`}>
      <div className="flex items-center justify-between gap-3 lg:block">
        <BrandLogo />
        <p className="text-xs text-slate-500 lg:mt-2">Quick access</p>
      </div>
      <div className="mt-4 flex gap-2 overflow-x-auto pb-1 lg:block lg:space-y-2 lg:overflow-visible lg:pb-0">
        {links.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className="shrink-0 rounded-full border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 lg:block lg:rounded-xl lg:px-4 lg:py-3"
          >
            {link.label}
          </a>
        ))}
      </div>
    </aside>
  );
}
