# System Design Document
## AI Tool Reviews - Technical Architecture

**Version:** 1.1  
**Last Updated:** January 2026  
**Status:** Active Development

---

## 1. Architecture Overview

### 1.1 Guiding Philosophy

> Reference: [EvoLink.md](./EvoLink.md) | [philosophy_framework.md](./philosophy_framework.md)

This technical architecture implements the **EvoLink Architect** philosophy. Every architectural decision maps to the five interconnected modules:

| Philosophy Module | Technical Implementation |
|-------------------|-------------------------|
| **Core Values** | Server-first rendering (AI leverage), modular components (reusability), A/B testing (self-adaptation), trust indicators (value-centric) |
| **Decision Principles** | Automation-first data flows, high-impact feature prioritization, adaptive systems architecture |
| **Objective Orientation** | Phased feature rollout supporting Validation → Amplification → Autonomy |
| **Boundary Constraints** | Performance budgets, progressive enhancement, compliance-by-design |
| **Evolution Mechanisms** | Analytics pipelines, feedback loops, learning infrastructure |

### 1.2 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                           CDN (Vercel Edge)                         │
├─────────────────────────────────────────────────────────────────────┤
│                         Next.js 15 Application                      │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌────────────┐ │
│  │   App       │  │ Components  │  │    Lib      │  │  Public    │ │
│  │   Router    │  │  (React)    │  │  (Utils)    │  │  (Static)  │ │
│  └─────────────┘  └─────────────┘  └─────────────┘  └────────────┘ │
├─────────────────────────────────────────────────────────────────────┤
│                        External Services                            │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐                 │
│  │  Google     │  │  Mailchimp/ │  │  Affiliate  │                 │
│  │  Analytics  │  │  ConvertKit │  │  Networks   │                 │
│  └─────────────┘  └─────────────┘  └─────────────┘                 │
└─────────────────────────────────────────────────────────────────────┘
```

### 1.3 Technology Stack

| Layer | Technology | Version | Purpose |
|-------|------------|---------|---------|
| **Framework** | Next.js | 15+ | React framework with App Router |
| **UI Library** | React | 19 | Component-based UI |
| **Language** | TypeScript | 5.x | Type-safe development (strict mode) |
| **Styling** | Tailwind CSS | 3.x | Utility-first CSS |
| **Tables** | TanStack Table | 8.x | Sortable comparison tables |
| **Testing** | Vitest + RTL | Latest | Unit & component testing |
| **Deployment** | Vercel | - | Edge deployment & CDN |

### 1.4 Design Principles

Technical principles mapped to EvoLink philosophy:

| Principle | Implementation | Philosophy Alignment |
|-----------|----------------|---------------------|
| **Server-First** | Prefer RSC for static content | *AI Empowerment* — let build system handle rendering |
| **Progressive Enhancement** | Core functionality without JS | *Value-Centric* — accessible to all users |
| **Performance Budget** | LCP < 2.5s, INP < 200ms, CLS < 0.1 | *Excellence Benchmarking* — top-tier Core Web Vitals |
| **Type Safety** | Strict TypeScript throughout | *Risk Integrity* — prevent runtime errors |
| **Modularity** | Composable components, reusable utilities | *Reusability & Leverage* — compound value |
| **Automation-Ready** | Data structures support automated updates | *Automation Feasibility First* |

---

## 2. Project Structure

```
affiliate_flywheel_web/
├── app/                          # Next.js App Router
│   ├── layout.tsx               # Root layout (Header/Footer)
│   ├── page.tsx                 # Homepage
│   ├── globals.css              # Global styles
│   ├── loading.tsx              # Loading UI
│   ├── not-found.tsx            # 404 page
│   ├── global-error.tsx         # Error boundary
│   ├── sitemap.ts               # Dynamic sitemap generation
│   │
│   ├── [category]/              # Dynamic category pages
│   │   └── page.tsx
│   ├── reviews/                 # Review pages
│   │   ├── page.tsx             # Reviews index
│   │   └── [slug]/              # Dynamic review pages
│   │       └── page.tsx
│   ├── comparisons/             # Comparison table
│   │   └── page.tsx
│   ├── about/                   # Static pages
│   │   └── page.tsx
│   ├── privacy/
│   │   └── page.tsx
│   └── api/                     # API routes
│       └── newsletter/
│           └── route.ts
│
├── components/                   # Shared React components
│   ├── index.ts                 # Barrel export
│   │
│   │ # Layout Components
│   ├── Header.tsx               # Site header with nav
│   ├── Footer.tsx               # Site footer with disclosure
│   ├── Breadcrumb.tsx           # Breadcrumb navigation
│   │
│   │ # Review Components
│   ├── ReviewHero.tsx           # Review page hero (Server)
│   ├── ReviewHeroClient.tsx     # Hero with A/B testing (Client)
│   ├── ReviewHeroContent.tsx    # Hero content wrapper
│   ├── ReviewPageClient.tsx     # Full review page client wrapper
│   ├── ReviewsContent.tsx       # Reviews listing with filters
│   ├── ProsCons.tsx             # Pros/cons comparison
│   ├── ScreenshotGallery.tsx    # Screenshot carousel
│   ├── VideoEmbed.tsx           # YouTube embed
│   │
│   │ # Tool Display Components
│   ├── ToolCard.tsx             # Tool preview card
│   ├── ToolCardPersonalized.tsx # Card with user type badge
│   ├── ComparisonTable.tsx      # Static comparison table
│   ├── ComparisonTableSortable.tsx # Interactive sortable table
│   ├── StarRating.tsx           # Star rating display
│   │
│   │ # Conversion Components
│   ├── AffiliateLink.tsx        # Tracked affiliate link wrapper
│   ├── StickyCTA.tsx            # Floating CTA button
│   ├── ExitIntentPopup.tsx      # Exit intent modal
│   ├── SignupForm.tsx           # Newsletter signup
│   │
│   │ # Personalization Components
│   ├── QuizComponent.tsx        # Recommendation quiz
│   ├── UserTypeSelector.tsx     # User type picker
│   ├── PersonalizationBadge.tsx # "Best for X" badge
│   ├── SearchFilter.tsx         # Search and filter controls
│   │
│   │ # Trust & Compliance
│   ├── DisclosureNote.tsx       # FTC disclosure
│   ├── AuthorByline.tsx         # E-E-A-T author info
│   ├── Tooltip.tsx              # Info tooltips
│   │
│   │ # Analytics
│   └── GoogleAnalytics.tsx      # GA4 script loader
│
├── lib/                          # Core utilities & data
│   ├── data.ts                  # Tool data & query functions
│   ├── schema.ts                # JSON-LD schema generation
│   ├── analytics.ts             # GA4 tracking functions
│   ├── utils.ts                 # General utilities (clsx, etc.)
│   ├── author.ts                # Author information
│   ├── user-type.ts             # User type definitions
│   ├── quiz-scoring.ts          # Quiz algorithm (extracted)
│   ├── cms-adapter.ts           # Future CMS integration
│   │
│   └── hooks/                   # Client-side hooks
│       ├── index.ts             # Barrel export
│       ├── useABTest.ts         # A/B testing hook
│       └── useUserType.ts       # User type persistence
│
├── public/                       # Static assets
│   ├── icon.svg                 # Favicon
│   ├── grid.svg                 # Background pattern
│   ├── manifest.json            # PWA manifest
│   ├── robots.txt               # Crawler rules
│   └── images/
│       └── tools/               # Tool logos
│
├── docs/                         # Documentation
│   ├── prd.md                   # Product requirements
│   ├── system_design.md         # This document
│   ├── business_context.md      # Business strategy
│   └── AB_TESTING.md            # A/B test documentation
│
└── Configuration Files
    ├── next.config.mjs          # Next.js configuration
    ├── tailwind.config.ts       # Tailwind configuration
    ├── tsconfig.json            # TypeScript configuration
    ├── vitest.config.ts         # Test configuration
    ├── .eslintrc.json           # ESLint rules
    └── .env.example             # Environment variables template
