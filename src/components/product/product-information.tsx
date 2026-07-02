import { Accordion, type AccordionItem } from '@/components/ui/accordion';
import { siteConfig } from '@/config/site';
import type { Product } from '@/lib/types';

export function ProductInformation({ product }: { product: Product }) {
  const items: AccordionItem[] = [];

  if (product.specs?.length) {
    items.push({
      title: 'Specifications',
      content: (
        <dl className="grid grid-cols-1 gap-x-8 gap-y-2 sm:grid-cols-2">
          {product.specs.map((s) => (
            <div key={s.label} className="flex justify-between gap-4 border-b border-line/60 py-2">
              <dt className="text-ink-muted">{s.label}</dt>
              <dd className="text-right font-medium text-ink">{s.value}</dd>
            </div>
          ))}
        </dl>
      ),
    });
  }

  if (product.materials || product.care) {
    items.push({
      title: 'Materials & Care',
      content: (
        <div className="space-y-3">
          {product.materials && (
            <p>
              <span className="font-medium text-ink">Materials. </span>
              {product.materials}
            </p>
          )}
          {product.care && (
            <p>
              <span className="font-medium text-ink">Care. </span>
              {product.care}
            </p>
          )}
        </div>
      ),
    });
  }

  if (product.ingredients) {
    items.push({
      title: 'Ingredients',
      content: <p>{product.ingredients}</p>,
    });
  }

  items.push({
    title: 'Shipping & Returns',
    content: (
      <div className="space-y-2">
        <p>
          Free carbon-neutral shipping on all orders over ${siteConfig.freeShippingThreshold}. Orders are
          dispatched within 1–2 business days, with delivery in 3–5 business days domestically and 5–10
          business days internationally.
        </p>
        <p>
          Enjoy free returns within {siteConfig.trust.guaranteeDays} days — items should be unworn with tags
          attached. {product.shippingNote ?? ''}
        </p>
      </div>
    ),
  });

  return (
    <div>
      <div className="prose-sm max-w-prose">
        <h2 className="font-serif text-2xl">About this piece</h2>
        <p className="mt-4 text-[15px] leading-relaxed text-ink-soft">{product.description}</p>
        {product.tagline && (
          <p className="mt-4 border-l-2 border-accent pl-4 font-serif text-lg italic text-ink">
            “{product.tagline}”
          </p>
        )}
      </div>
      <div className="mt-8">
        <Accordion items={items} defaultOpen={0} />
      </div>
    </div>
  );
}
