import { describe, expect, it, vi } from 'vitest';
import { readFileSync } from 'node:fs';
import { createMockKitApi, createHttpKitApi } from '../lib/attribution/kit-client.mjs';
import { tagReport } from '../lib/attribution/tag-report.mjs';
import {
  TAG_LIST, TAG_NAME_RE, NO_CAMPAIGN, UNATTRIBUTED_SOURCE, SOURCE_TAGS, CAMPAIGN_TAGS,
  sourceTagFor, campaignTagFor, signupTagsForUrl, kitTagFields, tagListProblems,
} from '../lib/attribution/source-tags.mjs';

const GUIDE = 'https://investlink.ai/guides/preview-ai-research-checklist';
const LIST_WITH_IDS = {
  sources: Object.fromEntries(SOURCE_TAGS.map((t, i) => [t, String(100 + i)])),
  campaigns: Object.fromEntries(CAMPAIGN_TAGS.map((t, i) => [t, String(200 + i)])),
};
const idOf = (name) => LIST_WITH_IDS.sources[name] ?? LIST_WITH_IDS.campaigns[name];

describe('R1 rule: tags are lowercase kebab-case from the committed list', () => {
  it('the committed list is valid and spec channels are all present', () => {
    expect(tagListProblems()).toEqual([]);
    for (const name of [...SOURCE_TAGS, ...CAMPAIGN_TAGS]) expect(name).toMatch(TAG_NAME_RE);
    expect(SOURCE_TAGS).toEqual(expect.arrayContaining(
      ['x', 'youtube', 'newsletter', 'newsletter-xpromo', 'organic', 'direct'].map((s) => `src-${s}`)));
    expect(SOURCE_TAGS).toContain(UNATTRIBUTED_SOURCE);
    expect(Object.isFrozen(TAG_LIST.sources) && Object.isFrozen(TAG_LIST.campaigns)).toBe(true);
  });
  it('rejects bad names, cmp-none as a tag, bad or duplicate IDs, and missing IDs when required', () => {
    expect(tagListProblems({ sources: { 'src-X': null, 'src-unattributed': null }, campaigns: {} })).toHaveLength(1);
    expect(tagListProblems({ sources: { 'src-a_b': null, 'src-unattributed': null }, campaigns: {} })).toHaveLength(1);
    expect(tagListProblems({ sources: { 'cmp-x': null, 'src-unattributed': null }, campaigns: {} })).toHaveLength(1);
    expect(tagListProblems({ sources: { 'src-unattributed': null }, campaigns: { [NO_CAMPAIGN]: null } })).toHaveLength(1);
    expect(tagListProblems({ sources: { 'src-unattributed': '01' }, campaigns: {} })).toHaveLength(1);
    expect(tagListProblems({ sources: { 'src-unattributed': '5', 'src-x': '5' }, campaigns: {} })).toHaveLength(1);
    expect(tagListProblems({ sources: { 'src-x': null }, campaigns: {} })).toHaveLength(1);
    expect(tagListProblems(undefined, { requireIds: true }).length).toBeGreaterThan(0); // IDs pending F5
    expect(tagListProblems(LIST_WITH_IDS, { requireIds: true })).toEqual([]);
  });
  it('never invents a tag: unlisted or non-kebab utm values do not become tags', () => {
    expect(sourceTagFor({ source: 'tiktok' })).toBe(UNATTRIBUTED_SOURCE);
    expect(sourceTagFor({ source: 'you tube' })).toBe(UNATTRIBUTED_SOURCE);
    expect(campaignTagFor({ campaign: 'Launch / Preview!' })).toBeNull();
    expect(campaignTagFor({ campaign: 'not-in-list' })).toBeNull();
    expect(campaignTagFor({ campaign: ' I3-PREVIEW ' })).toBe('cmp-i3-preview');
  });
});

