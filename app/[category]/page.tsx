import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/site';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ToolCard } from '@/components/ToolCard';
import { Breadcrumb } from '@/components/Breadcrumb';
import { DisclosureNote } from '@/components/DisclosureNote';
import { tools, type Category } from '@/lib/data';

/**
 * Category metadata and content configuration
 */
interface CategoryConfig {
  name: Category;
  slug: string;
  title: string;
  description: string;
  longDescription: string;
  benefits: string[];
  useCases: string[];
  icon: string;
}

const categoryConfigs: CategoryConfig[] = [
  {
    name: 'Research Workflow',
    slug: 'research-workflow',
    title: 'Research Workflow Tools',
    description: 'Explore tools for organising notes, research logs and checklists.',
    longDescription: 'Research workflow tools help keep notes, research logs and checklists organised. Compare the listed tools to find a way to structure your research materials.',
    benefits: ['Organise notes', 'Keep research logs', 'Maintain checklists'],
    useCases: ['Research notes', 'Research logs', 'Checklists'],
    icon: '📝',
  },
  {
    name: 'AI Investment Signals',
    slug: 'ai-investment-signals',
    title: 'Best AI Investment Signal Tools 2026',
    description: 'Discover top AI-powered investment signal platforms. Compare tools for trading signals, market analysis, and quantitative insights.',
    longDescription: 'AI investment signal tools leverage machine learning and data analysis to surface actionable insights for traders and investors. From sentiment analysis to pattern recognition, these platforms help bridge information asymmetries and enhance decision efficiency.',
    benefits: [
      'Real-time market sentiment analysis',
      'Pattern recognition and signal generation',
      'Reduce information asymmetry',
      'Data-backed trading insights',
      'Streamline research workflows',
    ],
    useCases: [
      'Trading signal generation',
      'Market sentiment tracking',
      'Technical analysis automation',
      'News and social sentiment',
      'Risk signal alerts',
    ],
    icon: '📊',
  },
  {
    name: 'Quantitative Platforms',
    slug: 'quantitative-platforms',
    title: 'Best Quantitative Analysis Platforms 2026',
    description: 'Explore top quantitative platforms for backtesting, algorithmic trading, and data-driven investment strategies.',
    longDescription: 'Quantitative platforms empower investors and traders with robust backtesting, strategy development, and execution tools. These platforms combine historical data, statistical models, and automation for systematic investment approaches.',
    benefits: [
      'Backtest strategies with historical data',
      'Algorithmic trading execution',
      'Quantitative modeling tools',
      'Data-driven decision support',
      'Automate research pipelines',
    ],
    useCases: [
      'Strategy backtesting',
      'Algorithmic trading',
      'Factor analysis',
      'Portfolio optimization',
      'Research automation',
    ],
    icon: '📈',
  },
  {
    name: 'Fintech Infrastructure',
    slug: 'fintech-infrastructure',
    title: 'Best Fintech Infrastructure Tools 2026',
    description: 'Find the top fintech infrastructure platforms for integrations, APIs, and financial data connectivity.',
    longDescription: 'Fintech infrastructure tools provide the building blocks for financial applications—from account aggregation and payments to compliance and data connectivity. Essential for developers and financial professionals building or integrating financial services.',
    benefits: [
      'Seamless API integrations',
      'Account aggregation and connectivity',
      'Payment infrastructure',
      'Compliance and security',
      'Accelerate fintech development',
    ],
    useCases: [
      'Account linking and verification',
      'Payment processing',
      'Financial data aggregation',
      'Compliance automation',
      'API-driven workflows',
    ],
    icon: '🔗',
  },
  {
    name: 'Crypto Tools',
    slug: 'crypto-tools',
    title: 'Best Crypto Tools 2026',
    description: 'Compare crypto tools for digital assets, market data and portfolio tracking.',
    longDescription: 'Crypto tools cover digital assets and decentralized finance. This category includes tools for crypto market research, portfolio tracking and exchange access.',
    benefits: [
      'Access to crypto markets',
      'Digital asset research',
      'Diversified asset exposure',
      'Real-time market data',
      'Innovative trading instruments',
    ],
    useCases: [
      'Crypto trading and custody',
      'Digital asset tracking',
      'DeFi integrations',
      'Portfolio tracking',
      'Market research',
    ],
    icon: '₿',
  },
  {
    name: 'Portfolio Management',
    slug: 'portfolio-management',
    title: 'Best Portfolio Management Tools 2026',
    description: 'Discover top portfolio management and robo-advisor platforms. Compare tools for automated investing and wealth management.',
    longDescription: 'Portfolio management tools help investors build, monitor, and optimize portfolios. From robo-advisors to advanced analytics, these platforms support both individual investors and financial advisors in delivering data-driven wealth management.',
    benefits: [
      'Automated portfolio rebalancing',
      'Risk-adjusted optimization',
      'Tax-loss harvesting',
      'Goal-based planning',
      'Client reporting tools',
    ],
    useCases: [
      'Automated investing',
      'Wealth management',
      'Retirement planning',
      'Tax optimization',
      'Client portfolio reporting',
    ],
    icon: '💼',
  },
];

