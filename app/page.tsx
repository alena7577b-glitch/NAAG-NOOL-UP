import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  return (
    <div className="space-y-0 overflow-hidden bg-[#FAF8F5] text-[#1E1C1A]">
      {/* =========================================================================
          1. HERO SECTION (Full-bleed luxury panoramic experience)
      ========================================================================= */}
      <section className="relative w-full overflow-hidden bg-[#EFE8DC] min-h-[500px] sm:min-h-[560px] lg:min-h-[620px] xl:min-h-[660px] flex items-center border-b border-[#E5DFC0]/60 pt-20 pb-10 sm:pt-24 sm:pb-14 lg:pt-24 lg:pb-16">
        {/* Full-bleed background panoramic photography */}
        <div className="absolute inset-0 z-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/hero-landscape.png"
            alt="Naag Nool UP Hero Landscape with woman in terracotta scarf against dawn sky"
            className="w-full h-full object-cover object-[left_center] sm:object-[8%_center] lg:object-left"
          />
          {/* Subtle gradient scrim on the far right for pristine text legibility */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#FAF8F5]/25 hidden lg:block" />
        </div>

        {/* Hero Content Overlay (Anchored to the far right with generous breathing room) */}
        <div className="relative z-10 w-full max-w-[1440px] mx-auto px-6 sm:px-12 lg:px-16 xl:px-20 flex justify-end items-center">
          <div className="w-full max-w-xl lg:max-w-lg xl:max-w-xl ml-auto text-start">
            {/* Eyebrow */}
            <p className="font-sans text-xs sm:text-sm font-semibold uppercase tracking-[0.28em] text-[#A64426] mb-4 sm:mb-5">
              NAAG NOOL UP
            </p>

            {/* Majestic Headline */}
            <h1 className="font-playfair text-4xl sm:text-5xl lg:text-[3.5rem] xl:text-[3.75rem] font-normal text-[#1E1C1A] leading-[1.18] sm:leading-[1.16] tracking-tight mb-5 sm:mb-6">
              The time to be <br />
              <span className="font-cormorant italic text-[#A64426] font-normal">
                ALIVE
              </span>{' '}
              is now.
            </h1>

            {/* Refined Narrative with generous line height and spacing */}
            <p className="font-sans text-sm sm:text-base lg:text-[1.025rem] text-[#4A453E] leading-[1.75] sm:leading-[1.8] max-w-lg font-normal mb-8 sm:mb-10">
              Naag Nool UP is a universal women’s empowerment brand and movement, created to help women live with greater intention, confidence, self-worth and agency.
            </p>

            {/* Refined Luxury Buttons */}
            <div className="flex flex-wrap items-center gap-4 sm:gap-5">
              <Link
                href="/shop"
                className="btn-hero-primary"
              >
                <span>Shop the Journals</span>
                <ArrowRight className="w-4 h-4 rtl:rotate-180" />
              </Link>
              <Link
                href="/about"
                className="btn-hero-secondary"
              >
                Discover Naag Nool UP
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
