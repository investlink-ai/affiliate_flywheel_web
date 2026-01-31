'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

const CONSENT_CHOICE_KEY = 'ga_consent_choice';
const CONSENT_REGION_COOKIE = 'ga_consent_region';

function getConsentRegion(): string {
  if (typeof document === 'undefined') return 'EEA';
  const match = document.cookie.match(new RegExp(`${CONSENT_REGION_COOKIE}=([^;]+)`));
  return match?.[1]?.trim() ?? 'EEA';
}

function getConsentChoice(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    return window.localStorage.getItem(CONSENT_CHOICE_KEY);
  } catch {
    return null;
  }
}

/**
 * Cookie consent banner for GA4 Consent Mode (gtag.js).
 * Shown only in EEA (or when region unknown); persists choice in localStorage.
 * On Accept: grants analytics_storage; on Decline: keeps default denied.
 */
export function ConsentBanner() {
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const region = getConsentRegion();
    const choice = getConsentChoice();
    // Show only in EEA (or unknown) when user hasn't chosen yet
    if ((region === 'EEA' || region === '') && !choice) {
      setVisible(true);
    }
  }, [mounted]);

  const handleAccept = () => {
    try {
      window.localStorage.setItem(CONSENT_CHOICE_KEY, 'granted');
      if (typeof window.gtag === 'function') {
        window.gtag('consent', 'update', {
          analytics_storage: 'granted',
          ad_storage: 'granted',
        });
      }
    } catch {
      // ignore
    }
    setVisible(false);
  };

  const handleDecline = () => {
    try {
      window.localStorage.setItem(CONSENT_CHOICE_KEY, 'denied');
    } catch {
      // ignore
    }
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-slate-200 bg-slate-50 p-4 shadow-lg dark:border-slate-700 dark:bg-slate-900 sm:px-6"
    >
      <div className="mx-auto flex max-w-4xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-slate-600 dark:text-slate-400">
          We use cookies to measure traffic and improve your experience. You can accept or decline
          analytics cookies.{' '}
          <Link
            href="/privacy"
            className="underline hover:text-slate-800 dark:hover:text-slate-200"
          >
            Privacy policy
          </Link>
        </p>
        <div className="flex shrink-0 gap-3">
          <button
            type="button"
            onClick={handleDecline}
            className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            Decline
          </button>
          <button
            type="button"
            onClick={handleAccept}
            className="rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
