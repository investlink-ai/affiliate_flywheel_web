/**
 * JSON-LD Schema Generation Utilities
 * 
 * This module generates structured data (JSON-LD) for SEO purposes.
 * The schemas follow Schema.org specifications and are optimized for
 * Google's Rich Results features.
 * 
 * @module lib/schema
 * @see {@link https://schema.org} Schema.org Documentation
 * @see {@link https://developers.google.com/search/docs/appearance/structured-data} Google Structured Data
 * 
 * @example
 * ```typescript
 * import { generateReviewSchema, organizationSchema } from '@/lib/schema';
 * 
 * // Generate schema for a review page
 * const tool = await getToolBySlug('quantconnect');
 * const schema = generateReviewSchema(tool);
 * 
 * // Use in page
 * <script type="application/ld+json">
 *   {JSON.stringify(schema)}
 * </script>
 * ```
 */

import type { Tool } from './data';
import { primaryAuthor, getAuthorSchema } from './author';

/**
 * Organization schema for the website
 * 
 * This schema identifies the publishing organization and is referenced
 * by other schemas throughout the site. It includes:
 * - Organization name and URL
 * - Logo for knowledge panel
 * - Social media profiles (sameAs)
 * - Founder information
 * 
 * @constant
 * @type {object}
 * @see {@link https://schema.org/Organization} Schema.org Organization
 */
export const organizationSchema = {
  '@type': 'Organization',
  name: 'LinkInvest',
  url: 'https://linkinvest.com',
  logo: 'https://linkinvest.com/icon.svg',
  description: 'AI Investment Tool Reviews - Data-backed, in-depth reviews of AI investment tools, fintech platforms, and quantitative strategies. Empowering investors and traders with personalized recommendations.',
  sameAs: [
    'https://twitter.com/FeynmanXu',
    'https://github.com/feynmanxu',
  ],
  founder: getAuthorSchema(),
};

/**
 * Generates comprehensive JSON-LD schema for a tool review page
 * 
 * Creates a complete schema graph including:
 * - **WebPage**: The review page itself with metadata
 * - **SoftwareApplication**: The product being reviewed
 * - **Review**: The review content with ratings
 * - **BreadcrumbList**: Navigation breadcrumbs
 * - **FAQPage**: Common questions about the tool
 * 
 * This comprehensive approach maximizes the chance of appearing in
 * Google's Rich Results for reviews, products, and FAQ snippets.
 * 
 * @param {Tool} tool - The tool object containing all review data
 * @returns {object} Complete JSON-LD schema object with @context and @graph
 * 
 * @example
 * ```typescript
 * const tool = getToolBySlug('quantconnect');
 * const schema = generateReviewSchema(tool);
 * 
 * // Returns structure like:
 * // {
 * //   "@context": "https://schema.org",
 * //   "@graph": [
 * //     { "@type": "WebPage", ... },
 * //     { "@type": "SoftwareApplication", ... },
 * //     { "@type": "Review", ... },
 * //     { "@type": "BreadcrumbList", ... },
 * //     { "@type": "FAQPage", ... },
 * //   ]
 * // }
 * ```
 * 
 * @see {@link https://schema.org/Review} Schema.org Review
 * @see {@link https://developers.google.com/search/docs/appearance/structured-data/review-snippet} Google Review Snippets
 */
