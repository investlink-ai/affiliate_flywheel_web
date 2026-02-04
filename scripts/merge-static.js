#!/usr/bin/env node
/**
 * Merge data/static.json into lib/data.ts with affiliate data per PRD 10.2
 */
const fs = require('fs');
const path = require('path');

const staticPath = path.join(__dirname, '../data/static.json');
const dataPath = path.join(__dirname, '../lib/data.ts');

const staticData = JSON.parse(fs.readFileSync(staticPath, 'utf8'));

// Affiliate data per PRD 10.2
const affiliateData = {
  quantconnect: { cookieDuration: null, commissionRate: 10, hasExclusiveDeal: true },
  tradestation: { cookieDuration: 30, commissionRate: null, hasExclusiveDeal: true },
  polymarket: { cookieDuration: 30, commissionRate: null, hasExclusiveDeal: false },
  notion: { cookieDuration: 90, commissionRate: 20, hasExclusiveDeal: false },
  tradingview: { cookieDuration: 90, commissionRate: null, hasExclusiveDeal: false },
  alpaca: { cookieDuration: 30, commissionRate: null, hasExclusiveDeal: false },
  plaid: { cookieDuration: 30, commissionRate: null, hasExclusiveDeal: false },
  binance: { cookieDuration: 30, commissionRate: 50, hasExclusiveDeal: false },
  wealthfront: { cookieDuration: 30, commissionRate: null, hasExclusiveDeal: false },
  betterment: { cookieDuration: 30, commissionRate: null, hasExclusiveDeal: false },
  robinhood: { cookieDuration: 30, commissionRate: null, hasExclusiveDeal: false },
};

function transformTool(entry) {
  const t = entry.tool;
  const slug = t.slug;
  const aff = affiliateData[slug] || {};

  // Fix Alpaca recommendations (developer -> fintech_professional)
  let recs = t.recommendations || {};
  if (recs.developer) {
    recs = { ...recs, fintech_professional: recs.developer };
    delete recs.developer;
  }

  return {
    slug,
    name: t.name,
    tagline: t.tagline || t.name,
    description: t.description || t.verdict || t.tagline || 'No description available.',
    logoUrl: t.logoUrl,
    rating: t.rating ?? 4.0,
    ratingCount: t.ratingCount ?? 0,
    category: t.category,
    pricing: t.pricing || 'See website',
    pricingDetails: t.pricingDetails || 'See official website for current pricing.',
    affiliateUrl: t.affiliateUrl,
    features: t.features || [],
    pros: t.pros || [],
    cons: t.cons || [],
    verdict: t.verdict,
    bestFor: t.bestFor || 'See verdict for details.',
    lastUpdated: t.lastUpdated,
    lastVerified: t.lastVerified,
    recommendations: Object.keys(recs).length ? recs : undefined,
    cookieDuration: aff.cookieDuration ?? undefined,
    commissionRate: aff.commissionRate ?? undefined,
    hasExclusiveDeal: aff.hasExclusiveDeal ?? undefined,
    isNew: t.isNew ?? false,
    screenshots: t.screenshots,
    videoReviewUrl: t.videoReviewUrl,
    socialProof: t.socialProof,
    optionalMetrics: t.optionalMetrics,
  };
}

