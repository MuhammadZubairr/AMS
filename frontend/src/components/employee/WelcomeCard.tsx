'use client';

import { useEffect, useState } from 'react';
import type { WelcomeCardProps } from '@/types/components';

/**
 * Welcome Card Component
 * Displays greeting message with employee name, current date, and time
 * Updates time every minute for live display
 */
export default function WelcomeCard({ employeeName = 'Employee', className = '' }: WelcomeCardProps) {
  const [currentTime, setCurrentTime] = useState<string>('');
  const [currentDate, setCurrentDate] = useState<string>('');
  const [greeting, setGreeting] = useState<string>('Good Morning');

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();

      // Determine greeting based on time of day
      const hour = now.getHours();
      if (hour < 12) {
        setGreeting('Good Morning');
      } else if (hour < 18) {
        setGreeting('Good Afternoon');
      } else {
        setGreeting('Good Evening');
      }

      // Format time (HH:MM)
      const time = now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });
      setCurrentTime(time);

      // Format date (e.g., "Monday, May 4, 2026")
      const date = now.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
      setCurrentDate(date);
    };

    updateDateTime();
    const interval = setInterval(updateDateTime, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className={`rounded-xl border border-blue-100 bg-gradient-to-br from-blue-50 to-white p-6 shadow-sm sm:p-8 ${className}`}
    >
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl lg:text-4xl">
            {greeting}, <span className="text-blue-600">{employeeName}</span>
          </h1>
          <p className="mt-2 text-sm text-slate-600 sm:text-base">{currentDate}</p>
        </div>
        {currentTime && (
          <div className="text-right">
            <p className="text-3xl font-bold text-blue-600 sm:text-4xl">{currentTime}</p>
            <p className="text-xs text-slate-500 sm:text-sm">Current Time</p>
          </div>
        )}
      </div>
    </div>
  );
}
