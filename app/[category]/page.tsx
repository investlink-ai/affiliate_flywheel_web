import type { Metadata } from 'next';
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
    name: 'AI Writing',
    slug: 'ai-writing',
    title: 'Best AI Writing Tools 2026',
    description: 'Discover the top AI writing assistants for content creation, copywriting, and marketing. Compare features, pricing, and find your perfect writing tool.',
    longDescription: 'AI writing tools have revolutionized content creation, helping marketers, creators, and businesses produce high-quality content faster than ever. From blog posts to ad copy, these tools leverage advanced language models to generate, edit, and optimize text.',
    benefits: [
      'Write content 10x faster',
      'Overcome writer\'s block instantly',
      'Maintain consistent brand voice',
      'Generate SEO-optimized content',
      'Scale content production effortlessly',
    ],
    useCases: [
      'Blog posts and articles',
      'Marketing copy and ads',
      'Social media content',
      'Email campaigns',
      'Product descriptions',
    ],
    icon: '✍️',
  },
  {
    name: 'AI Voice',
    slug: 'ai-voice',
    title: 'Best AI Voice Tools 2026',
    description: 'Explore top AI voice generators and text-to-speech tools. Create professional voiceovers, podcasts, and audio content with natural-sounding AI voices.',
    longDescription: 'AI voice technology has made professional audio content accessible to everyone. These tools can generate human-like voiceovers in multiple languages and accents, perfect for videos, podcasts, e-learning, and more.',
    benefits: [
      'Create voiceovers without a recording studio',
      'Access 100+ voices and accents',
      'Produce content in multiple languages',
      'Save thousands on voice talent',
      'Generate audio content in minutes',
    ],
    useCases: [
      'YouTube video narration',
      'Podcast production',
      'E-learning courses',
      'Audiobook creation',
      'IVR and phone systems',
    ],
    icon: '🎙️',
  },
  {
    name: 'AI Images',
    slug: 'ai-images',
    title: 'Best AI Image Tools 2026',
    description: 'Find the best AI image generators for creating stunning visuals. Compare text-to-image tools for marketing, design, and creative projects.',
    longDescription: 'AI image generation has transformed visual content creation. From marketing materials to concept art, these tools can create stunning visuals from simple text prompts, democratizing design for everyone.',
    benefits: [
      'Create unique images from text',
      'Generate unlimited variations',
      'No design skills required',
      'Produce commercial-use artwork',
      'Rapid prototyping and ideation',
    ],
    useCases: [
      'Social media graphics',
      'Marketing materials',
      'Concept art and illustrations',
      'Product mockups',
      'Presentation visuals',
    ],
    icon: '🎨',
  },
  {
    name: 'AI Video',
    slug: 'ai-video',
    title: 'Best AI Video Tools 2026',
    description: 'Discover top AI video creation and editing tools. From text-to-video to automated editing, find the perfect tool for your video production needs.',
    longDescription: 'AI video tools are revolutionizing video production, making it possible to create professional videos without expensive equipment or extensive editing skills. From automated editing to text-to-video generation, these tools are changing how we create visual content.',
    benefits: [
      'Create videos from text prompts',
      'Automate tedious editing tasks',
      'Generate professional results quickly',
      'No video editing experience needed',
      'Scale video content production',
    ],
    useCases: [
      'Marketing videos and ads',
      'Social media content',
      'Educational videos',
      'Product demonstrations',
      'Explainer videos',
    ],
    icon: '🎬',
  },
  {
    name: 'AI Productivity',
    slug: 'ai-productivity',
    title: 'Best AI Productivity Tools 2026',
    description: 'Boost your workflow with the best AI productivity tools. Compare AI assistants, automation tools, and workspace enhancers for maximum efficiency.',
    longDescription: 'AI productivity tools help you work smarter, not harder. From intelligent assistants that answer complex questions to automation tools that handle repetitive tasks, these solutions are essential for modern knowledge workers.',
    benefits: [
      'Automate repetitive tasks',
      'Get instant answers to complex questions',
      'Summarize documents in seconds',
      'Streamline team collaboration',
      'Enhance decision-making with AI insights',
    ],
    useCases: [
      'Research and analysis',
      'Meeting notes and summaries',
      'Email management',
      'Project documentation',
      'Knowledge management',
    ],
    icon: '⚡',
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
      title: `${config.title} | AI Tool Reviews`,
      description: config.description,
      type: 'website',
      url: `https://aitoolreviews.com/${config.slug}`,
    },
    twitter: {
      card: 'summary_large_image',
      title: config.title,
      description: config.description,
    },
    alternates: {
      canonical: `https://aitoolreviews.com/${config.slug}`,
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
  
  // Sort by rating, then by exclusive deals
  const sortedTools = [...categoryTools].sort((a, b) => {
    if (a.hasExclusiveDeal && !b.hasExclusiveDeal) return -1;
    if (!a.hasExclusiveDeal && b.hasExclusiveDeal) return 1;
    return b.rating - a.rating;
  });

  // Featured tool (highest rated with exclusive deal, or just highest rated)
  const featuredTool = sortedTools[0];
  const otherTools = sortedTools.slice(1);

  // JSON-LD schema for category page
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: config.title,
    description: config.description,
    url: `https://aitoolreviews.com/${config.slug}`,
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
          url: `https://aitoolreviews.com/reviews/${tool.slug}`,
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
            {categoryTools.some(t => t.hasExclusiveDeal) && (
              <div className="flex items-center gap-2 text-sm text-amber-600 dark:text-amber-400">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                  <path fillRule="evenodd" d="M5 2a2 2 0 00-2 2v14l3.5-2 3.5 2 3.5-2 3.5 2V4a2 2 0 00-2-2H5zm2.5 3a1.5 1.5 0 100 3 1.5 1.5 0 000-3zm6.207.293a1 1 0 00-1.414 0l-6 6a1 1 0 101.414 1.414l6-6a1 1 0 000-1.414zM12.5 10a1.5 1.5 0 100 3 1.5 1.5 0 000-3z" clipRule="evenodd" />
                </svg>
                <span><strong>Exclusive deals</strong> available</span>
              </div>
            )}
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
                  {featuredTool.hasExclusiveDeal && (
                    <span className="rounded-full bg-amber-500 px-2.5 py-0.5 text-xs font-medium text-white">
                      Exclusive Deal
                    </span>
                  )}
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
                    href={featuredTool.affiliateUrl}
                    target="_blank"
                    rel="sponsored noopener"
                    className="btn-secondary"
                  >
                    Try {featuredTool.name}
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
                  {featuredTool.commissionRate && featuredTool.commissionRate > 0 && (
                    <div className="flex justify-between">
                      <span className="text-slate-500 dark:text-slate-400">Commission</span>
                      <span className="font-medium text-green-600 dark:text-green-400">Up to {featuredTool.commissionRate}%</span>
                    </div>
                  )}
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
            Discover other AI tools to supercharge your workflow
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
