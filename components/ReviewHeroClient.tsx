'use client';

import dynamic from 'next/dynamic';
import type { Tool } from '@/lib/data';

// Dynamically import heavy components
const ReviewHeroContent = dynamic(
  () => import('./ReviewHeroContent').then((mod) => mod.ReviewHeroContent),
  {
    loading: () => <ReviewHeroSkeleton />,
    ssr: true,
  }
);

interface ReviewHeroWithABTestProps {
  tool: Tool;
}

/**
 * Client-side ReviewHero with A/B testing
 * Uses dynamic import for performance optimization
 */
export function ReviewHeroWithABTest({ tool }: ReviewHeroWithABTestProps) {
  return <ReviewHeroContent tool={tool} />;
}

/**
 * Loading skeleton for ReviewHero
 */
function ReviewHeroSkeleton() {
  return (
    <section className="border-b border-slate-200 bg-gradient-to-b from-slate-50 to-white dark:border-slate-800 dark:from-slate-900 dark:to-slate-900">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          <div className="space-y-4">
            <div className="flex gap-3">
              <div className="h-7 w-24 animate-pulse rounded-full bg-slate-200 dark:bg-slate-700" />
              <div className="h-7 w-32 animate-pulse rounded-full bg-slate-200 dark:bg-slate-700" />
            </div>
            <div className="h-12 w-3/4 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-700" />
            <div className="h-6 w-full animate-pulse rounded-lg bg-slate-200 dark:bg-slate-700" />
            <div className="flex gap-2">
              <div className="h-8 w-32 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-700" />
              <div className="h-8 w-20 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-700" />
            </div>
            <div className="h-12 w-48 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-700" />
          </div>
          <div className="lg:flex lg:items-center lg:justify-end">
            <div className="h-64 w-full max-w-sm animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-700" />
          </div>
        </div>
      </div>
    </section>
  );
}
