'use client';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { startEngagedTimer } from '@/lib/analytics/engaged';
import { trackWorkedCheckView } from '@/lib/analytics';

declare global {
  interface Window { umami?: { track: (event: string) => void } }
}

export function EngagedTracker() {
  const pathname = usePathname();
  useEffect(() => startEngagedTimer({ track: event => window.umami?.track(event) }), [pathname]);
  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return;
    let targets: Element[] = [];
    const visible = new Set<Element>();
    let timer: ReturnType<typeof setTimeout> | undefined;
    let fired = false;
    let disposed = false;
    let interval = 0;
    function reset() {
      interval += 1;
      clearTimeout(timer);
      timer = undefined;
    }
    function update(entries: IntersectionObserverEntry[]) {
      for (const entry of entries) {
        if (!targets.includes(entry.target)) continue;
        if (entry.isIntersecting && entry.intersectionRect.width > 0 && entry.intersectionRect.height > 0) {
          visible.add(entry.target);
        } else {
          visible.delete(entry.target);
          reset();
        }
      }
      if (disposed || fired || document.visibilityState !== 'visible' ||
          targets.length !== 2 || visible.size !== 2 || timer !== undefined) return;
      const currentInterval = interval;
      timer = setTimeout(() => {
        // Drain already queued losses before deciding the interval completed.
        update(observer.takeRecords());
        if (interval !== currentInterval || timer === undefined || disposed || fired || visible.size !== 2 ||
            document.visibilityState !== 'visible' || targets.some(target => !target.isConnected)) return;
        fired = true;
        trackWorkedCheckView();
      }, 1000);
    }
    const observer = new IntersectionObserver(update);
    function bind() {
      const heading = document.querySelector('section[data-block="claim-checks"] > h2');
      const paragraph = heading?.nextElementSibling;
      // Paragraphs renders sibling p nodes. Never fall back to notes or the table.
      const next = heading && paragraph?.tagName === 'P' ? [heading, paragraph] : [];
      if (next.length === targets.length && next.every((node, i) => node === targets[i])) return;
      reset();
      visible.clear();
      observer.disconnect();
      targets = next;
      if (document.visibilityState === 'visible') targets.forEach(target => observer.observe(target));
    }
    const mutations = new MutationObserver(records => {
      // A removed/reinserted target also breaks continuity within one mutation batch.
      if (records.some(record => Array.from(record.removedNodes).some(node =>
        targets.some(target => node === target || node.contains(target))))) {
        reset();
        visible.clear();
        observer.disconnect();
        targets = [];
      }
      bind();
    });
    function visibilityChanged() {
      reset();
      visible.clear();
      observer.disconnect();
      if (document.visibilityState === 'visible') targets.forEach(target => observer.observe(target));
    }
    bind();
    mutations.observe(document.body, { childList: true, subtree: true });
    document.addEventListener('visibilitychange', visibilityChanged);
    return () => {
      disposed = true;
      reset();
      observer.disconnect();
      mutations.disconnect();
      document.removeEventListener('visibilitychange', visibilityChanged);
    };
  }, [pathname]);
  return null;
}
