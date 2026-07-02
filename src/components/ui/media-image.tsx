import Image from 'next/image';
import { cn, seededRandom } from '@/lib/utils';

/* ==========================================================================
   MediaImage
   The template ships without binary photography. Instead, every image is a
   deterministic, premium-looking "studio gradient" derived from a seed — so a
   fresh install looks intentional and complete. Drop in a real photo by
   passing `src` (a remote/imported URL) and it renders <Image> instead.
   ========================================================================== */

/** Curated, on-brand gradient pairs — soft studio backdrops. */
const PALETTES: [string, string, string][] = [
  ['#efe7db', '#d8c7ad', '#b9a488'], // warm sand
  ['#e7e9e4', '#c9cfc4', '#a9b2a3'], // sage stone
  ['#efe3dc', '#dcc2b4', '#c19a86'], // clay blush
  ['#e6e8ec', '#cdd2da', '#aab2bf'], // cool fog
  ['#efe9df', '#e0d0b8', '#cbb48f'], // oat cream
  ['#e9e4e6', '#d3c4cb', '#b7a1ac'], // dusty mauve
  ['#e3e7e7', '#c2cecd', '#9db2b0'], // eucalyptus
  ['#f0e9df', '#e6d3a9', '#d8bd7f'], // butter
  ['#e8e6e2', '#cfc9bf', '#b0a693'], // greige
  ['#ece4de', '#d7bca9', '#bd9179'], // terracotta
];

function paletteFor(seed: string) {
  const idx = Math.floor(seededRandom(seed) * PALETTES.length) % PALETTES.length;
  const p = PALETTES[idx];
  const angle = 120 + Math.floor(seededRandom(seed + 'a') * 90);
  return { p, angle };
}

interface MediaImageProps {
  seed: string;
  alt: string;
  src?: string;
  className?: string;
  /** Show a subtle brand monogram watermark. */
  monogram?: boolean;
  /** Priority image (LCP). */
  priority?: boolean;
  sizes?: string;
  rounded?: boolean;
}

export function MediaImage({
  seed,
  alt,
  src,
  className,
  monogram = true,
  priority,
  sizes = '(max-width: 768px) 100vw, 33vw',
  rounded,
}: MediaImageProps) {
  if (src) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        className={cn('object-cover', rounded && 'rounded-card', className)}
      />
    );
  }

  const { p, angle } = paletteFor(seed);
  return (
    <div
      role="img"
      aria-label={alt}
      className={cn('absolute inset-0 overflow-hidden', rounded && 'rounded-card', className)}
      style={{
        backgroundImage: `linear-gradient(${angle}deg, ${p[0]} 0%, ${p[1]} 55%, ${p[2]} 100%)`,
      }}
    >
      {/* Soft studio highlight */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            'radial-gradient(120% 80% at 30% 22%, rgba(255,255,255,0.55), transparent 55%)',
        }}
      />
      {/* Gentle vignette for depth */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            'radial-gradient(120% 120% at 70% 90%, rgba(0,0,0,0.10), transparent 60%)',
        }}
      />
      {monogram && (
        <span
          aria-hidden
          className="absolute bottom-3 right-4 font-serif text-[13px] tracking-[0.25em] text-black/15"
        >
          AURA
        </span>
      )}
    </div>
  );
}
