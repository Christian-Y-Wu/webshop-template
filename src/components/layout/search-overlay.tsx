'use client';

import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Clock, Search, TrendingUp, X } from 'lucide-react';
import { products } from '@/lib/data/products';
import { collections } from '@/lib/data/collections';
import { MediaImage } from '@/components/ui/media-image';
import { Price } from '@/components/ui/price';
import { useUI } from '@/components/providers/ui-provider';

const TRENDING = ['Merino sweater', 'Linen trouser', 'Ceramic vase', 'Gold hoops', 'Soy candle'];

export function SearchOverlay() {
  const { overlay, closeOverlay } = useUI();
  const open = overlay === 'search';
  const [query, setQuery] = useState('');
  const [recent, setRecent] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 60);
      try {
        setRecent(JSON.parse(localStorage.getItem('aura:recent-search') || '[]'));
      } catch {
        setRecent([]);
      }
    } else {
      setQuery('');
    }
  }, [open]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return products
      .filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.tags?.some((t) => t.includes(q)) ||
          p.collections.some((c) => c.includes(q)),
      )
      .slice(0, 6);
  }, [query]);

  const collectionHits = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return collections.filter((c) => c.title.toLowerCase().includes(q) && c.handle !== 'all').slice(0, 4);
  }, [query]);

  function commit(term: string) {
    setQuery(term);
    const next = [term, ...recent.filter((r) => r !== term)].slice(0, 5);
    setRecent(next);
    localStorage.setItem('aura:recent-search', JSON.stringify(next));
  }

  const popular = products.filter((p) => p.bestSeller).slice(0, 4);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeOverlay}
            className="fixed inset-0 z-50 bg-ink/40 backdrop-blur-sm"
          />
          <motion.div
            initial={{ y: '-100%' }}
            animate={{ y: 0 }}
            exit={{ y: '-100%' }}
            transition={{ type: 'tween', duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-x-0 top-0 z-50 max-h-[92vh] overflow-y-auto bg-canvas"
            role="dialog"
            aria-label="Search"
          >
            <div className="container-page py-5">
              {/* Input */}
              <div className="flex items-center gap-3 border-b border-line pb-4">
                <Search size={22} className="shrink-0 text-ink-muted" />
                <form
                  className="flex-1"
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (query.trim()) commit(query.trim());
                  }}
                >
                  <input
                    ref={inputRef}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search for products, collections…"
                    className="w-full bg-transparent text-lg text-ink placeholder:text-ink-muted focus:outline-none sm:text-2xl"
                    aria-label="Search"
                  />
                </form>
                <button onClick={closeOverlay} className="btn-ghost" aria-label="Close search">
                  <X size={22} />
                </button>
              </div>

              {/* Body */}
              <div className="grid gap-8 py-8 lg:grid-cols-[1fr_1.4fr]">
                {/* Left — suggestions */}
                <div className="space-y-8">
                  {!query && recent.length > 0 && (
                    <div>
                      <p className="eyebrow mb-3 flex items-center gap-2">
                        <Clock size={13} /> Recently searched
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {recent.map((r) => (
                          <button
                            key={r}
                            onClick={() => commit(r)}
                            className="rounded-pill border border-line px-3.5 py-1.5 text-sm text-ink-soft transition-colors hover:border-ink hover:text-ink"
                          >
                            {r}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <p className="eyebrow mb-3 flex items-center gap-2">
                      <TrendingUp size={13} /> Trending searches
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {TRENDING.map((t) => (
                        <button
                          key={t}
                          onClick={() => commit(t)}
                          className="rounded-pill border border-line px-3.5 py-1.5 text-sm text-ink-soft transition-colors hover:border-ink hover:text-ink"
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>

                  {collectionHits.length > 0 && (
                    <div>
                      <p className="eyebrow mb-3">Collections</p>
                      <ul className="space-y-1">
                        {collectionHits.map((c) => (
                          <li key={c.handle}>
                            <Link
                              href={`/collections/${c.handle}`}
                              onClick={closeOverlay}
                              className="link-underline text-[15px] text-ink-soft hover:text-ink"
                            >
                              {c.title}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Right — product results / popular */}
                <div>
                  <p className="eyebrow mb-4">
                    {query ? `Results (${results.length})` : 'Popular right now'}
                  </p>

                  {query && results.length === 0 ? (
                    <div className="rounded-card border border-dashed border-line py-14 text-center">
                      <p className="font-serif text-xl text-ink">No results for “{query}”</p>
                      <p className="mt-2 text-sm text-ink-muted">
                        Try a different term, or explore our best sellers.
                      </p>
                    </div>
                  ) : (
                    <ul className="grid gap-3 sm:grid-cols-2">
                      {(query ? results : popular).map((p) => (
                        <li key={p.id}>
                          <Link
                            href={`/products/${p.slug}`}
                            onClick={closeOverlay}
                            className="group flex items-center gap-3 rounded-2xl p-2 transition-colors hover:bg-surface-muted"
                          >
                            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl">
                              <MediaImage seed={p.images[0].seed} alt={p.images[0].alt} monogram={false} />
                            </div>
                            <div className="min-w-0">
                              <p className="truncate text-sm font-medium text-ink">{p.title}</p>
                              <p className="truncate text-xs text-ink-muted">{p.subtitle}</p>
                              <Price amount={p.price} compareAt={p.compareAtPrice} size="sm" className="mt-0.5" />
                            </div>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}

                  {query && results.length > 0 && (
                    <Link
                      href={`/search?q=${encodeURIComponent(query)}`}
                      onClick={closeOverlay}
                      className="btn-outline mt-5 w-full"
                    >
                      View all results for “{query}”
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
