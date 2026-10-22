import type { MetadataRoute } from 'next';
import { getAllToolSlugs } from '@/lib/data';

import { SITE_URL } from '@/lib/site';

/** Category page slugs */
const categorySlugs = [
  'ai-investment-signals',
  'quantitative-platforms',
  'fintech-infrastructure',
  'crypto-tools',
  'portfolio-management',
  'research-workflow',
];

export default function sitemap(): MetadataRoute.Sitemap {
  const toolSlugs = getAllToolSlugs();

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${SITE_URL}/reviews`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/comparisons`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];

  // Category landing pages
  const categoryPages: MetadataRoute.Sitemap = categorySlugs.map((slug) => ({
    url: `${SITE_URL}/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.85,
  }));

  // Dynamic review pages
  const reviewPages: MetadataRoute.Sitemap = toolSlugs.map((slug) => ({
    url: `${SITE_URL}/reviews/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  return [...staticPages, ...categoryPages, ...reviewPages];
}
