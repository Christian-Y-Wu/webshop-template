'use client';

import { Truck, Check } from 'lucide-react';
import { useStore } from '@/components/providers/store-provider';
import { siteConfig } from '@/config/site';
import { formatMoney, clamp } from '@/lib/utils';

export function FreeShippingBar({ subtotal }: { subtotal: number }) {
  const { currency } = useStore();
  const threshold = siteConfig.freeShippingThreshold;
  const remaining = Math.max(0, threshold - subtotal);
  const pct = clamp((subtotal / threshold) * 100, 6, 100);
  const unlocked = remaining <= 0;

  return (
    <div>
      <p className="flex items-center gap-2 text-sm text-ink-soft">
        {unlocked ? (
          <>
            <Check size={16} className="text-success" />
            <span className="font-medium text-ink">You’ve unlocked free shipping!</span>
          </>
        ) : (
          <>
            <Truck size={16} className="text-accent" />
            <span>
              You’re <strong className="font-semibold text-ink">{formatMoney(remaining, currency)}</strong> away
              from free shipping
            </span>
          </>
        )}
      </p>
      <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-surface-muted">
        <div
          className="h-full rounded-full bg-gradient-to-r from-accent to-accent transition-all duration-700 ease-premium"
          style={{ width: `${pct}%`, background: unlocked ? 'rgb(var(--color-success))' : undefined }}
        />
      </div>
    </div>
  );
}
