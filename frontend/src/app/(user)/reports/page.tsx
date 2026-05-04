import { redirect } from 'next/navigation';

export default function LegacyReportsRedirect() {
  redirect('/employee/attendance-history');
}
