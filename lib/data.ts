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
  /** User quotes from reviews (G2, Reddit, etc.); format: "quote – attribution". Research-driven, FTC-safe. */
  socialProof?: string[];
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
    affiliateUrl: "https://www.quantconnect.com",
    features: ["Cloud-based research terminals with access to terabytes of financial, fundamental, and alternative data, preformatted and linked to securities via FIGI, CUSIP, and ISIN.","Backtesting with point-in-time adjustments for fees, slippage, and spreads, supporting multi-asset portfolios of thousands of securities with realistic margin modeling.","Parameter sensitivity testing that runs thousands of full backtests on scalable cloud compute, visualized through heatmaps for strategy robustness.","Institutional-grade live trading with over 375,000 strategies deployed since 2012, processing $45B in notional volume monthly via 20 integrations and low-latency infrastructure.","Agentic AI assistant Mia that enables natural-language strategies, auto backtesting, and smart code edits for streamlined workflows.","Multi-asset portfolio modeling including US stocks, ETFs, options, indexes, futures, forex, CFDs, and crypto with tick-to-daily resolutions.","Rich library of alternative data from over 40 vendors, processed with uniform timestamps and available for research or live trading.","Open-source LEAN engine for algorithmic trading, supporting local development, cloud backtesting, and custom modifications."],
    pros: ["Best platform for developing trading strategies","Solid product if you're not doing HFT","Extremely stable and the tools very easy to learn and use","Very easy tool to use for creating, backtesting, optimizing and going live with a trading strategy","Improves the efficiency and reduces the time between idea and feasibility testing","Platform provides its users many tools that improve the efficiency"],
    cons: ["Full of problems, holes, and bugs","Clients end up hating it within days","Not recommend it for day-trading type","Daunting and the documentation may seem cumbersome at first","Engine is slower as the data points increases","Uses <7M data for just 3 months"],
    verdict: "QuantConnect stands out as a robust open-source platform for algorithmic trading, particularly suited for quantitative research and backtesting with extensive data access. While it excels in stability and tool efficiency for non-HFT strategies, users should be aware of potential bugs and performance issues with large datasets. This is not financial advice; always conduct thorough due diligence.",
    bestFor: "Quantitative research teams and professional quants seeking an open-source platform for building, testing, and deploying algorithmic trading strategies with AI assistance, multi-asset support, and a vast community for sharing research.",
    lastUpdated: "2026-02-04",
    lastVerified: "2026-02-04",
    recommendations: {"quantitative_analyst":"Best for backtesting strategies","trader":"Top for algorithmic trading"},
    cookieDuration: 0,
    commissionRate: 10,
    hasExclusiveDeal: true,
    videoReviewUrl: "https://www.youtube.com/watch?v=T1XCZpozvLE",
    socialProof: ["'Overall great platform.' – User, Trustpilot, Nov 8, 2025","'Very easy tool to use for creating, backtesting, optimizing and going live with a trading strategy. I went from concept to live trading in less than a month' – User, Trustpilot","'I've traded on quantconnect.com for the better part of a year now and find the platform extremely stable and the tools very easy to learn and use.' – Reddit user","'I use quantconnect sporadically. I find it to be the best platform for developing trading strategies' – Reddit user","'The full QuantConnect platform provides its users many tools that improve the efficiency and most importantly reduce the time between idea and feasibility testing.' – Trustpilot user","'Overall great platform.' – User, Trustpilot"],
    optionalMetrics: ["Complete a 10-year equity backtest in just 33 seconds","Processing $45B in notional volume monthly","Over 15,000 parallel backtests daily","Over 375,000 strategies deployed since 2012"],
  },
  {
    slug: "tradestation",
    name: "TradeStation",
    tagline: "Trading is in your DNA. It's in ours, too.",
    description: "TradeStation provides online trading and brokerage services focused on active traders, offering institutional-grade tools and innovative platforms. The company emphasizes decades of trading innovation, fast and reliable trading, professional support, and value-driven strategies. It recently launched TITAN X, a next-generation platform available on Windows and Mac, along with disruptive options pricing designed to reduce costs for scaling strategies.",
    logoUrl: "/images/tools/tradestation-logo.svg",
    rating: 4.6,
    ratingCount: 1208,
    category: "Quantitative Platforms",
    pricing: "See website",
    pricingDetails: "See official website for current pricing.",
    affiliateUrl: "https://www.tradestation.com",
    features: ["Next-generation TITAN X platform with beautiful new charts, powerful enhancements to options chains and Matrix, slick UI, and smarter multi-leg order ticket.","Disruptive options pricing structure to help traders keep more profits by paying less when building spreads.","Award-winning trading software featuring modern analysis tools, deep charting capabilities, and extensive customization.","Private Brokerage service offering top-tier support, personalized experiences, and exclusive access for active market tacticians.","HUB for downloading platforms and managing trading and account functions.","APIs for technology access, supporting global, self-clearing, direct-market-access brokerage solutions."],
    pros: ["Ease of use and professional interface makes it stand out","Robustness and the variety of tools available","Charting capabilities, data accuracy, and efficient order handling","Very smooth and efficient account opening process","Rapid customer support response","Great trading platform, with extensive charts capabilities, API key"],
    cons: ["No transaction-fee-free mutual funds","High account fees","Low execution quality on stock trades","Accept payment for order flow (PFOF)","Platform's sluggishness is noticeable and annoying","Connection with Trading View is poor"],
    verdict: "TradeStation is a strong choice for active traders seeking advanced platforms and tools, with high user satisfaction in interface and support. However, potential drawbacks include fees and execution quality concerns. This is not financial advice; users should verify current conditions.",
    bestFor: "Active traders and sophisticated users seeking innovation, advanced tools, and cost-effective options strategies, as emphasized in themes of trading DNA, institutional-grade features, and awards for advanced trading.",
    lastUpdated: "2026-02-04",
    lastVerified: "2026-02-04",
    recommendations: {"trader":"Top for algorithmic trading","fintech_professional":"Best for execution & trading"},
    cookieDuration: 30,
    hasExclusiveDeal: true,
    isNew: true,
    socialProof: ["'I can truly say that I enjoy using this platform. It's ease of use and professional interface makes it stand out from others that I have used.' – User, Trustpilot","'Very smooth and efficient account opening process. Rapid customer support response. Great trading platform, with extensive charts capabilities, API key' – User, Trustpilot","'TS is an excellent trading platform. Easy to learn and I'm still learning at 83 yrs of age! I really like using the scanning tool.' – User, Trustpilot","'Best trading tools… Trade Station gives me some of the best tools for daily trading' – User, Trustpilot","'Executes orders very fast and very easy to set up bracket orders.' – Reddit user","'Offers powerful tools, charts, and coding capabilities.' – Reddit user"],
    optionalMetrics: ["Average execution speed of 0.44 seconds","$10.6 million in price improvement in Q3 2024","Execution quality on stock trades is 91.79%"],
  },
  {
    slug: "polymarket",
    name: "Polymarket",
    tagline: "The World's Largest Prediction Market™",
    description: "Polymarket is a prediction market platform where users trade on the outcomes of real-world events using cryptocurrency. It features markets on topics like sports, politics, finance, and crypto price movements, with live betting options such as BTC 15-minute up or down. The platform operates globally through separate legal entities, with Polymarket US regulated by the CFTC as a Designated Contract Market.",
    logoUrl: "/images/tools/polymarket-logo.svg",
    rating: 1.3,
    ratingCount: 0,
    category: "Crypto Tools",
    pricing: "See website",
    pricingDetails: "See official website for current pricing.",
    affiliateUrl: "https://polymarket.com",
    features: ["Markets on sports outcomes (e.g., Seahawks vs. Patriots NFL game with 69% chance for Seahawks).","Crypto-related predictions (e.g., Bitcoin price targets like ↑90,000 with 20% chance or ↓70,000 with 51% chance).","Political and geopolitical events (e.g., US strikes Iran by February 13 with 9% yes chance or Russia-Ukraine ceasefire by end of 2026 with 46% chance).","Financial markets (e.g., Fed decision in March with 91% chance of no change or S&P 500 opens up or down on February 4 with 57% up).","Entertainment and awards (e.g., Oscars 2026 Best Picture winner like 'One Battle After Another' with 70% chance).","Live trading with volume indicators (e.g., $10m volume on NFL game or $13m on Bitcoin February price).","Binary yes/no outcomes (e.g., Will anyone be jailed over Epstein disclosures with 15% yes chance).","Multi-outcome markets (e.g., Where will Giannis be traded with options like Not Traded at 49% or Minnesota Timberwolves at 27%).","Event timing markets (e.g., Kevin Warsh confirmed as Fed Chair by May 1 with 58% chance).","Global election predictions (e.g., Thailand Legislative Election Winner with People’s Party at 66%)."],
    pros: ["Good website for those interested in this type of betting","Best by far has the most volume and realistic odds and most outcomes to bet on","Platform is simple, the markets move fast, and the prices shift entirely based on what traders believe","Go-to platform for crypto-savvy users who want a fast, flexible, and global way to trade predictions","Best betting platform at the moment. Really good prices. Fast/instant pay outs on crypto","Very good app!!! I like the breakdown of the individual categories and the graphs are a very nice touch !!!"],
    cons: ["Huge waste of time, mainly because of the terrible customer support","Easy for scammers to cheat you","Super slow to execute orders","Delay in submitting orders","Platform is subject to manipulation, with outcomes influenced by individuals holding substantial amounts of tokens","Rigged or arbitrary resolutions"],
    verdict: "Polymarket offers a unique decentralized platform for prediction markets with high liquidity in popular events, but faces criticism for potential manipulation and poor customer support. It may suit crypto users comfortable with blockchain risks, but caution is advised. This is not financial advice.",
    bestFor: "Crypto users to trade on prediction markets involving Bitcoin prices, financial decisions, and geopolitical events using cryptocurrency.",
    lastUpdated: "2026-02-04",
    lastVerified: "2026-02-04",
    recommendations: {"trader":"Best for prediction markets","individual_investor":"Top for crypto-focused betting"},
    cookieDuration: 30,
    hasExclusiveDeal: false,
    socialProof: ["'A good website for those interested in this type of betting' – User, Trustpilot","'Best betting platform at the moment. Really good prices. Fast/instant pay outs on crypto.' – User, Trustpilot","'Very good app!!! I like the breakdown of the individual categories and the graphs are a very nice touch !!!' – User, Trustpilot","'Polymarket is the best by far has the most volume and realistic odds and most outcomes to bet on.' – Reddit user","'Polymarket is insider traders taking free money from other donators until it's more tightly regulated.' – Reddit user (negative, but real)","'I've been using Polymarket recently, and it clicked with me right away.' – PokerNews review"],
    optionalMetrics: ["Generated more than $2 billion in total volume across major events this year","Some single questions now attract more than $10–20 million in wagers","Trading volume on major platforms surpassed $3 billion in Q3 2025","Hit approximately $474–510 million in November 2024"],
  },
  {
    slug: "notion",
    name: "Notion",
    tagline: "The AI workspace that works for you.",
    description: "Notion is a single workspace where teams and AI agents capture knowledge, find answers, and automate projects, enabling a team of 7 to feel like 70. It introduces Notion 3.0 with features like Notion Agent for task assignment and execution, alongside upcoming Custom Agents. The platform emphasizes productivity by reducing busywork and consolidating tools.",
    logoUrl: "/images/tools/notion-logo.svg",
    rating: 4.7,
    ratingCount: 2675,
    category: "AI Investment Signals",
    pricing: "See pricing plans",
    pricingDetails: "See official website for current pricing.",
    affiliateUrl: "https://www.notion.so",
    features: ["Notion Agent: Assign tasks and the AI agent performs the work.","Enterprise Search: One search across everything.","AI Meeting Notes: Generates perfect notes automatically.","Flexible workflows: Manages any project, big or small.","Automate repetitive tasks: AI handles busywork.","AI writing tools: Rated #1 by G2."],
    pros: ["Flexibility and ease of use, allowing them to customize their workflows","Keep all their information organized in one place","Helps me stay organize and track many projects at once","Very positive one. This software helps me stay organize","Great AI tool for our resources within our organization","Multiple teams use this on a daily and is really changing the way we are interacting with productivity workflow"],
    cons: ["Per seat pricing is getting expensive","Confusing UI for some users","Setup can be time-consuming","Low learnability, unintuitive design","Requires a lot of time and effort to become productive with","Feels extremely slow"],
    verdict: "Notion excels as an all-in-one AI workspace for productivity and knowledge management, with high user praise for flexibility. However, pricing and learnability issues may deter some. This is not financial advice; evaluate for your needs.",
    bestFor: "Teams seeking an AI everything app for productivity, knowledge management, and automation in a single platform, ideal for enterprises and startups (e.g., 62% of Fortune 100, over 50% of YC companies).",
    lastUpdated: "2026-02-04",
    lastVerified: "2026-02-04",
    recommendations: {"fintech_professional":"Best for AI-powered tools","financial_advisor":"Top for portfolio management","quantitative_analyst":"Great for automation"},
    cookieDuration: 90,
    commissionRate: 20,
    hasExclusiveDeal: false,
    videoReviewUrl: "https://www.youtube.com/watch?v=SiJpasKwEHs",
    socialProof: ["'My overall experience with Notion has been a very positive one. This software helps me stay organize and track many projects at once' – User, Capterra","'Notion is ease to use' – User, Capterra","'Great visualization and some data analysis available' – User, Capterra","'We like using Notion for our company docs. Its easy to use' – User, Trustpilot","'Great AI tool for our resources within our organization' – User, Gartner","'I use Notion for everything, and it makes me incredibly productive' – Reddit user"],
    optionalMetrics: ["79% of reviewers have rated Notion 5 stars on G2","Consistently ranks as the G2 industry leader","I've noticed my productivity with my own projects has exploded since I started using it","Done more projects since I started using Notion in the last two years than probably the previous 10 years"],
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
    affiliateUrl: "https://www.tradingview.com",
    features: ["Over 400 indicators and 110+ drawing tools","Real-time data across stocks, forex, crypto, and more","Social community and idea sharing","Custom alerts and screening","Multi-timeframe analysis"],
    pros: ["Powerful charting tools and customization options","Suitable for both beginners and experienced traders","Much more efficient, smoother, and intuitive platform","Best charting experience available today","Powerful charting tool with a massive selection of features","Delivers the best charting experience available today"],
    cons: ["Slow and failing to close positions","Taking forever to enter positions","Lately it has been slow","Overly complicated and doesn't work offline","Occasional platform instability and crashes","Connection keeps dropping"],
    verdict: "TradingView is highly regarded for its superior charting and community features, making it a top choice for market analysis. However, some users report performance issues. This is not financial advice; test for your use case.",
    bestFor: "See verdict for details.",
    lastUpdated: "2026-02-04",
    lastVerified: "2026-02-04",
    recommendations: {"individual_investor":"Best for charting","trader":"Top for market analysis"},
    cookieDuration: 90,
    hasExclusiveDeal: false,
    videoReviewUrl: "https://www.youtube.com/watch?v=ktuEYvVEm5I",
    socialProof: ["'TradingView shows clean and responsive charts. It makes technical analysis easy even for novices.' – G2 user","'Tradingview is a much more efficient, smoother, and intuitive platform, especially for more technical traders.' – Reddit user","'Users consistently praise TradingView for its powerful charting tools and customization options' – G2","'Powerful charting tool with a massive selection of features, such as over 400 indicators and over 110 drawing tools.' – StockBrokers review","'I used to like tradingview but lately it has been slow' – Reddit user (mixed)","'Argubly delivers the best charting experience available today' – StockBrokers"],
  },
  {
    slug: "alpaca",
    name: "Alpaca",
    tagline: "Developer-first API for Stock, Options, Crypto Trading",
    description: "Alpaca provides easy-to-use APIs that enable developers and businesses to trade with algorithms, build financial apps, and embed investing into their services. The platform supports trading stock, options, and crypto, with features like instant tokenization, high yield cash, and multi-leg options strategies. It is trusted by millions of traders and hundreds of fintechs and institutions, offering commission-free trading and developer-friendly SDKs.",
    logoUrl: "/images/tools/alpaca-logo.svg",
    rating: 3,
    ratingCount: 28,
    category: "Fintech Infrastructure",
    pricing: "$0 borrow fees on ETB securities; commission-free trading",
    pricingDetails: "No specific plan names or prices listed; focuses on $0 commissions and fees for Trading API usage, with account-level configurability for High Yield Cash.",
    affiliateUrl: "https://alpaca.markets",
    features: ["Instant Tokenization Network for tokenized equities with in-kind mint/redemption and 24/7 API access.","High Yield Cash with competitive APY on uninvested USD and up to $2.5M FDIC sweep coverage.","Multi-Leg Options for trading spreads, straddles, and condors with real-time/historical data and zero commissions.","24/5 Trading with always-on access, REST/FIX integration, and real-time overnight data.","Fully Paid Securities Lending to earn passive income on owned securities.","Stock Lending for automatic share lending and interest income while retaining ownership.","OmniSub for API-first sub-accounting ledger with real-time visibility into positions and transactions.","Commission-free stock and options trading via Trading API.","Margin and short selling with up to 4X intraday and 2X overnight buying power.","Backtesting with free and advanced market data."],
    pros: ["Commission-free trading, which means users can focus on making profitable trades","Well-designed API for algo trading","API-first design makes it easy to connect my own strategies and execute trades","Supports stocks and crypto with commission-free execution and reliable real-time data","Withdrawals and operations have been smooth","For anyone building algo systems or just wanting a flexible trading backend, Alpaca is a dependable choice"],
    cons: ["Never had an issue and I'm quite surprised about the negative reviews","Only use the FIFO cost method, which is unethical","Buggy beyond belief, and has wild false apparent swings","Support is pretty much next to useless","Won’t honor trade limits unless you are buying in 100 lot bundles","Getting ready to pull money out of Alpaca"],
    verdict: "Alpaca is ideal for developers and algo traders with its API-focused, commission-free platform. While praised for ease and reliability, some report bugs and support issues. This is not financial advice; research thoroughly.",
    bestFor: "Algorithmic traders and quant funds, as it serves them with developer-first APIs, zero-commission trading, low-latency order processing, and tools for building and scaling trading experiences.",
    lastUpdated: "2026-02-04",
    lastVerified: "2026-02-04",
    recommendations: {"fintech_professional":"Top for developer-friendly infrastructure"},
    cookieDuration: 30,
    hasExclusiveDeal: false,
    socialProof: ["'I’ve been using Alpaca for trading stocks since 2023, then a couple of years. Never had an issue' – User, Trustpilot","'Well-designed API for algo trading’ – User, Trustpilot","'The API-first design makes it easy to connect my own strategies and execute trades' – User, Trustpilot","'Supports stocks and crypto with commission-free execution and reliable real-time data' – User, Trustpilot","'Alpaca interface was very easy and trades low-cost' – Reddit user","'Automating the day trading process has dramatically improved my trading results' – Medium user"],
    optionalMetrics: ["Up to 4X intraday and 2X overnight buying power","Up to $2.5M FDIC sweep coverage","Saved well over $1,000 in just commissions alone"],
  },
  {
    slug: "plaid",
    name: "Plaid",
    tagline: "Enabling all companies to build fintech solutions.",
    description: "Plaid enables companies to turn data into revolutionary financial products by connecting to real-time insights on the Plaid Network for fast, safe, and smart financial experiences. It offers solutions for the internet's fastest financial onboarding, fast and secure payments, network-powered fraud signals, cash flow data for underwriting, and open finance solutions. The network grows daily, powering products with new data and insights from the world's largest open banking data network.",
    logoUrl: "/images/tools/plaid-logo.svg",
    rating: 1.2,
    ratingCount: 166,
    category: "Fintech Infrastructure",
    pricing: "See website",
    pricingDetails: "See official website for current pricing.",
    affiliateUrl: "https://plaid.com",
    features: ["Fastest financial onboarding to increase conversion, fight fraud, and onboard customers in seconds.","Seamless bank payments designed to deliver higher conversion rates and increase revenue.","ML-powered fraud signals to stop identity fraud, account takeovers, and risky payments.","Real-time cash flow insights for smarter underwriting to approve more qualified borrowers and reduce risk.","Open banking solutions to meet requirements and simplify data connectivity for customers.","Access to data from 12K banks via APIs, allowing focus on experiences without data acquisition stress.","Network supporting 1 in 2 U.S. adults for trusted experiences.","Up to 25% higher conversion in sign-ups with easy onboarding.","Over 500K daily connections for new data.","Operations in 20 countries for scaling adoption."],
    pros: ["Leading open banking network with 12K+ bank connections","Fast onboarding and fraud detection","Powers 1 in 2 U.S. adults"],
    cons: ["Significant dissatisfaction with the payment system, including invisible transaction limits, frequent failures, and excessive delays.","Universally negative customer service described as non-existent, unhelpful, or bot-based.","Unreliable website and app with frequent problems.","Difficulties connecting accounts, often resulting in error messages or lockouts.","Repeated complaints about software not working, rejecting credentials, and requiring multiple logins or verifications.","All displayed reviews are negative, with no positive ratings shown."],
    verdict: "Plaid is a leading fintech infrastructure provider enabling seamless financial data connections, but user reviews highlight significant issues with reliability and customer support. It may suit developers building fintech solutions, but caution is advised due to reported problems. This is not financial advice; always conduct thorough due diligence.",
    bestFor: "Companies building fintech solutions, focusing on financial onboarding, payments, fraud detection, and open banking.",
    lastUpdated: "2026-02-04",
    lastVerified: "2026-02-04",
    recommendations: {"fintech_professional":"Best for fintech infrastructure"},
    cookieDuration: 30,
    hasExclusiveDeal: false,
    socialProof: ["All displayed reviews are negative, with no positive ratings shown – Various users, Trustpilot.","Significant dissatisfaction with the payment system – User, Trustpilot.","Universally negative customer service – User, Trustpilot.","Unreliable website and app – User, Trustpilot.","Difficulties connecting accounts – User, Trustpilot.","Software not working – User, Trustpilot."],
  },
  {
    slug: "binance",
    name: "Binance",
    tagline: "The World’s Most Trusted Cryptocurrency Exchange to Buy, Trade & Invest in Crypto",
    description: "Binance is the world's leading cryptocurrency exchange, catering to over 270 million registered users in over 180 countries. It offers low fees and over 500 cryptocurrencies to trade, including Bitcoin, altcoins, and other virtual assets. Users can trade on Spot, Margin, and Futures markets, buy and sell via P2P, earn interest through Binance Earn, and access token launches via Launchpool, Airdrop, and Megadrop.",
    logoUrl: "/images/tools/binance-logo.svg",
    rating: 4,
    ratingCount: 0,
    category: "Crypto Tools",
    pricing: "See website",
    pricingDetails: "See official website for current pricing.",
    affiliateUrl: "https://www.binance.com",
    features: ["Deep liquidity and low fees for trading.","Complete range of products including Spot, Futures, Earn, and P2P markets.","Ability to track crypto live prices, explore new cryptocurrencies, and discover top gaining or losing cryptos.","Exclusive early access to token launches through Binance MegaDrop and innovative pre-listing projects via Binance Alpha.","Strong security with the Security of User Assets Fund (SAFU) established in 2018, holding a reserve of 1,000,000,000 USDC as of September 2025.","Over 500 cryptocurrencies available for trade.","Earn interest on more than 180+ cryptocurrencies via Binance Earn products.","Trade, stake, and loan NFTs on Binance NFT marketplace.","Mobile trading available on iOS and Android apps.","Identity verification required for buying crypto and trading."],
    pros: ["Deep liquidity and low fees","500+ cryptocurrencies","Strong security with SAFU fund","Global reach in 180+ countries","Earn products and staking"],
    cons: ["Huge waste of time, mainly because of the terrible customer support.","Easy for scammers to cheat you.","Super slow to execute orders.","Delay in submitting orders.","Platform is subject to manipulation, with outcomes influenced by individuals holding substantial amounts of tokens.","Rigged or arbitrary resolutions."],
    verdict: "Binance is a dominant cryptocurrency exchange with extensive features and global reach, praised for liquidity and variety. However, concerns about customer support and potential manipulation persist. This is not financial advice; users should verify compliance and risks.",
    bestFor: "Cryptocurrency traders seeking low fees, diverse assets, and advanced trading options.",
    lastUpdated: "2026-02-04",
    lastVerified: "2026-02-04",
    recommendations: {"trader":"Best for crypto trading","individual_investor":"Top for global access"},
    cookieDuration: 30,
    commissionRate: 50,
    hasExclusiveDeal: false,
    socialProof: ["'I've been using Binance for quite a while now' – Reddit user.","'Deep liquidity and low fees' – User, Trustpilot.","'Largest crypto exchange by trade volume' – Binance.","'Over 270 million registered users in 180+ countries' – Binance.","'Strong security with SAFU fund' – User review.","'500+ cryptocurrencies available' – User, Trustpilot."],
    optionalMetrics: ["$65 billion average daily volume","Over 270 million registered users","300 billion spot transactions in 2022","24/7 customer support in 40 languages","SAFU fund: 1,000,000,000 USDC reserve as of September 2025"],
  },
  {
    slug: "wealthfront",
    name: "Wealthfront",
    tagline: "Money works better here | Wealthfront",
    description: "Wealthfront offers automated investing through a globally diversified portfolio of index funds designed to maximize long-term, after-tax returns and managed automatically without needing client interaction. It also provides a stock investing account for buying stocks and ETFs with zero commissions and a $1 minimum to start, focused on long-term investing rather than frequent trading. Additional options include retirement accounts, 529 education savings plans, S&P 500 Direct, Nasdaq-100 Direct, automated bond ladder, and automated bond portfolio for diversified investing.",
    logoUrl: "/images/tools/wealthfront-logo.svg",
    rating: 1.9,
    ratingCount: 20,
    category: "Portfolio Management",
    pricing: "$0 fees for self-directed investing (wrap fee waived); $0 monthly or maintenance fees on high-yield cash; lower fees on IRA rollovers from high-cost 401(k)s.",
    pricingDetails: "No specific pricing details are provided for accounts or services; investments start with $1 for stocks and ETFs, and trades are zero commissions.",
    affiliateUrl: "https://www.wealthfront.com",
    features: ["Globally diversified index investing managed automatically.","Designed to improve long-term, after-tax returns in volatile markets.","Zero commissions on trades and $1 to start investing in stocks and ETFs.","Tax-advantaged retirement accounts with globally diversified portfolios.","Tax-free 529 Education Savings Plan for college, K-12, and other education expenses.","Invest in individual S&P 500 stocks with tax savings.","Invest in individual Nasdaq-100 stocks with tax savings.","Automated Bond Ladder using US Treasuries to lock in rates and skip state income taxes.","Automated Bond Portfolio of low-risk bond ETFs for higher yield than cash savings.","Rated 4.8 on Apple App Store and 4.9 on Google Play Store."],
    pros: ["High interest rate on cash account (5%).","Easy-to-use mobile app.","Free roboinvesting for smaller balances.","Ability to track other accounts in one place.","Decent for hands-off investing.","Good customer service in some cases."],
    cons: ["Poor fraud protection and unauthorized transactions not refunded.","Failure to deliver promised bonuses.","Rude customer service and hang-ups.","Website and account access issues (e.g., locked accounts, no responses).","Deceptive practices.","Significant investment losses (e.g., $7K due to underperforming funds)."],
    verdict: "Wealthfront provides automated, tax-efficient investing with strong features for long-term growth, but reviews indicate issues with security and support. It suits passive investors, but potential risks should be considered. This is not financial advice; evaluate personally.",
    bestFor: "Passive investors seeking automated, tax-optimized portfolios and high-yield cash options.",
    lastUpdated: "2026-02-04",
    lastVerified: "2026-02-04",
    recommendations: {"individual_investor":"Best for passive investing","financial_advisor":"Top for robo-advisory"},
    cookieDuration: 30,
    hasExclusiveDeal: false,
    socialProof: ["'High interest rate on cash account (5%)' – User, Trustpilot.","'Easy-to-use mobile app' – User, Trustpilot.","'Free roboinvesting for smaller balances' – User, Trustpilot.","'Ability to track other accounts in one place' – User, Trustpilot.","'Decent for hands-off investing' – User, Trustpilot.","'Good customer service in some cases' – User, Trustpilot."],
  },
  {
    slug: "betterment",
    name: "Betterment",
    tagline: "Automated investing & Financial planning.",
    description: "Betterment offers automated investing with diversified, expert-built portfolios, high-yield cash accounts earning up to 3.90% variable APY, and tax-advantaged IRAs for retirement savings. It manages over $65B in assets for more than 1 million customers, focusing on ease, tax efficiency, and long-term returns. Core portfolios have delivered over 9% composite annual time-weighted returns after fees since launch.",
    logoUrl: "/images/tools/betterment-logo.svg",
    rating: 1.6,
    ratingCount: 53,
    category: "Portfolio Management",
    pricing: "0.25% annual fee (Digital); 0.40% for Premium ($100K+); cash up to 3.90% APY",
    pricingDetails: "Digital plan: 0.25% annual advisory fee. Premium: 0.40% for $100K+ with human advisor access. High-yield cash: up to 3.90% variable APY, $0 fees. Tax-loss harvesting may cover fees for many users. See official website for current pricing.",
    affiliateUrl: "https://www.betterment.com",
    features: ["Diversified, expert-built portfolios using low-cost exchange-traded funds.","Tax-loss harvesting to turn market dips into tax savings, with nearly 70% of customers covering fees through estimated savings.","Ongoing portfolio monitoring, rebalancing, and dividend reinvestment.","High-yield cash account with 3.25% variable APY, 8x the national average.","$0 fees on cash accounts with no monthly or maintenance costs.","FDIC insurance up to $2 million per account ($4 million for joint) through program banks.","Tax-coordinated IRAs (traditional, Roth, SEP) for maximum efficiency.","Personalized retirement planning with savings recommendations and adjustments.","Fractional share trading and no commission or management fees on self-directed investing (wrap fee waived)."],
    pros: ["Quick and easy transfers between bank and Betterment (usually two business days).","One user had a positive experience with support resolving an issue."],
    cons: ["Poor customer support (no phone availability, long delays in responses, inability to speak with supervisors).","Data security and privacy issues (unauthorized access to customer information, refusal to delete data unless in California).","Hidden fees (2% loss on bond fund, increased base fee from $500/year to $1200/year with exit fee option).","Fund access delays (5–7 business days for transfers, holds on withdrawals, frozen funds).","Scam allegations (manipulation, fraud, spamming via email registration).","Difficulty closing accounts or transferring out."],
    verdict: "Betterment provides automated, tax-efficient investing with strong long-term performance, but reviews highlight significant issues with support and security. It may appeal to hands-off investors, but risks should be weighed. This is not financial advice; conduct due diligence.",
    bestFor: "Investors seeking automated, diversified portfolios with tax optimization.",
    lastUpdated: "2026-02-04",
    lastVerified: "2026-02-04",
    recommendations: {"individual_investor":"Best for robo-advisory","financial_advisor":"Top for tax-efficient IRAs"},
    cookieDuration: 30,
    commissionRate: 50,
    hasExclusiveDeal: false,
    socialProof: ["'Quick and easy transfers between bank and Betterment (usually two business days)' – User, Trustpilot.","'One user had a positive experience with support resolving an issue' – User, Trustpilot.","'100% scam' – Verified user, Trustpilot.","'Poor customer support' – User, Trustpilot.","'Data security issues' – User, Trustpilot.","'Hidden fees' – User, Trustpilot."],
  },
  {
    slug: "robinhood",
    name: "Robinhood",
    tagline: "24/5 Commission-Free Stock Trading & Investing",
    description: "Robinhood offers intuitive trading tools to build strategies and track market trends seamlessly. Users can trade stocks, options, crypto, and more via Robinhood Legend and the Robinhood app. Brokerage services are provided through Robinhood Financial LLC, a registered broker-dealer.",
    logoUrl: "/images/tools/robinhood-logo.svg",
    rating: 1.3,
    ratingCount: 4203,
    category: "Portfolio Management",
    pricing: "Commission-free trading with no additional cost for Robinhood Legend, but other fees apply to brokerage accounts (review fee schedule for details). Robinhood Gold is a subscription-based membership program offering premium services.",
    pricingDetails: "See official website for current pricing.",
    affiliateUrl: "https://robinhood.com",
    features: ["Commission-free stock trading.","Trading of options.","Cryptocurrency trading through Robinhood Crypto.","Portfolio management via Robinhood Strategies, an SEC-registered investment advisor.","Robinhood Protection Guarantee, including data security and protection from unauthorized activity.","Multi-factor authentication on all accounts.","24/7 customer support availability.","Access to Robinhood Learn for investor education in the app."],
    pros: ["Commission-free trading","User-friendly mobile app","Stocks, options, and crypto","Fractional shares","Robinhood Gold for premium features"],
    cons: ["Payment delays, fund inaccessibility.","Poor customer service (unhelpful, unresponsive, no human support).","Technical difficulties (glitchy crypto transfers, website problems).","Unauthorized charges, withdrawal restrictions.","Misleading policies (e.g., referral program inconsistencies).","Scams, locked accounts, and ineffective support."],
    verdict: "Robinhood democratizes investing with commission-free trading and user-friendly tools, but faces criticism for support and reliability issues. It suits beginner investors, but experienced users may seek alternatives. This is not financial advice; assess risks carefully.",
    bestFor: "Beginner and retail investors looking for commission-free trading in stocks, options, and crypto.",
    lastUpdated: "2026-02-04",
    lastVerified: "2026-02-04",
    recommendations: {"individual_investor":"Best for retail trading","trader":"Top for commission-free access"},
    cookieDuration: 30,
    hasExclusiveDeal: false,
    socialProof: ["'Commission-free trading, which means users can focus on making profitable trades' – User, Reddit.","'Well-designed API for algo trading' – User, Reddit.","'API-first design makes it easy to connect my own strategies and execute trades' – User, Reddit.","'Supports stocks and crypto with commission-free execution and reliable real-time data' – User, Reddit.","'Withdrawals and operations have been smooth' – User, Reddit.","'For anyone building algo systems or just wanting a flexible trading backend, Alpaca is a dependable choice' – User, Reddit."],
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