```

---

## 3. Data Architecture

### 3.1 Data Model

#### Tool Entity

```typescript
interface Tool {
  // Identity
  slug: string;              // URL-friendly identifier
  name: string;              // Display name
  tagline: string;           // Short description
  description: string;       // Full description
  logoUrl: string;           // Logo image path
  
  // Ratings
  rating: number;            // 1-5 score
  ratingCount: number;       // Number of ratings
  
  // Classification
  category: Category;        // AI Writing, AI Voice, etc.
  
  // Pricing
  pricing: string;           // Display price ("From $49/mo")
  pricingDetails: string;    // Full pricing breakdown
  
  // Affiliate
  affiliateUrl: string;      // Partner URL
  cookieDuration?: number;   // Days
  commissionRate?: number;   // Percentage
  hasExclusiveDeal?: boolean;
  
  // Content
  features: string[];        // Feature list
  pros: string[];            // Advantages
  cons: string[];            // Disadvantages
  verdict: string;           // Expert conclusion
  bestFor: string;           // Target audience
  
  // Metadata
  lastUpdated: string;       // ISO date
  lastVerified: string;      // ISO date
  isNew?: boolean;           // New tool flag
  
  // Personalization
  recommendations?: Partial<Record<UserType, string>>;
  
  // Media
  screenshots?: string[];
  videoReviewUrl?: string;
}

