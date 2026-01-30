'use client';

import { useState, useEffect, useCallback } from 'react';

export interface ABTestVariant<T> {
  id: string;
  value: T;
  weight?: number; // Default: equal weight
}

export interface ABTestConfig<T> {
  /** Unique identifier for this test */
  testId: string;
  /** Available variants */
  variants: ABTestVariant<T>[];
  /** Whether to persist variant assignment in localStorage */
  persist?: boolean;
  /** Optional callback when variant is assigned */
  onAssignment?: (variantId: string, value: T) => void;
}

export interface ABTestResult<T> {
  /** The assigned variant ID */
  variantId: string;
  /** The variant value */
  value: T;
  /** Whether the test is ready (client-side hydrated) */
  isReady: boolean;
  /** Track a conversion event */
  trackConversion: (eventName?: string) => void;
}

/**
 * A/B Testing Hook
 * 
 * Assigns users to test variants with optional persistence.
 * Uses weighted random selection for variant assignment.
 * 
 * @example
 * ```tsx
 * const { value, variantId, trackConversion } = useABTest({
 *   testId: 'cta-button-color',
 *   variants: [
 *     { id: 'control', value: 'bg-primary-600' },
 *     { id: 'variant-a', value: 'bg-accent-500' },
 *   ],
 * });
 * 
 * // Use in component
 * <button className={value} onClick={() => trackConversion('click')}>
 *   Sign Up
 * </button>
 * ```
 */
export function useABTest<T>(config: ABTestConfig<T>): ABTestResult<T> {
  const { testId, variants, persist = true, onAssignment } = config;
  
  // Default to first variant for SSR
  const [variantId, setVariantId] = useState<string>(variants[0]?.id ?? '');
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || variants.length === 0) return;

    const storageKey = `ab_test_${testId}`;
    let assignedVariantId: string | null = null;

    // Check for persisted assignment
    if (persist) {
      assignedVariantId = localStorage.getItem(storageKey);
      
      // Validate the persisted variant still exists
      if (assignedVariantId && !variants.some((v) => v.id === assignedVariantId)) {
        assignedVariantId = null;
        localStorage.removeItem(storageKey);
      }
    }

    // Assign new variant if needed
    if (!assignedVariantId) {
      assignedVariantId = selectVariant(variants);
      
      if (persist) {
        localStorage.setItem(storageKey, assignedVariantId);
      }
    }

    setVariantId(assignedVariantId);
    setIsReady(true);

    // Trigger callback
    const variant = variants.find((v) => v.id === assignedVariantId);
    if (variant && onAssignment) {
      onAssignment(assignedVariantId, variant.value);
    }
  }, [testId, variants, persist, onAssignment]);

  const trackConversion = useCallback(
    (eventName: string = 'conversion') => {
      if (typeof window === 'undefined') return;

      // Log to console in development
      if (process.env.NODE_ENV === 'development') {
        console.log(`[A/B Test] ${testId} - ${variantId} - ${eventName}`);
      }

      // Integration point for analytics
      // Example: Send to your analytics service
      // analytics.track('ab_test_conversion', {
      //   testId,
      //   variantId,
      //   eventName,
      // });

      // Dispatch custom event for external tracking
      window.dispatchEvent(
        new CustomEvent('ab_test_conversion', {
          detail: { testId, variantId, eventName },
        })
      );
    },
    [testId, variantId]
  );

  const currentVariant = variants.find((v) => v.id === variantId) ?? variants[0];

  return {
    variantId,
    value: currentVariant?.value as T,
    isReady,
    trackConversion,
  };
}

/**
 * Select a variant using weighted random selection
 */
function selectVariant<T>(variants: ABTestVariant<T>[]): string {
  const totalWeight = variants.reduce((sum, v) => sum + (v.weight ?? 1), 0);
  let random = Math.random() * totalWeight;

  for (const variant of variants) {
    random -= variant.weight ?? 1;
    if (random <= 0) {
      return variant.id;
    }
  }

  return variants[0]?.id ?? '';
}

/**
 * Hook to check if user is in a specific variant
 */
export function useIsVariant(testId: string, variantId: string): boolean {
  const [isVariant, setIsVariant] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const stored = localStorage.getItem(`ab_test_${testId}`);
    setIsVariant(stored === variantId);
  }, [testId, variantId]);

  return isVariant;
}
