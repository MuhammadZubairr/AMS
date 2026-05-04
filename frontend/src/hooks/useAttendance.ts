import { useQuery } from '@tanstack/react-query';
import * as hrApi from '@/api/hr';

export function useAttendanceRecent() {
  return useQuery({ queryKey: ['hr', 'attendance', 'recent'], queryFn: () => hrApi.getAttendanceRecent() });
}
