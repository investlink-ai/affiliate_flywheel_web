import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ReviewHero } from '@/components/ReviewHero';
import { ProsCons } from '@/components/ProsCons';
import { OutboundCTAButton } from '@/components/OutboundLink';
import { DisclosureNote } from '@/components/DisclosureNote';
import { ToolCard } from '@/components/ToolCard';
import { AuthorByline } from '@/components/AuthorByline';
import { SignupForm } from '@/components/SignupForm';
import { isSignupAvailable } from '@/lib/email/provider';
import { Breadcrumb, getReviewBreadcrumbs } from '@/components/Breadcrumb';
import { ScreenshotGallery } from '@/components/ScreenshotGallery';
import { VideoReviewSection } from '@/components/VideoEmbed';
import { ReviewPageCTAs, ReviewSidebarCTA } from '@/components/ReviewPageClient';
import { getToolBySlug, getAllToolSlugs, tools } from '@/lib/data';
import { generateReviewSchema } from '@/lib/schema';
import { primaryAuthor, getAuthorByline } from '@/lib/author';

/** ISR: Revalidate every 24 hours */
export const revalidate = 86400;

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Unknown review slugs are a real 404 at routing time (no soft 404 through loading.tsx).
export const dynamicParams = false;

export async function generateStaticParams() {
  const slugs = getAllToolSlugs();
  return slugs.map((slug) => ({ slug }));
}

