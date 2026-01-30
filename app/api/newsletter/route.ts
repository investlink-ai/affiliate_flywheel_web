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

    // TODO: Integrate with your email service provider
    // Examples:
    // - Mailchimp: await mailchimp.lists.addListMember(...)
    // - ConvertKit: await fetch('https://api.convertkit.com/v3/forms/...')
    // - Resend: await resend.emails.send(...)
    
    // For now, log the subscription (replace with actual integration)
    console.log('[Newsletter] New subscription:', {
      email: normalizedEmail,
      toolPreference: toolPreference || 'none',
      timestamp: new Date().toISOString(),
      ip: request.headers.get('x-forwarded-for') || 'unknown',
    });

    // Simulate async operation
    await new Promise((resolve) => setTimeout(resolve, 100));

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