type Category = 'AI Writing' | 'AI Voice' | 'AI Images' | 'AI Video' | 'AI Productivity';
type UserType = 'marketer' | 'creator' | 'solopreneur' | 'agency' | 'developer';
```

### 3.2 Data Flow

```
┌─────────────┐    Build Time    ┌─────────────┐
│  lib/data.ts │ ──────────────> │ Static HTML │
│  (Tool Data) │                 │   + JSON    │
└─────────────┘                  └─────────────┘
                                        │
                                        │ Request
                                        ▼
┌─────────────┐    Hydration     ┌─────────────┐
│   Client    │ <────────────── │   Server    │
│  Components │                  │  Components │
└─────────────┘                  └─────────────┘
       │
       │ User Interaction
       ▼
┌─────────────┐
│ localStorage │  (A/B variants, User type)
└─────────────┘
```

### 3.3 Data Access Patterns

```typescript
// lib/data.ts - Query Functions

// Get single tool by slug
getToolBySlug(slug: string): Tool | undefined

// Get all tool slugs (for static generation)
getAllToolSlugs(): string[]

// Get tools by category
getToolsByCategory(category: string): Tool[]

// Get featured tools (sorted by commission/deals)
getFeaturedTools(count?: number): Tool[]

// Get recently updated tools
getRecentlyUpdatedTools(count?: number): Tool[]

// Get new tools (isNew flag)
getNewTools(): Tool[]

// Filter tools by search and category
filterTools(query: string, category: Category): Tool[]
```

---

## 4. Component Architecture

### 4.1 Server vs Client Components

```
Component Rendering Strategy
============================

SERVER COMPONENTS (Default)
├── ReviewHero.tsx           # Static review header
├── ToolCard.tsx             # Tool preview cards
├── ProsCons.tsx             # Pros/cons list
├── ComparisonTable.tsx      # Static comparison
├── AuthorByline.tsx         # Author info
├── DisclosureNote.tsx       # FTC disclosure
├── Breadcrumb.tsx           # Navigation
├── Footer.tsx               # Site footer
└── Header.tsx               # Site header (mostly static)

CLIENT COMPONENTS ('use client')
├── ReviewHeroClient.tsx     # A/B tested CTA buttons
├── ReviewPageClient.tsx     # Interactive review wrapper
├── QuizComponent.tsx        # Quiz state management
├── ComparisonTableSortable.tsx # TanStack Table sorting
├── UserTypeSelector.tsx     # User type selection
├── ToolCardPersonalized.tsx # Personalized badges
├── ExitIntentPopup.tsx      # Exit intent detection
├── StickyCTA.tsx            # Scroll-based visibility
├── SearchFilter.tsx         # Search input state
├── SignupForm.tsx           # Form submission
├── GoogleAnalytics.tsx      # GA4 script
└── AffiliateLink.tsx        # Click tracking
```

### 4.2 Component Composition Pattern

```tsx
// Review Page Composition Example

// app/reviews/[slug]/page.tsx (Server Component)
export default async function ReviewPage({ params }) {
  const tool = getToolBySlug(params.slug);
  
  return (
    <>
      {/* Server-rendered SEO content */}
      <script type="application/ld+json">
        {JSON.stringify(generateReviewSchema(tool))}
      </script>
      
      {/* Client wrapper for interactivity */}
      <ReviewPageClient tool={tool}>
        {/* Server-rendered content passed as children */}
        <ReviewHeroContent tool={tool} />
        <ProsCons pros={tool.pros} cons={tool.cons} />
        <ScreenshotGallery screenshots={tool.screenshots} />
      </ReviewPageClient>
    </>
  );
}

// components/ReviewPageClient.tsx (Client Component)
'use client';

export function ReviewPageClient({ tool, children }) {
  // Client-side state and effects
  const { value: ctaVariant } = useABTest({ testId: 'cta-style', ... });
  
  return (
    <article>
      <ReviewHeroClient tool={tool} ctaVariant={ctaVariant} />
      {children}
      <StickyCTA tool={tool} />
    </article>
  );
}
```

### 4.3 Styling Architecture

```typescript
// Tailwind Configuration (tailwind.config.ts)

