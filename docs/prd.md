# Product Requirements Document (PRD)
## AI Tool Reviews - Affiliate Flywheel

**Version:** 1.1  
**Last Updated:** January 2026  
**Status:** Active Development

---

## 1. Executive Summary

### 1.1 Vision

AI Tool Reviews is an AI-powered affiliate review platform designed to help creators, marketers, solopreneurs, and agencies discover the best AI productivity and content creation tools. The platform is built upon the **EvoLink Architect** persona and guided by the **AI-Powered Affiliate Flywheel Philosophy Framework**—a timeless, principle-based system for building self-evolving, value-creating affiliate ecosystems.

### 1.2 Mission

Deliver honest, in-depth, and personalized AI tool recommendations that build user trust, drive high conversion rates, and create sustainable affiliate revenue through a self-optimizing flywheel model.

### 1.3 Core Value Proposition

- **For Users:** Unbiased, expert-tested reviews with personalized recommendations based on user type and needs
- **For Business:** Scalable affiliate revenue through high-converting content, A/B testing, and data-driven optimization

### 1.4 Guiding Philosophy

> Reference: [EvoLink.md](./EvoLink.md) | [philosophy_framework.md](./philosophy_framework.md)

This product is designed and evolved through the lens of the **EvoLink Architect** persona—a virtual mastermind that blends strategic foresight, technical prowess, and adaptive intelligence. All decisions reference the five interconnected modules of the philosophy framework:

1. **Core Values** — Foundational beliefs that anchor the system
2. **Decision Principles** — Judgment guidelines for evaluating opportunities
3. **Objective Orientation** — Phased directional goals
4. **Boundary Constraints** — Non-negotiable guardrails
5. **Evolution Mechanisms** — Self-improvement loops

---

## 2. Business Context & Strategy

> Reference: [business_context.md](./business_context.md)

### 2.1 Core Values Alignment

The platform embodies the four foundational beliefs of the EvoLink philosophy:

| Core Value | Platform Implementation |
|------------|------------------------|
| **AI Empowerment & Human Augmentation** | AI handles 80%+ of routine tasks (personalization, A/B testing, analytics) while humans provide strategic direction, content quality oversight, and ethical review |
| **Reusability & Leverage** | Modular components (review templates, quiz scoring, schema generators) scale across tools and categories with minimal additional effort |
| **Self-Adaptation & Continuous Improvement** | Embedded feedback loops via analytics, A/B testing infrastructure, and performance monitoring enable automatic refinement |
| **Value-Centric & Sustainable Growth** | Transparent FTC disclosures, LLM deep research with cited sources, and trust-building content prioritize genuine user value over manipulation |

### 2.2 Decision Principles in Practice

Every product decision is evaluated against these judgment guidelines:

| Decision Principle | Application |
|--------------------|-------------|
| **Automation Feasibility First** | "Can this be automated?" — Quiz scoring, personalization, tracking are automated; human review reserved for content quality |
| **Impact & Leverage Prioritization** | Focus on high-ROI levers: evergreen review content, reusable quiz algorithms, compounding SEO assets |
| **Dynamic Adaptation & Opportunity Alignment** | Monitor market signals (new AI tools, algorithm changes) and pivot strategy accordingly |
| **Excellence Benchmarking** | Target 5-10% conversion rates vs. 2% industry average; measure against top affiliate performers |
| **Enduring Practice Alignment** | Ground tactics in timeless truths: customer empathy, trust-building, measurable value exchange |

### 2.3 Target Audience Segmentation

| User Type | Description | Primary Needs | Key Tools |
|-----------|-------------|---------------|-----------|
| **Marketers** | Marketing professionals & teams | Marketing copy, SEO content, brand voice | Jasper AI, Copy.ai |
| **Creators** | Content creators & influencers | Video, audio, visual content | Runway ML, Descript |
| **Solopreneurs** | Solo business owners | All-in-one, budget-friendly solutions | Copy.ai, Notion AI |
| **Agencies** | Marketing/creative agencies | Team collaboration, enterprise features | Jasper AI, Runway ML |
| **Developers** | Technical professionals | Code assistance, documentation | Notion AI |

