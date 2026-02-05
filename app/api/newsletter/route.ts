import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Newsletter Subscription API Route
 * 
 * Handles newsletter signups with honeypot validation.
 * Rate limited by middleware (5 requests per IP per hour).
 * 
 * @example Request body:
 * ```json
 * {
 *   "email": "user@example.com",
 *   "toolPreference": "ai-writing",
 *   "honeypot": ""  // Must be empty (spam check)
 * }
 * ```
 */

interface NewsletterRequest {
  email: string;
  toolPreference?: string;
  honeypot?: string;
}

/**
 * Validate email format
 */
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * POST /api/newsletter
 * 
 * Subscribe to newsletter
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body: NewsletterRequest = await request.json();
    const { email, toolPreference, honeypot } = body;

    // Honeypot check - if filled, it's likely a bot
    if (honeypot) {
      // Return success to avoid alerting bots, but don't process
      console.warn('[Newsletter] Honeypot triggered, likely bot submission');
      return NextResponse.json(
        { success: true, message: 'Thank you for subscribing!' },
        { status: 200 }
      );
    }

    // Validate email
    if (!email || !isValidEmail(email)) {
      return NextResponse.json(
        { success: false, error: 'Please provide a valid email address' },
        { status: 400 }
      );
    }

    // Normalize email
    const normalizedEmail = email.toLowerCase().trim();

    // Kit API v4 integration — create subscriber, then add to form
    const apiKey = process.env.KIT_API_KEY;
    const formId = process.env.KIT_FORM_ID;
    const kitBase = 'https://api.kit.com/v4';

    if (apiKey && formId) {
      const headers = {
        'Content-Type': 'application/json',
        'X-Kit-Api-Key': apiKey,
      };
      try {
        // Step 1: Create or update subscriber (upsert)
        const createRes = await fetch(`${kitBase}/subscribers`, {
          method: 'POST',
          headers,
          body: JSON.stringify({
            email_address: normalizedEmail,
            state: 'active',
            ...(toolPreference && {
              fields: { tool_preference: toolPreference },
            }),
          }),
        });

        if (!createRes.ok) {
          const errBody = await createRes.text();
          console.error('[Newsletter] Kit create subscriber error:', createRes.status, errBody);
          return NextResponse.json(
            { success: false, error: 'Subscription failed. Please try again.' },
            { status: 502 }
          );
        }

        // Step 2: Add subscriber to form
        const referrer =
          request.headers.get('referer') ??
          process.env.NEXT_PUBLIC_SITE_URL ??
          'https://investlink.com';
        const addRes = await fetch(`${kitBase}/forms/${formId}/subscribers`, {
          method: 'POST',
          headers,
          body: JSON.stringify({
            email_address: normalizedEmail,
            referrer,
          }),
        });

        if (!addRes.ok) {
          const errBody = await addRes.text();
          console.error('[Newsletter] Kit add to form error:', addRes.status, errBody);
          return NextResponse.json(
            { success: false, error: 'Subscription failed. Please try again.' },
            { status: 502 }
          );
        }
      } catch (err) {
        console.error('[Newsletter] Kit request failed:', err);
        return NextResponse.json(
          { success: false, error: 'An error occurred. Please try again.' },
          { status: 502 }
        );
      }
    } else {
      // Log only when Kit is not configured (development)
      console.log('[Newsletter] New subscription (Kit not configured):', {
        email: normalizedEmail,
        toolPreference: toolPreference || 'none',
        timestamp: new Date().toISOString(),
      });
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Thank you for subscribing! Check your inbox for confirmation.',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[Newsletter] Error processing subscription:', error);

    // Handle JSON parse errors
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { success: false, error: 'Invalid request format' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'An error occurred. Please try again.' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/newsletter
 * 
 * Health check endpoint
 */
export async function GET(): Promise<NextResponse> {
  return NextResponse.json(
    {
      status: 'ok',
      rateLimit: {
        limit: 5,
        window: '1 hour',
        description: 'Maximum 5 signups per IP address per hour',
      },
    },
    { status: 200 }
  );
}
