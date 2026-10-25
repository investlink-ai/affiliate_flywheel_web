/** Google Analytics 4 utilities for site engagement and outbound clicks. */

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
 * @param {string} url - The URL path of the page (e.g., '/reviews/quantconnect')
 * @param {string} [title] - Optional page title for the view
 * @returns {void}
 * 
 * @example
 * ```typescript
 * // Track a page view
 * trackPageView('/reviews/quantconnect', 'QuantConnect Review 2026');
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
 * Parameters for tracking outbound link clicks
 */
interface OutboundClickParams {
  /** Display name of the tool (e.g., 'Jasper AI') */
  toolName: string;
  /** URL-friendly slug of the tool (e.g., 'quantconnect') */
  toolSlug: string;
  /** The full outbound URL being clicked */
  websiteUrl: string;
  /** Position on page where click occurred (e.g., 'hero', 'sidebar', 'content', 'sticky-cta', 'tool-card') */
  position: string;
  /** Optional A/B test variant for CTA styling */
  ctaVariant?: string;
}

/** Tracks which tool website was visited and where the click occurred. */
export function trackOutboundClick(params: OutboundClickParams): void {
  if (!isGAAvailable()) return;

  const { toolName, toolSlug, websiteUrl, position, ctaVariant } = params;

  // GA4 event for outbound click
  window.gtag('event', 'outbound_click', {
    event_category: 'Outbound',
    event_label: toolName,
    tool_name: toolName,
    tool_slug: toolSlug,
    website_url: websiteUrl,
    click_position: position,
    cta_variant: ctaVariant ?? 'default',
    timestamp: new Date().toISOString(),
  });

  // Also track as outbound link for compatibility
  window.gtag('event', 'click', {
    event_category: 'outbound',
    event_label: websiteUrl,
    transport_type: 'beacon',
  });

  // Log in development
  if (process.env.NODE_ENV === 'development') {
    console.log('[Analytics] Outbound click:', params);
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

/** Records a form handoff to Kit, without claiming a confirmed subscription. */
export function trackSignupSubmitted(params: NewsletterSignupParams): void {
  if (!isGAAvailable()) return;

  window.gtag('event', 'signup_submitted', {
    event_category: 'Engagement',
    event_label: params.location,
    signup_location: params.location,
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
  /** Type of conversion (e.g., 'outbound_click', 'signup_submitted') */
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
 * @param {string} params.conversionType - Type of conversion (e.g., 'outbound_click', 'signup_submitted')
 * @returns {void}
 * 
 * @example
 * ```typescript
 * trackABTestConversion({
 *   testId: 'hero-cta-color',
 *   variantId: 'variant-b',
 *   conversionType: 'outbound_click',
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
 * trackComparisonView(['Jasper AI', 'Copy.ai']);
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
 *   toolSlug: 'quantconnect',
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
 * Type augmentation for the global Window interface
 * Adds type definitions for Google Analytics gtag function
 */
declare global {
  interface Window {
    /**
     * Google Analytics gtag function
     * @param command - The gtag command ('config', 'event', 'js', 'set', or 'consent' for Consent Mode)
     * @param targetId - The target (measurement ID, event name, or 'default'/'update' for consent)
     * @param config - Optional configuration object
     */
    gtag: (
      command: 'config' | 'event' | 'js' | 'set' | 'consent',
      targetId: string,
      config?: Record<string, unknown>
    ) => void;
    /** Google Analytics data layer array */
    dataLayer: unknown[];
  }
}
