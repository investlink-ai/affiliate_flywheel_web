import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AffiliateLink, AffiliateLinkSimple, AffiliateCTAButton } from '@/components/AffiliateLink';

const { mockTrackAffiliateClick, mockTrackCtaConversion, mockTrackUrgencyConversion } = vi.hoisted(
  () => ({
    mockTrackAffiliateClick: vi.fn(),
    mockTrackCtaConversion: vi.fn(),
    mockTrackUrgencyConversion: vi.fn(),
  })
);

vi.mock('@/lib/analytics', () => ({
  trackAffiliateClick: (...args: unknown[]) => mockTrackAffiliateClick(...args),
}));

vi.mock('@/lib/hooks', () => ({
  useABTest: (config: { testId: string }) => {
    if (config.testId === 'affiliate-urgency-text') {
      return {
        value: 'none',
        variantId: 'none',
        isReady: true,
        trackConversion: mockTrackUrgencyConversion,
      };
    }
    return {
      value: 'default',
      variantId: 'control',
      isReady: true,
      trackConversion: mockTrackCtaConversion,
    };
  },
}));

describe('AffiliateLink', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders link with children', () => {
    render(
      <AffiliateLink href="https://example.com" showDisclosure={false}>
        Visit Example
      </AffiliateLink>
    );

    const link = screen.getByRole('link', { name: /visit example/i });
    expect(link).toBeInTheDocument();
  });

  it('adds affiliate ref to href', () => {
    render(
      <AffiliateLink href="https://example.com" showDisclosure={false}>
        Visit
      </AffiliateLink>
    );

    const link = screen.getByRole('link', { name: /visit/i });
    expect(link).toHaveAttribute('href', expect.stringContaining('ref='));
    expect(link).toHaveAttribute('href', expect.stringMatching(/ref=feynmanxu/));
  });

  it('opens in new tab with sponsored rel', () => {
    render(
      <AffiliateLink href="https://example.com" showDisclosure={false}>
        Visit
      </AffiliateLink>
    );

    const link = screen.getByRole('link', { name: /visit/i });
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', expect.stringContaining('sponsored'));
    expect(link).toHaveAttribute('rel', expect.stringContaining('noopener'));
  });

  it('calls trackAffiliateClick on click', async () => {
    const user = userEvent.setup();
    render(
      <AffiliateLink
        href="https://example.com"
        showDisclosure={false}
        toolName="Example Tool"
        toolSlug="example-tool"
      >
        Visit
      </AffiliateLink>
    );

    await user.click(screen.getByRole('link', { name: /visit/i }));

    expect(mockTrackAffiliateClick).toHaveBeenCalledTimes(1);
    expect(mockTrackAffiliateClick).toHaveBeenCalledWith(
      expect.objectContaining({
        toolName: 'Example Tool',
        toolSlug: 'example-tool',
        position: 'content',
      })
    );
  });

  it('uses position prop for analytics', async () => {
    const user = userEvent.setup();
    render(
      <AffiliateLink
        href="https://example.com"
        showDisclosure={false}
        toolName="Example"
        toolSlug="example"
        position="hero"
      >
        Visit
      </AffiliateLink>
    );

    await user.click(screen.getByRole('link', { name: /visit/i }));

    expect(mockTrackAffiliateClick).toHaveBeenCalledWith(
      expect.objectContaining({ position: 'hero' })
    );
  });
});

describe('AffiliateLinkSimple', () => {
  it('renders link without disclosure wrapper', () => {
    render(
      <AffiliateLinkSimple href="https://simple.com">
        Simple Link
      </AffiliateLinkSimple>
    );

    const link = screen.getByRole('link', { name: /simple link/i });
    expect(link).toHaveAttribute('href', expect.stringContaining('ref=feynmanxu'));
    expect(link).toHaveAttribute('target', '_blank');
  });

  it('adds ref to URL with existing query params', () => {
    render(
      <AffiliateLinkSimple href="https://example.com?campaign=test">
        Link
      </AffiliateLinkSimple>
    );

    const link = screen.getByRole('link', { name: /link/i });
    expect(link.getAttribute('href')).toMatch(/ref=feynmanxu/);
    expect(link.getAttribute('href')).toMatch(/campaign=test/);
  });
});

describe('AffiliateCTAButton', () => {
  it('renders CTA with external link icon', () => {
    render(
      <AffiliateCTAButton href="https://cta.com" showDisclosure={false}>
        Try Now
      </AffiliateCTAButton>
    );

    const link = screen.getByRole('link', { name: /try now/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', expect.stringContaining('ref='));
  });
});
