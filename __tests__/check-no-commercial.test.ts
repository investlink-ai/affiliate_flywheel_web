import { describe, expect, it } from 'vitest';
import { resolve } from 'node:path';
import { maskRoot, scan, scanText } from '../scripts/check-no-commercial.mjs';

type Hit = { rule: string };
const rules = (text: string) => (scanText(text) as Hit[]).map((h) => h.rule);

describe('check-no-commercial', () => {
  it('site source has no referral, sponsored, Binance or affiliate content', () => {
    const { files, findings } = scan(resolve(__dirname, '..'));
    expect(files).toBeGreaterThan(20);
    expect(findings).toEqual([]);
  });

  it.each([
    ['https://investlink.com/x', 'old-domain'],
    ['hello@investlink.com', 'old-domain'],
    ['https://www.notion.so/?ref=feynmanxu', 'feynmanxu-ref'],
    ['https://example.com/?aff_id=12', 'referral-param'],
    ['<a rel="noopener sponsored">', 'sponsored'],
    ['Binance review', 'binance'],
    ['Affiliate Disclosure', 'affiliate'],
    ['affiliates', 'affiliate'],
    ['href="/go/etoro"', 'go-redirect'],
  ])('flags %s', (text, rule) => {
    expect(rules(text)).toContain(rule);
  });

  it.each([
    'https://www.investlink.ai/x',
    'Not affiliated with xAI.',
    'https://www.notion.so',
    'Commission-free trading',
    'https://twitter.com/investlink_ai',
  ])('allows %s', (text) => {
    expect(rules(text)).toEqual([]);
  });

  it('ignores the checkout path (CI clones into affiliate_flywheel_web) but not content', () => {
    const root = '/home/runner/work/affiliate_flywheel_web/affiliate_flywheel_web';
    const enc = encodeURIComponent(root);
    expect(rules(maskRoot(`require("${root}/app/page.tsx")`, root))).toEqual([]);
    expect(rules(maskRoot(`route-loader?filePath=${enc}%2Fapp%2Frobots.ts`, root))).toEqual([]);
    expect(rules(maskRoot(`${root}/x Affiliate Disclosure`, root))).toContain('affiliate');
  });
});
