import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { guides } from '@/lib/guides/content';
import { assertValidGuide } from '@/lib/guides/validate';
import { GuideTemplate } from '@/components/guide/GuideTemplate';

export const metadata: Metadata = {
  title: '[Placeholder] Preview: AI research checklist',
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
};
export const dynamicParams = false;

export function generateStaticParams() {
  return guides.map(guide => { assertValidGuide(guide); return { slug: guide.slug }; });
}

export default async function GuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const guide = guides.find(g => g.slug === slug);
  if (!guide) notFound();
  assertValidGuide(guide);
  return <GuideTemplate guide={guide} />;
}
