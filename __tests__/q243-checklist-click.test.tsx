import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { getEmailProvider } from '@/lib/email/provider';
import { trackChecklistClick } from '@/lib/analytics';
import { OptInForm } from '@/components/OptInForm';

const originalGtag = window.gtag;
afterEach(() => { cleanup(); window.gtag = originalGtag; });

describe('Q-243 checklist_click GA4 event', () => {
  it('sends checklist_click with location and page path, and no email', () => {
    window.gtag = vi.fn();
    trackChecklistClick({ location: 'guide-opt-in', pagePath: '/guides/check-ai-company-summary' });
    expect(window.gtag).toHaveBeenCalledTimes(1);
    expect(window.gtag).toHaveBeenCalledWith('event', 'checklist_click', {
      event_category: 'Engagement',
      event_label: 'guide-opt-in',
      checklist_location: 'guide-opt-in',
      page_path: '/guides/check-ai-company-summary',
    });
  });

  it('is a no-op without gtag (blocked script, dev build)', () => {
    (window as unknown as { gtag: unknown }).gtag = undefined;
    expect(() => trackChecklistClick({ location: 'guide-opt-in', pagePath: '/x' })).not.toThrow();
  });

  it('fires once when the guide opt-in button is clicked', () => {
    window.history.replaceState({}, '', '/guides/check-ai-company-summary?utm_campaign=anchor1');
    window.gtag = vi.fn();
    render(<OptInForm location="guide-opt-in" provider={getEmailProvider({})} />);
    fireEvent.click(screen.getByRole('button', { name: 'Email me the checklist' }));
    const calls = vi.mocked(window.gtag).mock.calls.filter(c => c[1] === 'checklist_click');
    expect(calls).toHaveLength(1);
    expect(calls[0]![2]).toMatchObject({ checklist_location: 'guide-opt-in', page_path: '/guides/check-ai-company-summary' });
    expect(JSON.stringify(calls[0])).not.toContain('@');
  });

  it('button click still works when gtag is missing', () => {
    (window as unknown as { gtag: unknown }).gtag = undefined;
    const onMockSubmit = vi.fn();
    render(<OptInForm location="guide-opt-in" provider={getEmailProvider({})} onMockSubmit={onMockSubmit} />);
    fireEvent.change(screen.getByLabelText('Email address'), { target: { value: 'reader@example.com' } });
    fireEvent.click(screen.getByRole('button', { name: 'Email me the checklist' }));
    expect(onMockSubmit).toHaveBeenCalledWith('reader@example.com');
  });
});

describe('Q-272/Q-273 checklist_click fires only on real, human clicks', () => {
  const clicks = () => vi.mocked(window.gtag).mock.calls.filter(c => c[1] === 'checklist_click');

  it('sends nothing on render or re-render', () => {
    window.gtag = vi.fn();
    const provider = getEmailProvider({});
    const { rerender } = render(<OptInForm location="guide-opt-in" provider={provider} />);
    rerender(<OptInForm location="guide-opt-in" provider={provider} defaultCampaign="anchor1" />);
    rerender(<OptInForm location="guide-opt-in" provider={provider} defaultCampaign="anchor1" />);
    expect(clicks()).toHaveLength(0);
  });

  it('sends nothing when the button is disabled (signup fields unavailable)', () => {
    window.history.replaceState({}, '', '/guides/check-ai-company-summary?utm_source=x');
    window.gtag = vi.fn();
    const provider = getEmailProvider({ NEXT_PUBLIC_EMAIL_PROVIDER: 'kit', NEXT_PUBLIC_KIT_FORM_ID: '123' }, undefined, { sources: { 'src-x': null }, campaigns: {} });
    render(<OptInForm location="guide-opt-in" provider={provider} />);
    const button = screen.getByRole('button', { name: 'Email me the checklist' });
    expect(button).toBeDisabled();
    fireEvent.click(button);
    expect(clicks()).toHaveLength(0);
  });

  it('uses the location the caller passes', () => {
    window.gtag = vi.fn();
    render(<OptInForm location="review-footer" provider={getEmailProvider({})} />);
    fireEvent.click(screen.getByRole('button', { name: 'Email me the checklist' }));
    expect(clicks()).toHaveLength(1);
    expect(clicks()[0]![2]).toMatchObject({ checklist_location: 'review-footer', event_label: 'review-footer' });
  });

  it('sends nothing when the honeypot is filled', () => {
    window.gtag = vi.fn();
    const { container } = render(<OptInForm location="guide-opt-in" provider={getEmailProvider({})} />);
    fireEvent.change(container.querySelector('input[id$="-website"]')!, { target: { value: 'bot' } });
    fireEvent.click(screen.getByRole('button', { name: 'Email me the checklist' }));
    expect(clicks()).toHaveLength(0);
  });
});
