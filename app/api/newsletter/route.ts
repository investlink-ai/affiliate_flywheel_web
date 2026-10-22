import { NextResponse } from 'next/server';

/**
 * Retired newsletter endpoint.
 *
 * Signup forms post straight to the Kit hosted form (double opt-in, UTM
 * attribution via the hidden `referrer` field). This route used to create Kit
 * subscribers by API with state "active", which skipped confirmation and lost
 * attribution. It now answers 410 Gone and never calls Kit.
 */
const GONE = {
  success: false,
  error: 'This endpoint has been retired. Please use the signup form on the page.',
};

export function POST(): NextResponse {
  return NextResponse.json(GONE, { status: 410 });
}

export function GET(): NextResponse {
  return NextResponse.json(GONE, { status: 410 });
}
