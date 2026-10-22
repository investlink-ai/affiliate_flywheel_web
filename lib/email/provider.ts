import { kitTagFields } from '@/lib/attribution/source-tags.mjs';

/** Hidden form fields as [name, value] pairs (names may repeat, e.g. tags[]). */
export type HiddenFields = Array<[string, string]>;

export interface EmailProvider {
  id: 'kit' | 'mock';
  formAction: string;
  emailField: string;
  /**
   * Hidden fields for a signup from pageUrl, or null when the signup must not be
   * submitted (a Kit tag ID it needs is not configured in lib/attribution/tag-list.mjs).
   */
  extraFields(pageUrl: string): HiddenFields | null;
}

type ProviderEnv = { NEXT_PUBLIC_EMAIL_PROVIDER?: string; NEXT_PUBLIC_KIT_FORM_ID?: string };

export function getEmailProvider(env: ProviderEnv = {
  NEXT_PUBLIC_EMAIL_PROVIDER: process.env.NEXT_PUBLIC_EMAIL_PROVIDER,
  NEXT_PUBLIC_KIT_FORM_ID: process.env.NEXT_PUBLIC_KIT_FORM_ID,
}, tagFields: (pageUrl: string) => HiddenFields | null = kitTagFields): EmailProvider {
  const id = env.NEXT_PUBLIC_KIT_FORM_ID;
  if (env.NEXT_PUBLIC_EMAIL_PROVIDER === 'kit' && id && /^[1-9]\d*$/.test(id)) {
    return {
      id: 'kit',
      formAction: `https://app.kit.com/forms/${id}/subscriptions`,
      emailField: 'email_address',
      // referrer: explicit full page URL so Kit can record UTMs (the HTTP Referer
      // loses the query string under strict-origin-when-cross-origin).
      // tags[]: Kit tag IDs for exactly one src-* and at most one cmp-* tag, applied
      // by the hosted form at subscribe time.
      // Both are UNVERIFIED against live Kit until the R1/R3 preview test.
      extraFields: (pageUrl) => {
        const tags = tagFields(pageUrl);
        return tags ? [['referrer', pageUrl], ...tags] : null;
      },
    };
  }
  return { id: 'mock', formAction: '#mock-kit-subscribe', emailField: 'email_address', extraFields: () => [] };
}
