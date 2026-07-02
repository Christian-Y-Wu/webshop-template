'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, Minus, Plus, X } from 'lucide-react';
import { useUI } from '@/components/providers/ui-provider';
import { useStore } from '@/components/providers/store-provider';
import { MediaImage } from '@/components/ui/media-image';
import { Badge } from '@/components/ui/badge';
import { Price } from '@/components/ui/price';
import { StarRating } from '@/components/ui/star-rating';
import { cn, compactNumber } from '@/lib/utils';

export function QuickView() {
  const { quickView, closeQuickView, openOverlay, toast } = useUI();
  const { addLine } = useStore();
  const product = quickView;

  const [color, setColor] = useState<string | undefined>();
  const [size, setSize] = useState<string | undefined>();
  const [qty, setQty] = useState(1);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    if (product) {
      setColor(product.colors?.[0]?.name);
      setSize(undefined);
      setQty(1);
      setActiveImage(0);
    }
  }, [product]);

  if (!product) return null;
  const needsSize = Boolean(product.sizes?.length);
  const soldOut = product.stock <= 0;
  const canAdd = !soldOut && (!needsSize || Boolean(size));

  function handleAdd() {
    if (!product || !canAdd) return;
    addLine({ product, color, size, quantity: qty });
    toast({ title: 'Added to cart', description: product.title, image: product.images[0].seed, variant: 'success' });
    closeQuickView();
    openOverlay('cart');
  }

  return (
    <AnimatePresence>
      {product && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeQuickView}
            className="fixed inset-0 z-[60] bg-ink/50 backdrop-blur-sm"
          />
          <div className="fixed inset-0 z-[60] flex items-end justify-center p-0 sm:items-center sm:p-6">
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 40, scale: 0.98 }}
              transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
              className="relative grid max-h-[92vh] w-full max-w-3xl grid-cols-1 overflow-hidden rounded-t-3xl bg-canvas sm:grid-cols-2 sm:rounded-3xl"
              role="dialog"
              aria-label={`Quick view: ${product.title}`}
            >
              <button
                onClick={closeQuickView}
                className="absolute right-3 top-3 z-10 grid h-9 w-9 place-items-center rounded-full bg-surface/80 text-ink shadow-soft backdrop-blur hover:bg-surface"
                aria-label="Close quick view"
              >
                <X size={18} />
              </button>

              {/* Gallery */}
              <div className="relative">
                <div className="relative aspect-square sm:aspect-auto sm:h-full">
                  <MediaImage
                    seed={product.images[activeImage].seed}
                    src={product.images[activeImage].src}
                    alt={product.images[activeImage].alt}
                  />
                  <div className="absolute left-3 top-3 flex flex-col gap-1.5">
                    {product.badges?.slice(0, 2).map((b) => (
                      <Badge key={b.label} tone={b.tone}>
                        {b.label}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
                  {product.images.map((img, i) => (
                    <button
                      key={img.seed}
                      onClick={() => setActiveImage(i)}
                      aria-label={`Image ${i + 1}`}
                      className={cn(
                        'h-1.5 rounded-full transition-all',
                        activeImage === i ? 'w-5 bg-ink' : 'w-1.5 bg-ink/30',
                      )}
                    />
                  ))}
                </div>
              </div>

              {/* Details */}
              <div className="flex flex-col overflow-y-auto p-6">
                <div className="flex items-center gap-2 text-xs text-ink-muted">
                  <StarRating rating={product.rating.rating} size={13} />
                  <span>
                    {product.rating.rating} · {compactNumber(product.rating.count)} reviews
                  </span>
                </div>
                <h2 className="mt-2 font-serif text-2xl leading-tight">{product.title}</h2>
                {product.subtitle && <p className="mt-1 text-sm text-ink-muted">{product.subtitle}</p>}
                <div className="mt-3">
                  <Price amount={product.price} compareAt={product.compareAtPrice} size="lg" />
                </div>
                <p className="mt-4 text-sm leading-relaxed text-ink-soft line-clamp-3">{product.description}</p>

                {/* Colors */}
                {product.colors && (
                  <div className="mt-5">
                    <p className="mb-2 text-xs font-medium text-ink">
                      Colour: <span className="text-ink-soft">{color}</span>
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {product.colors.map((c) => (
                        <button
                          key={c.name}
                          onClick={() => setColor(c.name)}
                          aria-label={c.name}
                          className={cn(
                            'h-8 w-8 rounded-full ring-1 ring-inset ring-black/10 transition-transform hover:scale-110',
                            color === c.name && 'ring-2 ring-ink ring-offset-2 ring-offset-canvas',
                          )}
                          style={{ background: c.hex }}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Sizes */}
                {product.sizes && (
                  <div className="mt-5">
                    <p className="mb-2 text-xs font-medium text-ink">Size</p>
                    <div className="flex flex-wrap gap-2">
                      {product.sizes.map((s) => (
                        <button
                          key={s}
                          onClick={() => setSize(s)}
                          className={cn(
                            'min-w-[46px] rounded-lg border px-3 py-2 text-sm transition-colors',
                            size === s
                              ? 'border-ink bg-ink text-canvas'
                              : 'border-line text-ink-soft hover:border-ink',
                          )}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Qty + add */}
                <div className="mt-auto pt-6">
                  <div className="flex gap-3">
                    <div className="flex items-center rounded-pill border border-line">
                      <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="grid h-11 w-11 place-items-center text-ink-soft hover:text-ink" aria-label="Decrease">
                        <Minus size={15} />
                      </button>
                      <span className="w-8 text-center tabular-nums">{qty}</span>
                      <button onClick={() => setQty((q) => q + 1)} className="grid h-11 w-11 place-items-center text-ink-soft hover:text-ink" aria-label="Increase">
                        <Plus size={15} />
                      </button>
                    </div>
                    <button onClick={handleAdd} disabled={!canAdd} className="btn-accent flex-1">
                      {soldOut ? 'Sold out' : needsSize && !size ? 'Select a size' : 'Add to cart'}
                      {canAdd && <Check size={16} />}
                    </button>
                  </div>
                  <Link
                    href={`/products/${product.slug}`}
                    onClick={closeQuickView}
                    className="mt-3 block text-center text-sm text-ink-soft link-underline"
                  >
                    View full details
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
