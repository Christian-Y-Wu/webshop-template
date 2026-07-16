'use client';

import { createContext, useContext, useEffect, useState } from 'react';

/* ==========================================================================
   CUSTOMER AUTH — demo implementation.

   This gives the account area a real, working sign-in flow so the template
   feels complete: register → session → personalised dashboard → sign out.

   It is deliberately a DEMO:
   - Accounts live in this browser's localStorage only.
   - Passwords are NEVER stored or transmitted — the password field on the
     forms exists for realism, nothing reads it. Storing customer passwords
     client-side would be worse than not asking for them.

   Going live: keep this provider's interface and swap the internals for a
   real backend — NextAuth/Auth.js, Clerk, Supabase Auth, or your commerce
   platform's customer accounts (e.g. Shopify). Every consumer only touches
   `user`, `login`, `register`, `logout`, so the swap is contained to this
   file. See docs/SETUP-GUIDE.md → "Customer accounts".
   ========================================================================== */

export interface DemoUser {
  firstName: string;
  lastName: string;
  email: string;
  createdAt: string;
}

export type AuthResult = { ok: true } | { ok: false; error: 'not_found' | 'exists' | 'invalid' };

interface AuthContextValue {
  /** null = signed out. Undefined never occurs after `hydrated`. */
  user: DemoUser | null;
  hydrated: boolean;
  login: (email: string) => AuthResult;
  register: (input: { firstName: string; lastName: string; email: string }) => AuthResult;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const USERS_KEY = 'aura:auth:users';
const SESSION_KEY = 'aura:auth:session';

function readUsers(): DemoUser[] {
  try {
    return JSON.parse(window.localStorage.getItem(USERS_KEY) ?? '[]') as DemoUser[];
  } catch {
    return [];
  }
}

const normalize = (email: string) => email.trim().toLowerCase();

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<DemoUser | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const sessionEmail = window.localStorage.getItem(SESSION_KEY);
      if (sessionEmail) {
        const found = readUsers().find((u) => u.email === sessionEmail);
        setUser(found ?? null);
      }
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  const login = (email: string): AuthResult => {
    const clean = normalize(email);
    if (!clean.includes('@')) return { ok: false, error: 'invalid' };
    const found = readUsers().find((u) => u.email === clean);
    if (!found) return { ok: false, error: 'not_found' };
    window.localStorage.setItem(SESSION_KEY, clean);
    setUser(found);
    return { ok: true };
  };

  const register = (input: { firstName: string; lastName: string; email: string }): AuthResult => {
    const clean = normalize(input.email);
    if (!clean.includes('@') || !input.firstName.trim()) return { ok: false, error: 'invalid' };
    const users = readUsers();
    if (users.some((u) => u.email === clean)) return { ok: false, error: 'exists' };
    const newUser: DemoUser = {
      firstName: input.firstName.trim(),
      lastName: input.lastName.trim(),
      email: clean,
      createdAt: new Date().toISOString(),
    };
    window.localStorage.setItem(USERS_KEY, JSON.stringify([...users, newUser]));
    window.localStorage.setItem(SESSION_KEY, clean);
    setUser(newUser);
    return { ok: true };
  };

  const logout = () => {
    window.localStorage.removeItem(SESSION_KEY);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, hydrated, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within <AuthProvider>');
  return ctx;
}