const config = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0fdfa',
          // ... teal palette
          600: '#0d9488',
          700: '#0f766e',
        },
        accent: {
          // ... blue palette
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
    },
  },
};

// Usage Pattern with clsx()
import { clsx } from 'clsx';

<button className={clsx(
  'px-4 py-2 rounded-lg font-medium',
  'transition-colors duration-200',
  isPrimary && 'bg-primary-600 text-white hover:bg-primary-700',
  isSecondary && 'bg-slate-100 text-slate-700 hover:bg-slate-200',
  disabled && 'opacity-50 cursor-not-allowed'
)} />
```

---

## 5. A/B Testing System

### 5.1 Architecture

```
┌─────────────────────────────────────────────────┐
│                useABTest Hook                   │
├─────────────────────────────────────────────────┤
│  1. Check localStorage for existing assignment  │
│  2. If none, select variant (weighted random)   │
│  3. Persist to localStorage                     │
│  4. Return variant + tracking function          │
└─────────────────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────┐
│            Variant Application                  │
├─────────────────────────────────────────────────┤
│  Component renders based on assigned variant    │
│  (e.g., different CTA colors, messaging)        │
└─────────────────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────┐
│            Conversion Tracking                  │
├─────────────────────────────────────────────────┤
│  trackConversion() → GA4 ab_test_conversion     │
│  Links conversion to test/variant for analysis  │
└─────────────────────────────────────────────────┘
```

### 5.2 Hook Implementation

```typescript
// lib/hooks/useABTest.ts

interface ABTestConfig<T> {
  testId: string;
  variants: ABTestVariant<T>[];
  persist?: boolean;
  onAssignment?: (variantId: string, value: T) => void;
}

interface ABTestResult<T> {
  variantId: string;
  value: T;
  isReady: boolean;
  trackConversion: (eventName?: string) => void;
}

function useABTest<T>(config: ABTestConfig<T>): ABTestResult<T>;

// Usage Example
const { value: buttonStyle, trackConversion } = useABTest({
  testId: 'hero-cta-style',
  variants: [
    { id: 'control', value: 'btn-primary' },
    { id: 'gradient', value: 'btn-gradient', weight: 2 },
  ],
});
```

### 5.3 Active Tests

| Test ID | Variants | Metric | Status |
|---------|----------|--------|--------|
| `hero-cta-style` | control, gradient | Affiliate CTR | Active |
| `urgency-message` | none, limited-offer, discount | Conversion | Planned |
| `sticky-cta-delay` | 200px, 400px, 600px | Engagement | Planned |

---

## 6. Analytics & Tracking

### 6.1 Event Taxonomy

```typescript
// Core Events (lib/analytics.ts)

// Affiliate Revenue Events
trackAffiliateClick({
  toolName: string,
  toolSlug: string,
  affiliateUrl: string,
  position: 'hero' | 'sticky' | 'content' | 'sidebar' | 'tool-card',
  ctaVariant?: string,
  urgencyVariant?: string,
});

// Engagement Events
trackNewsletterSignup({ location: string });
trackComparisonView(tools: string[]);
trackReviewEngagement({
  toolSlug: string,
  scrollDepth: number,  // 0-100
  timeOnPage: number,   // seconds
});

// Experimentation Events
trackABTestAssignment({ testId, variantId, variantValue });
trackABTestConversion({ testId, variantId, conversionType });

// Revenue Metrics (Admin)
trackEPCData({ toolSlug, clicks, conversions, revenue });
```

### 6.2 Data Flow to GA4

```
User Action
    │
    ▼
Component Event Handler
    │
    ▼
trackAffiliateClick() ───────────────────┐
    │                                     │
    ▼                                     │
window.gtag('event', 'affiliate_click', { │
  tool_name,                              │
  tool_slug,                              │
  click_position,                         │
  cta_variant,                            ├──> GA4 Property
  ...                                     │
});                                       │
    │                                     │
    ▼                                     │
window.gtag('event', 'click', {          │
  event_category: 'outbound',            │
  event_label: affiliateUrl,             ┘
});
```

### 6.3 EPC Calculation

```
EPC (Earnings Per Click) = Total Revenue / Total Clicks

Example:
- Jasper AI: 1,500 clicks, $2,250 revenue
- EPC = $2,250 / 1,500 = $1.50

