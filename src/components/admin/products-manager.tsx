'use client';

import { useState } from 'react';
import { Check, Copy, Loader2, Pencil, Plus, Trash2, X } from 'lucide-react';
import type { Product } from '@/lib/types';
import { slugify } from '@/lib/utils';
import { useUI } from '@/components/providers/ui-provider';
import {
  Chips,
  Field,
  NumberInput,
  Problems,
  Section,
  TextArea,
  TextInput,
  Toggle,
} from '@/components/admin/ui';
import type { AdminConfig, SaveResult } from '@/components/admin/use-admin-config';

/* ==========================================================================
   PRODUCT MANAGER — add, edit and remove YOUR products (they live in
   custom-products.json). The demo catalogue is listed read-only below; use
   "Duplicate" to turn a demo product into an editable starting point, and
   hide the whole demo set from Store settings → Catalogue when ready.
   ========================================================================== */

function newProduct(): Product {
  return {
    id: '',
    slug: '',
    title: '',
    tagline: '',
    description: '',
    price: 49,
    compareAtPrice: null,
    images: [{ seed: '', alt: '' }],
    collections: ['all'],
    rating: { rating: 5, count: 0 },
    stock: 100,
    createdAt: new Date().toISOString().slice(0, 10),
  };
}

const csv = (list: string[] | undefined) => (list ?? []).join(', ');
const fromCsv = (value: string) =>
  value
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

