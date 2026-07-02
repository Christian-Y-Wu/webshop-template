import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';
import { AuthForm } from '@/components/account/auth-form';

export const metadata: Metadata = buildMetadata({ title: 'Create account', path: '/account/register', noIndex: true });

export default function RegisterPage() {
  return <AuthForm mode="register" />;
}
