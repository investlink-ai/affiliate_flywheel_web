import { describe, expect, it } from 'vitest';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { decodeLine, maskRoot, scan, scanText } from '../scripts/check-no-commercial.mjs';

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
    // URL-encoded and escaped links (Reviewer P3-1)
    ['href="https://x.com/?a=1&amp;ref=abc"', 'referral-param'],
    ['https://x.com/?a=1&#38;ref=abc', 'referral-param'],
    ['https://x.com/?a=1&#x26;aff=abc', 'referral-param'],
    ['https%3A%2F%2Fx.com%2F%3Fref%3Dabc', 'referral-param'],
    ['https%253A%252F%252Fx.com%252F%253Fref%253Dabc', 'referral-param'],
    ['"https://x.com/?a=1\\u0026ref=abc"', 'referral-param'],
    ['https://x.com/%3Fref%3Dfeynmanxu', 'feynmanxu-ref'],
    ['%41ffiliate', 'affiliate'],
    // via / tag / irclickid / partner_id params (Reviewer P3-1)
    ['https://x.com/?via=someone', 'referral-param'],
    ['https://www.amazon.com/dp/B0?tag=abc-20', 'referral-param'],
    ['https://x.com/?a=1&irclickid=Q1', 'referral-param'],
    ['https://x.com/?partner_id=99', 'referral-param'],
    // Polymarket (Reviewer P3-1; CPO: no prediction markets)
    ['Polymarket review', 'polymarket'],
    ['https://polymarket.com/', 'polymarket'],
  ])('flags %s', (text, rule) => {
    expect(rules(text)).toContain(rule);
  });

  it.each([
    'https://www.investlink.ai/x',
    'Not affiliated with xAI.',
    'https://www.notion.so',
    'Commission-free trading',
    'https://twitter.com/investlink_ai',
    'https://x.com/?q=a%20b&amp;page=2',
    'Using the tags you chose',
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

  it.each([
    ['public/legacy.htm', '<a href="https://www.binance.com/?ref=x">x</a>'],
    ['public/site.webmanifest', '{"start_url": "/?via=partner"}'],
  ])('scans %s in public/ (Reviewer P3-2)', (file, content) => {
    const root = mkdtempSync(join(tmpdir(), 'cnc-'));
    try {
      mkdirSync(join(root, 'public'), { recursive: true });
      writeFileSync(join(root, file), content);
      const { findings } = scan(root);
      expect(findings.map((f: { file: string }) => f.file)).toContain(file);
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });

  it('fails a build whose output contains the old investlink.com domain', () => {
    const root = mkdtempSync(join(tmpdir(), 'cnc-'));
    try {
      mkdirSync(join(root, '.next/server/app'), { recursive: true });
      writeFileSync(join(root, '.next/server/app/index.html'), '<meta property="og:url" content="https://investlink.com"/>');
      const { findings } = scan(root, { build: true });
      expect(findings.map((f: { rule: string }) => f.rule)).toContain('old-domain');
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });

  it.each(['&#x110000;', '&#1114112;', '&#99999999999999999999;', '&#xFFFFFFFFFF;'])(
    'leaves an out-of-range entity %s undecoded instead of throwing (Reviewer P3-3)', (entity) => {
      expect(() => scanText(`a ${entity} b`)).not.toThrow();
      expect(decodeLine(`x${entity}`)).toBe(`x${entity}`);
      // Decoding still works around it.
      expect(rules(`${entity} https://x.com/?a=1&amp;ref=abc`)).toContain('referral-param');
    });
});
