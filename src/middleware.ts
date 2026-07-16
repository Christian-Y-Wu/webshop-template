import { NextResponse, type NextRequest } from 'next/server';
import { ADMIN_COOKIE, verifySessionToken } from '@/lib/admin/session';

/* ==========================================================================
   MIDDLEWARE — protects every /admin page.

   - No ADMIN_PASSWORD configured → everything under /admin lands on the
     login page, which explains how to enable the studio. Nothing sensitive
     renders without the env var, so a fresh deploy is safe by default.
   - Session cookie is verified cryptographically (HMAC) on every request;
     invalid/expired sessions bounce to /admin/login.
   - /api/admin/* routes do their own (stricter) checks in the route handlers.
   ========================================================================== */

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const password = process.env.ADMIN_PASSWORD;
  const authed =
    !!password && (await verifySessionToken(req.cookies.get(ADMIN_COOKIE)?.value, password));

  if (pathname === '/admin/login') {
    if (authed) {
      return NextResponse.redirect(new URL('/admin', req.url));
    }
    return NextResponse.next();
  }

  if (!authed) {
    const login = new URL('/admin/login', req.url);
    if (pathname !== '/admin') login.searchParams.set('next', pathname);
    return NextResponse.redirect(login);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/admin'],
};