export function ProductsManager({
  config,
  onSave,
}: {
  config: AdminConfig;
  onSave: (products: Product[]) => Promise<SaveResult>;
}) {
  const [products, setProducts] = useState<Product[]>(() =>
    config.customProducts.map((p) => ({ ...p })),
  );
  const [editing, setEditing] = useState<number | null>(null);
  const [draft, setDraft] = useState<Product | null>(null);
  const [saving, setSaving] = useState(false);
  const [problems, setProblems] = useState<string[]>([]);
  const [dirty, setDirty] = useState(false);
  const { toast } = useUI();

  const startEdit = (index: number) => {
    setEditing(index);
    setDraft({ ...products[index] });
  };

  const startNew = (from?: Product) => {
    const base = from
      ? { ...from, id: '', slug: `${from.slug}-copy`, title: `${from.title} (copy)` }
      : newProduct();
    setProducts((prev) => [...prev, base]);
    setEditing(products.length);
    setDraft(base);
    setDirty(true);
  };

  const applyDraft = () => {
    if (draft === null || editing === null) return;
    const finalSlug = draft.slug || slugify(draft.title);
    const done: Product = {
      ...draft,
      slug: finalSlug,
      id: draft.id || `p-${finalSlug}`,
      images: draft.images.map((img, i) => ({
        ...img,
        seed: img.seed || `${finalSlug}-${i + 1}`,
        alt: img.alt || draft.title,
      })),
    };
    setProducts((prev) => prev.map((p, i) => (i === editing ? done : p)));
    setEditing(null);
    setDraft(null);
    setDirty(true);
  };

  const cancelEdit = () => {
    // A brand-new row that was never applied has no id — drop it again.
    if (editing !== null && !products[editing].id && !products[editing].title) {
      setProducts((prev) => prev.filter((_, i) => i !== editing));
    }
    setEditing(null);
    setDraft(null);
  };

  const remove = (index: number) => {
    setProducts((prev) => prev.filter((_, i) => i !== index));
    if (editing === index) cancelEdit();
    setDirty(true);
  };

  const save = async () => {
    setSaving(true);
    setProblems([]);
    const result = await onSave(products);
    setSaving(false);
    if (result.ok) {
      setDirty(false);
      toast({ title: 'Products saved', description: 'custom-products.json updated.', variant: 'success' });
    } else {
      setProblems(result.problems);
    }
  };

  const setD = <K extends keyof Product>(key: K, value: Product[K]) =>
    setDraft((prev) => (prev ? { ...prev, [key]: value } : prev));

  return (
    <div className="space-y-6 pb-28">
      {/* Your products */}
      <Section
        id="yours"
        title={`Your products (${products.length})`}
        description="These live in src/lib/data/custom-products.json and appear ahead of the demo catalogue."
      >
        {products.length === 0 && (
          <p className="rounded-xl bg-surface-muted px-4 py-3 text-sm text-ink-soft">
            No products of your own yet — add one below or duplicate a demo product as a starting point.
          </p>
        )}
        <ul className="divide-y divide-line">
          {products.map((p, i) => (
            <li key={`${p.id}-${i}`} className="py-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate font-medium text-ink">{p.title || <em>Untitled</em>}</p>
                  <p className="text-xs text-ink-muted">
                    /products/{p.slug || '…'} · ${p.price} · stock {p.stock}
                  </p>
                </div>
                <div className="flex shrink-0 gap-1">
                  <button className="btn-ghost px-2.5" aria-label={`Edit ${p.title}`} onClick={() => startEdit(i)}>
                    <Pencil size={16} />
                  </button>
                  <button
                    className="btn-ghost px-2.5 text-ink-muted hover:text-sale"
                    aria-label={`Delete ${p.title}`}
                    onClick={() => remove(i)}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              {/* Inline editor */}
              {editing === i && draft && (
                <div className="mt-4 space-y-4 rounded-card border border-line bg-canvas p-5">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Title">
                      <TextInput
                        value={draft.title}
                        onChange={(e) => {
                          const title = e.target.value;
                          setDraft((prev) =>
                            prev
                              ? {
                                  ...prev,
                                  title,
                                  // Keep slug following the title until it's been customised
                                  slug: prev.slug === slugify(prev.title) || !prev.slug ? slugify(title) : prev.slug,
                                }
                              : prev,
                          );
                        }}
                      />
                    </Field>
                    <Field label="Slug" hint="The product URL: /products/<slug>">
                      <TextInput value={draft.slug} onChange={(e) => setD('slug', slugify(e.target.value))} />
                    </Field>
                  </div>
                  <Field label="Tagline" hint="Short marketing line for cards and the hero.">
                    <TextInput value={draft.tagline ?? ''} onChange={(e) => setD('tagline', e.target.value)} />
                  </Field>
                  <Field label="Description">
                    <TextArea rows={4} value={draft.description} onChange={(e) => setD('description', e.target.value)} />
                  </Field>

                  <div className="grid gap-4 sm:grid-cols-4">
                    <Field label="Price">
                      <NumberInput min={0} value={draft.price} onChange={(v) => setD('price', v === '' ? 0 : v)} />
                    </Field>
                    <Field label="Compare-at" hint="Optional — shows a strikethrough sale price.">
                      <NumberInput
                        min={0}
                        value={draft.compareAtPrice ?? ''}
                        onChange={(v) => setD('compareAtPrice', v === '' ? null : v)}
                      />
                    </Field>
                    <Field label="Stock">
                      <NumberInput min={0} value={draft.stock} onChange={(v) => setD('stock', v === '' ? 0 : Math.round(v))} />
                    </Field>
                    <Field label="Low-stock at" hint="Warn “order soon” below this.">
                      <NumberInput
                        min={0}
                        value={draft.lowStockThreshold ?? ''}
                        onChange={(v) => setD('lowStockThreshold', v === '' ? undefined : Math.round(v))}
                      />
                    </Field>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Sizes" hint="Comma-separated, e.g. XS, S, M, L. Leave empty for none.">
                      <TextInput value={csv(draft.sizes)} onChange={(e) => setD('sizes', fromCsv(e.target.value))} />
                    </Field>
                    <Field label="Tags" hint="Comma-separated — improves search.">
                      <TextInput value={csv(draft.tags)} onChange={(e) => setD('tags', fromCsv(e.target.value))} />
                    </Field>
                  </div>

                  {/* Colours */}
                  <Field label="Colours" hint="Optional swatches. Name + colour.">
                    <div className="space-y-2">
                      {(draft.colors ?? []).map((c, ci) => (
                        <div key={ci} className="flex items-center gap-2">
                          <input
                            type="color"
                            value={/^#[0-9a-fA-F]{6}$/.test(c.hex) ? c.hex : '#cccccc'}
                            onChange={(e) => {
                              const colors = [...(draft.colors ?? [])];
                              colors[ci] = { ...colors[ci], hex: e.target.value };
                              setD('colors', colors);
                            }}
                            className="h-10 w-12 cursor-pointer rounded-lg border border-line bg-surface p-1"
                            aria-label={`Colour swatch ${ci + 1}`}
                          />
                          <TextInput
                            value={c.name}
                            placeholder="Colour name"
                            onChange={(e) => {
                              const colors = [...(draft.colors ?? [])];
                              colors[ci] = { ...colors[ci], name: e.target.value };
                              setD('colors', colors);
                            }}
                          />
                          <button
                            type="button"
                            className="btn-ghost shrink-0 px-2.5 text-ink-muted hover:text-sale"
                            aria-label="Remove colour"
                            onClick={() => setD('colors', (draft.colors ?? []).filter((_, j) => j !== ci))}
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        className="btn-ghost text-sm"
                        onClick={() => setD('colors', [...(draft.colors ?? []), { name: '', hex: '#cccccc' }])}
                      >
                        <Plus size={15} /> Add colour
                      </button>
                    </div>
                  </Field>

                  {/* Images */}
                  <Field
                    label="Images"
                    hint="Leave URL empty for an elegant generated placeholder; paste a photo URL when you have one (add its host to next.config.mjs)."
                  >
                    <div className="space-y-2">
                      {draft.images.map((img, ii) => (
                        <div key={ii} className="flex gap-2">
                          <TextInput
                            value={img.alt}
                            placeholder="Alt text (describe the image)"
                            onChange={(e) => {
                              const images = [...draft.images];
                              images[ii] = { ...images[ii], alt: e.target.value };
                              setD('images', images);
                            }}
                          />
                          <TextInput
                            value={img.src ?? ''}
                            placeholder="https://… (optional photo URL)"
                            onChange={(e) => {
                              const images = [...draft.images];
                              images[ii] = { ...images[ii], src: e.target.value || undefined };
                              setD('images', images);
                            }}
                          />
                          <button
                            type="button"
                            className="btn-ghost shrink-0 px-2.5 text-ink-muted hover:text-sale"
                            aria-label="Remove image"
                            onClick={() => setD('images', draft.images.filter((_, j) => j !== ii))}
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        className="btn-ghost text-sm"
                        onClick={() => setD('images', [...draft.images, { seed: '', alt: '' }])}
                      >
                        <Plus size={15} /> Add image
                      </button>
                    </div>
                  </Field>

                  <Field label="Collections">
                    <Chips
                      options={config.collections.map((c) => ({ value: c.handle, label: c.title }))}
                      selected={draft.collections}
                      onToggle={(handle) =>
                        setD(
                          'collections',
                          draft.collections.includes(handle)
                            ? draft.collections.filter((h) => h !== handle)
                            : [...draft.collections, handle],
                        )
                      }
                    />
                  </Field>

                  <div className="grid gap-2 sm:grid-cols-3">
                    <Toggle checked={!!draft.bestSeller} onChange={(v) => setD('bestSeller', v)} label="Best seller" />
                    <Toggle checked={!!draft.newArrival} onChange={(v) => setD('newArrival', v)} label="New arrival" />
                    <Toggle checked={!!draft.trending} onChange={(v) => setD('trending', v)} label="Trending" />
                  </div>

                  <div className="flex justify-end gap-2 border-t border-line pt-4">
                    <button type="button" className="btn-outline px-5 py-2.5 text-sm" onClick={cancelEdit}>
                      <X size={15} /> Cancel
                    </button>
                    <button type="button" className="btn-primary px-5 py-2.5 text-sm" onClick={applyDraft}>
                      <Check size={15} /> Apply
                    </button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
        <button type="button" className="btn-outline text-sm" onClick={() => startNew()}>
          <Plus size={15} /> Add product
        </button>
      </Section>

      {/* Demo catalogue */}
      <Section
        id="demo"
        title={`Demo catalogue (${config.demoProducts.length})`}
        description={
          config.effective.hideDemoCatalog
            ? 'Hidden from the storefront. Duplicate any entry to reuse it as a starting point.'
            : 'Currently visible in the storefront. Hide it under Store settings → Catalogue once your own products are ready.'
        }
      >
        <ul className="divide-y divide-line">
          {config.demoProducts.map((p) => (
            <li key={p.id} className="flex items-center justify-between gap-3 py-2.5">
              <div className="min-w-0">
                <p className="truncate text-sm text-ink">
                  {p.title} <span className="ml-1 rounded bg-surface-muted px-1.5 py-0.5 text-[10px] uppercase tracking-wide text-ink-muted">demo</span>
                </p>
              </div>
              <button className="btn-ghost shrink-0 px-2.5 text-sm" onClick={() => startNew(p)}>
                <Copy size={15} /> Duplicate
              </button>
            </li>
          ))}
        </ul>
      </Section>

      <Problems problems={problems} />

      {/* Sticky save bar */}
      <div className="fixed inset-x-0 bottom-0 z-[var(--z-sticky)] border-t border-line bg-surface/95 backdrop-blur">
        <div className="container-page flex items-center justify-between gap-4 py-3">
          <p className="text-sm text-ink-muted">
            {dirty ? 'Unsaved changes.' : 'All changes saved.'}
            {editing !== null && ' Apply or cancel the open editor first.'}
          </p>
          <button
            onClick={save}
            disabled={saving || editing !== null || !config.meta.writable}
            className="btn-primary px-8"
          >
            {saving && <Loader2 size={15} className="animate-spin" />} Save products
          </button>
        </div>
      </div>
    </div>
  );
}
