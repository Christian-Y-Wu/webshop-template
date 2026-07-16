/* ==========================================================================
   ADMIN SESSION TOKENS

   Stateless, signed session tokens for the Admin Studio:

     token = "<expiresAtMs>.<hex HMAC-SHA256 of expiresAtMs>"

   - The signing key is derived from ADMIN_PASSWORD, so there is no second
     secret to manage, and changing the password invalidates every session.
   - Uses only the Web Crypto API (globalThis.crypto), so the exact same code
     runs in the Edge middleware AND in Node API routes.
   - No session store: nothing to leak, nothing to clean up. A token is valid
     iff its signature checks out and it hasn't expired.
   ========================================================================== */

export const ADMIN_COOKIE = 'aura_admin';
export const SESSION_HOURS = 8;

const encoder = new TextEncoder();

function toHex(buf: ArrayBuffer): string {
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

/** Constant-time string equality — never short-circuits on a mismatch. */
export function timingSafeEqualStr(a: string, b: string): boolean {
  const bufA = encoder.encode(a);
  const bufB = encoder.encode(b);
  // XOR-in the length difference so unequal lengths still compare all bytes.
  let diff = bufA.length ^ bufB.length;
  const len = Math.max(bufA.length, bufB.length);
  for (let i = 0; i < len; i++) {
    diff |= (bufA[i % bufA.length] ?? 0) ^ (bufB[i % bufB.length] ?? 0);
  }
  return diff === 0;
}

async function signingKey(password: string): Promise<CryptoKey> {
  // Domain-separated so the raw password never doubles as key material elsewhere.
  const material = encoder.encode(`aura-admin-session-v1:${password}`);
  const digest = await crypto.subtle.digest('SHA-256', material);
  return crypto.subtle.importKey('raw', digest, { name: 'HMAC', hash: 'SHA-256' }, false, [
    'sign',
  ]);
}

async function signPayload(payload: string, password: string): Promise<string> {
  const key = await signingKey(password);
  const sig = await crypto.subtle.sign('HMAC', key, encoder.encode(payload));
  return toHex(sig);
}

/** Create a session token valid for SESSION_HOURS from now. */
export async function createSessionToken(password: string): Promise<string> {
  const expiresAt = Date.now() + SESSION_HOURS * 60 * 60 * 1000;
  const sig = await signPayload(String(expiresAt), password);
  return `${expiresAt}.${sig}`;
}

/** Verify a token: intact signature and not expired. */
export async function verifySessionToken(
  token: string | undefined,
  password: string | undefined,
): Promise<boolean> {
  if (!token || !password) return false;
  const dot = token.indexOf('.');
  if (dot <= 0) return false;
  const expiresAt = Number(token.slice(0, dot));
  const sig = token.slice(dot + 1);
  if (!Number.isFinite(expiresAt) || expiresAt < Date.now()) return false;
  const expected = await signPayload(String(expiresAt), password);
  return timingSafeEqualStr(sig, expected);
}
