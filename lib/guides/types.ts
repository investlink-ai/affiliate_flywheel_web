export interface Guide {
  title: string;
  slug: string;
  summary: string;
  whyAiGoesWrong: string[];
  prompt: string;
  claimChecks: { claim: string; whatTheSourceSays: string; verdict: 'supported' | 'not-supported' | 'partly'; sourceUrl: string; sourceLocator: string }[];
  howThisFails: { aiSaid: string; sourceSays: string; sourceUrl: string };
  needsAHuman: string[];
  optIn: { heading: string };
  defaultCampaign?: string;
  sources: { title: string; url: string }[];
  lastTestedOn: string;
  toolsPrices: { name: string; aud: number; checkedOn: string; source: string }[];
  demoDisclaimer: true;
  placeholderNotice?: string;
}