/** Review metadata with organisation attribution. */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const tool = getToolBySlug(slug);

  if (!tool) {
    return {
      title: 'Review Not Found',
      description: 'The requested review could not be found.',
    };
  }

  const authorByline = getAuthorByline();
  const currentYear = new Date().getFullYear();

  // Review title and description
  const title = `${tool.name} Review ${currentYear} by ${primaryAuthor.name}`;
  const description = `${tool.name} review by InvestLink. ${tool.tagline}. Pricing: ${tool.pricing}. May suit ${tool.bestFor}`;

  return {
    title,
    description,
    authors: [{ name: primaryAuthor.name, url: primaryAuthor.url }],
    creator: primaryAuthor.name,
    publisher: 'InvestLink',
    openGraph: {
      title: `${tool.name} Review ${currentYear} | InvestLink`,
      description: `${authorByline}. ${tool.verdict.slice(0, 150)}...`,
      type: 'article',
      publishedTime: tool.lastUpdated,
      modifiedTime: tool.lastUpdated,
      authors: [primaryAuthor.name],
      tags: [tool.category, 'AI Investment Tools', 'Review', tool.name, ...tool.features.slice(0, 3)],
      images: [
        {
          url: `/og/reviews/${tool.slug}.png`,
          width: 1200,
          height: 630,
          alt: `${tool.name} Review`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${tool.name} Review - ${authorByline}`,
      description: tool.tagline,
      creator: '@investlink_ai',
    },
    alternates: {
      canonical: `/reviews/${tool.slug}`,
    },
    other: {
      'article:author': primaryAuthor.name,
      'article:published_time': tool.lastUpdated,
      'article:modified_time': tool.lastUpdated,
      'article:section': 'Reviews',
      'article:tag': tool.category,
    },
  };
}

export default async function ReviewPage({ params }: PageProps) {
  const { slug } = await params;
  const tool = getToolBySlug(slug);

  if (!tool) {
    notFound();
  }

  // Get related tools (same category, excluding current)
  const relatedTools = tools.filter((t) => t.category === tool.category && t.slug !== tool.slug).slice(0, 2);

  // Generate comprehensive JSON-LD schema
  const jsonLdSchema = generateReviewSchema(tool);

  return (
    <>
      {/* Comprehensive JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdSchema) }}
      />

      {/* Breadcrumb Navigation */}
      <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
        <Breadcrumb items={getReviewBreadcrumbs(tool.name)} />
      </div>

      {/* Hero */}
      <ReviewHero tool={tool} />

      {/* Mobile Sticky CTA - Only renders on client */}
      <ReviewPageCTAs tool={tool} />

      {/* Main Content */}
      <article className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Author Byline - EEAT Signal */}
        <div className="mb-8 border-b border-slate-200 pb-6 dark:border-slate-700">
          <AuthorByline dateUpdated={tool.lastUpdated} />
        </div>

        <div className="grid gap-12 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Overview */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Overview</h2>
              <p className="mt-4 leading-relaxed text-slate-600 dark:text-slate-400">{tool.description}</p>
            </section>

            {/* Features */}
            <section className="mt-12">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Key Features</h2>
              <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                {tool.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <svg
                      className="mt-1 h-5 w-5 flex-shrink-0 text-primary-600 dark:text-primary-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span className="text-slate-700 dark:text-slate-300">{feature}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Screenshots Gallery */}
            {tool.screenshots && tool.screenshots.length > 0 && (
              <section className="mt-12">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                  {tool.name} Interface
                </h2>
                <p className="mt-2 text-slate-600 dark:text-slate-400">
                  Click any image to view full size
                </p>
                <div className="mt-6">
                  <ScreenshotGallery screenshots={tool.screenshots} toolName={tool.name} />
                </div>
              </section>
            )}

            {/* Video Review */}
            {tool.videoReviewUrl && (
              <VideoReviewSection
                toolName={tool.name}
                videoUrl={tool.videoReviewUrl}
              />
            )}

            {/* Pros and Cons */}
            <section className="mt-12">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Pros & Cons</h2>
              <div className="mt-6">
                <ProsCons pros={tool.pros} cons={tool.cons} />
              </div>
            </section>

            {/* Pricing */}
            <section className="mt-12">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Pricing</h2>
              <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-700 dark:bg-slate-800">
                <p className="text-lg font-semibold text-slate-900 dark:text-white">{tool.pricing}</p>
                <p className="mt-2 text-slate-600 dark:text-slate-400">{tool.pricingDetails}</p>
                <div className="mt-4 flex flex-wrap items-center gap-4">
                  <OutboundCTAButton
                    href={tool.websiteUrl}
                    size="md"
                  >
                    Visit {tool.name} website
                  </OutboundCTAButton>
                  <DisclosureNote variant="inline" />
                </div>
              </div>
            </section>

            {/* Verdict */}
            <section className="mt-12">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Final Verdict</h2>
              <div className="mt-4 rounded-xl border-l-4 border-primary-600 bg-primary-50 p-6 dark:bg-primary-900/20">
                <p className="leading-relaxed text-slate-700 dark:text-slate-300">{tool.verdict}</p>
              </div>
              <div className="mt-6 flex flex-wrap items-center gap-4">
                <OutboundCTAButton
                  href={tool.websiteUrl}
                  size="lg"
                >
                  Visit {tool.name} website
                </OutboundCTAButton>
                <DisclosureNote />
              </div>
            </section>

            {/* Author Card - Full EEAT Signal */}
            <section className="mt-12 border-t border-slate-200 pt-8 dark:border-slate-700">
              <h2 className="mb-4 text-lg font-semibold text-slate-900 dark:text-white">
                About InvestLink
              </h2>
              <AuthorByline
                variant="card"
                showSocial={true}
                dateUpdated={tool.lastUpdated}
              />
            </section>
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="space-y-6">
              {/* Desktop Sticky CTA */}
              <ReviewSidebarCTA tool={tool} />

              {/* Quick Actions Card - Shows on mobile, hidden on desktop (replaced by SidebarStickyCTA) */}
              <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800 lg:hidden">
                <h3 className="font-semibold text-slate-900 dark:text-white">Quick Links</h3>
                <div className="mt-4 space-y-3">
                  <OutboundCTAButton
                    href={tool.websiteUrl}
                    size="md"
                    className="w-full justify-center"
                  >
                    Visit {tool.name} website
                  </OutboundCTAButton>
                  <Link
                    href="/comparisons"
                    className="flex w-full items-center justify-center gap-2 rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
                  >
                    Compare Alternatives
                  </Link>
                </div>
                <div className="mt-4">
                  <DisclosureNote variant="inline" />
                </div>
              </div>

              {/* Related Tools */}
              {relatedTools.length > 0 && (
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white">Related Tools</h3>
                  <div className="mt-4 space-y-4">
                    {relatedTools.map((relatedTool) => (
                      <ToolCard key={relatedTool.slug} tool={relatedTool} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </aside>
        </div>
      </article>

      {/* Newsletter Signup (hidden when signup isn't configured on this build) */}
      {isSignupAvailable() && (
      <section className="border-t border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <SignupForm
            location={`review-${tool.slug}`}
            variant="banner"
            headline="Get More AI Investment Tool Insights"
            description={`Enjoyed this ${tool.name} review? Get a weekly email on investing tools.`}
            ctaText="Join Free"
          />
        </div>
      </section>
      )}

      {/* Bottom padding for sticky CTA on mobile */}
      <div className="h-24 lg:hidden" aria-hidden="true" />
    </>
  );
}
