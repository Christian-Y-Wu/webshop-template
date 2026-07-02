import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';
import { AuthForm } from '@/components/account/auth-form';

export const metadata: Metadata = buildMetadata({ title: 'Reset password', path: '/account/forgot', noIndex: true });

export default function ForgotPage() {
  return <AuthForm mode="forgot" />;
}
