import type { Metadata } from 'next';
import { playfairDisplay, cormorantUpright, dmSans } from '@/lib/fonts';
import '@/styles/globals.css';
import { constructMetadata } from '@/lib/seo';

export const metadata: Metadata = constructMetadata();

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
      <body className="bg-sand text-dusk min-h-screen font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
