export const ALLOWED_SOURCES = ['x', 'youtube', 'newsletter', 'newsletter-xpromo', 'organic', 'direct'];

/** @param {{source?: string | null}} [utm] */
export function sourceTagFor(utm) {
  const source = typeof utm?.source === 'string' ? utm.source.trim().toLowerCase() : '';
  return `src-${ALLOWED_SOURCES.includes(source) ? source : 'unattributed'}`;
}

/** @param {{campaign?: string | null}} [utm] */
export function campaignTagFor(utm) {
  const slug = typeof utm?.campaign === 'string'
    ? utm.campaign.trim().toLowerCase().replace(/[^a-z0-9-]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 50).replace(/-+$/g, '')
    : '';
  return slug ? `cmp-${slug}` : null;
}
