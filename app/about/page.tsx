import type { Metadata } from 'next';
import Link from 'next/link';
import { DisclosureNote } from '@/components/DisclosureNote';
import { primaryAuthor } from '@/lib/author';

export const metadata: Metadata = {
  title: `About ${primaryAuthor.name} | LinkInvest`,
  description: `Meet ${primaryAuthor.name}, ${primaryAuthor.title}. ${primaryAuthor.bio.slice(0, 150)}...`,
  openGraph: {
    title: `About ${primaryAuthor.name} - ${primaryAuthor.title}`,
    description: primaryAuthor.bio,
  },
};

export default function AboutPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="border-b border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
            {/* Author Avatar */}
            <div className="flex h-24 w-24 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-accent-500 text-3xl font-bold text-white shadow-lg">
              {primaryAuthor.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
                  {primaryAuthor.name}
                </h1>
                <span className="inline-flex items-center gap-1 rounded-full bg-primary-100 px-3 py-1 text-sm font-medium text-primary-700 dark:bg-primary-900/30 dark:text-primary-400">
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Verified Expert
                </span>
              </div>
              <p className="mt-1 text-lg text-slate-600 dark:text-slate-400">
                {primaryAuthor.title} • {primaryAuthor.location}
              </p>
              <p className="mt-3 max-w-2xl text-slate-600 dark:text-slate-400">
                {primaryAuthor.bio}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Expertise & Credentials */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Expertise & Credentials</h2>
          
          {/* Expertise areas */}
          <div className="mt-6">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Areas of Expertise
            </h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {primaryAuthor.expertise.map((skill) => (
                <span
                  key={skill}
                  className="rounded-full bg-primary-100 px-4 py-1.5 text-sm font-medium text-primary-700 dark:bg-primary-900/30 dark:text-primary-400"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Credentials */}
          <div className="mt-8">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Credentials & Experience
            </h3>
            <ul className="mt-3 space-y-3">
              {primaryAuthor.credentials.map((credential, index) => (
                <li key={index} className="flex items-start gap-3">
                  <svg
                    className="mt-1 h-5 w-5 flex-shrink-0 text-green-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-slate-700 dark:text-slate-300">{credential}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* The Story */}
        <section className="mt-12">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">The Story</h2>
          <div className="mt-4 space-y-4 text-slate-600 dark:text-slate-400">
            <p>
              I started LinkInvest in 2024 after spending countless hours (and dollars) testing
              AI investment tools for my own trading and research. I was frustrated by reviews that were either
              thinly-veiled ads or written by people who clearly hadn&apos;t used the product beyond
              a free trial.
            </p>
            <p>
              With {primaryAuthor.experience} in fintech and AI, I knew I could do better.
              The AI investment tool landscape is noisy — new products launch daily, each claiming to
              revolutionize your workflow. But which ones actually deliver? That&apos;s what I set
              out to answer.
            </p>
            <p>
              Every tool reviewed here has been personally purchased and tested in real workflows.
              Not quick demos — actual projects, over weeks of use. I document what works, what
              doesn&apos;t, and who each tool is actually best for.
            </p>
          </div>
        </section>

        {/* Review Philosophy */}
        <section className="mt-12">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Review Philosophy</h2>
          <div className="mt-6 space-y-6">
            <div className="flex gap-4">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400">
                <span className="text-lg font-bold">1</span>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white">Hands-On Testing</h3>
                <p className="mt-1 text-slate-600 dark:text-slate-400">
                  I pay for subscriptions and use tools in real projects. No sponsored content, no
                  press release rewrites. Every review reflects genuine, extended usage.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400">
                <span className="text-lg font-bold">2</span>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white">Honest Opinions</h3>
                <p className="mt-1 text-slate-600 dark:text-slate-400">
                  Affiliate relationships never influence my recommendations. I&apos;ll happily
                  tell you when a tool isn&apos;t worth it — even if it has a great affiliate
                  program.
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
                  AI investment tools change fast. I revisit reviews when products have significant updates and
                  note the last update date on every review so you know the information is current.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Affiliate Disclosure */}
        <section className="mt-12">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Affiliate Disclosure</h2>
          <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-6 dark:border-amber-900/50 dark:bg-amber-950/20">
            <DisclosureNote variant="full" />
          </div>
          <div className="mt-4 space-y-4 text-slate-600 dark:text-slate-400">
            <p>
              Some links on this site are affiliate links. This means I may earn a small commission
              if you make a purchase through my link, at no extra cost to you.
            </p>
            <p>
              These commissions help support the site and allow me to continue testing and reviewing
              tools. However, they never influence my reviews. I recommend tools based solely on
              their merit, and I&apos;m upfront about limitations regardless of affiliate status.
            </p>
            <p>
              For full details, please read my{' '}
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
            <p>Have a question, suggestion, or tool you&apos;d like me to review?</p>
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
                  Follow @FeynmanXu
                </a>
              )}
              {primaryAuthor.socialProfiles.linkedin && (
                <a
                  href={primaryAuthor.socialProfiles.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary"
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                  LinkedIn
                </a>
              )}
              <a href="mailto:hello@linkinvest.com" className="btn-secondary">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                  />
                </svg>
                Email Me
              </a>
            </div>
          </div>
        </section>
      </article>
    </>
  );
}
