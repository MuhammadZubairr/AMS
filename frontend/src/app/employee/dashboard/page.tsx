'use client';

import { useState } from 'react';
import EmployeeLayout from '@/components/employee/EmployeeLayout';
import WelcomeCard from '@/components/employee/WelcomeCard';
import AttendanceActionCard from '@/components/employee/AttendanceActionCard';
import TodayAttendanceCard from '@/components/employee/TodayAttendanceCard';
import AttendanceSummaryCard from '@/components/employee/AttendanceSummaryCard';
import RecentAttendanceTable from '@/components/employee/RecentAttendanceTable';
import { useAuth } from '@/hooks/useAuth';

/**
 * Employee Dashboard Page
 * Main dashboard for employees with attendance management and statistics
 * Fully responsive with mobile-first design
 */
export default function EmployeeDashboard() {
  const { user } = useAuth();
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [loading, setLoading] = useState(false);

  // Mock data for demonstration
  const employeeName = user?.name || 'Employee';
  const presentDays = 18;
  const absentDays = 2;
  const lateArrivals = 3;
  const workFromHomeDays = 5;

  // Mock recent attendance data
  const recentAttendance = [
    {
      date: 'May 3, 2026',
      checkIn: '09:00 AM',
      checkOut: '06:00 PM',
      workType: 'WFO',
      status: 'Present',
    },
    {
      date: 'May 2, 2026',
      checkIn: '09:30 AM',
      checkOut: '06:30 PM',
      workType: 'WFH',
      status: 'Present',
    },
    {
      date: 'May 1, 2026',
      checkIn: '08:45 AM',
      checkOut: '05:45 PM',
      workType: 'WFO',
      status: 'Present',
    },
    {
      date: 'Apr 30, 2026',
      checkIn: '—',
      checkOut: '—',
      workType: '—',
      status: 'Absent',
    },
    {
      date: 'Apr 29, 2026',
      checkIn: '10:15 AM',
      checkOut: '07:15 PM',
      workType: 'WFO',
      status: 'Late',
    },
  ];

  const handleCheckIn = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setIsCheckedIn(true);
      // Here you would call the actual API endpoint
      // const response = await fetch('/api/attendance/check-in', { method: 'POST' });
    } finally {
      setLoading(false);
    }
  };

  const handleCheckOut = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setIsCheckedIn(false);
      // Here you would call the actual API endpoint
      // const response = await fetch('/api/attendance/check-out', { method: 'POST' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <EmployeeLayout>
      {/* Welcome Card */}
        <div className="mb-8">
          <WelcomeCard employeeName={employeeName} />
        </div>

      {/* Attendance Action & Today's Attendance Cards */}
      <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Attendance Action Card - spans 2 cols on lg */}
        <div className="lg:col-span-2">
          <AttendanceActionCard
            isCheckedIn={isCheckedIn}
            onCheckIn={handleCheckIn}
            onCheckOut={handleCheckOut}
            loading={loading}
          />
        </div>

        {/* Today's Attendance Summary - spans 1 col on lg */}
        <div className="lg:col-span-1">
          <TodayAttendanceCard
            checkInTime={isCheckedIn ? '09:00 AM' : null}
            checkOutTime={null}
            workType="office"
            status={isCheckedIn ? 'checked-in' : null}
            workingHours={isCheckedIn ? '1h 30m' : null}
          />
        </div>
      </div>

      {/* Attendance Summary Statistics */}
      <div className="mb-8">
        <h2 className="mb-4 text-xl font-bold text-slate-900 sm:text-2xl">Attendance Summary</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <AttendanceSummaryCard
            label="Present Days"
            value={presentDays}
            icon="✓"
            color="green"
          />
          <AttendanceSummaryCard
            label="Absent Days"
            value={absentDays}
            icon="✕"
            color="red"
          />
          <AttendanceSummaryCard
            label="Late Arrivals"
            value={lateArrivals}
            icon="⏰"
            color="orange"
          />
          <AttendanceSummaryCard
            label="Work From Home"
            value={workFromHomeDays}
            icon="🏠"
            color="blue"
          />
        </div>
      </div>

      {/* Recent Attendance Table */}
      <div className="mb-8">
        <RecentAttendanceTable data={recentAttendance} loading={false} />
      </div>
    </EmployeeLayout>
  );
}
