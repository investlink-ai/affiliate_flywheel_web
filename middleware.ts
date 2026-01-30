import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Rate Limiting Middleware for Vercel Edge Runtime
 * 
 * Prevents abuse of newsletter signup and other form endpoints.
 * Uses in-memory storage which works for single-instance deployments.
 * 
 * For production at scale, replace with Upstash Redis:
 * @see https://upstash.com/docs/redis/sdks/ratelimit-ts/overview
 * 
 * @example Production with Upstash:
 * ```
 * import { Ratelimit } from '@upstash/ratelimit';
 * import { Redis } from '@upstash/redis';
 * 
 * const ratelimit = new Ratelimit({
 *   redis: Redis.fromEnv(),
 *   limiter: Ratelimit.slidingWindow(5, '1 h'),
 * });
 * ```
 */

// Rate limit configuration
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour in milliseconds
const MAX_REQUESTS_PER_WINDOW = 5;

// In-memory store for rate limiting
// Note: This resets on cold starts and doesn't share across instances
// For production, use Upstash Redis or Vercel KV
interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

/**
 * Clean up expired entries periodically to prevent memory leaks
 */
function cleanupExpiredEntries(): void {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (now > entry.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}

/**
 * Get client IP address from request headers
 * Handles various proxy configurations (Vercel, Cloudflare, etc.)
 */
function getClientIP(request: NextRequest): string {
  // Vercel's forwarded IP
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    // x-forwarded-for can contain multiple IPs, take the first one
    return forwardedFor.split(',')[0]?.trim() || 'unknown';
  }

  // Vercel's real IP header
  const realIP = request.headers.get('x-real-ip');
  if (realIP) {
    return realIP;
  }

  // Cloudflare's connecting IP
  const cfConnectingIP = request.headers.get('cf-connecting-ip');
  if (cfConnectingIP) {
    return cfConnectingIP;
  }

  return 'unknown';
}

/**
 * Check if request should be rate limited
 * Returns remaining requests and reset time
 */
function checkRateLimit(ip: string): {
  allowed: boolean;
  remaining: number;
  resetTime: number;
  retryAfter: number;
} {
  const now = Date.now();
  const key = `newsletter:${ip}`;

  // Clean up periodically (every 100 requests)
  if (rateLimitStore.size > 100) {
    cleanupExpiredEntries();
  }

  let entry = rateLimitStore.get(key);

  // If no entry or window expired, create new entry
  if (!entry || now > entry.resetTime) {
    entry = {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW_MS,
    };
    rateLimitStore.set(key, entry);

    return {
      allowed: true,
      remaining: MAX_REQUESTS_PER_WINDOW - 1,
      resetTime: entry.resetTime,
      retryAfter: 0,
    };
  }

  // Increment counter
  entry.count++;

  // Check if over limit
  if (entry.count > MAX_REQUESTS_PER_WINDOW) {
    const retryAfter = Math.ceil((entry.resetTime - now) / 1000);
    return {
      allowed: false,
      remaining: 0,
      resetTime: entry.resetTime,
      retryAfter,
    };
  }

  return {
    allowed: true,
    remaining: MAX_REQUESTS_PER_WINDOW - entry.count,
    resetTime: entry.resetTime,
    retryAfter: 0,
  };
}

/**
 * Create rate limit exceeded response
 */
function createRateLimitResponse(retryAfter: number): NextResponse {
  return new NextResponse(
    JSON.stringify({
      error: 'Too many requests',
      message: 'You have exceeded the rate limit for newsletter signups. Please try again later.',
      retryAfter,
    }),
    {
      status: 429,
      headers: {
        'Content-Type': 'application/json',
        'Retry-After': retryAfter.toString(),
        'X-RateLimit-Limit': MAX_REQUESTS_PER_WINDOW.toString(),
        'X-RateLimit-Remaining': '0',
      },
    }
  );
}

/**
 * Middleware function
 * Applies rate limiting to newsletter signup endpoints
 */
export function middleware(request: NextRequest): NextResponse | undefined {
  const { pathname } = request.nextUrl;
  const method = request.method;

  // Only rate limit POST requests to newsletter-related endpoints
  // Adjust these paths based on your actual API routes
  const rateLimitedPaths = [
    '/api/newsletter',
    '/api/subscribe',
    '/api/signup',
  ];

  const shouldRateLimit =
    method === 'POST' &&
    rateLimitedPaths.some((path) => pathname.startsWith(path));

  if (!shouldRateLimit) {
    return NextResponse.next();
  }

  const ip = getClientIP(request);
  const { allowed, remaining, resetTime, retryAfter } = checkRateLimit(ip);

  if (!allowed) {
    console.warn(`[Rate Limit] Blocked IP: ${ip}, Path: ${pathname}`);
    return createRateLimitResponse(retryAfter);
  }

  // Add rate limit headers to successful requests
  const response = NextResponse.next();
  response.headers.set('X-RateLimit-Limit', MAX_REQUESTS_PER_WINDOW.toString());
  response.headers.set('X-RateLimit-Remaining', remaining.toString());
  response.headers.set('X-RateLimit-Reset', resetTime.toString());

  return response;
}

/**
 * Configure which paths the middleware runs on
 * 
 * Using a matcher ensures middleware only runs on specific paths,
 * reducing overhead for other requests.
 */
export const config = {
  matcher: [
    // Match API routes that need rate limiting
    '/api/newsletter/:path*',
    '/api/subscribe/:path*',
    '/api/signup/:path*',
  ],
};
