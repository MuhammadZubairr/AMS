import { redirect } from 'next/navigation';

export default function LegacyLeavesRedirect() {
  redirect('/employee/leave-requests');
}
