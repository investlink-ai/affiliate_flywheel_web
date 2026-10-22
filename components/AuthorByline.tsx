import Link from 'next/link';
import { primaryAuthor, type Author } from '@/lib/author';

interface AuthorBylineProps {
  author?: Author;
  variant?: 'inline' | 'card' | 'compact';
  showSocial?: boolean;
  dateUpdated?: string;
  dateVerified?: string;
}

export function AuthorByline({
  author = primaryAuthor,
  variant = 'inline',
  showSocial = false,
  dateUpdated,
  dateVerified,
}: AuthorBylineProps) {
  return (
    <div className={variant === 'card'
      ? 'rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800'
      : 'flex flex-wrap items-center gap-3 text-sm text-slate-600 dark:text-slate-400'}>
      <Link href="/about" className="font-medium text-primary-600 hover:underline dark:text-primary-400">
        Reviewed by {author.name}
      </Link>
      {variant === 'card' && (
        <>
          <h3 className="mt-3 font-semibold text-slate-900 dark:text-white">{author.name}</h3>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{author.description}</p>
          {showSocial && (
            <a href={author.socialProfiles.twitter} target="_blank" rel="noopener noreferrer"
              className="mt-3 inline-block text-sm text-primary-600 hover:underline dark:text-primary-400">
              Follow @investlink_ai on X
            </a>
          )}
        </>
      )}
      {dateUpdated && (
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Updated <time dateTime={dateUpdated}>{formatDate(dateUpdated)}</time>
        </p>
      )}
      {dateVerified && (
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Verified <time dateTime={dateVerified}>{formatDate(dateVerified)}</time>
        </p>
      )}
    </div>
  );
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
