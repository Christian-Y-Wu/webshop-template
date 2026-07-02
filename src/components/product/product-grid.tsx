import { ProductCard } from '@/components/product/product-card';
import { cn } from '@/lib/utils';
import type { Product } from '@/lib/types';

export function ProductGrid({
  products,
  className,
  columns = 4,
}: {
  products: Product[];
  className?: string;
  columns?: 3 | 4;
}) {
  return (
    <div
      className={cn(
        'grid grid-cols-2 gap-x-4 gap-y-9 sm:gap-x-6',
        columns === 4 ? 'lg:grid-cols-4' : 'lg:grid-cols-3',
        className,
      )}
    >
      {products.map((p, i) => (
        <ProductCard key={p.id} product={p} priority={i < 4} />
      ))}
    </div>
  );
}
