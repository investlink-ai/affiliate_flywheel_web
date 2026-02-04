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
  title: 'AI Investment Tool Comparisons',
  description:
    'Side-by-side comparisons of the best AI investment tools. Compare robo-advisors, trading platforms, and quantitative tools for your investing needs.',
  openGraph: {
    title: 'AI Investment Tool Comparisons | Find Your Perfect Tool',
    description: 'Side-by-side comparisons of the best AI investment tools for traders and investors.',
  },
};

// Portfolio Management feature comparison
const portfolioToolFeatures = [
  'Commission-free trading',
  'Automated investing',
  'Tax-loss harvesting',
  'IRA / retirement accounts',
  'High-yield cash',
  'Mobile app',
  'Fractional shares',
  'Crypto trading',
];

const portfolioFeatureMatrix: Record<string, Record<string, boolean | string>> = {
  'Commission-free trading': {
    wealthfront: true,
    betterment: true,
    robinhood: true,
  },
  'Automated investing': {
    wealthfront: true,
    betterment: true,
    robinhood: true,
  },
  'Tax-loss harvesting': {
    wealthfront: true,
    betterment: true,
    robinhood: false,
  },
  'IRA / retirement accounts': {
    wealthfront: true,
    betterment: true,
    robinhood: true,
  },
  'High-yield cash': {
    wealthfront: true,
    betterment: true,
    robinhood: true,
  },
  'Mobile app': {
    wealthfront: true,
    betterment: true,
    robinhood: true,
  },
  'Fractional shares': {
    wealthfront: true,
    betterment: true,
    robinhood: true,
  },
  'Crypto trading': {
    wealthfront: false,
    betterment: false,
    robinhood: true,
  },
};

export default function ComparisonsPage() {
  const portfolioTools = tools.filter((t) => t.category === 'Portfolio Management');

  return (
    <>
      {/* Hero Section */}
      <section className="border-b border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            AI Investment Tool Comparisons
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-slate-600 dark:text-slate-400">
            Side-by-side comparisons to help you choose the right tool. Every feature has been
            verified through hands-on research.
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
                description="Answer 5 quick questions for personalized recommendations."
              />
            </div>
          </div>

          {/* Right: Comparison Tables */}
          <div className="lg:col-span-2">
            {/* Portfolio Management Comparison */}
            <div className="mb-12">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                  Portfolio Management & Robo-Advisors
                </h2>
                <p className="mt-2 text-slate-600 dark:text-slate-400">
                  Compare robo-advisors and commission-free brokers for passive and active investing.
                  Click column headers to sort.
                </p>
              </div>

              <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700">
                <ComparisonTableSortable
                  tools={portfolioTools}
                  features={portfolioToolFeatures}
                  featureMatrix={portfolioFeatureMatrix}
                  winnerId="wealthfront"
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
                  <h3 className="font-semibold text-slate-900 dark:text-white">Best for Passive Investing</h3>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                    <strong>Wealthfront</strong> — Automated, tax-optimized portfolios with high-yield cash
                    and strong long-term focus.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white">Best for Tax Efficiency</h3>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                    <strong>Betterment</strong> — Tax-loss harvesting and tax-coordinated IRAs help many
                    users cover advisory fees through savings.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white">Best for Beginners</h3>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                    <strong>Robinhood</strong> — Commission-free stocks, options, and crypto with a
                    user-friendly app. Good for learning.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white">Best for All-in-One</h3>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                    <strong>Robinhood</strong> — Stocks, options, crypto, and robo-advisory in one app.
                    Fractional shares and Robinhood Gold available.
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
              Every comparison is based on research from official sites, user reviews, and hands-on
              evaluation. We verify features, pricing, and pros/cons from real user feedback—not
              marketing materials. This is not financial advice; always conduct your own due diligence.
            </p>
            <p className="mt-4 text-slate-600 dark:text-slate-400">
              Winner badges indicate the tool that offers the best overall value for most users in
              that category. Your needs may vary—consider your investment style, risk tolerance, and
              workflow when making a decision.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
