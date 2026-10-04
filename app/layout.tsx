import type { Metadata } from 'next';
import { playfairDisplay, cormorantUpright, dmSans } from '@/lib/fonts';
import '@/styles/globals.css';
import { constructMetadata } from '@/lib/seo';
import { Navbar } from '@/components/layout/Navbar';

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
      <body className="bg-[#F9F6F0] text-[#1E1C1A] min-h-screen font-sans antialiased flex flex-col justify-between selection:bg-[#B85233]/20 selection:text-[#B85233]">
        <Navbar />
        <main className="flex-1 w-full">{children}</main>
      </body>
    </html>
  );
}
