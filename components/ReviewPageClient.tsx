'use client';

import dynamic from 'next/dynamic';
import type { Tool } from '@/lib/data';

// Dynamic imports with ssr: false (allowed in client components)
const StickyCTA = dynamic(
  () => import('./StickyCTA').then((mod) => mod.StickyCTA),
  { ssr: false }
);

const SidebarStickyCTA = dynamic(
  () => import('./StickyCTA').then((mod) => mod.SidebarStickyCTA),
  { ssr: false }
);

interface ReviewPageCTAsProps {
  tool: Tool;
}

/**
 * Client-side CTAs for review pages
 * Handles dynamic imports with ssr: false
 */
export function ReviewPageCTAs({ tool }: ReviewPageCTAsProps) {
  return (
    <>
      {/* Mobile Sticky CTA */}
      <StickyCTA
        toolName={tool.name}
        href={tool.affiliateUrl}
        price={tool.pricing}
        enableABTest={true}
        scrollThreshold={500}
        mobileOnly={true}
      />
    </>
  );
}

/**
 * Desktop sidebar sticky CTA wrapper
 */
export function ReviewSidebarCTA({ tool }: ReviewPageCTAsProps) {
  return (
    <SidebarStickyCTA
      toolName={tool.name}
      href={tool.affiliateUrl}
      price={tool.pricing}
      enableABTest={true}
    />
  );
}
