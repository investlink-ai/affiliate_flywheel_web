interface DisclosureNoteProps {
  variant?: 'inline' | 'full';
  className?: string;
}

export function DisclosureNote({ variant = 'inline', className = '' }: DisclosureNoteProps) {
  return (
    <p className={`${variant === 'full' ? 'text-sm text-slate-600 dark:text-slate-400' : 'text-xs text-slate-500 dark:text-slate-400'} ${className}`}>
      InvestLink does not use referral links and is not paid by the products it reviews. Content is general information only, not personal financial advice.
    </p>
  );
}
