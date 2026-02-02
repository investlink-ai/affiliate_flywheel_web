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
    tagline: 'Put AI agents to work for marketing.',
    description:
      'Jasper is the agent workspace built for modern marketing teams. With 100+ specialized AI agents and connected content pipelines, Jasper transforms strategy into execution, reducing operational complexity, strengthening brand control, and driving measurable growth across every channel and market. It connects data, creativity, and distribution in one intelligent system that automates the entire content lifecycle.',
    logoUrl: '/images/tools/jasper-logo.svg',
    rating: 4.8,
    ratingCount: 1851,
    category: 'AI Writing',
    pricing: 'From $59/mo',
    pricingDetails:
      'Pro: $59/month per seat (billed yearly) or $69/month per seat (billed monthly). Includes 1 seat, Canvas platform, Essential Apps, Smart customization with 2 Brand Voices, 5 Knowledge assets, and 3 Audiences. Business: Custom pricing, includes everything in Pro plus Advanced Apps, No-code AI App Builder, Unlimited IQ customization, API access, Enterprise-grade governance, Dedicated account management & priority support.',
    affiliateUrl: 'https://www.jasper.ai',
    features: [
      'Connects data, creativity, and distribution in one intelligent system',
      'Agents understand marketing needs, adapt to working models, and execute fast',
      'No-code interface for quickly building and customizing AI apps',
      'Modern workspace for planning, creating, and collaborating at scale',
      'Systematic high-quality content and brand-safe execution',
      'Proprietary vision models for pixel-perfect, on-brand images at scale',
      'Powerful, proprietary context hub of brand, marketing, and company knowledge',
      'Built-in guardrails that ensure brand quality and consistency at scale',
      'Configurable context on marketing aspects from audience insights to conversion best practices',
      'Digital repository of data and assets for deeper context',
    ],
    pros: [
      'Ease of use and ability to streamline content creation',
      'Speeds up writing and helps maintain a consistent tone',
      'Flexible templates that make content generation efficient',
      'Significant time savings and improved productivity',
      'High-quality outputs compared to other AI tools',
      'Unique features like passive to active voice and tone changer',
    ],
    cons: [
      'Occasional stutters and hiccups like rendering problems and crashes',
      'Issues related to copy/paste functionality',
      'Can generate content that requires editing for accuracy',
      'Pricing can be expensive when bundled with additional tools',
      'May produce robotic-sounding content occasionally',
      'Limited customization in some areas',
    ],
    verdict:
      'Jasper AI excels in providing an agent-based workspace for marketing teams, offering robust automation and customization for content creation. While it significantly boosts productivity and maintains brand consistency, users should be prepared for occasional technical glitches and the need for human oversight on generated content. Overall, it\'s a strong tool for professionals seeking to scale marketing efforts efficiently.',
    bestFor: 'Marketing teams and agencies',
    lastUpdated: '2026-02-02',
    lastVerified: '2026-02-02',
    recommendations: {
      marketer: 'Best for Marketers',
      agency: 'Top Pick for Agencies',
    },
    cookieDuration: 30,
    commissionRate: 30,
    hasExclusiveDeal: false,
  },
  {
    slug: 'copy-ai',
    name: 'Copy.ai',
    tagline: 'Future proof your business with GTM AI',
    description:
      'Infuse AI across your go-to-market engine with a single platform — not dozens of copilots and point solutions. Codify best practices, unify data, connect teams, and eliminate GTM bloat. Power all key GTM use cases and realize the full value of AI.',
    logoUrl: '/images/tools/copyai-logo.svg',
    rating: 4.4,
    ratingCount: 67,
    category: 'AI Writing',
    pricing: 'From $29/mo',
    pricingDetails:
      'Self-Serve: Not specified. Enterprise Expansion: $2,000/mo (billed $24,000/yr) for 150 Seats, Unlimited Words in Chat, 45K Workflow Credits/Mo. Scale: $3,000/mo (billed $36,000/yr) for 200 Seats, Unlimited Words in Chat, 75K Workflow Credits/Mo.',
    affiliateUrl: 'https://www.copy.ai',
    features: [
      'Prospecting Cockpit: Deeply research accounts + contacts to draft high-quality sales outreach',
      'Content Creation: Power your content engine with AI — SEO, thought leadership, use cases, social, and more',
      'Inbound Lead Processing: Automatically enrich, research, and engage your marketing generated leads',
      'Account Based Marketing: Get rich insights on accounts, industries, and personas to inform ABM plays',
      'Translation + Localization: Produce native speaker level translations for any language',
      'Deal Coaching + Forecasting: Get meaningful, customizable insights from sales transcripts',
      'Workflows: AI-powered codifications of your processes, plays, and best practices',
      'Actions: Building blocks that allow users to harness the power of AI without being AI experts',
      'Agents: Automate targeted tasks by combining AI decision-making with proper guardrails',
      'Tables: A queryable data foundation that consolidates disparate sources to power AI automation',
    ],
    pros: [
      'Easy to use with an intuitive interface',
      'Generates high-quality content quickly',
      'Diverse templates for various content types',
      'Saves time on content creation',
      'Customizable outputs',
      'Good for brainstorming and overcoming creative blocks',
    ],
    cons: [
      'Limits customization in some areas',
      'AI-generated content can sound robotic',
      'Support can be slow and not responsive',
      'Standard plan is considered too pricey',
      'Raw AI text is generic and detectable',
      'Credit system can be limiting',
    ],
    verdict:
      'Copy.ai is a robust GTM AI platform that excels in automating marketing and sales tasks through intelligent workflows and agents. While it offers significant time savings and ease of use for content generation, users may need to edit outputs for optimal quality and find the pricing steep for advanced features. It\'s particularly valuable for teams looking to unify their GTM processes.',
    bestFor: 'Marketing and sales teams',
    lastUpdated: '2026-02-02',
    lastVerified: '2026-02-02',
    recommendations: {
      solopreneur: 'Best for Solopreneurs',
      creator: 'Top Pick for Creators',
    },
    cookieDuration: 60,
    commissionRate: 45,
    hasExclusiveDeal: true,
  },
  {
    slug: 'murf-ai',
    name: 'Murf AI',
    tagline: 'Free AI Voice Generator & Text to Speech Online | Murf AI',
    description:
      'Murf AI provides an AI voice generator with ultra-realistic voices, built on a second-generation text-to-speech model. It enables the creation of human-like voiceovers for voice AI agents, audio products, training, marketing voiceovers, podcasts, e-learning, narration, advertisements, and more. The platform includes Murf Studio for faster voiceover production and Murf API for building AI audio products at scale.',
    logoUrl: '/images/tools/murf-logo.svg',
    rating: 4.7,
    ratingCount: 1400,
    category: 'AI Voice',
    pricing: 'From $19/mo',
    pricingDetails:
      'Creator: From $19/mo, 100 Projects, 24 hrs/Year of Voice Generation, 1 Editor, 200+ AI Voices, 30+ Languages. Business: $66/mo (annual), 500 Projects, 96 hrs/Year of Voice Generation, 1 Editor, additional features like Business License, Emphasis, Powerpoint Integration. Enterprise: Custom, Unlimited Projects, Unlimited Voice Generation, Custom Editors, advanced features like AI Translation, SSO.',
    affiliateUrl: 'https://murf.ai',
    features: [
      '200+ multilingual voices supporting 20+ languages and accents',
      'Advanced customization options including pitch, speed, voice styles, pauses, emphasis',
      'Pronunciation library using IPA or alternative spellings',
      'Tool integrations with PowerPoint, Canva, Adobe Captivate, Adobe Audition',
      'Shared workspaces with team permissions and pronunciation libraries',
      'Voice changer to convert existing audio to high-quality AI voices',
      'Dubbing studio for translating and dubbing audio/videos into 30+ languages',
      'Low-latency TTS model with 99.38% pronunciation accuracy',
      'Supporting up to 10,000 concurrent calls',
      'MultiNative Voices',
    ],
    pros: [
      'Natural-sounding voices and ease of use',
      'Creates professional voiceovers quickly',
      'User-friendly interface',
      'Wide variety of voices and accents',
      'High-quality output',
      'Efficient collaboration features',
    ],
    cons: [
      'Some voices may not sound very good',
      'Training required for common words pronunciation',
      'Limited changes in features over time',
      'Expensive at higher tiers',
      'Occasional issues with consonant sounds',
      'More editing options could be added',
    ],
    verdict:
      'Murf AI stands out for its realistic AI voices and user-friendly platform, making it ideal for quick professional voiceover creation. While it offers extensive customization and integrations, some users note limitations in voice quality for specific needs and a desire for more feature updates. It\'s a solid choice for content creators and marketers seeking efficient TTS solutions.',
    bestFor: 'Creators and small teams',
    lastUpdated: '2026-02-02',
    lastVerified: '2026-02-02',
    recommendations: {
      creator: 'Best for Creators',
    },
    cookieDuration: 30,
    commissionRate: 25,
    hasExclusiveDeal: false,
  },
  {
    slug: 'notion-ai',
    name: 'Notion AI',
    tagline: 'The AI workspace that works for you.',
    description:
      'All-in-one AI that takes notes, searches apps, and builds workflows, right where you work. Notion AI is an AI everything app that builds, edits, and takes action on work. It respects custom permissions, is personalized, connects to tools via MCP, and allows creation of custom agents to automate specific workflows.',
    logoUrl: '/images/tools/notion-logo.svg',
    rating: 4.7,
    ratingCount: 2675,
    category: 'AI Productivity',
    pricing: 'Included in Business/Enterprise',
    pricingDetails:
      'Free: $0, limited AI trial. Plus: $10/user/mo (annual), limited AI trial. Business: $20/user/mo (annual), full AI access. Enterprise: Custom, full AI with zero data retention.',
    affiliateUrl: 'https://www.notion.so/product/ai',
    features: [
      'Builds, edits, and takes action on work',
      'Respects custom permissions and is personalized',
      'Connects to tools via MCP',
      'Create custom agents to automate workflows',
      'Enterprise search across workspace and connected apps',
      'Chat with GPT-4.1, Claude 4 and more for answers from docs and PDFs',
      'Generate detailed docs with research mode',
      'AI Meeting Notes for automated notes and transcripts',
      'Create and edit docs in your own style, translate docs',
      'Generate flowcharts, diagrams, autofill databases',
    ],
    pros: [
      'Customization and versatility',
      'All-in-one workspace for notes and tasks',
      'Strong satisfaction across industries',
      'AI features for summarizing and generating content',
      'Helps organize personal projects and life',
      'Flexible and broad in uses',
    ],
    cons: [
      'Steep learning curve for beginners',
      'AI is less capable than ChatGPT',
      'Slow performance with extensive data',
      'Per seat pricing getting expensive',
      'Initial setup time required',
      'Occasional sluggishness',
    ],
    verdict:
      'Notion AI integrates seamlessly into the Notion workspace, providing powerful tools for content generation, search, and automation. While it excels in versatility and user satisfaction, the AI capabilities may require the higher-tier plans for full access, and performance can lag with complex setups. It\'s best suited for teams already using Notion for productivity.',
    bestFor: 'Solopreneurs, agencies, developers',
    lastUpdated: '2026-02-02',
    lastVerified: '2026-02-02',
    recommendations: {
      solopreneur: 'Best for Solopreneurs',
      agency: 'Top Pick for Agencies',
      developer: 'Great for Developers',
    },
    cookieDuration: 90,
    commissionRate: 20,
    hasExclusiveDeal: false,
    isNew: true,
  },
  {
    slug: 'runway-ml',
    name: 'Runway ML',
    tagline: 'Building AI to Simulate the World',
    description:
      'Runway partners with leading organizations to advance industries through AI, which is changing how stories are told, scientific progress is made, and the next frontiers of humanity are reached. The company is building foundational General World Models capable of simulating all possible worlds and experiences. Runway merges art and science to simulate the world.',
    logoUrl: '/images/tools/runway-logo.svg',
    rating: 4.5,
    ratingCount: 2,
    category: 'AI Video',
    pricing: 'From $12/mo',
    pricingDetails:
      'Free: $0, 125 credits (one-time). Standard: $12/user/mo (annual), 625 credits monthly. Pro: $28/user/mo (annual), additional features. Unlimited: $76/user/mo (annual). Enterprise: Custom.',
    affiliateUrl: 'https://runwayml.com',
    features: [
      'Gen-4.5: World\'s best video model with state-of-the-art motion quality',
      'GWM Robotics: Simulates physical interactions and robotic behaviors',
      'GWM Worlds: Enables interactive and explorable world simulation',
      'GWM Avatars: Fully autonomous, real-time virtual video agents',
      'GWM-1: State-of-the-art General World Model for real-world interaction',
      'Gen-4.5: Unprecedented visual fidelity and creative control',
      'General World Models: AI systems that understand visual world dynamics',
    ],
    pros: [
      'User-friendly interface',
      'Ease of use for beginners',
      'Generates videos quickly',
      'State-of-the-art motion quality',
      'Impressive visual fidelity',
      'Dynamic and powerful for video generation',
    ],
    cons: [
      'Expensive cost',
      'Feature limitations',
      'Inaccuracy in outputs',
      'Credit system issues',
      'Inaccurate results sometimes',
      'High discard rate for unusable videos',
    ],
    verdict:
      'Runway ML is at the forefront of AI video generation with advanced models like Gen-4.5 and General World Models, offering impressive creative capabilities. However, users report high costs, occasional inaccuracies, and a steep credit consumption rate. It\'s ideal for professionals and teams willing to invest in cutting-edge AI tools, but may not suit budget-conscious beginners.',
    bestFor: 'Creators and small teams',
    lastUpdated: '2026-02-02',
    lastVerified: '2026-02-02',
    recommendations: {
      creator: 'Best for Creators',
    },
    cookieDuration: 30,
    commissionRate: 20,
    hasExclusiveDeal: false,
    isNew: true,
  },
  {
    slug: 'descript',
    name: 'Descript',
    tagline: 'Descript – AI Video & Podcast Editor | Free, Online',
    description:
      'Descript is an AI-powered video and podcast editor that enables users to write, record, and enhance content with automated design, script editing, and generative video features. It supports text-based editing, transcription, and various AI tools for background removal, eye contact correction, sound enhancement, filler word removal, translation, captions, avatars, and quick design. The platform caters to video content creation, podcast production, and team needs across marketing, learning, sales, support, and creators.',
    logoUrl: '/images/tools/descript-logo.svg',
    rating: 4.7,
    ratingCount: 178,
    category: 'AI Video',
    pricing: 'From $15/mo',
    pricingDetails:
      'Hobbyist: $15/mo (annual discount available), 600 Media Minutes, 400 AI Credits. Creator: $24/mo, 1800 Media Minutes, 800 AI Credits. Business: Custom, 1800+ Media Minutes, advanced features. Enterprise: Custom.',
    affiliateUrl: 'https://www.descript.com',
    features: [
      'AI Video Agent (Underlord): Edit or generate scripts, apply layouts, create B-roll',
      'Text-based editing: Edit video by modifying transcript',
      'Green Screen: AI removes and replaces backgrounds',
      'Eye Contact: AI adjusts footage for camera gaze',
      'Studio Sound: AI removes noise and enhances voices',
      'Remove Filler Words: Automatically cuts filler words',
      'Translation: Translates content for global audiences',
      'Transcription: AI transcribes audio/video quickly',
      'Captions: Adds captions with accessibility options',
      'Avatars: Creates avatars to speak scripts',
    ],
    pros: [
      'Ease of use and intuitive interface',
      'Streamlines audio and video editing',
      'Saves time on editing tasks',
      'Great for beginners',
      'Excellent for podcast and video polishing',
      'Frequent updates and good support',
    ],
    cons: [
      'Frequent crashes and instability',
      'Slow performance with longer videos',
      'Export quality can be lacking',
      'AI features are expensive',
      'Steep learning curve for some',
      'Customer support can be slow',
    ],
    verdict:
      'Descript revolutionizes video and podcast editing with its text-based approach and AI tools, making it accessible for creators. While it excels in speed and simplicity for dialogue-heavy content, stability issues and high costs for advanced AI may frustrate users. It\'s recommended for solo creators and teams focused on efficient editing.',
    bestFor: 'Creators and solopreneurs',
    lastUpdated: '2026-02-02',
    lastVerified: '2026-02-02',
    recommendations: {
      creator: 'Best for Creators',
      solopreneur: 'Top Pick for Solopreneurs',
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
