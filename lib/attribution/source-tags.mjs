import { TAG_LIST, UNATTRIBUTED_SOURCE, NO_CAMPAIGN, TAG_NAME_RE } from './tag-list.mjs';

export { TAG_LIST, UNATTRIBUTED_SOURCE, NO_CAMPAIGN, TAG_NAME_RE };
export const SOURCE_TAGS = Object.keys(TAG_LIST.sources);
export const CAMPAIGN_TAGS = Object.keys(TAG_LIST.campaigns);

/** @param {unknown} value */
const clean = (value) => (typeof value === 'string' ? value.trim().toLowerCase() : '');

/**
 * Exactly one source tag, always from the committed list.
 * @param {{source?: string | null}} [utm]
 */
export function sourceTagFor(utm) {
  const name = `src-${clean(utm?.source)}`;
  return TAG_NAME_RE.test(name) && SOURCE_TAGS.includes(name) && name !== UNATTRIBUTED_SOURCE
    ? name
    : UNATTRIBUTED_SOURCE;
}

/**
 * At most one campaign tag, only if listed; otherwise null (counted as cmp-none).
 * No slugging: an unlisted or non-kebab-case utm_campaign never becomes a tag.
 * @param {{campaign?: string | null}} [utm]
 */
export function campaignTagFor(utm) {
  const name = `cmp-${clean(utm?.campaign)}`;
  return TAG_NAME_RE.test(name) && CAMPAIGN_TAGS.includes(name) ? name : null;
}

/**
 * Reads utm_source / utm_campaign from a page URL.
 * @param {string} pageUrl
 * @returns {{source?: string | null, campaign?: string | null}}
 */
export function utmFromUrl(pageUrl) {
  try {
    const params = new URL(pageUrl).searchParams;
    return { source: params.get('utm_source'), campaign: params.get('utm_campaign') };
  } catch {
    return {};
  }
}

/**
 * The tag names a signup from this page gets at subscribe time.
 * @param {string} pageUrl
 * @param {string} [defaultCampaign]
 */
export function signupTagsForUrl(pageUrl, defaultCampaign = undefined) {
  const utm = utmFromUrl(pageUrl);
  return { source: sourceTagFor(utm), campaign: campaignTagFor(utm) ?? (CAMPAIGN_TAGS.includes(defaultCampaign) ? defaultCampaign : null) };
}

/**
 * Problems with the committed list itself; empty when valid.
 * @param {import('./tag-list.mjs').TagList} [list]
 * @param {{requireIds?: boolean}} [options]
 * @returns {string[]}
 */
export function tagListProblems(list = TAG_LIST, { requireIds = false } = {}) {
  const problems = [];
  const ids = new Map();
  for (const [group, prefix] of [['sources', 'src-'], ['campaigns', 'cmp-']]) {
    for (const [name, id] of Object.entries(list[group] ?? {})) {
      if (!TAG_NAME_RE.test(name) || !name.startsWith(prefix)) problems.push(`${name}: not lowercase kebab-case ${prefix}*`);
      if (name === NO_CAMPAIGN) problems.push(`${name}: reserved reporting bucket, not a tag`);
      if (id === null) {
        if (requireIds) problems.push(`${name}: no Kit tag ID`);
      } else if (typeof id !== 'string' || !/^[1-9]\d*$/.test(id)) {
        problems.push(`${name}: Kit tag ID must be a positive integer string`);
      } else if (ids.has(id)) {
        problems.push(`${name}: Kit tag ID ${id} also used by ${ids.get(id)}`);
      } else {
        ids.set(id, name);
      }
    }
  }
  if (!Object.hasOwn(list.sources ?? {}, UNATTRIBUTED_SOURCE)) problems.push(`${UNATTRIBUTED_SOURCE}: missing`);
  return problems;
}

/**
 * Hidden form fields that make the Kit hosted form apply the tags at subscribe
 * time: one tags[] per tag, valued with the Kit tag ID. Returns null if a needed
 * ID is missing, so the caller can refuse to submit rather than sign someone up
 * without their source tag.
 * @param {string} pageUrl
 * @param {import('./tag-list.mjs').TagList} [list]
 * @param {string} [defaultCampaign]
 * @returns {Array<[string, string]> | null}
 */
