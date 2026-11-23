import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import { playfairDisplay, cormorantUpright, dmSans } from '@/lib/fonts';
import '@/styles/globals.css';
import { constructMetadata } from '@/lib/seo';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { TopAnnouncementRibbon } from '@/components/banners/TopAnnouncementRibbon';
import { CartProvider } from '@/lib/cart/CartContext';
import { CurrencyProvider } from '@/lib/currency/context';

export const metadata: Metadata = constructMetadata();

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#F9F6F0' },
    { media: '(prefers-color-scheme: dark)', color: '#1E1C12' },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      dir="ltr"
      className={`${playfairDisplay.variable} ${cormorantUpright.variable} ${dmSans.variable}`}
    >
      <head>
        {/* Google Tag (GA4 / GTM: GTM-TTP2MHXH) */}
        <Script
          async
          src="https://www.googletagmanager.com/gtm.js?id=GTM-TTP2MHXH"
          strategy="afterInteractive"
        />
        <Script id="google-analytics-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
          `}
        </Script>
      </head>
      <body className="bg-[#F9F6F0] text-[#1E1C1A] min-h-screen font-sans antialiased flex flex-col justify-between selection:bg-[#B85233]/20 selection:text-[#B85233]">
        <CartProvider>
          <CurrencyProvider>
            <TopAnnouncementRibbon />
            <Navbar />
            <main className="flex-1 w-full">{children}</main>
            <Footer />
          </CurrencyProvider>
        </CartProvider>
      </body>
    </html>
  );
}
