import type { Guide, LinkRef } from '@/lib/guides/types';
import { OptInForm } from '@/components/OptInForm';
import { DemoDisclaimer } from './DemoDisclaimer';
import { Paragraphs, RichText } from './RichText';

export const formatAud = (aud: number): string => `A$${aud.toFixed(aud % 1 === 0 ? 0 : 2)}`;

const formatDate = (iso: string): string =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });

const h2 = 'text-2xl font-semibold';
const table = 'w-full border-collapse text-left text-sm [&_td]:border [&_td]:border-slate-300 [&_td]:p-2 [&_td]:align-top [&_th]:border [&_th]:border-slate-300 [&_th]:bg-slate-100 [&_th]:p-2 dark:[&_th]:bg-slate-800';

function Links({ items }: { items: LinkRef[] }) {
  return <>{items.map((l, i) => <span key={l.url + i}>{i > 0 && ', '}<a href={l.url} className="underline" rel="noopener noreferrer">{l.label}</a></span>)}</>;
}

export function GuideTemplate({ guide }: { guide: Guide }) {
  const f = guide.howThisFails;
  return (
    <article className="mx-auto max-w-3xl space-y-10 px-6 py-12 text-slate-800 dark:text-slate-200 [&_p]:my-3">
      {guide.placeholderNotice && <p role="note" data-block="placeholder-notice" className="rounded border-2 border-amber-500 bg-amber-50 p-4 font-semibold text-amber-900">{guide.placeholderNotice}</p>}
      <header className="space-y-4"><h1 className="text-3xl font-bold">{guide.title}</h1><p className="text-lg">{guide.summary}</p></header>
      <DemoDisclaimer note={guide.illustrationNote} />

      <section data-block="why-ai-goes-wrong"><h2 className={h2}>1. Why AI summaries go wrong</h2>
        <Paragraphs items={guide.whyAiGoesWrong.intro} />
        <ul className="list-disc space-y-2 pl-6">{guide.whyAiGoesWrong.mistakes.map(m => <li key={m.term}><strong>{m.term}</strong> <RichText text={m.text} /></li>)}</ul>
        <Paragraphs items={guide.whyAiGoesWrong.outro} />
      </section>

      <section data-block="prompt"><h2 className={h2}>2. The prompt we used</h2>
        <p><RichText text={guide.promptIntro} /></p>
        <pre data-verbatim="prompt" className="overflow-x-auto whitespace-pre-wrap rounded bg-slate-100 p-4 text-sm dark:bg-slate-800"><code>{guide.prompt}</code></pre>
        <Paragraphs items={guide.promptNotes} />
      </section>

      <section data-block="claim-checks"><h2 className={h2}>3. The 5-claim check</h2>
        <Paragraphs items={guide.claimCheckIntro} />
        <div className="overflow-x-auto"><table className={table}>
          <thead><tr>{['Claim (verbatim)', 'Verdict', 'Where to look', 'What the release says'].map(h => <th scope="col" key={h}>{h}</th>)}</tr></thead>
          <tbody>{guide.claimChecks.map((c, i) => <tr key={i}><td>{c.claim}</td><td><strong>{c.verdict}</strong></td><td><Links items={c.where} /></td><td><RichText text={c.whatTheSourceSays} /></td></tr>)}</tbody>
        </table></div>
        <h3 className="mt-6 text-xl font-semibold">How to check one claim yourself</h3>
        <ol className="list-decimal space-y-2 pl-6">{guide.howToCheck.map(s => <li key={s.step}><strong>{s.step}</strong> <RichText text={s.text} /></li>)}</ol>
        <Paragraphs items={guide.claimCheckNotes} />
      </section>

      <section data-block="how-this-fails"><h2 className={h2}>4. How this fails: one real error, shown</h2>
        <Paragraphs items={f.intro} />
        <pre data-verbatim="failure-prompt" className="overflow-x-auto whitespace-pre-wrap rounded bg-slate-100 p-4 text-sm dark:bg-slate-800"><code>{f.prompt}</code></pre>
        <p><RichText text={f.answerIntro} /></p>
        <blockquote data-verbatim="ai-answer" className="border-l-4 border-slate-400 pl-4"><ul className="list-disc space-y-1 pl-6">{f.aiAnswer.map((a, i) => <li key={i}>{a}</li>)}</ul></blockquote>
        <div className="overflow-x-auto"><table className={table}>
          <thead><tr>{['What we found', 'Check against the release'].map(h => <th scope="col" key={h}>{h}</th>)}</tr></thead>
          <tbody>{f.findings.map((r, i) => <tr key={i}><td>{r.finding}</td><td><RichText text={r.check} /> <Links items={r.where} /></td></tr>)}</tbody>
        </table></div>
        <Paragraphs items={f.outro} />
      </section>

      <section data-block="needs-a-human"><h2 className={h2}>5. What still needs a human</h2><Paragraphs items={guide.needsAHuman} /></section>

      <section data-block="opt-in"><h2 className={`${h2} mb-4`}>{guide.optIn.heading}</h2>
        <Paragraphs items={guide.optIn.body} />
        <p>{guide.optIn.consent}</p>
        <OptInForm defaultCampaign={guide.defaultCampaign} />
      </section>

      <section data-block="sources"><h2 className={h2}>7. Sources</h2>
        <ul className="list-disc space-y-1 pl-6">{guide.sources.map(s => <li key={s.link.url}>{s.title}: <a href={s.link.url} className="underline" rel="noopener noreferrer">{s.link.label}</a>.</li>)}</ul>
        <p data-block="last-tested">Last tested on <time dateTime={guide.lastTestedOn}>{formatDate(guide.lastTestedOn)}</time>.{guide.lastTestedNote && <> <span data-block="last-tested-note">{guide.lastTestedNote}</span></>}</p>
      </section>

      <section data-block="tools-prices"><h2 className={h2}>8. Tools used</h2>
        <p>{guide.toolsPricesIntro}</p>
        <ul className="list-disc space-y-1 pl-6">{guide.toolsPrices.map(t => <li key={t.name} data-checked-on={t.checkedOn}>{t.name}: {formatAud(t.aud)}.{t.source && <> <a href={t.source.url} className="underline" rel="noopener noreferrer">{t.source.label}</a>.</>}</li>)}</ul>
        <Paragraphs items={guide.toolsNotes} />
      </section>
    </article>
  );
}
