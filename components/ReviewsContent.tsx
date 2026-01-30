'use client';

import { useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { SearchFilter } from './SearchFilter';
import { UserTypeSelector } from './UserTypeSelector';
import { ToolCardPersonalized } from './ToolCardPersonalized';
import { useUserType } from '@/lib/hooks';
import { filterTools, type Category } from '@/lib/data';

interface ReviewsContentProps {
  /** Initial search query from URL */
  initialQuery?: string;
  /** Initial category from URL */
  initialCategory?: Category;
}

/**
 * Client component for reviews page with filtering and personalization
 * 
 * Handles:
 * - Search filtering via URL params (SEO-friendly)
 * - Category tabs
 * - User type personalization
 */
export function ReviewsContent({
  initialQuery = '',
  initialCategory = 'All',
}: ReviewsContentProps) {
  const searchParams = useSearchParams();
  const { userType } = useUserType();

  // Get current filter values from URL
  const query = searchParams.get('q') ?? initialQuery;
  const category = (searchParams.get('category') as Category) ?? initialCategory;

  // Filter tools (client-side for reactivity)
  const filteredTools = useMemo(() => {
    return filterTools(query, category);
  }, [query, category]);

  // Sort tools: prioritize those matching user type
  const sortedTools = useMemo(() => {
    if (!userType) return filteredTools;

    return [...filteredTools].sort((a, b) => {
      const aHasMatch = a.recommendations?.[userType] ? 1 : 0;
      const bHasMatch = b.recommendations?.[userType] ? 1 : 0;
      return bHasMatch - aHasMatch; // Tools with matching recommendations first
    });
  }, [filteredTools, userType]);

  return (
    <div className="space-y-8">
      {/* Filters Section */}
      <div className="space-y-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <SearchFilter
          initialQuery={initialQuery}
          initialCategory={initialCategory}
          resultsCount={filteredTools.length}
        />
        
        {/* Personalization Selector */}
        <div className="border-t border-slate-200 pt-4 dark:border-slate-700">
          <UserTypeSelector />
        </div>
      </div>

      {/* Results Grid */}
      {sortedTools.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {sortedTools.map((tool) => (
            <ToolCardPersonalized key={tool.slug} tool={tool} enableABTest={true} />
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-12 text-center dark:border-slate-700 dark:bg-slate-800/50">
          <svg
            className="mx-auto h-12 w-12 text-slate-400"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
            />
          </svg>
          <h3 className="mt-4 text-lg font-semibold text-slate-900 dark:text-white">
            No tools found
          </h3>
          <p className="mt-2 text-slate-600 dark:text-slate-400">
            Try adjusting your search or filter to find what you&apos;re looking for.
          </p>
        </div>
      )}
    </div>
  );
}
