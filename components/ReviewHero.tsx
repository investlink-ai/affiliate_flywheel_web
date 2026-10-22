import { OutboundCTAButton } from './OutboundLink';
import { DisclosureNote } from './DisclosureNote';
import type { Tool } from '@/lib/data';

interface ReviewHeroProps {
  tool: Tool;
}

export function ReviewHero({ tool }: ReviewHeroProps) {
  return (
    <section className="border-b border-slate-200 bg-gradient-to-b from-slate-50 to-white dark:border-slate-800 dark:from-slate-900 dark:to-slate-900">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          {/* Left: Content */}
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-primary-100 px-3 py-1 text-sm font-medium text-primary-700 dark:bg-primary-900/30 dark:text-primary-400">
                {tool.category}
              </span>
              <span className="text-sm text-slate-500 dark:text-slate-400">
                Updated {tool.lastUpdated}
              </span>
            </div>

            <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl lg:text-5xl">
              {tool.name} Review
            </h1>

            <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">{tool.tagline}</p>

            {/* CTA - Hidden on mobile (shown in sticky bar instead) */}
            <div className="mt-8 hidden flex-wrap items-center gap-4 sm:flex">
              <OutboundCTAButton
                href={tool.websiteUrl}
                size="lg"
              >
                Visit {tool.name} website
              </OutboundCTAButton>
              <DisclosureNote />
            </div>

            {/* Mobile CTA - Visible only on small screens, above the fold */}
            <div className="mt-8 sm:hidden">
              <OutboundCTAButton
                href={tool.websiteUrl}
                size="lg"
                className="w-full justify-center"
              >
                Visit {tool.name} website
              </OutboundCTAButton>
              <div className="mt-2">
                <DisclosureNote variant="inline" className="text-center" />
              </div>
            </div>
          </div>

          {/* Right: Stats Card */}
          <div className="lg:flex lg:items-center lg:justify-end">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Quick Stats
              </h2>
              <dl className="mt-4 space-y-4">
                <div className="flex justify-between gap-8">
                  <dt className="text-slate-600 dark:text-slate-400">May suit</dt>
                  <dd className="font-medium text-slate-900 dark:text-white">{tool.bestFor}</dd>
                </div>
                <div className="flex justify-between gap-8">
                  <dt className="text-slate-600 dark:text-slate-400">Starting Price</dt>
                  <dd className="font-medium text-slate-900 dark:text-white">{tool.pricing}</dd>
                </div>
                <div className="flex justify-between gap-8">
                  <dt className="text-slate-600 dark:text-slate-400">Category</dt>
                  <dd className="font-medium text-slate-900 dark:text-white">{tool.category}</dd>
                </div>
              </dl>

              {/* Desktop quick CTA in stats card */}
              <div className="mt-6 hidden lg:block">
                <OutboundCTAButton
                  href={tool.websiteUrl}
                  size="md"
                  className="w-full justify-center"
                >
                  Visit {tool.name} website
                </OutboundCTAButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * Client wrapper for ReviewHero with dynamic A/B testing
 * Use this when you need client-side A/B test assignment
 */
export { ReviewHeroWithABTest } from './ReviewHeroClient';
