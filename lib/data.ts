export type UserType = 'marketer' | 'creator' | 'solopreneur' | 'agency' | 'developer';

export interface Tool {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  logoUrl: string;
  rating: number;
  ratingCount: number;
  category: string;
  pricing: string;
  pricingDetails: string;
  affiliateUrl: string;
  features: string[];
  pros: string[];
  cons: string[];
  verdict: string;
  bestFor: string;
  lastUpdated: string;
  /** Date the review was last verified for accuracy */
  lastVerified: string;
  /** User types this tool is recommended for, with optional badge text */
  recommendations?: Partial<Record<UserType, string>>;
  /** Affiliate cookie duration in days */
  cookieDuration?: number;
  /** Commission rate percentage */
  commissionRate?: number;
  /** Whether we have an exclusive deal or higher commission */
  hasExclusiveDeal?: boolean;
  /** Tool is newly added (within 30 days) */
  isNew?: boolean;
  /** Screenshots of the tool interface */
  screenshots?: string[];
  /** YouTube video review URL */
  videoReviewUrl?: string;
}

/** All available categories */
export const categories = ['All', 'AI Writing', 'AI Voice', 'AI Images', 'AI Video', 'AI Productivity'] as const;
export type Category = (typeof categories)[number];

/** User type display labels */
export const userTypeLabels: Record<UserType, string> = {
  marketer: 'Marketers',
  creator: 'Creators',
  solopreneur: 'Solopreneurs',
  agency: 'Agencies',
  developer: 'Developers',
};

