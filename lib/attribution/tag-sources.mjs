import { ALLOWED_SOURCES, sourceTagFor, campaignTagFor } from './source-tags.mjs';

/**
 * tagged/alreadyTagged count individual tag assignments, not subscribers.
 * @param {{api: import('./kit-client.mjs').KitApi, formId: string|number, dryRun?: boolean, log?: (line: string) => void}} options
 */
export async function tagSources({ api, formId, dryRun = true, log = () => {} }) {
  const summary = {
    confirmed: 0, unconfirmedSkipped: 0,
    bySource: Object.fromEntries([...ALLOWED_SOURCES, 'unattributed'].map(s => [`src-${s}`, 0])),
    tagged: 0, alreadyTagged: 0,
  };
  const tags = new Map((await api.listTags()).map(t => [t.name, t]));
  const cursors = new Set();
  let after;
  do {
    const page = await api.listFormSubscribers({ formId, after });
    if (!page || !Array.isArray(page.subscribers) || typeof page.pagination?.has_next_page !== 'boolean' ||
        !('end_cursor' in page.pagination) ||
        (page.pagination.end_cursor !== null && typeof page.pagination.end_cursor !== 'string') ||
        page.subscribers.some(s => !s || !['number', 'string'].includes(typeof s.id) || typeof s.email_address !== 'string' || typeof s.state !== 'string')) {
      throw new Error('Malformed subscriber page');
    }
    const { has_next_page: hasNext, end_cursor: cursor } = page.pagination;
    if (hasNext && (!cursor || cursors.has(cursor))) throw new Error('Malformed subscriber pagination');
    for (const subscriber of page.subscribers) {
      if (subscriber.state !== 'active') { summary.unconfirmedSkipped++; continue; }
      summary.confirmed++;
      const source = sourceTagFor(subscriber.referrer_utm_parameters);
      summary.bySource[source]++;
      const desired = [source, campaignTagFor(subscriber.referrer_utm_parameters)].filter(Boolean);
      const existing = await api.listSubscriberTags(subscriber.id);
      for (const name of desired) {
        if (existing.some(t => t.name === name || String(t.id) === String(tags.get(name)?.id))) {
          summary.alreadyTagged++;
          continue;
        }
        // Log only the id; campaign values and provider responses are never logged.
        log(`${dryRun ? 'Would tag' : 'Tagging'} subscriber ${String(subscriber.id).replace(/[^a-zA-Z0-9_-]/g, '')}`);
        if (dryRun) continue;
        if (!tags.has(name)) tags.set(name, await api.createTag(name));
        await api.tagSubscriberByEmail(tags.get(name).id, subscriber.email_address);
        summary.tagged++;
      }
    }
    if (!hasNext) break;
    cursors.add(cursor);
    after = cursor;
  } while (true);
  return summary;
}
