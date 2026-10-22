import { describe, expect, it, vi } from 'vitest';
import { render } from '@testing-library/react';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { getEmailProvider, isSignupAvailable, kitFormId } from '@/lib/email/provider';
import { SignupForm } from '@/components/SignupForm';

vi.mock('@/lib/analytics', () => ({ trackNewsletterSignup: vi.fn() }));

const KIT = 'https://app.kit.com/forms/9042473/subscriptions';

describe('email provider is fail-safe (CTO ruling c)', () => {
  describe('production build', () => {
    it('uses the Kit hosted form whenever KIT_FORM_ID is set, even without NEXT_PUBLIC_EMAIL_PROVIDER', () => {
      const p = getEmailProvider({ NODE_ENV: 'production', KIT_FORM_ID: '9042473' });
      expect(p.id).toBe('kit');
      expect(p.formAction).toBe(KIT);
    });

    it('uses the Kit hosted form with NEXT_PUBLIC_KIT_FORM_ID too, and ignores NEXT_PUBLIC_EMAIL_PROVIDER=mock', () => {
      expect(getEmailProvider({ NODE_ENV: 'production', NEXT_PUBLIC_KIT_FORM_ID: '9042473' }).formAction).toBe(KIT);
      expect(getEmailProvider({ NODE_ENV: 'production', NEXT_PUBLIC_EMAIL_PROVIDER: 'mock', KIT_FORM_ID: '9042473' }).id).toBe('kit');
    });

    it('is off (signup hidden) when nothing is configured, never the mock', () => {
      for (const env of [
        { NODE_ENV: 'production' },
        { NODE_ENV: 'production', NEXT_PUBLIC_EMAIL_PROVIDER: 'mock' },
        { NODE_ENV: 'production', NEXT_PUBLIC_EMAIL_PROVIDER: 'kit' },
        { NODE_ENV: 'production', KIT_FORM_ID: 'not-a-number' },
        { NODE_ENV: 'production', KIT_FORM_ID: '' },
        { NODE_ENV: 'production', NEXT_PUBLIC_SIGNUP_TEST_MODE: 'true' },
      ]) {
        const p = getEmailProvider(env);
        expect(p.id, JSON.stringify(env)).toBe('off');
        expect(isSignupAvailable(p)).toBe(false);
      }
    });

    it('allows the mock only behind the explicit test flag, and never on Vercel production (Reviewer P3-1)', () => {
      expect(getEmailProvider({ NODE_ENV: 'production', NEXT_PUBLIC_SIGNUP_TEST_MODE: '1' }).id).toBe('mock');
      expect(getEmailProvider({ NODE_ENV: 'production', NEXT_PUBLIC_SIGNUP_TEST_MODE: '1', VERCEL_ENV: 'preview' }).id).toBe('mock');
      const prod = getEmailProvider({ NODE_ENV: 'production', NEXT_PUBLIC_SIGNUP_TEST_MODE: '1', VERCEL_ENV: 'production' });
      expect(prod.id).toBe('off');
      expect(isSignupAvailable(prod)).toBe(false);
      // A valid form ID still wins on Vercel production.
      expect(getEmailProvider({ NODE_ENV: 'production', NEXT_PUBLIC_SIGNUP_TEST_MODE: '1', VERCEL_ENV: 'production', KIT_FORM_ID: '9042473' }).id).toBe('kit');
    });
  });

  describe('dev / test', () => {
    it('uses the mock unless Kit is selected explicitly with a valid form ID', () => {
      expect(getEmailProvider({ NODE_ENV: 'development' }).id).toBe('mock');
      expect(getEmailProvider({ NODE_ENV: 'test', KIT_FORM_ID: '9042473' }).id).toBe('mock');
      expect(getEmailProvider({ NODE_ENV: 'development', NEXT_PUBLIC_EMAIL_PROVIDER: 'kit' }).id).toBe('mock');
      expect(getEmailProvider({ NODE_ENV: 'development', NEXT_PUBLIC_EMAIL_PROVIDER: 'kit', KIT_FORM_ID: '9042473' }).formAction).toBe(KIT);
    });
  });

  it('kitFormId accepts only positive integer IDs', () => {
    expect(kitFormId({ KIT_FORM_ID: '9042473' })).toBe('9042473');
    expect(kitFormId({ KIT_FORM_ID: ' 9042473 ' })).toBeNull(); // next.config.mjs trims before inlining
    expect(kitFormId({ NEXT_PUBLIC_KIT_FORM_ID: '1', KIT_FORM_ID: '2' })).toBe('1');
    for (const bad of ['0', '-1', '12a', 'https://evil.example/', '1 2']) expect(kitFormId({ KIT_FORM_ID: bad })).toBeNull();
  });

  describe('SignupForm', () => {
    it('renders nothing when signup is off', () => {
      const { container } = render(<SignupForm location="off" provider={getEmailProvider({ NODE_ENV: 'production' })} />);
      expect(container.innerHTML).toBe('');
    });

    it('posts to Kit on a production build with only KIT_FORM_ID', () => {
      const { container } = render(<SignupForm location="prod" provider={getEmailProvider({ NODE_ENV: 'production', KIT_FORM_ID: '9042473' })} />);
      expect(container.querySelector('form')?.getAttribute('action')).toBe(KIT);
    });
  });

  describe('build wiring', () => {
    it('next.config.mjs inlines only a numeric KIT_FORM_ID and the Vercel env name, and never reads KIT_API_KEY', async () => {
      const src = readFileSync(resolve(__dirname, '../next.config.mjs'), 'utf8');
      expect(src).not.toMatch(/KIT_API_KEY|KIT_SECRET/);
      const { publicBuildEnv } = await import('../next.config.mjs');
      expect(Object.keys(publicBuildEnv)).toEqual(['KIT_FORM_ID', 'VERCEL_ENV']);
      expect(publicBuildEnv.KIT_FORM_ID).toMatch(/^(|[1-9]\d*)$/);
      expect(publicBuildEnv.VERCEL_ENV).toMatch(/^(|production|preview|development)$/);
    });

    it('the homepage, review pages and exit popup hide their signup block when signup is off', () => {
      for (const f of ['app/page.tsx', 'app/reviews/[slug]/page.tsx', 'app/layout.tsx']) {
        expect(readFileSync(resolve(__dirname, '..', f), 'utf8'), f).toMatch(/isSignupAvailable\(\) &&/);
      }
    });
  });
});
