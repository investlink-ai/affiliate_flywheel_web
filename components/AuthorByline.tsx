import Link from 'next/link';
import { primaryAuthor, type Author } from '@/lib/author';

interface AuthorBylineProps {
  author?: Author;
  /** Display variant */
  variant?: 'inline' | 'card' | 'compact';
  /** Show social links */
  showSocial?: boolean;
  /** Last updated date */
  dateUpdated?: string;
  /** Last verified date for accuracy */
  dateVerified?: string;
  /** Show expertise badges */
  showExpertise?: boolean;
}

/**
 * Author byline component for EEAT signals
 * Displays author credentials, expertise, and social proof
 */
export function AuthorByline({
  author = primaryAuthor,
  variant = 'inline',
  showSocial = false,
  dateUpdated,
  dateVerified,
  showExpertise = false,
}: AuthorBylineProps) {
  if (variant === 'compact') {
    return (
      <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
        <span>Reviewed by</span>
        <Link
          href="/about"
          className="font-medium text-slate-700 hover:text-primary-600 dark:text-slate-300 dark:hover:text-primary-400"
        >
          {author.name}
        </Link>
        {dateUpdated && (
          <>
            <span>•</span>
            <time dateTime={dateUpdated}>
              Updated {formatDate(dateUpdated)}
            </time>
          </>
        )}
      </div>
    );
  }

  if (variant === 'card') {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
        <div className="flex items-start gap-4">
          {/* Author Avatar */}
          <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-accent-500 text-2xl font-bold text-white">
            {author.name.split(' ').map(n => n[0]).join('')}
          </div>
          
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-slate-900 dark:text-white">
                {author.name}
              </h3>
              {/* Verified badge */}
              <span className="inline-flex items-center gap-1 rounded-full bg-primary-100 px-2 py-0.5 text-xs font-medium text-primary-700 dark:bg-primary-900/30 dark:text-primary-400">
                <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                  <path
                    fillRule="evenodd"
                    d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                Verified Expert
              </span>
            </div>
            
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {author.title} • {author.location}
            </p>
            
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
              {author.bio}
            </p>

            {/* Expertise badges */}
            {showExpertise && (
              <div className="mt-3 flex flex-wrap gap-2">
                {author.expertise.slice(0, 3).map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs text-slate-600 dark:bg-slate-700 dark:text-slate-400"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            )}

            {/* Social links */}
            {showSocial && (
              <div className="mt-3 flex items-center gap-3">
                {author.socialProfiles.twitter && (
                  <a
                    href={author.socialProfiles.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                    aria-label={`Follow ${author.name} on Twitter`}
                  >
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  </a>
                )}
                {author.socialProfiles.linkedin && (
                  <a
                    href={author.socialProfiles.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                    aria-label={`Connect with ${author.name} on LinkedIn`}
                  >
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                  </a>
                )}
                <Link
                  href="/about"
                  className="text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
                >
                  Learn more →
                </Link>
              </div>
            )}
          </div>
        </div>

        {dateUpdated && (
          <div className="mt-4 border-t border-slate-200 pt-4 dark:border-slate-700">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Last updated: <time dateTime={dateUpdated}>{formatDate(dateUpdated)}</time>
            </p>
          </div>
        )}
      </div>
    );
  }

  // Default inline variant
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
      <div className="flex items-center gap-2">
        {/* Small avatar */}
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-accent-500 text-xs font-bold text-white">
          {author.name.split(' ').map(n => n[0]).join('')}
        </div>
        <div>
          <p className="font-medium text-slate-900 dark:text-white">
            Reviewed by{' '}
            <Link href="/about" className="text-primary-600 hover:underline dark:text-primary-400">
              {author.name}
            </Link>
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {author.title}
          </p>
        </div>
      </div>

      {dateUpdated && (
        <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <time dateTime={dateUpdated}>Updated {formatDate(dateUpdated)}</time>
        </div>
      )}

      {/* Verified date - separate from updated */}
      {dateVerified && (
        <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
          <svg className="h-4 w-4 text-blue-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
          </svg>
          <time dateTime={dateVerified} className="text-xs">Verified {formatDate(dateVerified)}</time>
        </div>
      )}

      {/* Trust signals */}
      <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
        <svg className="h-4 w-4 text-green-500" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
          <path
            fillRule="evenodd"
            d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
            clipRule="evenodd"
          />
        </svg>
        <span className="text-xs">Hands-on tested</span>
      </div>
    </div>
  );
}

/**
 * Format date to readable string
 */
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
