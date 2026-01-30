'use client';

import { useCallback } from 'react';
import { useABTest } from '@/lib/hooks';
import { trackAffiliateClick } from '@/lib/analytics';
import { DisclosureTooltip } from './Tooltip';

/** A/B test variants for CTA styling */
export type CTAVariant = 'default' | 'accent' | 'gradient' | 'urgency';

/** A/B test variants for urgency text */
export type UrgencyVariant = 'none' | 'limited' | 'popular' | 'ending';

interface AffiliateLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  /** Show disclosure tooltip on hover */
  showDisclosure?: boolean;
  /** Enable A/B testing for this link */
  enableABTest?: boolean;
  /** Override CTA variant (bypasses A/B test) */
  ctaVariant?: CTAVariant;
  /** Override urgency variant (bypasses A/B test) */
  urgencyVariant?: UrgencyVariant;
  /** Track click events */
  onClickTrack?: () => void;
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Tool name for analytics */
  toolName?: string;
  /** Tool slug for analytics */
  toolSlug?: string;
  /** Click position for analytics (e.g., 'hero', 'sidebar', 'content') */
  position?: string;
}

const AFFILIATE_REF = '?ref=feynmanxu';

function addAffiliateRef(url: string): string {
  try {
    const urlObj = new URL(url);
    urlObj.searchParams.set('ref', 'feynmanxu');
    return urlObj.toString();
  } catch {
    return url.includes('?') ? `${url}&ref=feynmanxu` : `${url}${AFFILIATE_REF}`;
  }
}

/** CTA style variants */
const ctaStyles: Record<CTAVariant, string> = {
  default: 'bg-primary-600 hover:bg-primary-700 focus:ring-primary-500',
  accent: 'bg-accent-500 hover:bg-accent-600 focus:ring-accent-500',
  gradient: 'bg-gradient-to-r from-primary-600 to-accent-500 hover:from-primary-700 hover:to-accent-600 focus:ring-primary-500',
  urgency: 'bg-red-600 hover:bg-red-700 focus:ring-red-500',
};

/** Urgency badge text */
const urgencyText: Record<UrgencyVariant, string | null> = {
  none: null,
  limited: 'Limited Offer',
  popular: 'Most Popular',
  ending: 'Ending Soon',
};

/** Size variants */
const sizeStyles: Record<'sm' | 'md' | 'lg', string> = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-sm',
  lg: 'px-8 py-4 text-base',
};

/**
 * Enhanced Affiliate Link with A/B testing support
 * 
 * Features:
 * - A/B testing for CTA colors and urgency badges
 * - Disclosure tooltip on hover
 * - Click tracking integration
 * - Multiple size variants
 */
