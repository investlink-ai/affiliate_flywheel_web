import {
  TAG_LIST, sourceFormProblems, SOURCE_TAGS, CAMPAIGN_TAGS, NO_CAMPAIGN, sourceTagFor, campaignTagFor, guideCampaignForReferrer,
} from './source-tags.mjs';

const DAY_MS = 24 * 60 * 60 * 1000;
const safeId = (id) => String(id).replace(/[^a-zA-Z0-9_-]/g, '');
// Listed tag names are committed constants and safe to print; anything else is
// reported as a placeholder so raw Kit tag names never reach the output.
const LISTED = new Set([...SOURCE_TAGS, ...CAMPAIGN_TAGS]);
const tagLabel = (name) => (LISTED.has(name) ? name : 'an unlisted tag');
const hasUtm = (utm) => !!utm && Object.values(utm).some((v) => typeof v === 'string' && v.trim() !== '');

/**
 * Read-only R1/R3 attribution report over every page of a Kit form's subscribers.
 * It never writes: rule breaks are reported for a person to investigate, not fixed.
 *
 * Per confirmed (state "active") subscriber:
 * - exactly one src-* tag, at most one cmp-* tag, every src-/cmp- tag in the
 *   committed list (lib/attribution/tag-list.mjs);
 * - no cmp-* tag counts as cmp-none;
 * - the tags must be the ones the hosted form would have set from the stored
 *   UTMs, and must not be applied long after signup. Either sign means the tag was
 *   added or changed later, i.e. by hand. When Kit stored no UTMs the comparison
 *   is a warning only, because Kit's UTM capture is UNVERIFIED.
 * - a guide-page default campaign (GUIDE_DEFAULT_CAMPAIGNS) is set only by the
 *   guide's own opt-in form. Site-wide placements on the same page (e.g. the exit
 *   popup) send no campaign tag, and Kit's stored referrer cannot tell them apart,
 *   so when no listed utm_campaign exists, "no cmp-* tag" is also valid there.
 *
 * @param {{api: import('./kit-client.mjs').KitApi, formId?: string|number, mode?: string, sourceForms?: Record<string, string|null>, lateTagMs?: number}} options
 */
