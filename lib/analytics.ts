/**
 * Google Analytics 4 Tracking Utilities
 * 
 * This module provides comprehensive analytics tracking for affiliate marketing,
 * focused on measuring affiliate click events and EPC (Earnings Per Click) metrics.
 * 
 * @module lib/analytics
 * @see {@link https://developers.google.com/analytics/devguides/collection/ga4} GA4 Documentation
 * 
 * @example
 * ```typescript
 * import { trackAffiliateClick, trackNewsletterSignup } from '@/lib/analytics';
 * 
 * // Track an affiliate click
 * trackAffiliateClick({
 *   toolName: 'Jasper AI',
 *   toolSlug: 'jasper-ai',
 *   affiliateUrl: 'https://jasper.ai?ref=example',
 *   position: 'hero',
 * });
 * 
 * // Track newsletter signup
 * trackNewsletterSignup({ location: 'homepage' });
 * ```
 */

/**
 * Google Analytics 4 Measurement ID
 * 
 * Set this via the `NEXT_PUBLIC_GA_MEASUREMENT_ID` environment variable.
 * Falls back to a placeholder ID if not configured.
 * 
 * @constant
 * @type {string}
 * @default 'G-XXXXXXXXXX'
 */
export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? 'G-XXXXXXXXXX';

/**
 * Checks if Google Analytics is available and properly initialized
 * 
 * This function verifies that:
 * 1. We're running in a browser environment (not SSR)
 * 2. The gtag function has been loaded by the GA4 script
 * 
 * @returns {boolean} True if GA4 is available and ready to track events, false otherwise
 * 
 * @example
 * ```typescript
 * if (isGAAvailable()) {
 *   // Safe to call tracking functions
 *   trackPageView('/reviews');
 * }
 * ```
 */
export const isGAAvailable = (): boolean => {
  return typeof window !== 'undefined' && typeof window.gtag === 'function';
};

/**
 * Tracks a page view in Google Analytics 4
 * 
 * This is typically called automatically by the GoogleAnalytics component
 * on route changes, but can be called manually for custom tracking needs.
 * 
 * @param {string} url - The URL path of the page (e.g., '/reviews/jasper-ai')
 * @param {string} [title] - Optional page title for the view
 * @returns {void}
 * 
 * @example
 * ```typescript
 * // Track a page view
 * trackPageView('/reviews/jasper-ai', 'Jasper AI Review 2026');
 * 
 * // Track without title
 * trackPageView('/comparisons');
 * ```
 */
export function trackPageView(url: string, title?: string): void {
  if (!isGAAvailable()) return;

  window.gtag('config', GA_MEASUREMENT_ID, {
    page_path: url,
    page_title: title,
  });
}

/**
 * Tracks a custom event in Google Analytics 4
 * 
 * This is a generic event tracking function that can be used for any
 * custom tracking needs not covered by the specialized functions.
 * 
 * @param {string} action - The event action name (e.g., 'click', 'download', 'share')
 * @param {string} category - The event category for grouping (e.g., 'Engagement', 'Navigation')
 * @param {string} [label] - Optional label for additional context
 * @param {number} [value] - Optional numeric value associated with the event
 * @param {Record<string, unknown>} [additionalParams] - Optional additional parameters to send
 * @returns {void}
 * 
 * @example
 * ```typescript
 * // Track a button click
 * trackEvent('click', 'CTA', 'Hero Button');
 * 
 * // Track with value and additional params
 * trackEvent('purchase', 'Conversion', 'Premium Plan', 99, {
 *   currency: 'USD',
 *   item_id: 'premium_annual',
 * });
 * ```
 */
export function trackEvent(
  action: string,
  category: string,
  label?: string,
  value?: number,
  additionalParams?: Record<string, unknown>
): void {
  if (!isGAAvailable()) return;

  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value,
    ...additionalParams,
  });
}

/**
 * Parameters for tracking affiliate link clicks
 */
