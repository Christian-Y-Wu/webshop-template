import { cn } from '@/lib/utils';
import type { BadgeTone } from '@/lib/types';

const tones: Record<BadgeTone, string> = {
  accent: 'bg-accent text-accent-ink',
  sale: 'bg-sale text-white',
  success: 'bg-success/12 text-success',
  ink: 'bg-ink text-canvas',
  highlight: 'bg-highlight/90 text-ink',
};

export function Badge({
  children,
  tone = 'ink',
  className,
}: {
  children: React.ReactNode;
  tone?: BadgeTone;
  className?: string;
}) {
  return <span className={cn('badge', tones[tone], className)}>{children}</span>;
}
