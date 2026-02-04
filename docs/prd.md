# Product Requirements Document (PRD)

## AI Investment Tools Reviews - Affiliate Flywheel

**Version:** 1.6  
**Last Updated:** February 2026  
**Status:** Active Development

---

## 1. Executive Summary

### 1.1 Vision

AI Investment Tools Reviews is an AI-powered affiliate review platform designed to empower investors, traders, fintech professionals, and financial strategists in discovering the best AI-driven investment tools, fintech platforms, and quantitative strategies. The platform is built upon the **InvestLink Architect** persona and guided by the **AI Investment Affiliate Flywheel Philosophy Framework**—a timeless, principle-based system for building self-evolving, value-creating affiliate ecosystems focused on quantifiable efficiency, risk-adjusted returns, and scalable revenue progression.

### 1.2 Mission

Deliver data-backed, in-depth, and personalized investment tool recommendations that bridge information asymmetries, enhance decision efficiency, and generate sustainable affiliate revenue through a self-optimizing, quantitative flywheel model.

### 1.3 Core Value Proposition

- **For Users:** Data-backed, quantitatively informed reviews with personalized recommendations that address investment efficiency, cognitive gaps, and information asymmetry, enabling streamlined decision-making in global markets.
- **For Business:** Scalable affiliate revenue through high-converting content, A/B testing, and data-driven optimization, with a focus on metrics like ROI, CPA, and conversion rates.

### 1.4 Guiding Philosophy

> Reference: [InvestLink.md](./InvestLink.md) | [philosophy_framework.md](./philosophy_framework.md)

This product is designed and evolved through the lens of the **InvestLink Architect** persona—a data-driven mastermind that integrates quantitative analysis, automation, and ethical growth for investment-focused affiliate systems. All decisions reference the five interconnected modules of the philosophy framework:

1. **Core Values** — Foundational beliefs that anchor the system in quantitative empowerment and scalability.
2. **Decision Principles** — Judgment guidelines for evaluating opportunities with a quant-first mindset.
3. **Objective Orientation** — Phased directional goals aligned with affiliate-to-services progression.
4. **Boundary Constraints** — Non-negotiable guardrails for ethical and efficient operations.
5. **Evolution Mechanisms** — Self-improvement loops via data processes and ML optimization.

---

## 2. Business Context & Strategy

### 2.1 Core Values Alignment

The platform embodies the four foundational beliefs of the InvestLink philosophy:

| Core Value                                                                | Platform Implementation                                                                                                                                                                                                                                                                                                                                      |
| ------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **AI Investment Empowerment & Human Augmentation with Efficiency Focus**  | AI automates 80%+ of internal processes (e.g., sentiment analysis, affiliate research), while quantitative insights provide strategic oversight and refinement. The aim is to bridge user cognitive gaps and information disparities globally, enabling streamlined decision-making without conflating internal AI tools with user-facing solutions.         |
| **Reusability & Leverage with Data-Driven Modularity**                    | Build modular, composable assets (e.g., reusable research pipelines, affiliate comparison templates) that compound business value through data optimization and workflow automation. Prioritize elements reusable across global markets, maximizing affiliate impact and operational scalability with minimal effort.                                        |
| **Self-Adaptation & Continuous Improvement Aligned with Market Dynamics** | The system functions as an intelligent, ML-enabled agent, reflecting on global trends (e.g., sentiment shifts in investment tools), data feedback, and evolving quantitative techniques. Success derives from adaptive, data-optimized intelligence, ensuring the flywheel aligns with worldwide market signals through iterative automation and validation. |
| **Value-Centric & Sustainable Growth via Ethical, Quantifiable Insights** | Growth is rooted in genuine, data-backed value for users, addressing efficiency in investment processes, fintech, and emerging technologies. Pursue scalable income—starting with affiliate commissions and progressing to customized services—transparently, avoiding unvalidated risks, to build enduring trust and business sustainability.               |

### 2.2 Decision Principles in Practice

