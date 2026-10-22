import type { Guide } from './types';
import { GUIDE_DEFAULT_CAMPAIGNS } from '@/lib/attribution/source-tags.mjs';

export const guides: Guide[] = [{
  placeholderNotice: 'PLACEHOLDER COPY: final anchor #1 copy from the CPO is pending. All text, dates, prices and sources are a layout preview, not editorial research.',
  title: '[Placeholder] Preview: AI research checklist',
  slug: 'preview-ai-research-checklist',
  summary: '[Placeholder] Preview content - final anchor #1 copy from CPO pending',
  whyAiGoesWrong: ['[Placeholder] A summary can omit qualifications or invent details. Replace with the tested explanation.'],
  prompt: '[Placeholder] Summarise the supplied example document. Quote each claim and give its exact page and line. Mark anything uncertain.',
  claimChecks: [
    { claim: '[Placeholder] Example count is 12.', whatTheSourceSays: '[Placeholder] Illustrative count: 12.', verdict: 'supported', sourceUrl: 'https://example.com/document#page=3', sourceLocator: '[Placeholder] p. 3, line 12' },
    { claim: '[Placeholder] Example count is 20.', whatTheSourceSays: '[Placeholder] Illustrative count: 12.', verdict: 'not-supported', sourceUrl: 'https://example.com/document#page=3', sourceLocator: '[Placeholder] p. 3, line 12' },
    { claim: '[Placeholder] The example applies everywhere.', whatTheSourceSays: '[Placeholder] Applies to one illustrative sample only.', verdict: 'partly', sourceUrl: 'https://example.com/document#page=4', sourceLocator: '[Placeholder] p. 4, line 2' },
    { claim: '[Placeholder] Example period is one month.', whatTheSourceSays: '[Placeholder] Illustrative period: one month.', verdict: 'supported', sourceUrl: 'https://example.com/document#page=4', sourceLocator: '[Placeholder] p. 4, line 5' },
    { claim: '[Placeholder] Example has no limitations.', whatTheSourceSays: '[Placeholder] Sample limitations are listed.', verdict: 'not-supported', sourceUrl: 'https://example.com/document#page=5', sourceLocator: '[Placeholder] p. 5, line 1' },
  ],
  howThisFails: { aiSaid: '[Placeholder] Example count is 20. Replace with one real caught error.', sourceSays: '[Placeholder] Illustrative count is 12. Replace with the exact source evidence.', sourceUrl: 'https://example.com/document#page=3' },
  needsAHuman: ['[Placeholder] A person still needs to inspect context, source quality and uncertainty.'],
  optIn: { heading: '[Placeholder] Get the research checklist' },
  defaultCampaign: GUIDE_DEFAULT_CAMPAIGNS['/guides/preview-ai-research-checklist'],
  sources: [{ title: '[Placeholder] Example document', url: 'https://example.com/document' }],
  lastTestedOn: '2026-10-19',
  toolsPrices: [{ name: '[Placeholder] Illustrative tool, not a real product price', aud: 12, checkedOn: '2026-10-19', source: 'https://example.com/preview-price' }],
  demoDisclaimer: true,
}];
