import type { Guide } from '@/lib/guides/types';
import { OptInForm } from '@/components/OptInForm';
import { DemoDisclaimer } from './DemoDisclaimer';

export const formatAud = (aud: number): string => `A$${aud.toFixed(2)}`;

export function GuideTemplate({ guide }: { guide: Guide }) {
  return (
    <article className="mx-auto max-w-3xl space-y-8 px-6 py-12 text-slate-800 dark:text-slate-200">
      {guide.placeholderNotice && <p role="note" data-block="placeholder-notice" className="rounded border-2 border-amber-500 bg-amber-50 p-4 font-semibold text-amber-900">{guide.placeholderNotice}</p>}
      <header className="space-y-4"><h1 className="text-3xl font-bold">{guide.title}</h1><p>{guide.summary}</p></header>
      {guide.demoDisclaimer && <DemoDisclaimer />}
      <section data-block="last-tested"><h2 className="text-xl font-semibold">Last tested</h2><time dateTime={guide.lastTestedOn}>{guide.lastTestedOn}</time></section>
      {guide.sections.map(s => <section key={s.heading}><h2 className="text-xl font-semibold">{s.heading}</h2><p>{s.body}</p></section>)}
      <section data-block="prices-checked"><h2 className="text-xl font-semibold">Prices checked</h2><time dateTime={guide.pricesCheckedOn}>{guide.pricesCheckedOn}</time><ul>{guide.prices.map(p => <li key={p.item}>{p.item}: {formatAud(p.aud)} AUD (<a href={p.source} className="underline">source</a>)</li>)}</ul></section>
      <section data-block="sources"><h2 className="text-xl font-semibold">Sources</h2><ul>{guide.sources.map(s => <li key={s.url}><a href={s.url} className="underline">{s.title}</a></li>)}</ul></section>
      <section data-block="how-this-fails"><h2 className="text-xl font-semibold">How this fails</h2><ul>{guide.howThisFails.map(s => <li key={s}>{s}</li>)}</ul></section>
      <section data-block="opt-in"><h2 className="mb-4 text-xl font-semibold">Get the research checklist</h2><OptInForm /></section>
    </article>
  );
}