### 2.4 Revenue Model

**Primary Revenue:** Affiliate commissions from tool signups

| Revenue Stream | Mechanism | Priority |
|----------------|-----------|----------|
| Affiliate Clicks | Per-click/per-conversion commissions | High |
| Newsletter Leads | Email list monetization, exclusive deals | Medium |
| Exclusive Deals | Higher commission partnerships | High |

**Key Metrics (KPIs):**
- **EPC (Earnings Per Click):** Target $1.50-$3.00
- **Conversion Rate:** Target 5-10% (click to signup)
- **Average Commission Rate:** 25-45%
- **Cookie Duration Optimization:** Prioritize 30-90 day cookies

---

## 3. Product Features & Requirements

### 3.1 Core Features

#### 3.1.1 Tool Reviews System

**Objective:** Provide comprehensive, trustworthy AI tool reviews

**Data Collection:** Tool data is populated via LLM deep research (web search + cited sources), not manual hands-on testing. This scales across many tools. See [GROK_DEEP_RESEARCH_PROMPT.md](./GROK_DEEP_RESEARCH_PROMPT.md) for the research prompt and workflow. Human spot-checks verify critical fields before publish.

**Requirements:**
- [ ] Individual review pages with structured content (description, features, pros/cons, verdict)
- [ ] Star ratings with aggregate rating counts
- [ ] Pricing information with tier details
- [ ] "Last Updated" and "Last Verified" timestamps for freshness signals
- [ ] Screenshots and video embeds for visual demonstration
- [ ] Category-based organization (AI Writing, AI Voice, AI Images, AI Video, AI Productivity)

**Review Data Model:**
```
Tool:
  - Basic: slug, name, tagline, description, logoUrl
  - Ratings: rating (1-5), ratingCount
  - Content: features[], pros[], cons[], verdict, bestFor
  - Business: pricing, pricingDetails, affiliateUrl
  - Affiliate: cookieDuration, commissionRate, hasExclusiveDeal
  - Metadata: lastUpdated, lastVerified, isNew
  - Personalization: recommendations[UserType]
  - Media: screenshots[], videoReviewUrl
  - Social proof: socialProof[] (user quotes from public reviews)
```

#### 3.1.2 Personalized Recommendations Quiz

**Objective:** Match users with ideal tools based on their needs

**Requirements:**
- [ ] Multi-step quiz flow (3 questions minimum)
- [ ] Questions covering: use case, team size, budget
- [ ] Tag-based scoring algorithm for recommendations
- [ ] Match reasons displayed with results
- [ ] Top 3 recommendations with "Best Match" highlight
- [ ] Restart capability

**Quiz Scoring Logic:**
- Category match bonus: +5 points
- Tag match scoring: 1-3 points per tag
- Score meanings: 3=Excellent, 2=Good, 1=Partial match

#### 3.1.3 Comparison Tables

**Objective:** Enable side-by-side tool comparisons

**Requirements:**
- [ ] Sortable comparison table with TanStack Table
- [ ] Features compared: Rating, Pricing, Category, Key Features
- [ ] Filter by category
- [ ] Mobile-responsive design
- [ ] Direct links to individual reviews

#### 3.1.4 User Type Personalization

**Objective:** Customize experience based on user segment

**Requirements:**
- [ ] User type selection (persistent in localStorage)
- [ ] Personalized badges on tool cards (e.g., "Best for Marketers")
- [ ] Filtered recommendations based on user type
- [ ] Personalization indicator in header

#### 3.1.5 A/B Testing Framework

**Objective:** Continuously optimize conversion rates

**Requirements:**
- [ ] Weighted variant selection
- [ ] Persistent variant assignment (localStorage)
- [ ] Conversion tracking per variant
- [ ] Integration with analytics

