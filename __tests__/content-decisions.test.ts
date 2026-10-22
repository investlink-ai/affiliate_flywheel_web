import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { primaryAuthor, getAuthorSchema, getAuthorByline } from '@/lib/author';
import { SITE_URL } from '@/lib/site';
import { generateReviewSchema, generateArticleSchema, organizationSchema } from '@/lib/schema';
import { renderToStaticMarkup } from 'react-dom/server';
import { createElement } from 'react';
import { AuthorByline } from '@/components/AuthorByline';
import { tools } from '@/lib/data';

const ROOT = process.cwd();
const SHIPPED = ['app', 'components', 'lib', 'public'];

// Read source directly so these checks also run where subprocesses are restricted.
// Exclude the generated PWA bundles that .gitignore excludes from source.
const shipped = SHIPPED.flatMap((root) =>
  readdirSync(join(ROOT, root), { recursive: true, withFileTypes: true })
    .filter((entry) => entry.isFile())
    .map((entry) => join(entry.parentPath, entry.name))
).filter((p) => /\.(tsx?|mjs|js|json|svg|txt|xml|md)$/.test(p))
  .filter((p) => !/public\/(sw\.js|workbox-[^/]+\.js)$/.test(p));
const grepShipped = (re: RegExp) => shipped.filter((p) => re.test(readFileSync(p, 'utf8')));
const read = (p: string) => readFileSync(join(ROOT, p), 'utf8');

const NOT_PAID =
  "InvestLink isn't paid by any product it mentions and uses no referral links. Everything here is general information, not financial advice.";

describe('CPO content decisions', () => {
  it('(a) home signup copy is exact and no subscriber count ships', () => {
    expect(read('app/page.tsx')).toContain(
      'description="Get one practical lesson a week on investing tools. Free, confirm by email, unsubscribe anytime."'
    );
    expect(grepShipped(/\d[\d,]*\+\s*(investors|subscribers|readers|traders|creators)/i)).toEqual([]);
  });

  it('(b) Polymarket is gone from data, logos and scoring', () => {
    expect(tools.map((t) => t.slug)).not.toContain('polymarket');
    expect(existsSync(join(ROOT, 'public/images/tools/polymarket-logo.svg'))).toBe(false);
    expect(grepShipped(/polymarket/i)).toEqual([]);
  });

  it('(c) no @FeynmanXu links ship; X handle is @investlink_ai', () => {
    expect(grepShipped(/feynmanxu/i)).toEqual([]);
    expect(primaryAuthor.socialProfiles.twitter).toBe('https://x.com/investlink_ai');
    expect(primaryAuthor.socialProfiles).not.toHaveProperty('github');
    expect(primaryAuthor.socialProfiles).not.toHaveProperty('linkedin');
    expect(read('app/layout.tsx')).toContain("creator: '@investlink_ai'");
    expect(read('app/reviews/[slug]/page.tsx')).toContain("creator: '@investlink_ai'");
    expect(read('app/privacy/page.tsx')).toContain('href="https://x.com/investlink_ai"');
    expect(read('app/privacy/page.tsx')).not.toMatch(/mailto:/);
  });

  it('(d) no SocialProof section or socialProof data', () => {
    expect(grepShipped(/SocialProof|socialProof/)).toEqual([]);
    expect(existsSync(join(ROOT, 'components/SocialProof.tsx'))).toBe(false);
  });

  it('(e) home cards: exact not-paid copy, no testing claims, consistent wording', () => {
    const home = read('app/page.tsx');
    expect(home).toContain(NOT_PAID);
    expect(home).toContain("title: 'Plain-English explanations'");
    expect(home).not.toContain('Hands-On Testing');
    expect(grepShipped(/independent testing/i)).toEqual([]);
    for (const p of ['components/DisclosureNote.tsx', 'components/Tooltip.tsx']) {
      expect(read(p)).toContain(NOT_PAID);
    }
    // Privacy line 31 is kept verbatim by decision.
    expect(read('app/privacy/page.tsx').split('\n')[30]).toContain(
      'InvestLink does not use referral links and is not paid by the products it reviews.'
    );
  });
});


describe('CPO organisation identity', () => {
  const description = 'We explain what each tool does in plain English. This is general information, not financial advice.';

  it('uses only the organisation identity and X profile', () => {
    expect(primaryAuthor).toEqual({
      name: 'InvestLink', description, url: `${SITE_URL}/about`,
      socialProfiles: { twitter: 'https://x.com/investlink_ai' },
    });
    expect(getAuthorByline()).toBe('Reviewed by InvestLink');
    expect(getAuthorSchema()).toEqual({
      '@type': 'Organization', name: 'InvestLink', url: `${SITE_URL}/about`,
      sameAs: ['https://x.com/investlink_ai'],
    });
    expect(organizationSchema.url).toBe(SITE_URL);
    expect(organizationSchema.logo).toBe(`${SITE_URL}/icon.svg`);
    expect(organizationSchema).not.toHaveProperty('founder');
    const graph = generateReviewSchema(tools[0]!)['@graph'];
    for (const node of graph) {
      if ('author' in node) expect(node.author).toEqual(getAuthorSchema());
    }
    expect(generateArticleSchema({
      title: 'Research tools', description: 'Notes and research',
      url: `${SITE_URL}/research-workflow`, image: `${SITE_URL}/og-image.png`,
      datePublished: '2026-01-01', dateModified: '2026-01-02',
    }).author).toEqual(getAuthorSchema());
  });

  it('renders organisation bylines with the updated date and no Verified badge', () => {
    for (const variant of ['inline', 'compact', 'card'] as const) {
      const html = renderToStaticMarkup(createElement(AuthorByline, {
        variant, showSocial: true, dateUpdated: '2026-01-02',
      }));
      expect(html).toContain('Reviewed by InvestLink');
      expect(html).toContain('href="/about"');
      expect(html).toContain('2026-01-02');
      expect(html).not.toMatch(/Verified|Hands-on tested|LinkedIn|Sam Xu/);
      if (variant === 'card') {
        expect(html).toContain(description);
        expect(html).toContain('https://x.com/investlink_ai');
      }
    }
  });

  it('ships no email addresses, personal identities, old domains or prediction markets', () => {
    expect(grepShipped(/mailto:|[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i)).toEqual([]);
    expect(grepShipped(/Sam Xu|Melbourne AI Expert|Verified Expert|Hands-on test(?:ed|ing)|personally tested|investlink\.com|prediction[- ]markets?/i)).toEqual([]);
    expect(read('app/page.tsx')).toContain(description);
    expect(read('app/about/page.tsx')).toContain('About InvestLink');
    expect(read('app/reviews/[slug]/page.tsx')).toContain('About InvestLink');
  });
});
