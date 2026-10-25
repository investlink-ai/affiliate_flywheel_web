import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { getEmailProvider, kitReferrer } from '@/lib/email/provider';
import { kitTagFields, SOURCE_TAGS, CAMPAIGN_TAGS } from '@/lib/attribution/source-tags.mjs';
import { SignupForm } from '@/components/SignupForm';
import { UmamiAnalytics } from '@/components/UmamiAnalytics';
import PrivacyPage from '@/app/privacy/page';

vi.mock('@/lib/analytics', () => ({ trackSignupSubmitted: vi.fn() }));

afterEach(() => { cleanup(); vi.unstubAllEnvs(); window.history.replaceState({}, '', '/'); });

const TEST_TAG_IDS = {
  sources: Object.fromEntries(SOURCE_TAGS.map((t, i) => [t, String(100 + i)])),
  campaigns: Object.fromEntries(CAMPAIGN_TAGS.map((t, i) => [t, String(200 + i)])),
};
const kitEnv = { NEXT_PUBLIC_EMAIL_PROVIDER: 'kit', NEXT_PUBLIC_KIT_FORM_ID: '123' };

describe('#25 r1 P3-1: referrer sent to Kit is origin + path + utm_* only', () => {
  it.each([
    ['https://investlink.ai/guides/check-ai-company-summary?utm_source=x&q=private&utm_campaign=anchor-1&ref=abc#section',
      'https://investlink.ai/guides/check-ai-company-summary?utm_source=x&utm_campaign=anchor-1'],
    ['https://investlink.ai/?email=reader%40example.com#top', 'https://investlink.ai/'],
    ['https://investlink.ai/reviews/a?UTM_Medium=social', 'https://investlink.ai/reviews/a?UTM_Medium=social'],
    ['not a url', ''],
    ['javascript:alert(1)', ''],
  ])('%s -> %s', (input, expected) => {
    expect(kitReferrer(input)).toBe(expected);
  });

  it('hidden-tags: drops other query params and the fragment but keeps the tags from the full URL', () => {
    const provider = getEmailProvider(kitEnv, (url) => kitTagFields(url, TEST_TAG_IDS));
    const url = 'https://investlink.ai/guides/check-ai-company-summary?utm_source=x&utm_campaign=i3-preview&q=1#f';
    expect(provider.extraFields(url)).toEqual([
      ['referrer', 'https://investlink.ai/guides/check-ai-company-summary?utm_source=x&utm_campaign=i3-preview'],
      ['tags[]', TEST_TAG_IDS.sources['src-x']], ['tags[]', TEST_TAG_IDS.campaigns['cmp-i3-preview']],
    ]);
  });

  it('form-per-source: sanitises the referrer the same way', () => {
    const list = { ...TEST_TAG_IDS, sourceForms: Object.fromEntries(SOURCE_TAGS.map((t, i) => [t, String(300 + i)])) };
    const provider = getEmailProvider({ ...kitEnv, NEXT_PUBLIC_KIT_ATTRIBUTION: 'form-per-source' }, undefined, list);
    expect(provider.extraFields('https://investlink.ai/?utm_source=x&token=abc#x')?.[0])
      .toEqual(['referrer', 'https://investlink.ai/?utm_source=x']);
  });

  it('the rendered SignupForm posts the sanitised referrer', () => {
    window.history.replaceState({}, '', '/guides/check-ai-company-summary?utm_source=x&other=1#frag');
    const provider = getEmailProvider(kitEnv, (url) => kitTagFields(url, TEST_TAG_IDS));
    const { container } = render(<SignupForm location="r2" provider={provider} />);
    expect(container.querySelector('[name="referrer"]'))
      .toHaveValue(`${window.location.origin}/guides/check-ai-company-summary?utm_source=x`);
  });
});

describe('#25 r1 P3-2: Umami does not record query strings', () => {
  it('sets the documented data-exclude-search and data-exclude-hash options', () => {
    vi.stubEnv('NEXT_PUBLIC_UMAMI_WEBSITE_ID', 'preview-id');
    expect(UmamiAnalytics()?.props).toMatchObject({
      src: 'https://cloud.umami.is/script.js', 'data-website-id': 'preview-id',
      'data-exclude-search': 'true', 'data-exclude-hash': 'true',
    });
  });
});

describe('#25 r1 P3-3: site-wide SignupForm links to the privacy policy', () => {
  it.each(['inline', 'card', 'banner'] as const)('%s variant, kit and mock providers', (variant) => {
    for (const provider of [getEmailProvider(kitEnv, (url) => kitTagFields(url, TEST_TAG_IDS)), getEmailProvider({})]) {
      const { unmount } = render(<SignupForm location={`p-${variant}`} variant={variant} provider={provider} />);
      expect(screen.getByRole('link', { name: /privacy policy/i })).toHaveAttribute('href', '/privacy#email-and-analytics');
      unmount();
    }
  });
});

describe('#25 r1 P2-1: privacy notice for email signup', () => {
  it('is accurate about Kit storage and lists what is sent, the purpose and how to leave', () => {
    const { container } = render(<PrivacyPage />);
    const text = container.querySelector('#email-and-analytics')!.textContent!.replace(/\s+/g, ' ');
    // Kit keeps unconfirmed subscribers: no claim that it stores the email only after confirming.
    expect(text).not.toMatch(/stores your email after you confirm/i);
    expect(text).toMatch(/stores your email address straight away, before you confirm/);
    expect(text).toMatch(/unconfirmed address/);
    // What is sent with the email.
    expect(text).toMatch(/page address \(path\)/);
    expect(text).toMatch(/utm_ campaign parameters/);
    expect(text).toMatch(/source and campaign tags/);
    expect(text).toMatch(/for attribution only/);
    // Purpose, unsubscribe and deletion.
    expect(text).toMatch(/ongoing emails/);
    expect(text).toMatch(/unsubscribe link/);
    expect(text).toMatch(/delete your email and tags from Kit/);
    expect(text).toMatch(/not to record query strings/);
  });
});
