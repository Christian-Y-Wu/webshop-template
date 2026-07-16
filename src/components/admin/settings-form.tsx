'use client';

import { useMemo, useState } from 'react';
import { Check, Loader2, Plus, Trash2 } from 'lucide-react';
import {
  CURRENCY_CATALOG,
  FONT_PRESET_CATALOG,
  HOME_SECTION_CATALOG,
  LANGUAGE_CATALOG,
  PAYMENT_METHODS,
  THEME_CATALOG,
  type ColorModeDefault,
  type FontPreset,
  type HeroContent,
  type HomeSections,
  type NewsletterContent,
  type SiteTheme,
  type StoreMode,
  type StoreSettings,
  type StoryContent,
} from '@/config/settings-schema';
import type { AnnouncementItem, DiscountCode } from '@/config/site';
import { useUI } from '@/components/providers/ui-provider';
import {
  Chips,
  Field,
  NumberInput,
  Problems,
  Section,
  Select,
  TextArea,
  TextInput,
  Toggle,
} from '@/components/admin/ui';
import type { AdminConfig, SaveResult } from '@/components/admin/use-admin-config';

/* ==========================================================================
   THE BIG FORM — every launch-relevant setting of the store on one page,
   organised in sections with a single sticky Save bar. Writes
   store-settings.json through the admin API; `next dev` hot-reloads the
   storefront instantly, so keep a second tab open on "/" to preview.
   ========================================================================== */

const FEATURE_LABELS: Record<string, { label: string; description: string }> = {
  wishlist: { label: 'Wishlist', description: 'Hearts on product cards + wishlist page' },
  compare: { label: 'Compare', description: 'Side-by-side product comparison' },
  quickAdd: { label: 'Quick add', description: 'One-click add-to-cart on product cards' },
  reviews: { label: 'Reviews', description: 'Review sections and star ratings' },
  giftWrap: { label: 'Gift wrapping', description: 'Paid gift-wrap option in the cart' },
  freeShippingBar: { label: 'Free-shipping bar', description: 'Progress bar toward free shipping' },
  newsletterPopup: { label: 'Newsletter popup', description: 'Email capture with welcome discount' },
  exitIntentPopup: { label: 'Exit-intent popup', description: 'Last-chance offer when leaving' },
  recentlyPurchasedPopup: { label: 'Social proof toasts', description: '“Someone just bought …” notices' },
  liveChat: { label: 'Live chat launcher', description: 'Floating chat button' },
  infiniteScroll: { label: 'Infinite scroll', description: 'Auto-load more products in collections' },
};

const PAYMENT_LABELS: Record<string, string> = {
  visa: 'Visa', mastercard: 'Mastercard', amex: 'Amex', paypal: 'PayPal',
  applepay: 'Apple Pay', googlepay: 'Google Pay', shoppay: 'Shop Pay', klarna: 'Klarna',
};

/** Build the full, explicit settings object the form edits. */
function fromConfig(c: AdminConfig): Required<Omit<StoreSettings, 'colorMode' | 'accentColor' | 'hero' | 'story' | 'newsletter' | 'homeSections'>> & {
  colorMode: { default: ColorModeDefault; showToggle: boolean };
  accentColor: string | null;
  hero: HeroContent;
  story: StoryContent;
  newsletter: NewsletterContent;
  homeSections: HomeSections;
} {
  const e = c.effective;
  return {
    name: e.name,
    legalName: e.legalName,
    tagline: e.tagline,
    description: e.description,
    url: e.url,
    locale: e.locale,
    theme: e.theme,
    fontPreset: e.fontPreset,
    colorMode: { ...e.colorMode },
    accentColor: e.accentColor,
    storeMode: e.storeMode,
    featuredProductSlug: e.featuredProductSlug,
    email: e.email,
    phone: e.phone,
    address: e.address,
    social: { ...e.social },
    announcements: e.announcements.map((a) => ({ ...a })),
    countdownTo: e.countdownTo,
    countdownLabel: e.countdownLabel,
    hero: { ...e.hero },
    story: { ...e.story, milestones: e.story.milestones.map((m) => ({ ...m })) },
    newsletter: { ...e.newsletter },
    homeSections: { ...e.homeSections },
    features: { ...e.features },
    freeShippingThreshold: e.freeShippingThreshold,
    giftWrapPrice: e.giftWrapPrice,
    discountCodes: e.discountCodes.map((d) => ({ ...d })),
    defaultCurrency: e.defaultCurrency,
    currencyCodes: e.currencies.map((x) => x.code),
    defaultLanguage: e.defaultLanguage,
    languageCodes: e.languages.map((x) => x.code),
    trust: { ...e.trust },
    payments: [...e.payments],
    hideDemoCatalog: e.hideDemoCatalog,
  };
}

