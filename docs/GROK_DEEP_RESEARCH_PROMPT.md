# Grok Deep Research Prompt for Tool Review Data

**Purpose:** Populate `lib/data.ts` with **real, researched, cited data** — not AI-generated fabrications. Use Grok's deep research / web search to find and verify information from actual sources.

**Target:** AI Tool Reviews affiliate site (affievo.com) — honest, expert-style reviews for AI productivity tools.

---

## 1. System Context (Paste First)

```
You are a research assistant for an AI tool review website. Your job is to DEEP RESEARCH real information about software products and output structured data. 

CRITICAL RULES:
1. ONLY report facts you find from actual web sources. Never invent, hallucinate, or guess.
2. CITE every claim with a specific URL. If you cannot find a source, output null for that field.
3. For ratings: Use G2, Capterra, or Trustpilot aggregate data. Include the source URL.
4. For pros/cons: Summarize recurring themes from REAL user reviews. Quote or paraphrase from actual reviews. Do not make up generic pros/cons.
5. For pricing: Visit the official pricing page. Report exact numbers and plan names. If pricing is "contact sales," say so.
6. For features: Extract from official website, product pages, or documentation. Do not assume features exist.
7. If information is outdated (e.g., pricing changed), note it and provide the most recent data you can find.
8. Be honest about gaps. Use null for fields you cannot verify.
```

---

## 2. Tool Data Schema (Output Format)

Output valid JSON matching this TypeScript interface:

```typescript
interface Tool {
  slug: string;              // URL-friendly ID, lowercase, hyphens (e.g. "jasper-ai")
  name: string;              // Official product name
  tagline: string;           // One-line description (from official site or common usage)
  description: string;       // 2-4 sentences, factual overview
  logoUrl: string;           // Path format: "/images/tools/{slug}-logo.svg" (we add logo separately)
  rating: number;            // 1-5, from G2/Capterra/Trustpilot aggregate
  ratingCount: number;       // Total review count from same source
  category: string;          // EXACTLY one of: "AI Writing" | "AI Voice" | "AI Images" | "AI Video" | "AI Productivity"
  pricing: string;           // Short display string (e.g. "Free / $49/mo", "From $15/mo")
  pricingDetails: string;   // Full breakdown: plan names, prices, limits
  affiliateUrl: string;      // Official website URL (e.g. https://jasper.ai) — NO affiliate params; we add those
  features: string[];        // 6-10 concrete features, from official sources
  pros: string[];            // 4-6 advantages, from real user reviews
  cons: string[];            // 4-6 disadvantages, from real user reviews
  verdict: string;          // 2-4 sentences, expert-style conclusion based on research
  bestFor: string;           // Target audience (e.g. "Marketing teams and agencies")
  lastUpdated: string;       // ISO date: YYYY-MM-DD (today's date when you run research)
  lastVerified: string;     // ISO date: YYYY-MM-DD (same as lastUpdated)
  recommendations?: {       // Optional: which user types this tool fits
    marketer?: string;
    creator?: string;
    solopreneur?: string;
    agency?: string;
    developer?: string;
  };
  cookieDuration?: number;   // Affiliate cookie days — SKIP (we get from affiliate dashboard)
  commissionRate?: number;  // Affiliate % — SKIP (we get from affiliate dashboard)
  hasExclusiveDeal?: boolean;  // SKIP unless publicly known
  isNew?: boolean;          // true if launched/relaunched in last ~12 months
  screenshots?: string[];   // Optional: public screenshot URLs
  videoReviewUrl?: string;  // Optional: YouTube review URL if you find a credible one
  socialProof?: string[];  // User quotes from public reviews; format: "quote – attribution" (e.g. "'Saves hours weekly' – Marketer, G2, Jan 2026")
}
```

**Categories (use exactly):** `AI Writing` | `AI Voice` | `AI Images` | `AI Video` | `AI Productivity`

**User types for recommendations:** `marketer` | `creator` | `solopreneur` | `agency` | `developer`

---

## 3. Required Sources Checklist

For each tool, you MUST search and cite:

| Field | Required Sources | Fallback |
|-------|------------------|----------|
| **rating, ratingCount** | G2, Capterra, or Trustpilot | Product Hunt, App Store | 
| **pricing, pricingDetails** | Official pricing page | No fallback — use null if not found |
| **features** | Official website, product page, docs | — |
| **pros** | User reviews (G2, Capterra, Reddit) | — |
| **cons** | User reviews (G2, Capterra, Reddit) | — |
| **socialProof** | User reviews (G2, Capterra, Reddit) — 4-6 quotes with attribution | — |
| **tagline, description** | Official website | — |
| **bestFor** | Marketing copy + user review themes | — |
| **verdict** | Synthesize from all above; cite key sources | — |

