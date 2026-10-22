import { VERDICTS, type Guide } from './types';
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

const texts = (v: unknown, min = 1): boolean => Array.isArray(v) && v.length >= min && v.every(text);
const link = (v: unknown): boolean => record(v) && text(v.label) && url(v.url);
const links = (v: unknown): boolean => Array.isArray(v) && v.length > 0 && v.every(link);

/** R7: every anchor-brief section 4 block must be present and well-formed. Returns the bad block names. */
export function validateGuide(value: unknown): string[] {
  const g = record(value) ? value : {};
  const errors: string[] = [];
  for (const key of ['title', 'summary', 'illustrationNote']) if (!text(g[key])) errors.push(key);
  if (!text(g.slug) || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(g.slug)) errors.push('slug');
  if (!date(g.lastTestedOn)) errors.push('lastTestedOn');
  if (g.lastTestedNote !== undefined && !text(g.lastTestedNote)) errors.push('lastTestedNote');
  const why = g.whyAiGoesWrong;
  if (!record(why) || !texts(why.intro) || !texts(why.outro, 0) || !Array.isArray(why.mistakes) || !why.mistakes.length ||
      why.mistakes.some(m => !record(m) || !text(m.term) || !text(m.text))) errors.push('whyAiGoesWrong');
  if (!text(g.promptIntro) || !text(g.prompt) || !texts(g.promptNotes, 0)) errors.push('prompt');
  if (!texts(g.claimCheckIntro, 0) || !texts(g.claimCheckNotes, 0) || !Array.isArray(g.claimChecks) || g.claimChecks.length !== 5 ||
      g.claimChecks.some(c => !record(c) || !text(c.claim) || !text(c.whatTheSourceSays) || !(VERDICTS as readonly unknown[]).includes(c.verdict) || !links(c.where))) errors.push('claimChecks');
  if (!Array.isArray(g.howToCheck) || !g.howToCheck.length || g.howToCheck.some(s => !record(s) || !text(s.step) || !text(s.text))) errors.push('howToCheck');
  const f = g.howThisFails;
  if (!record(f) || !texts(f.intro) || !text(f.prompt) || !text(f.answerIntro) || !texts(f.aiAnswer) || !texts(f.outro, 0) ||
      !Array.isArray(f.findings) || !f.findings.length || f.findings.some(r => !record(r) || !text(r.finding) || !text(r.check) || !links(r.where))) errors.push('howThisFails');
  if (!texts(g.needsAHuman)) errors.push('needsAHuman');
  if (!record(g.optIn) || !text(g.optIn.heading) || !texts(g.optIn.body, 0) || !text(g.optIn.consent)) errors.push('optIn');
  if (g.defaultCampaign !== undefined && (!text(g.defaultCampaign) || !CAMPAIGN_TAGS.includes(g.defaultCampaign))) errors.push('defaultCampaign');
  if (!Array.isArray(g.sources) || !g.sources.length || g.sources.some(s => !record(s) || !text(s.title) || !link(s.link))) errors.push('sources');
  if (!text(g.toolsPricesIntro) || !texts(g.toolsNotes, 0) || !Array.isArray(g.toolsPrices) || !g.toolsPrices.length ||
      g.toolsPrices.some(p => !record(p) || !text(p.name) || typeof p.aud !== 'number' || !Number.isFinite(p.aud) || p.aud < 0 || !date(p.checkedOn) || (p.source !== undefined && !link(p.source)))) errors.push('toolsPrices');
  if (g.demoDisclaimer !== true) errors.push('demoDisclaimer');
  if (g.placeholderNotice !== undefined && !text(g.placeholderNotice)) errors.push('placeholderNotice');
  return errors;
}

export function assertValidGuide(g: unknown): asserts g is Guide {
  const errors = validateGuide(g);
  if (errors.length) throw new Error(`Invalid guide blocks: ${errors.join(', ')}`);
}
