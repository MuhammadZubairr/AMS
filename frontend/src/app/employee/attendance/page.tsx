'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { ROUTES } from '@/constants/routes';

/**
 * Attendance Page - Redirect to My Attendance
 * Keeps backward compatibility while guiding users to correct page
 */
export default function AttendancePage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to my-attendance page
    router.push(ROUTES.EMPLOYEE.MY_ATTENDANCE);
  }, [router]);

  return null;
}
