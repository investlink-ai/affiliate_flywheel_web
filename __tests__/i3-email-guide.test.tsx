import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { renderToStaticMarkup } from 'react-dom/server';
import { getEmailProvider } from '@/lib/email/provider';
import { kitTagFields, SOURCE_TAGS, CAMPAIGN_TAGS } from '@/lib/attribution/source-tags.mjs';

const TEST_TAG_IDS = {
  sources: Object.fromEntries(SOURCE_TAGS.map((t, i) => [t, String(100 + i)])),
  campaigns: Object.fromEntries(CAMPAIGN_TAGS.map((t, i) => [t, String(200 + i)])),
};
import { SignupForm } from '@/components/SignupForm';
import { OptInForm } from '@/components/OptInForm';
import { Footer } from '@/components/Footer';
import { GuideTemplate, formatAud } from '@/components/guide/GuideTemplate';
import { guides } from '@/lib/guides/content';
import { assertValidGuide, validateGuide } from '@/lib/guides/validate';
import GuidePage, { metadata, generateStaticParams } from '@/app/guides/[slug]/page';
import { UmamiAnalytics } from '@/components/UmamiAnalytics';

afterEach(() => { cleanup(); vi.unstubAllEnvs(); vi.unstubAllGlobals(); });
const guide = guides[0]!;

describe('email providers and native opt-in', () => {
  it('defaults to a local mock without credentials', () => {
    expect(getEmailProvider({}).id).toBe('mock');
    expect(getEmailProvider({ NEXT_PUBLIC_KIT_FORM_ID: '12' }).id).toBe('mock');
    expect(getEmailProvider({}).extraFields('https://example.com')).toEqual([]);
  });
  it.each(['', '0', '-1', '1.5', 'x', ' 12', '12 ', '1e3', '01', '12/path'])('rejects invalid form ID %s', id => {
    expect(getEmailProvider({ NEXT_PUBLIC_EMAIL_PROVIDER: 'kit', NEXT_PUBLIC_KIT_FORM_ID: id }).id).toBe('mock');
  });
  it('renders the direct Kit form, the complete referrer URL and subscribe-time tags', () => {
    window.history.replaceState({}, '', '/guides/preview-ai-research-checklist?utm_source=x&utm_campaign=i3-preview');
    const provider = getEmailProvider({ NEXT_PUBLIC_EMAIL_PROVIDER: 'kit', NEXT_PUBLIC_KIT_FORM_ID: '123' },
      (url) => kitTagFields(url, TEST_TAG_IDS));
    const { container } = render(<OptInForm provider={provider} />);
    expect(container.querySelector('form')).toHaveAttribute('action', 'https://app.kit.com/forms/123/subscriptions');
    expect(container.querySelector('form')).toHaveAttribute('method', 'post');
    expect(container.querySelector('[name="referrer"]')).toHaveValue(window.location.href);
    expect([...container.querySelectorAll('input[name="tags[]"]')].map((i) => (i as HTMLInputElement).value))
      .toEqual([TEST_TAG_IDS.sources['src-x'], TEST_TAG_IDS.campaigns['cmp-i3-preview']]);
    expect(screen.getByRole('button')).toBeEnabled();
    expect(screen.getByLabelText('Email address')).toHaveAttribute('name', 'email_address');
    expect(container.querySelector('[name="website"]')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'privacy policy' })).toHaveAttribute('href', '/privacy');
    expect(screen.getByText(/You get the checklist after you confirm/)).toBeInTheDocument();
  });
  it('kit mode without committed tag IDs refuses to submit (no untagged signup)', () => {
    window.history.replaceState({}, '', '/guides/preview-ai-research-checklist?utm_source=x');
    const provider = getEmailProvider({ NEXT_PUBLIC_EMAIL_PROVIDER: 'kit', NEXT_PUBLIC_KIT_FORM_ID: '123' });
    const { container } = render(<OptInForm provider={provider} />);
    expect(container.querySelector('input[name="tags[]"]')).toBeNull();
    fireEvent.change(screen.getByLabelText('Email address'), { target: { value: 'reader@example.com' } });
    expect(fireEvent.submit(container.querySelector('form')!)).toBe(false); // default prevented: nothing posted
    expect(screen.getByRole('status')).toHaveTextContent(/isn't available/);
  });
  it('submit is disabled in server-rendered HTML until hidden fields are ready', () => {
    const provider = getEmailProvider({ NEXT_PUBLIC_EMAIL_PROVIDER: 'kit', NEXT_PUBLIC_KIT_FORM_ID: '123' },
      (url) => kitTagFields(url, TEST_TAG_IDS));
    expect(renderToStaticMarkup(<OptInForm provider={provider} />)).toMatch(/<button[^>]*disabled/);
  });
  it('mock submit only reports a confirmation and never fetches', () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
    const onMockSubmit = vi.fn();
    render(<OptInForm provider={getEmailProvider({})} onMockSubmit={onMockSubmit} />);
    fireEvent.change(screen.getByLabelText('Email address'), { target: { value: 'reader@example.com' } });
    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByRole('status')).toHaveTextContent('Mock: confirmation email would be sent to reader@example.com');
    expect(onMockSubmit).toHaveBeenCalledWith('reader@example.com');
    expect(fetchMock).not.toHaveBeenCalled();
  });
  it('uses native required/email validation and rejects honeypots', () => {
    const onMockSubmit = vi.fn();
    const { container } = render(<OptInForm provider={getEmailProvider({})} onMockSubmit={onMockSubmit} />);
    const email = screen.getByLabelText('Email address');
    expect(email).toBeRequired();
    expect(email).toHaveAttribute('type', 'email');
    fireEvent.click(screen.getByRole('button'));
    expect(email).toBeInvalid();
    fireEvent.change(email, { target: { value: 'invalid' } });
    fireEvent.click(screen.getByRole('button'));
    expect(email).toBeInvalid();
    expect(onMockSubmit).not.toHaveBeenCalled();
    fireEvent.change(email, { target: { value: 'reader@example.com' } });
    fireEvent.change(container.querySelector('[name="website"]')!, { target: { value: 'bot' } });
    fireEvent.click(screen.getByRole('button'));
    expect(onMockSubmit).not.toHaveBeenCalled();
  });
});