export function SettingsForm({
  config,
  onSave,
}: {
  config: AdminConfig;
  onSave: (settings: StoreSettings) => Promise<SaveResult>;
}) {
  const [s, setS] = useState(() => fromConfig(config));
  const [saving, setSaving] = useState(false);
  const [problems, setProblems] = useState<string[]>([]);
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const { toast } = useUI();

  const set = <K extends keyof typeof s>(key: K, value: (typeof s)[K]) =>
    setS((prev) => ({ ...prev, [key]: value }));

  const productOptions = useMemo(() => {
    const custom = config.customProducts.map((p) => ({ value: p.slug, label: `${p.title} (yours)` }));
    const demo = s.hideDemoCatalog
      ? []
      : config.demoProducts.map((p) => ({ value: p.slug, label: `${p.title} (demo)` }));
    return [...custom, ...demo];
  }, [config, s.hideDemoCatalog]);

  const save = async () => {
    setSaving(true);
    setProblems([]);
    const result = await onSave({
      ...s,
      // Normalise: empty accent = keep CSS default
      accentColor: s.accentColor || null,
    });
    setSaving(false);
    if (result.ok) {
      setSavedAt(Date.now());
      toast({ title: 'Settings saved', description: 'The storefront reloads with your changes.' , variant: 'success' });
    } else {
      setProblems(result.problems);
    }
  };

  const toggleIn = (list: string[], value: string) =>
    list.includes(value) ? list.filter((x) => x !== value) : [...list, value];

  return (
    <div className="space-y-6 pb-28">
      {/* Brand */}
      <Section id="brand" title="Brand & identity" description="Who the store is. Name and tagline appear in the header, footer, SEO titles and social shares.">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Store name">
            <TextInput value={s.name} onChange={(e) => set('name', e.target.value)} />
          </Field>
          <Field label="Legal name" hint="Shown in the footer and structured data.">
            <TextInput value={s.legalName} onChange={(e) => set('legalName', e.target.value)} />
          </Field>
        </div>
        <Field label="Tagline" hint="One line under the brand — also the default SEO title suffix.">
          <TextInput value={s.tagline} onChange={(e) => set('tagline', e.target.value)} />
        </Field>
        <Field label="Store description" hint="Used as the default meta description for search engines and social cards.">
          <TextArea value={s.description} onChange={(e) => set('description', e.target.value)} />
        </Field>
      </Section>

      {/* Contact */}
      <Section id="contact" title="Contact" description="Shown in the footer, contact page and structured data.">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Support email">
            <TextInput type="email" value={s.email} onChange={(e) => set('email', e.target.value)} />
          </Field>
          <Field label="Phone">
            <TextInput value={s.phone} onChange={(e) => set('phone', e.target.value)} />
          </Field>
        </div>
        <Field label="Address">
          <TextInput value={s.address} onChange={(e) => set('address', e.target.value)} />
        </Field>
      </Section>

      {/* Store mode */}
      <Section id="mode" title="Store mode" description="The most important switch in the template. Start focused on one product; flip to a full catalogue when your range grows — every page adapts automatically.">
        <div className="grid gap-3 sm:grid-cols-2">
          {([
            { value: 'single', title: 'Single product', body: 'The homepage becomes a conversion-first landing page for one hero product. Navigation collapses to the essentials.' },
            { value: 'catalog', title: 'Full catalogue', body: 'Mega-menu, collections, category grids, featured rails and search — the complete storefront.' },
          ] as { value: StoreMode; title: string; body: string }[]).map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => set('storeMode', opt.value)}
              className={`rounded-card border p-4 text-left transition-colors ${
                s.storeMode === opt.value ? 'border-ink bg-surface-muted' : 'border-line bg-surface hover:border-ink/40'
              }`}
            >
              <span className="flex items-center justify-between text-sm font-semibold text-ink">
                {opt.title}
                {s.storeMode === opt.value && <Check size={16} className="text-accent" />}
              </span>
              <span className="mt-1 block text-xs leading-relaxed text-ink-muted">{opt.body}</span>
            </button>
          ))}
        </div>
        <Field label="Featured product" hint="The product the homepage revolves around in single mode (and the hero product elsewhere).">
          <Select
            value={s.featuredProductSlug}
            onChange={(e) => set('featuredProductSlug', e.target.value)}
            options={productOptions}
          />
        </Field>
      </Section>

      {/* Design */}
      <Section id="design" title="Design" description="Theme, typography, brand colour and light/dark behaviour — a whole re-skin without touching code. Combine any theme, font pairing and accent for hundreds of distinct looks.">
        <Field label="Theme preset" hint="Each preset restyles the canvas, surfaces, text and accent across the whole store.">
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {THEME_CATALOG.map((t) => (
              <button
                key={t.value}
                type="button"
                onClick={() => set('theme', t.value as SiteTheme)}
                className={`rounded-card border p-3 text-left transition-colors ${
                  s.theme === t.value ? 'border-ink' : 'border-line hover:border-ink/40'
                }`}
              >
                <span className="flex items-center gap-1.5">
                  {t.swatch.map((color, i) => (
                    <span
                      key={i}
                      className="h-5 w-5 rounded-full border border-black/10"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </span>
                <span className="mt-2 flex items-center justify-between text-sm font-medium text-ink">
                  {t.label}
                  {s.theme === t.value && <Check size={14} className="text-accent" />}
                </span>
                <span className="mt-0.5 block text-[11px] leading-snug text-ink-muted">{t.description}</span>
              </button>
            ))}
          </div>
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Font pairing" hint={FONT_PRESET_CATALOG.find((f) => f.value === s.fontPreset)?.description}>
            <Select
              value={s.fontPreset}
              onChange={(e) => set('fontPreset', e.target.value as FontPreset)}
              options={FONT_PRESET_CATALOG.map((f) => ({ value: f.value, label: f.label }))}
            />
          </Field>
          <Field label="Accent colour" hint="Leave unset to keep the preset's accent.">
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={s.accentColor ?? '#b2583f'}
                onChange={(e) => set('accentColor', e.target.value)}
                className="h-11 w-14 cursor-pointer rounded-lg border border-line bg-surface p-1"
                aria-label="Accent colour"
              />
              <TextInput
                value={s.accentColor ?? ''}
                placeholder="Preset accent"
                onChange={(e) => set('accentColor', e.target.value || null)}
              />
              {s.accentColor && (
                <button type="button" onClick={() => set('accentColor', null)} className="btn-ghost shrink-0 text-xs">
                  Reset
                </button>
              )}
            </div>
          </Field>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Default colour mode" hint="'System' follows each visitor's OS preference.">
            <Select
              value={s.colorMode.default}
              onChange={(e) => set('colorMode', { ...s.colorMode, default: e.target.value as ColorModeDefault })}
              options={[
                { value: 'light', label: 'Light' },
                { value: 'dark', label: 'Dark' },
                { value: 'system', label: 'System' },
              ]}
            />
          </Field>
          <div className="self-end">
            <Toggle
              checked={s.colorMode.showToggle}
              onChange={(v) => set('colorMode', { ...s.colorMode, showToggle: v })}
              label="Show light/dark toggle"
              description="Sun/moon button in the header"
            />
          </div>
        </div>
      </Section>

      {/* Announcements */}
      <Section id="announcements" title="Announcements & countdown" description="Rotating messages in the bar above the header, and the promotional countdown used on the homepage.">
        <div className="space-y-2">
          {s.announcements.map((a, i) => (
            <div key={i} className="flex gap-2">
              <TextInput
                value={a.text}
                placeholder="Announcement text"
                onChange={(e) => {
                  const next = [...s.announcements];
                  next[i] = { ...next[i], text: e.target.value };
                  set('announcements', next);
                }}
              />
              <TextInput
                value={a.href ?? ''}
                placeholder="/link (optional)"
                className="max-w-[180px]"
                onChange={(e) => {
                  const next = [...s.announcements];
                  next[i] = { ...next[i], href: e.target.value || undefined };
                  set('announcements', next);
                }}
              />
              <button
                type="button"
                aria-label="Remove announcement"
                className="btn-ghost shrink-0 px-2.5 text-ink-muted hover:text-sale"
                onClick={() => set('announcements', s.announcements.filter((_, j) => j !== i))}
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
          <button
            type="button"
            className="btn-ghost text-sm"
            onClick={() => set('announcements', [...s.announcements, { text: '' } as AnnouncementItem])}
          >
            <Plus size={15} /> Add announcement
          </button>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Countdown ends" hint="Drives the launch-offer timer.">
            <TextInput
              type="datetime-local"
              value={s.countdownTo.slice(0, 16)}
              onChange={(e) => set('countdownTo', e.target.value ? `${e.target.value}:59` : s.countdownTo)}
            />
          </Field>
          <Field label="Countdown label">
            <TextInput value={s.countdownLabel} onChange={(e) => set('countdownLabel', e.target.value)} />
          </Field>
        </div>
      </Section>

      {/* Homepage composer */}
      <Section id="homepage" title="Homepage" description="Compose the homepage: switch sections on or off and edit the hero copy. The page recomposes without gaps — no code, no layout surgery.">
        <Field label="Sections" hint={`Sections marked “catalogue” only appear in catalogue mode; the rest apply to both modes. Current mode: ${s.storeMode === 'single' ? 'single product' : 'catalogue'}.`}>
          <div className="grid gap-2 sm:grid-cols-2">
            {HOME_SECTION_CATALOG.map((section) => (
              <Toggle
                key={section.key}
                checked={s.homeSections[section.key] ?? false}
                onChange={(v) => set('homeSections', { ...s.homeSections, [section.key]: v })}
                label={section.modes.includes('single') ? section.label : `${section.label} (catalogue)`}
                description={section.description}
              />
            ))}
          </div>
        </Field>
        <div className="border-t border-line pt-4">
          <p className="mb-3 text-sm font-medium text-ink">Hero (catalogue mode)</p>
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Eyebrow" hint="Small uppercase line above the headline.">
                <TextInput value={s.hero.eyebrow} onChange={(e) => set('hero', { ...s.hero, eyebrow: e.target.value })} />
              </Field>
              <Field label="Headline">
                <TextInput value={s.hero.heading} onChange={(e) => set('hero', { ...s.hero, heading: e.target.value })} />
              </Field>
            </div>
            <Field label="Subheading">
              <TextArea rows={2} value={s.hero.subheading} onChange={(e) => set('hero', { ...s.hero, subheading: e.target.value })} />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Primary button label">
                <TextInput value={s.hero.primaryCtaLabel} onChange={(e) => set('hero', { ...s.hero, primaryCtaLabel: e.target.value })} />
              </Field>
              <Field label="Primary button link">
                <TextInput value={s.hero.primaryCtaHref} onChange={(e) => set('hero', { ...s.hero, primaryCtaHref: e.target.value })} />
              </Field>
              <Field label="Secondary button label" hint="Leave empty to show only one button.">
                <TextInput value={s.hero.secondaryCtaLabel} onChange={(e) => set('hero', { ...s.hero, secondaryCtaLabel: e.target.value })} />
              </Field>
              <Field label="Secondary button link">
                <TextInput value={s.hero.secondaryCtaHref} onChange={(e) => set('hero', { ...s.hero, secondaryCtaHref: e.target.value })} />
              </Field>
            </div>
          </div>
        </div>
      </Section>

      {/* Founder story */}
      <Section id="story" title="Founder story & history" description="An optional homepage section with your founder, origin story and company timeline. Enable it under Homepage → Sections; edit every word here.">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Eyebrow">
            <TextInput value={s.story.eyebrow} onChange={(e) => set('story', { ...s.story, eyebrow: e.target.value })} />
          </Field>
          <Field label="Title">
            <TextInput value={s.story.title} onChange={(e) => set('story', { ...s.story, title: e.target.value })} />
          </Field>
        </div>
        <Field label="Story" hint="Blank lines split the text into paragraphs.">
          <TextArea rows={5} value={s.story.text} onChange={(e) => set('story', { ...s.story, text: e.target.value })} />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Founder name">
            <TextInput value={s.story.founderName} onChange={(e) => set('story', { ...s.story, founderName: e.target.value })} />
          </Field>
          <Field label="Founder role">
            <TextInput value={s.story.founderRole} onChange={(e) => set('story', { ...s.story, founderRole: e.target.value })} />
          </Field>
        </div>
        <Field label="Pull quote" hint="Shown over the founder portrait — skip the quotation marks, they’re added automatically.">
          <TextInput value={s.story.quote} onChange={(e) => set('story', { ...s.story, quote: e.target.value })} />
        </Field>
        <Field label="Timeline milestones">
          <div className="space-y-2">
            {s.story.milestones.map((m, i) => (
              <div key={i} className="grid grid-cols-[80px_1fr_auto] items-start gap-2">
                <TextInput
                  value={m.year}
                  placeholder="Year"
                  onChange={(e) => {
                    const next = s.story.milestones.map((x) => ({ ...x }));
                    next[i].year = e.target.value;
                    set('story', { ...s.story, milestones: next });
                  }}
                />
                <div className="space-y-2">
                  <TextInput
                    value={m.title}
                    placeholder="Milestone title"
                    onChange={(e) => {
                      const next = s.story.milestones.map((x) => ({ ...x }));
                      next[i].title = e.target.value;
                      set('story', { ...s.story, milestones: next });
                    }}
                  />
                  <TextInput
                    value={m.text}
                    placeholder="One-line description"
                    onChange={(e) => {
                      const next = s.story.milestones.map((x) => ({ ...x }));
                      next[i].text = e.target.value;
                      set('story', { ...s.story, milestones: next });
                    }}
                  />
                </div>
                <button
                  type="button"
                  aria-label="Remove milestone"
                  className="btn-ghost shrink-0 px-2.5 text-ink-muted hover:text-sale"
                  onClick={() => set('story', { ...s.story, milestones: s.story.milestones.filter((_, j) => j !== i) })}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
            <button
              type="button"
              className="btn-ghost text-sm"
              onClick={() => set('story', { ...s.story, milestones: [...s.story.milestones, { year: '', title: '', text: '' }] })}
            >
              <Plus size={15} /> Add milestone
            </button>
          </div>
        </Field>
      </Section>

      {/* Newsletter band */}
      <Section id="newsletter" title="Newsletter band" description="The email sign-up at the end of the homepage. Toggle it under Homepage → Sections; the popup version is a separate switch under Features.">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Eyebrow">
            <TextInput value={s.newsletter.eyebrow} onChange={(e) => set('newsletter', { ...s.newsletter, eyebrow: e.target.value })} />
          </Field>
          <Field label="Heading">
            <TextInput value={s.newsletter.heading} onChange={(e) => set('newsletter', { ...s.newsletter, heading: e.target.value })} />
          </Field>
        </div>
        <Field label="Text">
          <TextArea rows={2} value={s.newsletter.text} onChange={(e) => set('newsletter', { ...s.newsletter, text: e.target.value })} />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Button label">
            <TextInput value={s.newsletter.buttonLabel} onChange={(e) => set('newsletter', { ...s.newsletter, buttonLabel: e.target.value })} />
          </Field>
          <Field label="Success message" hint="Mention the welcome code if you keep one in Discount codes.">
            <TextInput value={s.newsletter.successText} onChange={(e) => set('newsletter', { ...s.newsletter, successText: e.target.value })} />
          </Field>
        </div>
      </Section>

      {/* Features */}
      <Section id="features" title="Features" description="Conversion features you can switch on or off without touching code.">
        <div className="grid gap-2 sm:grid-cols-2">
          {Object.entries(FEATURE_LABELS).map(([key, meta]) => (
            <Toggle
              key={key}
              checked={s.features[key as keyof typeof s.features] ?? false}
              onChange={(v) => set('features', { ...s.features, [key]: v })}
              label={meta.label}
              description={meta.description}
            />
          ))}
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Free-shipping threshold" hint="In the base currency. Used by the progress bar and checkout.">
            <NumberInput min={0} value={s.freeShippingThreshold} onChange={(v) => set('freeShippingThreshold', v === '' ? 0 : v)} />
          </Field>
          <Field label="Gift-wrap price">
            <NumberInput min={0} value={s.giftWrapPrice} onChange={(v) => set('giftWrapPrice', v === '' ? 0 : v)} />
          </Field>
        </div>
      </Section>

      {/* Discounts */}
      <Section id="discounts" title="Discount codes" description="Redeemable in the cart and re-validated server-side at checkout — tampered requests can't invent a discount.">
        <div className="space-y-2">
          {s.discountCodes.map((d, i) => (
            <div key={i} className="grid grid-cols-[1fr_1.4fr_auto_auto_auto] items-center gap-2">
              <TextInput
                value={d.code}
                placeholder="CODE"
                onChange={(e) => {
                  const next = [...s.discountCodes];
                  next[i] = { ...next[i], code: e.target.value.toUpperCase() };
                  set('discountCodes', next);
                }}
              />
              <TextInput
                value={d.description}
                placeholder="Shown to the customer"
                onChange={(e) => {
                  const next = [...s.discountCodes];
                  next[i] = { ...next[i], description: e.target.value };
                  set('discountCodes', next);
                }}
              />
              <Select
                value={d.kind}
                className="w-36"
                onChange={(e) => {
                  const next = [...s.discountCodes];
                  next[i] = { ...next[i], kind: e.target.value as DiscountCode['kind'] };
                  set('discountCodes', next);
                }}
                options={[
                  { value: 'percent', label: '% off' },
                  { value: 'freeShipping', label: 'Free shipping' },
                ]}
              />
              {d.kind === 'percent' ? (
                <NumberInput
                  min={1}
                  max={100}
                  className="w-20"
                  value={d.value ?? ''}
                  onChange={(v) => {
                    const next = [...s.discountCodes];
                    next[i] = { ...next[i], value: v === '' ? undefined : v };
                    set('discountCodes', next);
                  }}
                />
              ) : (
                <span className="w-20" />
              )}
              <button
                type="button"
                aria-label="Remove discount"
                className="btn-ghost shrink-0 px-2.5 text-ink-muted hover:text-sale"
                onClick={() => set('discountCodes', s.discountCodes.filter((_, j) => j !== i))}
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
          <button
            type="button"
            className="btn-ghost text-sm"
            onClick={() => set('discountCodes', [...s.discountCodes, { code: '', description: '', kind: 'percent', value: 10 }])}
          >
            <Plus size={15} /> Add discount code
          </button>
        </div>
      </Section>

      {/* Localisation */}
      <Section id="localisation" title="Currencies & languages" description="What the switcher in the header offers. Display currencies are illustrative — real charges always use the base currency.">
        <Field label="Enabled currencies">
          <Chips
            options={CURRENCY_CATALOG.map((c) => ({ value: c.code, label: `${c.flag} ${c.code}` }))}
            selected={s.currencyCodes}
            onToggle={(code) => set('currencyCodes', toggleIn(s.currencyCodes, code))}
          />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Base currency" hint="Prices in your product data are in this currency; Stripe charges in it.">
            <Select
              value={s.defaultCurrency}
              onChange={(e) => set('defaultCurrency', e.target.value)}
              options={s.currencyCodes.map((code) => ({ value: code, label: code }))}
            />
          </Field>
          <Field label="Default language">
            <Select
              value={s.defaultLanguage}
              onChange={(e) => set('defaultLanguage', e.target.value)}
              options={s.languageCodes.map((code) => ({
                value: code,
                label: LANGUAGE_CATALOG.find((l) => l.code === code)?.label ?? code,
              }))}
            />
          </Field>
        </div>
        <Field label="Enabled languages" hint="UI strings ship complete for every language below — add more in src/lib/i18n/dictionaries.ts.">
          <Chips
            options={LANGUAGE_CATALOG.map((l) => ({ value: l.code, label: `${l.flag} ${l.label}` }))}
            selected={s.languageCodes}
            onToggle={(code) => set('languageCodes', toggleIn(s.languageCodes, code))}
          />
        </Field>
      </Section>

      {/* Social */}
      <Section id="social" title="Social profiles" description="Linked from the footer and included in structured data so search engines connect your profiles to the store.">
        <div className="grid gap-4 sm:grid-cols-2">
          {(Object.keys(s.social) as (keyof typeof s.social)[]).map((key) => (
            <Field key={key} label={key[0].toUpperCase() + key.slice(1)}>
              <TextInput
                value={s.social[key]}
                placeholder={`https://${key}.com/yourstore`}
                onChange={(e) => set('social', { ...s.social, [key]: e.target.value })}
              />
            </Field>
          ))}
        </div>
      </Section>

      {/* Trust & payments */}
      <Section id="trust" title="Trust & payments" description="The social-proof numbers shown across the store, and the payment badges in the footer and checkout.">
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Average rating">
            <NumberInput min={0} max={5} step={0.1} value={s.trust.ratingValue} onChange={(v) => set('trust', { ...s.trust, ratingValue: v === '' ? 0 : v })} />
          </Field>
          <Field label="Review count">
            <NumberInput min={0} value={s.trust.ratingCount} onChange={(v) => set('trust', { ...s.trust, ratingCount: v === '' ? 0 : v })} />
          </Field>
          <Field label="Guarantee (days)">
            <NumberInput min={0} value={s.trust.guaranteeDays} onChange={(v) => set('trust', { ...s.trust, guaranteeDays: v === '' ? 0 : v })} />
          </Field>
        </div>
        <Field label="Payment methods shown">
          <Chips
            options={PAYMENT_METHODS.map((p) => ({ value: p, label: PAYMENT_LABELS[p] ?? p }))}
            selected={s.payments}
            onToggle={(p) => set('payments', toggleIn(s.payments, p))}
          />
        </Field>
      </Section>

      {/* SEO & domain */}
      <Section id="seo" title="SEO & domain" description="Canonical URLs, sitemap, Open Graph images and JSON-LD resolve from the deployment automatically — set the fallback URL here and NEXT_PUBLIC_SITE_URL once you have a custom domain.">
        <Field label="Fallback site URL" hint={`Currently resolving to: ${config.meta.siteUrl}${config.meta.siteUrlFromEnv ? ' (from environment — that wins over this field)' : ''}`}>
          <TextInput value={s.url} onChange={(e) => set('url', e.target.value)} />
        </Field>
        <Field label="Site language code" hint="The <html lang> attribute — e.g. en, da, de.">
          <TextInput value={s.locale} onChange={(e) => set('locale', e.target.value)} className="max-w-[120px]" />
        </Field>
      </Section>

      {/* Catalogue */}
      <Section id="catalogue" title="Catalogue" description="Manage the products themselves on the Products page.">
        <Toggle
          checked={s.hideDemoCatalog}
          onChange={(v) => set('hideDemoCatalog', v)}
          label="Hide the demo catalogue"
          description={
            config.customProducts.length === 0
              ? 'Add at least one product of your own first (Products page).'
              : `Only your ${config.customProducts.length} product${config.customProducts.length > 1 ? 's' : ''} will be visible in the store.`
          }
        />
      </Section>

      <Problems problems={problems} />

      {/* Sticky save bar */}
      <div className="fixed inset-x-0 bottom-0 z-[var(--z-sticky)] border-t border-line bg-surface/95 backdrop-blur">
        <div className="container-page flex items-center justify-between gap-4 py-3">
          <p className="text-sm text-ink-muted">
            {config.meta.writable
              ? 'Saving writes src/config/store-settings.json — commit it with your next deploy.'
              : 'Read-only deployment — run the studio locally to edit.'}
          </p>
          <div className="flex items-center gap-3">
            {savedAt && problems.length === 0 && !saving && (
              <span className="flex items-center gap-1.5 text-sm text-success">
                <Check size={15} /> Saved
              </span>
            )}
            <button onClick={save} disabled={saving || !config.meta.writable} className="btn-primary px-8">
              {saving && <Loader2 size={15} className="animate-spin" />} Save settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
