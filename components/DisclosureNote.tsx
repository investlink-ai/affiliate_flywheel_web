interface DisclosureNoteProps {
  variant?: 'inline' | 'full';
  className?: string;
}

export function DisclosureNote({ variant = 'inline', className = '' }: DisclosureNoteProps) {
  if (variant === 'full') {
    return (
      <div className={`flex items-start gap-3 ${className}`}>
        <div className="flex-shrink-0">
          <svg
            className="h-5 w-5 text-amber-500"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
            />
          </svg>
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          <strong className="font-semibold text-slate-700 dark:text-slate-300">
            Affiliate Disclosure:
          </strong>{' '}
          This site contains affiliate links. I may earn a commission from qualifying purchases at no
          extra cost to you. All opinions are my own and based on genuine testing. This is not financial advice.{' '}
          <strong>This is not financial advice.</strong>
        </p>
      </div>
    );
  }

  return (
    <p className={`text-xs text-slate-500 dark:text-slate-400 ${className}`}>
      <span className="inline-flex items-center gap-1">
        <svg
          className="h-3 w-3"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244"
          />
        </svg>
        Affiliate link · Not financial advice
      </span>
    </p>
  );
}