const FORM_IDS = Object.fromEntries(SOURCE_TAGS.map((name, i) => [name, String(300 + i)]));
const fallbackEnv = { NEXT_PUBLIC_EMAIL_PROVIDER: 'kit', NEXT_PUBLIC_KIT_ATTRIBUTION: 'form-per-source', NEXT_PUBLIC_KIT_FORM_ID: '999' };
const fallbackList = { ...TEST_TAG_IDS, sourceForms: FORM_IDS };

describe('form-per-source signup placements', () => {
  it.each([
    ['?utm_source=x', 'src-x'], ['?utm_source=youtube', 'src-youtube'],
    ['?utm_source=newsletter', 'src-newsletter'], ['', 'src-unattributed'],
    ['?utm_source=unknown', 'src-unattributed'],
  ])('resolves the source action and only campaign tags for %s', (query, source) => {
    window.history.replaceState({}, '', `/guides/preview-ai-research-checklist${query}${query ? '&' : '?'}utm_campaign=i3-preview`);
    const provider = getEmailProvider(fallbackEnv, undefined, fallbackList);
    const { container } = render(<OptInForm provider={provider} />);
    expect(container.querySelector('form')).toHaveAttribute('action', `https://app.kit.com/forms/${FORM_IDS[source]}/subscriptions`);
    expect(container.querySelector('[name="referrer"]')).toHaveValue(window.location.href);
    expect([...container.querySelectorAll('input[name="tags[]"]')].map(i => (i as HTMLInputElement).value))
      .toEqual([TEST_TAG_IDS.campaigns['cmp-i3-preview']]);
    expect(screen.getByRole('button')).toBeEnabled();
    expect(renderToStaticMarkup(<OptInForm provider={provider} />)).toMatch(/<button[^>]*disabled/);
  });
  it.each(['inline', 'card', 'banner'] as const)('supports shared %s signup placements', variant => {
    window.history.replaceState({}, '', '/?utm_source=youtube');
    const provider = getEmailProvider(fallbackEnv, undefined, fallbackList);
    const { container } = render(<SignupForm location="fallback" variant={variant} provider={provider} />);
    const form = container.querySelector('form')!;
    expect(form).toHaveAttribute('action', `https://app.kit.com/forms/${FORM_IDS['src-youtube']}/subscriptions`);
    expect(form.querySelector('[name="tags[]"]')).toBeNull();
    fireEvent.change(screen.getByPlaceholderText('Enter your email'), { target: { value: 'reader@example.com' } });
    expect(fireEvent.submit(form)).toBe(true);
    expect(renderToStaticMarkup(<SignupForm location="server" variant={variant} provider={provider} />)).toMatch(/<button[^>]*disabled/);
  });
  it.each(['missing form', 'invalid mode'])('refuses %s for both form components', problem => {
    const provider = getEmailProvider({ ...fallbackEnv, ...(problem === 'invalid mode' ? { NEXT_PUBLIC_KIT_ATTRIBUTION: 'bad' } : {}) });
    expect(provider.id).toBe('kit');
    expect(provider.extraFields(window.location.href)).toBeNull();
    for (const form of [<OptInForm key="guide" provider={provider} />, <SignupForm key="signup" location="blocked" provider={provider} />]) {
      const { container, unmount } = render(form);
      expect(screen.getByRole('button')).toBeDisabled();
      expect(fireEvent.submit(container.querySelector('form')!)).toBe(false);
      unmount();
    }
  });
  it('ignores the single-form ID and permits a missing best-effort campaign ID', () => {
    const provider = getEmailProvider({ ...fallbackEnv, NEXT_PUBLIC_KIT_FORM_ID: undefined }, undefined,
      { ...fallbackList, campaigns: { 'cmp-i3-preview': null } });
    const url = 'https://example.com/?utm_source=x&utm_campaign=i3-preview';
    expect(provider.actionForUrl?.(url)).toContain(`/forms/${FORM_IDS['src-x']}/`);
    expect(provider.extraFields(url)).toEqual([['referrer', url]]);
  });
});

