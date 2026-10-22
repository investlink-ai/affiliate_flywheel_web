import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { fireEvent } from '@testing-library/react';
import { SignupForm, MOCK_SIGNUP_MESSAGE } from '@/components/SignupForm';
import { getEmailProvider } from '@/lib/email/provider';
import { kitTagFields, SOURCE_TAGS } from '@/lib/attribution/source-tags.mjs';

const mockProvider = getEmailProvider({});
const TEST_TAG_IDS = { sources: Object.fromEntries(SOURCE_TAGS.map((t, i) => [t, String(100 + i)])), campaigns: {} };
const kitEnv = { NEXT_PUBLIC_EMAIL_PROVIDER: 'kit', NEXT_PUBLIC_KIT_FORM_ID: '123' };
const kitProvider = getEmailProvider(kitEnv, (url) => kitTagFields(url, TEST_TAG_IDS));
const kitProviderNoIds = getEmailProvider(kitEnv);

const mockTrackNewsletterSignup = vi.fn();

vi.mock('@/lib/analytics', () => ({
  trackNewsletterSignup: (...args: unknown[]) => mockTrackNewsletterSignup(...args),
}));

describe('SignupForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn();
  });

  describe('card variant (default)', () => {
    it('renders headline, description, and email input', () => {
      render(
        <SignupForm
          location="test-card"
          headline="Test Headline"
          description="Test description"
        />
      );

      expect(screen.getByRole('heading', { name: /test headline/i })).toBeInTheDocument();
      expect(screen.getByText(/test description/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/enter your email/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /subscribe free/i })).toBeInTheDocument();
    });

    it('shows error for invalid email', async () => {
      render(<SignupForm location="test" provider={kitProvider} />);

      const emailInput = screen.getByPlaceholderText(/enter your email/i);
      fireEvent.change(emailInput, { target: { value: 'notanemail' } });
      fireEvent.submit(screen.getByRole('button', { name: /subscribe free/i }).closest('form')!);

      expect(await screen.findByText(/please enter a valid email address/i)).toBeInTheDocument();
      expect(mockTrackNewsletterSignup).not.toHaveBeenCalled();
    });

    it('mock provider: valid email sends nothing and says so', async () => {
      const user = userEvent.setup();
      render(<SignupForm location="test-hero" provider={mockProvider} />);

      await user.type(screen.getByPlaceholderText(/enter your email/i), 'user@example.com');
      await user.click(screen.getByRole('button', { name: /subscribe free/i }));

      expect(await screen.findByRole('status')).toHaveTextContent(MOCK_SIGNUP_MESSAGE);
      expect(global.fetch).not.toHaveBeenCalled();
      expect(mockTrackNewsletterSignup).not.toHaveBeenCalled();
    });

    it('kit provider: posts natively to the hosted form with email_address and referrer, never /api/newsletter', () => {
      render(<SignupForm location="test-kit" provider={kitProvider} />);
      const form = screen.getByRole('button', { name: /subscribe free/i }).closest('form')!;

      expect(form.getAttribute('action')).toBe('https://app.kit.com/forms/123/subscriptions');
      expect(form.getAttribute('method')).toBe('post');
      expect(form.querySelector('input[name="email_address"]')).not.toBeNull();
      expect((form.querySelector('input[name="referrer"]') as HTMLInputElement).value).toBe(window.location.href);
      expect(form.outerHTML).not.toContain('/api/newsletter');
      // Exactly one src-* tag ID, set at subscribe time (no UTMs here -> src-unattributed).
      expect([...form.querySelectorAll('input[name="tags[]"]')].map((i) => (i as HTMLInputElement).value))
        .toEqual([TEST_TAG_IDS.sources['src-unattributed']]);

      fireEvent.change(screen.getByPlaceholderText(/enter your email/i), { target: { value: 'user@example.com' } });
      const submit = new Event('submit', { bubbles: true, cancelable: true });
      form.dispatchEvent(submit);
      expect(submit.defaultPrevented).toBe(false);
      expect(global.fetch).not.toHaveBeenCalled();
      expect(mockTrackNewsletterSignup).toHaveBeenCalledWith({ location: 'test-kit' });
    });

    it('kit provider without committed tag IDs blocks the submit instead of sending an untagged signup', () => {
      render(<SignupForm location="test-noids" provider={kitProviderNoIds} />);
      const form = screen.getByRole('button', { name: /subscribe free/i }).closest('form')!;
      fireEvent.change(screen.getByPlaceholderText(/enter your email/i), { target: { value: 'user@example.com' } });
      expect(fireEvent.submit(form)).toBe(false); // default prevented: nothing posted
      expect(screen.getByText(/isn't available right now/i)).toBeInTheDocument();
      expect(mockTrackNewsletterSignup).not.toHaveBeenCalled();
    });

    it('does not track or submit when honeypot is filled (bot trap)', async () => {
      const user = userEvent.setup();
      render(<SignupForm location="test" provider={kitProvider} />);

      const honeypot = document.getElementById('website-test');
      if (honeypot) {
        await user.type(honeypot as HTMLInputElement, 'http://spam.com');
      }
      await user.type(screen.getByPlaceholderText(/enter your email/i), 'user@example.com');
      await user.click(screen.getByRole('button', { name: /subscribe free/i }));

      expect(global.fetch).not.toHaveBeenCalled();
      expect(mockTrackNewsletterSignup).not.toHaveBeenCalled();
      expect(screen.getByText(/check your email to confirm/i)).toBeInTheDocument();
    });
  });

  describe('inline variant', () => {
    it('renders inline layout with email and submit', () => {
      render(
        <SignupForm
          location="test-inline"
          variant="inline"
          ctaText="Join"
        />
      );

      expect(screen.getByPlaceholderText(/enter your email/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /^join$/i })).toBeInTheDocument();
    });
  });

  describe('banner variant', () => {
    it('renders banner with headline and form', () => {
      render(
        <SignupForm
          location="test-banner"
          variant="banner"
          headline="Banner Headline"
        />
      );

      expect(screen.getByRole('heading', { name: /banner headline/i })).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/enter your email/i)).toBeInTheDocument();
    });
  });
});