---

## 4. Per-Tool Research Prompt (Use for Each Tool)

Copy this block and replace `{TOOL_NAME}` and `{TOOL_URL}` for each tool.

```
## Deep Research Task: {TOOL_NAME}

**Tool to research:** {TOOL_NAME}
**Official URL:** {TOOL_URL}

### Instructions

1. **Enable deep research / web search** (Grok's research mode).

2. **Search and verify:**
   - Visit {TOOL_URL} — extract tagline, description, features, pricing
   - Search "{TOOL_NAME} G2 reviews" — get aggregate rating and review count
   - Search "{TOOL_NAME} Capterra reviews" (or Trustpilot) — cross-check rating
   - Search "{TOOL_NAME} Reddit" or "{TOOL_NAME} review" — find real user pros/cons
   - Search "{TOOL_NAME} pricing 2025" or "2026" — get current pricing

3. **Output requirements:**
   - Return a single JSON object matching the Tool schema above
   - Include a "sources" array with URLs you used for each major claim
   - Use null for any field you cannot verify from a real source
   - For slug: convert name to lowercase, replace spaces with hyphens (e.g. "Jasper AI" → "jasper-ai")

4. **Quality rules:**
   - Pros and cons must reflect REAL user feedback, not generic marketing
   - Rating must come from a review platform (G2/Capterra/Trustpilot), not invented
   - If multiple platforms have different ratings, use the one with more reviews, and note the source
   - Verdict should be 2-4 sentences synthesizing your research — not promotional fluff

### Output Format

```json
{
  "tool": { ... Tool object ... },
  "sources": [
    { "field": "rating", "url": "https://...", "note": "G2 aggregate" },
    { "field": "pricing", "url": "https://...", "note": "Official pricing page" },
    ...
  ],
  "confidence": "high" | "medium" | "low",
  "gaps": ["List any fields you could not verify"]
}
```
```

---

## 5. Tool List to Research

Use the prompt above for each of these tools:

| Tool Name | Official URL | Slug | Category |
|-----------|-------------|------|----------|
| Jasper AI | https://www.jasper.ai | jasper-ai | AI Writing |
| Copy.ai | https://www.copy.ai | copy-ai | AI Writing |
| Murf AI | https://murf.ai | murf-ai | AI Voice |
| Notion AI | https://www.notion.so/product/ai | notion-ai | AI Productivity |
| Runway ML | https://runwayml.com | runway-ml | AI Video |
| Descript | https://www.descript.com | descript | AI Video |

---

## 6. Quiz Tag Alignment (For recommendations)

When assigning `recommendations`, consider these quiz tags so the tool appears in relevant quiz results:

| Slug | Strong tags | User types |
|------|-------------|------------|
| jasper-ai | AI Writing, marketing, copy, team, agency, brand-voice, premium | marketer, agency |
| copy-ai | AI Writing, copy, solo, budget-friendly, free-tier, unlimited | solopreneur, creator |
| murf-ai | AI Voice, video, audio, solo, small-team | creator |
| notion-ai | AI Productivity, versatile, solo, team, budget-friendly | solopreneur, agency, developer |
| runway-ml | AI Video, video, solo, small-team, pro-features | creator |
| descript | AI Video, AI Voice, video, audio, solo, free-tier | creator, solopreneur |

---

## 7. Example: Filled Prompt for Jasper AI

```
## Deep Research Task: Jasper AI

**Tool to research:** Jasper AI
**Official URL:** https://www.jasper.ai

### Instructions

1. **Enable deep research / web search** (Grok's research mode).

2. **Search and verify:**
   - Visit https://www.jasper.ai — extract tagline, description, features, pricing
   - Search "Jasper AI G2 reviews" — get aggregate rating and review count
   - Search "Jasper AI Capterra reviews" — cross-check rating
   - Search "Jasper AI Reddit" or "Jasper AI review" — find real user pros/cons
   - Search "Jasper AI pricing 2025" or "2026" — get current pricing

3. **Output requirements:**
   - Return a single JSON object matching the Tool schema
   - Include a "sources" array with URLs for each major claim
   - Use null for any field you cannot verify
   - Slug: "jasper-ai"

4. **Quality rules:**
   - Pros and cons from REAL user feedback
   - Rating from G2/Capterra/Trustpilot
   - Verdict: 2-4 sentences synthesizing research

### Output Format

```json
{
  "tool": { ... },
  "sources": [ ... ],
  "confidence": "high" | "medium" | "low",
  "gaps": [ ... ]
}
```
```

---

## 8. Post-Research: Manual Steps

After receiving Grok's output:

