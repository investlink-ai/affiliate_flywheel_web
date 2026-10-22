interface DisclosureNoteProps {
  variant?: 'inline' | 'full';
  className?: string;
}

export function DisclosureNote({ variant = 'inline', className = '' }: DisclosureNoteProps) {
  return (
    <p className={`${variant === 'full' ? 'text-sm text-slate-600 dark:text-slate-400' : 'text-xs text-slate-500 dark:text-slate-400'} ${className}`}>
      {"InvestLink isn't paid by any product it mentions and uses no referral links. Everything here is general information, not financial advice."}
    </p>
  );
}
