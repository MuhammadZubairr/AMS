'use client';

import { useEffect, useMemo, useState } from 'react';
import EmployeeLayout from '@/components/employee/EmployeeLayout';
import AttendanceSummaryCard from '@/components/employee/AttendanceSummaryCard';
import AttendanceTimeline from '@/components/employee/AttendanceTimeline';
import WorkingHoursProgress from '@/components/employee/WorkingHoursProgress';
import type { TimelineEvent } from '@/types/components';
import { getAttendanceSummary, getAttendanceToday } from '@/api/attendance';

/**
 * My Attendance Page
 * Displays detailed attendance information for the current day
 * Includes check-in/out times, timeline, and working hours progress
 */
export default function MyAttendancePage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [todayData, setTodayData] = useState<any>(null);
  const [summaryData, setSummaryData] = useState<any>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  // Get today's date
  const today = new Date();
  const formattedDate = today.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const todayKey = today.toISOString().slice(0, 10);

  useEffect(() => {
    let isMounted = true;

    async function loadAttendance() {
      setLoading(true);
      setError(null);

      try {
        const [todayResponse, summaryResponse] = await Promise.all([
          getAttendanceToday(),
          getAttendanceSummary(),
        ]);

        if (!isMounted) return;

        setTodayData(todayResponse.data || null);
        setSummaryData(summaryResponse.data || null);
      } catch (err: any) {
        if (!isMounted) return;
        setError(err?.message || 'Failed to load attendance data');
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadAttendance();

    return () => {
      isMounted = false;
    };
  }, [refreshKey]);

  const monthlyHistory = summaryData?.history || [];
  const todayHistory = useMemo(
    () => monthlyHistory.find((record: any) => String(record.date).slice(0, 10) === todayKey),
    [monthlyHistory, todayKey]
  );

  const checkInTime = todayData?.check_in || todayHistory?.check_in || '—';
  const checkOutTime = todayData?.check_out || todayHistory?.check_out || '—';
  const workTypeValue =
    (todayData?.mode || todayHistory?.work_type || '').toString().toUpperCase() === 'REMOTE'
      ? 'Home'
      : (todayData?.mode || todayHistory?.work_type || '').toString().toUpperCase() === 'OFFICE'
        ? 'Office'
        : '—';

  const workingHours = todayHistory?.working_hours || '0h 0m';

  const completedHours = useMemo(() => {
    if (!todayHistory?.working_hours) return 0;
    const match = String(todayHistory.working_hours).match(/(?:(\d+)h)?\s*(?:(\d+)m)?/i);
    if (!match) return 0;
    const hours = Number(match[1] || 0);
    const minutes = Number(match[2] || 0);
    return hours + minutes / 60;
  }, [todayHistory?.working_hours]);

  const requiredHours = 8;
  const remainingHours = Math.max(requiredHours - completedHours, 0);
  const completionPercentage = Math.min(Math.round((completedHours / requiredHours) * 100), 100);

  const timelineEvents: TimelineEvent[] = [
    {
      id: 'checkin',
      time: checkInTime === '—' ? 'Pending' : checkInTime,
      title: 'Check In',
      description: workTypeValue === '—' ? 'Waiting for check-in data' : `${workTypeValue} shift`,
      type: checkInTime === '—' ? 'pending' : 'checkin',
    },
    {
      id: 'breakstart',
      time: '—',
      title: 'Break Start',
      description: 'Break events are not tracked by the current backend yet',
      type: 'breakstart',
    },
    {
      id: 'breakend',
      time: '—',
      title: 'Break End',
      description: 'Break events are not tracked by the current backend yet',
      type: 'breakend',
    },
    {
      id: 'checkout',
      time: checkOutTime === '—' ? 'Pending' : checkOutTime,
      title: 'Check Out',
      description: checkOutTime === '—' ? 'Not checked out yet' : 'Completed for today',
      type: checkOutTime === '—' ? 'pending' : 'checkout',
    },
  ];

  const summaryCards = [
    { label: 'Check In Time', value: checkInTime, icon: '⏰', badge: todayData?.status ? String(todayData.status).toUpperCase() : '—' },
    { label: 'Check Out Time', value: checkOutTime, icon: '🏁', badge: checkOutTime === '—' ? 'Pending' : 'Done' },
    { label: 'Working Hours', value: workingHours, icon: '⏳', badge: 'Today' },
    { label: 'Work Type', value: workTypeValue, icon: workTypeValue === 'Home' ? '🏠' : '🏢', badge: workTypeValue === '—' ? 'Unknown' : workTypeValue === 'Home' ? 'WFH' : 'Office' },
  ];

  const monthlyStats = summaryData?.summary || null;

  return (
    <EmployeeLayout>
      <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">My Attendance</h1>
          <p className="mt-1 text-slate-600">View your attendance details for today</p>
        </div>
        <div className="text-right">
          <p className="text-sm font-medium text-blue-600 sm:text-base">{formattedDate}</p>
          <p className="text-xs text-slate-500 sm:text-sm">Today</p>
        </div>
      </div>

      {error ? (
        <div className="mb-6 rounded-xl border border-red-100 bg-red-50 p-4 text-sm font-medium text-red-700">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p>{error}</p>
            <button
              type="button"
              onClick={() => setRefreshKey((value) => value + 1)}
              className="inline-flex items-center justify-center rounded-lg bg-red-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        </div>
      ) : null}

      <div className="mb-8">
        <h2 className="mb-4 text-lg font-bold text-slate-900 sm:text-xl">Today Attendance Summary</h2>
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
          {summaryCards.map((card) => (
            <AttendanceSummaryCard
              key={card.label}
              label={card.label}
              value={card.value}
              icon={card.icon}
              badge={card.badge}
            />
          ))}
        </div>
      </div>

      <div className="mb-8">
        <WorkingHoursProgress
          requiredHours={requiredHours}
          completedHours={completedHours}
          remainingHours={remainingHours}
          percentage={completionPercentage}
        />
      </div>

      <div className="mb-8">
        <AttendanceTimeline events={timelineEvents} loading={loading} />
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-blue-100 bg-white p-6 shadow-sm sm:p-8">
          <h3 className="mb-4 text-lg font-bold text-slate-900 sm:text-xl">Today Summary Details</h3>
          <div className="space-y-4 text-sm text-slate-600 sm:text-base">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span>Attendance Status</span>
              <span className="font-semibold text-slate-900">{todayData?.status || '—'}</span>
            </div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span>Check-in Device</span>
              <span className="font-semibold text-slate-900">{todayData?.device_name || '—'}</span>
            </div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span>Monthly Present Days</span>
              <span className="font-semibold text-slate-900">{monthlyStats?.present_days ?? 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Monthly Late Days</span>
              <span className="font-semibold text-slate-900">{monthlyStats?.late_days ?? 0}</span>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-blue-100 bg-white p-6 shadow-sm sm:p-8">
          <h3 className="mb-4 text-lg font-bold text-slate-900 sm:text-xl">Monthly Overview</h3>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-2">
            <div className="rounded-lg bg-blue-50 p-4">
              <p className="text-xs font-medium text-blue-700">Present</p>
              <p className="mt-1 text-2xl font-bold text-slate-900">{monthlyStats?.present_days ?? 0}</p>
            </div>
            <div className="rounded-lg bg-red-50 p-4">
              <p className="text-xs font-medium text-red-700">Absent</p>
              <p className="mt-1 text-2xl font-bold text-slate-900">{monthlyStats?.absent_days ?? 0}</p>
            </div>
            <div className="rounded-lg bg-orange-50 p-4">
              <p className="text-xs font-medium text-orange-700">Late</p>
              <p className="mt-1 text-2xl font-bold text-slate-900">{monthlyStats?.late_days ?? 0}</p>
            </div>
            <div className="rounded-lg bg-slate-50 p-4">
              <p className="text-xs font-medium text-slate-700">Avg Hours</p>
              <p className="mt-1 text-2xl font-bold text-slate-900">
                {monthlyStats?.average_working_seconds
                  ? `${Math.floor(monthlyStats.average_working_seconds / 3600)}h ${Math.floor((monthlyStats.average_working_seconds % 3600) / 60)}m`
                  : '0h 0m'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </EmployeeLayout>
  );
}
