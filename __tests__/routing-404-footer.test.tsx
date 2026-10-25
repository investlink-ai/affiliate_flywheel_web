import { describe, expect, it, vi } from 'vitest';

// vitest.setup mocks next/navigation without notFound; use the real one here.
vi.mock('next/navigation', async (importOriginal) => ({ ...(await importOriginal<typeof import('next/navigation')>()) }));
import { render } from '@testing-library/react';
import { Footer } from '@/components/Footer';
import PrivacyPage from '@/app/privacy/page';
import * as categoryRoute from '@/app/[category]/page';
import * as reviewRoute from '@/app/reviews/[slug]/page';
import * as guideRoute from '@/app/guides/[slug]/page';
import { guides } from '@/lib/guides/content';
import { GUIDE_DEFAULT_CAMPAIGNS } from '@/lib/attribution/source-tags.mjs';

// next/navigation notFound() throws an error whose digest marks an HTTP 404.
const is404 = (e: unknown) => /NEXT_HTTP_ERROR_FALLBACK;404|NEXT_NOT_FOUND/.test(String((e as { digest?: string })?.digest ?? e));

describe('unknown URLs are real 404s (no soft 404)', () => {
  it.each([
    ['[category]', categoryRoute], ['reviews/[slug]', reviewRoute], ['guides/[slug]', guideRoute],
  ])('%s only serves its generateStaticParams (dynamicParams = false)', (_name, mod) => {
    expect((mod as { dynamicParams?: boolean }).dynamicParams).toBe(false);
  });
  it('an unknown category or review slug calls notFound()', async () => {
    await expect(categoryRoute.default({ params: Promise.resolve({ category: 'does-not-exist' }) })).rejects.toSatisfy(is404);
    await expect(reviewRoute.default({ params: Promise.resolve({ slug: 'does-not-exist' }) })).rejects.toSatisfy(is404);
  });
});

describe('guide slug', () => {
  it('builds /guides/check-ai-company-summary and no longer builds the old preview path', async () => {
    const params = guideRoute.generateStaticParams();
    expect(params).toEqual([{ slug: 'check-ai-company-summary' }]);
    expect(params).not.toContainEqual({ slug: 'preview-ai-research-checklist' });
    await expect(guideRoute.default({ params: Promise.resolve({ slug: 'preview-ai-research-checklist' }) })).rejects.toSatisfy(is404);
  });
  it('the attribution map only names guides that exist, with their own default campaign', () => {
    for (const [path, campaign] of Object.entries(GUIDE_DEFAULT_CAMPAIGNS)) {
      const guide = guides.find(g => `/guides/${g.slug}` === path);
      expect(guide, path).toBeDefined();
      expect(guide!.defaultCampaign).toBe(campaign);
    }
  });
});

describe('footer', () => {
  it('makes no "since 2024" claim', () => {
    const { container } = render(<Footer />);
    expect(container.textContent).not.toMatch(/since\s+20\d\d/i);
  });
  it('Disclosures and Terms links point at sections that exist on /privacy', () => {
    const { container } = render(<Footer />);
    const hrefs = [...container.querySelectorAll('a')].map(a => a.getAttribute('href'));
    expect(hrefs).toEqual(expect.arrayContaining(['/privacy#disclosure', '/privacy#terms']));
    const page = render(<PrivacyPage />).container;
    expect(page.querySelector('#disclosure h2')).toHaveTextContent('Disclosures');
    expect(page.querySelector('#terms h2')).toHaveTextContent('Terms of Service');
  });
});
