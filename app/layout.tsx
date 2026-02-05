import type { Metadata, Viewport } from 'next';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { GoogleAnalytics } from '@/components/GoogleAnalytics';
import { ConsentBanner } from '@/components/ConsentBanner';
import { ExitIntentPopup } from '@/components/ExitIntentPopup';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://investlink.com'),
  title: {
    default: 'InvestLink | AI Investment Tool Reviews 2026',
    template: '%s | InvestLink',
  },
  description:
    'Honest, in-depth reviews of the best AI investment tools for traders and investors. Data-driven comparisons of quantitative platforms, robo-advisors, and fintech tools.',
  keywords: [
    'AI investment tools',
    'quantitative platforms',
    'robo-advisors',
    'fintech tools',
    'trading platforms',
    'portfolio management',
    'QuantConnect',
    'TradingView',
  ],
  authors: [{ name: 'Sam Xu', url: 'https://investlink.com/about' }],
  creator: 'Sam Xu',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'InvestLink',
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://investlink.com',
    siteName: 'InvestLink',
    title: 'InvestLink | AI Investment Tool Reviews 2026',
    description:
      'Honest, in-depth reviews of the best AI investment tools for traders and investors.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'InvestLink - AI Investment Tool Reviews 2026',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'InvestLink | AI Investment Tool Reviews 2026',
    description: 'Honest, in-depth reviews of the best AI investment tools for traders and investors.',
    creator: '@FeynmanXu',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0f172a' },
  ],
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/icon.svg" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
      </head>
      <body className="flex min-h-screen flex-col">
        {/* Skip to content link for accessibility */}
        <a href="#main-content" className="skip-to-content">
          Skip to main content
        </a>
        
        {/* Google Analytics 4 */}
        <GoogleAnalytics />
        
        <Header />
        <main id="main-content" className="flex-1">{children}</main>
        <Footer />

        {/* Cookie consent (EEA); GA4 Consent Mode */}
        <ConsentBanner />

        {/* Exit Intent Popup - Newsletter capture */}
        <ExitIntentPopup />
      </body>
    </html>
  );
}
