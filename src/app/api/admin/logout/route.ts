import { NextRequest, NextResponse } from 'next/server';
import { ADMIN_COOKIE } from '@/lib/admin/session';

/* POST /api/admin/logout — clear the admin session cookie. */

export async function POST(_req: NextRequest) {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, '', { httpOnly: true, path: '/', maxAge: 0 });
  return res;
}