Factors Affecting EPC:
1. Tool commission rate
2. Cookie duration (longer = more attributed conversions)
3. CTA placement effectiveness
4. A/B test variant performance
5. User segment quality
```

---

## 7. SEO Architecture

### 7.1 Metadata Strategy

```typescript
// app/reviews/[slug]/page.tsx

export async function generateMetadata({ params }): Promise<Metadata> {
  const tool = getToolBySlug(params.slug);
  
  return {
    title: `${tool.name} Review 2026 - Honest Expert Analysis`,
    description: tool.verdict.slice(0, 155) + '...',
    openGraph: {
      title: `${tool.name} Review`,
      description: tool.tagline,
      images: [{ url: tool.logoUrl }],
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
    },
    alternates: {
      canonical: `https://aitoolreviews.com/reviews/${tool.slug}`,
    },
  };
}
```

### 7.2 JSON-LD Schema Types

```typescript
// lib/schema.ts - Generated Schemas

@graph: [
  WebPage          // Page metadata + breadcrumbs
  SoftwareApplication  // Product being reviewed
  Review           // The review itself with ratings
  BreadcrumbList   // Navigation path
  FAQPage          // Common questions
  Organization     // Publisher info
  Person           // Author (E-E-A-T)
]
```

### 7.3 Sitemap Generation

```typescript
// app/sitemap.ts

export default function sitemap(): MetadataRoute.Sitemap {
  const tools = getAllToolSlugs();
  
  return [
    { url: 'https://aitoolreviews.com', changeFrequency: 'weekly', priority: 1 },
    { url: 'https://aitoolreviews.com/reviews', changeFrequency: 'daily', priority: 0.9 },
    { url: 'https://aitoolreviews.com/comparisons', changeFrequency: 'weekly', priority: 0.8 },
    ...tools.map(slug => ({
      url: `https://aitoolreviews.com/reviews/${slug}`,
      changeFrequency: 'weekly',
      priority: 0.8,
    })),
  ];
}
```

---

## 8. Performance Optimization

### 8.1 Core Web Vitals Targets

| Metric | Target | Strategy |
|--------|--------|----------|
| **LCP** (Largest Contentful Paint) | < 2.5s | Server Components, Image optimization, Edge CDN |
| **INP** (Interaction to Next Paint) | < 200ms | Minimal client JS, Event delegation |
| **CLS** (Cumulative Layout Shift) | < 0.1 | Explicit dimensions, Font loading strategy |

### 8.2 Optimization Techniques

```typescript
// 1. Image Optimization
import Image from 'next/image';

<Image
  src={tool.logoUrl}
  alt={`${tool.name} logo`}
  width={64}
  height={64}
  priority={isAboveFold}  // Preload for LCP
/>

// 2. Font Loading
// next.config.mjs
export default {
  experimental: {
    optimizeFonts: true,
  },
};

// 3. Code Splitting
// Dynamic imports for heavy components
const ComparisonTableSortable = dynamic(
  () => import('@/components/ComparisonTableSortable'),
  { ssr: false }  // Client-only component
);

// 4. Prefetching
<Link href={`/reviews/${tool.slug}`} prefetch={true}>
  Read Review
</Link>
```

### 8.3 Bundle Analysis

```bash
# Analyze bundle size
npm run build
npx @next/bundle-analyzer
```

Target Bundle Sizes:
- First Load JS: < 100KB
- Per-Route JS: < 30KB
- Total CSS: < 50KB

---

## 9. Testing Strategy

### 9.1 Test Pyramid

```
                    ┌─────────────┐
                    │    E2E      │  (Playwright - future)
                    │   Tests     │
                   ─┴─────────────┴─
                  ┌─────────────────┐
                  │   Integration   │  (Component + Hook tests)
                  │     Tests       │
                 ─┴─────────────────┴─
                ┌─────────────────────┐
                │      Unit Tests     │  (Utilities, scoring)
                │                     │
               ─┴─────────────────────┴─
```

### 9.2 Test Configuration

```typescript
// vitest.config.ts
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.tsx'],
    include: ['**/*.test.{ts,tsx}'],
    coverage: {
      reporter: ['text', 'html'],
      include: ['lib/**', 'components/**'],
    },
  },
});
```

### 9.3 Testing Patterns

```typescript
// Component Test Example
import { render, screen } from '@testing-library/react';
import { ToolCard } from '@/components/ToolCard';
import { tools } from '@/lib/data';

