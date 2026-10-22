import { describe, expect, it } from 'vitest';
import nextConfig from '../next.config.mjs';

type Header = { key: string; value: string };

async function csp(): Promise<string> {
  const rules = (await (nextConfig as { headers: () => Promise<Array<{ source: string; headers: Header[] }>> }).headers());
  const all = rules.find((r) => r.source === '/:path*');
  const header = all?.headers.find((h) => h.key === 'Content-Security-Policy');
  if (!header) throw new Error('no CSP on /:path*');
  return header.value;
}

function directive(policy: string, name: string): string[] {
  const d = policy.split(';').map((s) => s.trim()).find((s) => s.startsWith(`${name} `));
  return d ? d.split(/\s+/).slice(1) : [];
}

describe('Content-Security-Policy', () => {
  it('form-action allows the Kit hosted form the signup forms post to (Reviewer P2-1)', async () => {
    const formAction = directive(await csp(), 'form-action');
    expect(formAction).toContain("'self'");
    expect(formAction).toContain('https://app.kit.com');
    const { getEmailProvider } = await import('@/lib/email/provider');
    const action = new URL(getEmailProvider({ NEXT_PUBLIC_EMAIL_PROVIDER: 'kit', NEXT_PUBLIC_KIT_FORM_ID: '123' }).formAction);
    expect(formAction).toContain(action.origin);
  });

  it('form-action allows nothing else cross-origin', async () => {
    expect(directive(await csp(), 'form-action')).toEqual(["'self'", 'https://app.kit.com']);
  });
});
