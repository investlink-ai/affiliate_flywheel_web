/**
 * @typedef {{id: number|string, email_address: string, state: string, created_at: string, referrer: string, referrer_utm_parameters: {source?: string, medium?: string, campaign?: string, term?: string, content?: string}}} Subscriber
 * @typedef {{id: number|string, name: string, tagged_at?: string}} Tag
 * @typedef {{subscribers: Subscriber[], pagination: {has_next_page: boolean, end_cursor: string|null}}} SubscriberPage
 * @typedef {Object} KitApi
 * @property {(args: {formId: string|number, after?: string}) => Promise<SubscriberPage>} listFormSubscribers
 * @property {() => Promise<Tag[]>} listTags
 * @property {(subscriberId: string|number) => Promise<Tag[]>} listSubscriberTags
 */

/**
 * Read-only Kit v4 client for the attribution report. It can only issue GET
 * requests: tags are applied by the hosted form at subscribe time and nothing in
 * this repo writes tags or subscribers.
 */

/** @returns {KitApi} */
export function createHttpKitApi({ apiKey, fetchImpl = fetch, base = 'https://api.kit.com/v4' }) {
  async function request(path) {
    const response = await fetchImpl(`${base}${path}`, {
      method: 'GET',
      headers: { 'X-Kit-Api-Key': apiKey, Accept: 'application/json' },
    });
    // Do not expose provider bodies, which may contain email addresses or secrets.
    if (!response.ok) throw new Error(`Kit request failed (${response.status})`);
    return response.json();
  }
  return {
    listFormSubscribers: ({ formId, after }) => request(`/forms/${encodeURIComponent(formId)}/subscribers?status=all${after ? `&after=${encodeURIComponent(after)}` : ''}`),
    async listTags() {
      const tags = [];
      let after;
      const seen = new Set();
      do {
        const page = await request(`/tags${after ? `?after=${encodeURIComponent(after)}` : ''}`);
        if (!Array.isArray(page.tags)) throw new Error('Malformed tags page');
        tags.push(...page.tags);
        if (!page.pagination?.has_next_page) return tags;
        after = page.pagination.end_cursor;
        if (!after || seen.has(after)) throw new Error('Malformed tags pagination');
        seen.add(after);
      } while (true);
    },
    async listSubscriberTags(subscriberId) {
      const tags = [];
      let after;
      const seen = new Set();
      do {
        const page = await request(`/subscribers/${encodeURIComponent(subscriberId)}/tags${after ? `?after=${encodeURIComponent(after)}` : ''}`);
        if (!Array.isArray(page.tags)) throw new Error('Malformed subscriber tags page');
        tags.push(...page.tags);
        if (!page.pagination?.has_next_page) return tags;
        after = page.pagination.end_cursor;
        if (!after || seen.has(after)) throw new Error('Malformed subscriber tags pagination');
        seen.add(after);
      } while (true);
    },
  };
}

/** In-memory API; fixture pages can deliberately contain malformed responses. */
export function createMockKitApi(fixture = {}) {
  const pages = structuredClone(fixture.pages ?? [{ subscribers: fixture.subscribers ?? [], pagination: { has_next_page: false, end_cursor: null } }]);
  const tags = structuredClone(fixture.tags ?? []);
  const subscriberTags = new Map(Object.entries(fixture.subscriberTags ?? {}));
  const calls = [];
  return {
    calls, tags, subscriberTags,
    async listFormSubscribers(args) {
      calls.push({ method: 'listFormSubscribers', ...args });
      const formPages = fixture.formPages?.[String(args.formId)] ?? pages;
      const index = args.after ? formPages.findIndex(p => p.pagination?.end_cursor === args.after) + 1 : 0;
      return structuredClone(formPages[index]);
    },
    async listTags() { calls.push({ method: 'listTags' }); return structuredClone(tags); },
    async listSubscriberTags(id) {
      calls.push({ method: 'listSubscriberTags', id });
      return structuredClone(subscriberTags.get(String(id)) ?? []);
    },
  };
}