interface AffiliateClickParams {
  /** Display name of the tool (e.g., 'Jasper AI') */
  toolName: string;
  /** URL-friendly slug of the tool (e.g., 'jasper-ai') */
  toolSlug: string;
  /** The full affiliate URL being clicked */
  affiliateUrl: string;
  /** Position on page where click occurred (e.g., 'hero', 'sidebar', 'content', 'sticky-cta', 'tool-card') */
  position: string;
  /** Optional A/B test variant for CTA styling */
  ctaVariant?: string;
  /** Optional A/B test variant for urgency messaging */
  urgencyVariant?: string;
}

/**
 * Tracks affiliate link clicks for EPC (Earnings Per Click) analysis
 * 
 * This is the most critical tracking function for affiliate revenue optimization.
 * It captures detailed information about each affiliate click including:
 * - Which tool was clicked
 * - Where on the page the click occurred
 * - Which A/B test variants were active
 * 
 * The data is used to calculate EPC and optimize conversion rates.
 * 
 * @param {AffiliateClickParams} params - The affiliate click parameters
 * @param {string} params.toolName - Display name of the tool
 * @param {string} params.toolSlug - URL-friendly slug of the tool
 * @param {string} params.affiliateUrl - The full affiliate URL being clicked
 * @param {string} params.position - Position on page (e.g., 'hero', 'sidebar', 'content', 'sticky-cta')
 * @param {string} [params.ctaVariant] - A/B test variant for CTA styling
 * @param {string} [params.urgencyVariant] - A/B test variant for urgency messaging
 * @returns {void}
 * 
 * @example
 * ```typescript
 * trackAffiliateClick({
 *   toolName: 'Jasper AI',
 *   toolSlug: 'jasper-ai',
 *   affiliateUrl: 'https://jasper.ai?ref=aitoolreviews',
 *   position: 'hero',
 *   ctaVariant: 'gradient',
 *   urgencyVariant: 'limited-offer',
 * });
 * ```
 */
export function trackAffiliateClick(params: AffiliateClickParams): void {
  if (!isGAAvailable()) return;

  const { toolName, toolSlug, affiliateUrl, position, ctaVariant, urgencyVariant } = params;

  // GA4 event for affiliate click
  window.gtag('event', 'affiliate_click', {
    event_category: 'Affiliate',
    event_label: toolName,
    tool_name: toolName,
    tool_slug: toolSlug,
    affiliate_url: affiliateUrl,
    click_position: position,
    cta_variant: ctaVariant ?? 'default',
    urgency_variant: urgencyVariant ?? 'none',
    timestamp: new Date().toISOString(),
  });

  // Also track as outbound link for compatibility
  window.gtag('event', 'click', {
    event_category: 'outbound',
    event_label: affiliateUrl,
    transport_type: 'beacon',
  });

  // Log in development
  if (process.env.NODE_ENV === 'development') {
    console.log('[Analytics] Affiliate click:', params);
  }
}

/**
 * Parameters for tracking newsletter signups
 */
interface NewsletterSignupParams {
  /** Location where signup occurred (e.g., 'homepage', 'review-footer', 'exit-intent-popup') */
  location: string;
  /** Optional email for validation only - not sent to GA */
  email?: string;
}

/**
 * Tracks newsletter signup conversions
 * 
 * Tracks when a user signs up for the newsletter, including where
 * on the site the signup occurred. This is marked as a conversion
 * event for lead generation tracking.
 * 
 * Note: The email parameter is for validation purposes only and
 * is NOT sent to Google Analytics for privacy compliance.
 * 
 * @param {NewsletterSignupParams} params - The signup parameters
 * @param {string} params.location - Where the signup occurred (e.g., 'homepage', 'review-footer', 'popup')
 * @param {string} [params.email] - Email for validation only (not sent to GA)
 * @returns {void}
 * 
 * @example
 * ```typescript
 * trackNewsletterSignup({
 *   location: 'exit-intent-popup',
 * });
 * ```
 */