describe('ToolCard', () => {
  it('displays tool name and rating', () => {
    render(<ToolCard tool={tools[0]} />);
    
    expect(screen.getByText('Jasper AI')).toBeInTheDocument();
    expect(screen.getByText('4.8')).toBeInTheDocument();
  });
});

// Quiz Scoring Unit Test
import { calculateToolScore } from '@/lib/quiz-scoring';

describe('calculateToolScore', () => {
  it('gives category match bonus', () => {
    const result = calculateToolScore(jasperTool, ['AI Writing']);
    expect(result.score).toBeGreaterThanOrEqual(5);
  });
});
```

---

## 10. Deployment Architecture

### 10.1 Vercel Deployment

```
GitHub Repository
       │
       │ Push to main
       ▼
┌─────────────────────────────────────┐
│         Vercel Build Pipeline       │
├─────────────────────────────────────┤
│  1. Install dependencies (npm ci)   │
│  2. Run linting (eslint)            │
│  3. Run tests (vitest)              │
│  4. Build Next.js (next build)      │
│  5. Deploy to Edge Network          │
└─────────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────┐
│         Vercel Edge Network         │
├─────────────────────────────────────┤
│  - Static pages (ISR)               │
│  - Edge functions (middleware)      │
│  - CDN caching                      │
│  - Automatic HTTPS                  │
└─────────────────────────────────────┘
```

### 10.2 Environment Variables

```bash
# .env.example

# Analytics
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# Newsletter (future)
MAILCHIMP_API_KEY=
MAILCHIMP_LIST_ID=

# Site URL (for OG images, sitemap)
NEXT_PUBLIC_SITE_URL=https://aitoolreviews.com
```

### 10.3 Branch Strategy

```
main (production)
  │
  ├── dev (staging/preview)
  │     │
  │     ├── feature/quiz-improvements
  │     ├── feature/new-tool-reviews
  │     └── fix/mobile-sticky-cta
  │
  └── Preview deployments for each PR
```

---

## 11. Evolution Mechanisms Architecture

> Per the philosophy framework, these systems enable perpetual advancement.

### 11.1 Reflection Cycle Infrastructure

```
┌─────────────────────────────────────────────────────────────────┐
│                    Analytics Pipeline                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  User Events ──→ GA4 ──→ BigQuery ──→ Dashboards ──→ Insights  │
│                    │                        │                   │
│                    ▼                        ▼                   │
│              Real-time            Scheduled Reports             │
│              Monitoring           (Daily/Weekly/Monthly)        │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Implementation:**
- GA4 events flow to BigQuery for analysis
- Automated dashboards surface key metrics
- Anomaly detection alerts for sudden changes
- Weekly AI-summarized performance reports (future)

### 11.2 Adaptive Sub-Systems

```typescript
// Adaptive System Architecture

interface AdaptiveSubSystem {
  sense(): Signal[];           // Detect environmental changes
  interpret(signals: Signal[]): Decision;  // Analyze signals
  optimize(decision: Decision): Action;    // Take action
  learn(outcome: Outcome): void;           // Record learning
}

// Current Implementations:

// 1. A/B Testing System (useABTest hook)
//    - Sense: Conversion events
//    - Interpret: Statistical significance calculation
//    - Optimize: Promote winning variants
//    - Learn: Store variant performance history

// 2. Personalization System (useUserType hook)
//    - Sense: User type selection, quiz answers
//    - Interpret: Match user to recommendation profile
//    - Optimize: Show personalized badges/content
//    - Learn: Track conversion by user type

// 3. Content Freshness System (future)
//    - Sense: Tool API changes, pricing updates
//    - Interpret: Significance of changes
//    - Optimize: Trigger content refresh
//    - Learn: Track update frequency patterns
```

### 11.3 Human Oversight Implementation

```typescript
// Confidence-based routing system

interface ConfidenceRouter {
  evaluate(decision: Decision): ConfidenceLevel;
  route(level: ConfidenceLevel): Handler;
}

type ConfidenceLevel = 
  | 'full_auto'      // 95%+ — No intervention
  | 'auto_review'    // 80-95% — Auto with periodic review
  | 'human_approve'  // 60-80% — Requires approval
  | 'manual_handle'; // <60% — Full human handling

// Current confidence levels by system:

const systemConfidence = {
  'ab_test_winner': 'auto_review',      // Statistical threshold met
  'personalization': 'full_auto',        // Rule-based, deterministic
  'content_update': 'human_approve',     // Quality review needed
  'new_tool_review': 'manual_handle',    // Full human creation
  'pricing_change': 'auto_review',       // Verify before publish
};
```