export const tools: Tool[] = [
  {
    slug: 'jasper-ai',
    name: 'Jasper AI',
    tagline: 'AI-powered writing assistant for marketing teams',
    description:
      'Jasper AI is a powerful AI writing assistant designed specifically for marketers and content creators. It helps you create high-converting copy, blog posts, social media content, and more in minutes instead of hours.',
    logoUrl: '/images/tools/jasper-logo.svg',
    rating: 4.8,
    ratingCount: 2547,
    category: 'AI Writing',
    pricing: 'From $49/mo',
    pricingDetails: 'Creator plan starts at $49/mo. Teams plan at $125/mo. Business pricing available.',
    affiliateUrl: 'https://jasper.ai',
    features: [
      '50+ AI writing templates',
      'Brand voice customization',
      'SEO mode with Surfer integration',
      'Chrome extension',
      'Team collaboration tools',
      'Art generation with Jasper Art',
      'Chat interface for conversations',
      'API access on higher plans',
    ],
    pros: [
      'Excellent output quality for marketing copy',
      'Strong brand voice training',
      'Comprehensive template library',
      'Great for team collaboration',
      'Regular feature updates',
    ],
    cons: [
      'Higher price point than competitors',
      'Learning curve for advanced features',
      'Word limits on lower plans',
      'Art generation is separate add-on',
    ],
    verdict:
      'Jasper AI is the gold standard for marketing teams who need consistent, on-brand content at scale. While the pricing is premium, the output quality and team features justify the investment for serious content operations.',
    bestFor: 'Marketing teams and agencies',
    lastUpdated: '2026-01-15',
    lastVerified: '2026-01-28',
    recommendations: {
      marketer: 'Best for Marketers',
      agency: 'Top Pick for Agencies',
    },
    cookieDuration: 30,
    commissionRate: 30,
    hasExclusiveDeal: false,
    screenshots: [
      '/images/screenshots/jasper-dashboard.png',
      '/images/screenshots/jasper-editor.png',
      '/images/screenshots/jasper-templates.png',
    ],
    videoReviewUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', // Placeholder - replace with actual review
  },
  {
    slug: 'copy-ai',
    name: 'Copy.ai',
    tagline: 'AI copywriting made simple for everyone',
    description:
      'Copy.ai makes AI copywriting accessible to everyone with its intuitive interface and generous free tier. Perfect for solopreneurs and small businesses who need quick, effective copy without a steep learning curve.',
    logoUrl: '/images/tools/copyai-logo.svg',
    rating: 4.6,
    ratingCount: 1893,
    category: 'AI Writing',
    pricing: 'Free / $49/mo',
    pricingDetails: 'Free plan with 2,000 words/mo. Pro plan at $49/mo with unlimited words.',
    affiliateUrl: 'https://copy.ai',
    features: [
      '90+ copywriting tools',
      'Unlimited words on Pro',
      'Brand voice feature',
      '25+ languages',
      'Workflows for automation',
      'Infobase for context',
      'Team features',
      'API access',
    ],
    pros: [
      'Generous free tier to start',
      'Very intuitive interface',
      'Unlimited words on Pro plan',
      'Great for quick copy tasks',
      'Strong workflow automation',
    ],
    cons: [
      'Output can be generic sometimes',
      'Less specialized than Jasper for marketing',
      'Limited brand voice on free plan',
      'Fewer integrations than competitors',
    ],
    verdict:
      'Copy.ai is the best entry point into AI writing tools. The free tier lets you test extensively, and the Pro plan offers unlimited generation at a fair price. Ideal for solopreneurs and small teams.',
    bestFor: 'Solopreneurs and small businesses',
    lastUpdated: '2026-01-20',
    lastVerified: '2026-01-28',
    recommendations: {
      solopreneur: 'Best for Solopreneurs',
      creator: 'Great for Creators',
    },
    cookieDuration: 60,
    commissionRate: 45,
    hasExclusiveDeal: true,
    screenshots: [
      '/images/screenshots/copyai-dashboard.png',
      '/images/screenshots/copyai-workflows.png',
    ],
  },
  {
    slug: 'murf-ai',
    name: 'Murf AI',
    tagline: 'Studio-quality AI voiceovers in minutes',
    description:
      'Murf AI transforms text into natural-sounding voiceovers with over 120 AI voices across 20+ languages. Perfect for creators who need professional audio without hiring voice talent.',
    logoUrl: '/images/tools/murf-logo.svg',
    rating: 4.7,
    ratingCount: 1256,
    category: 'AI Voice',
    pricing: 'Free / $29/mo',
    pricingDetails: 'Free plan with 10 min/mo. Creator plan at $29/mo with 24 hours/year.',
    affiliateUrl: 'https://murf.ai',
    features: [
      '120+ AI voices',
      '20+ languages & accents',
      'Voice cloning (Enterprise)',
      'Video editor built-in',
      'Background music library',
      'Team collaboration',
      'API access',
      'Commercial usage rights',
    ],
    pros: [
      'Most natural-sounding voices available',
      'Excellent video editing integration',
      'Great variety of voices and accents',
      'Easy to use interface',
      'Commercial license included',
    ],
    cons: [
      'Voice cloning only on Enterprise',
      'Time-based limits feel restrictive',
      'Some voices better than others',
      'No real-time voice generation',
    ],
    verdict:
      'Murf AI is the clear leader in AI voiceover quality. The voices sound remarkably natural, and the built-in video editor makes it a complete solution for content creators. Worth the investment for anyone doing regular video content.',
    bestFor: 'Video creators and course makers',
    lastUpdated: '2026-01-18',
    lastVerified: '2026-01-28',
    recommendations: {
      creator: 'Best for Video Creators',
      marketer: 'Great for Ad Voiceovers',
    },
    cookieDuration: 30,
    commissionRate: 25,
    hasExclusiveDeal: false,
  },
  {
    slug: 'notion-ai',
    name: 'Notion AI',
    tagline: 'AI-powered workspace for notes, docs, and projects',
    description:
      'Notion AI brings powerful AI capabilities directly into your workspace. Write, summarize, brainstorm, translate, and organize information without leaving Notion. Perfect for teams already using Notion who want to supercharge their productivity.',
    logoUrl: '/images/tools/notion-logo.svg',
    rating: 4.7,
    ratingCount: 3421,
    category: 'AI Productivity',
    pricing: 'From $10/mo add-on',
    pricingDetails: 'Notion AI is $10/member/month add-on to any Notion plan. Requires existing Notion subscription.',
    affiliateUrl: 'https://notion.so',
    features: [
      'AI writing assistance in documents',
      'Summarize pages and databases',
      'Translate to 10+ languages',
      'Extract action items from notes',
      'Generate content from prompts',
      'Fix spelling and grammar',
      'Change tone and style',
      'Explain complex concepts',
    ],
    pros: [
      'Seamless integration with Notion workspace',
      'No context-switching needed',
      'Great for summarizing long documents',
      'Useful for team knowledge bases',
      'Affordable per-user pricing',
    ],
    cons: [
      'Requires existing Notion subscription',
      'Less powerful than dedicated AI writers',
      'Limited to Notion ecosystem',
      'No standalone usage possible',
    ],
    verdict:
      'Notion AI is the perfect addition for existing Notion users. It won\'t replace dedicated AI writing tools for heavy content creation, but for everyday productivity tasks within your workspace, it\'s incredibly useful and well-priced.',
    bestFor: 'Teams already using Notion',
    lastUpdated: '2026-01-25',
    lastVerified: '2026-01-28',
    recommendations: {
      solopreneur: 'Great for Solopreneurs',
      agency: 'Useful for Agency Workflows',
      developer: 'Popular with Dev Teams',
    },
    cookieDuration: 90,
    commissionRate: 20,
    hasExclusiveDeal: false,
    isNew: true,
  },
  {
    slug: 'claude-ai',
    name: 'Claude',
    tagline: 'Thoughtful AI assistant by Anthropic',
    description:
      'Claude by Anthropic is a next-generation AI assistant known for nuanced understanding, longer context windows, and more thoughtful responses. Excels at analysis, coding, and complex reasoning tasks where other AIs struggle.',
    logoUrl: '/images/tools/claude-logo.svg',
    rating: 4.9,
    ratingCount: 4892,
    category: 'AI Writing',
    pricing: 'Free / $20/mo',
    pricingDetails: 'Free tier with usage limits. Claude Pro at $20/mo for priority access and higher limits.',
    affiliateUrl: 'https://claude.ai',
    features: [
      '200K token context window',
      'Advanced reasoning capabilities',
      'Code generation and review',
      'Document analysis and summarization',
      'Artifacts for interactive outputs',
      'Projects for persistent context',
      'API access available',
      'Enterprise security options',
    ],
    pros: [
      'Best-in-class reasoning and analysis',
      'Massive context window (200K tokens)',
      'More nuanced and thoughtful responses',
      'Excellent at following complex instructions',
      'Strong coding capabilities',
    ],
    cons: [
      'Can be slower than competitors',
      'More conservative/cautious responses',
      'Smaller ecosystem than ChatGPT',
      'API pricing higher for heavy usage',
    ],
    verdict:
      'Claude represents the cutting edge of AI assistants. For tasks requiring deep analysis, complex reasoning, or working with long documents, Claude outperforms alternatives. The Pro plan is essential for serious users who need reliable access.',
    bestFor: 'Knowledge workers and developers',
    lastUpdated: '2026-01-28',
    lastVerified: '2026-01-28',
    recommendations: {
      developer: 'Best for Developers',
      creator: 'Great for Writers',
      agency: 'Excellent for Research',
    },
    cookieDuration: 30,
    commissionRate: 0, // No public affiliate program
    hasExclusiveDeal: false,
    isNew: true,
    screenshots: [
      '/images/screenshots/claude-chat.png',
      '/images/screenshots/claude-artifacts.png',
      '/images/screenshots/claude-projects.png',
    ],
    videoReviewUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', // Placeholder - replace with actual review
  },
  {
    slug: 'midjourney',
    name: 'Midjourney',
    tagline: 'Create stunning AI-generated artwork',
    description:
      'Midjourney is the leading AI image generator known for its distinctive artistic style and exceptional quality. Generate stunning visuals from text prompts, perfect for marketing materials, concept art, and creative projects.',
    logoUrl: '/images/tools/midjourney-logo.svg',
    rating: 4.8,
    ratingCount: 8934,
    category: 'AI Images',
    pricing: 'From $10/mo',
    pricingDetails: 'Basic plan at $10/mo (200 images). Standard at $30/mo (15 hrs fast). Pro at $60/mo (30 hrs fast).',
    affiliateUrl: 'https://midjourney.com',
    features: [
      'Industry-leading image quality',
      'Unique artistic aesthetic',
      'Discord-based interface',
      'Web interface (Alpha)',
      'Image variations and upscaling',
      'Style consistency with references',
      'Remix and blend modes',
      'Commercial usage rights',
    ],
    pros: [
      'Unmatched aesthetic quality',
      'Great for artistic and creative work',
      'Active community for inspiration',
      'Regular model improvements',
      'Commercial license included',
    ],
    cons: [
      'Discord-only interface (web in alpha)',
      'Learning curve for prompting',
      'No API access yet',
      'Less precise for specific requests',
    ],
    verdict:
      'Midjourney remains the gold standard for AI art generation. While the Discord interface takes getting used to, the output quality is unmatched for creative and marketing visuals. Essential tool for anyone creating visual content.',
    bestFor: 'Artists, designers, and marketers',
    lastUpdated: '2026-01-22',
    lastVerified: '2026-01-28',
    recommendations: {
      creator: 'Best for Creators',
      marketer: 'Great for Visual Marketing',
      agency: 'Agency Favorite',
    },
    cookieDuration: 0, // No affiliate program
    commissionRate: 0,
    hasExclusiveDeal: false,
    isNew: true,
  },
  {
    slug: 'runway-ml',
    name: 'Runway ML',
    tagline: 'AI-powered creative tools for video',
    description:
      'Runway ML is the premier AI platform for video creation and editing. From text-to-video generation to advanced editing tools, Runway empowers creators to produce professional video content with AI assistance.',
    logoUrl: '/images/tools/runway-logo.svg',
    rating: 4.6,
    ratingCount: 2156,
    category: 'AI Video',
    pricing: 'Free / $15/mo',
    pricingDetails: 'Free tier with limited credits. Standard at $15/mo. Pro at $35/mo. Unlimited at $95/mo.',
    affiliateUrl: 'https://runwayml.com',
    features: [
      'Gen-2 text-to-video generation',
      'Image-to-video animation',
      'Video inpainting and editing',
      'Background removal (Green Screen)',
      'Motion tracking',
      'Style transfer',
      'Frame interpolation',
      'Audio cleanup tools',
    ],
    pros: [
      'Most advanced text-to-video AI',
      'Comprehensive video editing suite',
      'Great for motion graphics',
      'Regular AI model updates',
      'Browser-based, no install needed',
    ],
    cons: [
      'Credit system can get expensive',
      'Generated videos are short (4-16s)',
      'Quality varies with prompts',
      'Learning curve for best results',
    ],
    verdict:
      'Runway ML is pushing the boundaries of AI video creation. While generated videos are still short, the quality is impressive and improving rapidly. Essential for creators exploring the future of video production.',
    bestFor: 'Video creators and motion designers',
    lastUpdated: '2026-01-24',
    lastVerified: '2026-01-28',
    recommendations: {
      creator: 'Best for Video Creators',
      marketer: 'Great for Video Ads',
    },
    cookieDuration: 30,
    commissionRate: 20,
    hasExclusiveDeal: false,
    isNew: true,
  },
  {
    slug: 'descript',
    name: 'Descript',
    tagline: 'Edit video and podcasts like a document',
    description:
      'Descript revolutionizes video and podcast editing by letting you edit media like a text document. Features AI-powered transcription, overdub (voice cloning), and studio-quality audio enhancement.',
    logoUrl: '/images/tools/descript-logo.svg',
    rating: 4.7,
    ratingCount: 3287,
    category: 'AI Video',
    pricing: 'Free / $15/mo',
    pricingDetails: 'Free tier with 1 hr transcription. Creator at $15/mo. Pro at $30/mo. Enterprise available.',
    affiliateUrl: 'https://descript.com',
    features: [
      'Edit video by editing text transcript',
      'Overdub AI voice cloning',
      'Studio Sound audio enhancement',
      'Automatic filler word removal',
      'Screen recording',
      'Multi-track editing',
      'Eye Contact correction',
      'Green Screen background removal',
    ],
    pros: [
      'Revolutionary text-based editing',
      'Excellent transcription accuracy',
      'Overdub voice cloning is impressive',
      'Great for podcasters',
      'All-in-one recording and editing',
    ],
    cons: [
      'Can be slow with long files',
      'Overdub requires voice training',
      'Advanced features need Pro plan',
      'Desktop app required for full features',
    ],
    verdict:
      'Descript has genuinely changed how we edit video and audio. The ability to edit by manipulating text is transformative, and features like Overdub and Studio Sound add real value. A must-have for podcasters and video creators.',
    bestFor: 'Podcasters and content creators',
    lastUpdated: '2026-01-26',
    lastVerified: '2026-01-28',
    recommendations: {
      creator: 'Best for Podcasters',
      solopreneur: 'Great for Solo Creators',
      marketer: 'Useful for Marketing Videos',
    },
    cookieDuration: 90,
    commissionRate: 30,
    hasExclusiveDeal: true,
    isNew: true,
  },
];