export function generateReviewSchema(tool: Tool) {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || 'https://linkinvest.com';
  const reviewUrl = `${siteUrl}/reviews/${tool.slug}`;
  const authorSchema = getAuthorSchema();

  // Extract numeric price for schema
  const priceMatch = tool.pricing.match(/\d+/);
  const price = priceMatch ? priceMatch[0] : '0';

  return {
    '@context': 'https://schema.org',
    '@graph': [
      // WebPage schema
      {
        '@type': 'WebPage',
        '@id': `${reviewUrl}#webpage`,
        url: reviewUrl,
        name: `${tool.name} Review 2026 - Expert Analysis by ${primaryAuthor.name}`,
        description: `In-depth ${tool.name} review by ${primaryAuthor.name}, ${primaryAuthor.title}. Comprehensive analysis of features, pricing, pros & cons based on hands-on testing.`,
        isPartOf: {
          '@type': 'WebSite',
          '@id': `${siteUrl}#website`,
          name: 'AI Investment Tools Reviews',
          url: siteUrl,
          publisher: organizationSchema,
        },
        primaryImageOfPage: {
          '@type': 'ImageObject',
          url: tool.logoUrl.startsWith('http') ? tool.logoUrl : `${siteUrl}${tool.logoUrl}`,
        },
        datePublished: tool.lastUpdated,
        dateModified: tool.lastUpdated,
        author: authorSchema,
        reviewedBy: authorSchema,
      },

      // Product schema (SoftwareApplication)
      {
        '@type': 'SoftwareApplication',
        '@id': `${reviewUrl}#product`,
        name: tool.name,
        description: tool.description,
        applicationCategory: getCategoryType(tool.category),
        operatingSystem: 'Web, iOS, Android',
        url: tool.affiliateUrl,
        image: tool.logoUrl.startsWith('http') ? tool.logoUrl : `${siteUrl}${tool.logoUrl}`,
        offers: {
          '@type': 'Offer',
          price: price,
          priceCurrency: 'USD',
          priceValidUntil: getNextYear(),
          availability: 'https://schema.org/InStock',
          seller: {
            '@type': 'Organization',
            name: tool.name.replace(' AI', '').replace('.ai', ''),
          },
        },
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: tool.rating,
          bestRating: 5,
          worstRating: 1,
          ratingCount: tool.ratingCount,
          reviewCount: tool.ratingCount,
        },
        featureList: tool.features.join(', '),
      },

      // Review schema
      {
        '@type': 'Review',
        '@id': `${reviewUrl}#review`,
        name: `${tool.name} Review`,
        headline: `${tool.name} Review 2026: ${tool.tagline}`,
        description: tool.verdict,
        reviewBody: tool.description + ' ' + tool.verdict,
        datePublished: tool.lastUpdated,
        dateModified: tool.lastUpdated,
        author: authorSchema,
        publisher: organizationSchema,
        reviewRating: {
          '@type': 'Rating',
          ratingValue: tool.rating,
          bestRating: 5,
          worstRating: 1,
        },
        itemReviewed: {
          '@id': `${reviewUrl}#product`,
        },
        positiveNotes: {
          '@type': 'ItemList',
          itemListElement: tool.pros.map((pro, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: pro,
          })),
        },
        negativeNotes: {
          '@type': 'ItemList',
          itemListElement: tool.cons.map((con, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: con,
          })),
        },
      },

      // BreadcrumbList schema
      {
        '@type': 'BreadcrumbList',
        '@id': `${reviewUrl}#breadcrumb`,
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: siteUrl,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Reviews',
            item: `${siteUrl}/reviews`,
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: `${tool.name} Review`,
            item: reviewUrl,
          },
        ],
      },

      // FAQPage schema (generated from common questions)
      {
        '@type': 'FAQPage',
        '@id': `${reviewUrl}#faq`,
        mainEntity: generateFAQSchema(tool),
      },
    ],
  };
}

/**
 * Generates FAQ schema items for a tool
 * 
 * Creates structured FAQ data from common questions users ask about
 * AI tools. The questions are dynamically generated based on tool data.
 * 
 * Generated questions include:
 * - Pricing information
 * - Value assessment (is it worth it?)
 * - Best use cases
 * - Pros and cons summary
 * 
 * @param {Tool} tool - The tool to generate FAQs for
 * @returns {object[]} Array of Question schema objects with acceptedAnswer
 * 
 * @example
 * ```typescript
 * const faqs = generateFAQSchema(tool);
 * // Returns:
 * // [
 * //   {
 * //     "@type": "Question",
 * //     "name": "How much does Jasper AI cost?",
 * //     "acceptedAnswer": {
 * //       "@type": "Answer",
 * //       "text": "QuantConnect pricing starts at..."
 * //     }
 * //   },
 * //   ...
 * // ]
 * ```
 * 
 * @see {@link https://schema.org/FAQPage} Schema.org FAQPage
 * @see {@link https://developers.google.com/search/docs/appearance/structured-data/faqpage} Google FAQ Snippets
 */
