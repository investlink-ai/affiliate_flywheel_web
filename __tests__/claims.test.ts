import { describe, expect, it } from 'vitest';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';

/**
 * CPO ruling (22 Oct): no unverifiable figures, rankings, ratings, badges or
 * endorsements; suggestions are "suggested" / "may suit", never "best for you".
 * Guards the rendered sources against these phrases coming back.
 */
const ROOT = resolve(__dirname, '..');
// UserTestimonials renders nothing by design (tested in components/UserTestimonials.test.tsx).
const SKIP = new Set(['components/UserTestimonials.tsx']);

function files(dir: string, out: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) files(p, out);
    else if (/\.(tsx?|mjs)$/.test(name)) out.push(p);
  }
  return out;
}

const SOURCES = [...files(join(ROOT, 'app')), ...files(join(ROOT, 'components')),
  join(ROOT, 'lib/data.ts'), join(ROOT, 'lib/schema.ts')]
  .filter((f) => !SKIP.has(relative(ROOT, f)));

const BANNED: Array<[string, RegExp]> = [
  ['hands-on claim', /hands-on/i],
  ['Verified badge', />\s*Verified\b|\bVerified <time|lastVerified|dateVerified/],
  ['personalised recommendations', /personali[sz]ed recommendations?/i],
  ['"for you" ranking', /\b(best|right|perfect|top)\b[^.\n]{0,20}\bfor you\b/i],
  ['perfect tool/match', /\bperfect\b/i],
  ['rating/ranking badge', /top[- ]rated|editor(&apos;|')?s choice|best match|top recommendation|\bwinner badges\b|#1\b|rated #|\bour rating\b/i],
  ['star rating figure', /\.rating\b|ratingCount|aggregateRating|reviewRating|ratingValue/],
  ['third-party ranking', /\bG2\b|fortune 100|\bYC companies\b/i],
  ['rate or return figure', /\d+(\.\d+)?\s?% (annual|interest|apy|apr|return|yield)|interest rate|maximi[sz]e returns/i],
  ['unverifiable tenure', /since 20\d\d/i],
  ['"Best …" title', /['"`>]\s*Best [A-Z][^'"`<]*(Tools?|Platforms?)\b/],
  ['self-endorsement', /honest, in-depth|in-depth reviews|actually work|top picks|low fees/i],
  ['unsourced price in JSON-LD', /priceValidUntil|'@type': 'Offer'/],
];

describe('no unverifiable claims in rendered sources (CPO 22 Oct)', () => {
  it('scans the site sources', () => {
    expect(SOURCES.length).toBeGreaterThan(30);
  });

  it.each(BANNED)('no %s', (_label, re) => {
    const hits: string[] = [];
    for (const f of SOURCES) {
      readFileSync(f, 'utf8').split('\n').forEach((line, i) => {
        if (re.test(line)) hits.push(`${relative(ROOT, f)}:${i + 1}: ${line.trim().slice(0, 120)}`);
      });
    }
    expect(hits).toEqual([]);
  });

  it('suggestion badges say "May suit", never "Best for" / "Top for"', async () => {
    const { tools } = await import('@/lib/data');
    for (const t of tools) {
      for (const badge of Object.values(t.recommendations ?? {})) expect(badge, t.slug).toMatch(/^May suit /);
    }
  });
});