### 11.4 Progress Tracking Schema

```typescript
// Decision and outcome logging structure

interface DecisionLog {
  id: string;
  timestamp: Date;
  
  // Decision context
  type: 'feature' | 'content' | 'optimization' | 'experiment';
  description: string;
  
  // Philosophy alignment
  philosophy: {
    coreValue: CoreValue;
    principle: DecisionPrinciple;
    constraint?: BoundaryConstraint;
  };
  
  // Expected outcome
  hypothesis: string;
  metrics: string[];
  successCriteria: string;
  
  // Actual outcome (filled after measurement)
  outcome?: {
    result: 'success' | 'partial' | 'failure';
    metrics: Record<string, number>;
    learnings: string[];
    nextActions: string[];
  };
}

// Storage: JSON files → Database (future)
// Location: /logs/decisions/ (gitignored)
```

### 11.5 Learning Infrastructure

```
Knowledge Accumulation Flow:
============================

Decision Made
     │
     ▼
Outcome Measured (2-4 weeks)
     │
     ▼
Pattern Recognized
     │
     ├──→ Success Pattern ──→ Document in playbook
     │
     └──→ Failure Pattern ──→ Document anti-pattern
                                    │
                                    ▼
                            Update decision rules
```

**Knowledge Base Structure:**
```
/docs/learnings/
├── playbooks/
│   ├── high-converting-cta.md
│   ├── effective-personalization.md
│   └── seo-optimization.md
├── anti-patterns/
│   ├── conversion-killers.md
│   └── performance-pitfalls.md
└── experiments/
    ├── completed/
    └── in-progress/
```

---

## 12. Future Architecture Considerations

> Aligned with Autonomy Phase objectives from the philosophy framework.

### 12.1 CMS Integration (Amplification Phase)

```typescript
// lib/cms-adapter.ts — Abstraction for content sources

interface CMSAdapter {
  // Read operations
  getTools(): Promise<Tool[]>;
  getToolBySlug(slug: string): Promise<Tool | null>;
  getCategories(): Promise<Category[]>;
  
  // Write operations (for automated updates)
  updateToolPricing(slug: string, pricing: PricingUpdate): Promise<void>;
  flagForReview(slug: string, reason: string): Promise<void>;
}

// Planned implementations:
// Phase 2: NotionAdapter (editorial workflow)
// Phase 3: Custom headless CMS with automation hooks
```

### 12.2 API Layer (Amplification Phase)

```
Future API Architecture:
========================

Public APIs (Rate Limited)
├── /api/tools              # GET tools list
├── /api/tools/[slug]       # GET single tool
├── /api/quiz/results       # POST quiz answers → recommendations
└── /api/newsletter         # POST subscribe

Admin APIs (Authenticated)
├── /api/admin/analytics/epc     # GET EPC metrics
├── /api/admin/content/refresh   # POST trigger content update
├── /api/admin/experiments       # CRUD A/B tests
└── /api/admin/decisions         # GET decision logs

Automation APIs (Internal/Webhook)
├── /api/hooks/pricing-change    # Webhook for price monitors
├── /api/hooks/tool-update       # Webhook for feature changes
└── /api/cron/freshness-check    # Scheduled content audit
```

### 12.3 Autonomous Systems (Autonomy Phase)

Per *Progressive Autonomy* constraint — each system advances through stages:

| System | Current | Target | Automation Path |
|--------|---------|--------|-----------------|
| **Content Updates** | Manual | 95% Auto | Price APIs → AI verification → Human spot-check |
| **A/B Testing** | Manual analysis | Self-optimizing | Statistical engine → Auto-promote → Continuous testing |
| **Personalization** | Rule-based | ML-powered | Behavior tracking → Model training → Real-time inference |
| **New Tool Discovery** | Manual | AI-assisted | Market monitoring → AI triage → Human final review |

### 12.4 ML-Powered Features (Autonomy Phase)

```typescript
// Future ML capabilities aligned with Self-Adaptation value

interface MLCapabilities {
  // Personalization Engine
  recommendTools(userBehavior: UserBehavior): Tool[];
  predictConversion(user: User, tool: Tool): number;
  
  // Content Intelligence
  generateFAQs(toolData: Tool, userQueries: Query[]): FAQ[];
  assessContentFreshness(review: Review): FreshnessScore;
  suggestUpdates(tool: Tool, marketData: MarketData): UpdateSuggestion[];
  
  // Market Sensing
  detectNewTools(sources: DataSource[]): ToolCandidate[];
  analyzeTrends(category: Category): TrendReport;
  
  // Revenue Optimization
  predictEPC(tool: Tool, placement: Placement): number;
  optimizePlacement(page: Page): PlacementRecommendation[];
}
```

