import { attributionMode, kitCampaignFields, kitSourceFormAction, kitTagFields, TAG_LIST } from '@/lib/attribution/source-tags.mjs';

/** Hidden form fields as [name, value] pairs (names may repeat, e.g. tags[]). */
export type HiddenFields = Array<[string, string]>;

export interface EmailProvider {
  /**
   * kit: posts to the Kit hosted form. mock: offline stand-in that sends nothing
   * (dev/test, or a production build with the explicit test flag). off: signup is
   * not configured on a production build, so signup blocks are hidden.
   */
  id: 'kit' | 'mock' | 'off';
  formAction: string;
  emailField: string;
  actionForUrl?(pageUrl: string): string | null;
  /**
   * Hidden fields for a signup from pageUrl, or null when the signup must not be
   * submitted (a Kit tag ID it needs is not configured in lib/attribution/tag-list.mjs).
   */
  extraFields(pageUrl: string, defaultCampaign?: string): HiddenFields | null;
}

type ProviderEnv = {
  NODE_ENV?: string;
  /** Vercel sets this to 'production' on production deployments (P3-1: the test flag is ignored there). */
  VERCEL_ENV?: string;
  NEXT_PUBLIC_EMAIL_PROVIDER?: string;
  NEXT_PUBLIC_KIT_FORM_ID?: string;
  /** Vercel env name. next.config.mjs inlines it into the build (numeric form ID only; never the API key). */
  KIT_FORM_ID?: string;
  NEXT_PUBLIC_KIT_ATTRIBUTION?: string;
  /** Explicit test flag: '1' allows the offline mock on a non-Vercel-production build (local evidence builds only). */
  NEXT_PUBLIC_SIGNUP_TEST_MODE?: string;
};

const FORM_ID = /^[1-9]\d*$/;

/**
 * The page URL as sent to Kit in the hidden `referrer` field: origin + path plus
 * utm_* query params only. Other query params and the fragment are dropped so
 * nothing unrelated (or user-typed) in the URL reaches Kit. Kit still gets a full
 * absolute URL, so it can read the UTMs and the report can read the guide path.
 * Returns '' for an unparseable or non-http(s) URL.
 */
export function kitReferrer(pageUrl: string): string {
  let url: URL;
  try { url = new URL(pageUrl); } catch { return ''; }
  if (url.protocol !== 'https:' && url.protocol !== 'http:') return '';
  const utm = new URLSearchParams();
  for (const [key, value] of url.searchParams) if (key.toLowerCase().startsWith('utm_')) utm.append(key, value);
  const query = utm.toString();
  return `${url.origin}${url.pathname}${query ? `?${query}` : ''}`;
}

/** The Kit form ID to post to, from NEXT_PUBLIC_KIT_FORM_ID or KIT_FORM_ID, or null if neither is a valid ID. */
export function kitFormId(env: ProviderEnv): string | null {
  // Strict: no whitespace or other characters (next.config.mjs trims KIT_FORM_ID before inlining it).
  for (const id of [env.NEXT_PUBLIC_KIT_FORM_ID, env.KIT_FORM_ID]) {
    if (id && FORM_ID.test(id)) return id;
  }
  return null;
}

/**
 * Fail-safe provider choice:
 * - production build: the Kit hosted form whenever a Kit form ID is set (regardless
 *   of NEXT_PUBLIC_EMAIL_PROVIDER), or per-source Kit forms in form-per-source mode;
 *   otherwise 'off', unless the explicit test flag allows the mock. The flag is
 *   ignored when VERCEL_ENV=production, so a Vercel production deploy never shows it.
 * - dev/test: Kit only when NEXT_PUBLIC_EMAIL_PROVIDER=kit and a form ID is set;
 *   otherwise the mock.
 */
export function getEmailProvider(env: ProviderEnv = {
  NODE_ENV: process.env.NODE_ENV,
  NEXT_PUBLIC_EMAIL_PROVIDER: process.env.NEXT_PUBLIC_EMAIL_PROVIDER,
  NEXT_PUBLIC_KIT_FORM_ID: process.env.NEXT_PUBLIC_KIT_FORM_ID,
  KIT_FORM_ID: process.env.KIT_FORM_ID,
  NEXT_PUBLIC_KIT_ATTRIBUTION: process.env.NEXT_PUBLIC_KIT_ATTRIBUTION,
  NEXT_PUBLIC_SIGNUP_TEST_MODE: process.env.NEXT_PUBLIC_SIGNUP_TEST_MODE,
  VERCEL_ENV: process.env.VERCEL_ENV,
}, tagFields: ((pageUrl: string, defaultCampaign?: string) => HiddenFields | null) | undefined = undefined, list: typeof TAG_LIST = TAG_LIST): EmailProvider {
  const production = env.NODE_ENV === 'production';
  // Kit is used on every production build (no NEXT_PUBLIC_EMAIL_PROVIDER needed), and in
  // dev/test only when NEXT_PUBLIC_EMAIL_PROVIDER=kit.
  const kitWanted = production || env.NEXT_PUBLIC_EMAIL_PROVIDER === 'kit';
  const mode = attributionMode(env.NEXT_PUBLIC_KIT_ATTRIBUTION);
  if (kitWanted && mode !== 'hidden-tags') {
    // form-per-source (one Kit form per src-*), or an unknown mode (fails closed:
    // submit stays disabled with the "unavailable" message).
    const actionForUrl = (url: string) => mode === 'form-per-source' ? kitSourceFormAction(url, list) : null;
    return {
      id: 'kit', formAction: '#kit-unavailable', emailField: 'email_address', actionForUrl,
      extraFields: (url, defaultCampaign) => actionForUrl(url) ? [['referrer', kitReferrer(url)], ...kitCampaignFields(url, list, defaultCampaign)] : null,
    };
  }
  const id = kitFormId(env);
  if (kitWanted && id) {
    return {
      id: 'kit',
      formAction: `https://app.kit.com/forms/${id}/subscriptions`,
      emailField: 'email_address',
      // referrer: explicit page URL (origin + path + utm_* only, see kitReferrer) so Kit
      // can record UTMs (the HTTP Referer loses the query string under
      // strict-origin-when-cross-origin).
      // tags[]: Kit tag IDs for exactly one src-* and at most one cmp-* tag, applied
      // by the hosted form at subscribe time.
      // Both are UNVERIFIED against live Kit until the R1/R3 preview test.
      extraFields: (pageUrl, defaultCampaign) => {
        const tags = tagFields ? tagFields(pageUrl, defaultCampaign) : kitTagFields(pageUrl, list, defaultCampaign);
        return tags ? [['referrer', kitReferrer(pageUrl)], ...tags] : null;
      },
    };
  }
  // Production with nothing configured: hide signup. The test flag can re-enable the
  // offline mock for local evidence builds, but never on a Vercel production deployment.
  const testMode = env.NEXT_PUBLIC_SIGNUP_TEST_MODE === '1' && env.VERCEL_ENV !== 'production';
  if (production && !testMode) {
    return { id: 'off', formAction: '', emailField: 'email_address', extraFields: () => [] };
  }
  return { id: 'mock', formAction: '#mock-kit-subscribe', emailField: 'email_address', extraFields: () => [] };
}

/** False when signup is not configured on this build; callers hide their signup block. */
export function isSignupAvailable(provider: EmailProvider = getEmailProvider()): boolean {
  return provider.id !== 'off';
}

export const KIT_SUBMIT_NOTICE = "After you press the button you'll go to our email provider, Kit. It may ask you to complete a quick security check. You're only subscribed after you click the link in the confirmation email.";
