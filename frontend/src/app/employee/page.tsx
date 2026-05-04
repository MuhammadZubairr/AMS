import { redirect } from 'next/navigation';
import { ROUTES } from '@/constants/routes';

/**
 * Employee Home Page
 * Redirects to employee dashboard
 */
export default function EmployeeHome() {
  redirect(ROUTES.EMPLOYEE.DASHBOARD);
}
