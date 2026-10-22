export interface EmailProvider {
  id: 'kit' | 'mock';
  formAction: string;
  emailField: string;
  extraFields(pageUrl: string): Record<string, string>;
}

type ProviderEnv = { NEXT_PUBLIC_EMAIL_PROVIDER?: string; NEXT_PUBLIC_KIT_FORM_ID?: string };

export function getEmailProvider(env: ProviderEnv = {
  NEXT_PUBLIC_EMAIL_PROVIDER: process.env.NEXT_PUBLIC_EMAIL_PROVIDER,
  NEXT_PUBLIC_KIT_FORM_ID: process.env.NEXT_PUBLIC_KIT_FORM_ID,
}): EmailProvider {
  const id = env.NEXT_PUBLIC_KIT_FORM_ID;
  if (env.NEXT_PUBLIC_EMAIL_PROVIDER === 'kit' && id && /^[1-9]\d*$/.test(id)) {
    return {
      id: 'kit',
      formAction: `https://app.kit.com/forms/${id}/subscriptions`,
      emailField: 'email_address',
      // Explicit referrer preserves UTMs under strict-origin-when-cross-origin.
      // Kit attribution via this field is unverified until the R3 preview test.
      extraFields: (pageUrl) => ({ referrer: pageUrl }),
    };
  }
  return { id: 'mock', formAction: '#mock-kit-subscribe', emailField: 'email_address', extraFields: () => ({}) };
}
