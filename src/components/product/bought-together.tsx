'use client';

import { useState } from 'react';
import { Check, Plus } from 'lucide-react';
import { MediaImage } from '@/components/ui/media-image';
import { Price } from '@/components/ui/price';
import { useStore } from '@/components/providers/store-provider';
import { useUI } from '@/components/providers/ui-provider';
import { formatMoney } from '@/lib/utils';
import type { Product } from '@/lib/types';

export function BoughtTogether({ product, items }: { product: Product; items: Product[] }) {
  const bundle = [product, ...items].slice(0, 3);
  const { addLine, currency } = useStore();
  const { toast, openOverlay } = useUI();
  const [selected, setSelected] = useState<Record<string, boolean>>(
    Object.fromEntries(bundle.map((p) => [p.id, true])),
  );

  const chosen = bundle.filter((p) => selected[p.id]);
  const total = chosen.reduce((sum, p) => sum + p.price, 0);

  function addAll() {
    chosen.forEach((p) => addLine({ product: p, color: p.colors?.[0]?.name, size: p.sizes?.[0], quantity: 1 }));
    toast({ title: `Added ${chosen.length} items to cart`, variant: 'success' });
    openOverlay('cart');
  }

  if (items.length === 0) return null;

  return (
    <section>
      <h2 className="font-serif text-2xl">Frequently bought together</h2>
      <div className="mt-6 flex flex-col gap-6 rounded-card border border-line bg-surface p-6 lg:flex-row lg:items-center">
        {/* Visual bundle */}
        <div className="flex flex-1 items-center gap-2">
          {bundle.map((p, i) => (
            <div key={p.id} className="flex items-center gap-2">
              <div className="relative aspect-[4/5] w-24 overflow-hidden rounded-xl sm:w-28">
                <MediaImage seed={p.images[0].seed} alt={p.images[0].alt} monogram={false} sizes="112px" />
              </div>
              {i < bundle.length - 1 && <Plus size={18} className="shrink-0 text-ink-muted" />}
            </div>
          ))}
        </div>

        {/* Checklist + total */}
        <div className="lg:w-72">
          <ul className="space-y-2">
            {bundle.map((p, i) => (
              <li key={p.id}>
                <label className="flex cursor-pointer items-start gap-2.5 text-sm">
                  <input
                    type="checkbox"
                    checked={selected[p.id] ?? false}
                    onChange={(e) => setSelected((s) => ({ ...s, [p.id]: e.target.checked }))}
                    className="mt-0.5 h-4 w-4 accent-[rgb(var(--color-accent))]"
                  />
                  <span className="flex-1">
                    <span className="text-ink">
                      {i === 0 ? 'This item: ' : ''}
                      {p.title}
                    </span>
                    <Price amount={p.price} compareAt={p.compareAtPrice} size="sm" className="ml-1" />
                  </span>
                </label>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex items-center justify-between border-t border-line pt-4">
            <span className="text-sm text-ink-soft">Total for {chosen.length}</span>
            <span className="font-serif text-xl">{formatMoney(total, currency)}</span>
          </div>
          <button onClick={addAll} disabled={chosen.length === 0} className="btn-primary mt-3 w-full">
            <Check size={16} /> Add {chosen.length} to cart
          </button>
        </div>
      </div>
    </section>
  );
}