export async function tagReport({ api, formId, mode = 'hidden-tags', sourceForms = TAG_LIST.sourceForms, lateTagMs = DAY_MS }) {
  if (!['hidden-tags', 'form-per-source'].includes(mode)) throw new Error('Invalid attribution mode');
  if (mode === 'form-per-source' && sourceFormProblems({ ...TAG_LIST, sourceForms }, { requireIds: true }).length) {
    throw new Error('Invalid source forms');
  }
  const forms = mode === 'form-per-source' ? Object.entries(sourceForms) : [[null, formId]];
  const report = {
    confirmed: 0,
    unconfirmedSkipped: 0,
    bySource: Object.fromEntries(SOURCE_TAGS.map((t) => [t, 0])),
    byCampaign: Object.fromEntries([...CAMPAIGN_TAGS, NO_CAMPAIGN].map((t) => [t, 0])),
    violations: [],
    warnings: [],
  };
  for (const [expectedSource, currentFormId] of forms) {
    const cursors = new Set();
    let after;
    do {
      const page = await api.listFormSubscribers({ formId: currentFormId, after });
      if (!page || !Array.isArray(page.subscribers) || typeof page.pagination?.has_next_page !== 'boolean' ||
          !('end_cursor' in page.pagination) ||
          (page.pagination.end_cursor !== null && typeof page.pagination.end_cursor !== 'string') ||
          page.subscribers.some((s) => !s || !['number', 'string'].includes(typeof s.id) || typeof s.state !== 'string')) {
        throw new Error('Malformed subscriber page');
      }
      const { has_next_page: hasNext, end_cursor: cursor } = page.pagination;
      if (hasNext && (!cursor || cursors.has(cursor))) throw new Error('Malformed subscriber pagination');

      for (const subscriber of page.subscribers) {
        if (subscriber.state !== 'active') { report.unconfirmedSkipped++; continue; }
        report.confirmed++;
        const id = safeId(subscriber.id);
        const flag = (list, rule) => list.push({ subscriber: id, rule });
        const tags = await api.listSubscriberTags(subscriber.id);
        if (!Array.isArray(tags) || tags.some((t) => !t || typeof t.name !== 'string')) throw new Error('Malformed subscriber tags');
        const src = tags.filter((t) => t.name.startsWith('src-'));
        const cmp = tags.filter((t) => t.name.startsWith('cmp-'));

        for (const t of [...src, ...cmp]) {
          if (![...SOURCE_TAGS, ...CAMPAIGN_TAGS].includes(t.name)) flag(report.violations, 'unlisted tag (a src-/cmp- name not in the committed list)');
        }
        if (src.length !== 1) flag(report.violations, `expected exactly one src-* tag, found ${src.length}`);
        if (cmp.length > 1) flag(report.violations, `expected at most one cmp-* tag, found ${cmp.length}`);
        if (src.length === 1 && SOURCE_TAGS.includes(src[0].name)) report.bySource[src[0].name]++;
        if (cmp.length === 0) report.byCampaign[NO_CAMPAIGN]++;
        else if (cmp.length === 1 && CAMPAIGN_TAGS.includes(cmp[0].name)) report.byCampaign[cmp[0].name]++;

        const utm = subscriber.referrer_utm_parameters;
        const listedCampaign = campaignTagFor(utm);
        const guideCampaign = guideCampaignForReferrer(subscriber.referrer);
        const expectedCampaign = listedCampaign ?? guideCampaign;
        // Missing/unknown referrer leaves the guide default ambiguous.
        let hasReferrer = false;
        try { hasReferrer = ['https:', 'http:'].includes(new URL(subscriber.referrer).protocol); } catch { /* Missing or malformed referrer. */ }
        const campaignAmbiguous = !listedCampaign && !hasReferrer;
        const expected = [sourceTagFor(utm), expectedCampaign].filter(Boolean).sort().join(',');
        const actual = [...src, ...cmp].map((t) => t.name).sort().join(',');
        // Guide default only (no listed utm_campaign): a site-wide form such as the
        // exit popup legitimately sends no campaign tag from the guide page.
        const guideDefaultOmitted = !listedCampaign && !!guideCampaign && cmp.length === 0;
        if (mode === 'form-per-source') {
          if (src.length === 1 && src[0].name !== expectedSource) {
            flag(report.violations, `expected ${expectedSource} for source form ${safeId(currentFormId)}`);
          }
          if (guideDefaultOmitted) {
            // Valid: site-wide placement on the guide page (see header).
          } else if (expectedCampaign && cmp.length === 0) {
            flag(report.warnings, `missing campaign tag ${expectedCampaign} (best-effort)`);
          } else if (cmp.map((t) => t.name).join(',') !== (expectedCampaign ?? '')) {
            flag(hasUtm(utm) && !campaignAmbiguous ? report.violations : report.warnings, 'campaign tags differ from stored UTMs/referrer');
          }
        } else if (expected !== actual && !(guideDefaultOmitted && actual === sourceTagFor(utm))) {
          const sourceMismatch = src.length !== 1 || src[0].name !== sourceTagFor(utm);
          flag(hasUtm(utm) && (sourceMismatch || !campaignAmbiguous) ? report.violations : report.warnings,
            `tags differ from what the form sets for the stored UTMs (expected ${expected || 'none'})`);
        }
        const createdAt = Date.parse(subscriber.created_at);
        for (const t of [...src, ...cmp]) {
          const taggedAt = Date.parse(t.tagged_at ?? '');
          if (Number.isFinite(createdAt) && Number.isFinite(taggedAt) && taggedAt - createdAt > lateTagMs) {
            flag(report.violations, `${tagLabel(t.name)} applied more than ${Math.round(lateTagMs / 3600000)}h after signup`);
          }
        }
      }
      if (!hasNext) break;
      cursors.add(cursor);
      after = cursor;
    } while (true);
  }
  report.ok = report.violations.length === 0;
  return report;
}
