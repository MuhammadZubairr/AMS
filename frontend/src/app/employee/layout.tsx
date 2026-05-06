import ProtectedRoute from '@/components/ProtectedRoute';
import type { LayoutProps } from '@/types/components';

/**
 * Employee Routes Layout
 * Provides layout wrapper for all employee pages
 */
export default function EmployeeLayout({ children }: LayoutProps) {
  return <ProtectedRoute>{children}</ProtectedRoute>;
}
