import type { Guide } from '@/lib/guides/types';
import { OptInForm } from '@/components/OptInForm';
import { DemoDisclaimer } from './DemoDisclaimer';

export const formatAud = (aud: number): string => `A$${aud.toFixed(2)}`;

export function GuideTemplate({ guide }: { guide: Guide }) {
  return (
    <article className="mx-auto max-w-3xl space-y-8 px-6 py-12 text-slate-800 dark:text-slate-200">
      {guide.placeholderNotice && <p role="note" data-block="placeholder-notice" className="rounded border-2 border-amber-500 bg-amber-50 p-4 font-semibold text-amber-900">{guide.placeholderNotice}</p>}
      <header className="space-y-4"><h1 className="text-3xl font-bold">{guide.title}</h1><p>{guide.summary}</p></header>
      <DemoDisclaimer />
      <section data-block="why-ai-goes-wrong"><h2>Why AI summaries go wrong</h2>{guide.whyAiGoesWrong.map((p, i) => <p key={i}>{p}</p>)}</section>
      <section data-block="prompt"><h2>Prompt used</h2><pre className="whitespace-pre-wrap">{guide.prompt}</pre></section>
      <section data-block="claim-checks"><h2>Five claims checked</h2><div className="overflow-x-auto"><table><thead><tr>{['Claim', 'What the source says', 'Verdict', 'Exact source'].map(h => <th scope="col" key={h}>{h}</th>)}</tr></thead><tbody>{guide.claimChecks.map((c, i) => <tr key={i}><td>{c.claim}</td><td>{c.whatTheSourceSays}</td><td>{c.verdict}</td><td><a href={c.sourceUrl} className="underline">{c.sourceLocator}</a></td></tr>)}</tbody></table></div></section>
      <section data-block="how-this-fails"><h2>How this fails</h2><p>AI said: {guide.howThisFails.aiSaid}</p><p>Source says: {guide.howThisFails.sourceSays}</p><a href={guide.howThisFails.sourceUrl} className="underline">Source evidence</a></section>
      <section data-block="needs-a-human"><h2>What still needs a human</h2>{guide.needsAHuman.map((p, i) => <p key={i}>{p}</p>)}</section>
      <section data-block="opt-in"><h2>{guide.optIn.heading}</h2><OptInForm defaultCampaign={guide.defaultCampaign} /></section>
      <section data-block="sources"><h2>Sources</h2><ul>{guide.sources.map(s => <li key={s.url}><a href={s.url} className="underline">{s.title}</a></li>)}</ul></section>
      <section data-block="last-tested"><h2>Last tested on</h2><time dateTime={guide.lastTestedOn}>{guide.lastTestedOn}</time></section>
      <section data-block="tools-prices"><h2>Tools used and prices</h2><ul>{guide.toolsPrices.map((p, i) => <li key={i}>{p.name}: {formatAud(p.aud)} AUD, checked on <time dateTime={p.checkedOn}>{p.checkedOn}</time> (<a href={p.source} className="underline">price source</a>)</li>)}</ul></section>
    </article>
  );
}
