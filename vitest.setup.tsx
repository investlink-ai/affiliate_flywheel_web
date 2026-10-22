/// <reference types="vitest/globals" />
import React from 'react';
import '@testing-library/jest-dom/vitest';

// ============================================================================
// Next.js Mocks
// ============================================================================

// Mock Next.js router
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
  useParams: () => ({}),
}));

// Mock Next.js Link component
vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: { children: React.ReactNode; href: string }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

// Mock Next.js Image component
vi.mock('next/image', () => ({
  default: ({ src, alt, ...props }: { src: string; alt: string }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} {...props} />
  ),
}));

// ============================================================================
// Browser API Mocks
// ============================================================================

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] ?? null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    }),
    get length() {
      return Object.keys(store).length;
    },
    key: vi.fn((index: number) => Object.keys(store)[index] ?? null),
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock matchMedia (for dark mode, reduced motion)
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock IntersectionObserver (for lazy loading, scroll detection)
const intersectionObserverMock = vi.fn(() => ({
  disconnect: vi.fn(),
  observe: vi.fn(),
  takeRecords: vi.fn(),
  unobserve: vi.fn(),
}));
vi.stubGlobal('IntersectionObserver', intersectionObserverMock);

// Mock ResizeObserver
const resizeObserverMock = vi.fn(() => ({
  disconnect: vi.fn(),
  observe: vi.fn(),
  unobserve: vi.fn(),
}));
vi.stubGlobal('ResizeObserver', resizeObserverMock);

// ============================================================================
// Analytics Mocks
// ============================================================================

// Mock Google Analytics gtag
const gtagMock = vi.fn();
Object.defineProperty(window, 'gtag', {
  value: gtagMock,
  writable: true,
});

Object.defineProperty(window, 'dataLayer', {
  value: [],
  writable: true,
});

// ============================================================================
// Test Utilities
// ============================================================================

// Clear mocks and localStorage between tests
beforeEach(() => {
  localStorageMock.clear();
  vi.clearAllMocks();
});

// ============================================================================
// Mock Data Factories (import in tests as needed)
// ============================================================================

export const createMockTool = (overrides = {}) => ({
  slug: 'test-tool',
  name: 'Test Tool',
  tagline: 'A tool for testing',
  description: 'This is a test tool description.',
  logoUrl: '/images/tools/test-logo.svg',
  rating: 4.5,
  ratingCount: 100,
  category: 'Quantitative Platforms',
  pricing: 'From $29/mo',
  pricingDetails: 'Free tier available. Pro at $29/mo.',
  websiteUrl: 'https://test-tool.com',
  features: ['Feature 1', 'Feature 2', 'Feature 3'],
  pros: ['Pro 1', 'Pro 2'],
  cons: ['Con 1', 'Con 2'],
  verdict: 'Great tool for testing purposes.',
  bestFor: 'Testers and developers',
  lastUpdated: '2026-01-15',
  lastVerified: '2026-01-28',
  ...overrides,
});
