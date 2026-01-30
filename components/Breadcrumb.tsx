import Link from 'next/link';

interface BreadcrumbItem {
  name: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

/**
 * Breadcrumb navigation component
 * Matches the BreadcrumbList schema structure used in review pages
 */
export function Breadcrumb({ items, className = '' }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className={`text-sm ${className}`}>
      <ol
        className="flex flex-wrap items-center gap-1.5"
        itemScope
        itemType="https://schema.org/BreadcrumbList"
      >
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          
          return (
            <li
              key={item.name}
              className="flex items-center gap-1.5"
              itemProp="itemListElement"
              itemScope
              itemType="https://schema.org/ListItem"
            >
              {index > 0 && (
                <svg
                  className="h-4 w-4 flex-shrink-0 text-slate-400 dark:text-slate-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              )}
              
              {isLast || !item.href ? (
                <span
                  className="text-slate-600 dark:text-slate-400"
                  itemProp="name"
                  aria-current={isLast ? 'page' : undefined}
                >
                  {item.name}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="text-slate-600 transition-colors hover:text-primary-600 dark:text-slate-400 dark:hover:text-primary-400"
                  itemProp="item"
                >
                  <span itemProp="name">{item.name}</span>
                </Link>
              )}
              
              <meta itemProp="position" content={String(index + 1)} />
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

/**
 * Generate breadcrumb items for a review page
 */
export function getReviewBreadcrumbs(toolName: string): BreadcrumbItem[] {
  return [
    { name: 'Home', href: '/' },
    { name: 'Reviews', href: '/reviews' },
    { name: `${toolName} Review` },
  ];
}

/**
 * Generate breadcrumb items for a category page
 */
export function getCategoryBreadcrumbs(category: string): BreadcrumbItem[] {
  return [
    { name: 'Home', href: '/' },
    { name: 'Reviews', href: '/reviews' },
    { name: category },
  ];
}

/**
 * Generate breadcrumb items for comparison page
 */
export function getComparisonBreadcrumbs(): BreadcrumbItem[] {
  return [
    { name: 'Home', href: '/' },
    { name: 'Comparisons' },
  ];
}
