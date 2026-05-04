import { useQuery } from '@tanstack/react-query';
import * as hrApi from '@/api/hr';

export function useHRAttendance(period: 'today' | 'weekly' | 'monthly') {
  return useQuery({
    queryKey: ['hr', 'attendance', period],
    queryFn: () => hrApi.getAttendanceByPeriod(period),
  });
}
