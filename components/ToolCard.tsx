import Link from 'next/link';
import Image from 'next/image';
import { AffiliateLink } from './AffiliateLink';
import { StarRating } from './StarRating';
import { PersonalizationBadge } from './PersonalizationBadge';
import type { Tool, UserType } from '@/lib/data';

interface ToolCardProps {
  tool: Tool;
  /** User type for personalization (from URL param or localStorage) */
  userType?: UserType | null;
  /** Show personalization badge */
  showPersonalization?: boolean;
  /** A/B test variant for CTA styling */
  ctaVariant?: 'default' | 'accent' | 'gradient';
  /** Priority loading for above-fold images (LCP optimization) */
  priority?: boolean;
}

export function ToolCard({
  tool,
  userType,
  showPersonalization = true,
  ctaVariant = 'default',
  priority = false,
}: ToolCardProps) {
  // Get personalization badge if user type matches
  const personalizationBadge =
    showPersonalization && userType && tool.recommendations?.[userType];

  // CTA button class based on variant (for A/B testing)
  const ctaClasses = {
    default: 'btn-primary',
    accent: 'inline-flex items-center justify-center gap-2 rounded-lg bg-accent-500 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-accent-600 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:ring-offset-2',
    gradient: 'inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-primary-600 to-accent-500 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:from-primary-700 hover:to-accent-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
  };

  // Show commission badge for high-value programs
  const showCommissionBadge = tool.commissionRate && tool.commissionRate >= 25;

  return (
    <article className="card group relative flex flex-col">
      {/* Badges - Absolute positioned */}
      <div className="absolute -top-3 right-4 z-10 flex gap-2">
        {/* New Tool Badge */}
        {tool.isNew && (
          <span className="rounded-full bg-green-600 px-2.5 py-0.5 text-xs font-medium text-white shadow-sm">
            New
          </span>
        )}
        {/* Exclusive Deal Badge */}
        {tool.hasExclusiveDeal && (
          <span className="rounded-full bg-amber-500 px-2.5 py-0.5 text-xs font-medium text-white shadow-sm">
            Exclusive Deal
          </span>
        )}
        {/* Personalization Badge */}
        {personalizationBadge && !tool.isNew && !tool.hasExclusiveDeal && (
          <PersonalizationBadge text={personalizationBadge} userType={userType} />
        )}
      </div>

      {/* Header with Logo */}
      <div className="flex items-start gap-4">
        <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-700">
          {tool.logoUrl && tool.logoUrl !== '/images/tools/placeholder.svg' ? (
            <Image
              src={tool.logoUrl}
              alt={`${tool.name} logo`}
              width={56}
              height={56}
              loading={priority ? 'eager' : 'lazy'}
              priority={priority}
              unoptimized={tool.logoUrl.endsWith('.svg')}
              className="h-full w-full object-contain p-1.5"
            />
          ) : (
            <span 
              className="flex h-full w-full items-center justify-center text-2xl font-bold text-primary-600 dark:text-primary-400"
              aria-hidden="true"
            >
              {tool.name.charAt(0)}
            </span>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-primary-100 px-2.5 py-0.5 text-xs font-medium text-primary-700 dark:bg-primary-900/30 dark:text-primary-400">
              {tool.category}
            </span>
            {/* Commission Badge */}
            {showCommissionBadge && (
              <span 
                className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400"
                title={`Up to ${tool.commissionRate}% commission${tool.cookieDuration ? `, ${tool.cookieDuration}-day cookie` : ''}`}
              >
                Up to {tool.commissionRate}%
              </span>
            )}
          </div>
          <h3 className="mt-1 text-lg font-semibold text-slate-900 group-hover:text-primary-600 dark:text-white dark:group-hover:text-primary-400">
            <Link href={`/reviews/${tool.slug}`} className="hover:underline">
              {tool.name}
            </Link>
          </h3>
        </div>
      </div>

      {/* Rating */}
      <div className="mt-4 flex items-center gap-2">
        <StarRating rating={tool.rating} />
        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
          {tool.rating.toFixed(1)}
        </span>
        <span className="text-sm text-slate-500 dark:text-slate-400">
          ({tool.ratingCount.toLocaleString()} reviews)
        </span>
      </div>

      {/* Tagline */}
      <p className="mt-3 flex-1 text-sm text-slate-600 dark:text-slate-400">{tool.tagline}</p>

      {/* Best For - only shown if matches user type */}
      {userType && personalizationBadge && (
        <p className="mt-2 text-xs font-medium text-primary-600 dark:text-primary-400">
          {tool.bestFor}
        </p>
      )}

      {/* Pricing */}
      <p className="mt-4 text-sm font-semibold text-slate-900 dark:text-white">{tool.pricing}</p>

      {/* Actions */}
      <div className="mt-4 flex gap-3" role="group" aria-label={`Actions for ${tool.name}`}>
        <AffiliateLink
          href={tool.affiliateUrl}
          className={`${ctaClasses[ctaVariant]} flex-1 text-center`}
          toolName={tool.name}
          toolSlug={tool.slug}
          position="tool-card"
        >
          Try {tool.name}
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
            />
          </svg>
        </AffiliateLink>
        <Link 
          href={`/reviews/${tool.slug}`} 
          className="btn-secondary"
          aria-label={`Read full review of ${tool.name}`}
        >
          Review
        </Link>
      </div>
    </article>
  );
}

/**
 * Client wrapper for ToolCard with personalization
 * Use this when you need client-side personalization from localStorage
 */
export { ToolCardPersonalized } from './ToolCardPersonalized';
