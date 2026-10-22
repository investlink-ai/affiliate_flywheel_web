/**
 * The committed list of Kit attribution tags (R1/R3). This file is the only place a
 * src-* or cmp-* tag can come from.
 *
 * Keys are the Kit tag names: lowercase kebab-case, prefixed src- or cmp-.
 * Values are the numeric Kit tag IDs as strings, or null until the tag has been
 * created in Kit (F5). Tag IDs are not secrets.
 *
 * Rules (tested in __tests__/i3-attribution.test.mjs):
 * - every signup carries exactly one src-* tag (src-unattributed when utm_source is
 *   missing or not listed here) and at most one cmp-* tag;
 * - a signup with no cmp-* tag is counted as cmp-none. cmp-none is a reporting
 *   bucket, never a Kit tag, so it must not appear below;
 * - hidden-tags sends source/campaign tags[] at subscribe time; form-per-source
 *   uses operator-configured Kit form subscription rules for source tags and
 *   best-effort campaign tags[]. scripts/kit-tag-report.mjs only reads/reports.
 *
 * Adding a channel or campaign = add a key here (and its Kit tag ID once created)
 * in a reviewed commit.
 */
/** @typedef {{sources: Record<string, string | null>, campaigns: Record<string, string | null>, sourceForms?: Record<string, string | null>}} TagList */

/** @type {Readonly<TagList>} */
export const TAG_LIST = Object.freeze({
  sources: Object.freeze({
    'src-x': '24886135',
    'src-youtube': '24886136',
    'src-newsletter': '24886138',
    'src-newsletter-xpromo': '24886139',
    'src-organic': '24886141',
    'src-direct': '24886142',
    'src-unattributed': '24886143',
  }),
  // Fallback: one Kit form per source, with a Kit subscribe -> source tag rule.
  // Public IDs, filled by the operator after creating the forms.
  sourceForms: Object.freeze({
    'src-x': null,
    'src-youtube': null,
    'src-newsletter': null,
    'src-newsletter-xpromo': null,
    'src-organic': null,
    'src-direct': null,
    'src-unattributed': null,
  }),
  campaigns: Object.freeze({
    'cmp-anchor-1': '24886162',
    'cmp-i3-preview': '24886146',
    'cmp-preview-ai-research-checklist': '24886147',
  }),
});

export const UNATTRIBUTED_SOURCE = 'src-unattributed';
export const NO_CAMPAIGN = 'cmp-none';
export const TAG_NAME_RE = /^(src|cmp)-[a-z0-9]+(?:-[a-z0-9]+)*$/;
