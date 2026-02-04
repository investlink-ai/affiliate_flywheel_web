'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { SignupForm } from './SignupForm';

interface ExitIntentPopupProps {
  /** Delay before enabling exit detection (ms) */
  delay?: number;
  /** LocalStorage key for dismissal state */
  storageKey?: string;
  /** Days until popup can show again after dismissal */
  dismissDays?: number;
  /** Custom headline */
  headline?: string;
  /** Custom subheadline */
  subheadline?: string;
}

/**
 * Exit-intent popup with newsletter signup
 * Triggers when mouse leaves toward top of viewport (browser chrome)
 * Stores dismissal in localStorage to prevent repeat showing
 */
export function ExitIntentPopup({
  delay = 5000,
  storageKey = 'exit-popup-dismissed',
  dismissDays = 7,
  headline = "Wait! Don't miss out on AI insights",
  subheadline = 'Get weekly reviews of the best AI investment tools delivered to your inbox. Join 5,000+ investors and traders.',
}: ExitIntentPopupProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);
  const hasTriggered = useRef(false);

  // Check if popup was previously dismissed
  const isDismissed = useCallback((): boolean => {
    if (typeof window === 'undefined') return true;
    
    const dismissedAt = localStorage.getItem(storageKey);
    if (!dismissedAt) return false;
    
    const dismissedDate = new Date(parseInt(dismissedAt, 10));
    const now = new Date();
    const daysSinceDismissed = (now.getTime() - dismissedDate.getTime()) / (1000 * 60 * 60 * 24);
    
    return daysSinceDismissed < dismissDays;
  }, [storageKey, dismissDays]);

  // Store dismissal timestamp
  const setDismissed = useCallback(() => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(storageKey, Date.now().toString());
  }, [storageKey]);

  // Close popup and mark as dismissed
  const handleClose = useCallback(() => {
    setIsVisible(false);
    setDismissed();
  }, [setDismissed]);

  // Handle successful signup
  const handleSuccess = useCallback(() => {
    // Keep popup visible briefly to show success message
    setTimeout(() => {
      setIsVisible(false);
      setDismissed();
    }, 2000);
  }, [setDismissed]);

  // Enable popup after delay
  useEffect(() => {
    if (isDismissed()) return;

    const timer = setTimeout(() => {
      setIsEnabled(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay, isDismissed]);

  // Mouse leave detection
  useEffect(() => {
    if (!isEnabled || hasTriggered.current) return;

    const handleMouseLeave = (e: MouseEvent) => {
      // Only trigger when mouse leaves toward top of page (exit intent)
      if (e.clientY <= 0 && !hasTriggered.current) {
        hasTriggered.current = true;
        setIsVisible(true);
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isEnabled]);

  // Handle escape key
  useEffect(() => {
    if (!isVisible) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    // Prevent body scroll when popup is open
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isVisible, handleClose]);

  if (!isVisible) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="exit-popup-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Popup */}
      <div className="relative w-full max-w-lg animate-popup rounded-2xl bg-white p-6 shadow-2xl dark:bg-slate-800 sm:p-8">
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute right-4 top-4 z-10 rounded-full p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:hover:bg-slate-700 dark:hover:text-slate-300"
          aria-label="Close popup"
        >
          <svg
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Hidden title for accessibility */}
        <h2 id="exit-popup-title" className="sr-only">{headline}</h2>

        {/* Signup Form - Card variant with full presentation */}
        <div>
          <SignupForm
            location="exit-intent-popup"
            variant="card"
            headline={headline}
            description={subheadline}
            showToolPreference={true}
            ctaText="Get Free AI Insights"
            onSuccess={handleSuccess}
            className="border-0 p-0 shadow-none"
          />
        </div>

        {/* No thanks link */}
        <button
          onClick={handleClose}
          className="mt-4 w-full text-center text-sm text-slate-500 underline-offset-2 hover:text-slate-700 hover:underline dark:text-slate-400 dark:hover:text-slate-300"
        >
          No thanks, I&apos;ll pass on free AI insights
        </button>
      </div>

      {/* Animation styles */}
      <style jsx>{`
        @keyframes popup {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(-10px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        .animate-popup {
          animation: popup 0.2s ease-out;
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-popup {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}
