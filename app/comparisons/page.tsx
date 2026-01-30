import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { DisclosureNote } from '@/components/DisclosureNote';
import { tools } from '@/lib/data';

/**
 * Lazy load heavy components to reduce initial bundle size
 * These components include @tanstack/react-table and quiz logic
 */
const ComparisonTableSortable = dynamic(
  () => import('@/components/ComparisonTableSortable').then((mod) => mod.ComparisonTableSortable),
  {
    loading: () => <ComparisonTableSkeleton />,
    ssr: true,
  }
);

const QuizComponent = dynamic(
  () => import('@/components/QuizComponent').then((mod) => mod.QuizComponent),
  {
    loading: () => <QuizSkeleton />,
    ssr: true,
  }
);

/**
 * Loading skeleton for comparison table
 */
function ComparisonTableSkeleton() {
  return (
    <div className="animate-pulse">
      {/* Header row */}
      <div className="flex border-b border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800">
        <div className="h-6 w-32 rounded bg-slate-200 dark:bg-slate-600" />
        <div className="ml-auto flex gap-4">
          <div className="h-6 w-24 rounded bg-slate-200 dark:bg-slate-600" />
          <div className="h-6 w-24 rounded bg-slate-200 dark:bg-slate-600" />
        </div>
      </div>
      {/* Data rows */}
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="flex border-b border-slate-100 p-4 dark:border-slate-700">
          <div className="h-5 w-40 rounded bg-slate-100 dark:bg-slate-700" />
          <div className="ml-auto flex gap-8">
            <div className="h-5 w-5 rounded bg-slate-100 dark:bg-slate-700" />
            <div className="h-5 w-5 rounded bg-slate-100 dark:bg-slate-700" />
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * Loading skeleton for quiz component
 */
function QuizSkeleton() {
  return (
    <div className="animate-pulse rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
      <div className="h-6 w-3/4 rounded bg-slate-200 dark:bg-slate-600" />
      <div className="mt-2 h-4 w-full rounded bg-slate-100 dark:bg-slate-700" />
      <div className="mt-6 space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-12 w-full rounded-lg bg-slate-100 dark:bg-slate-700" />
        ))}
      </div>
    </div>
  );
}

export const metadata: Metadata = {
  title: 'AI Tool Comparisons',
  description:
    'Side-by-side comparisons of the best AI tools. Compare features, pricing, and find the perfect tool for your needs.',
  openGraph: {
    title: 'AI Tool Comparisons | Find Your Perfect Tool',
    description: 'Side-by-side comparisons of the best AI tools for content creation and productivity.',
  },
};

// Feature comparison data
const writingToolFeatures = [
  'Free tier available',
  'Unlimited words (paid)',
  'Brand voice training',
  'SEO optimization',
  'Chrome extension',
  'Team collaboration',
  'API access',
  '25+ languages',
];

const writingFeatureMatrix: Record<string, Record<string, boolean | string>> = {
  'Free tier available': {
    'jasper-ai': false,
    'copy-ai': true,
  },
  'Unlimited words (paid)': {
    'jasper-ai': false,
    'copy-ai': true,
  },
  'Brand voice training': {
    'jasper-ai': true,
    'copy-ai': true,
  },
  'SEO optimization': {
    'jasper-ai': true,
    'copy-ai': false,
  },
  'Chrome extension': {
    'jasper-ai': true,
    'copy-ai': true,
  },
  'Team collaboration': {
    'jasper-ai': true,
    'copy-ai': true,
  },
  'API access': {
    'jasper-ai': true,
    'copy-ai': true,
  },
  '25+ languages': {
    'jasper-ai': true,
    'copy-ai': true,
  },
};

export default function ComparisonsPage() {
  const writingTools = tools.filter((t) => t.category === 'AI Writing');

  return (
    <>
      {/* Hero Section */}
      <section className="border-b border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            AI Tool Comparisons
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-slate-600 dark:text-slate-400">
            Side-by-side comparisons to help you choose the right tool. Every feature has been
            verified through hands-on testing.
          </p>
        </div>
      </section>

      {/* Quiz + Comparisons */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-3">
          {/* Left: Quiz */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <QuizComponent
                title="Not Sure Which Tool?"
                description="Answer 3 quick questions for personalized recommendations."
              />
            </div>
          </div>

          {/* Right: Comparison Tables */}
          <div className="lg:col-span-2">
            {/* AI Writing Tools Comparison */}
            <div className="mb-12">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                  AI Writing Tools Comparison
                </h2>
                <p className="mt-2 text-slate-600 dark:text-slate-400">
                  Compare the top AI writing assistants for marketing and content creation.
                  Click column headers to sort.
                </p>
              </div>

              <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700">
                <ComparisonTableSortable
                  tools={writingTools}
                  features={writingToolFeatures}
                  featureMatrix={writingFeatureMatrix}
                  winnerId="jasper-ai"
                />
              </div>

              <div className="mt-4">
                <DisclosureNote variant="inline" />
              </div>
            </div>

            {/* Quick Recommendations */}
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-6 sm:p-8 dark:border-slate-700 dark:bg-slate-800">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Quick Recommendations</h2>
              <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white">Best for Teams</h3>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                    <strong>Jasper AI</strong> — Superior collaboration features, brand voice consistency,
                    and enterprise-grade security.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white">Best Value</h3>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                    <strong>Copy.ai</strong> — Generous free tier and unlimited words on Pro make it
                    unbeatable for budget-conscious users.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white">Best for Video</h3>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                    <strong>Murf AI</strong> — The most natural-sounding AI voices with built-in video
                    editing for creators.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white">Best for Solopreneurs</h3>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                    <strong>Copy.ai</strong> — The free tier is genuinely usable, and unlimited words
                    on Pro means predictable costs.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Methodology */}
        <div className="mt-16">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">How We Compare</h2>
          <div className="mt-4 prose prose-slate max-w-none dark:prose-invert">
            <p className="text-slate-600 dark:text-slate-400">
              Every comparison is based on hands-on testing with paid subscriptions. I evaluate tools
              across real-world workflows including blog writing, social media content, ad copy, and
              video scripts. Features are verified directly in the product, not from marketing
              materials.
            </p>
            <p className="mt-4 text-slate-600 dark:text-slate-400">
              Winner badges indicate the tool that offers the best overall value for most users in
              that category. Your needs may vary — always consider your specific use case when making
              a decision.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