### 12.5 Self-Sustaining Architecture Target

```
Autonomy Phase Architecture Vision:
===================================

┌──────────────────────────────────────────────────────────────────┐
│                    Autonomous Flywheel                           │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐      │
│  │ Market  │───→│ Content │───→│ Traffic │───→│ Revenue │      │
│  │ Sensing │    │ Engine  │    │ Engine  │    │ Engine  │      │
│  └────┬────┘    └────┬────┘    └────┬────┘    └────┬────┘      │
│       │              │              │              │            │
│       └──────────────┴──────────────┴──────────────┘            │
│                              │                                   │
│                              ▼                                   │
│                    ┌─────────────────┐                          │
│                    │  Learning Core  │                          │
│                    │  (Feedback Hub) │                          │
│                    └─────────────────┘                          │
│                              │                                   │
│                              ▼                                   │
│                    Human Oversight: < 10%                        │
│                    (Strategic direction only)                    │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

---

## 13. Appendix

### 13.1 Import Aliases

```json
// tsconfig.json paths
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"]
    }
  }
}

// Usage
import { tools } from '@/lib/data';
import { ToolCard } from '@/components/ToolCard';
```

### 13.2 Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Components | PascalCase | `ToolCard.tsx` |
| Hooks | camelCase with `use` prefix | `useABTest.ts` |
| Utilities | camelCase | `utils.ts` |
| Types | PascalCase | `Tool`, `UserType` |
| Constants | SCREAMING_SNAKE_CASE | `CATEGORY_MATCH_BONUS` |
| CSS Classes | kebab-case (Tailwind) | `bg-primary-600` |

### 13.3 Key Dependencies

```json
{
  "dependencies": {
    "next": "^15.0.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "@tanstack/react-table": "^8.0.0",
    "clsx": "^2.0.0"
  },
  "devDependencies": {
    "typescript": "^5.0.0",
    "tailwindcss": "^3.0.0",
    "vitest": "^1.0.0",
    "@testing-library/react": "^14.0.0",
    "eslint": "^8.0.0"
  }
}
```

### 13.4 Philosophy Framework References

| Document | Purpose | Link |
|----------|---------|------|
| **EvoLink.md** | EvoLink Architect persona — the mastermind model for all decisions | [View](./EvoLink.md) |
| **philosophy_framework.md** | Timeless judgment philosophy — abstract principles | [View](./philosophy_framework.md) |
| **business_context.md** | Business strategy and 2026 market alignment | [View](./business_context.md) |
| **prd.md** | Product requirements and business features | [View](./prd.md) |

### 13.5 Architecture Decision Record (ADR) Template

When making architectural decisions, document using this template aligned with the philosophy:

```markdown
# ADR-XXX: [Decision Title]

## Status
[Proposed | Accepted | Deprecated | Superseded]

## Context
[What is the issue that motivates this decision?]

## Philosophy Alignment
- **Core Value:** [Which value does this serve?]
- **Decision Principle:** [Which principle guides this choice?]
- **Boundary Constraint:** [Any limits that apply?]
- **Phase Alignment:** [Validation | Amplification | Autonomy]

## Decision
[What is the change being proposed/made?]

## Consequences
- **Positive:** [Benefits]
- **Negative:** [Trade-offs]
- **Automation Impact:** [How does this affect automation goals?]

## Metrics
[How will we measure success?]
```

### 13.6 Technical Decision Mapping

Key architectural choices and their philosophy alignment:

| Decision | Choice | Philosophy Justification |
|----------|--------|-------------------------|
| Framework | Next.js 15 App Router | *Automation Feasibility* — RSC reduces client JS; ISR enables auto-updates |
| Rendering | Server Components default | *Efficiency Discipline* — optimal performance with minimal resources |
| State | localStorage for personalization | *Progressive Autonomy* — simple first, database later |
| Data | Static JSON in lib/data.ts | *Validation Phase* — minimal viable, upgrade to CMS in Amplification |
| Testing | Vitest + RTL | *Excellence Benchmarking* — maintain quality standards |
| Analytics | GA4 with custom events | *Reflection Cycle* — enable measurement and learning |
| A/B Testing | Custom hook | *Self-Adaptation* — built-in optimization capability |
