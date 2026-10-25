/** Track one event after the requested amount of visible time. */
export function startEngagedTimer({ thresholdMs = 30000, track, doc = document, now = () => performance.now() }: {
  thresholdMs?: number;
  track: (event: string) => void;
  doc?: Document;
  now?: () => number;
}): () => void {
  let elapsed = 0;
  let started: number | null = null;
  let timer: ReturnType<typeof setTimeout> | undefined;
  let fired = false;
  let disposed = false;
  function pause() {
    if (started !== null) elapsed += Math.max(0, now() - started);
    started = null;
    clearTimeout(timer);
  }
  function resume() {
    if (fired || disposed || doc.visibilityState === 'hidden') return;
    started = now();
    timer = setTimeout(() => {
      pause();
      if (doc.visibilityState === 'hidden') return;
      if (elapsed < thresholdMs) { resume(); return; }
      fired = true;
      track('engaged_30s');
    }, Math.max(0, thresholdMs - elapsed));
  }
  function visibilityChanged() { pause(); resume(); }
  doc.addEventListener('visibilitychange', visibilityChanged);
  resume();
  return () => { disposed = true; pause(); doc.removeEventListener('visibilitychange', visibilityChanged); };
}
