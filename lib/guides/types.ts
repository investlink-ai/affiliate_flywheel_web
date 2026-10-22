export interface Guide {
  title: string;
  slug: string;
  summary: string;
  lastTestedOn: string;
  pricesCheckedOn: string;
  prices: { item: string; aud: number; source: string }[];
  sources: { title: string; url: string }[];
  howThisFails: string[];
  demoDisclaimer: true;
  sections: { heading: string; body: string }[];
}
