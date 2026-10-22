'use client';

import { useState, useCallback, useEffect } from 'react';
import { trackNewsletterSignup } from '@/lib/analytics';
import { getEmailProvider, type EmailProvider, type HiddenFields } from '@/lib/email/provider';

const defaultProvider = getEmailProvider();

interface SignupFormProps {
  /** Location identifier for analytics */
  location: string;
  /** Display variant */
  variant?: 'inline' | 'card' | 'banner';
  /** Custom headline */
  headline?: string;
  /** Custom description */
  description?: string;
  /** Custom CTA text */
  ctaText?: string;
  /** Email provider (defaults to the Kit hosted form when configured, else an offline mock) */
  provider?: EmailProvider;
  /** Additional class names */
  className?: string;
  /** Called when a submission is handed to the provider */
  onSuccess?: () => void;
}

type FormStatus = 'idle' | 'error' | 'success' | 'mock';

export const MOCK_SIGNUP_MESSAGE = "Email signup isn't connected on this build, so nothing was sent.";
export const UNAVAILABLE_SIGNUP_MESSAGE = "Signup isn't available right now, so nothing was sent. Please try again later.";

/**
 * Email signup form.
 *
 * The browser posts straight to the Kit hosted form (double opt-in), with a hidden
 * `referrer` field holding the full page URL so Kit can attribute UTM parameters.
 * The site never creates subscribers through an API route. Without public Kit
 * configuration the form is an offline mock that sends nothing.
 */
export function SignupForm({
  location,
  variant = 'card',
  headline = 'Get the Best AI Tool Recommendations',
  description = 'Weekly insights on AI investment tools and market analysis. Confirm by email to subscribe.',
  ctaText = 'Subscribe Free',
  provider = defaultProvider,
  className = '',
  onSuccess,
}: SignupFormProps) {
  const [email, setEmail] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [status, setStatus] = useState<FormStatus>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  // undefined until hydrated (submit stays disabled so no signup leaves without its tags);
  // null when the provider says this signup must not be sent.
  const [extraFields, setExtraFields] = useState<HiddenFields | null | undefined>(undefined);

  useEffect(() => {
    setExtraFields(provider.extraFields(window.location.href));
  }, [provider]);

  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      // Honeypot filled: likely a bot. Pretend success, send nothing.
      if (honeypot) {
        e.preventDefault();
        setStatus('success');
        return;
      }

      if (!email || !email.includes('@')) {
        e.preventDefault();
        setErrorMessage('Please enter a valid email address');
        setStatus('error');
        return;
      }

      if (provider.id === 'mock') {
        e.preventDefault();
        setStatus('mock');
        return;
      }

      if (!extraFields) {
        e.preventDefault();
        setErrorMessage(UNAVAILABLE_SIGNUP_MESSAGE);
        setStatus('error');
        return;
      }

      // Kit: let the browser submit the form to the hosted endpoint.
      setErrorMessage('');
      trackNewsletterSignup({ location });
      onSuccess?.();
    },
    [email, honeypot, provider, extraFields, location, onSuccess]
  );

  const hiddenFields = (extraFields ?? []).map(([name, value], i) => (
    <input key={`${name}-${i}`} type="hidden" name={name} value={value} />
  ));
  const submitDisabled = extraFields === undefined;

  const formProps = {
    method: 'post' as const,
    action: provider.formAction,
    onSubmit: handleSubmit,
    'data-provider': provider.id,
  };

  if (status === 'mock') {
    return (
      <div className={`rounded-xl bg-slate-100 p-6 text-center dark:bg-slate-800 ${className}`} role="status" aria-live="polite">
        <p className="text-sm text-slate-700 dark:text-slate-300">{MOCK_SIGNUP_MESSAGE}</p>
      </div>
    );
  }

  // Success state (honeypot only; real submissions navigate to Kit)
  if (status === 'success') {
    return (
      <div
        className={`rounded-xl bg-green-50 p-6 text-center dark:bg-green-900/20 ${className}`}
        role="status"
        aria-live="polite"
      >
        <h3 className="mt-4 text-lg font-semibold text-green-800 dark:text-green-300">Thanks!</h3>
        <p className="mt-2 text-sm text-green-700 dark:text-green-400">Check your email to confirm your subscription.</p>
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
      <form {...formProps} className={`relative flex flex-col gap-3 sm:flex-row ${className}`}>
        {honeypotField}
        {hiddenFields}
        <div className="flex-1">
          <label htmlFor={`email-${location}`} className="sr-only">
            Email address
          </label>
          <input
            type="email"
            id={`email-${location}`}
            name={provider.emailField}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
          />
        </div>
        <button
          type="submit"
          disabled={submitDisabled}
          className="btn-primary whitespace-nowrap disabled:cursor-not-allowed disabled:opacity-50"
        >
          {ctaText}
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
          <form {...formProps} className="relative flex w-full flex-col gap-3 sm:flex-row lg:w-auto">
            {honeypotField}
            {hiddenFields}
            <input
              type="email"
              name={provider.emailField}
              aria-label="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="w-full rounded-lg border-0 bg-white/10 px-4 py-3 text-white placeholder:text-white/60 backdrop-blur focus:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/50 sm:w-64"
            />
            <button
              type="submit"
              disabled={submitDisabled}
              className="whitespace-nowrap rounded-lg bg-white px-6 py-3 font-semibold text-primary-600 shadow-sm transition-all hover:bg-primary-50 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary-600 disabled:opacity-50"
            >
              {ctaText}
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

      <form {...formProps} className="relative mt-6 space-y-4">
        {honeypotField}
        {hiddenFields}
        <div>
          <label htmlFor={`email-card-${location}`} className="sr-only">
            Email address
          </label>
          <input
            type="email"
            id={`email-card-${location}`}
            name={provider.emailField}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:placeholder:text-slate-500"
          />
        </div>

        <button
          type="submit"
          disabled={submitDisabled}
          className="btn-primary w-full justify-center disabled:cursor-not-allowed disabled:opacity-50"
        >
          <>
            {ctaText}
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </>
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
