import { RichText } from './RichText';

/** R7 mandatory block: the guide's own illustration-only / not-a-recommendation note. */
export function DemoDisclaimer({ note }: { note: string }) {
  return <aside data-block="demo-disclaimer" className="rounded border border-amber-300 bg-amber-50 p-4 text-slate-900"><RichText text={note} /></aside>;
}