1. **Add affiliate data** (from your dashboard): `affiliateUrl` (with ref param), `commissionRate`, `cookieDuration`, `hasExclusiveDeal`
2. **Download logo** to `public/images/tools/{slug}-logo.svg` (or .png)
3. **Spot-check** 2–3 sources to verify critical claims
4. **Merge** into `lib/data.ts` — ensure slug matches `toolScoring` keys in `lib/quiz-scoring.ts`
5. **Add toolScoring** entry in `lib/quiz-scoring.ts` if it's a new tool

---

## 9. Validation Checklist

Before adding to `lib/data.ts`:

- [ ] `slug` matches existing pattern (lowercase, hyphens)
- [ ] `category` is exactly one of the 5 allowed values
- [ ] `rating` is between 1 and 5
- [ ] `ratingCount` is a positive integer
- [ ] `affiliateUrl` is the base URL (we add ?ref= in AffiliateLink component)
- [ ] `lastUpdated` and `lastVerified` are ISO dates
- [ ] `features`, `pros`, `cons` are non-empty arrays
- [ ] `recommendations` keys are valid UserTypes if present
- [ ] Sources are cited for rating, pricing, and pros/cons

---

## 10. Grok-Specific Notes

- **Grok 2 / Grok 3** with "Deep Research" or "Search" mode: Use it. The model will search the web and cite sources.
- **Multi-step:** For complex tools, you may run research in 2 steps: (1) pricing + features, (2) reviews + pros/cons.
- **Rate limits:** Research one tool at a time if you hit limits.
- **Recency:** Specify "2025" or "2026" in search queries to bias toward current data.

---

## 11. Copy-Paste Ready: Single Tool Prompt (Jasper AI Example)

Paste this entire block into Grok with Deep Research enabled:

---

You are a research assistant for an AI tool review website. Your job is to DEEP RESEARCH real information about software products. CRITICAL: Only report facts from actual web sources. Never invent data. Cite URLs for every claim.

**Research this tool:** Jasper AI (https://www.jasper.ai)

**Tasks:**
1. Visit jasper.ai — get tagline, description, features list, current pricing
2. Search "Jasper AI G2 reviews" — get aggregate rating (1-5) and total review count
3. Search "Jasper AI Capterra" or "Jasper AI Trustpilot" — cross-check rating
4. Search "Jasper AI Reddit review" — extract 4-6 real user PROS and 4-6 real user CONS
5. Search "Jasper AI pricing 2025" — verify current plans and prices

**Output:** Return a JSON object with this structure. Use null for any field you cannot verify from a real source.

```json
{
  "tool": {
    "slug": "jasper-ai",
    "name": "Jasper AI",
    "tagline": "",
    "description": "",
    "logoUrl": "/images/tools/jasper-ai-logo.svg",
    "rating": null,
    "ratingCount": null,
    "category": "AI Writing",
    "pricing": "",
    "pricingDetails": "",
    "affiliateUrl": "https://www.jasper.ai",
    "features": [],
    "pros": [],
    "cons": [],
    "verdict": "",
    "bestFor": "",
    "lastUpdated": "2026-02-02",
    "lastVerified": "2026-02-02",
    "recommendations": {
      "marketer": "Best for Marketers",
      "agency": "Top Pick for Agencies"
    }
  },
  "sources": [
    { "field": "rating", "url": "", "note": "" },
    { "field": "pricing", "url": "", "note": "" }
  ],
  "confidence": "high|medium|low",
  "gaps": []
}
```

**Rules:** Rating must come from G2/Capterra/Trustpilot. Pros and cons must be from real user reviews, not invented. Category must be exactly "AI Writing".

---

## 12. Batch Prompt Template (All 6 Tools)

For researching multiple tools in one session, use this structure:

---

You are a research assistant for an AI tool review website. DEEP RESEARCH each tool below. Only report facts from actual sources (G2, Capterra, official sites). Never invent data. Cite URLs.

**Tools to research:**
1. Jasper AI — https://www.jasper.ai — slug: jasper-ai — category: AI Writing
2. Copy.ai — https://www.copy.ai — slug: copy-ai — category: AI Writing
3. Murf AI — https://murf.ai — slug: murf-ai — category: AI Voice
4. Notion AI — https://www.notion.so/product/ai — slug: notion-ai — category: AI Productivity
5. Runway ML — https://runwayml.com — slug: runway-ml — category: AI Video
6. Descript — https://www.descript.com — slug: descript — category: AI Video

**For each tool:** Visit official site + search "ToolName G2/Capterra/Reddit reviews". Extract: tagline, description, features (6-10), pricing, rating, ratingCount, pros (4-6 from real reviews), cons (4-6 from real reviews), verdict (2-4 sentences), bestFor.

**Output:** JSON array of 6 objects, each with `tool`, `sources`, `confidence`, `gaps`. Use today's date for lastUpdated/lastVerified. Use null for unverifiable fields.

---
