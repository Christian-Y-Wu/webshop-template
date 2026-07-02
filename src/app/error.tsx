'use client';

import Link from 'next/link';
import { RefreshCw } from 'lucide-react';

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="container-page grid min-h-[60vh] place-items-center py-20 text-center">
      <div className="max-w-md">
        <p className="font-serif text-6xl text-accent/30">Oops</p>
        <h1 className="mt-3 font-serif text-3xl">Something went wrong</h1>
        <p className="mt-3 text-ink-soft">
          An unexpected error occurred. Please try again — if it keeps happening, our team is here to help.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button onClick={reset} className="btn-primary">
            <RefreshCw size={16} /> Try again
          </button>
          <Link href="/" className="btn-outline">
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}
