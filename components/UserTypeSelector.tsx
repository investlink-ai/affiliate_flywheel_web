'use client';

import { useUserType } from '@/lib/hooks';
import { userTypeLabels, type UserType } from '@/lib/data';

interface UserTypeSelectorProps {
  className?: string;
  variant?: 'dropdown' | 'pills';
}

const userTypeOptions: { value: UserType; label: string; description: string }[] = [
  { value: 'individual_investor', label: 'Individual Investor', description: 'Retail investors managing personal portfolios' },
  { value: 'trader', label: 'Trader', description: 'Active day & swing traders' },
  { value: 'fintech_professional', label: 'Fintech Professional', description: 'Developers & builders in fintech' },
  { value: 'financial_advisor', label: 'Financial Advisor', description: 'Advisors & wealth managers' },
  { value: 'quantitative_analyst', label: 'Quantitative Analyst', description: 'Quant-focused users' },
];

/**
 * User type selector for personalization
 * 
 * Allows users to select their type to see personalized recommendations.
 */
export function UserTypeSelector({ className = '', variant = 'pills' }: UserTypeSelectorProps) {
  const { userType, setUserType, isReady, clearUserType } = useUserType();

  if (!isReady) {
    return (
      <div className={`animate-pulse ${className}`}>
        <div className="h-10 rounded-lg bg-slate-200 dark:bg-slate-700" />
      </div>
    );
  }

  if (variant === 'dropdown') {
    return (
      <div className={`flex items-center gap-3 ${className}`}>
        <label htmlFor="user-type" className="text-sm font-medium text-slate-700 dark:text-slate-300">
          I am a:
        </label>
        <select
          id="user-type"
          value={userType ?? ''}
          onChange={(e) => setUserType(e.target.value as UserType || null)}
          className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
        >
          <option value="">Select your role...</option>
          {userTypeOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Filter by user type">
        <span id="user-type-label" className="mr-1 text-sm font-medium text-slate-600 dark:text-slate-400">
          Show recommendations for:
        </span>
        <button
          onClick={clearUserType}
          aria-pressed={!userType}
          aria-label="Show all recommendations"
          className={`rounded-full px-3 py-1.5 text-sm font-medium transition-all ${
            !userType
              ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
          }`}
        >
          All
        </button>
        {userTypeOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => setUserType(option.value)}
            title={option.description}
            aria-pressed={userType === option.value}
            aria-label={`Show recommendations for ${option.label.toLowerCase()}: ${option.description}`}
            className={`rounded-full px-3 py-1.5 text-sm font-medium transition-all ${
              userType === option.value
                ? 'bg-primary-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
      {userType && (
        <p className="mt-2 text-xs text-slate-500 dark:text-slate-400" aria-live="polite">
          Showing personalized recommendations for {userTypeLabels[userType].toLowerCase()}.{' '}
          <button
            onClick={clearUserType}
            className="text-primary-600 hover:underline dark:text-primary-400"
            aria-label="Clear user type filter"
          >
            Clear
          </button>
        </p>
      )}
    </div>
  );
}
