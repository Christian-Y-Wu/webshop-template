import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';
import { AuthForm } from '@/components/account/auth-form';

export const metadata: Metadata = buildMetadata({ title: 'Sign in', path: '/account/login', noIndex: true });

export default function LoginPage() {
  return <AuthForm mode="login" />;
}
