'use client';

import { useUserType } from '@/lib/hooks';
import { useABTest } from '@/lib/hooks';
import { ToolCard } from './ToolCard';
import type { Tool } from '@/lib/data';

interface ToolCardPersonalizedProps {
  tool: Tool;
  /** Enable A/B testing for CTA button */
  enableABTest?: boolean;
  /** Priority loading for above-fold images (LCP optimization) */
  priority?: boolean;
}

/**
 * Client-side wrapper for ToolCard with personalization
 * 
 * Reads user type from localStorage/URL and applies personalization.
 * Also supports A/B testing for CTA button styling.
 */
export function ToolCardPersonalized({ tool, enableABTest = false, priority = false }: ToolCardPersonalizedProps) {
  const { userType, isReady: userTypeReady } = useUserType();
  
  // A/B test for CTA button styling (only if enabled)
  const { value: ctaVariant, isReady: abTestReady } = useABTest({
    testId: 'tool-card-cta-style',
    variants: [
      { id: 'control', value: 'default' as const, weight: 50 },
      { id: 'accent', value: 'accent' as const, weight: 25 },
      { id: 'gradient', value: 'gradient' as const, weight: 25 },
    ],
    persist: true,
  });

  // Show base card while hydrating to prevent layout shift
  if (!userTypeReady) {
    return <ToolCard tool={tool} showPersonalization={false} priority={priority} />;
  }

  return (
    <ToolCard
      tool={tool}
      userType={userType}
      showPersonalization={true}
      ctaVariant={enableABTest && abTestReady ? ctaVariant : 'default'}
      priority={priority}
    />
  );
}
