# A/B Testing Guide

This project includes a lightweight A/B testing system that works client-side with localStorage persistence.

## Basic Usage

### useABTest Hook

```tsx
'use client';

import { useABTest } from '@/lib/hooks';

function CTAButton() {
  const { value, variantId, trackConversion, isReady } = useABTest({
    testId: 'cta-button-color',
    variants: [
      { id: 'control', value: 'bg-primary-600', weight: 50 },
      { id: 'variant-a', value: 'bg-accent-500', weight: 25 },
      { id: 'variant-b', value: 'bg-green-600', weight: 25 },
    ],
    persist: true, // Remember assignment in localStorage
  });

  return (
    <button
      className={`${value} px-4 py-2 text-white rounded`}
      onClick={() => {
        trackConversion('click');
        // ... handle click
      }}
    >
      Sign Up Now
    </button>
  );
}
```

### Variant Weights

Weights determine the probability of assignment:
- Equal weights (default): Each variant has equal probability
- Custom weights: Use `weight` property to bias distribution

```tsx
variants: [
  { id: 'control', value: 'A', weight: 70 },  // 70% of users
  { id: 'treatment', value: 'B', weight: 30 }, // 30% of users
]
```

### Tracking Conversions

The `trackConversion` function dispatches a custom event that can be captured:

```tsx
// In your analytics integration
useEffect(() => {
  const handler = (e: CustomEvent) => {
    const { testId, variantId, eventName } = e.detail;
    // Send to your analytics service
    analytics.track('ab_test_conversion', { testId, variantId, eventName });
  };

  window.addEventListener('ab_test_conversion', handler);
  return () => window.removeEventListener('ab_test_conversion', handler);
}, []);
```

## User Type Personalization

### useUserType Hook

```tsx
'use client';

import { useUserType } from '@/lib/hooks';

function PersonalizedContent() {
  const { userType, setUserType, clearUserType, isReady } = useUserType();

  if (!isReady) return <LoadingSkeleton />;

  return (
    <div>
      {userType === 'marketer' && <MarketingFeatures />}
      {userType === 'creator' && <CreatorFeatures />}
      {!userType && <GenericFeatures />}

      <select onChange={(e) => setUserType(e.target.value)}>
        <option value="">Select your role</option>
        <option value="marketer">Marketer</option>
        <option value="creator">Creator</option>
      </select>
    </div>
  );
}
```

### URL Parameter Override

User type can be set via URL for marketing campaigns:

```
https://yoursite.com/reviews?usertype=marketer
```

This will:
1. Override any localStorage value
2. Persist to localStorage for future visits
3. Show personalized recommendations immediately

## Testing in Development

### Clear Test Assignments

```javascript
// In browser console
localStorage.removeItem('ab_test_cta-button-color');
localStorage.removeItem('user_type');
```

### Force Specific Variant

```javascript
// Force a specific variant for testing
localStorage.setItem('ab_test_cta-button-color', 'variant-a');
```

## Best Practices

### 1. Minimize Layout Shift

Always provide a default value for SSR:

```tsx
const { value, isReady } = useABTest({
  testId: 'hero-text',
  variants: [
    { id: 'control', value: 'Get Started' },
    { id: 'treatment', value: 'Start Free Trial' },
  ],
});

// Use control as default during SSR
const buttonText = isReady ? value : 'Get Started';
```

### 2. Keep Tests Simple

- Test one variable at a time
- Use clear, descriptive test IDs
- Document what each variant tests

### 3. Statistical Significance

This system doesn't calculate statistical significance. Use external tools:
- Export conversion events to analytics
- Use tools like Google Optimize or Optimizely for analysis
- Ensure adequate sample size before drawing conclusions

### 4. Cleanup Old Tests

Remove test code after concluding:

```tsx
// ❌ Don't leave concluded tests
const { value } = useABTest({...});

// ✅ Replace with winning variant
const buttonColor = 'bg-accent-500'; // Winner from test
```

## Integration Examples

### With Plausible Analytics

```tsx
const { variantId, trackConversion } = useABTest({...});

// Track page view with variant
useEffect(() => {
  if (typeof window !== 'undefined' && window.plausible) {
    window.plausible('pageview', {
      props: { ab_variant: variantId }
    });
  }
}, [variantId]);

// Track conversion
<button onClick={() => {
  trackConversion('signup');
  window.plausible?.('Signup', { props: { variant: variantId }});
}}>
  Sign Up
</button>
```

### With PostHog

```tsx
import { usePostHog } from 'posthog-js/react';

function ABTestComponent() {
  const posthog = usePostHog();
  const { value, variantId } = useABTest({
    testId: 'pricing-test',
    variants: [...],
    onAssignment: (id, val) => {
      posthog?.capture('$experiment_started', {
        experiment: 'pricing-test',
        variant: id,
      });
    },
  });

  // ...
}
```

## Current Active Tests

| Test ID | Description | Variants | Status |
|---------|-------------|----------|--------|
| `tool-card-cta-style` | CTA button styling on tool cards | control, accent, gradient | Active |
| `affiliate-cta-style` | Affiliate link button color | default (40%), accent (20%), gradient (20%), urgency (20%) | Active |
| `affiliate-urgency-text` | Urgency badge text on CTAs | none (50%), limited (20%), popular (15%), ending (15%) | Active |
| `review-hero-cta-variant` | Hero section CTA styling | control (40%), accent (20%), gradient (20%), urgency (20%) | Active |
| `review-hero-urgency` | Hero section urgency text | none (50%), limited (25%), popular (25%) | Active |

## A/B Test Variant Reference

### CTA Style Variants (`CTAVariant`)

| Variant | Description | Color |
|---------|-------------|-------|
| `default` | Primary teal | `bg-primary-600` |
| `accent` | Blue accent | `bg-accent-500` |
| `gradient` | Teal to blue gradient | `from-primary-600 to-accent-500` |
| `urgency` | Red urgent | `bg-red-600` |

### Urgency Text Variants (`UrgencyVariant`)

| Variant | Badge Text | Visual |
|---------|------------|--------|
| `none` | No badge | — |
| `limited` | "Limited Offer" | Animated dot |
| `popular` | "Most Popular" | Animated dot |
| `ending` | "Ending Soon" | Animated dot |

## Component Usage Examples

### AffiliateCTAButton with A/B Testing

```tsx
import { AffiliateCTAButton } from '@/components/AffiliateLink';

// With A/B testing enabled (recommended)
<AffiliateCTAButton
  href="https://example.com"
  enableABTest={true}
  size="lg"
>
  Start Free Trial
</AffiliateCTAButton>

// With manual variant override (for testing)
<AffiliateCTAButton
  href="https://example.com"
  variant="gradient"
  urgency="limited"
  size="lg"
>
  Start Free Trial
</AffiliateCTAButton>
```

### StickyCTA for Mobile

```tsx
import { StickyCTA } from '@/components/StickyCTA';

<StickyCTA
  toolName="Jasper AI"
  href="https://jasper.ai"
  price="From $49/mo"
  enableABTest={true}
  scrollThreshold={500}
  mobileOnly={true}
/>
```

---

For questions or suggestions, open an issue or reach out on Twitter [@FeynmanXu](https://twitter.com/FeynmanXu).
