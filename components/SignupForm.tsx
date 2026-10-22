'use client';

import { useState, useCallback } from 'react';
import { trackNewsletterSignup } from '@/lib/analytics';

interface SignupFormProps {
  /** Location identifier for analytics */
  location: string;
  /** Display variant */
  variant?: 'inline' | 'card' | 'banner';
  /** Custom headline */
  headline?: string;
  /** Custom description */
  description?: string;
  /** Show tool recommendations checkbox */
  showToolPreference?: boolean;
  /** Custom CTA text */
  ctaText?: string;
  /** Custom success message */
  successMessage?: string;
  /** Form action URL (optional; defaults to /api/newsletter which uses Kit) */
  formAction?: string;
  /** Additional class names */
  className?: string;
  /** Callback on successful submission */
  onSuccess?: () => void;
}

type FormStatus = 'idle' | 'loading' | 'success' | 'error';

/**
 * Email signup form component
 * Posts to /api/newsletter (Kit/ConvertKit) or custom formAction
 */
export function SignupForm({
  location,
  variant = 'card',
  headline = 'Get the Best AI Tool Recommendations',
  description = 'Join 5,000+ investors and traders receiving weekly insights on the best AI investment tools and market analysis.',
  showToolPreference = false,
  ctaText = 'Subscribe Free',
  successMessage = "You're in! Check your email to confirm your subscription.",
  formAction,
  className = '',
  onSuccess,
}: SignupFormProps) {
  const [email, setEmail] = useState('');
  const [toolPreference, setToolPreference] = useState<string>('all');
  const [honeypot, setHoneypot] = useState('');
  const [status, setStatus] = useState<FormStatus>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      
      // Honeypot check - if filled, silently reject (bots fill hidden fields)
      if (honeypot) {
        // Fake success to not alert bots
        setStatus('success');
        return;
      }
      
      if (!email || !email.includes('@')) {
        setErrorMessage('Please enter a valid email address');
        setStatus('error');
        return;
      }

      setStatus('loading');
      setErrorMessage('');

      try {
        // If custom form action is provided (e.g., Mailchimp), use that
        if (formAction) {
          const formData = new FormData();
          formData.append('EMAIL', email);
          if (showToolPreference) {
            formData.append('TOOL_PREFERENCE', toolPreference);
          }
          formData.append('SOURCE', location);

          await fetch(formAction, {
            method: 'POST',
            body: formData,
            mode: 'no-cors', // For Mailchimp - no-cors means we can't read the response
          });
        } else {
          // Use our API endpoint (rate limited to 5 requests/IP/hour)
          const response = await fetch('/api/newsletter', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email,
              toolPreference: showToolPreference ? toolPreference : undefined,
              honeypot,
            }),
          });

          const data = await response.json();

          // Handle rate limiting
          if (response.status === 429) {
            const retryAfter = response.headers.get('Retry-After');
            const minutes = retryAfter ? Math.ceil(parseInt(retryAfter, 10) / 60) : 60;
            throw new Error(`Too many requests. Please try again in ${minutes} minutes.`);
          }

          if (!response.ok || !data.success) {
            throw new Error(data.error || 'Failed to subscribe');
          }
        }

        // Track signup
        trackNewsletterSignup({ location });

        setStatus('success');
        setEmail('');
        
        // Call success callback if provided
        onSuccess?.();
      } catch (error) {
        console.error('Signup error:', error);
        setErrorMessage(
          error instanceof Error ? error.message : 'Something went wrong. Please try again.'
        );
        setStatus('error');
      }
    },
    [email, honeypot, toolPreference, formAction, location, showToolPreference, onSuccess]
  );

  // Success state
  if (status === 'success') {
    return (
      <div 
        className={`rounded-xl bg-green-50 p-6 text-center dark:bg-green-900/20 ${className}`}
        role="status"
        aria-live="polite"
      >
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
          <svg
            className="h-6 w-6 text-green-600 dark:text-green-400"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div>
        <h3 className="mt-4 text-lg font-semibold text-green-800 dark:text-green-300">
          Welcome aboard!
        </h3>
        <p className="mt-2 text-sm text-green-700 dark:text-green-400">{successMessage}</p>
      </div>
    );
  }

  // Honeypot field component (hidden from users, visible to bots)
  const honeypotField = (
    <div className="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden="true">
      <label htmlFor={`website-${location}`}>
        Website (leave empty)
      </label>
      <input
        type="text"
        id={`website-${location}`}
        name="website"
        value={honeypot}
        onChange={(e) => setHoneypot(e.target.value)}
        tabIndex={-1}
        autoComplete="off"
      />
    </div>
  );

  // Inline variant
  if (variant === 'inline') {
    return (
      <form onSubmit={handleSubmit} className={`relative flex flex-col gap-3 sm:flex-row ${className}`}>
        {honeypotField}
        <div className="flex-1">
          <label htmlFor={`email-${location}`} className="sr-only">
            Email address
          </label>
          <input
            type="email"
            id={`email-${location}`}
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
          />
        </div>
        <button
          type="submit"
          disabled={status === 'loading'}
          className="btn-primary whitespace-nowrap disabled:cursor-not-allowed disabled:opacity-50"
        >
          {status === 'loading' ? (
            <>
              <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              <span>Subscribing...</span>
              <span className="sr-only">Please wait while we process your subscription</span>
            </>
          ) : (
            ctaText
          )}
        </button>
        {status === 'error' && (
          <p className="text-sm text-red-600 dark:text-red-400">{errorMessage}</p>
        )}
      </form>
    );
  }

  // Banner variant
  if (variant === 'banner') {
    return (
      <div className={`rounded-xl bg-gradient-to-r from-primary-600 to-accent-500 p-6 sm:p-8 ${className}`}>
        <div className="flex flex-col items-center gap-6 lg:flex-row lg:justify-between">
          <div className="text-center lg:text-left">
            <h3 className="text-xl font-bold text-white sm:text-2xl">{headline}</h3>
            <p className="mt-2 text-primary-100">{description}</p>
          </div>
          <form onSubmit={handleSubmit} className="relative flex w-full flex-col gap-3 sm:flex-row lg:w-auto">
            {honeypotField}
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="w-full rounded-lg border-0 bg-white/10 px-4 py-3 text-white placeholder:text-white/60 backdrop-blur focus:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/50 sm:w-64"
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              className="whitespace-nowrap rounded-lg bg-white px-6 py-3 font-semibold text-primary-600 shadow-sm transition-all hover:bg-primary-50 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary-600 disabled:opacity-50"
            >
              {status === 'loading' ? 'Subscribing...' : ctaText}
            </button>
          </form>
        </div>
        {status === 'error' && (
          <p className="mt-3 text-center text-sm text-red-200 lg:text-left">{errorMessage}</p>
        )}
      </div>
    );
  }

  // Card variant (default)
  return (
    <div className={`rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800 sm:p-8 ${className}`}>
      <div className="text-center">
        {/* Icon */}
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900/30" aria-hidden="true">
          <svg
            className="h-6 w-6 text-primary-600 dark:text-primary-400"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
            />
          </svg>
        </div>

        <h3 className="mt-4 text-lg font-semibold text-slate-900 dark:text-white sm:text-xl">
          {headline}
        </h3>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{description}</p>
      </div>

      <form onSubmit={handleSubmit} className="relative mt-6 space-y-4">
        {honeypotField}
        <div>
          <label htmlFor={`email-card-${location}`} className="sr-only">
            Email address
          </label>
          <input
            type="email"
            id={`email-card-${location}`}
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:placeholder:text-slate-500"
          />
        </div>

        {showToolPreference && (
          <div>
            <label
              htmlFor={`preference-${location}`}
              className="block text-sm font-medium text-slate-700 dark:text-slate-300"
            >
              What tools are you most interested in?
            </label>
            <select
              id={`preference-${location}`}
              value={toolPreference}
              onChange={(e) => setToolPreference(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-slate-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
            >
              <option value="all">All Investment Tools</option>
              <option value="signals">AI Investment Signals</option>
              <option value="quant">Quantitative Platforms</option>
              <option value="fintech">Fintech Infrastructure</option>
              <option value="crypto">Crypto Tools</option>
              <option value="portfolio">Portfolio Management</option>
            </select>
          </div>
        )}

        <button
          type="submit"
          disabled={status === 'loading'}
          className="btn-primary w-full justify-center disabled:cursor-not-allowed disabled:opacity-50"
        >
          {status === 'loading' ? (
            <>
              <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              <span>Subscribing...</span>
              <span className="sr-only">Please wait while we process your subscription</span>
            </>
          ) : (
            <>
              {ctaText}
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </>
          )}
        </button>

        {status === 'error' && (
          <p className="text-center text-sm text-red-600 dark:text-red-400">{errorMessage}</p>
        )}
      </form>

      {/* Trust signals */}
      <div className="mt-4 flex items-center justify-center gap-4 text-xs text-slate-500 dark:text-slate-400">
        <span className="flex items-center gap-1">
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
          </svg>
          No spam
        </span>
        <span className="flex items-center gap-1">
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
          Unsubscribe anytime
        </span>
      </div>
    </div>
  );
}
