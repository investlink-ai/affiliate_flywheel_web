export type UserType =
  | 'individual_investor'
  | 'trader'
  | 'fintech_professional'
  | 'financial_advisor'
  | 'quantitative_analyst';

export interface Tool {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  logoUrl: string;
  category: string;
  pricing: string;
  pricingDetails: string;
  websiteUrl: string;
  features: string[];
  verdict: string;
  /** Who the tool may suit (rendered as "May suit"; no ranking claims) */
  bestFor: string;
  lastUpdated: string;
  /** User types this tool may suit, with badge text ("May suit …"; no ranking claims) */
  recommendations?: Partial<Record<UserType, string>>;
  /** Tool is newly added (within 30 days) */
  isNew?: boolean;
  /** Screenshots of the tool interface */
  screenshots?: string[];
  /** YouTube video review URL */
  videoReviewUrl?: string;
}

/** All available categories */
export const categories = [
  'All',
  'AI Investment Signals',
  'Quantitative Platforms',
  'Fintech Infrastructure',
  'Crypto Tools',
  'Portfolio Management',
  'Research Workflow',
] as const;
export type Category = (typeof categories)[number];

/** User type display labels */
export const userTypeLabels: Record<UserType, string> = {
  individual_investor: 'Individual Investors',
  trader: 'Traders',
  fintech_professional: 'Fintech Professionals',
  financial_advisor: 'Financial Advisors',
  quantitative_analyst: 'Quantitative Analysts',
};