**Active Test Areas:**
- CTA button styling (colors, gradients)
- Urgency messaging variants
- Review hero layouts
- Sticky CTA behavior

### 3.2 Engagement Features

#### 3.2.1 Newsletter Signup

**Objective:** Build email list for ongoing monetization

**Requirements:**
- [ ] Multiple form variants (card, banner, inline)
- [ ] Location tracking (homepage, review footer, exit popup)
- [ ] Tool preference collection
- [ ] Trust signals (subscriber count, privacy assurance)
- [x] **Actually collect emails** — Kit (ConvertKit) integrated in `/api/newsletter`; set `KIT_API_KEY` and `KIT_FORM_ID` for production

#### 3.2.2 Social Proof

**Objective:** Build trust with user quotes and testimonials

**Primary format — socialProof (Tool.socialProof):** User quotes from public reviews (G2, Reddit, reports). Format: `"quote – attribution"`. Research-driven via LLM; scales with Grok research; FTC-safe (quoting public sources). Display on review pages via `SocialProof` component.

**Secondary format — UserTestimonials:** Curated testimonials with name, role, company, quote, rating. Use **only when we have real data** from outreach with permission. Do NOT use placeholder/fake testimonials in production (FTC risk). Display on homepage when available.

#### 3.2.3 Exit Intent Popup

**Objective:** Capture leaving visitors

**Requirements:**
- [ ] Trigger on mouse exit intent
- [ ] One-time display per session
- [ ] Dismissible with "X" button
- [ ] Newsletter signup or featured tool promotion

#### 3.2.4 Sticky CTA

**Objective:** Maintain conversion opportunity during scroll

**Requirements:**
- [ ] Appears after scrolling past hero section
- [ ] Shows tool name, rating, and CTA button
- [ ] Mobile-optimized (bottom bar)
- [ ] Desktop-optimized (floating element)

### 3.3 Trust & Compliance Features

#### 3.3.1 FTC Disclosure Compliance

**Objective:** Maintain legal compliance and user trust

**Requirements:**
- [ ] Disclosure note on all affiliate content
- [ ] Clear "Affiliate link" indicators
- [ ] Dedicated privacy/disclosure page
- [ ] Footer disclosure statement

#### 3.3.2 Author Attribution (E-E-A-T)

**Objective:** Establish expertise and authority for SEO

**Requirements:**
- [ ] Author byline on reviews
- [ ] Author credentials (title, expertise)
- [ ] Schema.org Person markup
- [ ] Social proof links (Twitter, GitHub)

#### 3.3.3 Cookie Consent & GA4 Consent Mode

**Objective:** Respect user privacy (especially EEA/UK), build trust, and enable GA4 conversion modelling when consent is denied.

**Rationale:** Consent mode sends user consent state to Google so tags adapt (cookies only when consented); Google can use conversion modelling when observable data is unavailable. Aligns with trust/E-E-A-T and future-proofs for global traffic.

**Implementation context:** This site uses **Google tag (gtag.js)** directly, not Google Tag Manager (GTM). Consent code must be added manually in the app (e.g. root layout / GoogleAnalytics component) as direct gtag commands in the first script block — not via GTM templates.

**Requirements:**
- [ ] **Region-scoped default consent** — Apply default consent (e.g. `analytics_storage: 'denied'`) only in regions where we surface the consent banner (e.g. EEA/UK). In regions where no banner is required, do not default to denied so measurement is preserved. (Reduces loss of measurement where consent banners don’t apply.)
- [ ] **Consent before gtag loads** — Set default consent in the **first** script block (same block that defines `dataLayer` and `gtag` stub), before loading the gtag.js script. Do not rely on callbacks or later triggers for initial consent state, so consent is available as soon as the tag runs.
- [ ] Consent banner component (inform users about cookies/analytics, accept/decline or equivalent), shown only where required (e.g. EEA) or site-wide if preferred.
- [ ] GA4 Consent Mode: `gtag('consent', 'default', { ... })` per region; on accept, `gtag('consent', 'update', { analytics_storage: 'granted' })` and load/config GA4 as needed.
- [ ] Persist consent choice (e.g. localStorage) so banner does not re-show on every visit.
- [ ] Document behaviour in Privacy Policy (what we track, how consent affects it).

