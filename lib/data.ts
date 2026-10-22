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
  rating: number;
  ratingCount: number;
  category: string;
  pricing: string;
  pricingDetails: string;
  websiteUrl: string;
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
  /** Tool is newly added (within 30 days) */
  isNew?: boolean;
  /** Screenshots of the tool interface */
  screenshots?: string[];
  /** YouTube video review URL */
  videoReviewUrl?: string;
  /** User quotes from reviews (G2, Reddit, etc.); format: "quote – attribution". Research-driven, FTC-safe. */
  /** Optional per-tool metrics (e.g., user-reported efficiency gains); flexible, not uniform across tools */
  optionalMetrics?: string[];
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
    description: "QuantConnect is an open-source financial technology platform that provides a unified API for quantitative research, backtesting, and live trading. It supports a complete suite of cloud-based tools for researching investment approaches, assessing strategies with backtesting, and deploying them to maximize returns. The platform also offers on-premise replication for bespoke requirements and includes agentic AI capabilities through Mia for designing, backtesting, optimizing, and live-trading strategies.",
    logoUrl: "/images/tools/quantconnect-logo.svg",
    rating: 4.5,
    ratingCount: 63,
    category: "Quantitative Platforms",
    pricing: "See website",
    pricingDetails: "See official website for current pricing.",
    websiteUrl: "https://www.quantconnect.com",
    features: ["Cloud-based research terminals with access to terabytes of financial, fundamental, and alternative data, preformatted and linked to securities via FIGI, CUSIP, and ISIN.","Backtesting with point-in-time adjustments for fees, slippage, and spreads, supporting multi-asset portfolios of thousands of securities with realistic margin modeling.","Parameter sensitivity testing that runs thousands of full backtests on scalable cloud compute, visualized through heatmaps for strategy robustness.","Institutional-grade live trading with over 375,000 strategies deployed since 2012, processing $45B in notional volume monthly via 20 integrations and low-latency infrastructure.","Agentic AI assistant Mia that enables natural-language strategies, auto backtesting, and smart code edits for streamlined workflows.","Multi-asset portfolio modeling including US stocks, ETFs, options, indexes, futures, forex, CFDs, and crypto with tick-to-daily resolutions.","Rich library of alternative data from over 40 vendors, processed with uniform timestamps and available for research or live trading.","Open-source LEAN engine for algorithmic trading, supporting local development, cloud backtesting, and custom modifications."],
    pros: ["Best platform for developing trading strategies","Solid product if you're not doing HFT","Extremely stable and the tools very easy to learn and use","Very easy tool to use for creating, backtesting, optimizing and going live with a trading strategy","Improves the efficiency and reduces the time between idea and feasibility testing","Platform provides its users many tools that improve the efficiency"],
    cons: ["Full of problems, holes, and bugs","Clients end up hating it within days","Not recommend it for day-trading type","Daunting and the documentation may seem cumbersome at first","Engine is slower as the data points increases","Uses <7M data for just 3 months"],
    verdict: "QuantConnect stands out as a robust open-source platform for algorithmic trading, particularly suited for quantitative research and backtesting with extensive data access. While it excels in stability and tool efficiency for non-HFT strategies, users should be aware of potential bugs and performance issues with large datasets. This is not financial advice; always conduct thorough due diligence.",
    bestFor: "Quantitative research teams and professional quants seeking an open-source platform for building, testing, and deploying algorithmic trading strategies with AI assistance, multi-asset support, and a vast community for sharing research.",
    lastUpdated: "2026-02-04",
    lastVerified: "2026-02-04",
    recommendations: {"quantitative_analyst":"Best for backtesting strategies","trader":"Top for algorithmic trading"},
    videoReviewUrl: "https://www.youtube.com/watch?v=T1XCZpozvLE",
    optionalMetrics: ["Complete a 10-year equity backtest in just 33 seconds","Processing $45B in notional volume monthly","Over 15,000 parallel backtests daily","Over 375,000 strategies deployed since 2012"],
  },
  {
    slug: "etoro",
    name: "eToro",
    tagline: "Invest in thousands of stocks, crypto, ETFs… all in one easy-to-use app.",
    description: "eToro offers a platform for investing in a variety of asset classes, including 20 global stock exchanges and 100 cryptocurrencies, all managed in one place. It features low fees with flat rates per trade for US, UK & EU stocks, no commission on certain ETFs, and fixed fees for cryptoassets. Users can earn up to 3.55% annual interest on cash balances with monthly payments and no commitment, while also accessing educational resources like courses, podcasts, and webinars through eToro Academy.",
    logoUrl: "/images/tools/etoro-logo.svg",
    rating: 4.2,
    ratingCount: 30427,
    category: "Quantitative Platforms",
    pricing: "Low fees with flat fee per trade for stocks, no commission on select ETFs, fixed fees for crypto; earn up to 3.55% annual interest on cash.",
    pricingDetails: "Flat fee per trade for US, UK & EU stocks (no matter how many shares); no commission on ETFs tracking S&P 500, Nasdaq & more; fixed fee on any cryptoasset position (over 100 cryptos); additional costs may apply for other asset types (see fees page). Interest up to 3.55% annually on cash balance, monthly payments, no commitment (credit and other risks apply; read Terms and Conditions). No specific plan names or tiered limits detailed.",
    websiteUrl: "https://www.etoro.com",
    features: ["Invest in thousands of stocks, crypto, ETFs in one app.","Flat fee per trade for US, UK & EU stocks, no matter how many shares.","No commission on ETFs that track the S&P 500, Nasdaq & more.","Trade over 100 leading cryptoassets with fixed transparent fees.","Earn up to 3.55% annual interest on cash balances, paid monthly.","Copy top investors' moves in real time using CopyTrader™.","Access free investing courses, podcasts, and webinars via eToro Academy.","Diversify across 20 global stock exchanges and 100 cryptocurrencies.","Manage holdings in GBP and USD accounts for local and global trading.","Funds held in top-tier institutions with best security practices."],
    pros: ["Easy-to-use platform","High visibility into other investors' trades and social network capabilities","Great educational materials","High interest rate on uninvested cash","Copy trading service available","A variety of cryptocurrencies to choose from"],
    cons: ["No IRAs","No bonds, futures or forex","High fees","Slow customer support","$5 withdrawal fee","Can only trade and invest in USD"],
    verdict: "eToro stands out for its social trading features like CopyTrader and a user-friendly platform suitable for beginners, with a wide range of assets including stocks and crypto. However, it has limitations such as higher fees, lack of certain account types like IRAs, and occasional support issues. This is not financial advice; users should conduct their own due diligence and consider personal financial situations.",
    bestFor: "Beginners and social traders interested in copying experienced investors across stocks, crypto, and ETFs.",
    lastUpdated: "2026-02-05",
    lastVerified: "2026-02-05",
    recommendations: {"trader":"Best for social and copy trading","individual_investor":"Top for beginner-friendly platform"},
    videoReviewUrl: "https://www.youtube.com/watch?v=d9x662EaBuE",
  },
  {
    slug: "notion",
    name: "Notion",
    tagline: "The AI workspace that works for you.",
    description: "Notion is a single workspace where teams and AI agents capture knowledge, find answers, and automate projects, enabling a team of 7 to feel like 70. It introduces Notion 3.0 with features like Notion Agent for task assignment and execution, alongside upcoming Custom Agents. The platform emphasizes productivity by reducing busywork and consolidating tools.",
    logoUrl: "/images/tools/notion-logo.svg",
    rating: 4.7,
    ratingCount: 2675,
    category: "Research Workflow",
    pricing: "See pricing plans",
    pricingDetails: "See official website for current pricing.",
    websiteUrl: "https://www.notion.so",
    features: ["Notion Agent: Assign tasks and the AI agent performs the work.","Enterprise Search: One search across everything.","AI Meeting Notes: Generates perfect notes automatically.","Flexible workflows: Manages any project, big or small.","Automate repetitive tasks: AI handles busywork.","AI writing tools: Rated #1 by G2."],
    pros: ["Flexibility and ease of use, allowing them to customize their workflows","Keep all their information organized in one place","Helps me stay organize and track many projects at once","Very positive one. This software helps me stay organize","Great AI tool for our resources within our organization","Multiple teams use this on a daily and is really changing the way we are interacting with productivity workflow"],
    cons: ["Per seat pricing is getting expensive","Confusing UI for some users","Setup can be time-consuming","Low learnability, unintuitive design","Requires a lot of time and effort to become productive with","Feels extremely slow"],
    verdict: "Notion excels as an all-in-one AI workspace for productivity and knowledge management, with high user praise for flexibility. However, pricing and learnability issues may deter some. This is not financial advice; evaluate for your needs.",
    bestFor: "Teams seeking an AI everything app for productivity, knowledge management, and automation in a single platform, ideal for enterprises and startups (e.g., 62% of Fortune 100, over 50% of YC companies).",
    lastUpdated: "2026-02-04",
    lastVerified: "2026-02-04",
    recommendations: {"fintech_professional":"Best for AI-powered tools","financial_advisor":"Top for portfolio management","quantitative_analyst":"Great for automation"},
    videoReviewUrl: "https://www.youtube.com/watch?v=SiJpasKwEHs",
    optionalMetrics: ["79% of reviewers have rated Notion 5 stars on G2","Consistently ranks as the G2 industry leader"],
  },
  {
    slug: "tradingview",
    name: "TradingView",
    tagline: "TradingView",
    description: "TradingView is highly regarded for its superior charting and community features, making it a top choice for market analysis. However, some users report performance issues. This is not financial advice; test for your use case.",
    logoUrl: "/images/tools/tradingview-logo.svg",
    rating: 4.5,
    ratingCount: 82,
    category: "AI Investment Signals",
    pricing: "See website",
    pricingDetails: "See official website for current pricing.",
    websiteUrl: "https://www.tradingview.com",
    features: ["Over 400 indicators and 110+ drawing tools","Real-time data across stocks, forex, crypto, and more","Social community and idea sharing","Custom alerts and screening","Multi-timeframe analysis"],
    pros: ["Powerful charting tools and customization options","Suitable for both beginners and experienced traders","Much more efficient, smoother, and intuitive platform","Best charting experience available today","Powerful charting tool with a massive selection of features","Delivers the best charting experience available today"],
    cons: ["Slow and failing to close positions","Taking forever to enter positions","Lately it has been slow","Overly complicated and doesn't work offline","Occasional platform instability and crashes","Connection keeps dropping"],
    verdict: "TradingView is highly regarded for its superior charting and community features, making it a top choice for market analysis. However, some users report performance issues. This is not financial advice; test for your use case.",
    bestFor: "See verdict for details.",
    lastUpdated: "2026-02-04",
    lastVerified: "2026-02-04",
    recommendations: {"individual_investor":"Best for charting","trader":"Top for market analysis"},
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
  // Rank by rating, then name for ties.
  const sorted = [...tools].sort((a, b) => b.rating - a.rating || a.name.localeCompare(b.name));
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
