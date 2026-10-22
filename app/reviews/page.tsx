import type { Metadata } from 'next';
import { Suspense } from 'react';
import Link from 'next/link';
import { ReviewsContent } from '@/components/ReviewsContent';
import { ToolCard } from '@/components/ToolCard';
import { filterTools, type Category } from '@/lib/data';
import { getUserTypeFromParams } from '@/lib/user-type';

export const metadata: Metadata = {
  title: 'AI Investment Tool Reviews',
  description:
    'Reviews of AI investment tools for traders and investors.',
  openGraph: {
    title: 'AI Investment Tool Reviews | InvestLink',
    description: 'Reviews of AI investment tools for traders and investors.',
  },
};

interface ReviewsPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function ReviewsPage({ searchParams }: ReviewsPageProps) {
  const params = await searchParams;
  
  // Extract filter params
  const query = typeof params.q === 'string' ? params.q : '';
  const category = (typeof params.category === 'string' ? params.category : 'All') as Category;
  const userType = getUserTypeFromParams(params);

  // Server-side filtering for initial render (SEO)
  const filteredTools = filterTools(query, category);

  // Sort by user type recommendations on server if available from URL
  const sortedTools = userType
    ? [...filteredTools].sort((a, b) => {
        const aHasMatch = a.recommendations?.[userType] ? 1 : 0;
        const bHasMatch = b.recommendations?.[userType] ? 1 : 0;
        return bHasMatch - aHasMatch;
      })
    : filteredTools;

  return (
    <>
      {/* Hero Section */}
      <section className="border-b border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            AI Investment Tool Reviews
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-slate-600 dark:text-slate-400">
            Reviews of AI investment tools for traders and investors.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <Suspense fallback={<ReviewsLoadingSkeleton />}>
          <ReviewsContent
            initialQuery={query}
            initialCategory={category}
          />
        </Suspense>
      </section>

      {/* SEO: Hidden content for search engines (server-rendered tool list) */}
      <noscript>
        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {sortedTools.map((tool) => (
              <ToolCard key={tool.slug} tool={tool} showPersonalization={false} />
            ))}
          </div>
        </section>
      </noscript>

      {/* Bottom CTA */}
      <section className="border-t border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto max-w-7xl px-4 py-12 text-center sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            Not sure which tool may suit you?
          </h2>
          <p className="mt-2 text-slate-600 dark:text-slate-400">
            Check our side-by-side comparisons.
          </p>
          <Link href="/comparisons" className="btn-primary mt-6 inline-flex">
            View Comparisons
          </Link>
        </div>
      </section>
    </>
  );
}

/**
 * Loading skeleton for reviews content
 */
function ReviewsLoadingSkeleton() {
  return (
    <div className="space-y-8">
      {/* Filters skeleton */}
      <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
        <div className="h-12 animate-pulse rounded-xl bg-slate-200 dark:bg-slate-700" />
        <div className="flex gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="h-8 w-20 animate-pulse rounded-full bg-slate-200 dark:bg-slate-700"
            />
          ))}
        </div>
      </div>

      {/* Cards skeleton */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="h-72 animate-pulse rounded-xl border border-slate-200 bg-slate-100 dark:border-slate-700 dark:bg-slate-800"
          />
        ))}
      </div>
    </div>
  );
}