describe('R1 rule: exactly one src-* and at most one cmp-* per signup', () => {
  it.each([
    ['?utm_source=x&utm_campaign=i3-preview', 'src-x', 'cmp-i3-preview'],
    ['?utm_source=YouTube', 'src-youtube', null],
    ['?utm_source=newsletter-xpromo&utm_campaign=unknown', 'src-newsletter-xpromo', null],
    ['', UNATTRIBUTED_SOURCE, null],
    ['?utm_source=mystery&utm_campaign=i3-preview', UNATTRIBUTED_SOURCE, 'cmp-i3-preview'],
    ['?utm_source=x&utm_source=youtube&utm_campaign=i3-preview&utm_campaign=preview-ai-research-checklist', 'src-x', 'cmp-i3-preview'],
  ])('%s -> %s / %s', (query, source, campaign) => {
    expect(signupTagsForUrl(GUIDE + query)).toEqual({ source, campaign });
    const fields = kitTagFields(GUIDE + query, LIST_WITH_IDS);
    expect(fields.every(([name]) => name === 'tags[]')).toBe(true);
    expect(fields.map(([, v]) => v)).toEqual([idOf(source), ...(campaign ? [idOf(campaign)] : [])]);
  });
  it('a malformed page URL still yields exactly one source tag', () => {
    expect(signupTagsForUrl('not a url')).toEqual({ source: UNATTRIBUTED_SOURCE, campaign: null });
  });
  it('refuses (null) rather than send a signup without its tag IDs', () => {
    expect(kitTagFields(`${GUIDE}?utm_source=x`)).toBeNull(); // committed IDs are still null
    expect(kitTagFields(`${GUIDE}?utm_source=x&utm_campaign=i3-preview`,
      { ...LIST_WITH_IDS, campaigns: { 'cmp-i3-preview': null } })).toBeNull();
  });
});

describe('R1 rule: no cmp-* tag counts as cmp-none', () => {
  it('cmp-none is a reporting bucket, never a tag', () => {
    expect(CAMPAIGN_TAGS).not.toContain(NO_CAMPAIGN);
    expect(campaignTagFor({ campaign: 'none' })).toBeNull();
  });
});

const subscriber = (id, utm, overrides = {}) => ({
  id, email_address: `reader${id}@example.com`, state: 'active', created_at: '2026-10-21T04:00:00Z',
  referrer: GUIDE, referrer_utm_parameters: utm, ...overrides,
});
const tag = (name, taggedAt = '2026-10-21T04:00:05Z') => ({ id: idOf(name), name, tagged_at: taggedAt });
const page = (subscribers, cursor = null) => ({ subscribers, pagination: { has_next_page: !!cursor, end_cursor: cursor } });

