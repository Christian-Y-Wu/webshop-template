import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';
import { AccountDashboard } from '@/components/account/dashboard';

export const metadata: Metadata = buildMetadata({ title: 'Dashboard', path: '/account', noIndex: true });

export default function AccountDashboardPage() {
  return <AccountDashboard />;
}
