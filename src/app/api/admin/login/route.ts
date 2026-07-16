import { NextRequest, NextResponse } from 'next/server';
import {
  adminEnabled,
  checkPassword,
  clearFailedLogins,
  issueSession,
  loginBlocked,
  recordFailedLogin,
} from '@/lib/admin/auth';

/* POST /api/admin/login — exchange the admin password for a signed session
   cookie. Rate-limited per IP; constant-time password comparison. */

export async function POST(req: NextRequest) {
  if (!adminEnabled()) {
    return NextResponse.json({ error: 'admin_disabled' }, { status: 404 });
  }

  const { blocked, retryAfterS } = loginBlocked(req);
  if (blocked) {
    return NextResponse.json(
      { error: 'rate_limited', retryAfterS },
      { status: 429, headers: { 'Retry-After': String(retryAfterS) } },
    );
  }

  const body = await req.json().catch(() => null);

  // An empty probe (the login page checking whether the studio is enabled)
  // is not a guess — only actual password attempts count toward the limit.
  if (typeof body?.password !== 'string' || body.password === '') {
    return NextResponse.json({ error: 'missing_password' }, { status: 400 });
  }

  const ok = await checkPassword(body.password);

  if (!ok) {
    recordFailedLogin(req);
    return NextResponse.json({ error: 'invalid_password' }, { status: 401 });
  }

  clearFailedLogins(req);
  const cookie = await issueSession();
  const res = NextResponse.json({ ok: true });
  res.cookies.set(cookie.name, cookie.value, cookie.options);
  return res;
}
