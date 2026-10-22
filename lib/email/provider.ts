export interface EmailProvider {
  /**
   * kit: posts to the Kit hosted form. mock: offline stand-in that sends nothing
   * (dev/test, or a production build with the explicit test flag). off: signup is
   * not configured on a production build, so signup blocks are hidden.
   */
  id: 'kit' | 'mock' | 'off';
  formAction: string;
  emailField: string;
  extraFields(pageUrl: string): Record<string, string>;
}

type ProviderEnv = {
  NODE_ENV?: string;
  NEXT_PUBLIC_EMAIL_PROVIDER?: string;
  NEXT_PUBLIC_KIT_FORM_ID?: string;
  /** Vercel env name. next.config.mjs inlines it into the build (numeric form ID only; never the API key). */
  KIT_FORM_ID?: string;
  /** Explicit test flag: '1' allows the offline mock on a production build (local evidence builds only). */
  NEXT_PUBLIC_SIGNUP_TEST_MODE?: string;
};

const FORM_ID = /^[1-9]\d*$/;

/** The Kit form ID to post to, from NEXT_PUBLIC_KIT_FORM_ID or KIT_FORM_ID, or null if neither is a valid ID. */
export function kitFormId(env: ProviderEnv): string | null {
  for (const v of [env.NEXT_PUBLIC_KIT_FORM_ID, env.KIT_FORM_ID]) {
    const id = v?.trim();
    if (id && FORM_ID.test(id)) return id;
  }
  return null;
}

/**
 * Fail-safe provider choice:
 * - production build: the Kit hosted form whenever a Kit form ID is set (regardless
 *   of NEXT_PUBLIC_EMAIL_PROVIDER); otherwise 'off', unless the explicit test flag
 *   allows the mock. The mock never runs on production without that flag.
 * - dev/test: Kit only when NEXT_PUBLIC_EMAIL_PROVIDER=kit and a form ID is set;
 *   otherwise the mock.
 */
export function getEmailProvider(env: ProviderEnv = {
  NODE_ENV: process.env.NODE_ENV,
  NEXT_PUBLIC_EMAIL_PROVIDER: process.env.NEXT_PUBLIC_EMAIL_PROVIDER,
  NEXT_PUBLIC_KIT_FORM_ID: process.env.NEXT_PUBLIC_KIT_FORM_ID,
  KIT_FORM_ID: process.env.KIT_FORM_ID,
  NEXT_PUBLIC_SIGNUP_TEST_MODE: process.env.NEXT_PUBLIC_SIGNUP_TEST_MODE,
}): EmailProvider {
  const id = kitFormId(env);
  const production = env.NODE_ENV === 'production';
  if (id && (production || env.NEXT_PUBLIC_EMAIL_PROVIDER === 'kit')) {
    return {
      id: 'kit',
      formAction: `https://app.kit.com/forms/${id}/subscriptions`,
      emailField: 'email_address',
      // Explicit referrer preserves UTMs under strict-origin-when-cross-origin.
      // Kit attribution via this field is unverified until the R3 preview test.
      extraFields: (pageUrl) => ({ referrer: pageUrl }),
    };
  }
  if (production && env.NEXT_PUBLIC_SIGNUP_TEST_MODE !== '1') {
    return { id: 'off', formAction: '', emailField: 'email_address', extraFields: () => ({}) };
  }
  return { id: 'mock', formAction: '#mock-kit-subscribe', emailField: 'email_address', extraFields: () => ({}) };
}

/** False when signup is not configured on this build; callers hide their signup block. */
export function isSignupAvailable(provider: EmailProvider = getEmailProvider()): boolean {
  return provider.id !== 'off';
}
