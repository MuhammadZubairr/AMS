"use client";

import { useState } from 'react';
import type { AttendanceActionCardProps } from '@/types/components';
import { COLORS } from '@/constants/design-tokens';

/**
 * Attendance Action Card Component
 * Allows employees to select work type and check in/out
 * Mobile-friendly with large touch targets
 */
export default function AttendanceActionCard({
  isCheckedIn = false,
  onCheckIn,
  onCheckOut,
  loading = false,
  className = '',
}: AttendanceActionCardProps) {
  const [workType, setWorkType] = useState<'office' | 'home'>('office');
  const [isLoading, setIsLoading] = useState(false);

  const handleCheckIn = async () => {
    setIsLoading(true);
    try {
      if (onCheckIn) {
        await onCheckIn();
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckOut = async () => {
    setIsLoading(true);
    try {
      if (onCheckOut) {
        await onCheckOut();
      }
    } finally {
      setIsLoading(false);
    }
  };

  const isButtonLoading = loading || isLoading;

  return (
    <div className={`rounded-xl border bg-white p-6 shadow-sm sm:p-8 ${className}`} style={{ borderColor: COLORS.neutral[200] }}>
      <h2 className="mb-6 text-xl font-bold text-slate-900 sm:text-2xl">Daily Check-In</h2>

      {/* Work Type Selection */}
      <div className="mb-8">
        <p className="mb-4 text-sm font-medium text-slate-700">Work Type</p>
        <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
          <label className="flex cursor-pointer items-center gap-3 rounded-lg border-2 p-4 transition" style={{ borderColor: COLORS.neutral[200] }}>
            <input
              type="radio"
              name="workType"
              value="office"
              checked={workType === 'office'}
              onChange={(e) => setWorkType(e.target.value as 'office' | 'home')}
              className="h-5 w-5"
              style={{ accentColor: COLORS.primary }}
              disabled={isCheckedIn}
            />
            <div>
              <p className="font-medium text-slate-900">Work From Office</p>
              <p className="text-xs text-slate-500">WFO</p>
            </div>
          </label>

          <label className="flex cursor-pointer items-center gap-3 rounded-lg border-2 p-4 transition" style={{ borderColor: COLORS.neutral[200] }}>
            <input
              type="radio"
              name="workType"
              value="home"
              checked={workType === 'home'}
              onChange={(e) => setWorkType(e.target.value as 'office' | 'home')}
              className="h-5 w-5"
              style={{ accentColor: COLORS.primary }}
              disabled={isCheckedIn}
            />
            <div>
              <p className="font-medium text-slate-900">Work From Home</p>
              <p className="text-xs text-slate-500">WFH</p>
            </div>
          </label>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
        <button
          onClick={handleCheckIn}
          disabled={isCheckedIn || isButtonLoading}
          className={`flex-1 rounded-lg px-6 py-3 font-semibold text-white transition sm:py-4 sm:text-lg ${
            isCheckedIn || isButtonLoading ? 'cursor-not-allowed' : ''
          }`}
          style={{
            backgroundColor: isCheckedIn || isButtonLoading ? COLORS.neutral[300] : COLORS.success,
            borderColor: isCheckedIn || isButtonLoading ? COLORS.neutral[300] : COLORS.success,
          }}
        >
          {isButtonLoading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="h-5 w-5 animate-spin" fill="currentColor" viewBox="0 0 4 4">
                <circle cx="2" cy="2" r="0.5" />
              </svg>
              Checking In...
            </span>
          ) : (
            '✓ Check In'
          )}
        </button>

        <button
          onClick={handleCheckOut}
          disabled={!isCheckedIn || isButtonLoading}
          className={`flex-1 rounded-lg px-6 py-3 font-semibold text-white transition sm:py-4 sm:text-lg ${
            !isCheckedIn || isButtonLoading ? 'cursor-not-allowed' : ''
          }`}
          style={{
            backgroundColor: !isCheckedIn || isButtonLoading ? COLORS.neutral[300] : COLORS.danger,
            borderColor: !isCheckedIn || isButtonLoading ? COLORS.neutral[300] : COLORS.danger,
          }}
        >
          {isButtonLoading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="h-5 w-5 animate-spin" fill="currentColor" viewBox="0 0 4 4">
                <circle cx="2" cy="2" r="0.5" />
              </svg>
              Checking Out...
            </span>
          ) : (
            '✕ Check Out'
          )}
        </button>
      </div>

      {/* Status Message */}
      {isCheckedIn && (
        <div className="mt-6 rounded-lg p-4" style={{ borderColor: COLORS.success + '33', backgroundColor: COLORS.success + '10' }}>
          <p className="text-sm font-medium" style={{ color: COLORS.success }}>You are currently checked in</p>
          <p className="text-xs" style={{ color: COLORS.success }}>{'Remember to check out at the end of your shift'}</p>
        </div>
      )}
    </div>
  );
}
