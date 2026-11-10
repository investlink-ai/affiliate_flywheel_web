// Runnable behavioural coverage for Q648 (Vitest + jsdom).
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { EngagedTracker } from '@/components/EngagedTracker';
import { OptInForm } from '@/components/OptInForm';
import { Paragraphs } from '@/components/guide/RichText';
import { trackWaitlistFormEdit, trackWorkedCheckView } from '@/lib/analytics';

const route = vi.hoisted(() => ({ path: '/guides/one' }));
vi.mock('next/navigation', () => ({ usePathname: () => route.path }));
let observers: Observer[];
class Observer {
  targets = new Set<Element>();
  queued: IntersectionObserverEntry[] = [];
  constructor(private callback: (entries: IntersectionObserverEntry[]) => void) { observers.push(this); }
  observe = (target: Element) => { this.targets.add(target); };
  disconnect = () => { this.targets.clear(); this.queued = []; };
  takeRecords = () => { const entries = this.queued; this.queued = []; return entries; };
  entry(target: Element, visible: boolean) {
    return { target, isIntersecting: visible, intersectionRect: { width: visible ? 10 : 0, height: 10 } } as IntersectionObserverEntry;
  }
  show() { this.callback([...this.targets].map(target => this.entry(target, true))); }
  hide(target: Element) { this.callback([this.entry(target, false)]); }
}
const originalGtag = window.gtag;
beforeEach(() => {
  observers = [];
  route.path = '/guides/one';
  vi.useFakeTimers();
  vi.stubGlobal('IntersectionObserver', Observer);
  Object.defineProperty(document, 'visibilityState', { configurable: true, value: 'visible' });
  window.gtag = vi.fn();
});
afterEach(() => { cleanup(); vi.useRealTimers(); vi.unstubAllGlobals(); window.gtag = originalGtag; });
function Guide({ intro = ['First intro', 'Second intro'] }: { intro?: string[] }) {
  return <><EngagedTracker /><section data-block="claim-checks"><h2>3. The 5-claim check</h2>
    <Paragraphs items={intro} /><div><table><tbody><tr><td>Claim</td></tr></tbody></table></div>
    <p>Later notes must never qualify</p></section></>;
}
const calls = () => vi.mocked(window.gtag).mock.calls.filter(call => call[1] === 'worked_check_view');
const tick = (ms: number) => act(() => { vi.advanceTimersByTime(ms); });
function visibility(value: string) {
  Object.defineProperty(document, 'visibilityState', { configurable: true, value });
  act(() => { document.dispatchEvent(new Event('visibilitychange')); });
}
it('observes only the heading and first rendered intro, and fires once at 1000ms', () => {
  render(<Guide />);
  const observer = observers[0]!;
  expect([...observer.targets]).toEqual([screen.getByRole('heading'), screen.getByText('First intro')]);
  observer.show(); tick(999); expect(calls()).toHaveLength(0);
  tick(1); expect(calls()).toHaveLength(1);
  observer.show(); tick(5000); expect(calls()).toHaveLength(1);
});
it('requires simultaneous continuous exposure and discards separate intervals', () => {
  render(<Guide />);
  const observer = observers[0]!;
  observer.show(); tick(600);
  observer.hide(screen.getByText('First intro')); tick(600);
  expect(calls()).toHaveLength(0);
  observer.show(); tick(999); expect(calls()).toHaveLength(0);
  tick(1); expect(calls()).toHaveLength(1);
});
it('does not qualify either target alone and resets when the heading leaves', () => {
  render(<Guide />);
  const observer = observers[0]!;
  observer.show(); observer.hide(screen.getByText('First intro'));
  tick(1500); expect(calls()).toHaveLength(0);
  observer.show(); tick(600); observer.hide(screen.getByRole('heading'));
  tick(1500); expect(calls()).toHaveLength(0);
  observer.show(); tick(999); expect(calls()).toHaveLength(0);
  tick(1); expect(calls()).toHaveLength(1);
});
it('drains queued loss/re-entry without firing the old interval', () => {
  render(<Guide />);
  const observer = observers[0]!;
  observer.show(); tick(999);
  const heading = screen.getByRole('heading');
  observer.queued = [observer.entry(heading, false), observer.entry(heading, true)];
  tick(1); expect(calls()).toHaveLength(0);
  tick(999); expect(calls()).toHaveLength(0);
  tick(1); expect(calls()).toHaveLength(1);
});
it('resets on hidden pages and requires fresh observations when visible again', () => {
  render(<Guide />);
  const observer = observers[0]!;
  observer.show(); tick(600); visibility('hidden'); tick(5000);
  visibility('visible'); tick(1000); expect(calls()).toHaveLength(0);
  observer.show(); tick(999); expect(calls()).toHaveLength(0);
  tick(1); expect(calls()).toHaveLength(1);
});
it('does not fall back to table or notes when the intro is absent', () => {
  render(<Guide intro={[]} />);
  expect(observers[0]!.targets.size).toBe(0);
  observers[0]!.show(); tick(5000); expect(calls()).toHaveLength(0);
});
it('binds late mounted content and cancels exposure when it is removed', async () => {
  const view = render(<EngagedTracker />);
  const section = document.createElement('section');
  section.dataset.block = 'claim-checks';
  section.innerHTML = '<h2>3. The 5-claim check</h2><p>Intro</p>';
  await act(async () => { document.body.append(section); });
  expect(observers[0]!.targets.size).toBe(2);
  observers[0]!.show(); tick(600);
  await act(async () => { section.remove(); });
  tick(1000); expect(calls()).toHaveLength(0);
  view.unmount();
});
it('cancels the route interval and unmount interval', () => {
  const view = render(<Guide />);
  observers[0]!.show(); tick(600);
  route.path = '/guides/two'; view.rerender(<Guide />);
  tick(1000); expect(calls()).toHaveLength(0);
  observers[1]!.show(); tick(600); view.unmount();
  tick(1000); expect(calls()).toHaveLength(0);
});
it('sends only fixed event identities/category and tolerates absent GA', () => {
  trackWorkedCheckView(); trackWaitlistFormEdit();
  expect(vi.mocked(window.gtag).mock.calls).toEqual([
    ['event', 'worked_check_view', { event_category: 'Engagement', event_label: undefined, value: undefined }],
    ['event', 'waitlist_form_edit', { event_category: 'Engagement', event_label: undefined, value: undefined }],
  ]);
  (window as unknown as { gtag: unknown }).gtag = undefined;
  expect(() => { trackWorkedCheckView(); trackWaitlistFormEdit(); }).not.toThrow();
});
it('excludes focus, clicks, hidden fields, honeypot, submit and untrusted input', () => {
  const provider = { id: 'mock' as const, formAction: '#mock', emailField: 'email_address', extraFields: () => [['source', 'fixed']] as Array<[string, string]> };
  const view = render(<OptInForm location="guide-opt-in" provider={provider} />);
  const email = screen.getByLabelText('Email address');
  fireEvent.focus(email); fireEvent.click(email);
  fireEvent.input(email, { target: { value: 'fixture@example.com' } });
  fireEvent.input(view.container.querySelector('input[type="hidden"]')!);
  fireEvent.change(screen.getByLabelText('Leave this field empty'), { target: { value: 'bot' } });
  fireEvent.click(screen.getByRole('button', { name: 'Email me the checklist' }));
  fireEvent.submit(view.container.querySelector('form')!);
  expect(vi.mocked(window.gtag).mock.calls.filter(call => call[1] === 'waitlist_form_edit')).toHaveLength(0);
  // Q-273: a filled honeypot is a spam-trap click and must not send checklist_click.
  expect(vi.mocked(window.gtag).mock.calls.filter(call => call[1] === 'checklist_click')).toHaveLength(0);
});
// Needs a real-browser trusted click and keyboard input (Playwright).
// Script-dispatched events are never trusted, even in a real browser; the
// fireEvent steps below must be replaced with browser actions when porting this
// scenario. Keep it skipped in jsdom and preserve OptInForm's isTrusted gate.
it.skip('emits waitlist_form_edit once for trusted edits to the visible email field', () => {
  const provider = { id: 'mock' as const, formAction: '#mock', emailField: 'email_address', extraFields: () => [] };
  render(<OptInForm location="guide-opt-in" provider={provider} />);
  const email = screen.getByLabelText('Email address');
  fireEvent.click(email);
  fireEvent.input(email, { target: { value: 'fixture@example.com' } });
  expect(vi.mocked(window.gtag).mock.calls.filter(call => call[1] === 'waitlist_form_edit')).toHaveLength(1);
  fireEvent.input(email, { target: { value: 'edited@example.com' } });
  expect(vi.mocked(window.gtag).mock.calls.filter(call => call[1] === 'waitlist_form_edit')).toHaveLength(1);
});
