import type { Metadata, Viewport } from 'next';
import { cookies } from 'next/headers';
import { playfairDisplay, cormorantUpright, dmSans } from '@/lib/fonts';
import '@/styles/globals.css';
import { constructMetadata } from '@/lib/seo';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const rawLocale = cookieStore.get('NEXT_LOCALE')?.value || 'en';
  const locale = (['en', 'so', 'ar'].includes(rawLocale) ? rawLocale : 'en') as 'en' | 'so' | 'ar';
  const dir = locale === 'ar' ? 'rtl' : 'ltr';

  return (
    <html
      lang={locale}
      dir={dir}
      className={`${playfairDisplay.variable} ${cormorantUpright.variable} ${dmSans.variable}`}
    >
      <body className="bg-[#F9F6F0] text-[#1E1C1A] min-h-screen font-sans antialiased flex flex-col justify-between selection:bg-[#B85233]/20 selection:text-[#B85233]">
        <CartProvider>
          <CurrencyProvider>
            <Navbar currentLocale={locale} />
            <main className="flex-1 w-full">{children}</main>
            <Footer />
          </CurrencyProvider>
        </CartProvider>
      </body>
    </html>
  );
}