export function AffiliateLink({
  href,
  children,
  className = '',
  showDisclosure = true,
  enableABTest = false,
  ctaVariant: ctaVariantProp,
  urgencyVariant: urgencyVariantProp,
  onClickTrack,
  size = 'md',
  toolName,
  toolSlug,
  position = 'content',
}: AffiliateLinkProps) {
  const affiliateUrl = addAffiliateRef(href);

  // A/B test for CTA styling
  const { value: abCtaVariant, variantId: ctaVariantId, trackConversion: trackCtaConversion } = useABTest({
    testId: 'affiliate-cta-style',
    variants: [
      { id: 'control', value: 'default' as CTAVariant, weight: 40 },
      { id: 'accent', value: 'accent' as CTAVariant, weight: 20 },
      { id: 'gradient', value: 'gradient' as CTAVariant, weight: 20 },
      { id: 'urgency', value: 'urgency' as CTAVariant, weight: 20 },
    ],
    persist: true,
  });

  // A/B test for urgency text
  const { value: abUrgencyVariant, variantId: urgencyVariantId, trackConversion: trackUrgencyConversion } = useABTest({
    testId: 'affiliate-urgency-text',
    variants: [
      { id: 'none', value: 'none' as UrgencyVariant, weight: 50 },
      { id: 'limited', value: 'limited' as UrgencyVariant, weight: 20 },
      { id: 'popular', value: 'popular' as UrgencyVariant, weight: 15 },
      { id: 'ending', value: 'ending' as UrgencyVariant, weight: 15 },
    ],
    persist: true,
  });

  // Use prop overrides or A/B test values
  const ctaVariant = ctaVariantProp ?? (enableABTest ? abCtaVariant : 'default');
  const urgencyVariant = urgencyVariantProp ?? (enableABTest ? abUrgencyVariant : 'none');
  const urgencyBadge = urgencyText[urgencyVariant];

  const handleClick = useCallback(() => {
    // Track A/B test conversions
    if (enableABTest) {
      trackCtaConversion('click');
      trackUrgencyConversion('click');
    }
    
    // Track affiliate click for EPC metrics
    trackAffiliateClick({
      toolName: toolName ?? 'Unknown',
      toolSlug: toolSlug ?? 'unknown',
      affiliateUrl,
      position,
      ctaVariant: ctaVariantId,
      urgencyVariant: urgencyVariantId,
    });
    
    onClickTrack?.();
  }, [enableABTest, trackCtaConversion, trackUrgencyConversion, onClickTrack, toolName, toolSlug, affiliateUrl, position, ctaVariantId, urgencyVariantId]);

  // Check if we're using button-style classes
  const isButton = className.includes('btn-') || 
    className.includes('bg-') || 
    className.includes('rounded');

  // Build final className
  const buttonClasses = isButton
    ? className
    : `inline-flex items-center justify-center gap-2 rounded-lg ${ctaStyles[ctaVariant]} ${sizeStyles[size]} font-semibold text-white shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-slate-900 ${className}`;

  const linkContent = (
    <a
      href={affiliateUrl}
      target="_blank"
      rel="noopener noreferrer sponsored"
      className={buttonClasses}
      onClick={handleClick}
    >
      {urgencyBadge && (
        <span className="mr-1 inline-flex items-center gap-1">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
          </span>
        </span>
      )}
      {urgencyBadge && (
        <span className="mr-1 text-xs font-bold uppercase tracking-wide opacity-90">
          {urgencyBadge} —
        </span>
      )}
      {children}
    </a>
  );

  if (showDisclosure) {
    return (
      <DisclosureTooltip>
        {linkContent}
      </DisclosureTooltip>
    );
  }

  return linkContent;
}

/**
 * Simple affiliate link without tooltip (for inline text use)
 */
export function AffiliateLinkSimple({
  href,
  children,
  className = '',
}: Pick<AffiliateLinkProps, 'href' | 'children' | 'className'>) {
  const affiliateUrl = addAffiliateRef(href);

  return (
    <a
      href={affiliateUrl}
      target="_blank"
      rel="noopener noreferrer sponsored"
      className={className}
    >
      {children}
    </a>
  );
}

/**
 * Affiliate CTA Button with built-in styling
 * Use this for prominent call-to-action buttons
 */
export function AffiliateCTAButton({
  href,
  children,
  variant = 'default',
  urgency = 'none',
  size = 'md',
  showDisclosure = true,
  enableABTest = false,
  className = '',
}: {
  href: string;
  children: React.ReactNode;
  variant?: CTAVariant;
  urgency?: UrgencyVariant;
  size?: 'sm' | 'md' | 'lg';
  showDisclosure?: boolean;
  enableABTest?: boolean;
  className?: string;
}) {
  return (
    <AffiliateLink
      href={href}
      ctaVariant={variant}
      urgencyVariant={urgency}
      size={size}
      showDisclosure={showDisclosure}
      enableABTest={enableABTest}
      className={className}
    >
      {children}
      <svg
        className="h-4 w-4"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2}
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
        />
      </svg>
    </AffiliateLink>
  );
}