export function trackNewsletterSignup(params: NewsletterSignupParams): void {
  if (!isGAAvailable()) return;

  window.gtag('event', 'newsletter_signup', {
    event_category: 'Engagement',
    event_label: params.location,
    signup_location: params.location,
  });

  // Track as conversion
  window.gtag('event', 'conversion', {
    send_to: `${GA_MEASUREMENT_ID}/newsletter`,
    event_category: 'Lead',
    event_label: 'Newsletter Signup',
  });
}

/**
 * Parameters for tracking A/B test variant assignments
 */
interface ABTestAssignmentParams {
  /** Unique identifier for the test (e.g., 'cta-color-test') */
  testId: string;
  /** Identifier for the assigned variant (e.g., 'variant-a') */
  variantId: string;
  /** Human-readable value of the variant (e.g., 'blue-button') */
  variantValue: string;
}

/**
 * Tracks A/B test variant assignments
 * 
 * Called when a user is assigned to an A/B test variant.
 * This data is used to correlate variant exposure with conversions.
 * 
 * @param {ABTestAssignmentParams} params - The A/B test assignment parameters
 * @param {string} params.testId - Unique identifier for the test
 * @param {string} params.variantId - Identifier for the assigned variant
 * @param {string} params.variantValue - Human-readable value of the variant
 * @returns {void}
 * 
 * @example
 * ```typescript
 * trackABTestAssignment({
 *   testId: 'hero-cta-color',
 *   variantId: 'variant-b',
 *   variantValue: 'gradient',
 * });
 * ```
 */
export function trackABTestAssignment(params: ABTestAssignmentParams): void {
  if (!isGAAvailable()) return;

  window.gtag('event', 'ab_test_assignment', {
    event_category: 'Experiment',
    event_label: params.testId,
    test_id: params.testId,
    variant_id: params.variantId,
    variant_value: params.variantValue,
  });
}

/**
 * Parameters for tracking A/B test conversions
 */
interface ABTestConversionParams {
  /** Unique identifier for the test */
  testId: string;
  /** Identifier for the variant that converted */
  variantId: string;
  /** Type of conversion (e.g., 'affiliate_click', 'newsletter_signup') */
  conversionType: string;
}

/**
 * Tracks A/B test conversions
 * 
 * Called when a user in an A/B test completes a conversion action.
 * Links the conversion back to the test variant for analysis.
 * 
 * @param {ABTestConversionParams} params - The A/B test conversion parameters
 * @param {string} params.testId - Unique identifier for the test
 * @param {string} params.variantId - Identifier for the variant that converted
 * @param {string} params.conversionType - Type of conversion (e.g., 'affiliate_click', 'newsletter_signup')
 * @returns {void}
 * 
 * @example
 * ```typescript
 * trackABTestConversion({
 *   testId: 'hero-cta-color',
 *   variantId: 'variant-b',
 *   conversionType: 'affiliate_click',
 * });
 * ```
 */
export function trackABTestConversion(params: ABTestConversionParams): void {
  if (!isGAAvailable()) return;

  window.gtag('event', 'ab_test_conversion', {
    event_category: 'Experiment',
    event_label: `${params.testId}_${params.conversionType}`,
    test_id: params.testId,
    variant_id: params.variantId,
    conversion_type: params.conversionType,
  });
}

/**
 * Tracks when a user views the comparison page
 * 
 * Records which tools are being compared to understand
 * user comparison behavior and popular tool matchups.
 * 
 * @param {string[]} tools - Array of tool names being compared
 * @returns {void}
 * 
 * @example
 * ```typescript
 * trackComparisonView(['Jasper AI', 'Copy.ai', 'Claude']);
 * ```
 */
