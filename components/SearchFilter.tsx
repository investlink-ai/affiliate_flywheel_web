'use client';

import { useCallback, useTransition } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { categories, type Category } from '@/lib/data';

interface SearchFilterProps {
  /** Initial search query (from URL) */
  initialQuery?: string;
  /** Initial category (from URL) */
  initialCategory?: Category;
  /** Total results count to display */
  resultsCount?: number;
}

/**
 * Search and category filter component
 * 
 * Uses URL params for state to maintain SEO and shareability.
 * Debounced search input to avoid excessive navigation.
 */
export function SearchFilter({
  initialQuery = '',
  initialCategory = 'All',
  resultsCount,
}: SearchFilterProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  // Get current values from URL
  const currentQuery = searchParams.get('q') ?? initialQuery;
  const currentCategory = (searchParams.get('category') as Category) ?? initialCategory;

  /**
   * Update URL params without full page reload
   */
  const updateParams = useCallback(
    (updates: { q?: string; category?: string }) => {
      const params = new URLSearchParams(searchParams.toString());

      // Update or remove params
      Object.entries(updates).forEach(([key, value]) => {
        if (value && value !== '' && value !== 'All') {
          params.set(key, value);
        } else {
          params.delete(key);
        }
      });

      startTransition(() => {
        router.push(`${pathname}?${params.toString()}`, { scroll: false });
      });
    },
    [pathname, router, searchParams]
  );

  /**
   * Handle search input change with debounce
   */
  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      updateParams({ q: value });
    },
    [updateParams]
  );

  /**
   * Handle category tab click
   */
  const handleCategoryChange = useCallback(
    (category: Category) => {
      updateParams({ category });
    },
    [updateParams]
  );

  /**
   * Clear all filters
   */
  const clearFilters = useCallback(() => {
    startTransition(() => {
      router.push(pathname, { scroll: false });
    });
  }, [pathname, router]);

  const hasFilters = currentQuery || currentCategory !== 'All';

  return (
    <div className="space-y-4">
      {/* Search Input */}
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
          <svg
            className={`h-5 w-5 ${isPending ? 'animate-spin text-primary-500' : 'text-slate-400'}`}
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
          >
            {isPending ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
              />
            )}
          </svg>
        </div>
        <input
          type="search"
          placeholder="Search tools by name, features, or use case..."
          defaultValue={currentQuery}
          onChange={handleSearchChange}
          className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-12 pr-4 text-slate-900 placeholder:text-slate-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500"
          aria-label="Search AI tools"
        />
        {currentQuery && (
          <button
            onClick={() => updateParams({ q: '' })}
            className="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
            aria-label="Clear search"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="mr-2 text-sm font-medium text-slate-500 dark:text-slate-400">
          Category:
        </span>
        <div className="flex flex-wrap gap-2" role="tablist" aria-label="Filter by category">
          {categories.map((category) => {
            const isActive = category === currentCategory;
            return (
              <button
                key={category}
                onClick={() => handleCategoryChange(category)}
                role="tab"
                aria-selected={isActive}
                className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-primary-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>
      </div>

      {/* Results count and clear filters */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        {resultsCount !== undefined && (
          <p 
            className="text-sm text-slate-500 dark:text-slate-400"
            aria-live="polite"
            aria-atomic="true"
          >
            {resultsCount === 0 ? (
              'No tools found'
            ) : (
              <>
                Showing <span className="font-medium text-slate-700 dark:text-slate-300">{resultsCount}</span>{' '}
                {resultsCount === 1 ? 'tool' : 'tools'}
              </>
            )}
            {/* Screen reader only: announce filter context */}
            {hasFilters && (
              <span className="sr-only">
                {currentQuery && ` matching "${currentQuery}"`}
                {currentCategory !== 'All' && ` in ${currentCategory} category`}
              </span>
            )}
          </p>
        )}
        {hasFilters && (
          <button
            onClick={clearFilters}
            className="text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
          >
            Clear filters
          </button>
        )}
      </div>
    </div>
  );
}

/**
 * Static export of categories for server components
 */
export { categories };
