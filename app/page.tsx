import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { TypographyTransition } from '@/components/home/TypographyTransition';
import { MovementSection } from '@/components/home/MovementSection';
import { JournalsShowcase } from '@/components/home/JournalsShowcase';
import { WhyJournalingSection } from '@/components/home/WhyJournalingSection';
import { AyeyoKorisSection } from '@/components/home/AyeyoKorisSection';
import { CommunitySection } from '@/components/home/CommunitySection';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  return (
    <div className="w-full bg-[#FAF6F0] text-[#1E1C1A]">
      {/* =========================================================================
          1. EXISTING HERO SECTION (Untouched)
      ========================================================================= */}
      <section className="relative w-full overflow-hidden bg-[#FAF6F0] min-h-[520px] sm:min-h-[560px] lg:min-h-[620px] xl:min-h-[660px] flex items-center border-b border-[#E5DFC0]/60 pt-20 pb-12 sm:pt-24 sm:pb-14 lg:pt-24 lg:pb-16">
        {/* Full-bleed background panoramic photography */}
        <div className="absolute inset-0 z-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/hero-landscape.png"
            alt="Naag Nool UP Hero Landscape with woman in terracotta scarf against dawn sky"
            className="w-full h-full object-cover object-[right_top] sm:object-[12%_center] lg:object-left"
          />
          {/* Mobile-first atmospheric protection scrim: lets the woman's face and sky show at the top while providing a clean, warm parchment canvas over the fabric folds for pristine typography readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#FAF6F0] via-[#FAF6F0]/85 via-55% to-[#FAF6F0]/20 lg:hidden pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#FAF6F0]/90 via-[#FAF6F0]/70 via-60% to-transparent lg:hidden pointer-events-none" />

          {/* Subtle gradient scrim on the far right for pristine text legibility on desktop */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#FAF8F5]/35 hidden lg:block pointer-events-none" />
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
              <span className="font-cormorant italic text-[#A64426] font-medium">
                ALIVE
              </span>{' '}
              is now.
            </h1>

            {/* Refined Narrative with generous line height and spacing */}
            <p className="font-sans text-sm sm:text-base lg:text-[1.025rem] text-[#2C2723] leading-[1.75] sm:leading-[1.8] max-w-lg font-normal mb-8 sm:mb-10">
              Naag Nool UP is a universal women’s empowerment brand and movement, created to help women live with greater intention, confidence, self-worth and agency.
            </p>

            {/* Refined Luxury Buttons (Stacked on mobile for ergonomic thumb tapping, inline on tablet/desktop) */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 sm:gap-5">
              <Link
                href="/shop"
                className="btn-hero-primary justify-center w-full sm:w-auto"
              >
                <span>Shop the Journals</span>
                <ArrowRight className="w-4 h-4 rtl:rotate-180 shrink-0" />
              </Link>
              <Link
                href="/about"
                className="btn-hero-secondary justify-center w-full sm:w-auto text-center"
              >
                Discover Naag Nool UP
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          2. ANIMATED TYPOGRAPHY TRANSITION
      ========================================================================= */}
      <TypographyTransition />

      {/* =========================================================================
          3. THE MOVEMENT SECTION (Exact reference implementation)
      ========================================================================= */}
      <MovementSection />

      {/* =========================================================================
          4. SIGNATURE JOURNALS / SHOP SHOWCASE
      ========================================================================= */}
      <JournalsShowcase />

      {/* =========================================================================
          5. WHY JOURNALING?
      ========================================================================= */}
      <WhyJournalingSection />

      {/* =========================================================================
          6. AYEYO KORIS — OUR IMPACT
      ========================================================================= */}
      <AyeyoKorisSection />

      {/* =========================================================================
          7. JOIN OUR COMMUNITY & PRE-FOOTER HORIZON
      ========================================================================= */}
      <CommunitySection />
    </div>
  );
}
