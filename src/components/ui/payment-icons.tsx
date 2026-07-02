import { cn } from '@/lib/utils';

/* Lightweight, dependency-free payment "chips". Swap for brand SVGs in prod. */

const LABELS: Record<string, string> = {
  visa: 'VISA',
  mastercard: 'MC',
  amex: 'AMEX',
  paypal: 'PayPal',
  applepay: 'Pay',
  googlepay: 'GPay',
  shoppay: 'Shop',
  klarna: 'Klarna',
};

export function PaymentIcons({ methods, className }: { methods: readonly string[]; className?: string }) {
  return (
    <ul className={cn('flex flex-wrap items-center gap-1.5', className)}>
      {methods.map((m) => (
        <li
          key={m}
          className="flex h-7 min-w-[42px] items-center justify-center rounded-md border border-line bg-surface px-2 text-[10px] font-semibold uppercase tracking-wide text-ink-soft"
          title={LABELS[m] ?? m}
        >
          {LABELS[m] ?? m}
        </li>
      ))}
    </ul>
  );
}
