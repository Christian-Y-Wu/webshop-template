'use client';

import { useMemo, useState } from 'react';
import { BadgeCheck, Camera, Image as ImageIcon, ThumbsUp, Video } from 'lucide-react';
import { StarRating } from '@/components/ui/star-rating';
import { MediaImage } from '@/components/ui/media-image';
import { getReviews, ratingBreakdown } from '@/lib/data/reviews';
import { cn, compactNumber, formatDate } from '@/lib/utils';
import type { Product } from '@/lib/types';

const SORTS = ['Most helpful', 'Newest', 'Highest rated', 'Lowest rated'] as const;

export function ProductReviews({ product }: { product: Product }) {
  const all = useMemo(() => getReviews(product.id), [product.id]);
  const [filter, setFilter] = useState<number | null>(null);
  const [sort, setSort] = useState<(typeof SORTS)[number]>('Most helpful');
  const [helpful, setHelpful] = useState<Record<string, boolean>>({});

  const breakdown = ratingBreakdown(product.rating.rating, product.rating.count);

  const reviews = useMemo(() => {
    let list = filter ? all.filter((r) => Math.round(r.rating) === filter) : [...all];
    switch (sort) {
      case 'Newest':
        list.sort((a, b) => +new Date(b.date) - +new Date(a.date));
        break;
      case 'Highest rated':
        list.sort((a, b) => b.rating - a.rating);
        break;
      case 'Lowest rated':
        list.sort((a, b) => a.rating - b.rating);
        break;
      default:
        list.sort((a, b) => b.helpful - a.helpful);
    }
    return list;
  }, [all, filter, sort]);

  return (
    <section id="reviews" className="scroll-mt-24">
      <div className="grid gap-10 lg:grid-cols-[340px_1fr] lg:gap-16">
        {/* Summary */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          <h2 className="font-serif text-2xl">Customer reviews</h2>
          <div className="mt-4 flex items-end gap-4">
            <p className="font-serif text-5xl leading-none">{product.rating.rating.toFixed(1)}</p>
            <div className="pb-1">
              <StarRating rating={product.rating.rating} size={18} />
              <p className="mt-1 text-sm text-ink-muted">Based on {compactNumber(product.rating.count)} reviews</p>
            </div>
          </div>

          {/* Histogram */}
          <div className="mt-5 space-y-1.5">
            {breakdown.map((b) => (
              <button
                key={b.stars}
                onClick={() => setFilter(filter === b.stars ? null : b.stars)}
                className={cn(
                  'flex w-full items-center gap-3 rounded-lg px-2 py-1 text-sm transition-colors hover:bg-surface-muted',
                  filter === b.stars && 'bg-surface-muted',
                )}
              >
                <span className="w-8 shrink-0 text-ink-soft">{b.stars} ★</span>
                <span className="h-2 flex-1 overflow-hidden rounded-full bg-surface-muted">
                  <span className="block h-full rounded-full bg-highlight" style={{ width: `${b.percent}%` }} />
                </span>
                <span className="w-10 shrink-0 text-right text-xs text-ink-muted">{compactNumber(b.count)}</span>
              </button>
            ))}
          </div>

          <div className="mt-6 rounded-card border border-line bg-surface p-4">
            <p className="text-sm font-medium text-ink">Share your experience</p>
            <p className="mt-1 text-xs text-ink-muted">Bought this piece? We’d love to hear your thoughts.</p>
            <button className="btn-outline mt-3 w-full py-2.5 text-sm">
              <Camera size={15} /> Write a review
            </button>
          </div>
        </div>

        {/* List */}
        <div>
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line pb-4">
            <div className="flex flex-wrap gap-2">
              <FilterChip active={filter === null} onClick={() => setFilter(null)}>
                All
              </FilterChip>
              {[5, 4, 3].map((n) => (
                <FilterChip key={n} active={filter === n} onClick={() => setFilter(filter === n ? null : n)}>
                  {n} ★
                </FilterChip>
              ))}
              <FilterChip active={false} onClick={() => {}}>
                <ImageIcon size={13} /> With photos
              </FilterChip>
            </div>
            <label className="flex items-center gap-2 text-sm text-ink-muted">
              Sort
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as (typeof SORTS)[number])}
                className="rounded-lg border border-line bg-surface px-3 py-1.5 text-sm text-ink focus:border-ink focus:outline-none"
              >
                {SORTS.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </label>
          </div>

          <ul className="divide-y divide-line">
            {reviews.map((r) => (
              <li key={r.id} className="py-6">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="grid h-10 w-10 place-items-center rounded-full bg-accent-soft font-serif text-accent">
                      {r.author.charAt(0)}
                    </span>
                    <div>
                      <p className="flex items-center gap-1.5 text-sm font-medium text-ink">
                        {r.author}
                        {r.verified && (
                          <span className="inline-flex items-center gap-0.5 text-[11px] font-normal text-success">
                            <BadgeCheck size={13} /> Verified
                          </span>
                        )}
                      </p>
                      <p className="text-xs text-ink-muted">{r.location}</p>
                    </div>
                  </div>
                  <p className="text-xs text-ink-muted">{formatDate(r.date)}</p>
                </div>

                <div className="mt-3 flex items-center gap-3">
                  <StarRating rating={r.rating} size={14} />
                  <p className="text-sm font-medium text-ink">{r.title}</p>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">{r.body}</p>

                {r.fit && (
                  <p className="mt-3 inline-flex rounded-md bg-surface-muted px-2.5 py-1 text-xs text-ink-soft">
                    Fit: {r.fit}
                  </p>
                )}

                {(r.hasImage || r.hasVideo) && (
                  <div className="mt-3 flex gap-2">
                    {r.hasImage && (
                      <div className="relative h-16 w-16 overflow-hidden rounded-lg">
                        <MediaImage seed={`${r.id}-img`} alt="Review photo" monogram={false} sizes="64px" />
                      </div>
                    )}
                    {r.hasVideo && (
                      <div className="relative grid h-16 w-16 place-items-center overflow-hidden rounded-lg bg-ink/5">
                        <Video size={18} className="text-ink-soft" />
                      </div>
                    )}
                  </div>
                )}

                <button
                  onClick={() => setHelpful((h) => ({ ...h, [r.id]: !h[r.id] }))}
                  className={cn(
                    'mt-4 inline-flex items-center gap-1.5 rounded-pill border px-3 py-1.5 text-xs transition-colors',
                    helpful[r.id] ? 'border-accent text-accent' : 'border-line text-ink-soft hover:border-ink',
                  )}
                >
                  <ThumbsUp size={13} className={cn(helpful[r.id] && 'fill-accent')} />
                  Helpful ({r.helpful + (helpful[r.id] ? 1 : 0)})
                </button>
              </li>
            ))}
          </ul>

          <button className="btn-outline mt-6 w-full">Load more reviews</button>
        </div>
      </div>
    </section>
  );
}

function FilterChip({ children, active, onClick }: { children: React.ReactNode; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'inline-flex items-center gap-1 rounded-pill border px-3 py-1.5 text-xs font-medium transition-colors',
        active ? 'border-ink bg-ink text-canvas' : 'border-line text-ink-soft hover:border-ink',
      )}
    >
      {children}
    </button>
  );
}