export function kitTagFields(pageUrl, list = TAG_LIST, defaultCampaign = undefined) {
  const { source, campaign } = signupTagsForUrl(pageUrl, defaultCampaign);
  const sourceId = list.sources[source];
  if (!sourceId) return null;
  const fields = [['tags[]', sourceId]];
  if (campaign) {
    const campaignId = list.campaigns[campaign];
    if (!campaignId) return null;
    fields.push(['tags[]', campaignId]);
  }
  return fields;
}

/** Unset selects the original mode; any other value must be explicit and valid. */
export function attributionMode(value) {
  if (value === undefined) return 'hidden-tags';
  return ['hidden-tags', 'form-per-source'].includes(value) ? value : null;
}

/** Validate the form map offline, independently of tag IDs. */
export function sourceFormProblems(list = TAG_LIST, { requireIds = false } = {}) {
  const problems = [];
  const ids = new Set();
  for (const name of Object.keys(list.sourceForms ?? {})) {
    if (!Object.hasOwn(list.sources, name)) problems.push(`${name}: source form has no listed source`);
  }
  for (const name of Object.keys(list.sources)) {
    const id = list.sourceForms?.[name];
    if (id === null && !requireIds) continue;
    if (typeof id !== 'string' || !/^[1-9]\d*$/.test(id)) problems.push(`${name}: positive integer Kit form ID required`);
    else if (ids.has(id)) problems.push(`${name}: Kit form ID ${id} must be distinct`);
    else ids.add(id);
  }
  return problems;
}

/** Resolve a source-specific action; never use the single-form environment ID. */
export function kitSourceFormAction(pageUrl, list = TAG_LIST) {
  const { source } = signupTagsForUrl(pageUrl);
  const id = list.sourceForms?.[source];
  return typeof id === 'string' && /^[1-9]\d*$/.test(id)
    ? `https://app.kit.com/forms/${id}/subscriptions` : null;
}

/**
 * Campaign tags are best-effort in fallback mode; source comes from a Kit rule.
 * @param {string} pageUrl
 * @param {import('./tag-list.mjs').TagList} [list]
 * @param {string} [defaultCampaign]
 * @returns {Array<[string, string]>}
 */
export function kitCampaignFields(pageUrl, list = TAG_LIST, defaultCampaign = undefined) {
  const { campaign } = signupTagsForUrl(pageUrl, defaultCampaign);
  const id = campaign && list.campaigns[campaign];
  return typeof id === 'string' && /^[1-9]\d*$/.test(id) ? [['tags[]', id]] : [];
}

/** Shared offline build gate, also exercised with fully configured fixture IDs. */
export function attributionProblems(env, list = TAG_LIST) {
  const requireIds = env.NEXT_PUBLIC_EMAIL_PROVIDER === 'kit';
  const mode = attributionMode(env.NEXT_PUBLIC_KIT_ATTRIBUTION);
  const problems = tagListProblems(list, { requireIds: requireIds && mode === 'hidden-tags' });
  if (requireIds && !mode) problems.push('invalid NEXT_PUBLIC_KIT_ATTRIBUTION');
  if (requireIds && mode === 'form-per-source') problems.push(...sourceFormProblems(list, { requireIds: true }));
  return problems;
}

/** Shared guide defaults for read-only reporting; signup placements pass defaults explicitly. */
export const GUIDE_DEFAULT_CAMPAIGNS = Object.freeze({
  '/guides/preview-ai-research-checklist': 'cmp-anchor-1',
});

export function guideCampaignForReferrer(referrer) {
  try {
    const url = new URL(referrer);
    if (!['https:', 'http:'].includes(url.protocol)) return null;
    return GUIDE_DEFAULT_CAMPAIGNS[url.pathname.replace(/\/$/, '')] ?? null;
  } catch { return null; }
}
