import type { Tool } from '@/lib/data';

interface SocialProofProps {
  /** Tool with socialProof quotes (from LLM research: G2, Reddit, etc.) */
  tool: Tool;
  /** Section headline */
  headline?: string;
  /** Maximum quotes to show (default: all) */
  limit?: number;
  /** Additional class names */
  className?: string;
}

/**
 * Displays user quotes from public reviews (socialProof).
 * Research-driven, FTC-safe — quotes public sources with attribution.
 * Use this as the primary social proof format; UserTestimonials for curated real data only.
 */
export function SocialProof({
  tool,
  headline = 'What Users Are Saying',
  limit,
  className = '',
}: SocialProofProps) {
  const quotes = tool.socialProof ?? [];
  const items = limit ? quotes.slice(0, limit) : quotes;

  if (items.length === 0) return null;

  return (
    <section
      className={`rounded-xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-700 dark:bg-slate-800/50 ${className}`}
      aria-labelledby={`social-proof-${tool.slug}`}
    >
      <h2
        id={`social-proof-${tool.slug}`}
        className="text-lg font-semibold text-slate-900 dark:text-white"
      >
        {headline}
      </h2>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
        Quotes from G2, Reddit, and other public reviews
      </p>
      <ul className="mt-4 space-y-3" role="list">
        {items.map((quote, index) => (
          <li
            key={`${tool.slug}-quote-${index}`}
            className="border-l-2 border-primary-500 pl-4 text-sm leading-relaxed text-slate-700 dark:border-primary-400 dark:text-slate-300"
          >
            {quote}
          </li>
        ))}
      </ul>
    </section>
  );
}
