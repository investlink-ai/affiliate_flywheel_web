/** Canonical origin. Also the fail case for a missing, malformed or retired NEXT_PUBLIC_SITE_URL. */
export const DEFAULT_SITE_URL = 'https://www.investlink.ai';

/** Domains the site no longer uses; a NEXT_PUBLIC_SITE_URL on one of these falls back to the default. */
const RETIRED_HOST = /(^|\.)investlink\.com$/i;

/**
 * Resolve the site origin from NEXT_PUBLIC_SITE_URL. Anything that isn't an absolute
 * http(s) URL, or that points at the retired .com domain, resolves to
 * https://www.investlink.ai, so canonicals, sitemap, robots, OG and JSON-LD can never
 * carry the old domain. Only the origin is kept (no path, query or trailing slash).
 */
export function resolveSiteUrl(raw: string | undefined): string {
  const value = raw?.trim();
  if (!value) return DEFAULT_SITE_URL;
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    return DEFAULT_SITE_URL;
  }
  if (url.protocol !== 'https:' && url.protocol !== 'http:') return DEFAULT_SITE_URL;
  if (RETIRED_HOST.test(url.hostname)) return DEFAULT_SITE_URL;
  return url.origin;
}

export const SITE_URL = resolveSiteUrl(process.env.NEXT_PUBLIC_SITE_URL);
