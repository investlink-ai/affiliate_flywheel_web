'use client';

import Script from 'next/script';
import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, Suspense } from 'react';
import { GA_MEASUREMENT_ID, trackPageView } from '@/lib/analytics';

/**
 * Google Analytics 4 tracking component
 * Handles page views and initializes gtag
 */
function GoogleAnalyticsTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (pathname) {
      const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '');
      trackPageView(url);
    }
  }, [pathname, searchParams]);

  return null;
}

export function GoogleAnalytics() {
  // Don't load in development unless explicitly enabled
  const isDev = process.env.NODE_ENV === 'development';
  const forceEnable = process.env.NEXT_PUBLIC_GA_FORCE_ENABLE === 'true';

  if (isDev && !forceEnable) {
    return null;
  }

  // Don't render if no measurement ID
  if (!GA_MEASUREMENT_ID || GA_MEASUREMENT_ID === 'G-XXXXXXXXXX') {
    return null;
  }

  return (
    <>
      {/* Consent default MUST run before gtag.js loads (gtag.js, not GTM) */}
      <Script
        id="google-analytics-consent"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            (function() {
              var region = 'EEA';
              try {
                var match = document.cookie.match(/ga_consent_region=([^;]+)/);
                if (match) region = match[1].trim();
              } catch (e) {}
              if (region === 'EEA') {
                gtag('consent', 'default', {
                  analytics_storage: 'denied',
                  ad_storage: 'denied',
                  wait_for_update: 500,
                });
              }
            })();
          `,
        }}
      />
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            gtag('js', new Date());
            
            gtag('config', '${GA_MEASUREMENT_ID}', {
              page_path: window.location.pathname,
              cookie_flags: 'SameSite=None;Secure',
              send_page_view: true,
              // Enhanced measurement
              enhanced_measurement: {
                scroll_tracking: true,
                outbound_clicks: true,
                file_downloads: true,
              },
              // Custom dimensions for affiliate tracking
              custom_map: {
                dimension1: 'tool_name',
                dimension2: 'tool_slug',
                dimension3: 'click_position',
                dimension4: 'cta_variant',
                dimension5: 'urgency_variant',
                dimension6: 'user_type',
                metric1: 'epc_value',
              },
            });

            // Track affiliate clicks globally
            document.addEventListener('click', function(e) {
              const link = e.target.closest('a[rel*="sponsored"]');
              if (link) {
                const href = link.getAttribute('href');
                gtag('event', 'affiliate_click_global', {
                  event_category: 'Affiliate',
                  event_label: href,
                  affiliate_url: href,
                  page_location: window.location.href,
                  timestamp: new Date().toISOString(),
                });
              }
            });

            // Debug mode in development
            ${isDev ? "gtag('config', '" + GA_MEASUREMENT_ID + "', { debug_mode: true });" : ''}
          `,
        }}
      />

      {/* Page view tracker */}
      <Suspense fallback={null}>
        <GoogleAnalyticsTracker />
      </Suspense>
    </>
  );
}

/**
 * Affiliate click tracking hook integration
 * Use this to enhance AffiliateLink with automatic tracking
 */
export function useAffiliateTracking() {
  useEffect(() => {
    // Listen for affiliate click custom events
    const handleAffiliateClick = (e: CustomEvent) => {
      const { testId, variantId, eventName } = e.detail;
      
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'ab_test_conversion', {
          event_category: 'Experiment',
          event_label: testId,
          test_id: testId,
          variant_id: variantId,
          conversion_type: eventName,
        });
      }
    };

    window.addEventListener('ab_test_conversion', handleAffiliateClick as EventListener);
    return () => {
      window.removeEventListener('ab_test_conversion', handleAffiliateClick as EventListener);
    };
  }, []);
}
