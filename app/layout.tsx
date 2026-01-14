import type { Metadata, Viewport } from 'next';
import { Plus_Jakarta_Sans, IBM_Plex_Sans_Arabic } from 'next/font/google';
import './globals.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { LanguageProvider } from './context/LanguageContext';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-primary',
  weight: ['400', '500', '600', '700', '800'],
});

const ibmPlexSansArabic = IBM_Plex_Sans_Arabic({
  subsets: ['arabic'],
  display: 'swap',
  variable: '--font-arabic',
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  // Updated to your new domain
  metadataBase: new URL('https://casasmart.sa'),
  title: {
    default: 'Casa Smart | Smart Home Solutions in Saudi Arabia',
    template: '%s | Casa Smart',
  },
  description:
    'Transform your home with premium smart home solutions. Expert installation of smart lighting, climate control, security systems, motorized curtains, and more across Saudi Arabia.',
  keywords: [
    'smart home',
    'home automation',
    'smart lighting',
    'climate control',
    'security systems',
    'motorized curtains',
    'Aqara',
    'Saudi Arabia',
    'Riyadh',
    'Jeddah',
    'smart home installation',
    'منزل ذكي',
    'أتمتة المنزل',
    'Casa Smart', // Added new brand keyword
  ],
  authors: [{ name: 'Casa Smart', url: 'https://casasmart.sa' }],
  creator: 'Casa Smart',
  publisher: 'Casa Smart',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    alternateLocale: 'ar_SA',
    url: 'https://casasmart.sa',
    siteName: 'Casa Smart',
    title: 'Casa Smart | Smart Home Solutions in Saudi Arabia',
    description:
      'Transform your home with premium smart home solutions. Expert installation of smart lighting, climate control, security systems, and more.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Casa Smart - Smart Home Solutions',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Casa Smart | Smart Home Solutions in Saudi Arabia',
    description:
      'Transform your home with premium smart home solutions. Expert installation across Saudi Arabia.',
    images: ['/og-image.jpg'],
    creator: '@casasmart_sa', // Updated handle placeholder
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
  icons: {
    icon: [
      { url: '/w.png', type: 'image/png' },
    ],
    apple: [{ url: '/w.png', sizes: '180x180' }],
  },
  manifest: '/manifest.json',
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#111827' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${plusJakartaSans.variable} ${ibmPlexSansArabic.variable}`}
      suppressHydrationWarning
    >
      <body className="font-sans antialiased">
        <LanguageProvider>
          {/* Skip to main content for accessibility */}
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-[var(--color-electric-blue)] focus:text-white focus:rounded-lg focus:outline-none"
          >
            Skip to main content
          </a>

          <Navbar />

          <main id="main-content">{children}</main>

          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}