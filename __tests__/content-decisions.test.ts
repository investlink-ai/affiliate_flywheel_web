import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';
import { primaryAuthor } from '@/lib/author';
import { tools } from '@/lib/data';

const ROOT = process.cwd();
const SHIPPED = ['app', 'components', 'lib', 'public'];

// Tracked and new (not ignored) source files only; build output such as public/sw.js is excluded.
const shipped = execFileSync('git', ['ls-files', '--cached', '--others', '--exclude-standard', ...SHIPPED], {
  cwd: ROOT,
  encoding: 'utf8',
})
  .split('\n')
  .filter(Boolean)
  .map((p) => join(ROOT, p))
  .filter((p) => existsSync(p))
  .filter((p) =>
  /\.(tsx?|mjs|js|json|svg|txt|xml|md)$/.test(p)
);
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
    expect(primaryAuthor.socialProfiles.github).toBeUndefined();
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