export function getToolBySlug(slug: string): Tool | undefined {
  return tools.find((tool) => tool.slug === slug);
}

export function getAllToolSlugs(): string[] {
  return tools.map((tool) => tool.slug);
}

export function getToolsByCategory(category: string): Tool[] {
  return tools.filter((tool) => tool.category === category);
}

export function getFeaturedTools(count: number = 3): Tool[] {
  // Prioritize tools with exclusive deals or high commission
  const sorted = [...tools].sort((a, b) => {
    if (a.hasExclusiveDeal && !b.hasExclusiveDeal) return -1;
    if (!a.hasExclusiveDeal && b.hasExclusiveDeal) return 1;
    return (b.commissionRate ?? 0) - (a.commissionRate ?? 0);
  });
  return sorted.slice(0, count);
}

/**
 * Get recently updated tools
 */
export function getRecentlyUpdatedTools(count: number = 5): Tool[] {
  return [...tools]
    .sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime())
    .slice(0, count);
}

/**
 * Get new tools (added within last 30 days)
 */
export function getNewTools(): Tool[] {
  return tools.filter((tool) => tool.isNew);
}

/**
 * Filter tools by search query and category
 */
export function filterTools(
  query: string,
  category: Category
): Tool[] {
  let filtered = tools;

  // Filter by category
  if (category !== 'All') {
    filtered = filtered.filter((tool) => tool.category === category);
  }

  // Filter by search query
  if (query.trim()) {
    const searchLower = query.toLowerCase().trim();
    filtered = filtered.filter(
      (tool) =>
        tool.name.toLowerCase().includes(searchLower) ||
        tool.tagline.toLowerCase().includes(searchLower) ||
        tool.description.toLowerCase().includes(searchLower) ||
        tool.features.some((f) => f.toLowerCase().includes(searchLower))
    );
  }

  return filtered;
}

/**
 * Get all unique categories from tools
 */
export function getUniqueCategories(): string[] {
  return [...new Set(tools.map((tool) => tool.category))];
}
