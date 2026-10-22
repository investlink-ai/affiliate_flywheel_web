import Link from 'next/link';
import { ToolCard } from '@/components/ToolCard';
import { SignupForm } from '@/components/SignupForm';
import { getFeaturedTools } from '@/lib/data';

export default function HomePage() {
  const featuredTools = getFeaturedTools(3);

  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-900">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8 lg:py-32">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-5xl lg:text-6xl">
              Best AI Investment Tools{' '}
              <span className="text-gradient">for Traders & Investors</span> 2026
            </h1>
            <p className="mt-6 text-lg leading-8 text-slate-600 dark:text-slate-400">
              Honest, in-depth reviews of AI investment tools that actually work. For individual
              investors, traders, and fintech professionals who want data-driven decisions.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/reviews" className="btn-primary w-full sm:w-auto">
                Browse All Reviews
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                  />
                </svg>
              </Link>
              <Link href="/comparisons" className="btn-secondary w-full sm:w-auto">
                Compare Tools
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Tools Section */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
              Featured Investment Tools
            </h2>
            <p className="mt-2 text-slate-600 dark:text-slate-400">
              Our top picks for trading, quantitative analysis, and portfolio management
            </p>
          </div>
          <Link
            href="/reviews"
            className="hidden text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 sm:block"
          >
            View all reviews →
          </Link>
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featuredTools.map((tool, index) => (
            <ToolCard 
              key={tool.slug} 
              tool={tool} 
              priority={index < 3} // Priority for above-fold featured tools
            />
          ))}
        </div>

        <div className="mt-8 text-center sm:hidden">
          <Link href="/reviews" className="text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400">
            View all reviews →
          </Link>
        </div>
      </section>

      {/* Categories Section */}
      <section className="border-y border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <h2 className="text-center text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
            Explore by Category
          </h2>
          <p className="mx-auto mt-2 max-w-2xl text-center text-slate-600 dark:text-slate-400">
            Find the perfect AI tool for your specific needs
          </p>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                name: 'AI Investment Signals',
                description: 'Trading signals and market analysis',
                icon: (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z"
                  />
                ),
                href: '/reviews?category=AI+Investment+Signals',
              },
              {
                name: 'Quantitative Platforms',
                description: 'Backtesting and algo trading',
                icon: (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 011.414-1.414L11.25 9l6.75-6.75"
                  />
                ),
                href: '/reviews?category=Quantitative+Platforms',
              },
              {
                name: 'Fintech Infrastructure',
                description: 'APIs and integrations',
                icon: (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244"
                  />
                ),
                href: '/reviews?category=Fintech+Infrastructure',
              },
              {
                name: 'Portfolio Management',
                description: 'Wealth and robo-advisors',
                icon: (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125"
                  />
                ),
                href: '/reviews?category=Portfolio+Management',
              },
            ].map((category) => (
              <Link
                key={category.name}
                href={category.href}
                className="group flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-5 transition-all hover:border-primary-300 hover:shadow-md dark:border-slate-700 dark:bg-slate-800 dark:hover:border-primary-600"
              >
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400">
                  <svg
                    className="h-7 w-7"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                  >
                    {category.icon}
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 group-hover:text-primary-600 dark:text-white dark:group-hover:text-primary-400">
                    {category.name}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{category.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why Trust Us Section */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
            Why Trust Our Reviews?
          </h2>
          <p className="mt-4 text-slate-600 dark:text-slate-400">
            Every tool on this site has been personally tested. I pay for subscriptions, use them in
            real workflows, and share what actually works (and what doesn&apos;t).
          </p>
        </div>

        <div className="mt-12 grid gap-8 sm:grid-cols-3">
          {[
            {
              title: 'Plain-English explanations',
              description: 'What each tool does, who it suits and where it falls short, without jargon or marketing claims.',
              icon: (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5"
                />
              ),
            },
            {
              title: 'Independent Reviews',
              description:
                "InvestLink isn't paid by any product it mentions and uses no referral links. Everything here is general information, not financial advice.",
              icon: (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                />
              ),
            },
            {
              title: 'Regular Updates',
              description: 'AI tools evolve fast. I update reviews when products change significantly.',
              icon: (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
                />
              ),
            },
          ].map((item) => (
            <div key={item.title} className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400">
                <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  {item.icon}
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-semibold text-slate-900 dark:text-white">{item.title}</h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Newsletter Signup Section */}
      <section className="border-t border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <div className="mx-auto max-w-2xl">
            <SignupForm
              location="homepage"
              variant="card"
              headline="Get Weekly AI Tool Insights"
              description="Get one practical lesson a week on investing tools. Free, confirm by email, unsubscribe anytime."
              ctaText="Subscribe Free"
            />
          </div>
        </div>
      </section>
    </>
  );
}
