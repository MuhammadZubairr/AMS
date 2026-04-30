import '../styles/globals.css';
import Providers from './providers';

export const metadata = {
  title: 'DevFlx Attendance System',
  description: 'Employee attendance management for DevFlx',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