Every product decision is evaluated against these judgment guidelines:

| Decision Principle                                                   | Application                                                                                                                                                                                                                                                                                                                 |
| -------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Automation Feasibility First, Integrated with Quant Mindset**      | For every internal task, ask: “Can this be automated while incorporating quantitative models and data insights?” Favor approaches that reduce operational dependency, preserving quality through data-driven refinement (e.g., AI-automated affiliate comparisons or user interest detection).                              |
| **Impact & Leverage Prioritization on Financial Goals**              | Evaluate based on quantifiable contribution to business finances (e.g., high-CPA commissions or ROI from customized services). Focus on high-leverage elements like automated workflows, over low-impact tasks, ensuring single-mainline efficiency through metrics like operational savings or affiliate conversion rates. |
| **Dynamic Adaptation & Opportunity Alignment with Global Focus**     | Decisions account for data signals like worldwide trends, global investment shifts, or probabilistic market forecasts. Favor actions capturing asymmetric upside (e.g., timely promotions of fintech or AI tools) while maintaining flexibility to pivot without parallel operations, validated by data backtesting.        |
| **Excellence Benchmarking via Quant Expertise**                      | Measure against elite, data-defined standards: outperform typical affiliate results using quantitative techniques (e.g., benchmarks like efficiency gains or information asymmetry reduction). Shortfalls signal refinement, leveraging a global, metric-based validation approach.                                         |
| **Enduring Practice Alignment with Ethical, Data-Driven Operations** | Ground decisions in proven truths (user empathy, trust-building, measurable ROI) amplified by quantitative intelligence. Prioritize ethical exchanges, disclosing affiliations and noting "not financial advice," with data integrity to align with international regulatory realities.                                     |

### 2.3 Target Audience Segmentation

| User Type                 | Description                                   | Primary Needs                               | Key Tools               |
| ------------------------- | --------------------------------------------- | ------------------------------------------- | ----------------------- |
| **Individual Investors**  | Retail investors managing personal portfolios | Low-cost platforms, AI signals, risk tools  | Robinhood, QuantConnect |
| **Traders**               | Active day/swing traders                      | Real-time analytics, algorithmic trading    | TradingView, Alpaca     |
| **Fintech Professionals** | Developers/builders in fintech                | Integration tools, API platforms            | Plaid, Stripe Treasury  |
| **Financial Advisors**    | Advisors & wealth managers                    | Client portfolio tools, compliance features | Wealthfront, Betterment |
| **Quantitative Analysts** | Quant-focused users                           | Advanced modeling, backtesting              | QuantConnect            |

### 2.4 Revenue Model

**Primary Revenue:** Affiliate commissions from investment tool signups and subscriptions

| Revenue Stream   | Mechanism                                 | Priority                  |
| ---------------- | ----------------------------------------- | ------------------------- |
| Affiliate Clicks | Per-click/per-conversion commissions      | High                      |
| Newsletter Leads | Email list monetization, exclusive deals  | Medium                    |
| Exclusive Deals  | Higher commission partnerships            | High                      |
| Future Services  | Customized quant strategies or consulting | Low (Amplification Phase) |

**Key Metrics (KPIs):**

- **EPC (Earnings Per Click):** Target $2.00-$4.00
- **Conversion Rate:** Target 6-12% (click to signup)
- **Average Commission Rate:** 30-50%
- **Cookie Duration Optimization:** Prioritize 60-90 day cookies for long-tail conversions

---

## 3. Product Features & Requirements

### 3.1 Core Features

#### 3.1.1 Tool Reviews System

**Objective:** Provide comprehensive, LLM-researched investment tool reviews with social proof emphasis

**Data Collection:** Tool data is populated via reusable LLM deep research (web search + cited sources), not manual hands-on testing. This scales across many tools and reuses existing research prompts/workflows. Human spot-checks verify critical fields before publish. Focus on specific AI investment tools (e.g., AI signals in fintech platforms), avoiding generic concepts or deep dives into quant-like platforms/trading strategies.

