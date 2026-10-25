import { afterEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { renderToStaticMarkup } from 'react-dom/server';
import { getEmailProvider, KIT_SUBMIT_NOTICE } from '@/lib/email/provider';
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
import GuidePage, { generateMetadata, generateStaticParams } from '@/app/guides/[slug]/page';
import { richText } from '@/components/guide/RichText';
import { ExitIntentPopup } from '@/components/ExitIntentPopup';
import SubscribeNextSteps, { metadata as nextStepsMetadata } from '@/app/subscribe/next-steps/page';
import { UmamiAnalytics } from '@/components/UmamiAnalytics';

afterEach(() => { cleanup(); vi.unstubAllEnvs(); vi.unstubAllGlobals(); vi.useRealTimers(); localStorage.clear(); });
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
    window.history.replaceState({}, '', '/guides/check-ai-company-summary?utm_source=x&utm_campaign=i3-preview');
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
    // Honeypot is present but nameless, so it is never posted to Kit.
    expect(container.querySelector('input[id$="-website"]')).toBeInTheDocument();
    expect(container.querySelector('[name="website"]')).toBeNull();
    expect(screen.getByRole('link', { name: 'privacy policy' })).toHaveAttribute('href', '/privacy');
    expect(screen.getByText(KIT_SUBMIT_NOTICE)).toBeInTheDocument();
  });
  it('kit mode without committed tag IDs refuses to submit (no untagged signup)', () => {
    window.history.replaceState({}, '', '/guides/check-ai-company-summary?utm_source=x');
    const provider = getEmailProvider({ NEXT_PUBLIC_EMAIL_PROVIDER: 'kit', NEXT_PUBLIC_KIT_FORM_ID: '123' }, undefined, { sources: { 'src-x': null }, campaigns: {} });
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
    fireEvent.change(container.querySelector('input[id$="-website"]')!, { target: { value: 'bot' } });
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
    window.history.replaceState({}, '', `/guides/check-ai-company-summary${query}${query ? '&' : '?'}utm_campaign=i3-preview`);
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
  const BLOCKS = ['title', 'slug', 'summary', 'illustrationNote', 'lastTestedOn', 'whyAiGoesWrong', 'prompt', 'claimChecks', 'howToCheck', 'howThisFails', 'needsAHuman', 'optIn', 'toolsPrices', 'sources', 'demoDisclaimer'];
  it.each(BLOCKS)('reports missing %s', block => {
    const copy: Record<string, unknown> = { ...guide };
    delete copy[block];
    expect(validateGuide(copy)).toContain(block);
  });
  it.each([
    ['lastTestedOn', '2026-02-30'], ['lastTestedNote', ' '],
    ['toolsPrices', [{ ...guide.toolsPrices[0], checkedOn: 'yesterday' }]],
    ['toolsPrices', [{ name: 'bad', aud: -1, checkedOn: '2026-10-22' }]],
    ['sources', []], ['sources', [{ title: 'x', link: { label: 'x', url: 'javascript:bad' } }]],
    ['whyAiGoesWrong', { ...guide.whyAiGoesWrong, mistakes: [] }], ['needsAHuman', ['']], ['prompt', ''],
    ['claimChecks', guide.claimChecks.slice(1)], ['claimChecks', [...guide.claimChecks, guide.claimChecks[0]]],
    ['claimChecks', [{ ...guide.claimChecks[0], verdict: 'supported' }, ...guide.claimChecks.slice(1)]],
    ['claimChecks', [{ ...guide.claimChecks[0], where: [] }, ...guide.claimChecks.slice(1)]],
    ['howToCheck', []], ['howThisFails', { ...guide.howThisFails, findings: [] }], ['howThisFails', { ...guide.howThisFails, aiAnswer: [] }],
    ['defaultCampaign', 'cmp-unlisted'], ['optIn', { ...guide.optIn, heading: '' }], ['optIn', { ...guide.optIn, consent: '' }],
    ['demoDisclaimer', 'true'], ['demoDisclaimer', false], ['illustrationNote', ''],
  ])('reports invalid %s', (block, value) => {
    expect(validateGuide({ ...guide, [block]: value })).toContain(block);
  });
  it('throws with every invalid block', () => {
    for (const block of BLOCKS) expect(() => assertValidGuide({})).toThrow(block);
  });
  it('final CPO copy validates, carries no placeholder banner and uses cmp-anchor-1', async () => {
    expect(validateGuide(guide)).toEqual([]);
    expect(guide.placeholderNotice).toBeUndefined();
    expect(guide.defaultCampaign).toBe('cmp-anchor-1');
    const html = renderToStaticMarkup(<GuideTemplate guide={guide} />);
    expect(html).not.toContain('placeholder-notice');
    expect(html).not.toMatch(/\[Placeholder\]|Preview content|placeholders/);
    expect(html).not.toMatch(/\/go\/|#ad\b|checkout|[?&](?:ref|referral|aff)=/i);
    const meta = await generateMetadata({ params: Promise.resolve({ slug: guide.slug }) });
    expect(meta.title).toBe(guide.title);
    expect(meta.robots).toMatchObject({ index: false });
    expect(generateStaticParams()).toEqual([{ slug: guide.slug }]);
  });
  it('renders every R7 block', async () => {
    const { container } = render(await GuidePage({ params: Promise.resolve({ slug: guide.slug }) }));
    for (const block of ['demo-disclaimer', 'why-ai-goes-wrong', 'prompt', 'claim-checks', 'how-this-fails', 'needs-a-human', 'opt-in', 'sources', 'last-tested', 'tools-prices']) {
      expect(container.querySelector(`[data-block="${block}"]`)).toBeInTheDocument();
    }
    expect(container.querySelector('[data-block="demo-disclaimer"]')).toHaveTextContent('Illustration only:');
  });
  it('renders the 5-claim check as a table with verdicts and exact page links', () => {
    const { container } = render(<GuideTemplate guide={guide} />);
    const table = container.querySelector('[data-block="claim-checks"] table')!;
    expect([...table.querySelectorAll('thead th')].map(th => th.textContent)).toEqual(['Claim (verbatim)', 'Verdict', 'Where to look', 'What the release says']);
    const rows = table.querySelectorAll('tbody tr');
    expect(rows).toHaveLength(5);
    rows.forEach((row, i) => {
      const cells = row.querySelectorAll('td');
      expect(cells[0]).toHaveTextContent(guide.claimChecks[i]!.claim);
      expect(cells[1]).toHaveTextContent(guide.claimChecks[i]!.verdict);
      expect([...cells[2]!.querySelectorAll('a')].map(a => a.getAttribute('href'))).toEqual(guide.claimChecks[i]!.where.map(w => w.url));
    });
    expect(rows[3]!.querySelectorAll('a')).toHaveLength(2); // pages 1-2
    expect(rows[0]!.querySelector('a')).toHaveAttribute('href', expect.stringMatching(/\.pdf#page=1$/));
    expect(container.querySelectorAll('[data-block="claim-checks"] ol li')).toHaveLength(3);
  });
  it('shows both prompts verbatim in pre/code and the AI answer verbatim', () => {
    const { container } = render(<GuideTemplate guide={guide} />);
    expect(container.querySelector('[data-verbatim="prompt"] code')?.textContent).toBe(guide.prompt);
    expect(container.querySelector('[data-verbatim="failure-prompt"] code')?.textContent).toBe(guide.howThisFails.prompt);
    expect([...container.querySelectorAll('[data-verbatim="ai-answer"] li')].map(li => li.textContent)).toEqual(guide.howThisFails.aiAnswer);
    const findings = container.querySelectorAll('[data-block="how-this-fails"] tbody tr');
    expect(findings).toHaveLength(2);
    expect(findings[1]!.querySelector('a')).toHaveAttribute('href', expect.stringMatching(/#page=25$/));
  });
  it('renders inline page links and bold in prose, and nothing else as markup', () => {
    const { container } = render(<GuideTemplate guide={guide} />);
    const notes = container.querySelector('[data-block="claim-checks"]')!;
    expect([...notes.querySelectorAll('p a')].map(a => a.textContent)).toEqual(['page 3', 'page 2']);
    expect([...notes.querySelectorAll('p strong')].map(b => b.textContent)).toEqual(['Supported', 'Unsupported', 'Not found']);
    expect(renderToStaticMarkup(<>{richText('a [x](javascript:alert(1)) <b>y</b> **z**')}</>)).toBe('a [x](javascript:alert(1)) &lt;b&gt;y&lt;/b&gt; <strong>z</strong>');
  });
  it('shows the opt-in heading, CPO copy and the last-tested note next to the date', () => {
    const { container } = render(<GuideTemplate guide={guide} />);
    const optIn = container.querySelector('[data-block="opt-in"]')!;
    expect(optIn.querySelector('h2')).toHaveTextContent('Get the 1-page AI answer check');
    expect(optIn).toHaveTextContent(guide.optIn.consent);
    const tested = container.querySelector('[data-block="last-tested"]')!;
    expect(tested.querySelector('time')).toHaveAttribute('dateTime', '2026-10-22');
    expect(tested).toHaveTextContent('Last tested on 22 October 2026.');
    expect(tested.querySelector('[data-block="last-tested-note"]')).toHaveTextContent(guide.lastTestedNote!);
    const { lastTestedNote: _n, ...noNote } = guide;
    expect(renderToStaticMarkup(<GuideTemplate guide={noNote} />)).not.toContain('last-tested-note');
  });
  it('formats AUD prices and keeps tools without a link', () => {
    expect(formatAud(0)).toBe('A$0');
    expect(formatAud(12.5)).toBe('A$12.50');
    const { container } = render(<GuideTemplate guide={guide} />);
    const tools = container.querySelectorAll('[data-block="tools-prices"] li');
    expect(tools).toHaveLength(3);
    expect(tools[0]).toHaveTextContent('A$0');
    expect(tools[2]!.querySelector('a')).toBeNull();
    expect(tools[2]).toHaveAttribute('data-checked-on', '2026-10-22');
  });
  it('still shows a placeholder banner when a guide sets one', () => {
    const html = renderToStaticMarkup(<GuideTemplate guide={{ ...guide, placeholderNotice: 'PLACEHOLDER COPY' }} />);
    expect(html).toContain('data-block="placeholder-notice"');
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

describe('guide default campaign at the form boundary', () => {
  for (const mode of ['hidden-tags', 'form-per-source']) {
    it.each([
      ['x', '', 'cmp-anchor-1'], ['youtube', '', 'cmp-anchor-1'], ['newsletter', '', 'cmp-anchor-1'],
      ['x', 'anchor-1', 'cmp-anchor-1'], ['x', 'i3-preview', 'cmp-i3-preview'], ['x', 'unlisted', 'cmp-anchor-1'],
    ])(`${mode}: %s / %s resolves one campaign %s`, (source, campaign, expected) => {
      window.history.replaceState({}, '', `/guides/${guide.slug}?utm_source=${source}&utm_campaign=${campaign}`);
      const provider = getEmailProvider({ ...fallbackEnv, NEXT_PUBLIC_KIT_ATTRIBUTION: mode }, undefined, fallbackList);
      const { container } = render(<OptInForm provider={provider} defaultCampaign={guide.defaultCampaign} />);
      const ids = [...container.querySelectorAll('input[name="tags[]"]')].map(i => (i as HTMLInputElement).value);
      expect(ids).toEqual([...(mode === 'hidden-tags' ? [TEST_TAG_IDS.sources[`src-${source}`]] : []), TEST_TAG_IDS.campaigns[expected]]);
      expect(provider.extraFields(window.location.href)?.filter(([name]) => name === 'tags[]'))
        .toHaveLength(campaign === 'anchor-1' || campaign === 'i3-preview' ? (mode === 'hidden-tags' ? 2 : 1) : (mode === 'hidden-tags' ? 1 : 0));
    });
  }
});

describe('Kit security-check handoff never claims success', () => {
  for (const mode of ['hidden-tags', 'form-per-source']) {
    it.each(['guide', 'inline', 'card', 'banner', 'popup'] as const)(`${mode}: %s leaves navigation to the browser`, placement => {
      window.history.replaceState({}, '', '/?utm_source=x');
      const fetchMock = vi.fn();
      const xhrMock = vi.fn();
      vi.stubGlobal('fetch', fetchMock);
      vi.stubGlobal('XMLHttpRequest', xhrMock);
      const provider = getEmailProvider({ ...fallbackEnv, NEXT_PUBLIC_KIT_ATTRIBUTION: mode }, undefined, fallbackList);
      const onSubmitStarted = vi.fn();
      if (placement === 'popup') vi.useFakeTimers();
      const { container } = render(placement === 'guide'
        ? <OptInForm provider={provider} />
        : placement === 'popup' ? <ExitIntentPopup provider={provider} delay={0} />
          : <SignupForm location="redirect-test" variant={placement} provider={provider} onSubmitStarted={onSubmitStarted} />);
      if (placement === 'popup') {
        act(() => vi.advanceTimersByTime(1));
        // Flush the enabling effect before dispatching the exit event.
      }
      if (placement === 'popup') fireEvent.mouseLeave(document, { clientY: 0 });
      const form = container.querySelector('form')!;
      expect(form).not.toBeNull();
      expect(form).toHaveAttribute('method', 'post');
      expect(form.getAttribute('action')).toMatch(/^https:\/\/app\.kit\.com\/forms\/\d+\/subscriptions$/);
      expect(form.getAttribute('target')).toBeNull();
      expect(screen.getByText(KIT_SUBMIT_NOTICE)).toBeInTheDocument();
      fireEvent.change(form.querySelector('input[type="email"]')!, { target: { value: 'reader@example.com' } });
      expect(fireEvent.submit(form)).toBe(true);
      expect(fetchMock).not.toHaveBeenCalled();
      expect(xhrMock).not.toHaveBeenCalled();
      expect(container.textContent).not.toMatch(/Thanks!|Thanks for subscribing|You're subscribed|Success|Check your email to confirm/i);
      if (!['guide', 'popup'].includes(placement)) {
        expect(onSubmitStarted.mock.calls).toEqual([[]]);
      }
      if (placement === 'popup') {
        expect(localStorage.getItem('exit-popup-dismissed')).not.toBeNull();
        expect(form).toBeInTheDocument(); // retain native form through browser handoff
      }
    });
  }
  it('renders noindex next steps with conditional instructions and no success claim', () => {
    const { container } = render(<SubscribeNextSteps />);
    expect(nextStepsMetadata.robots).toMatchObject({ index: false });
    expect(container).toHaveTextContent("If Kit showed you a security check, finish it. Then check your inbox for a confirmation email from InvestLink and click the link. You're not subscribed until you do. Unconfirmed sign-ups don't get the checklist.");
    expect(container.textContent).not.toMatch(/You're subscribed|Thanks for subscribing|Success/i);
  });
});
