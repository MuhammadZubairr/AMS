import '../styles/globals.css';
import Providers from './providers';
import type { LayoutProps } from '@/types/components';

/**
 * Root Layout Component
 * Main layout wrapper for the entire application
 * Provides global providers for React Query and error handling
 */

export const metadata = {
  title: 'DevFlx Attendance System',
  description: 'Employee attendance management for DevFlx',
};

export default function RootLayout({ children }: LayoutProps): React.ReactElement {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