export function trackComparisonView(tools: string[]): void {
  if (!isGAAvailable()) return;

  window.gtag('event', 'comparison_view', {
    event_category: 'Engagement',
    event_label: tools.join(' vs '),
    tools_compared: tools,
    tool_count: tools.length,
  });
}

/**
 * Parameters for tracking review page engagement
 */
interface ReviewEngagementParams {
  /** URL slug of the tool being reviewed */
  toolSlug: string;
  /** Percentage of page scrolled (0-100) */
  scrollDepth: number;
  /** Time spent on page in seconds */
  timeOnPage: number;
}

/**
 * Tracks user engagement on review pages
 * 
 * Measures how users interact with review content by tracking
 * scroll depth and time on page. High engagement correlates
 * with higher conversion rates.
 * 
 * @param {ReviewEngagementParams} params - The engagement parameters
 * @param {string} params.toolSlug - URL slug of the tool being reviewed
 * @param {number} params.scrollDepth - Percentage of page scrolled (0-100)
 * @param {number} params.timeOnPage - Time spent on page in seconds
 * @returns {void}
 * 
 * @example
 * ```typescript
 * trackReviewEngagement({
 *   toolSlug: 'jasper-ai',
 *   scrollDepth: 75,
 *   timeOnPage: 180,
 * });
 * ```
 */
export function trackReviewEngagement(params: ReviewEngagementParams): void {
  if (!isGAAvailable()) return;

  window.gtag('event', 'review_engagement', {
    event_category: 'Engagement',
    event_label: params.toolSlug,
    scroll_depth: params.scrollDepth,
    time_on_page: params.timeOnPage,
  });
}

/**
 * Parameters for tracking EPC (Earnings Per Click) data
 */
interface EPCDataParams {
  /** URL slug of the tool */
  toolSlug: string;
  /** Total number of clicks */
  clicks: number;
  /** Total number of conversions */
  conversions: number;
  /** Total revenue in USD */
  revenue: number;
}

/**
 * Tracks EPC (Earnings Per Click) metrics
 * 
 * This function is used for aggregated reporting of affiliate performance.
 * EPC is calculated as: revenue / clicks
 * 
 * Typically called from an admin dashboard or reporting system,
 * not from user-facing pages.
 * 
 * @param {EPCDataParams} params - The EPC data parameters
 * @param {string} params.toolSlug - URL slug of the tool
 * @param {number} params.clicks - Total number of clicks
 * @param {number} params.conversions - Total number of conversions
 * @param {number} params.revenue - Total revenue in USD
 * @returns {void}
 * 
 * @example
 * ```typescript
 * // Track monthly EPC for a tool
 * trackEPCData({
 *   toolSlug: 'jasper-ai',
 *   clicks: 1500,
 *   conversions: 45,
 *   revenue: 2250.00,
 * });
 * // EPC = $2250 / 1500 = $1.50 per click
 * ```
 */
export function trackEPCData(params: EPCDataParams): void {
  if (!isGAAvailable()) return;

  const epc = params.clicks > 0 ? params.revenue / params.clicks : 0;

  window.gtag('event', 'epc_metric', {
    event_category: 'Revenue',
    event_label: params.toolSlug,
    tool_slug: params.toolSlug,
    total_clicks: params.clicks,
    total_conversions: params.conversions,
    total_revenue: params.revenue,
    epc_value: epc.toFixed(2),
  });
}

/**
 * Type augmentation for the global Window interface
 * Adds type definitions for Google Analytics gtag function
 */
declare global {
  interface Window {
    /**
     * Google Analytics gtag function
     * @param command - The gtag command ('config', 'event', 'js', or 'set')
     * @param targetId - The target (measurement ID or event name)
     * @param config - Optional configuration object
     */
    gtag: (
      command: 'config' | 'event' | 'js' | 'set',
      targetId: string,
      config?: Record<string, unknown>
    ) => void;
    /** Google Analytics data layer array */
    dataLayer: unknown[];
  }
}
