import Script from 'next/script';

/**
 * Umami Cloud tracker. Query strings and fragments are not collected: Umami's
 * documented tracker options data-exclude-search (v2.11.0, "don't collect search
 * parameters from the URL") and data-exclude-hash (v2.16.0) are set.
 * Docs: https://umami.is/docs/tracker-configuration#data-exclude-search
 * Attribution (utm_*) is carried by the Kit source/campaign tags, not by Umami.
 */
export function UmamiAnalytics() {
  const websiteId = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID;
  if (!websiteId) return null;
  return (
    <Script
      src="https://cloud.umami.is/script.js"
      data-website-id={websiteId}
      data-exclude-search="true"
      data-exclude-hash="true"
      strategy="afterInteractive"
    />
  );
}
