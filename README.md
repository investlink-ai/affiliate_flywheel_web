# AI Tool Reviews - Affiliate Flywheel

A high-performance, SEO-optimized affiliate review site for AI productivity and content creation tools. Built with Next.js 15+, TypeScript, and Tailwind CSS.

## Features

- **Next.js 15+ App Router** with React Server Components
- **TypeScript** with strict mode enabled
- **Tailwind CSS** with custom design tokens
- **SEO Optimized**: Dynamic metadata, OpenGraph, JSON-LD schema
- **Performance First**: Optimized for Core Web Vitals (LCP/INP/CLS)
- **Dark Mode**: System-aware with manual toggle
- **Affiliate Compliant**: FTC-compliant disclosures throughout
- **Mobile First**: Fully responsive design
- **Accessible**: Semantic HTML, ARIA labels, keyboard navigation

## Getting Started

### Prerequisites

- Node.js 18.17 or later
- npm, yarn, or pnpm

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the site.

### Build for Production

```bash
# Create production build
npm run build

# Start production server
npm start
```

## Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── layout.tsx         # Root layout with Header/Footer
│   ├── page.tsx           # Homepage
│   ├── reviews/           # Review pages
│   │   ├── page.tsx       # Reviews index
│   │   └── [slug]/        # Dynamic review pages
│   ├── comparisons/       # Comparison tables
│   ├── about/             # About page
│   ├── privacy/           # Privacy & disclosures
│   ├── sitemap.ts         # Dynamic sitemap generation
│   ├── not-found.tsx      # 404 page
│   └── global-error.tsx   # Error boundary
├── components/            # Reusable React components
│   ├── Header.tsx         # Site header with nav
│   ├── Footer.tsx         # Site footer with disclosure
│   ├── AffiliateLink.tsx  # Affiliate link wrapper
│   ├── DisclosureNote.tsx # FTC disclosure component
│   ├── ToolCard.tsx       # Tool preview card
│   ├── ReviewHero.tsx     # Review page hero section
│   ├── ProsCons.tsx       # Pros/cons comparison
│   ├── ComparisonTable.tsx# Feature comparison table
│   └── StarRating.tsx     # Star rating display
├── lib/                   # Utilities and data
│   ├── data.ts            # Tool data and helpers
│   └── utils.ts           # Utility functions
├── public/                # Static assets
│   ├── images/            # Images and logos
│   ├── icon.svg           # Favicon
│   └── manifest.json      # PWA manifest
└── tailwind.config.ts     # Tailwind configuration
```

## Adding New Reviews

1. Add tool data to `lib/data.ts`:

```typescript
{
  slug: 'new-tool',
  name: 'New Tool',
  tagline: 'Short description',
  description: 'Full description...',
  // ... other fields
}
```

2. Add tool logo to `public/images/tools/`

3. The review page is automatically generated at `/reviews/new-tool`

## Customization

### Colors

Edit `tailwind.config.ts` to change the color scheme:

```typescript
colors: {
  primary: { /* teal shades */ },
  accent: { /* blue shades */ },
}
```

### Affiliate Link

Update the ref parameter in `components/AffiliateLink.tsx`:

```typescript
const AFFILIATE_REF = "?ref=your-ref-id";
```

### Disclosure Text

Edit disclosure text in:

- `components/DisclosureNote.tsx`
- `components/Footer.tsx`
- `app/privacy/page.tsx`

## Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

Or connect your GitHub repo to Vercel for automatic deployments.

### Other Platforms

The site can be deployed to any platform that supports Next.js:

- AWS Amplify
- Netlify
- Railway
- Self-hosted with `npm start`

## Performance Optimization

This template is optimized for Core Web Vitals:

- **LCP**: Server Components, optimized images, minimal JS
- **INP**: Minimal client-side interactivity
- **CLS**: Explicit image dimensions, font loading strategy

## SEO Features

- Dynamic `<title>` and `<meta>` tags per page
- OpenGraph and Twitter Card metadata
- JSON-LD structured data for reviews
- Automatic sitemap generation
- Semantic HTML structure
- Mobile-friendly design

## Analytics Integration

### Set up Google tag (GA4)

The site uses **Google tag (gtag.js)** for GA4. The tag is loaded in `app/layout.tsx` via the `GoogleAnalytics` component and only runs when a valid Measurement ID is set.

**1. Get your Measurement ID**

- Go to [Google Analytics](https://analytics.google.com/) → **Admin** → **Data streams**
- Create or select a **Web** stream
- Copy the **Measurement ID** (format `G-XXXXXXXXXX`)

**2. Set the environment variable**

- **Local:** Copy `.env.example` to `.env.local` and set:
  ```bash
  NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX   # your real ID
  ```
- **Production (e.g. Vercel):** In your host’s dashboard, add `NEXT_PUBLIC_GA_MEASUREMENT_ID` with your Measurement ID, then redeploy.

**3. (Optional) Enable in development**

GA is off in dev by default. To test locally, add to `.env.local`:

```bash
NEXT_PUBLIC_GA_FORCE_ENABLE=true
```

**4. Verify**

- After deploy, open your site and check the Network tab for requests to `googletagmanager.com/gtag/js?id=G-...`
- In GA4, open **Reports → Realtime** and confirm your visit appears.

Once the ID is set, affiliate clicks, page views, and other events from `lib/analytics.ts` are sent automatically.

### EPC (Earnings Per Click) Tracking

The analytics module tracks:

- **Affiliate clicks** with tool name, position, and A/B test variants
- **Newsletter signups** with location tracking
- **A/B test conversions** for CTA optimization
- **Review engagement** (scroll depth, time on page)

### Custom Events

```typescript
import { trackAffiliateClick, trackNewsletterSignup } from "@/lib/analytics";

// Track affiliate click
trackAffiliateClick({
  toolName: "Jasper AI",
  toolSlug: "jasper-ai",
  affiliateUrl: "https://jasper.ai?ref=you",
  position: "hero",
  ctaVariant: "gradient",
});

// Track newsletter signup
trackNewsletterSignup({
  location: "homepage",
});
```

## Newsletter Integration

### SignupForm Component

The `SignupForm` component supports Mailchimp, ConvertKit, or custom endpoints:

```tsx
<SignupForm
  location="homepage"
  variant="card" // 'card' | 'banner' | 'inline'
  headline="Get Weekly AI Insights"
  description="Join 5,000+ creators..."
  formAction="https://your-mailchimp-url" // Optional
/>
```

### Variants

- **card**: Full card with icon and trust signals (best for dedicated sections)
- **banner**: Gradient banner with inline form (great for CTA sections)
- **inline**: Minimal horizontal layout (for footers/sidebars)

## Next Steps

1. **Add real content**: Replace placeholder data in `lib/data.ts`
2. **Add images**: Upload tool logos to `public/images/tools/`
3. **Set up domain**: Configure your domain in Vercel
4. **Add analytics**: Integrate Plausible, Fathom, or similar
5. **Create more reviews**: Follow the data structure pattern
6. **Build backlinks**: Promote your reviews
7. **Monitor rankings**: Track keyword positions

## License

MIT License - feel free to use this template for your own affiliate sites.

## Support

- Twitter: [@FeynmanXu](https://twitter.com/FeynmanXu)
- Email: hello@aitoolreviews.com
