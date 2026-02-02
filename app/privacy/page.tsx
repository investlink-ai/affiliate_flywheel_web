import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy & Disclosures',
  description:
    'Privacy policy, affiliate disclosures, and terms of service for AI Tool Reviews.',
};

export default function PrivacyPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="border-b border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            Privacy Policy & Disclosures
          </h1>
          <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
            Last updated: January 31, 2026
          </p>
        </div>
      </section>

      {/* Content */}
      <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="prose prose-slate max-w-none dark:prose-invert prose-headings:font-bold prose-h2:text-2xl prose-h3:text-xl prose-a:text-primary-600 dark:prose-a:text-primary-400">
          {/* Affiliate Disclosure */}
          <section id="disclosure">
            <h2>Affiliate Disclosure</h2>
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-6 not-prose dark:border-amber-900/50 dark:bg-amber-950/20">
              <p className="text-slate-700 dark:text-slate-300">
                <strong>This site contains affiliate links.</strong> I may earn a commission from
                qualifying purchases at no extra cost to you. All opinions are my own and based on
                genuine testing.
              </p>
            </div>
            <p className="mt-4">
              In accordance with the Federal Trade Commission&apos;s 16 CFR, Part 255: &quot;Guides
              Concerning the Use of Endorsements and Testimonials in Advertising,&quot; I want to be
              transparent about the commercial relationships that exist on this website.
            </p>
            <h3>What This Means</h3>
            <ul>
              <li>
                Some links on this site are &quot;affiliate links.&quot; This means if you click on
                the link and purchase the item, I may receive an affiliate commission.
              </li>
              <li>
                I only recommend products or services that I believe will add value to my readers.
              </li>
              <li>
                I am disclosing this in accordance with the Federal Trade Commission&apos;s 16 CFR,
                Part 255: &quot;Guides Concerning the Use of Endorsements and Testimonials in
                Advertising.&quot;
              </li>
            </ul>
            <h3>Compensation Disclosure</h3>
            <p>
              Affiliate commissions earned from this website help offset the costs of running the
              site, including hosting, domain registration, and the time spent creating and
              maintaining content. However, affiliate relationships never influence my reviews or
              recommendations. I am committed to providing honest, unbiased reviews regardless of
              any compensation received.
            </p>
          </section>

          {/* Privacy Policy */}
          <section className="mt-12">
            <h2>Privacy Policy</h2>
            <h3>Information Collection</h3>
            <p>
              This website does not directly collect personal information. However, third-party
              services used on this site may collect information as described below:
            </p>
            <ul>
              <li>
                <strong>Analytics (Google Analytics 4):</strong> We use Google Analytics 4 (GA4) to
                understand how visitors use our site—for example, which pages are viewed, how long
                visitors stay, and whether they click affiliate links or sign up for our newsletter.
                This helps us improve our content and recommendations. GA4 collects anonymized,
                aggregated data; we do not collect or store your email or other personal identifiers
                in our analytics.
              </li>
              <li>
                <strong>Affiliate Links:</strong> When you click an affiliate link, the destination
                site may use cookies to track that you came from this website. This is how they
                attribute sales to us for commission purposes. We have no control over their cookies
                or privacy practices.
              </li>
            </ul>

            <h3>Cookies</h3>
            <p>
              We use the following cookies and local storage on this site:
            </p>
            <ul>
              <li>
                <strong>ga_consent_region:</strong> A cookie that indicates whether you are in the
                EEA (European Economic Area) or UK. We use this to determine whether to show our
                cookie consent banner. This cookie does not identify you personally.
              </li>
              <li>
                <strong>Analytics cookies (Google):</strong> When you accept analytics cookies, Google
                Analytics may set cookies to measure traffic and engagement. These are only set after
                you choose &quot;Accept&quot; in our consent banner (see below).
              </li>
              <li>
                <strong>Local storage:</strong> We store your consent choice (Accept or Decline) in
                your browser&apos;s local storage so we remember your preference on future visits.
              </li>
            </ul>
            <p>
              Third-party sites you reach via affiliate links may set their own cookies when you
              visit them.
            </p>

            <h3>Consent & Your Choices</h3>
            <p>
              If you are in the EEA or UK (or if we cannot determine your region), you will see a
              cookie consent banner when you first visit. You can:
            </p>
            <ul>
              <li>
                <strong>Accept:</strong> We enable analytics cookies (Google Analytics). Your choice
                is saved so you won&apos;t see the banner again unless you clear your browser data.
              </li>
              <li>
                <strong>Decline:</strong> We do not set analytics cookies. Google may still receive
                limited, cookieless data for measurement purposes (e.g., conversion modelling) in
                accordance with their policies, but no personal data is stored in cookies.
              </li>
            </ul>
            <p>
              Outside the EEA/UK, we may load analytics by default. You can still control cookies
              via your browser settings or use a browser extension to block tracking.
            </p>

            <h3>Your Rights</h3>
            <p>
              You have the right to access, correct, or delete any personal data we may have about
              you. Since we don&apos;t directly collect personal information, you should contact the
              relevant third-party services directly for any data requests.
            </p>
          </section>

          {/* Terms */}
          <section id="terms" className="mt-12">
            <h2>Terms of Service</h2>
            <h3>Disclaimer</h3>
            <p>
              The information provided on this website is for general informational purposes only.
              All information is provided in good faith, however, we make no representation or
              warranty of any kind, express or implied, regarding the accuracy, adequacy, validity,
              reliability, or completeness of any information on the site.
            </p>

            <h3>Product Information</h3>
            <p>
              Product features, pricing, and availability mentioned in reviews may change at any
              time. We strive to keep our reviews updated, but always verify current information on
              the product&apos;s official website before making a purchase.
            </p>

            <h3>External Links</h3>
            <p>
              This site contains links to external websites. We have no control over the content
              and nature of these sites and are not responsible for their content or privacy
              practices.
            </p>

            <h3>Limitation of Liability</h3>
            <p>
              Under no circumstances shall we be liable for any direct, indirect, special,
              incidental, or consequential damages arising out of or in connection with your use of
              this website or the information provided herein.
            </p>
          </section>

          {/* Contact */}
          <section className="mt-12">
            <h2>Contact</h2>
            <p>
              If you have any questions about these policies, please contact me at{' '}
              <a href="mailto:hello@aitoolreviews.com">hello@aitoolreviews.com</a> or via{' '}
              <a
                href="https://twitter.com/FeynmanXu"
                target="_blank"
                rel="noopener noreferrer"
              >
                Twitter @FeynmanXu
              </a>
              .
            </p>
          </section>
        </div>
      </article>
    </>
  );
}
