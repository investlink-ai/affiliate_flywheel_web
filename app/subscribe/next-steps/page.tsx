import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Email confirmation next steps',
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
};

export default function SubscribeNextSteps() {
  return <article className="mx-auto max-w-3xl px-6 py-12"><h1 className="mb-4 text-3xl font-bold">Email confirmation next steps</h1><p>If Kit showed you a security check, finish it. Then check your inbox for a confirmation email from InvestLink and click the link. You&apos;re not subscribed until you do. Unconfirmed sign-ups don&apos;t get the checklist.</p></article>;
}
