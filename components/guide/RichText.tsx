import type { ReactNode } from 'react';

const TOKEN = /\*\*([^*]+)\*\*|\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g;

/** Renders plain text with **bold** and [label](https://...) links only. Nothing else is parsed. */
export function richText(text: string): ReactNode[] {
  const out: ReactNode[] = [];
  let last = 0;
  for (const m of text.matchAll(TOKEN)) {
    if (m.index > last) out.push(text.slice(last, m.index));
    if (m[1] !== undefined) out.push(<strong key={m.index}>{m[1]}</strong>);
    else out.push(<a key={m.index} href={m[3]} className="underline" rel="noopener noreferrer">{m[2]}</a>);
    last = m.index + m[0].length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

export function RichText({ text }: { text: string }) {
  return <>{richText(text)}</>;
}

export function Paragraphs({ items }: { items: string[] }) {
  return <>{items.map((p, i) => <p key={i}><RichText text={p} /></p>)}</>;
}
