import { describe, expect, it, vi } from 'vitest';
import { createMockKitApi, createHttpKitApi } from '../lib/attribution/kit-client.mjs';
import { tagSources } from '../lib/attribution/tag-sources.mjs';
import { sourceTagFor, campaignTagFor } from '../lib/attribution/source-tags.mjs';

const subscriber = (id, source, overrides = {}) => ({
  id, email_address: `reader${id}@example.com`, state: 'active', created_at: '2026-10-19',
  referrer: 'https://example.com', referrer_utm_parameters: { source }, ...overrides,
});
const page = (subscribers, cursor = null) => ({ subscribers, pagination: { has_next_page: !!cursor, end_cursor: cursor } });

describe('source and campaign normalization', () => {
  it.each(['x', 'youtube', 'newsletter', 'newsletter-xpromo', 'organic', 'direct'])('allows %s case-insensitively', source => {
    expect(sourceTagFor({ source: ` ${source.toUpperCase()} ` })).toBe(`src-${source}`);
  });
  it.each([undefined, {}, { source: '' }, { source: 'unknown' }])('uses unattributed for %j', utm => {
    expect(sourceTagFor(utm)).toBe('src-unattributed');
  });
  it('cleans campaign names, limits the slug to 50 characters, and omits empty names', () => {
    expect(campaignTagFor({ campaign: ' Launch / Preview! ' })).toBe('cmp-launch-preview');
    expect(campaignTagFor({ campaign: 'A'.repeat(100) })).toBe(`cmp-${'a'.repeat(50)}`);
    expect(campaignTagFor({ campaign: '!!!' })).toBeNull();
    expect(campaignTagFor()).toBeNull();
  });
});

it('tags confirmed signups over three pages and is idempotent without logging emails', async () => {
  const api = createMockKitApi({ pages: [
    page([subscriber(1, 'x'), subscriber(2, 'youtube')], 'page-2'),
    page([subscriber(3, 'newsletter', { referrer_utm_parameters: { source: 'newsletter', campaign: 'Launch Preview' } }), subscriber(4, undefined)], 'page-3'),
    page([subscriber(5, 'mystery'), subscriber(6, 'x', { state: 'inactive' })]),
  ] });
  const logs = [];
  const options = { api, formId: '123', dryRun: false, log: line => logs.push(line) };
  const result = await tagSources(options);
  expect(result).toMatchObject({ confirmed: 5, unconfirmedSkipped: 1, tagged: 6, alreadyTagged: 0 });
  expect(result.bySource).toMatchObject({ 'src-x': 1, 'src-youtube': 1, 'src-newsletter': 1, 'src-unattributed': 2 });
  expect(api.subscriberTags.get('1')).toEqual([expect.objectContaining({ name: 'src-x' })]);
  expect(api.subscriberTags.get('2')).toEqual([expect.objectContaining({ name: 'src-youtube' })]);
  expect(api.subscriberTags.get('3').map(t => t.name)).toEqual(['src-newsletter', 'cmp-launch-preview']);
  expect(api.subscriberTags.has('6')).toBe(false);
  expect(api.calls.filter(c => c.method === 'listFormSubscribers').map(c => c.after)).toEqual([undefined, 'page-2', 'page-3']);
  expect(api.calls.filter(c => c.method === 'createTag' && c.name === 'src-unattributed')).toHaveLength(1);
  const second = await tagSources(options);
  expect(second).toMatchObject({ tagged: 0, alreadyTagged: 6 });
  expect(api.calls.filter(c => c.method === 'tagSubscriberByEmail')).toHaveLength(6);
  expect(logs.join('\n')).not.toContain('@');
  expect(logs.every(line => /subscriber \d+$/.test(line))).toBe(true);
});

it('dry-run performs no write calls', async () => {
  const api = createMockKitApi({ subscribers: [subscriber(1, 'x')] });
  const summary = await tagSources({ api, formId: '123' });
  expect(summary).toMatchObject({ confirmed: 1, tagged: 0 });
  expect(api.calls.some(c => ['createTag', 'tagSubscriberByEmail'].includes(c.method))).toBe(false);
});
it.each([
  undefined, {}, { subscribers: [], pagination: {} },
  { subscribers: null, pagination: { has_next_page: false, end_cursor: null } },
  { subscribers: [{}], pagination: { has_next_page: false, end_cursor: null } },
  { subscribers: [], pagination: { has_next_page: true, end_cursor: null } },
])('rejects malformed page %j', async malformed => {
  const api = createMockKitApi();
  api.listFormSubscribers = async () => malformed;
  await expect(tagSources({ api, formId: '123' })).rejects.toThrow(/Malformed/);
});
it('rejects repeated cursors', async () => {
  const api = createMockKitApi();
  api.listFormSubscribers = async () => page([], 'repeated');
  await expect(tagSources({ api, formId: '123' })).rejects.toThrow(/pagination/);
});
it('uses Kit HTTP endpoints, headers and request bodies', async () => {
  const responses = [page([], null), { tags: [] }, { tag: { id: 3, name: 'src-x' } }, {}, { tags: [{ id: 3, name: 'src-x' }] }];
  const fetchImpl = vi.fn(async () => ({ ok: true, json: async () => responses.shift() }));
  const api = createHttpKitApi({ apiKey: 'test-placeholder', fetchImpl });
  await api.listFormSubscribers({ formId: '123', after: 'a b' });
  await api.listTags();
  expect(await api.createTag('src-x')).toEqual({ id: 3, name: 'src-x' });
  await api.tagSubscriberByEmail(3, 'reader@example.com');
  expect(await api.listSubscriberTags(1)).toEqual([{ id: 3, name: 'src-x' }]);
  const calls = fetchImpl.mock.calls;
  expect(calls[0][0]).toBe('https://api.kit.com/v4/forms/123/subscribers?status=all&after=a%20b');
  expect(calls[0][1].headers['X-Kit-Api-Key']).toBe('test-placeholder');
  expect(calls[2][1]).toMatchObject({ method: 'POST', body: JSON.stringify({ name: 'src-x' }) });
  expect(calls[3]).toMatchObject(['https://api.kit.com/v4/tags/3/subscribers', { method: 'POST', body: JSON.stringify({ email_address: 'reader@example.com' }) }]);
  expect(calls[4][0]).toBe('https://api.kit.com/v4/subscribers/1/tags');
});
it('does not expose sensitive provider error bodies', async () => {
  const api = createHttpKitApi({ apiKey: 'test-placeholder', fetchImpl: async () => ({ ok: false, status: 401 }) });
  await expect(api.listTags()).rejects.toThrow('Kit request failed (401)');
});
