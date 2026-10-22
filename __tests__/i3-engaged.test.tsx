import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { cleanup, render } from '@testing-library/react';
import { startEngagedTimer } from '@/lib/analytics/engaged';
import { EngagedTracker } from '@/components/EngagedTracker';

beforeEach(() => {
  vi.useFakeTimers();
  Object.defineProperty(document, 'visibilityState', { configurable: true, value: 'visible' });
});
afterEach(() => { cleanup(); vi.useRealTimers(); delete window.umami; });
const visibility = (value: string) => {
  Object.defineProperty(document, 'visibilityState', { configurable: true, value });
  document.dispatchEvent(new Event('visibilitychange'));
};
it('fires exactly once after 30 seconds visible', () => {
  const track = vi.fn();
  const stop = startEngagedTimer({ track });
  vi.advanceTimersByTime(29999);
  expect(track).not.toHaveBeenCalled();
  vi.advanceTimersByTime(1);
  expect(track).toHaveBeenCalledExactlyOnceWith('engaged_30s');
  visibility('hidden'); visibility('visible');
  vi.advanceTimersByTime(90000);
  expect(track).toHaveBeenCalledTimes(1);
  stop();
});
it('pauses while hidden and resumes accumulated visible time', () => {
  const track = vi.fn();
  const stop = startEngagedTimer({ track });
  vi.advanceTimersByTime(10000);
  visibility('hidden');
  vi.advanceTimersByTime(60000);
  expect(track).not.toHaveBeenCalled();
  visibility('visible');
  vi.advanceTimersByTime(19999);
  expect(track).not.toHaveBeenCalled();
  vi.advanceTimersByTime(1);
  expect(track).toHaveBeenCalledExactlyOnceWith('engaged_30s');
  stop();
});
it('starts hidden and cleanup prevents tracking', () => {
  visibility('hidden');
  const track = vi.fn();
  const stop = startEngagedTimer({ track, now: () => Date.now() });
  vi.advanceTimersByTime(60000);
  visibility('visible');
  vi.advanceTimersByTime(20000);
  stop();
  vi.advanceTimersByTime(60000);
  expect(track).not.toHaveBeenCalled();
});
it('does nothing when Umami is absent', () => {
  expect(() => {
    render(<EngagedTracker />);
    vi.advanceTimersByTime(60000);
  }).not.toThrow();
});
it('wires the event to window.umami', () => {
  window.umami = { track: vi.fn() };
  render(<EngagedTracker />);
  vi.advanceTimersByTime(30000);
  expect(window.umami.track).toHaveBeenCalledExactlyOnceWith('engaged_30s');
});