export const tools: Tool[] = [
  {
    slug: "quantconnect",
    name: "QuantConnect",
    tagline: "Open Source Algorithmic Trading Platform",
    description: "QuantConnect is an open-source financial technology platform that provides a unified API for quantitative research, backtesting, and live trading. It supports a complete suite of cloud-based tools for researching investment approaches, assessing strategies with backtesting, and deploying them to live trading. The platform also offers on-premise replication for bespoke requirements and includes agentic AI capabilities through Mia for designing, backtesting, optimizing, and live-trading strategies.",
    logoUrl: "/images/tools/quantconnect-logo.svg",
    category: "Quantitative Platforms",
    pricing: "See website",
    pricingDetails: "See official website for current pricing.",
    websiteUrl: "https://www.quantconnect.com",
    features: ["Cloud-based research terminals with financial, fundamental, and alternative data, preformatted and linked to securities via FIGI, CUSIP, and ISIN.","Backtesting with point-in-time adjustments for fees, slippage, and spreads, supporting multi-asset portfolios with margin modeling.","Parameter sensitivity testing that runs many full backtests on cloud compute, visualized through heatmaps for strategy robustness.","Live trading through brokerage integrations.","Agentic AI assistant Mia that enables natural-language strategies, auto backtesting, and smart code edits for streamlined workflows.","Multi-asset portfolio modeling including US stocks, ETFs, options, indexes, futures, forex, CFDs, and crypto with tick-to-daily resolutions.","Alternative data from multiple vendors, processed with uniform timestamps and available for research or live trading.","Open-source LEAN engine for algorithmic trading, supporting local development, cloud backtesting, and custom modifications."],
    verdict: "QuantConnect stands out as a robust open-source platform for algorithmic trading, particularly suited for quantitative research and backtesting with extensive data access. While it excels in stability and tool efficiency for non-HFT strategies, users should be aware of potential bugs and performance issues with large datasets. This is not financial advice; always conduct thorough due diligence.",
    bestFor: "Quantitative research teams and professional quants seeking an open-source platform for building, testing, and deploying algorithmic trading strategies with AI assistance, multi-asset support, and a community for sharing research.",
    lastUpdated: "2026-02-04",
    recommendations: {"quantitative_analyst":"May suit backtesting strategies","trader":"May suit algorithmic trading"},
    videoReviewUrl: "https://www.youtube.com/watch?v=T1XCZpozvLE",
  },
  {
    slug: "etoro",
    name: "eToro",
    tagline: "Invest in stocks, crypto and ETFs in one app.",
    description: "eToro offers a platform for investing in a variety of asset classes, including stocks, ETFs and cryptoassets, all managed in one place. It charges a flat fee per trade for US, UK & EU stocks, no commission on certain ETFs, and fixed fees for cryptoassets. Users can also access educational resources like courses, podcasts, and webinars through eToro Academy.",
    logoUrl: "/images/tools/etoro-logo.svg",
    category: "Quantitative Platforms",
    pricing: "Flat fee per trade for stocks, no commission on select ETFs, fixed fees for crypto. See website for current fees.",
    pricingDetails: "Flat fee per trade for US, UK & EU stocks (no matter how many shares); no commission on ETFs tracking S&P 500, Nasdaq & more; fixed fee on cryptoasset positions; additional costs may apply for other asset types (see eToro's fees page for current fees).",
    websiteUrl: "https://www.etoro.com",
    features: ["Invest in stocks, crypto and ETFs in one app.","Flat fee per trade for US, UK & EU stocks, no matter how many shares.","No commission on ETFs that track the S&P 500, Nasdaq & more.","Trade cryptoassets with fixed fees.","Copy other investors' moves using CopyTrader™.","Access free investing courses, podcasts, and webinars via eToro Academy.","Manage holdings in GBP and USD accounts for local and global trading."],
    verdict: "eToro stands out for its social trading features like CopyTrader and a user-friendly platform suitable for beginners, with a wide range of assets including stocks and crypto. However, it has limitations such as higher fees, lack of certain account types like IRAs, and occasional support issues. This is not financial advice; users should conduct their own due diligence and consider personal financial situations.",
    bestFor: "Beginners and social traders interested in copying experienced investors across stocks, crypto, and ETFs.",
    lastUpdated: "2026-02-05",
    recommendations: {"trader":"May suit social and copy trading","individual_investor":"May suit beginners"},
    videoReviewUrl: "https://www.youtube.com/watch?v=d9x662EaBuE",
  },
  {
    slug: "notion",
    name: "Notion",
    tagline: "The AI workspace that works for you.",
    description: "Notion is a single workspace where teams and AI agents capture knowledge, find answers, and automate projects. It introduces Notion 3.0 with features like Notion Agent for task assignment and execution, alongside upcoming Custom Agents. The platform emphasizes productivity by reducing busywork and consolidating tools.",
    logoUrl: "/images/tools/notion-logo.svg",
    category: "Research Workflow",
    pricing: "See pricing plans",
    pricingDetails: "See official website for current pricing.",
    websiteUrl: "https://www.notion.so",
    features: ["Notion Agent: Assign tasks and the AI agent performs the work.","Enterprise Search: One search across everything.","AI Meeting Notes: Generates meeting notes automatically.","Flexible workflows: Manages any project, big or small.","Automate repetitive tasks: AI handles busywork.","AI writing tools."],
    verdict: "Notion excels as an all-in-one AI workspace for productivity and knowledge management, with user praise for flexibility. However, pricing and learnability issues may deter some. This is not financial advice; evaluate for your needs.",
    bestFor: "Teams seeking an AI everything app for productivity, knowledge management, and automation in a single platform.",
    lastUpdated: "2026-02-04",
    recommendations: {"individual_investor":"May suit research notes and checklists","financial_advisor":"May suit research notes and checklists"},
    videoReviewUrl: "https://www.youtube.com/watch?v=SiJpasKwEHs",
  },
  {
    slug: "tradingview",
    name: "TradingView",
    tagline: "TradingView",
    description: "TradingView is known for its charting and community features for market analysis. However, some users report performance issues. This is not financial advice; test for your use case.",
    logoUrl: "/images/tools/tradingview-logo.svg",
    category: "AI Investment Signals",
    pricing: "See website",
    pricingDetails: "See official website for current pricing.",
    websiteUrl: "https://www.tradingview.com",
    features: ["Indicators and drawing tools","Real-time data across stocks, forex, crypto, and more","Social community and idea sharing","Custom alerts and screening","Multi-timeframe analysis"],
    verdict: "TradingView is known for its charting and community features for market analysis. However, some users report performance issues. This is not financial advice; test for your use case.",
    bestFor: "See verdict for details.",
    lastUpdated: "2026-02-04",
    recommendations: {"individual_investor":"May suit charting","trader":"May suit market analysis"},
    videoReviewUrl: "https://www.youtube.com/watch?v=ktuEYvVEm5I",
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
  // Alphabetical: the site publishes no ratings or rankings.
  const sorted = [...tools].sort((a, b) => a.name.localeCompare(b.name));
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
