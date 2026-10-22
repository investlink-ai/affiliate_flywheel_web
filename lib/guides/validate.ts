import type { Guide } from './types';

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
  for (const key of ['lastTestedOn', 'pricesCheckedOn']) if (!date(g[key])) errors.push(key);
  if (!Array.isArray(g.prices) || !g.prices.length || g.prices.some(p => !record(p) || !text(p.item) || typeof p.aud !== 'number' || !Number.isFinite(p.aud) || p.aud < 0 || !url(p.source))) errors.push('prices');
  if (!Array.isArray(g.sources) || !g.sources.length || g.sources.some(s => !record(s) || !text(s.title) || !url(s.url))) errors.push('sources');
  if (!Array.isArray(g.howThisFails) || !g.howThisFails.length || g.howThisFails.some(s => !text(s))) errors.push('howThisFails');
  // R7: the demo disclaimer block is mandatory, so only `true` passes.
  if (g.demoDisclaimer !== true) errors.push('demoDisclaimer');
  if (!Array.isArray(g.sections) || !g.sections.length || g.sections.some(s => !record(s) || !text(s.heading) || !text(s.body))) errors.push('sections');
  return errors;
}

export function assertValidGuide(g: unknown): asserts g is Guide {
  const errors = validateGuide(g);
  if (errors.length) throw new Error(`Invalid guide blocks: ${errors.join(', ')}`);
}
