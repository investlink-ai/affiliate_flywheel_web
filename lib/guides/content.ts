// Anchor #1 final copy: CPO (Q-38, 22 Oct 2026, cpo/anchor-1-copy 315cf89 + CIO nits a43dbe6).
// Canonical copy: content/anchor-1/anchor-1-guide.md. Keep this file in step with it.
// Prose fields allow **bold** and [label](https://...) only (components/guide/RichText.tsx).
import type { Guide } from './types';

const RELEASE = 'https://announcements.asx.com.au/asxpdf/20260827/pdf/0738z7fxb48k84.pdf';
const page = (n: number) => ({ label: `Page ${n}`, url: `${RELEASE}#page=${n}` });

export const guides: Guide[] = [{
  title: 'Check an AI company summary against the original announcement',
  slug: 'preview-ai-research-checklist',
  summary: "In 15 minutes, check whether an AI summary of a company's results is actually supported by the company's own announcement.",
  illustrationNote: '**Illustration only:** This guide uses Wesfarmers’ 2026 full-year results to show a checking process. We picked it because it is a large, well-known ASX-listed company with a recent results release. It is not a view on Wesfarmers or its shares, and nothing here suggests you buy, sell or hold anything.',
  whyAiGoesWrong: {
    intro: ['AI assistants write fluent, confident text, but fluent is not the same as correct. Three mistakes come up again and again:'],
    mistakes: [
      { term: 'Made-up numbers.', text: 'The figure looks precise but is not in the company’s documents.' },
      { term: 'Wrong period.', text: 'The number is real but belongs to an earlier year. A financial year is a company’s reporting year; for Wesfarmers it ends on 30 June.' },
      { term: 'Missing outlook.', text: 'The summary skips what the company says about the year ahead, which is often an important part of the release.' },
    ],
    outro: ['An answer can also mix two true figures that measure different things. The fix is the same every time: treat each statement as a claim, and check it against the company’s own announcement, not another website’s write-up.'],
  },
  promptIntro: 'We gave the assistant this prompt:',
  prompt: 'Summarise the attached full-year results announcement for an everyday investor. Give me exactly 5 bullet points. Each bullet must state one specific fact (a number, a time period or an outlook statement) and the page it comes from. Do not tell me whether to buy, sell or hold.',
  promptNotes: [
    'We attached the results release as a text file converted from the PDF.',
    'The assistant was OpenAI’s Codex, model gpt-6-astra, a coding assistant used here as a stand-in for a general chat assistant. This was tested on 22 October 2026. Free plans use a lighter model, so your answer may differ.',
  ],
  claimCheckIntro: ['We checked each bullet against the release. NPAT means net profit after tax.'],
  claimChecks: [
    {
      claim: 'Wesfarmers’ revenue rose 3.4% to $47.274 billion for the year ended 30 June 2026 (page 1).',
      verdict: 'Supported', where: [page(1)],
      whatTheSourceSays: 'The highlights table gives revenue of $47,274 million compared with $45,700 million, up 3.4%, for the year ended 30 June 2026.',
    },
    {
      claim: 'Reported net profit after tax fell 1.8% to $2.874 billion (page 1).',
      verdict: 'Supported', where: [page(1)],
      whatTheSourceSays: 'The table reports net profit after tax of $2,874 million against $2,926 million, a decrease of 1.8%. The release calls the $2,874 million figure statutory NPAT (the profit as reported under accounting rules).',
    },
    {
      claim: 'Net profit after tax increased 8.3% when excluding the previous year’s significant one-off items (page 1).',
      verdict: 'Supported', where: [page(1)],
      whatTheSourceSays: 'The release says NPAT increased 8.3% excluding significant items in the prior period. Here, “significant items” means the prior-period items the release excludes from that comparison; they totalled $279 million before tax ($273 million after tax).',
    },
    {
      claim: 'Operating cash flow fell 6.5% to $4.272 billion, reflecting additional investment in inventory and other working capital in WesCEF and Health (pages 1–2).',
      verdict: 'Supported', where: [page(1), page(2)],
      whatTheSourceSays: 'The table gives operating cash flows of $4,272 million and $4,568 million, down 6.5%. Page 2 attributes the decrease to deliberate investment in working capital (money tied up in day-to-day operations, such as stock on hand) in WesCEF and Health.',
    },
    {
      claim: 'Fully franked ordinary dividends for the full year totalled $2.22 per share, up 7.8% (page 2).',
      verdict: 'Supported', where: [page(2)],
      whatTheSourceSays: 'The release says the final dividend was $1.20 per share, bringing fully franked ordinary dividends for the year to $2.22 per share, an increase of 7.8%. “Fully franked” means the dividend carries franking credits for Australian tax already paid by the company.',
    },
  ],
  howToCheck: [
    { step: 'Find the page.', text: 'Use the page reference in the summary to open that exact page in the original release.' },
    { step: 'Find the exact line.', text: 'Look for the matching label and wording in the table or paragraph. Do not rely on a similar-looking figure elsewhere.' },
    { step: 'Check the number and the period.', text: 'Confirm both the amount or percentage and the reporting period beside it.' },
  ],
  claimCheckNotes: [
    'Mark each claim **Supported** (the release says it), **Unsupported** (the release says something different) or **Not found** (you can’t find it in the release). In this run, all five page references were also correct, which is worth checking too: a right number with a wrong page reference is a warning sign.',
    `This was a near miss: none of the five claims was false, but the answer was incomplete. It left out the outlook, including its expectation of net capital expenditure (spending on stores, equipment and other long-term assets) of $1,300 million to $1,500 million for the year ending 30 June 2027 ([page 3](${RELEASE}#page=3)), and the $1.50 per share capital management distribution paid in December 2025 ([page 2](${RELEASE}#page=2)). “Outlook” or “guidance” means the company’s statements about expected future conditions or plans. Claims 2 and 3 point in opposite directions because they use different comparisons: reported NPAT fell 1.8%, while NPAT excluding the prior year’s significant items rose 8.3%.`,
  ],
  howThisFails: {
    intro: ['We made a second run with a different prompt and no attachment. The assistant was asked to answer from memory, without a web search:'],
    prompt: "What were Wesfarmers' latest full-year results? Give me exactly 5 bullet points, each with one specific number and the period it covers. Do not tell me whether to buy, sell or hold.",
    answerIntro: 'The answer was:',
    aiAnswer: [
      'I can’t verify the latest results from memory. Historical revenue for the year ended June 2023 was A$43.55 billion.',
      'Net profit after tax for the year ended June 2023 was A$2.465 billion.',
      'Bunnings revenue for the year ended June 2023 was A$18.539 billion.',
      'Kmart Group revenue for the year ended June 2023 was A$10.282 billion.',
      'Total dividends for the year ended June 2023 were A$1.91 per share.',
    ],
    findings: [
      { finding: 'Wrong period', check: 'The prompt asked for the latest full-year results, but the answer gave figures for the year ended June 2023. The FY2026 release covers the year ended 30 June 2026.', where: [page(24)] },
      { finding: 'Kmart Group number does not match', check: 'The answer says A$10.282 billion for the year ended June 2023. The company’s own table shows $10,635 million for Kmart Group in 2023.', where: [page(25)] },
    ],
    outro: ['The other cited 2023 figures match the historical columns, but they do not answer a question about the latest results. We have not traced where the $10.282 billion figure came from. Notice that the answer did include a one-line caveat, but the bullets still read like current facts. The lesson is simple: give the assistant the document, and always check the period.'],
  },
  needsAHuman: ['A checked summary is a starting point, not a conclusion. Checking a number does not explain the business context, and an assistant cannot tell you what matters to you. You still need to read the full outlook, consider how figures compare with prior periods or peers for yourself, and decide how any information relates to your own circumstances and objectives. This guide is general information, not advice. Consider speaking to a licensed adviser.'],
  optIn: {
    heading: 'Get the 1-page AI answer check',
    body: [
      'Use the checklist to check the source, period, numbers and missing context in an AI summary.',
      'Keep it beside the original company announcement when you review an answer.',
    ],
    consent: "We'll email you the 1-page AI answer check and occasional InvestLink emails. Unsubscribe any time.",
  },
  defaultCampaign: 'cmp-anchor-1',
  sources: [
    { title: 'Wesfarmers, “2026 Full-year results”, ASX announcement, 27 August 2026', link: { label: 'ASX PDF', url: RELEASE } },
    { title: 'Wesfarmers, “2026 Full-year results”, company site copy', link: { label: 'PDF', url: 'https://www.wesfarmers.com.au/docs/default-source/asx-announcements/2026-full-year-results-20260826214539.pdf?sfvrsn=5483afbb_0' } },
  ],
  lastTestedOn: '2026-10-22',
  lastTestedNote: "At that date, the FY2026 results (year ended 30 June 2026) were Wesfarmers' latest full-year results. Later updates, such as its annual general meeting, may add new commentary that this guide does not cover.",
  toolsPricesIntro: 'Checked on 22 October 2026. Prices below are in Australian dollars (AUD).',
  toolsPrices: [
    { name: 'OpenAI Codex, included with limits in the ChatGPT Free plan', aud: 0, checkedOn: '2026-10-22', source: { label: 'Pricing', url: 'https://chatgpt.com/en-AU/codex/pricing/' } },
    { name: 'ASX announcements search', aud: 0, checkedOn: '2026-10-22', source: { label: 'Wesfarmers announcements', url: 'https://www.asx.com.au/markets/trade-our-cash-market/announcements.wes' } },
    { name: 'A free PDF reader', aud: 0, checkedOn: '2026-10-22' },
  ],
  toolsNotes: ['A free plan has usage limits and uses a lighter model. Our test used a stronger model than the free plan offers (see section 2).'],
  demoDisclaimer: true,
}];
