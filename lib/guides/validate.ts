import type { Guide } from './types';
import { CAMPAIGN_TAGS } from '@/lib/attribution/source-tags.mjs';

const text = (value: unknown): value is string => typeof value === 'string' && value.trim().length > 0;
function url(value: unknown): boolean {
  if (!text(value)) return false;
  try { return ['https:', 'http:'].includes(new URL(value).protocol); } catch { return false; }
}
function date(value: unknown): boolean {
  return typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value) &&
    Number.isFinite(Date.parse(value)) && new Date(value).toISOString().slice(0, 10) === value;
}
const record = (value: unknown): value is Record<string, unknown> => typeof value === 'object' && value !== null;

export function validateGuide(value: unknown): string[] {
  const g = record(value) ? value : {};
  const errors: string[] = [];
  for (const key of ['title', 'summary']) if (!text(g[key])) errors.push(key);
  if (!text(g.slug) || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(g.slug)) errors.push('slug');
  if (!date(g.lastTestedOn)) errors.push('lastTestedOn');
  for (const key of ['whyAiGoesWrong', 'needsAHuman']) {
    if (!Array.isArray(g[key]) || !g[key].length || g[key].some((p: unknown) => !text(p))) errors.push(key);
  }
  if (!text(g.prompt)) errors.push('prompt');
  if (!Array.isArray(g.claimChecks) || g.claimChecks.length !== 5 || g.claimChecks.some(c => !record(c) || !text(c.claim) || !text(c.whatTheSourceSays) || !text(c.verdict) || !['supported', 'not-supported', 'partly'].includes(c.verdict) || !url(c.sourceUrl) || !text(c.sourceLocator))) errors.push('claimChecks');
  const failure = g.howThisFails;
  if (!record(failure) || !text(failure.aiSaid) || !text(failure.sourceSays) || !url(failure.sourceUrl)) errors.push('howThisFails');
  if (!Array.isArray(g.toolsPrices) || !g.toolsPrices.length || g.toolsPrices.some(p => !record(p) || !text(p.name) || typeof p.aud !== 'number' || !Number.isFinite(p.aud) || p.aud < 0 || !date(p.checkedOn) || !url(p.source))) errors.push('toolsPrices');
  if (!Array.isArray(g.sources) || !g.sources.length || g.sources.some(s => !record(s) || !text(s.title) || !url(s.url))) errors.push('sources');
  if (!record(g.optIn) || !text(g.optIn.heading)) errors.push('optIn');
  if (g.defaultCampaign !== undefined && (!text(g.defaultCampaign) || !CAMPAIGN_TAGS.includes(g.defaultCampaign))) errors.push('defaultCampaign');
  if (g.demoDisclaimer !== true) errors.push('demoDisclaimer');
  if (g.placeholderNotice !== undefined && !text(g.placeholderNotice)) errors.push('placeholderNotice');
  return errors;
}

export function assertValidGuide(g: unknown): asserts g is Guide {
  const errors = validateGuide(g);
  if (errors.length) throw new Error(`Invalid guide blocks: ${errors.join(', ')}`);
}
