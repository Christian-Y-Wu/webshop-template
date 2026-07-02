'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, SlidersHorizontal, Star, X } from 'lucide-react';
import { ProductCard, ProductCardSkeleton } from '@/components/product/product-card';
import { useStore } from '@/components/providers/store-provider';
import { siteConfig } from '@/config/site';
import { cn, formatMoney } from '@/lib/utils';
import type { Product } from '@/lib/types';

const SORTS = [
  { key: 'featured', label: 'Featured' },
  { key: 'best', label: 'Best selling' },
  { key: 'new', label: 'Newest' },
  { key: 'price-asc', label: 'Price: Low to High' },
  { key: 'price-desc', label: 'Price: High to Low' },
  { key: 'rating', label: 'Top rated' },
] as const;

const PAGE_SIZE = 8;

export function CollectionView({ products }: { products: Product[] }) {
  const { currency } = useStore();

  // Derive filter facets
  const facets = useMemo(() => {
    const colors = new Set<string>();
    const sizes = new Set<string>();
    const brands = new Set<string>();
    let max = 0;
    products.forEach((p) => {
      p.colors?.forEach((c) => colors.add(c.name));
      p.sizes?.forEach((s) => sizes.add(s));
      if (p.brand) brands.add(p.brand);
      max = Math.max(max, p.compareAtPrice ?? p.price);
    });
    return {
      colors: [...colors],
      sizes: [...sizes],
      brands: [...brands],
      maxPrice: Math.ceil(max / 10) * 10,
    };
  }, [products]);

  const [sort, setSort] = useState<(typeof SORTS)[number]['key']>('featured');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [minRating, setMinRating] = useState(0);
  const [selColors, setSelColors] = useState<string[]>([]);
  const [selSizes, setSelSizes] = useState<string[]>([]);
  const [selBrands, setSelBrands] = useState<string[]>([]);
  const [price, setPrice] = useState(facets.maxPrice);
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => setPrice(facets.maxPrice), [facets.maxPrice]);

  const toggle = (setter: React.Dispatch<React.SetStateAction<string[]>>, value: string) =>
    setter((prev) => (prev.includes(value) ? prev.filter((x) => x !== value) : [...prev, value]));

  const filtered = useMemo(() => {
    let list = products.filter((p) => {
      if (inStockOnly && p.stock <= 0) return false;
      if (minRating && p.rating.rating < minRating) return false;
      if (p.price > price) return false;
      if (selColors.length && !p.colors?.some((c) => selColors.includes(c.name))) return false;
      if (selSizes.length && !p.sizes?.some((s) => selSizes.includes(s))) return false;
      if (selBrands.length && !(p.brand && selBrands.includes(p.brand))) return false;
      return true;
    });

    switch (sort) {
      case 'price-asc':
        list = [...list].sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        list = [...list].sort((a, b) => b.price - a.price);
        break;
      case 'new':
        list = [...list].sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
        break;
      case 'rating':
        list = [...list].sort((a, b) => b.rating.rating - a.rating.rating);
        break;
      case 'best':
        list = [...list].sort((a, b) => b.rating.count - a.rating.count);
        break;
    }
    return list;
  }, [products, inStockOnly, minRating, price, selColors, selSizes, selBrands, sort]);

  // Reset visible count when filters change
  useEffect(() => {
    setVisible(PAGE_SIZE);
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 350);
    return () => clearTimeout(t);
  }, [inStockOnly, minRating, price, selColors, selSizes, selBrands, sort]);

  // Infinite scroll
  const sentinel = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!siteConfig.features.infiniteScroll) return;
    const el = sentinel.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setVisible((v) => Math.min(v + PAGE_SIZE, filtered.length));
      },
      { rootMargin: '400px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [filtered.length]);

  const activeCount =
    (inStockOnly ? 1 : 0) +
    (minRating ? 1 : 0) +
    selColors.length +
    selSizes.length +
    selBrands.length +
    (price < facets.maxPrice ? 1 : 0);

  function clearAll() {
    setInStockOnly(false);
    setMinRating(0);
    setSelColors([]);
    setSelSizes([]);
    setSelBrands([]);
    setPrice(facets.maxPrice);
  }

  const Filters = (
    <div className="space-y-7">
      {activeCount > 0 && (
        <button onClick={clearAll} className="flex items-center gap-1.5 text-sm text-accent hover:underline">
          <X size={14} /> Clear all ({activeCount})
        </button>
      )}

      <FilterGroup title="Availability">
        <label className="flex cursor-pointer items-center gap-2.5 text-sm text-ink-soft">
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={(e) => setInStockOnly(e.target.checked)}
            className="h-4 w-4 accent-[rgb(var(--color-accent))]"
          />
          In stock only
        </label>
      </FilterGroup>

      <FilterGroup title="Price">
        <input
          type="range"
          min={0}
          max={facets.maxPrice}
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
          className="w-full accent-[rgb(var(--color-accent))]"
        />
        <div className="mt-1 flex justify-between text-xs text-ink-muted">
          <span>{formatMoney(0, currency)}</span>
          <span className="font-medium text-ink">Up to {formatMoney(price, currency)}</span>
        </div>
      </FilterGroup>

      {facets.colors.length > 0 && (
        <FilterGroup title="Colour">
          <div className="flex flex-wrap gap-2">
            {facets.colors.map((c) => (
              <button
                key={c}
                onClick={() => toggle(setSelColors, c)}
                className={cn(
                  'rounded-pill border px-3 py-1.5 text-xs transition-colors',
                  selColors.includes(c) ? 'border-ink bg-ink text-canvas' : 'border-line text-ink-soft hover:border-ink',
                )}
              >
                {c}
              </button>
            ))}
          </div>
        </FilterGroup>
      )}

      {facets.sizes.length > 0 && (
        <FilterGroup title="Size">
          <div className="flex flex-wrap gap-2">
            {facets.sizes.map((s) => (
              <button
                key={s}
                onClick={() => toggle(setSelSizes, s)}
                className={cn(
                  'min-w-[40px] rounded-lg border px-2.5 py-1.5 text-xs transition-colors',
                  selSizes.includes(s) ? 'border-ink bg-ink text-canvas' : 'border-line text-ink-soft hover:border-ink',
                )}
              >
                {s}
              </button>
            ))}
          </div>
        </FilterGroup>
      )}

      {facets.brands.length > 1 && (
        <FilterGroup title="Brand">
          <div className="space-y-2">
            {facets.brands.map((b) => (
              <label key={b} className="flex cursor-pointer items-center gap-2.5 text-sm text-ink-soft">
                <input
                  type="checkbox"
                  checked={selBrands.includes(b)}
                  onChange={() => toggle(setSelBrands, b)}
                  className="h-4 w-4 accent-[rgb(var(--color-accent))]"
                />
                {b}
              </label>
            ))}
          </div>
        </FilterGroup>
      )}

      <FilterGroup title="Rating">
        <div className="space-y-1.5">
          {[4, 3].map((r) => (
            <button
              key={r}
              onClick={() => setMinRating(minRating === r ? 0 : r)}
              className={cn(
                'flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-sm transition-colors',
                minRating === r ? 'bg-surface-muted' : 'hover:bg-surface-muted',
              )}
            >
              <span className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={13} className={i < r ? 'fill-highlight text-highlight' : 'text-line'} />
                ))}
              </span>
              <span className="text-ink-soft">& up</span>
              {minRating === r && <Check size={14} className="ml-auto text-accent" />}
            </button>
          ))}
        </div>
      </FilterGroup>
    </div>
  );

  return (
    <div className="grid gap-10 lg:grid-cols-[260px_1fr] lg:gap-12">
      {/* Desktop sidebar */}
      <aside className="hidden lg:block">
        <div className="sticky top-24">{Filters}</div>
      </aside>

      <div>
        {/* Toolbar */}
        <div className="flex items-center justify-between gap-3 border-b border-line pb-4">
          <div className="flex items-center gap-3">
            <button onClick={() => setMobileOpen(true)} className="btn-outline gap-2 px-4 py-2.5 text-sm lg:hidden">
              <SlidersHorizontal size={15} /> Filters {activeCount > 0 && `(${activeCount})`}
            </button>
            <p className="text-sm text-ink-muted">
              {loading ? 'Updating…' : `${filtered.length} product${filtered.length === 1 ? '' : 's'}`}
            </p>
          </div>
          <label className="flex items-center gap-2 text-sm text-ink-muted">
            <span className="hidden sm:inline">Sort by</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as typeof sort)}
              className="rounded-lg border border-line bg-surface px-3 py-2 text-sm text-ink focus:border-ink focus:outline-none"
            >
              {SORTS.map((s) => (
                <option key={s.key} value={s.key}>
                  {s.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="rounded-card border border-dashed border-line py-20 text-center">
            <p className="font-serif text-2xl text-ink">No products match your filters</p>
            <p className="mt-2 text-sm text-ink-muted">Try removing a filter or two.</p>
            <button onClick={clearAll} className="btn-outline mt-6">
              Clear all filters
            </button>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-9 sm:gap-x-6 lg:grid-cols-3 xl:grid-cols-4">
            {loading
              ? Array.from({ length: PAGE_SIZE }).map((_, i) => <ProductCardSkeleton key={i} />)
              : filtered.slice(0, visible).map((p, i) => <ProductCard key={p.id} product={p} priority={i < 4} />)}
          </div>
        )}

        {/* Load more / infinite sentinel */}
        {!loading && visible < filtered.length && (
          <div ref={sentinel} className="mt-12 flex flex-col items-center gap-4">
            <p className="text-xs text-ink-muted">
              Showing {Math.min(visible, filtered.length)} of {filtered.length}
            </p>
            <button onClick={() => setVisible((v) => v + PAGE_SIZE)} className="btn-outline">
              Load more
            </button>
          </div>
        )}
      </div>

      {/* Mobile filter drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-50 bg-ink/40 backdrop-blur-sm lg:hidden"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="fixed inset-y-0 left-0 z-50 flex w-[86%] max-w-sm flex-col bg-canvas lg:hidden"
            >
              <div className="flex items-center justify-between border-b border-line px-5 py-4">
                <h2 className="font-serif text-xl">Filters</h2>
                <button onClick={() => setMobileOpen(false)} className="btn-ghost -mr-2" aria-label="Close filters">
                  <X size={22} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-5">{Filters}</div>
              <div className="border-t border-line p-4">
                <button onClick={() => setMobileOpen(false)} className="btn-primary w-full">
                  Show {filtered.length} results
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="eyebrow mb-3">{title}</p>
      {children}
    </div>
  );
}
