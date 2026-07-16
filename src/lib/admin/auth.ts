import type { NextRequest } from 'next/server';
import {
  ADMIN_COOKIE,
  createSessionToken,
  timingSafeEqualStr,
  verifySessionToken,
} from './session';

/* ==========================================================================
   ADMIN AUTH — server-side helpers for the /api/admin/* routes.

   Security model (see SECURITY.md):
   - The studio only exists when ADMIN_PASSWORD is set. No password, no admin
     surface — a fresh deploy exposes nothing.
   - Login is rate-limited per IP and compares constant-time, so the password
     can't be brute-forced or timed.
   - Config WRITES are additionally restricted to `next dev` on your machine:
     the studio edits source files, which only makes sense (and only persists)
     locally. A production deployment is immutable by design.
   ========================================================================== */

export function adminPassword(): string | undefined {
  const pw = process.env.ADMIN_PASSWORD;
  return pw && pw.length > 0 ? pw : undefined;
}

export function adminEnabled(): boolean {
  return adminPassword() !== undefined;
}

/** File writes are only allowed while developing locally. */
export function writesAllowed(): boolean {
  return process.env.NODE_ENV === 'development';
}

/* ---- Login rate limiting (per IP, in-memory) ------------------------------
   Fine for the intended deployment (a single dev server or one node). If you
   scale the admin to multiple instances, back this with a shared store.     */

const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 5;
const attempts = new Map<string, { count: number; resetAt: number }>();

function clientIp(req: NextRequest): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip') ||
    'local'
  );
}

export function loginBlocked(req: NextRequest): { blocked: boolean; retryAfterS: number } {
  const entry = attempts.get(clientIp(req));
  if (!entry || Date.now() > entry.resetAt) return { blocked: false, retryAfterS: 0 };
  if (entry.count < MAX_ATTEMPTS) return { blocked: false, retryAfterS: 0 };
  return { blocked: true, retryAfterS: Math.ceil((entry.resetAt - Date.now()) / 1000) };
}

export function recordFailedLogin(req: NextRequest): void {
  const ip = clientIp(req);
  const now = Date.now();
  const entry = attempts.get(ip);
  if (!entry || now > entry.resetAt) {
    attempts.set(ip, { count: 1, resetAt: now + WINDOW_MS });
  } else {
    entry.count += 1;
  }
}

export function clearFailedLogins(req: NextRequest): void {
  attempts.delete(clientIp(req));
}

/* ---- Password + session ---------------------------------------------------- */

export async function checkPassword(candidate: unknown): Promise<boolean> {
  const expected = adminPassword();
  if (!expected || typeof candidate !== 'string') return false;
  // Constant-time compare (length-safe) so timing reveals nothing.
  return timingSafeEqualStr(candidate, expected);
}

export async function issueSession(): Promise<{ name: string; value: string; options: object }> {
  const token = await createSessionToken(adminPassword()!);
  return {
    name: ADMIN_COOKIE,
    value: token,
    options: {
      httpOnly: true,
      sameSite: 'lax' as const,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 8 * 60 * 60,
    },
  };
}

/**
 * Gate an /api/admin route. Returns null when the request carries a valid
 * session (and, for mutations, a same-origin `Origin` header — CSRF guard);
 * otherwise an error descriptor for the route to turn into a response.
 */
export async function requireAdmin(
  req: NextRequest,
  { mutation = false }: { mutation?: boolean } = {},
): Promise<{ status: number; error: string } | null> {
  if (!adminEnabled()) {
    return { status: 404, error: 'admin_disabled' };
  }
  const token = req.cookies.get(ADMIN_COOKIE)?.value;
  if (!(await verifySessionToken(token, adminPassword()))) {
    return { status: 401, error: 'unauthorized' };
  }
  if (mutation) {
    const origin = req.headers.get('origin');
    // Browsers always send Origin on cross-site POSTs; require it to match.
    if (!origin || new URL(origin).host !== req.nextUrl.host) {
      return { status: 403, error: 'bad_origin' };
    }
  }
  return null;
}
