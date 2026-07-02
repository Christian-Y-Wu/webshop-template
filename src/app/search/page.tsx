import { Suspense } from 'react';
import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';
import { SearchResults } from '@/components/collection/search-results';

export const metadata: Metadata = buildMetadata({
  title: 'Search',
  description: 'Search the AURA store.',
  path: '/search',
  noIndex: true,
});

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="container-page py-20 text-center text-ink-muted">Loading…</div>}>
      <SearchResults />
    </Suspense>
  );
}
