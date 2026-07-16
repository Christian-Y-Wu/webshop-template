import { describe, expect, it } from 'vitest';
import { validateSettings } from './settings-schema';

describe('validateSettings — design & homepage content', () => {
  it('accepts a settings object using every new field', () => {
    expect(
      validateSettings({
        theme: 'noir',
        fontPreset: 'modern',
        hero: { heading: 'Hello', primaryCtaHref: '/collections/all' },
        story: {
          title: 'Our beginning',
          text: 'One paragraph.\n\nAnother.',
          founderName: 'Jo',
          milestones: [{ year: '2020', title: 'Started', text: 'In a garage.' }],
        },
        newsletter: { heading: 'Join us', successText: 'Welcome!' },
        homeSections: { instagram: false, story: true },
      }),
    ).toEqual([]);
  });

  it('rejects unknown theme and font presets', () => {
    expect(validateSettings({ theme: 'neon' }).join(' ')).toContain('"theme"');
    expect(validateSettings({ fontPreset: 'comic-sans' }).join(' ')).toContain('"fontPreset"');
  });

  it('rejects unknown or non-boolean homepage sections', () => {
    expect(validateSettings({ homeSections: { heroo: true } }).join(' ')).toContain('heroo');
    expect(validateSettings({ homeSections: { faq: 'yes' } }).join(' ')).toContain('faq');
  });

  it('rejects unknown hero fields and non-string values', () => {
    expect(validateSettings({ hero: { headline: 'typo' } }).join(' ')).toContain('headline');
    expect(validateSettings({ hero: { heading: 42 } }).join(' ')).toContain('hero.heading');
  });

  it('rejects malformed story milestones', () => {
    expect(validateSettings({ story: { milestones: [{ year: 2020, title: 'x', text: 'y' }] } }).join(' ')).toContain(
      'milestone',
    );
  });
});
