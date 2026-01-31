import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  GA_MEASUREMENT_ID,
  isGAAvailable,
  trackPageView,
  trackEvent,
  trackAffiliateClick,
  trackNewsletterSignup,
  trackABTestAssignment,
  trackABTestConversion,
  trackComparisonView,
  trackReviewEngagement,
  trackEPCData,
} from '@/lib/analytics';

describe('analytics', () => {
  const originalGtag = window.gtag;

  afterEach(() => {
    window.gtag = originalGtag;
  });

  describe('GA_MEASUREMENT_ID', () => {
    it('is a string', () => {
      expect(GA_MEASUREMENT_ID).toBeDefined();
      expect(typeof GA_MEASUREMENT_ID).toBe('string');
    });

    it('matches GA measurement ID format or placeholder', () => {
      expect(GA_MEASUREMENT_ID).toMatch(/^G-[A-Z0-9]+$/);
    });
  });

  describe('isGAAvailable', () => {
    it('returns true when window and gtag exist', () => {
      window.gtag = vi.fn();
      expect(isGAAvailable()).toBe(true);
    });

    it('returns false when gtag is not a function', () => {
      (window as unknown as { gtag: unknown }).gtag = undefined;
      expect(isGAAvailable()).toBe(false);
    });

    it('returns false when gtag is not a function (e.g. string)', () => {
      (window as unknown as { gtag: unknown }).gtag = 'not-a-function';
      expect(isGAAvailable()).toBe(false);
    });
  });

  describe('trackPageView', () => {
    beforeEach(() => {
      window.gtag = vi.fn();
    });

    it('calls gtag with config, measurement ID, and page_path', () => {
      trackPageView('/reviews/jasper-ai');
      expect(window.gtag).toHaveBeenCalledWith(
        'config',
        GA_MEASUREMENT_ID,
        expect.objectContaining({
          page_path: '/reviews/jasper-ai',
        })
      );
    });

    it('includes page_title when provided', () => {
      trackPageView('/reviews/jasper-ai', 'Jasper AI Review 2026');
      expect(window.gtag).toHaveBeenCalledWith(
        'config',
        GA_MEASUREMENT_ID,
        expect.objectContaining({
          page_path: '/reviews/jasper-ai',
          page_title: 'Jasper AI Review 2026',
        })
      );
    });

    it('does not call gtag when GA is not available', () => {
      const gtagMock = window.gtag;
      (window as unknown as { gtag: unknown }).gtag = undefined;
      trackPageView('/reviews/jasper-ai');
      expect(gtagMock).not.toHaveBeenCalled();
    });
  });

  describe('trackEvent', () => {
    beforeEach(() => {
      window.gtag = vi.fn();
    });

    it('calls gtag with event, action, and params', () => {
      trackEvent('click', 'CTA', 'Hero Button');
      expect(window.gtag).toHaveBeenCalledWith('event', 'click', {
        event_category: 'CTA',
        event_label: 'Hero Button',
        value: undefined,
      });
    });

    it('includes value when provided', () => {
      trackEvent('purchase', 'Conversion', 'Premium Plan', 99);
      expect(window.gtag).toHaveBeenCalledWith('event', 'purchase', {
        event_category: 'Conversion',
        event_label: 'Premium Plan',
        value: 99,
      });
    });

    it('merges additionalParams into event payload', () => {
      trackEvent('click', 'CTA', 'Button', undefined, {
        currency: 'USD',
        item_id: 'premium_annual',
      });
      expect(window.gtag).toHaveBeenCalledWith('event', 'click', {
        event_category: 'CTA',
        event_label: 'Button',
        value: undefined,
        currency: 'USD',
        item_id: 'premium_annual',
      });
    });

    it('does not call gtag when GA is not available', () => {
      const gtagMock = window.gtag;
      (window as unknown as { gtag: unknown }).gtag = undefined;
      trackEvent('click', 'CTA', 'Label');
      expect(gtagMock).not.toHaveBeenCalled();
    });
  });

  describe('trackAffiliateClick', () => {
    beforeEach(() => {
      window.gtag = vi.fn();
      vi.spyOn(console, 'log').mockImplementation(() => {});
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it('calls gtag with affiliate_click event and params', () => {
      trackAffiliateClick({
        toolName: 'Jasper AI',
        toolSlug: 'jasper-ai',
        affiliateUrl: 'https://jasper.ai?ref=example',
        position: 'hero',
      });
      const affiliateClickPayload = (window.gtag as ReturnType<typeof vi.fn>).mock
        .calls[0]?.[2] as Record<string, unknown> | undefined;
      expect(affiliateClickPayload).toBeDefined();
      expect(affiliateClickPayload).toMatchObject({
        event_category: 'Affiliate',
        event_label: 'Jasper AI',
        tool_name: 'Jasper AI',
        tool_slug: 'jasper-ai',
        affiliate_url: 'https://jasper.ai?ref=example',
        click_position: 'hero',
        cta_variant: 'default',
        urgency_variant: 'none',
      });
      expect(affiliateClickPayload!.timestamp).toBeDefined();
      expect(affiliateClickPayload!.timestamp).toMatch(
        /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/
      );
    });

    it('includes optional ctaVariant and urgencyVariant', () => {
      trackAffiliateClick({
        toolName: 'Jasper AI',
        toolSlug: 'jasper-ai',
        affiliateUrl: 'https://jasper.ai',
        position: 'sticky-cta',
        ctaVariant: 'gradient',
        urgencyVariant: 'limited-offer',
      });
      expect(window.gtag).toHaveBeenCalledWith(
        'event',
        'affiliate_click',
        expect.objectContaining({
          cta_variant: 'gradient',
          urgency_variant: 'limited-offer',
        })
      );
    });

    it('calls gtag with click/outbound for compatibility', () => {
      trackAffiliateClick({
        toolName: 'Jasper AI',
        toolSlug: 'jasper-ai',
        affiliateUrl: 'https://jasper.ai',
        position: 'hero',
      });
      expect(window.gtag).toHaveBeenCalledWith('event', 'click', {
        event_category: 'outbound',
        event_label: 'https://jasper.ai',
        transport_type: 'beacon',
      });
    });

    it('does not call gtag when GA is not available', () => {
      const gtagMock = window.gtag;
      (window as unknown as { gtag: unknown }).gtag = undefined;
      trackAffiliateClick({
        toolName: 'Jasper AI',
        toolSlug: 'jasper-ai',
        affiliateUrl: 'https://jasper.ai',
        position: 'hero',
      });
      expect(gtagMock).not.toHaveBeenCalled();
    });
  });

  describe('trackNewsletterSignup', () => {
    beforeEach(() => {
      window.gtag = vi.fn();
    });

    it('calls gtag with newsletter_signup event', () => {
      trackNewsletterSignup({ location: 'homepage' });
      expect(window.gtag).toHaveBeenCalledWith(
        'event',
        'newsletter_signup',
        expect.objectContaining({
          event_category: 'Engagement',
          event_label: 'homepage',
          signup_location: 'homepage',
        })
      );
    });

    it('calls gtag with conversion event', () => {
      trackNewsletterSignup({ location: 'exit-intent-popup' });
      expect(window.gtag).toHaveBeenCalledWith('event', 'conversion', {
        send_to: `${GA_MEASUREMENT_ID}/newsletter`,
        event_category: 'Lead',
        event_label: 'Newsletter Signup',
      });
    });

    it('does not send email to GA (privacy)', () => {
      trackNewsletterSignup({
        location: 'review-footer',
        email: 'user@example.com',
      });
      const newsletterCall = (window.gtag as ReturnType<typeof vi.fn>).mock
        .calls[0];
      expect(newsletterCall).toBeDefined();
      expect(newsletterCall![2]).not.toHaveProperty('email');
    });

    it('does not call gtag when GA is not available', () => {
      const gtagMock = window.gtag;
      (window as unknown as { gtag: unknown }).gtag = undefined;
      trackNewsletterSignup({ location: 'homepage' });
      expect(gtagMock).not.toHaveBeenCalled();
    });
  });

  describe('trackABTestAssignment', () => {
    beforeEach(() => {
      window.gtag = vi.fn();
    });

    it('calls gtag with ab_test_assignment and params', () => {
      trackABTestAssignment({
        testId: 'hero-cta-color',
        variantId: 'variant-b',
        variantValue: 'gradient',
      });
      expect(window.gtag).toHaveBeenCalledWith(
        'event',
        'ab_test_assignment',
        expect.objectContaining({
          event_category: 'Experiment',
          event_label: 'hero-cta-color',
          test_id: 'hero-cta-color',
          variant_id: 'variant-b',
          variant_value: 'gradient',
        })
      );
    });

    it('does not call gtag when GA is not available', () => {
      const gtagMock = window.gtag;
      (window as unknown as { gtag: unknown }).gtag = undefined;
      trackABTestAssignment({
        testId: 'test',
        variantId: 'variant-a',
        variantValue: 'control',
      });
      expect(gtagMock).not.toHaveBeenCalled();
    });
  });

  describe('trackABTestConversion', () => {
    beforeEach(() => {
      window.gtag = vi.fn();
    });

    it('calls gtag with ab_test_conversion and params', () => {
      trackABTestConversion({
        testId: 'hero-cta-color',
        variantId: 'variant-b',
        conversionType: 'affiliate_click',
      });
      expect(window.gtag).toHaveBeenCalledWith(
        'event',
        'ab_test_conversion',
        expect.objectContaining({
          event_category: 'Experiment',
          event_label: 'hero-cta-color_affiliate_click',
          test_id: 'hero-cta-color',
          variant_id: 'variant-b',
          conversion_type: 'affiliate_click',
        })
      );
    });

    it('does not call gtag when GA is not available', () => {
      const gtagMock = window.gtag;
      (window as unknown as { gtag: unknown }).gtag = undefined;
      trackABTestConversion({
        testId: 'test',
        variantId: 'variant-a',
        conversionType: 'click',
      });
      expect(gtagMock).not.toHaveBeenCalled();
    });
  });

  describe('trackComparisonView', () => {
    beforeEach(() => {
      window.gtag = vi.fn();
    });

    it('calls gtag with comparison_view and tools', () => {
      trackComparisonView(['Jasper AI', 'Copy.ai', 'Claude']);
      expect(window.gtag).toHaveBeenCalledWith(
        'event',
        'comparison_view',
        expect.objectContaining({
          event_category: 'Engagement',
          event_label: 'Jasper AI vs Copy.ai vs Claude',
          tools_compared: ['Jasper AI', 'Copy.ai', 'Claude'],
          tool_count: 3,
        })
      );
    });

    it('handles single tool', () => {
      trackComparisonView(['Jasper AI']);
      expect(window.gtag).toHaveBeenCalledWith(
        'event',
        'comparison_view',
        expect.objectContaining({
          event_label: 'Jasper AI',
          tool_count: 1,
        })
      );
    });

    it('handles empty tools array', () => {
      trackComparisonView([]);
      expect(window.gtag).toHaveBeenCalledWith(
        'event',
        'comparison_view',
        expect.objectContaining({
          event_category: 'Engagement',
          event_label: '',
          tools_compared: [],
          tool_count: 0,
        })
      );
    });

    it('does not call gtag when GA is not available', () => {
      const gtagMock = window.gtag;
      (window as unknown as { gtag: unknown }).gtag = undefined;
      trackComparisonView(['Tool A', 'Tool B']);
      expect(gtagMock).not.toHaveBeenCalled();
    });
  });

  describe('trackReviewEngagement', () => {
    beforeEach(() => {
      window.gtag = vi.fn();
    });

    it('calls gtag with review_engagement and params', () => {
      trackReviewEngagement({
        toolSlug: 'jasper-ai',
        scrollDepth: 75,
        timeOnPage: 180,
      });
      expect(window.gtag).toHaveBeenCalledWith(
        'event',
        'review_engagement',
        expect.objectContaining({
          event_category: 'Engagement',
          event_label: 'jasper-ai',
          scroll_depth: 75,
          time_on_page: 180,
        })
      );
    });

    it('does not call gtag when GA is not available', () => {
      const gtagMock = window.gtag;
      (window as unknown as { gtag: unknown }).gtag = undefined;
      trackReviewEngagement({
        toolSlug: 'jasper-ai',
        scrollDepth: 50,
        timeOnPage: 60,
      });
      expect(gtagMock).not.toHaveBeenCalled();
    });
  });

  describe('trackEPCData', () => {
    beforeEach(() => {
      window.gtag = vi.fn();
    });

    it('calls gtag with epc_metric and computed epc_value', () => {
      trackEPCData({
        toolSlug: 'jasper-ai',
        clicks: 1500,
        conversions: 45,
        revenue: 2250,
      });
      expect(window.gtag).toHaveBeenCalledWith(
        'event',
        'epc_metric',
        expect.objectContaining({
          event_category: 'Revenue',
          event_label: 'jasper-ai',
          tool_slug: 'jasper-ai',
          total_clicks: 1500,
          total_conversions: 45,
          total_revenue: 2250,
          epc_value: '1.50',
        })
      );
    });

    it('computes EPC as revenue / clicks', () => {
      trackEPCData({
        toolSlug: 'tool-x',
        clicks: 100,
        conversions: 10,
        revenue: 250,
      });
      expect(window.gtag).toHaveBeenCalledWith(
        'event',
        'epc_metric',
        expect.objectContaining({
          epc_value: '2.50',
        })
      );
    });

    it('uses epc_value 0 when clicks is 0', () => {
      trackEPCData({
        toolSlug: 'tool-x',
        clicks: 0,
        conversions: 0,
        revenue: 0,
      });
      expect(window.gtag).toHaveBeenCalledWith(
        'event',
        'epc_metric',
        expect.objectContaining({
          epc_value: '0.00',
        })
      );
    });

    it('does not call gtag when GA is not available', () => {
      const gtagMock = window.gtag;
      (window as unknown as { gtag: unknown }).gtag = undefined;
      trackEPCData({
        toolSlug: 'jasper-ai',
        clicks: 100,
        conversions: 5,
        revenue: 100,
      });
      expect(gtagMock).not.toHaveBeenCalled();
    });
  });
});