describe('guide contract', () => {
  it.each(['title', 'slug', 'summary', 'lastTestedOn', 'pricesCheckedOn', 'prices', 'sources', 'howThisFails', 'demoDisclaimer', 'sections'])('reports missing %s', block => {
    const copy: Record<string, unknown> = { ...guide };
    delete copy[block];
    expect(validateGuide(copy)).toContain(block);
  });
  it.each([
    ['lastTestedOn', '2026-02-30'], ['pricesCheckedOn', 'yesterday'],
    ['prices', [{ item: 'bad', aud: -1, source: 'javascript:bad' }]],
    ['sources', []], ['howThisFails', ['']], ['sections', []], ['demoDisclaimer', 'true'], ['demoDisclaimer', false],
  ])('reports invalid %s', (block, value) => {
    expect(validateGuide({ ...guide, [block]: value })).toContain(block);
  });
  it('throws with every invalid block', () => {
    expect(() => assertValidGuide({})).toThrow(/title.*slug.*lastTestedOn.*sources.*sections/);
  });
  it('renders all required sections and AUD prices without commercial links', async () => {
    expect(validateGuide(guide)).toEqual([]);
    const { container } = render(await GuidePage({ params: Promise.resolve({ slug: guide.slug }) }));
    for (const block of ['last-tested', 'prices-checked', 'sources', 'how-this-fails', 'demo-disclaimer', 'opt-in']) {
      expect(container.querySelector(`[data-block="${block}"]`)).toBeInTheDocument();
    }
    expect(container).toHaveTextContent('A$12.00');
    expect(formatAud(0)).toBe('A$0.00');
    const html = renderToStaticMarkup(<GuideTemplate guide={guide} />);
    expect(html).not.toMatch(/\/go\/|#ad|checkout|[?&](?:ref|referral)=/i);
    expect(generateStaticParams()).toEqual([{ slug: guide.slug }]);
    expect(metadata.robots).toMatchObject({ index: false });
  });
  it('validates during both static generation and page rendering', async () => {
    const original = guide.summary;
    try {
      guide.summary = '';
      expect(() => generateStaticParams()).toThrow('summary');
      await expect(GuidePage({ params: Promise.resolve({ slug: guide.slug }) })).rejects.toThrow('summary');
    } finally { guide.summary = original; }
  });
  it('renders universal disclosures', () => {
    const { container } = render(<Footer />);
    for (const phrase of ['General information only', 'not personal financial advice', 'Consider your own', 'Not affiliated with xAI']) expect(container).toHaveTextContent(phrase);
  });
  it('only enables the Umami Cloud script with a website ID', () => {
    vi.stubEnv('NEXT_PUBLIC_UMAMI_WEBSITE_ID', '');
    expect(UmamiAnalytics()).toBeNull();
    vi.stubEnv('NEXT_PUBLIC_UMAMI_WEBSITE_ID', 'preview-id');
    expect(UmamiAnalytics()?.props).toMatchObject({ src: 'https://cloud.umami.is/script.js', 'data-website-id': 'preview-id' });
  });
});
