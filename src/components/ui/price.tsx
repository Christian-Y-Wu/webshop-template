'use client';

import { useStore } from '@/components/providers/store-provider';
import { cn, formatMoney } from '@/lib/utils';

/** Renders a price (optionally with a struck-through compare-at) in the
 *  shopper's chosen currency. */
export function Price({
  amount,
  compareAt,
  className,
  size = 'base',
}: {
  amount: number;
  compareAt?: number | null;
  className?: string;
  size?: 'sm' | 'base' | 'lg';
}) {
  const { currency } = useStore();
  const onSale = compareAt && compareAt > amount;
  const sizes = {
    sm: 'text-sm',
    base: 'text-[15px]',
    lg: 'text-xl',
  } as const;

  return (
    <span className={cn('inline-flex items-baseline gap-2', sizes[size], className)}>
      <span className={cn('font-medium', onSale ? 'text-sale' : 'text-ink')}>
        {formatMoney(amount, currency)}
      </span>
      {onSale && (
        <span className="text-ink-muted line-through decoration-1 opacity-70">
          {formatMoney(compareAt!, currency)}
        </span>
      )}
    </span>
  );
}
