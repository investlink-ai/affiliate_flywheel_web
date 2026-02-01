import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { fireEvent } from '@testing-library/react';
import { SignupForm } from '@/components/SignupForm';

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
      render(<SignupForm location="test" />);

      const emailInput = screen.getByPlaceholderText(/enter your email/i);
      fireEvent.change(emailInput, { target: { value: 'notanemail' } });
      fireEvent.submit(screen.getByRole('button', { name: /subscribe free/i }).closest('form')!);

      expect(await screen.findByText(/please enter a valid email address/i)).toBeInTheDocument();
      expect(mockTrackNewsletterSignup).not.toHaveBeenCalled();
    });

    it('submits and tracks when email is valid', async () => {
      const user = userEvent.setup();
      vi.mocked(global.fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
        headers: new Headers(),
      } as Response);

      render(<SignupForm location="test-hero" />);

      await user.type(screen.getByPlaceholderText(/enter your email/i), 'user@example.com');
      await user.click(screen.getByRole('button', { name: /subscribe free/i }));

      await screen.findByRole('status');

      expect(global.fetch).toHaveBeenCalledWith(
        '/api/newsletter',
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: 'user@example.com',
            toolPreference: undefined,
            honeypot: '',
          }),
        })
      );
      expect(mockTrackNewsletterSignup).toHaveBeenCalledWith({ location: 'test-hero' });
      expect(screen.getByText(/welcome aboard/i)).toBeInTheDocument();
    });

    it('shows success message with custom text', async () => {
      const user = userEvent.setup();
      vi.mocked(global.fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
        headers: new Headers(),
      } as Response);

      render(
        <SignupForm
          location="test"
          successMessage="Custom success message"
        />
      );

      await user.type(screen.getByPlaceholderText(/enter your email/i), 'user@example.com');
      await user.click(screen.getByRole('button', { name: /subscribe free/i }));

      await screen.findByRole('status');
      expect(screen.getByText(/custom success message/i)).toBeInTheDocument();
    });

    it('shows tool preference select when showToolPreference is true', () => {
      render(
        <SignupForm
          location="test"
          showToolPreference
        />
      );

      expect(screen.getByLabelText(/what tools are you most interested in/i)).toBeInTheDocument();
      expect(screen.getByRole('combobox')).toHaveValue('all');
    });

    it('does not track when honeypot is filled (bot trap)', async () => {
      const user = userEvent.setup();
      render(<SignupForm location="test" />);

      const honeypot = document.getElementById('website-test');
      if (honeypot) {
        await user.type(honeypot as HTMLInputElement, 'http://spam.com');
      }
      await user.type(screen.getByPlaceholderText(/enter your email/i), 'user@example.com');
      await user.click(screen.getByRole('button', { name: /subscribe free/i }));

      expect(global.fetch).not.toHaveBeenCalled();
      expect(mockTrackNewsletterSignup).not.toHaveBeenCalled();
      expect(screen.getByText(/welcome aboard/i)).toBeInTheDocument();
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
