'use client';

import { useABTest } from '@/lib/hooks';
import { AffiliateCTAButton, type CTAVariant, type UrgencyVariant } from './AffiliateLink';
import { StarRating } from './StarRating';
import { DisclosureNote } from './DisclosureNote';
import type { Tool } from '@/lib/data';

interface ReviewHeroContentProps {
  tool: Tool;
}

/**
 * Client-side ReviewHero content with A/B testing
 */
export function ReviewHeroContent({ tool }: ReviewHeroContentProps) {
  // A/B test for CTA variant
  const { value: ctaVariant } = useABTest<CTAVariant>({
    testId: 'review-hero-cta-variant',
    variants: [
      { id: 'control', value: 'default', weight: 40 },
      { id: 'accent', value: 'accent', weight: 20 },
      { id: 'gradient', value: 'gradient', weight: 20 },
      { id: 'urgency', value: 'urgency', weight: 20 },
    ],
    persist: true,
  });

  // A/B test for urgency text
  const { value: urgencyVariant } = useABTest<UrgencyVariant>({
    testId: 'review-hero-urgency',
    variants: [
      { id: 'none', value: 'none', weight: 50 },
      { id: 'limited', value: 'limited', weight: 25 },
      { id: 'popular', value: 'popular', weight: 25 },
    ],
    persist: true,
  });

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

            {/* Rating */}
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <StarRating rating={tool.rating} size="lg" />
              <span className="text-2xl font-bold text-slate-900 dark:text-white">
                {tool.rating.toFixed(1)}
              </span>
              <span className="text-slate-500 dark:text-slate-400">
                ({tool.ratingCount.toLocaleString()} reviews)
              </span>
            </div>

            {/* CTA - Hidden on mobile (shown in sticky bar instead) */}
            <div className="mt-8 hidden flex-wrap items-center gap-4 sm:flex">
              <AffiliateCTAButton
                href={tool.affiliateUrl}
                variant={ctaVariant}
                urgency={urgencyVariant}
                size="lg"
              >
                Try {tool.name} Free
              </AffiliateCTAButton>
              <DisclosureNote />
            </div>

            {/* Mobile CTA */}
            <div className="mt-8 sm:hidden">
              <AffiliateCTAButton
                href={tool.affiliateUrl}
                variant={ctaVariant}
                urgency={urgencyVariant}
                size="lg"
                className="w-full justify-center"
              >
                Try {tool.name} Free
              </AffiliateCTAButton>
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
                  <dt className="text-slate-600 dark:text-slate-400">Best For</dt>
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
                <div className="flex justify-between gap-8">
                  <dt className="text-slate-600 dark:text-slate-400">Our Rating</dt>
                  <dd className="font-medium text-slate-900 dark:text-white">
                    {tool.rating.toFixed(1)}/5
                  </dd>
                </div>
              </dl>

              {/* Desktop quick CTA in stats card */}
              <div className="mt-6 hidden lg:block">
                <AffiliateCTAButton
                  href={tool.affiliateUrl}
                  variant={ctaVariant}
                  urgency={urgencyVariant}
                  size="md"
                  className="w-full justify-center"
                >
                  Get Started
                </AffiliateCTAButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
