import type { UserType } from '@/lib/data';

interface PersonalizationBadgeProps {
  text: string;
  userType?: UserType | null;
  variant?: 'default' | 'highlight';
}

const badgeColors: Record<UserType, string> = {
  marketer: 'bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800',
  creator: 'bg-pink-100 text-pink-700 border-pink-200 dark:bg-pink-900/30 dark:text-pink-400 dark:border-pink-800',
  solopreneur: 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800',
  agency: 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800',
  developer: 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800',
};

const highlightColors: Record<UserType, string> = {
  marketer: 'bg-gradient-to-r from-purple-500 to-purple-600 text-white',
  creator: 'bg-gradient-to-r from-pink-500 to-pink-600 text-white',
  solopreneur: 'bg-gradient-to-r from-amber-500 to-amber-600 text-white',
  agency: 'bg-gradient-to-r from-blue-500 to-blue-600 text-white',
  developer: 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white',
};

/**
 * Personalization badge component
 * Shows contextual recommendations based on user type
 */
export function PersonalizationBadge({
  text,
  userType,
  variant = 'default',
}: PersonalizationBadgeProps) {
  const colorClass = userType
    ? variant === 'highlight'
      ? highlightColors[userType]
      : badgeColors[userType]
    : 'bg-primary-100 text-primary-700 border-primary-200 dark:bg-primary-900/30 dark:text-primary-400 dark:border-primary-800';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold shadow-sm ${colorClass} ${variant === 'highlight' ? 'border-transparent' : ''}`}
    >
      <svg
        className="h-3.5 w-3.5"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path
          fillRule="evenodd"
          d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z"
          clipRule="evenodd"
        />
      </svg>
      {text}
    </span>
  );
}
