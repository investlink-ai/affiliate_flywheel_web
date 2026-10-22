/** Canonical origin. Also the fail case for a missing or malformed NEXT_PUBLIC_SITE_URL. */
export const DEFAULT_SITE_URL = 'https://www.investlink.ai';

/** The retired .com domain. Built from parts so the commercial scanner's old-domain rule stays meaningful. */
const RETIRED_DOMAIN = new RegExp(['investlink', 'com'].join('\\.'), 'i');

/**
 * Resolve the site origin from NEXT_PUBLIC_SITE_URL.
 * - Contains the retired .com domain: throws, so `next build` fails (on Vercel too,
 *   which doesn't run check:commercial). Reviewer P3-2 on #24.
 * - Missing, malformed or not http(s): https://www.investlink.ai.
 * - Otherwise its origin (no path, query or trailing slash). The apex
 *   https://investlink.ai, which Vercel production uses, passes.
 */
export function resolveSiteUrl(raw: string | undefined): string {
  const value = raw?.trim();
  if (!value) return DEFAULT_SITE_URL;
  if (RETIRED_DOMAIN.test(value)) {
    throw new Error(
      'NEXT_PUBLIC_SITE_URL points at the retired .com domain. Set it to https://www.investlink.ai (or https://investlink.ai), or remove it.'
    );
  }
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    return DEFAULT_SITE_URL;
  }
  if (url.protocol !== 'https:' && url.protocol !== 'http:') return DEFAULT_SITE_URL;
  return url.origin;
}

export const SITE_URL = resolveSiteUrl(process.env.NEXT_PUBLIC_SITE_URL);
