import type { Config } from 'tailwindcss';

/**
 * AURA design system.
 *
 * Almost every visual token is driven by a CSS custom property declared in
 * `src/app/globals.css`. That means a whole store can be re-skinned by editing
 * a handful of variables (or by dropping in a new theme preset) — no need to
 * touch component code.
 */
const config: Config = {
  content: [
    './src/app/**/*.{ts,tsx}',
    './src/components/**/*.{ts,tsx}',
    './src/lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        canvas: 'rgb(var(--color-canvas) / <alpha-value>)',
        surface: 'rgb(var(--color-surface) / <alpha-value>)',
        'surface-muted': 'rgb(var(--color-surface-muted) / <alpha-value>)',
        ink: 'rgb(var(--color-ink) / <alpha-value>)',
        'ink-soft': 'rgb(var(--color-ink-soft) / <alpha-value>)',
        'ink-muted': 'rgb(var(--color-ink-muted) / <alpha-value>)',
        line: 'rgb(var(--color-line) / <alpha-value>)',
        accent: 'rgb(var(--color-accent) / <alpha-value>)',
        'accent-soft': 'rgb(var(--color-accent-soft) / <alpha-value>)',
        'accent-ink': 'rgb(var(--color-accent-ink) / <alpha-value>)',
        success: 'rgb(var(--color-success) / <alpha-value>)',
        sale: 'rgb(var(--color-sale) / <alpha-value>)',
        highlight: 'rgb(var(--color-highlight) / <alpha-value>)',
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        serif: ['var(--font-serif)', 'ui-serif', 'Georgia', 'serif'],
      },
      fontSize: {
        'display-lg': ['clamp(2.75rem, 6vw, 5.5rem)', { lineHeight: '0.98', letterSpacing: '-0.02em' }],
        display: ['clamp(2.25rem, 4.5vw, 4rem)', { lineHeight: '1.02', letterSpacing: '-0.02em' }],
        headline: ['clamp(1.75rem, 3vw, 2.75rem)', { lineHeight: '1.08', letterSpacing: '-0.01em' }],
      },
      letterSpacing: {
        eyebrow: '0.22em',
      },
      borderRadius: {
        card: 'var(--radius-card)',
        pill: '999px',
      },
      boxShadow: {
        soft: '0 1px 2px rgb(24 22 20 / 0.04), 0 8px 24px -12px rgb(24 22 20 / 0.12)',
        lift: '0 2px 4px rgb(24 22 20 / 0.05), 0 24px 48px -24px rgb(24 22 20 / 0.28)',
        pop: '0 40px 80px -32px rgb(24 22 20 / 0.35)',
      },
      maxWidth: {
        container: '84rem',
        prose: '46rem',
      },
      transitionTimingFunction: {
        premium: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.6s cubic-bezier(0.22, 1, 0.36, 1) both',
        marquee: 'marquee var(--marquee-duration, 40s) linear infinite',
        shimmer: 'shimmer 1.6s infinite',
      },
    },
  },
  plugins: [],
};

export default config;
