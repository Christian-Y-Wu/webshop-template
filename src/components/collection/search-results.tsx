'use client';

import { useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search } from 'lucide-react';
import { products } from '@/lib/data/products';
import { searchProducts } from '@/lib/search';
import { ProductGrid } from '@/components/product/product-grid';
import { Breadcrumbs } from '@/components/ui/breadcrumbs';

export function SearchResults() {
  const params = useSearchParams();
  const initial = params.get('q') ?? '';
  const [query, setQuery] = useState(initial);

  const results = useMemo(() => searchProducts(query), [query]);

  const bestSellers = products.filter((p) => p.bestSeller).slice(0, 4);

  return (
    <div className="container-page pt-6">
      <Breadcrumbs items={[{ name: 'Home', href: '/' }, { name: 'Search', href: '/search' }]} className="mb-6" />

      <div className="mx-auto max-w-2xl">
        <div className="flex items-center gap-3 rounded-pill border border-line bg-surface px-5 py-3.5 focus-within:border-ink">
          <Search size={20} className="text-ink-muted" />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for products…"
            className="flex-1 bg-transparent text-base focus:outline-none"
            aria-label="Search"
          />
        </div>
      </div>

      <div className="mt-10">
        {query.trim() ? (
          results.length > 0 ? (
            <>
              <p className="mb-8 text-center text-sm text-ink-muted">
                {results.length} result{results.length === 1 ? '' : 's'} for{' '}
                <span className="font-medium text-ink">“{query}”</span>
              </p>
              <ProductGrid products={results} />
            </>
          ) : (
            <div className="py-10 text-center">
              <p className="font-serif text-3xl text-ink">No results for “{query}”</p>
              <p className="mx-auto mt-3 max-w-md text-ink-muted">
                We couldn’t find a match. Try a different term, check the spelling, or explore our best sellers below.
              </p>
              <div className="mt-12">
                <p className="eyebrow mb-6">Best sellers</p>
                <ProductGrid products={bestSellers} />
              </div>
            </div>
          )
        ) : (
          <div className="py-10 text-center">
            <p className="text-ink-muted">Start typing to search the store.</p>
            <div className="mt-12 text-left">
              <p className="eyebrow mb-6 text-center">Popular right now</p>
              <ProductGrid products={bestSellers} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