describe('read-only tag report (replaces the old post-confirm tagging script)', () => {
  it('counts by source and campaign (cmp-none included) over all pages, with no writes', async () => {
    const api = createMockKitApi({
      pages: [
        page([subscriber(1, { source: 'x', campaign: 'i3-preview' }), subscriber(2, { source: 'youtube', campaign: 'i3-preview' })], 'p2'),
        page([subscriber(3, { source: 'newsletter' }), subscriber(4, {}), subscriber(5, { source: 'x' }, { state: 'inactive' })]),
      ],
      subscriberTags: {
        1: [tag('src-x'), tag('cmp-i3-preview')],
        2: [tag('src-youtube'), tag('cmp-i3-preview')],
        3: [tag('src-newsletter')],
        4: [tag('src-unattributed')],
      },
    });
    const report = await tagReport({ api, formId: '123' });
    expect(report).toMatchObject({ ok: true, confirmed: 4, unconfirmedSkipped: 1, violations: [], warnings: [] });
    expect(report.bySource).toMatchObject({ 'src-x': 1, 'src-youtube': 1, 'src-newsletter': 1, 'src-unattributed': 1 });
    expect(report.byCampaign).toMatchObject({ 'cmp-i3-preview': 2, 'cmp-none': 2 });
    expect(api.calls.map((c) => c.method)).toEqual(expect.not.arrayContaining(['createTag', 'tagSubscriberByEmail']));
    expect(api.calls.filter((c) => c.method === 'listFormSubscribers').map((c) => c.after)).toEqual([undefined, 'p2']);
    expect(api.calls.some((c) => c.method === 'listSubscriberTags' && c.id === 5)).toBe(false);
    expect(JSON.stringify(report)).not.toContain('@');
  });
  it.each([
    ['no src tag', [tag('cmp-i3-preview')], { source: 'x', campaign: 'i3-preview' }, /exactly one src-\* tag, found 0/],
    ['two src tags', [tag('src-x'), tag('src-youtube')], { source: 'x' }, /exactly one src-\* tag, found 2/],
    ['two cmp tags', [tag('src-x'), tag('cmp-i3-preview'), tag('cmp-preview-ai-research-checklist')], { source: 'x', campaign: 'i3-preview' }, /at most one cmp-\* tag/],
    ['unlisted tag', [tag('src-x'), { id: 9, name: 'cmp-Launch' }], { source: 'x' }, /unlisted tag/],
    ['tag changed by hand', [tag('src-youtube')], { source: 'x' }, /differ from what the form sets/],
    ['tag added long after signup', [tag('src-x', '2026-10-25T00:00:00Z')], { source: 'x' }, /applied more than 24h after signup/],
  ])('flags %s', async (_label, tags, utm, rule) => {
    const api = createMockKitApi({ subscribers: [subscriber(7, utm)], subscriberTags: { 7: tags } });
    const report = await tagReport({ api, formId: '123' });
    expect(report.ok).toBe(false);
    expect(report.violations.map((v) => v.rule)).toEqual(expect.arrayContaining([expect.stringMatching(rule)]));
    expect(report.violations.every((v) => v.subscriber === '7')).toBe(true);
  });
  it('only warns on a mismatch when Kit stored no UTMs (Kit UTM capture is unverified)', async () => {
    const api = createMockKitApi({ subscribers: [subscriber(8, undefined)], subscriberTags: { 8: [tag('src-x')] } });
    const report = await tagReport({ api, formId: '123' });
    expect(report).toMatchObject({ ok: true, violations: [] });
    expect(report.warnings).toHaveLength(1);
  });
  it.each([
    undefined, {}, { subscribers: [], pagination: {} },
    { subscribers: null, pagination: { has_next_page: false, end_cursor: null } },
    { subscribers: [{}], pagination: { has_next_page: false, end_cursor: null } },
    { subscribers: [], pagination: { has_next_page: true, end_cursor: null } },
  ])('rejects malformed page %j', async (malformed) => {
    const api = createMockKitApi();
    api.listFormSubscribers = async () => malformed;
    await expect(tagReport({ api, formId: '123' })).rejects.toThrow(/Malformed/);
  });
  it('rejects repeated cursors', async () => {
    const api = createMockKitApi();
    api.listFormSubscribers = async () => page([], 'repeated');
    await expect(tagReport({ api, formId: '123' })).rejects.toThrow(/pagination/);
  });
});

describe('Kit HTTP client is read-only', () => {
  it('exposes no write methods and sends only GET requests', async () => {
    const responses = [page([], null), { tags: [] }, { tags: [{ id: 3, name: 'src-x' }] }];
    const fetchImpl = vi.fn(async () => ({ ok: true, json: async () => responses.shift() }));
    const api = createHttpKitApi({ apiKey: 'test-placeholder', fetchImpl });
    expect(Object.keys(api).sort()).toEqual(['listFormSubscribers', 'listSubscriberTags', 'listTags']);
    await api.listFormSubscribers({ formId: '123', after: 'a b' });
    await api.listTags();
    expect(await api.listSubscriberTags(1)).toEqual([{ id: 3, name: 'src-x' }]);
    const calls = fetchImpl.mock.calls;
    expect(calls.every(([, init]) => init.method === 'GET' && !('body' in init))).toBe(true);
    expect(calls[0][0]).toBe('https://api.kit.com/v4/forms/123/subscribers?status=all&after=a%20b');
    expect(calls[0][1].headers['X-Kit-Api-Key']).toBe('test-placeholder');
    expect(calls[2][0]).toBe('https://api.kit.com/v4/subscribers/1/tags');
  });
  it('does not expose sensitive provider error bodies', async () => {
    const api = createHttpKitApi({ apiKey: 'test-placeholder', fetchImpl: async () => ({ ok: false, status: 401 }) });
    await expect(api.listTags()).rejects.toThrow('Kit request failed (401)');
  });
  it('nothing in lib/ or scripts/ calls a Kit write endpoint', () => {
    for (const p of ['lib/attribution/kit-client.mjs', 'lib/attribution/tag-report.mjs', 'scripts/kit-tag-report.mjs']) {
      expect(readFileSync(p, 'utf8')).not.toMatch(/'POST'|"POST"|method:\s*'(PUT|PATCH|DELETE)'|tagSubscriber|createTag/);
    }
  });
});
