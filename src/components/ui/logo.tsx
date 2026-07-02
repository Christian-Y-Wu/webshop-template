import Link from 'next/link';
import { siteConfig } from '@/config/site';
import { cn } from '@/lib/utils';

/** Wordmark logo. Replace with an <Image>/SVG for a real brand mark. */
export function Logo({ className, href = '/' }: { className?: string; href?: string }) {
  return (
    <Link
      href={href}
      aria-label={`${siteConfig.name} — home`}
      className={cn(
        'font-serif text-2xl font-medium tracking-tight text-ink transition-opacity hover:opacity-80',
        className,
      )}
    >
      {siteConfig.name}
      <span className="text-accent">.</span>
    </Link>
  );
}
