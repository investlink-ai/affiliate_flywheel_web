import type { Guide } from './types';

export const guides: Guide[] = [{
  title: 'Preview: AI research checklist',
  slug: 'preview-ai-research-checklist',
  summary: 'Preview content - final anchor #1 copy from CPO pending',
  lastTestedOn: '2026-10-19',
  pricesCheckedOn: '2026-10-19',
  prices: [{ item: 'Illustrative research budget (placeholder, not a product price)', aud: 12, source: 'https://example.com/preview-price' }],
  sources: [{ title: 'Placeholder source - replace with verified research before publication', url: 'https://example.com/preview-source' }],
  howThisFails: ['AI output can invent facts and omit context. This placeholder checklist has not been validated for investment decisions.'],
  demoDisclaimer: true,
  sections: [{ heading: 'Check each claim against its source', body: 'Preview content - final anchor #1 copy from CPO pending. This demonstrates the guide layout and email confirmation path only. Dates above describe this preview implementation, not completed editorial or price verification.' }],
}];