**References:** [Google Consent Mode](https://support.google.com/analytics/answer/9976101) · [Consent mode developer guide (gtag.js)](https://developers.google.com/tag-platform/security/guides/consent) — use gtag.js instructions (direct commands or custom HTML), not GTM template.

---

## 4. User Journeys

### 4.1 Discovery Journey

```
User Lands on Homepage
    ↓
Browse Featured Tools OR Take Quiz
    ↓
View Tool Card (Rating, Pricing, Badge)
    ↓
Click to Read Full Review
    ↓
Scroll Review (Hero → Features → Pros/Cons → Verdict)
    ↓
Click Affiliate CTA (Hero, Sticky, Content)
    ↓
Convert on Partner Site
```

### 4.2 Research Journey

```
User Needs to Compare Tools
    ↓
Navigate to Comparisons Page
    ↓
Sort/Filter by Category or Rating
    ↓
Compare 2-3 Tools Side by Side
    ↓
Click Through to Individual Reviews
    ↓
Make Decision → Click Affiliate Link
```

### 4.3 Personalized Journey

```
User Selects User Type (Header)
    ↓
See Personalized Badges on Tools
    ↓
Take Quiz for Refined Recommendations
    ↓
View Top Match with Reasons
    ↓
Read Targeted Review
    ↓
Convert via Affiliate Link
```

---

## 5. Success Metrics & KPIs

### 5.1 Business Metrics

| Metric | Current | Target | Measurement |
|--------|---------|--------|-------------|
| Monthly Affiliate Clicks | - | 10,000+ | GA4 `affiliate_click` events |
| Click-Through Rate (CTR) | - | 8-12% | Clicks / Page Views |
| Conversion Rate | - | 5-10% | Signups / Clicks |
| EPC (Earnings Per Click) | - | $1.50-$3.00 | Revenue / Clicks |
| Newsletter Subscribers | - | 5,000+ | Signup form submissions |

### 5.2 Engagement Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Average Time on Review Page | >3 minutes | GA4 engagement |
| Scroll Depth (Reviews) | >75% | `review_engagement` event |
| Quiz Completion Rate | >60% | Quiz starts vs. completions |
| Return Visitor Rate | >30% | GA4 user retention |

### 5.3 SEO Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Organic Traffic | 50,000+ monthly | GA4 / Search Console |
| Keyword Rankings (Top 10) | 50+ keywords | Rank tracking |
| Core Web Vitals | All "Good" | PageSpeed Insights |
| Rich Results | Reviews, FAQs, Breadcrumbs | Search Console |

---

## 6. Objective Orientation: Phased Roadmap

> Per the philosophy framework, progress follows three phases with flexibility built in.

### Phase 1: Validation (Current)

**Goal:** Establish proof of concept—create a minimal, functional flywheel that demonstrates value generation and confirms core mechanics produce measurable positive outcomes.

**Milestones:**
- [x] Core review pages with 8 tools (minimal viable content)
- [x] Quiz recommendation system (personalization proof)
- [x] A/B testing infrastructure (optimization foundation)
- [x] Analytics tracking (GA4) (measurement capability)
- [x] SEO foundations (Schema, metadata) (discovery mechanics)
- [x] Newsletter signup forms (list building initiation)
- [ ] Launch & gather initial data (100+ conversions target)
- [ ] Validate EPC baseline (target $1.00+ per click)

**Success Criteria:** Demonstrate flywheel mechanics with measurable conversions

### Phase 2: Amplification

**Goal:** Scale intelligently—expand reach, automate high-value components, and compound results while building reusable foundations for 5-10x growth.

**Milestones:**
- [ ] Expand to 25+ tool reviews (coverage expansion)
- [ ] Blog/guide content section (SEO compounding)
- [ ] Advanced comparison features (user value enhancement)
- [ ] AI-assisted content refresh (automation scaling)
- [ ] Social sharing optimization (viral loops)
- [ ] Retargeting pixel integration (conversion optimization)
- [ ] Multi-channel integration (reach amplification)
- [ ] Reusable content templates (leverage maximization)

**Success Criteria:** 5-10x growth in traffic and revenue; 70% reduction in per-review effort

### Phase 3: Autonomy

**Goal:** Transition to self-sustaining operation—enable independent sensing, decision-making, optimization, and expansion with minimal human oversight.

**Milestones:**
- [ ] Automated content updates (pricing, features monitoring)
- [ ] ML-powered personalization (behavioral adaptation)
- [ ] Predictive EPC optimization (revenue maximization)
- [ ] Self-optimizing A/B tests (continuous refinement)
- [ ] API-driven trend detection (market sensing)
- [ ] Video review integration (AI-generated content)
- [ ] Autonomous new tool onboarding pipeline
- [ ] Human intervention < 10% of operations

**Success Criteria:** System operates independently with consistent high yields; human input reserved for strategic direction only

---

## 7. Boundary Constraints (Non-Negotiable Limits)

> These guardrails protect the system from deviation, risk, or unsustainability.

### 7.1 Efficiency & Resource Discipline

| Constraint | Implementation |
|------------|----------------|
| 80/20 Focus | Allocate 90% effort to high-ROI activities (content quality, conversion optimization) |
| Lean Operation | Automate low-value tasks; avoid tool/process bloat |
| Resource Optimization | Measure cost-per-acquisition; optimize toward automation |

### 7.2 Progressive Autonomy

| Stage | Approach | Threshold |
|-------|----------|-----------|
| **LLM Research + Spot-Check** | LLM deep research populates data; human spot-checks critical fields (rating, pricing, pros/cons) | Current |
| **Selective Automation** | Automated personalization, assisted content updates, scheduled research runs | 80%+ accuracy |
| **Full Autonomy** | Self-optimizing systems, minimal oversight | 95%+ accuracy |

### 7.3 Risk & Ethical Integrity

| Guardrail | Implementation |
|-----------|----------------|
| FTC Compliance | Mandatory disclosures on all affiliate content |
| Honest Reviews | Include genuine cons; no misleading claims |
| Platform Compliance | Adhere to Google, affiliate network policies |
| Trust Preservation | Prioritize long-term trust over short-term gains |

### 7.4 Modular Integrity

| Principle | Implementation |
|-----------|----------------|
| Composable Components | All new features build on existing modules |
| No Siloed Efforts | Extensions integrate with existing data flows |
| Coherence Maintenance | Review architecture before adding complexity |

---

## 8. Evolution Mechanisms (Self-Improvement Loops)

> These define how the system renews and advances itself over time.

### 8.1 Reflection Cycle

| Frequency | Activity | Output |
|-----------|----------|--------|
| Daily | Automated analytics dashboard review | Anomaly alerts |
| Weekly | A/B test performance analysis | Variant decisions |
| Monthly | EPC and conversion rate deep dive | Strategy refinements |
| Quarterly | Full system audit against philosophy | Roadmap adjustments |

### 8.2 Adaptive Sub-Systems

| Sub-System | Sensing Capability | Optimization Action |
|------------|-------------------|---------------------|
| A/B Testing | Conversion rate changes | Auto-promote winning variants |
| Personalization | User type selection patterns | Refine recommendation weights |
| Content Freshness | Tool pricing/feature changes | Trigger review updates |
| Market Sensing | New AI tool launches | Alert for new review opportunities |

### 8.3 Human Oversight Thresholds

| Confidence Level | Action |
|------------------|--------|
| **95%+** | Full automation, no intervention |
| **80-95%** | Automated with periodic review |
| **60-80%** | Human approval required |
| **< 60%** | Manual handling, flag for process improvement |

**Trajectory:** Reduce human intervention from current ~40% to < 10% by Autonomy phase

### 8.4 Progress Tracking & Learning

| Mechanism | Purpose |
|-----------|---------|
| Decision Logs | Record all strategic choices with rationale |
| Outcome Tracking | Link decisions to measurable results |
| Pattern Recognition | Identify successful patterns for replication |
| Knowledge Base | Document learnings for future application |

---

## 9. Risk Assessment & Mitigation

| Risk | Impact | Likelihood | Mitigation | Philosophy Alignment |
|------|--------|------------|------------|---------------------|
| Affiliate program changes | High | Medium | Diversify partnerships, multiple programs per category | *Dynamic Adaptation* |
| SEO algorithm updates | High | Medium | Focus on E-E-A-T, user value, technical excellence | *Enduring Practice Alignment* |
| AI tool market consolidation | Medium | Medium | Cover emerging tools, maintain broad category coverage | *Opportunity Alignment* |
| User trust erosion | High | Low | Transparent disclosures, honest reviews, LLM-researched content with cited sources | *Risk & Ethical Integrity* |
| Technical performance issues | Medium | Low | Core Web Vitals monitoring, performance budgets | *Efficiency Discipline* |
| Over-automation failures | Medium | Medium | Progressive autonomy stages, human oversight thresholds | *Progressive Autonomy* |

---

## 10. Appendix

### 10.1 Tool Categories

- **AI Writing:** Jasper AI, Copy.ai
- **AI Voice:** Murf AI
- **AI Video:** Runway ML, Descript
- **AI Productivity:** Notion AI

### 10.2 Affiliate Partnership Priorities

| Tool | Commission | Cookie | Priority |
|------|------------|--------|----------|
| Copy.ai | 45% | 60 days | **High** (Exclusive deal) |
| Descript | 30% | 90 days | **High** (Exclusive deal) |
| Jasper AI | 30% | 30 days | High |
| Murf AI | 25% | 30 days | Medium |
| Runway ML | 20% | 30 days | Medium |
| Notion AI | 20% | 90 days | Medium |

### 10.3 Content Guidelines

1. **LLM Deep Research:** Tool data is collected via LLM with web search (e.g., Grok, Perplexity) — not fabricated. Every claim must be traceable to cited sources (official sites, G2, Capterra, Trustpilot, Reddit). See [GROK_DEEP_RESEARCH_PROMPT.md](./GROK_DEEP_RESEARCH_PROMPT.md).
2. **Honest Assessment:** Include genuine cons from real user reviews, not just marketing copy
3. **Regular Updates:** Refresh reviews when tools change significantly; re-run research or use freshness checks
4. **Transparent Disclosures:** Always disclose affiliate relationships
5. **User Value First:** Prioritize helpfulness over commission optimization

### 10.4 Philosophy Framework References

| Document | Purpose |
|----------|---------|
| [EvoLink.md](./EvoLink.md) | EvoLink Architect persona definition |
| [philosophy_framework.md](./philosophy_framework.md) | Timeless judgment philosophy framework |
| [business_context.md](./business_context.md) | Business strategy and market context |
| [system_design.md](./system_design.md) | Technical architecture implementation |
| [GROK_DEEP_RESEARCH_PROMPT.md](./GROK_DEEP_RESEARCH_PROMPT.md) | LLM deep research prompt for tool data collection |

### 10.5 Decision Reference Template

When making product decisions, reference the philosophy framework:

```
Decision: [What decision is being made]
Per: [Which principle applies]
  - Core Value: [AI Empowerment / Reusability / Self-Adaptation / Value-Centric]
  - Decision Principle: [Automation First / Impact Prioritization / etc.]
  - Boundary Constraint: [Any limits that apply]
Rationale: [Why this aligns with the framework]
Expected Outcome: [Measurable result]
```
