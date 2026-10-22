import { describe, expect, it } from 'vitest';
import { execFileSync } from 'node:child_process';
import { resolve } from 'node:path';
import { DEFAULT_SITE_URL, resolveSiteUrl } from '@/lib/site';

describe('site URL (CTO ruling d)', () => {
  it('defaults to https://www.investlink.ai', () => {
    expect(DEFAULT_SITE_URL).toBe('https://www.investlink.ai');
    expect(resolveSiteUrl(undefined)).toBe('https://www.investlink.ai');
    expect(resolveSiteUrl('')).toBe('https://www.investlink.ai');
    expect(resolveSiteUrl('   ')).toBe('https://www.investlink.ai');
  });

  it.each([
    'https://investlink.com',
    'https://www.investlink.com/',
    'http://INVESTLINK.COM/path',
    'investlink.com',
    'not a url',
    'ftp://www.investlink.ai',
    'javascript:alert(1)',
  ])('falls back to https://www.investlink.ai for %s', (raw) => {
    expect(resolveSiteUrl(raw)).toBe('https://www.investlink.ai');
  });

  it.each([
    ['https://www.investlink.ai/', 'https://www.investlink.ai'],
    ['https://investlink.ai', 'https://investlink.ai'],
    ['https://example.com', 'https://example.com'],
    ['http://localhost:3000/', 'http://localhost:3000'],
    ['https://preview.investlink.ai/x?y=1', 'https://preview.investlink.ai'],
  ])('keeps the origin of %s', (raw, expected) => {
    expect(resolveSiteUrl(raw)).toBe(expected);
  });

  it('no investlink.com fallback is left in site code', () => {
    let out = '';
    try {
      out = execFileSync('git', ['grep', '-n', '-i', 'investlink\\.com', '--', 'app', 'components', 'lib', 'public', 'middleware.ts', 'next.config.mjs', '.env.example', 'README.md', 'docs/DEPLOYMENT.md'], {
        cwd: resolve(__dirname, '..'),
        encoding: 'utf8',
      });
    } catch (e) {
      // git grep exits 1 when nothing matches.
      if ((e as { status?: number }).status !== 1) throw e;
    }
    expect(out.trim()).toBe('');
  });
});
