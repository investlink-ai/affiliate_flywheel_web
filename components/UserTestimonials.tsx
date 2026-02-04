import Link from 'next/link';
import { StarRating } from './StarRating';
import { getToolBySlug } from '@/lib/data';

export interface UserTestimonial {
  name: string;
  role: string;
  company?: string;
  quote: string;
  toolSlug: string;
  rating: number;
}

/**
 * Placeholder testimonials — for development only.
 * FTC: Do NOT use fake/placeholder testimonials in production.
 * Use UserTestimonials only when you have real data from outreach with permission.
 * For social proof, prefer SocialProof component (tool.socialProof) — research-driven, FTC-safe.
 */
export const placeholderTestimonials: UserTestimonial[] = [
  {
    name: 'Sarah Chen',
    role: 'Quantitative Analyst',
    company: 'Growth Capital',
    quote: 'QuantConnect\'s backtesting and data access cut our strategy development time in half. The LEAN engine is solid.',
    toolSlug: 'quantconnect',
    rating: 5,
  },
  {
    name: 'Marcus Johnson',
    role: 'Retail Trader',
    company: undefined,
    quote: 'TradingView\'s charting is the best I\'ve used. Real-time data and the community ideas help me spot opportunities.',
    toolSlug: 'tradingview',
    rating: 4.5,
  },
  {
    name: 'Elena Rodriguez',
    role: 'Portfolio Manager',
    company: 'Creative Wealth',
    quote: 'Wealthfront\'s tax-loss harvesting and automated rebalancing save us time. High-yield cash is a nice bonus.',
    toolSlug: 'wealthfront',
    rating: 4.5,
  },
  {
    name: 'David Park',
    role: 'Fintech Founder',
    company: 'Park Digital',
    quote: 'Alpaca\'s API made it easy to build our trading app. Commission-free and developer-friendly.',
    toolSlug: 'alpaca',
    rating: 4.5,
  },
];

interface UserTestimonialsProps {
  /** Testimonials to display; defaults to placeholder data */
  testimonials?: UserTestimonial[];
  /** Maximum number to show (default: all) */
  limit?: number;
  /** Section headline */
  headline?: string;
  /** Section description */
  description?: string;
  /** Additional class names */
  className?: string;
}

export function UserTestimonials({
  testimonials = placeholderTestimonials,
  limit,
  headline = 'What Investors Are Saying',
  description = 'Real feedback from traders and investors who use these tools daily.',
  className = '',
}: UserTestimonialsProps) {
  const items = limit ? testimonials.slice(0, limit) : testimonials;

  if (items.length === 0) return null;

  return (
    <section
      className={`mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8 ${className}`}
      aria-labelledby="testimonials-heading"
    >
      <div className="mx-auto max-w-2xl text-center">
        <h2
          id="testimonials-heading"
          className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl"
        >
          {headline}
        </h2>
        <p className="mt-2 text-slate-600 dark:text-slate-400">{description}</p>
      </div>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((testimonial, index) => (
          <UserTestimonialCard key={`${testimonial.toolSlug}-${index}`} testimonial={testimonial} />
        ))}
      </div>
    </section>
  );
}

interface UserTestimonialCardProps {
  testimonial: UserTestimonial;
}

function UserTestimonialCard({ testimonial }: UserTestimonialCardProps) {
  const tool = getToolBySlug(testimonial.toolSlug);
  const toolName = tool?.name ?? testimonial.toolSlug;

  return (
    <blockquote className="card flex flex-col p-6">
      <StarRating rating={testimonial.rating} size="sm" />
      <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
        &ldquo;{testimonial.quote}&rdquo;
      </p>
      <footer className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-1 border-t border-slate-200 pt-4 dark:border-slate-700">
        <cite className="not-italic">
          <span className="font-medium text-slate-900 dark:text-white">{testimonial.name}</span>
          <span className="text-slate-500 dark:text-slate-400">
            {testimonial.company ? `, ${testimonial.company}` : ''}
          </span>
        </cite>
        {testimonial.role && (
          <span className="text-xs text-slate-500 dark:text-slate-400">({testimonial.role})</span>
        )}
        {tool && (
          <Link
            href={`/reviews/${testimonial.toolSlug}`}
            className="mt-2 block text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
          >
            {toolName} review →
          </Link>
        )}
      </footer>
    </blockquote>
  );
}