function generateFAQSchema(tool: Tool) {
  const faqs = [
    {
      question: `How much does ${tool.name} cost?`,
      answer: `${tool.name} pricing starts at ${tool.pricing}. ${tool.pricingDetails}`,
    },
    {
      question: `Is ${tool.name} worth it?`,
      answer: tool.verdict,
    },
    {
      question: `What is ${tool.name} best for?`,
      answer: `${tool.name} is best for ${tool.bestFor}. Key features include: ${tool.features.slice(0, 3).join(', ')}.`,
    },
    {
      question: `What are the pros and cons of ${tool.name}?`,
      answer: `Pros: ${tool.pros.slice(0, 2).join(', ')}. Cons: ${tool.cons.slice(0, 2).join(', ')}.`,
    },
  ];

  return faqs.map((faq) => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: faq.answer,
    },
  }));
}

/**
 * Maps tool category to Schema.org application category type
 * 
 * Converts our internal category names to the appropriate
 * Schema.org SoftwareApplication category type.
 * 
 * @param {string} category - The internal category name (e.g., 'Quantitative Platforms')
 * @returns {string} Schema.org application category (e.g., 'FinanceApplication')
 * 
 * @example
 * ```typescript
 * getCategoryType('Quantitative Platforms');  // Returns 'FinanceApplication'
 * getCategoryType('Portfolio Management');    // Returns 'FinanceApplication'
 * getCategoryType('Crypto Tools');             // Returns 'FinanceApplication'
 * getCategoryType('AI Video');     // Returns 'MultimediaApplication'
 * getCategoryType('Unknown');      // Returns 'BusinessApplication' (default)
 * ```
 * 
 * @see {@link https://schema.org/SoftwareApplication} Schema.org SoftwareApplication
 */
function getCategoryType(category: string): string {
  const categoryMap: Record<string, string> = {
    'AI Investment Signals': 'FinanceApplication',
    'Quantitative Platforms': 'FinanceApplication',
    'Fintech Infrastructure': 'FinanceApplication',
    'Crypto Tools': 'FinanceApplication',
    'Portfolio Management': 'FinanceApplication',
  };
  return categoryMap[category] ?? 'FinanceApplication';
}

/**
 * Gets the date one year from now in ISO format
 * 
 * Used for Schema.org Offer priceValidUntil field to indicate
 * how long the pricing information is expected to be valid.
 * 
 * @returns {string} ISO date string for one year from now (YYYY-MM-DD format)
 * 
 * @example
 * ```typescript
 * getNextYear(); // Returns '2027-01-30' (if today is 2026-01-30)
 * ```
 */
function getNextYear(): string {
  const date = new Date();
  date.setFullYear(date.getFullYear() + 1);
  return date.toISOString().split('T')[0] ?? '';
}

/**
 * Article schema parameters
 */
interface ArticleSchemaParams {
  /** Article headline/title */
  title: string;
  /** Article meta description */
  description: string;
  /** Full canonical URL of the article */
  url: string;
  /** Featured image URL */
  image: string;
  /** ISO date string when first published */
  datePublished: string;
  /** ISO date string when last modified */
  dateModified: string;
}

/**
 * Generates Article schema for blog posts (future use)
 * 
 * Creates a Schema.org Article schema for blog content.
 * This is separate from review content and is intended for
 * future blog/guide functionality.
 * 
 * @param {ArticleSchemaParams} article - The article metadata
 * @param {string} article.title - Article headline/title
 * @param {string} article.description - Article meta description
 * @param {string} article.url - Full canonical URL of the article
 * @param {string} article.image - Featured image URL
 * @param {string} article.datePublished - ISO date string when first published
 * @param {string} article.dateModified - ISO date string when last modified
 * @returns {object} Complete Article JSON-LD schema
 * 
 * @example
 * ```typescript
 * const articleSchema = generateArticleSchema({
 *   title: 'Best AI Writing Tools for 2026',
 *   description: 'A comprehensive guide to the top AI investment tools...',
 *   url: 'https://linkinvest.com/blog/best-ai-investment-tools',
 *   image: 'https://linkinvest.com/images/blog/ai-investment-guide.jpg',
 *   datePublished: '2026-01-15',
 *   dateModified: '2026-01-20',
 * });
 * ```
 * 
 * @see {@link https://schema.org/Article} Schema.org Article
 * @see {@link https://developers.google.com/search/docs/appearance/structured-data/article} Google Article Snippets
 */
export function generateArticleSchema(article: ArticleSchemaParams) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.description,
    url: article.url,
    image: article.image,
    datePublished: article.datePublished,
    dateModified: article.dateModified,
    author: getAuthorSchema(),
    publisher: organizationSchema,
  };
}
