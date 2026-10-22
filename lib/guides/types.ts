/** A link shown with its own label, e.g. { label: 'Page 1', url: '...#page=1' }. */
export interface LinkRef { label: string; url: string }

/** Claim verdicts, as defined in the guide and the AI answer check checklist. */
export const VERDICTS = ['Supported', 'Unsupported', 'Not found'] as const;
export type Verdict = (typeof VERDICTS)[number];

/**
 * Anchor guide (anchor-brief section 4). Prose fields are "rich text": plain text that
 * may contain **bold** and [label](https://...) links, rendered by components/guide/RichText.
 */
export interface Guide {
  title: string;
  slug: string;
  summary: string;
  /** Rendered in the mandatory demo-disclaimer block (R7), e.g. "Illustration only: ...". */
  illustrationNote: string;
  /** 1. Why AI summaries go wrong. */
  whyAiGoesWrong: { intro: string[]; mistakes: { term: string; text: string }[]; outro: string[] };
  /** 2. The prompt, shown verbatim in <pre><code>, plus notes on how it was run. */
  promptIntro: string;
  prompt: string;
  promptNotes: string[];
  /** 3. Exactly five claims, each with a verdict and links to the exact page(s). */
  claimCheckIntro: string[];
  claimChecks: { claim: string; verdict: Verdict; where: LinkRef[]; whatTheSourceSays: string }[];
  howToCheck: { step: string; text: string }[];
  claimCheckNotes: string[];
  /** 4. How this fails: one real error caught, shown. */
  howThisFails: {
    intro: string[];
    prompt: string;
    answerIntro: string;
    aiAnswer: string[];
    findings: { finding: string; check: string; where: LinkRef[] }[];
    outro: string[];
  };
  /** 5. What still needs a human. */
  needsAHuman: string[];
  /** 6. Checklist opt-in. */
  optIn: { heading: string; body: string[]; consent: string };
  /** Listed cmp-* key used when the page URL carries no listed utm_campaign. */
  defaultCampaign?: string;
  /** 7. Sources, last tested, tools with checked-on AUD prices. */
  sources: { title: string; link: LinkRef }[];
  lastTestedOn: string;
  /** Shown next to the last-tested date, e.g. what "latest" meant on that date. */
  lastTestedNote?: string;
  toolsPricesIntro: string;
  toolsPrices: { name: string; aud: number; checkedOn: string; source?: LinkRef }[];
  toolsNotes: string[];
  demoDisclaimer: true;
  /** Visible banner while copy is placeholder; omit for final copy. */
  placeholderNotice?: string;
}
