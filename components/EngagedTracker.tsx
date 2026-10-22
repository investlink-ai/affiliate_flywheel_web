'use client';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { startEngagedTimer } from '@/lib/analytics/engaged';

declare global {
  interface Window { umami?: { track: (event: string) => void } }
}

export function EngagedTracker() {
  const pathname = usePathname();
  useEffect(() => startEngagedTimer({ track: event => window.umami?.track(event) }), [pathname]);
  return null;
}
