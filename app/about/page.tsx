import type { Metadata } from 'next';
import Link from 'next/link';
import { DisclosureNote } from '@/components/DisclosureNote';
import { primaryAuthor } from '@/lib/author';

export const metadata: Metadata = {
  title: `About ${primaryAuthor.name} | InvestLink`,
  description: primaryAuthor.description,
  openGraph: {
    title: `About ${primaryAuthor.name}`,
    description: primaryAuthor.description,
  },
};

export default function AboutPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="border-b border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
                About InvestLink
              </h1>
              <p className="mt-3 max-w-2xl text-slate-600 dark:text-slate-400">
                {primaryAuthor.description}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Review Philosophy */}
        <section className="mt-12">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Review Philosophy</h2>
          <div className="mt-6 space-y-6">
            <div className="flex gap-4">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400">
                <span className="text-lg font-bold">1</span>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white">Plain-English explanations</h3>
                <p className="mt-1 text-slate-600 dark:text-slate-400">
                  {"What each tool does, who it suits and where it falls short, without jargon or marketing claims."}
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400">
                <span className="text-lg font-bold">2</span>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white">Strengths and limits</h3>
                <p className="mt-1 text-slate-600 dark:text-slate-400">
                  We describe what each tool does well and explain its limitations.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400">
                <span className="text-lg font-bold">3</span>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white">Regular Updates</h3>
                <p className="mt-1 text-slate-600 dark:text-slate-400">
                  AI investment tools change fast. We revisit reviews when products have significant updates and
                  note the last update date on every review so you know the information is current.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Disclosures */}
        <section className="mt-12">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Disclosures</h2>
          <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-6 dark:border-amber-900/50 dark:bg-amber-950/20">
            <DisclosureNote variant="full" />
          </div>
          <div className="mt-4 space-y-4 text-slate-600 dark:text-slate-400">
            <p>
              For full details, please read our{' '}
              <Link href="/privacy" className="text-primary-600 hover:underline dark:text-primary-400">
                Privacy Policy & Disclosures
              </Link>
              .
            </p>
          </div>
        </section>

        {/* Contact */}
        <section className="mt-12">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Get in Touch</h2>
          <div className="mt-4 space-y-4 text-slate-600 dark:text-slate-400">
            <p>Have a question, suggestion, or tool you&apos;d like us to review?</p>
            <div className="flex flex-wrap gap-4">
              {primaryAuthor.socialProfiles.twitter && (
                <a
                  href={primaryAuthor.socialProfiles.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary"
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                  Follow @investlink_ai
                </a>
              )}
            </div>
          </div>
        </section>
      </article>
    </>
  );
}
