import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { guides } from '@/lib/guides/content';
import { assertValidGuide } from '@/lib/guides/validate';
import { GuideTemplate } from '@/components/guide/GuideTemplate';

// Preview path: noindex until the guide is approved for launch.
const robots: Metadata['robots'] = { index: false, follow: false, googleBot: { index: false, follow: false } };

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const guide = guides.find(g => g.slug === slug);
  return { title: guide?.title, description: guide?.summary, robots };
}
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
