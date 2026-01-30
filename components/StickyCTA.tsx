'use client';

import { useState, useEffect, useCallback } from 'react';
import { AffiliateCTAButton, type CTAVariant, type UrgencyVariant } from './AffiliateLink';
import { DisclosureNote } from './DisclosureNote';

interface StickyCTAProps {
  /** Tool name for CTA text */
  toolName: string;
  /** Affiliate URL */
  href: string;
  /** Price display (optional) */
  price?: string;
  /** CTA variant override */
  ctaVariant?: CTAVariant;
  /** Urgency variant override */
  urgencyVariant?: UrgencyVariant;
  /** Enable A/B testing */
  enableABTest?: boolean;
  /** Scroll threshold to show sticky CTA (px) */
  scrollThreshold?: number;
  /** Hide on desktop */
  mobileOnly?: boolean;
}

/**
 * Sticky CTA bar for mobile devices
 * 
 * Features:
 * - Appears after scrolling past threshold
 * - Smooth slide-up animation
 * - Shows price if provided
 * - Includes disclosure
 * - Respects user's reduced motion preference
 */
export function StickyCTA({
  toolName,
  href,
  price,
  ctaVariant,
  urgencyVariant,
  enableABTest = true,
  scrollThreshold = 400,
  mobileOnly = true,
}: StickyCTAProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  const handleScroll = useCallback(() => {
    const currentScrollY = window.scrollY;
    
    // Show after threshold
    if (currentScrollY > scrollThreshold) {
      // Hide when scrolling down quickly, show when scrolling up
      if (currentScrollY > lastScrollY + 10) {
        setIsHidden(true);
      } else if (currentScrollY < lastScrollY - 5) {
        setIsHidden(false);
        setIsVisible(true);
      } else if (!isVisible) {
        setIsVisible(true);
      }
    } else {
      setIsVisible(false);
    }

    setLastScrollY(currentScrollY);
  }, [scrollThreshold, lastScrollY, isVisible]);

  useEffect(() => {
    // Throttled scroll handler
    let ticking = false;
    
    const scrollListener = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', scrollListener, { passive: true });
    return () => window.removeEventListener('scroll', scrollListener);
  }, [handleScroll]);

  // Don't render on server
  if (typeof window === 'undefined') return null;

  const mobileClass = mobileOnly ? 'lg:hidden' : '';
  const visibilityClass = isVisible && !isHidden
    ? 'translate-y-0 opacity-100'
    : 'translate-y-full opacity-0';

  return (
    <aside
      role="complementary"
      aria-label={`Quick action bar for ${toolName}`}
      className={`fixed bottom-0 left-0 right-0 z-50 transform transition-all duration-300 ease-out ${visibilityClass} ${mobileClass}`}
      style={{ 
        willChange: 'transform, opacity',
        // Respect reduced motion
        ...(typeof window !== 'undefined' && 
          window.matchMedia('(prefers-reduced-motion: reduce)').matches
            ? { transition: 'none' }
            : {})
      }}
    >
      {/* Gradient fade effect at top */}
      <div className="h-4 bg-gradient-to-t from-white to-transparent dark:from-slate-900" aria-hidden="true" />
      
      {/* Main sticky bar */}
      <div className="border-t border-slate-200 bg-white/95 backdrop-blur-sm dark:border-slate-700 dark:bg-slate-900/95">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3">
          {/* Left: Tool info */}
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">
              {toolName}
            </p>
            {price && (
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {price}
              </p>
            )}
          </div>

          {/* Right: CTA Button */}
          <div className="flex-shrink-0">
            <AffiliateCTAButton
              href={href}
              variant={ctaVariant}
              urgency={urgencyVariant}
              size="sm"
              enableABTest={enableABTest}
              showDisclosure={false}
            >
              Try Free
            </AffiliateCTAButton>
          </div>
        </div>

        {/* Disclosure */}
        <div className="border-t border-slate-100 bg-slate-50/80 px-4 py-1.5 dark:border-slate-800 dark:bg-slate-800/50">
          <DisclosureNote variant="inline" className="text-center" />
        </div>
      </div>

      {/* Safe area padding for iOS */}
      <div className="h-[env(safe-area-inset-bottom)] bg-white dark:bg-slate-900" aria-hidden="true" />
    </aside>
  );
}

/**
 * Desktop sidebar sticky CTA
 * Shows in the sidebar on larger screens
 */
export function SidebarStickyCTA({
  toolName,
  href,
  price,
  ctaVariant,
  urgencyVariant,
  enableABTest = true,
}: Omit<StickyCTAProps, 'scrollThreshold' | 'mobileOnly'>) {
  return (
    <aside className="hidden lg:block" aria-label={`Get started with ${toolName}`}>
      <div className="sticky top-24 rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <div className="text-center">
          <p className="text-lg font-semibold text-slate-900 dark:text-white">
            Ready to try {toolName}?
          </p>
          {price && (
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Starting at {price}
            </p>
          )}
        </div>

        <div className="mt-4">
          <AffiliateCTAButton
            href={href}
            variant={ctaVariant}
            urgency={urgencyVariant}
            size="lg"
            enableABTest={enableABTest}
            className="w-full justify-center"
          >
            Start Free Trial
          </AffiliateCTAButton>
        </div>

        <div className="mt-3">
          <DisclosureNote variant="inline" className="text-center" />
        </div>

        {/* Trust badges */}
        <div className="mt-4 flex items-center justify-center gap-4 text-xs text-slate-400">
          <span className="flex items-center gap-1">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
            </svg>
            Secure
          </span>
          <span className="flex items-center gap-1">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
            </svg>
            Cancel anytime
          </span>
        </div>
      </div>
    </aside>
  );
}
