'use client';

import { useEffect, useId, useState, type FormEvent } from 'react';
import Link from 'next/link';
import { getEmailProvider, type EmailProvider } from '@/lib/email/provider';

const defaultProvider = getEmailProvider();

export function OptInForm({ provider = defaultProvider, onMockSubmit }: {
  provider?: EmailProvider;
  onMockSubmit?: (email: string) => void;
}) {
  const id = useId();
  const [fields, setFields] = useState<Record<string, string>>({});
  const [message, setMessage] = useState('');
  useEffect(() => setFields(provider.extraFields(window.location.href)), [provider]);

  function submit(event: FormEvent<HTMLFormElement>) {
    const form = event.currentTarget;
    const data = new FormData(form);
    if (data.get('website')) {
      event.preventDefault();
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

  return (
    <form method="post" action={provider.formAction} onSubmit={submit} className="space-y-4">
      <label htmlFor={`${id}-email`} className="block font-medium">Email address</label>
      <input id={`${id}-email`} name={provider.emailField} type="email" required autoComplete="email" className="rounded border border-slate-400 p-3 text-slate-900" />
      {Object.entries(fields).map(([name, value]) => <input key={name} type="hidden" name={name} value={value} />)}
      <div hidden aria-hidden="true">
        <label htmlFor={`${id}-website`}>Leave this field empty</label>
        <input id={`${id}-website`} name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>
      <p>We&apos;ll email you a link to confirm. You get the checklist after you confirm.</p>
      <p>Read our <Link href="/privacy" className="underline">privacy policy</Link>.</p>
      <button type="submit" className="rounded bg-primary-600 px-4 py-3 text-white">Email me the checklist</button>
      <p role="status">{message}</p>
    </form>
  );
}
