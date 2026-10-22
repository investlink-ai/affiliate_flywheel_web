import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { OutboundLink, OutboundLinkSimple, OutboundCTAButton } from '@/components/OutboundLink';
import { trackOutboundClick } from '@/lib/analytics';

vi.mock('@/lib/analytics', () => ({ trackOutboundClick: vi.fn() }));

beforeEach(() => vi.clearAllMocks());

describe.each([
  ['OutboundLink', OutboundLink],
  ['OutboundLinkSimple', OutboundLinkSimple],
  ['OutboundCTAButton', OutboundCTAButton],
] as const)('%s', (_name, Component) => {
  it.each([
    'https://example.com',
    'https://example.com?search=hello%20world&sort=asc#results',
  ])('preserves href verbatim: %s', (href) => {
    render(<Component href={href}>Visit Example website</Component>);
    const link = screen.getByRole('link', { name: 'Visit Example website' });
    expect(link).toHaveAttribute('href', href);
    expect(link).toHaveAttribute('target', '_blank');
    const rel = link.getAttribute('rel')!.split(' ');
    expect(rel).toEqual(expect.arrayContaining(['noopener', 'noreferrer', 'nofollow']));
    expect(rel).not.toContain('sponsored');
    expect(link).toHaveTextContent(/^Visit Example website$/);
    expect(screen.queryByText(/limited offer|most popular|ending soon/i)).not.toBeInTheDocument();
  });
});

it('tracks the original URL, tool, and position and invokes the click callback', async () => {
  const onClickTrack = vi.fn();
  render(
    <OutboundLink href="https://example.com?search=hello%20world" toolName="Example" toolSlug="example" position="hero" onClickTrack={onClickTrack}>
      Visit Example website
    </OutboundLink>
  );
  await userEvent.click(screen.getByRole('link'));
  expect(trackOutboundClick).toHaveBeenCalledWith({
    toolName: 'Example', toolSlug: 'example', websiteUrl: 'https://example.com?search=hello%20world', position: 'hero',
  });
  expect(onClickTrack).toHaveBeenCalledOnce();
});
