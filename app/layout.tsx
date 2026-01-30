import type { Metadata, Viewport } from 'next';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { GoogleAnalytics } from '@/components/GoogleAnalytics';
import { ExitIntentPopup } from '@/components/ExitIntentPopup';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://aitoolreviews.com'),
  title: {
    default: 'AI Tool Reviews | Best AI Tools for Productivity & Content Creation 2026',
    template: '%s | AI Tool Reviews',
  },
  description:
    'Honest, in-depth reviews of the best AI tools for productivity, content creation, and marketing. Tested by real creators for creators.',
  keywords: [
    'AI tools',
    'AI writing tools',
    'AI productivity',
    'content creation',
    'Jasper AI',
    'Copy.ai',
    'AI voice',
    'AI marketing tools',
  ],
  authors: [{ name: 'Sam Xu', url: 'https://aitoolreviews.com/about' }],
  creator: 'Sam Xu',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'AI Tool Reviews',
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://aitoolreviews.com',
    siteName: 'AI Tool Reviews',
    title: 'AI Tool Reviews | Best AI Tools for Productivity & Content Creation 2026',
    description:
      'Honest, in-depth reviews of the best AI tools for productivity, content creation, and marketing.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'AI Tool Reviews - Best AI Tools for 2026',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Tool Reviews | Best AI Tools 2026',
    description: 'Honest, in-depth reviews of the best AI tools for productivity and content creation.',
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
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
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
        
        {/* Exit Intent Popup - Newsletter capture */}
        <ExitIntentPopup />
      </body>
    </html>
  );
}