/**
 * Map URL slug to category config
 */
function getCategoryBySlug(slug: string): CategoryConfig | undefined {
  return categoryConfigs.find((c) => c.slug === slug);
}

/**
 * Get all category slugs for static generation
 */
export function generateStaticParams() {
  return categoryConfigs.map((config) => ({
    category: config.slug,
  }));
}

interface PageProps {
  params: Promise<{ category: string }>;
}

/**
 * Generate SEO-optimized metadata for category pages
 */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category: slug } = await params;
  const config = getCategoryBySlug(slug);

  if (!config) {
    return {
      title: 'Category Not Found',
    };
  }

  return {
    title: config.title,
    description: config.description,
    openGraph: {
      title: `${config.title} | InvestLink`,
      description: config.description,
      type: 'website',
      url: `${SITE_URL}/${config.slug}`,
    },
    twitter: {
      card: 'summary_large_image',
      title: config.title,
      description: config.description,
    },
    alternates: {
      canonical: `${SITE_URL}/${config.slug}`,
    },
  };
}

export default async function CategoryPage({ params }: PageProps) {
  const { category: slug } = await params;
  const config = getCategoryBySlug(slug);

  if (!config) {
    notFound();
  }

  // Get tools in this category
  const categoryTools = tools.filter((t) => t.category === config.name);
  
  // Rank by rating, then name for ties.
  const sortedTools = [...categoryTools].sort((a, b) => b.rating - a.rating || a.name.localeCompare(b.name));

  const featuredTool = sortedTools[0];
  const otherTools = sortedTools.slice(1);

  // JSON-LD schema for category page
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: config.title,
    description: config.description,
    url: `${SITE_URL}/${config.slug}`,
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: categoryTools.length,
      itemListElement: sortedTools.map((tool, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'SoftwareApplication',
          name: tool.name,
          description: tool.tagline,
          url: `${SITE_URL}/reviews/${tool.slug}`,
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: tool.rating,
            ratingCount: tool.ratingCount,
          },
        },
      })),
    },
  };

  const breadcrumbItems = [
    { name: 'Home', href: '/' },
    { name: config.name },
  ];

  return (
    <>
      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero Section */}
      <section className="border-b border-slate-200 bg-gradient-to-br from-slate-50 to-white dark:border-slate-800 dark:from-slate-900 dark:to-slate-800">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <Breadcrumb items={breadcrumbItems} className="mb-6" />
          
          <div className="flex items-start gap-4">
            <span className="text-4xl" role="img" aria-label={config.name}>
              {config.icon}
            </span>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl lg:text-5xl">
                {config.title}
              </h1>
              <p className="mt-4 max-w-3xl text-lg text-slate-600 dark:text-slate-400">
                {config.description}
              </p>
            </div>
          </div>

          {/* Quick stats */}
          <div className="mt-8 flex flex-wrap gap-6">
            <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
              <svg className="h-5 w-5 text-primary-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span><strong>{categoryTools.length}</strong> tools reviewed</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
              <svg className="h-5 w-5 text-primary-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Updated January 2026</span>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Tool */}
      {featuredTool && (
        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              Editor&apos;s Choice
            </h2>
            <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800 dark:bg-amber-900/30 dark:text-amber-400">
              Top Rated
            </span>
          </div>
          
          <div className="mt-6 rounded-2xl border-2 border-primary-200 bg-gradient-to-br from-primary-50 to-white p-6 shadow-sm dark:border-primary-800 dark:from-primary-900/20 dark:to-slate-800 sm:p-8">
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <div className="flex items-center gap-3">
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                    {featuredTool.name}
                  </h3>
                  {featuredTool.isNew && (
                    <span className="rounded-full bg-green-600 px-2.5 py-0.5 text-xs font-medium text-white">
                      New
                    </span>
                  )}
                </div>
                <p className="mt-2 text-lg text-slate-600 dark:text-slate-400">
                  {featuredTool.tagline}
                </p>
                <p className="mt-4 text-slate-700 dark:text-slate-300">
                  {featuredTool.description}
                </p>
                
                <div className="mt-6 flex flex-wrap gap-4">
                  <Link
                    href={`/reviews/${featuredTool.slug}`}
                    className="btn-primary"
                  >
                    Read Full Review
                  </Link>
                  <a
                    href={featuredTool.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    className="btn-secondary"
                  >
                    Visit {featuredTool.name} website
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                    </svg>
                  </a>
                </div>
              </div>
              
              <div className="rounded-xl bg-white p-4 shadow-sm dark:bg-slate-700/50">
                <div className="text-center">
                  <div className="text-4xl font-bold text-primary-600 dark:text-primary-400">
                    {featuredTool.rating.toFixed(1)}
                  </div>
                  <div className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    out of 5 ({featuredTool.ratingCount.toLocaleString()} reviews)
                  </div>
                </div>
                <div className="mt-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-slate-400">Pricing</span>
                    <span className="font-medium text-slate-900 dark:text-white">{featuredTool.pricing}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-slate-400">Best for</span>
                    <span className="font-medium text-slate-900 dark:text-white">{featuredTool.bestFor}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <DisclosureNote className="mt-4" />
        </section>
      )}

      {/* All Tools Grid */}
      {otherTools.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            All {config.name} Tools
          </h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {otherTools.map((tool) => (
              <ToolCard key={tool.slug} tool={tool} />
            ))}
          </div>
        </section>
      )}

      {/* Category Info Section */}
      <section className="border-t border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2">
            {/* About this category */}
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                About {config.name} Tools
              </h2>
              <p className="mt-4 text-slate-600 dark:text-slate-400">
                {config.longDescription}
              </p>
              
              <h3 className="mt-8 text-lg font-semibold text-slate-900 dark:text-white">
                Key Benefits
              </h3>
              <ul className="mt-4 space-y-3">
                {config.benefits.map((benefit) => (
                  <li key={benefit} className="flex items-start gap-3">
                    <svg className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-500" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-slate-700 dark:text-slate-300">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Use cases */}
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                Common Use Cases
              </h2>
              <p className="mt-4 text-slate-600 dark:text-slate-400">
                {config.name} tools are commonly used for:
              </p>
              
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {config.useCases.map((useCase) => (
                  <div
                    key={useCase}
                    className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800"
                  >
                    <p className="font-medium text-slate-900 dark:text-white">{useCase}</p>
                  </div>
                ))}
              </div>

              <div className="mt-8">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                  Need help choosing?
                </h3>
                <p className="mt-2 text-slate-600 dark:text-slate-400">
                  Take our quick quiz to find the perfect {config.name.toLowerCase()} tool for your needs.
                </p>
                <Link href="/comparisons" className="btn-secondary mt-4 inline-flex">
                  Take the Quiz
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-800">
        <div className="mx-auto max-w-7xl px-4 py-12 text-center sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            Explore More Categories
          </h2>
          <p className="mt-2 text-slate-600 dark:text-slate-400">
            Discover investment tools to supercharge your workflow
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            {categoryConfigs
              .filter((c) => c.slug !== slug)
              .map((c) => (
                <Link
                  key={c.slug}
                  href={`/${c.slug}`}
                  className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:border-primary-500 hover:text-primary-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-primary-500 dark:hover:text-primary-400"
                >
                  {c.icon} {c.name}
                </Link>
              ))}
          </div>
        </div>
      </section>
    </>
  );
}
