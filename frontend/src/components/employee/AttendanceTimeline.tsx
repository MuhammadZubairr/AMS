'use client';

import type { AttendanceTimelineProps, TimelineEvent } from '@/types/components';

/**
 * Attendance Timeline Component
 * Displays a vertical timeline of attendance events
 * Shows Check In, Breaks, and Check Out events
 */
export default function AttendanceTimeline({
  events = [],
  loading = false,
  className = '',
}: AttendanceTimelineProps) {
  const getEventColor = (type: TimelineEvent['type']) => {
    switch (type) {
      case 'checkin':
        return 'bg-green-100 border-green-200 text-green-700';
      case 'breakstart':
        return 'bg-orange-100 border-orange-200 text-orange-700';
      case 'breakend':
        return 'bg-yellow-100 border-yellow-200 text-yellow-700';
      case 'checkout':
        return 'bg-blue-100 border-blue-200 text-blue-700';
      case 'pending':
      default:
        return 'bg-slate-100 border-slate-200 text-slate-700';
    }
  };

  const getEventIcon = (type: TimelineEvent['type']) => {
    switch (type) {
      case 'checkin':
        return '✓';
      case 'breakstart':
        return '⏸';
      case 'breakend':
        return '▶';
      case 'checkout':
        return '✕';
      case 'pending':
      default:
        return '○';
    }
  };

  const getEventTitle = (type: TimelineEvent['type']) => {
    switch (type) {
      case 'checkin':
        return 'Check In';
      case 'breakstart':
        return 'Break Started';
      case 'breakend':
        return 'Break Ended';
      case 'checkout':
        return 'Check Out';
      case 'pending':
      default:
        return 'Pending';
    }
  };

  if (loading) {
    return (
      <div className={`rounded-xl border border-blue-100 bg-white p-6 shadow-sm sm:p-8 ${className}`}>
        <h3 className="mb-6 text-lg font-bold text-slate-900">Attendance Timeline</h3>
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex gap-4">
              <div className="h-10 w-10 animate-pulse rounded-full bg-slate-200" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-32 animate-pulse rounded-lg bg-slate-200" />
                <div className="h-3 w-24 animate-pulse rounded-lg bg-slate-200" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`rounded-xl border border-blue-100 bg-white p-6 shadow-sm sm:p-8 ${className}`}>
      <h3 className="mb-6 text-lg font-bold text-slate-900 sm:text-2xl">Attendance Timeline</h3>

      {events.length === 0 ? (
        <div className="rounded-lg bg-slate-50 p-8 text-center">
          <p className="text-slate-600">No attendance events yet</p>
        </div>
      ) : (
        <div className="space-y-0">
          {events.map((event, index) => {
            const isLast = index === events.length - 1;
            const colorClass = getEventColor(event.type);

            return (
              <div key={event.id} className="flex gap-4 pb-6 sm:pb-8">
                {/* Timeline Line and Circle */}
                <div className="flex flex-col items-center">
                  {/* Circle */}
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full border-2 font-bold sm:h-12 sm:w-12 ${colorClass}`}
                  >
                    {getEventIcon(event.type)}
                  </div>

                  {/* Vertical Line */}
                  {!isLast && (
                    <div className="mt-2 w-0.5 flex-1 bg-gradient-to-b from-blue-200 to-blue-100" />
                  )}
                </div>

                {/* Event Content */}
                <div className="flex-1 pt-1">
                  <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h4 className="font-semibold text-slate-900">{event.title || getEventTitle(event.type)}</h4>
                      {event.description && (
                        <p className="text-sm text-slate-600">{event.description}</p>
                      )}
                    </div>
                    <p className="text-sm font-medium text-slate-500 sm:whitespace-nowrap sm:text-base">
                      {event.time}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
