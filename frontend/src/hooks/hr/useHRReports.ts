import { useQuery } from '@tanstack/react-query';
import * as hrApi from '@/api/hr';

export function useHRDailyReport(selectedDate: string, enabled: boolean) {
  return useQuery({
    queryKey: ['hr', 'reports', 'daily', selectedDate],
    queryFn: () => hrApi.getReportsDaily(selectedDate),
    enabled,
  });
}

export function useHRMonthlyReport(selectedMonth: string, enabled: boolean) {
  return useQuery({
    queryKey: ['hr', 'reports', 'monthly', selectedMonth],
    queryFn: () => {
      const [year, month] = selectedMonth.split('-');
      return hrApi.getReportsMonthly(year, month);
    },
    enabled,
  });
}

export function useHREmployeeReport(selectedEmployeeId: string, enabled: boolean) {
  return useQuery({
    queryKey: ['hr', 'reports', 'employee', selectedEmployeeId],
    queryFn: () => hrApi.getReportByEmployee(Number(selectedEmployeeId)),
    enabled,
  });
}
