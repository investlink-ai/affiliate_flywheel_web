import { describe, it, expect, vi } from 'vitest';
import { GET, POST } from '@/app/api/newsletter/route';

describe('/api/newsletter (retired)', () => {
  it('answers 410 Gone to POST and GET without calling Kit', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch');
    for (const handler of [POST, GET]) {
      const res = handler();
      expect(res.status).toBe(410);
      expect(await res.json()).toMatchObject({ success: false });
    }
    expect(fetchSpy).not.toHaveBeenCalled();
    fetchSpy.mockRestore();
  });

  it('no longer reads server-side Kit secrets', async () => {
    const { readFileSync } = await import('node:fs');
    const src = readFileSync('app/api/newsletter/route.ts', 'utf8');
    expect(src).not.toMatch(/KIT_API_KEY|KIT_FORM_ID|api\.kit\.com|convertkit/i);
  });
});
