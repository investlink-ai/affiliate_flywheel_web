'use client';

import { useEffect, useId, useState, type FormEvent } from 'react';
import Link from 'next/link';
import { trackChecklistClick } from '@/lib/analytics';
import { KIT_SUBMIT_NOTICE, getEmailProvider, type EmailProvider, type HiddenFields } from '@/lib/email/provider';

const defaultProvider = getEmailProvider();

export function OptInForm({ provider = defaultProvider, onMockSubmit, defaultCampaign }: {
  provider?: EmailProvider;
  defaultCampaign?: string;
  onMockSubmit?: (email: string) => void;
}) {
  const id = useId();
  const [action, setAction] = useState(provider.formAction);
  const [fields, setFields] = useState<HiddenFields | null | undefined>(undefined);
  const [message, setMessage] = useState('');
  const [honeypot, setHoneypot] = useState('');
  useEffect(() => {
    setAction(provider.actionForUrl?.(window.location.href) ?? provider.formAction);
    setFields(provider.extraFields(window.location.href, defaultCampaign));
  }, [provider, defaultCampaign]);

  function submit(event: FormEvent<HTMLFormElement>) {
    const form = event.currentTarget;
    const data = new FormData(form);
    if (honeypot) {
      event.preventDefault();
      return;
    }
    if (!fields) {
      event.preventDefault();
      setMessage("Signup isn't available right now, so nothing was sent.");
      return;
    }
    if (provider.id === 'mock') {
      event.preventDefault();
      if (!form.reportValidity()) return;
      const email = String(data.get(provider.emailField));
      setMessage(`Mock: confirmation email would be sent to ${email}`);
      onMockSubmit?.(email);
    }
  }

  // Signup isn't configured on this production build: render nothing.
  if (provider.id === 'off') return null;

  return (
    <form method="post" action={action} onSubmit={submit} className="space-y-4">
      <label htmlFor={`${id}-email`} className="block font-medium">Email address</label>
      <input id={`${id}-email`} name={provider.emailField} type="email" required autoComplete="email" className="rounded border border-slate-400 p-3 text-slate-900" />
      {(fields ?? []).map(([name, value], i) => <input key={`${name}-${i}`} type="hidden" name={name} value={value} />)}
      <div hidden aria-hidden="true">
        <label htmlFor={`${id}-website`}>Leave this field empty</label>
        {/* No `name`: the honeypot is never posted to Kit; only its state is checked. */}
        <input id={`${id}-website`} type="text" tabIndex={-1} autoComplete="off" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} />
      </div>
      <p>{provider.id === 'kit' ? KIT_SUBMIT_NOTICE : "We'll email you a link to confirm. You get the checklist after you confirm."}</p>
      <p>Read our <Link href="/privacy" className="underline">privacy policy</Link>.</p>
      <button type="submit" disabled={!fields} onClick={() => trackChecklistClick({ location: 'guide-opt-in', pagePath: window.location.pathname })} className="rounded bg-primary-600 px-4 py-3 text-white">Email me the checklist</button>
      <p role="status">{message}</p>
    </form>
  );
}