**Requirements:**

- [ ] Individual review pages with structured content (description, features, pros/cons, verdict, social proof from user reviews)
- [ ] Star ratings with aggregate rating counts and comparable metrics where applicable (e.g., user satisfaction scores, not assuming uniform metrics like Sharpe Ratio across all tools)
- [ ] Pricing information with tier details and cost-efficiency analysis
- [ ] "Last Updated" and "Last Verified" timestamps for data freshness
- [ ] Screenshots, charts (e.g., user interface demos), and video embeds for visual demonstration
- [ ] Category-based organization (AI Investment Signals, Quantitative Platforms, Fintech Infrastructure, Crypto Tools, Portfolio Management)
- [ ] Social proof integration (e.g., quotes from G2, Reddit, Trustpilot) as primary trust builder, with quant data (e.g., performance indicators) as ideal enhancement where relevant and comparable

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
  - Social Proof: socialProof[] (user quotes from public reviews)
  - Quant Data: optionalMetrics[] (e.g., user-reported efficiency gains, where comparable)
```

#### 3.1.2 Personalized Recommendations Quiz

**Objective:** Match users with ideal tools based on tag-based profiles

**Requirements:**

- [ ] Multi-step quiz flow (4 questions minimum)
- [ ] Questions covering: investment style (e.g., passive/active), risk tolerance, asset focus, budget, **investment workflow stage (e.g., idea generation & research, data & fundamentals, technical & quantitative analysis, execution & trading, AI-powered tools, portfolio & risk management)**
- [ ] Tag-based scoring algorithm for recommendations (reusable from prior implementations), **extended to cover full investment process stages + weighted toward high-priority affiliate partners (e.g. QuantConnect for data & quantitative analysis, TradeStation/Polymarket for execution & trading platforms, Notion for AI-powered tools & automation)**
- [ ] Match reasons displayed with tag alignments **and partner highlights**
- [ ] Top 3 recommendations with "Best Match" highlight
- [ ] Restart capability

**Quiz Scoring Logic:**

- Category match bonus: +5 points
- Tag match scoring: 1-3 points per tag
- Score meanings: 3=High Potential Match, 2=Balanced Match, 1=Partial Fit

#### 3.1.3 Comparison Tables

**Objective:** Enable side-by-side tool comparisons with flexible metrics

**Requirements:**

- [ ] Sortable comparison table with TanStack Table
- [ ] Features compared: Rating, Pricing, Category, Key Metrics (flexible per tool, e.g., user satisfaction or efficiency scores; not assuming uniform quant metrics like Drawdown across all), **optionally filter/sort by investment workflow stage and preferred affiliate partner strength**
- [ ] Filter by category or user needs
- [ ] Mobile-responsive design
- [ ] Direct links to individual reviews

#### 3.1.4 User Type Personalization

**Objective:** Customize experience based on user segment and tags

**Requirements:**

- [ ] User type selection (persistent in localStorage)
- [ ] Personalized badges on tool cards (e.g., "Best for Quant Analysts")
- [ ] Filtered recommendations based on user type and tags
- [ ] Personalization indicator in header

#### 3.1.5 A/B Testing Framework

**Objective:** Continuously optimize conversion rates with data analysis

**Requirements:**

- [ ] Weighted variant selection with probabilistic assignment
- [ ] Persistent variant assignment (localStorage)
- [ ] Conversion tracking per variant with ROI metrics
- [ ] Integration with analytics for validation

**Active Test Areas:**

- CTA button styling (colors, gradients)
- Urgency messaging variants (e.g., market volatility alerts)
- Review hero layouts
- Sticky CTA behavior

### 3.2 Engagement Features

#### 3.2.1 Newsletter Signup

**Objective:** Build email list for ongoing monetization and market insights

**Requirements:**

- [ ] Multiple form variants (card, banner, inline)
- [ ] Location tracking (homepage, review footer, exit popup)
- [ ] Tool preference and risk profile collection
- [ ] Trust signals (subscriber count, privacy assurance)
- [ ] Mailchimp/ConvertKit integration ready

#### 3.2.2 Exit Intent Popup

**Objective:** Capture leaving visitors with data-backed offers

**Requirements:**

- [ ] Trigger on mouse exit intent
- [ ] One-time display per session
- [ ] Dismissible with "X" button
- [ ] Newsletter signup or featured tool promotion with highlights

#### 3.2.3 Sticky CTA

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

- [ ] Disclosure note on all affiliate content (e.g., "not financial advice")
- [ ] Clear "Affiliate link" indicators
- [ ] Dedicated privacy/disclosure page
- [ ] Footer disclosure statement

#### 3.3.2 Author Attribution (E-E-A-T)

**Objective:** Establish expertise and authority for SEO

**Requirements:**

- [ ] Author byline on reviews
- [ ] Author credentials (quant expertise, certifications)
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
Sort/Filter by Category or Metrics
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

| Metric                   | Current | Target      | Measurement                  |
| ------------------------ | ------- | ----------- | ---------------------------- |
| Monthly Affiliate Clicks | -       | 8,000+      | GA4 `affiliate_click` events |
| Click-Through Rate (CTR) | -       | 7-11%       | Clicks / Page Views          |
| Conversion Rate          | -       | 6-12%       | Signups / Clicks             |
| EPC (Earnings Per Click) | -       | $2.00-$4.00 | Revenue / Clicks             |
| Newsletter Subscribers   | -       | 4,000+      | Signup form submissions      |

### 5.2 Engagement Metrics

| Metric                      | Target     | Measurement                 |
| --------------------------- | ---------- | --------------------------- |
| Average Time on Review Page | >4 minutes | GA4 engagement              |
| Scroll Depth (Reviews)      | >80%       | `review_engagement` event   |
| Quiz Completion Rate        | >65%       | Quiz starts vs. completions |
| Return Visitor Rate         | >35%       | GA4 user retention          |

### 5.3 SEO Metrics

| Metric                    | Target                     | Measurement          |
| ------------------------- | -------------------------- | -------------------- |
| Organic Traffic           | 40,000+ monthly            | GA4 / Search Console |
| Keyword Rankings (Top 10) | 40+ keywords               | Rank tracking        |
| Core Web Vitals           | All "Good"                 | PageSpeed Insights   |
| Rich Results              | Reviews, FAQs, Breadcrumbs | Search Console       |

---

## 6. Objective Orientation: Phased Roadmap

> Per the philosophy framework, progress follows three phases with flexibility built in.

### Phase 1: Validation (Current)

**Goal:** Establish proof: Build a minimal flywheel demonstrating value via efficiency-focused insights (e.g., 10 tool promotions with affiliate links). Confirm mechanics yield measurable outcomes like initial commissions, validating business efficiency in affiliate revenue.

**Milestones:**

- [x] Core review pages with 8 tools (minimal viable content)
- [x] Quiz recommendation system (personalization proof)
- [x] A/B testing infrastructure (optimization foundation)
- [x] Analytics tracking (GA4) (measurement capability)
- [x] SEO foundations (Schema, metadata) (discovery mechanics)
- [x] Newsletter signup forms (list building initiation)
- [ ] Launch & gather initial data (80+ conversions target)
- [ ] Validate EPC baseline (target $1.50+ per click)

**Success Criteria:** Demonstrate flywheel mechanics with measurable conversions

### Phase 2: Amplification

**Goal:** Scale intelligently: Expand content/reach, automate internal components with ML (e.g., sentiment tracking), and compound affiliate results while introducing initial customized elements. Goal: Achieve mid-range revenue (primarily affiliate + early insights sales), building reusable foundations like automated research pipelines for global audiences.

**Milestones:**

- [ ] Expand to 25+ tool reviews (coverage expansion)
- [ ] **Blog/guide content section (SEO compounding; tutorials, training, resources focused on investment workflow stages and tool usage – deferred to mid-phase after core flywheel validation)**
- [ ] Advanced comparison features (user value enhancement)
- [ ] AI-assisted content refresh (automation scaling)
- [ ] Social sharing optimization (viral loops)
- [ ] Retargeting pixel integration (conversion optimization)
- [ ] Multi-channel integration (reach amplification)
- [ ] Reusable content templates (leverage maximization)

**Success Criteria:** 5-10x growth in traffic and revenue; 70% reduction in per-review effort

### Phase 3: Autonomy

**Goal:** Transition to self-sustaining: Enable independent market sensing, optimization, and expansion with minimal oversight, fully integrating customized solutions/services (e.g., bespoke efficiency tools or consulting). Goal: Reach high recurring revenue (affiliate base + services), creating a resilient system for passive business growth.

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

| Constraint            | Implementation                                                                     |
| --------------------- | ---------------------------------------------------------------------------------- |
| 80/20 Focus           | Allocate 90% effort to high-ROI activities (quant models, conversion optimization) |
| Lean Operation        | Automate low-value tasks; avoid tool/process bloat                                 |
| Resource Optimization | Measure cost-per-acquisition; optimize toward automation                           |

### 7.2 Progressive Autonomy

| Stage                    | Approach                                            | Threshold       |
| ------------------------ | --------------------------------------------------- | --------------- |
| **Manual Validation**    | Human-reviewed content, manual A/B analysis         | Current         |
| **Selective Automation** | Automated personalization, assisted content updates | 80%+ confidence |
| **Full Autonomy**        | Self-optimizing systems, minimal oversight          | 95%+ confidence |

### 7.3 Risk & Ethical Integrity

| Guardrail           | Implementation                                                                    |
| ------------------- | --------------------------------------------------------------------------------- |
| FTC Compliance      | Mandatory disclosures on all affiliate content; "not financial advice" everywhere |
| Honest Reviews      | Include genuine risks; no misleading claims                                       |
| Platform Compliance | Adhere to SEC, affiliate network policies                                         |
| Trust Preservation  | Prioritize long-term trust over short-term gains                                  |

### 7.4 Modular Integrity

| Principle             | Implementation                                  |
| --------------------- | ----------------------------------------------- |
| Composable Components | All new features build on existing quant models |
| No Siloed Efforts     | Extensions integrate with existing data flows   |
| Coherence Maintenance | Review architecture before adding complexity    |

---

## 8. Evolution Mechanisms (Self-Improvement Loops)

> These define how the system renews and advances itself over time.

### 8.1 Reflection Cycle

| Frequency | Activity                             | Output               |
| --------- | ------------------------------------ | -------------------- |
| Daily     | Automated analytics dashboard review | Anomaly alerts       |
| Weekly    | A/B test performance analysis        | Variant decisions    |
| Monthly   | EPC and conversion rate deep dive    | Strategy refinements |
| Quarterly | Full system audit against philosophy | Roadmap adjustments  |

### 8.2 Adaptive Sub-Systems

| Sub-System        | Sensing Capability           | Optimization Action                           |
| ----------------- | ---------------------------- | --------------------------------------------- |
| A/B Testing       | Conversion rate changes      | Auto-promote winning variants via backtesting |
| Personalization   | User type selection patterns | Refine recommendation weights with ML         |
| Content Freshness | Tool pricing/feature changes | Trigger review updates                        |
| Market Sensing    | New fintech launches         | Alert for new review opportunities            |

### 8.3 Human Oversight Thresholds

| Confidence Level | Action                                        |
| ---------------- | --------------------------------------------- |
| **95%+**         | Full automation, no intervention              |
| **80-95%**       | Automated with periodic review                |
| **60-80%**       | Human approval required                       |
| **< 60%**        | Manual handling, flag for process improvement |

**Trajectory:** Reduce human intervention from current ~40% to < 10% by Autonomy phase

### 8.4 Progress Tracking & Learning

| Mechanism           | Purpose                                      |
| ------------------- | -------------------------------------------- |
| Decision Logs       | Record all strategic choices with rationale  |
| Outcome Tracking    | Link decisions to measurable results         |
| Pattern Recognition | Identify successful patterns for replication |
| Knowledge Base      | Document learnings for future application    |

---

## 9. Risk Assessment & Mitigation

| Risk                         | Impact | Likelihood | Mitigation                                                | Philosophy Alignment          |
| ---------------------------- | ------ | ---------- | --------------------------------------------------------- | ----------------------------- |
| Affiliate program changes    | High   | Medium     | Diversify partnerships, multiple programs per category    | _Dynamic Adaptation_          |
| SEO algorithm updates        | High   | Medium     | Focus on E-E-A-T, user value, technical excellence        | _Enduring Practice Alignment_ |
| Market volatility            | Medium | High       | Incorporate scenario planning, quant safeguards           | _Risk & Ethical Integrity_    |
| User trust erosion           | High   | Low        | Transparent disclosures, honest reviews, quant validation | _Risk & Ethical Integrity_    |
| Technical performance issues | Medium | Low        | Core Web Vitals monitoring, performance budgets           | _Efficiency Discipline_       |
| Over-automation failures     | Medium | Medium     | Progressive autonomy stages, human oversight thresholds   | _Progressive Autonomy_        |

---

## 10. Appendix

### 10.1 Tool Categories

- **AI Investment Signals:** TradingView, QuantConnect
- **Quantitative Platforms:** QuantConnect, Alpaca
- **Fintech Infrastructure:** Plaid, Stripe Treasury
- **Crypto Tools:** Polymarket, Binance
- **Portfolio Management:** Wealthfront, Betterment

### 10.2 Affiliate Partnership Priorities

| Tool         | Commission                | Cookie  | Priority                  |
| ------------ | ------------------------- | ------- | ------------------------- |
| QuantConnect | 10% recurring             | N/A     | **High** (Exclusive deal) |
| TradeStation | Varies (CPA)              | Varies  | **High** (Exclusive deal) |
| Polymarket   | $0.01/click + $10/deposit | Varies  | High                      |
| Notion       | Up to $50 + 20% year 1    | Varies  | High                      |
| TradingView  | Up to $100/subscription   | 90 days | High                      |
| Alpaca       | Varies (partners)         | Varies  | Medium                    |
| Plaid        | Varies (partners)         | Varies  | Medium                    |
| Binance      | Up to 50%                 | Varies  | Medium                    |
| Wealthfront  | Varies (referrals)        | Varies  | Medium                    |
| Betterment   | $50/funded                | 30 days | Medium                    |
| Robinhood    | $5-$200 stock             | Varies  | Medium                    |

### 10.3 Content Guidelines

1. **LLM Deep Research:** Reuse existing LLM prompts/workflows for data collection via web search (e.g., official sites, user reviews); every claim traceable to cited sources.
2. **Honest Assessment:** Include genuine risks from real user reviews, not just marketing copy.
3. **Regular Updates:** Refresh reviews on tool changes; re-run reusable LLM research.
4. **Transparent Disclosures:** Always disclose affiliate relationships and "not financial advice".
5. **User Value First:** Prioritize social proof (e.g., user quotes) for trust; include quant data where ideal and comparable, but not required uniformly.
6. **Affiliate-Centric Tagging**: Tags must map to our highest-commission / longest-cookie partners where possible (e.g. QuantConnect for data & quantitative analysis, TradeStation/Polymarket for execution & trading platforms, Notion for AI-powered tools & automation). Prioritize genuine fit over forced promotion.

### 10.4 Philosophy Framework References

| Document                                             | Purpose                                 |
| ---------------------------------------------------- | --------------------------------------- |
| [InvestLink.md](./InvestLink.md)                     | InvestLink Architect persona definition |
| [philosophy_framework.md](./philosophy_framework.md) | Timeless judgment philosophy framework  |
| [system_design.md](./system_design.md)               | Technical architecture implementation   |

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