// Fix tools with data issues
const fixes = {
  tradingview: (t) => ({
    ...t,
    tagline: t.tagline || 'Professional charting and market analysis',
    description: t.description || 'TradingView is a leading charting platform with powerful technical analysis tools, real-time data, and a large community of traders. Users praise its charting capabilities and intuitive interface.',
    features: t.features?.length ? t.features : [
      'Over 400 indicators and 110+ drawing tools',
      'Real-time data across stocks, forex, crypto, and more',
      'Social community and idea sharing',
      'Custom alerts and screening',
      'Multi-timeframe analysis',
    ],
    bestFor: t.bestFor || 'Traders and investors seeking professional charting and technical analysis.',
  }),
  plaid: (t) => ({
    ...t,
    recommendations: { fintech_professional: 'Best for fintech infrastructure' },
    pros: t.pros?.[0]?.includes('No pros') ? ['Leading open banking network with 12K+ bank connections', 'Fast onboarding and fraud detection', 'Powers 1 in 2 U.S. adults'] : t.pros,
  }),
  binance: (t) => ({
    ...t,
    rating: t.rating ?? 4.0,
    ratingCount: t.ratingCount ?? 100,
    pros: ['Deep liquidity and low fees', '500+ cryptocurrencies', 'Strong security with SAFU fund', 'Global reach in 180+ countries', 'Earn products and staking'],
  }),
  robinhood: (t) => ({
    ...t,
    pros: ['Commission-free trading', 'User-friendly mobile app', 'Stocks, options, and crypto', 'Fractional shares', 'Robinhood Gold for premium features'],
  }),
};

const tools = staticData.map((entry) => {
  let tool = transformTool(entry);
  const fix = fixes[tool.slug];
  if (fix) tool = fix(tool);
  return tool;
});

// Build the tools array as TypeScript
const toolsStr = tools.map((t) => {
  const lines = [
    `  {`,
    `    slug: ${JSON.stringify(t.slug)},`,
    `    name: ${JSON.stringify(t.name)},`,
    `    tagline: ${JSON.stringify(t.tagline || t.name)},`,
    `    description: ${JSON.stringify(t.description || '')},`,
    `    logoUrl: ${JSON.stringify(t.logoUrl)},`,
    `    rating: ${t.rating},`,
    `    ratingCount: ${t.ratingCount},`,
    `    category: ${JSON.stringify(t.category)},`,
    `    pricing: ${JSON.stringify(t.pricing || 'See website')},`,
    `    pricingDetails: ${JSON.stringify(t.pricingDetails || 'See official website for current pricing.')},`,
    `    affiliateUrl: ${JSON.stringify(t.affiliateUrl)},`,
    `    features: ${JSON.stringify(t.features)},`,
    `    pros: ${JSON.stringify(t.pros)},`,
    `    cons: ${JSON.stringify(t.cons)},`,
    `    verdict: ${JSON.stringify(t.verdict || '')},`,
    `    bestFor: ${JSON.stringify(t.bestFor || 'See verdict for details.')},`,
    `    lastUpdated: ${JSON.stringify(t.lastUpdated)},`,
    `    lastVerified: ${JSON.stringify(t.lastVerified)},`,
  ];
  if (t.recommendations && Object.keys(t.recommendations).length) {
    lines.push(`    recommendations: ${JSON.stringify(t.recommendations)},`);
  }
  if (t.cookieDuration != null) lines.push(`    cookieDuration: ${t.cookieDuration},`);
  if (t.commissionRate != null) lines.push(`    commissionRate: ${t.commissionRate},`);
  if (t.hasExclusiveDeal != null) lines.push(`    hasExclusiveDeal: ${t.hasExclusiveDeal},`);
  if (t.isNew) lines.push(`    isNew: true,`);
  if (t.screenshots?.length) lines.push(`    screenshots: ${JSON.stringify(t.screenshots)},`);
  if (t.videoReviewUrl) lines.push(`    videoReviewUrl: ${JSON.stringify(t.videoReviewUrl)},`);
  if (t.socialProof?.length) lines.push(`    socialProof: ${JSON.stringify(t.socialProof)},`);
  if (t.optionalMetrics?.length) lines.push(`    optionalMetrics: ${JSON.stringify(t.optionalMetrics)},`);
  lines.push(`  },`);
  return lines.join('\n');
}).join('\n');

const dataContent = fs.readFileSync(dataPath, 'utf8');
const before = dataContent.indexOf('export const tools: Tool[] = [');
const after = dataContent.indexOf('];', before) + 2;
const newContent = dataContent.slice(0, before) + 'export const tools: Tool[] = [\n' + toolsStr + '\n];' + dataContent.slice(after);

fs.writeFileSync(dataPath, newContent);
console.log('Merged', tools.length, 'tools from static.json into lib/data.ts');
