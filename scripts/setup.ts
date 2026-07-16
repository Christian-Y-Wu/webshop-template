/* ==========================================================================
   GUIDED SETUP — `npm run setup`

   Interactively asks for the essentials (brand, contact, accent colour,
   store mode, first product) and patches them straight into
   src/config/site.ts, src/app/globals.css and src/lib/data/products.ts.

   This is a convenience for going from "cloned the template" to "branded,
   running store" in a couple of minutes without hand-editing TypeScript.
   It does targeted text replacement on known literals — it does not delete
   the demo catalogue or any other content, so it's safe to re-run.
   ========================================================================== */

import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { randomBytes } from 'node:crypto';
import { join } from 'node:path';
import prompts from 'prompts';
import { slugify } from '../src/lib/utils';

const root = join(__dirname, '..');
const sitePath = join(root, 'src/config/site.ts');
const cssPath = join(root, 'src/app/globals.css');
const productsPath = join(root, 'src/lib/data/products.ts');
const envPath = join(root, '.env.local');

function luminance(r: number, g: number, b: number) {
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function hexToRgbTriple(hex: string) {
  const clean = hex.replace('#', '');
  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);
  return { r, g, b, triple: `${r} ${g} ${b}` };
}

function tint(r: number, g: number, b: number, amount: number) {
  const mix = (c: number) => Math.round(c * amount + 255 * (1 - amount));
  return `${mix(r)} ${mix(g)} ${mix(b)}`;
}

/** Escape a value for safe interpolation into a single-quoted TS string literal. */
function esc(value: string) {
  return value.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

async function main() {
  console.log('\n✨ AURA setup — let’s brand your store.\n');

  const answers = await prompts(
    [
      { type: 'text', name: 'storeName', message: 'Store name', initial: 'AURA' },
      { type: 'text', name: 'tagline', message: 'Tagline (one line)', initial: 'Considered essentials for a beautiful everyday.' },
      { type: 'text', name: 'email', message: 'Support email', initial: 'hello@example.com' },
      {
        type: 'text',
        name: 'accent',
        message: 'Accent colour (hex, e.g. #b2583f)',
        initial: '#b2583f',
        validate: (v: string) => (/^#?[0-9a-fA-F]{6}$/.test(v) ? true : 'Enter a 6-digit hex colour, e.g. #b2583f'),
      },
      {
        type: 'select',
        name: 'theme',
        message: 'Base theme preset',
        choices: [
          { title: 'Light (default)', value: '' },
          { title: 'Midnight (dark)', value: 'midnight' },
          { title: 'Botanic (green, light)', value: 'botanic' },
          { title: 'Cobalt (blue, light)', value: 'cobalt' },
        ],
      },
      {
        type: 'select',
        name: 'storeMode',
        message: 'Store mode',
        choices: [
          { title: 'Single product — focused landing page', value: 'single' },
          { title: 'Catalog — full multi-product shop', value: 'catalog' },
        ],
      },
      { type: 'text', name: 'productTitle', message: 'Your first product’s name', initial: 'My First Product' },
      { type: 'text', name: 'productTagline', message: 'Short marketing tagline for it', initial: 'Made with care.' },
      { type: 'number', name: 'productPrice', message: 'Price (base currency, e.g. USD)', initial: 49, float: true },
      {
        type: 'text',
        name: 'productDescription',
        message: 'Short product description',
        initial: 'A thoughtfully made product, built to last.',
      },
      {
        type: 'confirm',
        name: 'enableAdmin',
        message: 'Enable the Admin Studio (/admin) with a generated password?',
        initial: true,
      },
    ],
    { onCancel: () => { console.log('\nSetup cancelled — no files changed.'); process.exit(1); } },
  );

  const { r, g, b, triple: accentTriple } = hexToRgbTriple(answers.accent);
  const accentSoft = tint(r, g, b, 0.14);
  const accentInk = luminance(r, g, b) < 140 ? '255 255 255' : '26 24 22';
  const slug = slugify(answers.productTitle);
  const today = new Date().toISOString().slice(0, 10);

  // ---- Patch site.ts -------------------------------------------------------
  let site = readFileSync(sitePath, 'utf8');
  site = site.replace(/name: '[^']*',/, `name: '${esc(answers.storeName)}',`);
  site = site.replace(/tagline: '[^']*',/, `tagline: '${esc(answers.tagline)}',`);
  site = site.replace(/email: '[^']*',/, `email: '${esc(answers.email)}',`);
  site = site.replace(/theme: '[^']*' as/, `theme: '${answers.theme}' as`);
  site = site.replace(/storeMode: '[^']*' as/, `storeMode: '${answers.storeMode}' as`);
  site = site.replace(/featuredProductSlug: '[^']*',/, `featuredProductSlug: '${slug}',`);
  writeFileSync(sitePath, site);

  // ---- Patch globals.css (only the :root block — first match) -------------
  let css = readFileSync(cssPath, 'utf8');
  css = css.replace(/--color-accent: [^;]+;/, `--color-accent: ${accentTriple};`);
  css = css.replace(/--color-accent-soft: [^;]+;/, `--color-accent-soft: ${accentSoft};`);
  css = css.replace(/--color-accent-ink: [^;]+;/, `--color-accent-ink: ${accentInk};`);
  writeFileSync(cssPath, css);

  // ---- Prepend the new product to products.ts ------------------------------
  let productsSrc = readFileSync(productsPath, 'utf8');
  const marker = 'export const products: Product[] = [';
  const entry = `  {
    id: 'p-${slug}',
    slug: '${slug}',
    title: '${esc(answers.productTitle)}',
    tagline: '${esc(answers.productTagline)}',
    description: '${esc(answers.productDescription)}',
    price: ${answers.productPrice},
    images: [{ seed: '${slug}-1', alt: '${esc(answers.productTitle)}' }],
    collections: ['all'],
    rating: { rating: 5, count: 0 },
    stock: 100,
    createdAt: '${today}',
  },
`;
  productsSrc = productsSrc.replace(marker, `${marker}\n${entry}`);
  writeFileSync(productsPath, productsSrc);

  console.log('\n✓ Branding written to src/config/site.ts and src/app/globals.css');
  console.log(`✓ "${answers.productTitle}" added to src/lib/data/products.ts`);
  if (answers.storeMode === 'single') {
    console.log(`✓ Homepage set to focus on "${answers.productTitle}" (single-product mode)`);
  }

  // ---- Optionally enable the Admin Studio ----------------------------------
  if (answers.enableAdmin) {
    const existingEnv = existsSync(envPath) ? readFileSync(envPath, 'utf8') : '';
    if (/^ADMIN_PASSWORD=.+$/m.test(existingEnv)) {
      console.log('✓ Admin Studio already enabled (ADMIN_PASSWORD found in .env.local)');
    } else {
      // URL-safe passphrase, ~26 chars of entropy — plenty for a rate-limited login.
      const password = randomBytes(18).toString('base64url');
      const line = `ADMIN_PASSWORD=${password}\n`;
      writeFileSync(envPath, existingEnv ? `${existingEnv.replace(/\n?$/, '\n')}${line}` : line);
      console.log('✓ Admin Studio enabled — your admin password (also saved to .env.local):');
      console.log(`\n    ${password}\n`);
      console.log('  Keep it somewhere safe; you need it to open /admin.');
    }
  }

  console.log('\nNext: npm run dev — then open http://localhost:3000/admin to configure everything visually.\n');
}

main();
