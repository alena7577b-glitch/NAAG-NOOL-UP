import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Sparkles, Sun, Compass } from 'lucide-react';
import { Container } from '@/components/ui/Container';

export const metadata: Metadata = {
  title: 'About Us — Naag Nool UP',
  description:
    'Who is Naag Nool UP? A universal women’s empowerment brand and movement, created to help women live with greater intention, confidence, self-worth and agency.',
};

export default function AboutPage() {
  return (
    <div className="space-y-0 overflow-hidden">
      {/* 1. HERO SECTION */}
      <section className="relative bg-[#F9F6F0] py-12 sm:py-16 lg:py-24 border-b border-[#E5DFC0]/50">
        <Container size="default">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-6 space-y-6 text-start">
              <p className="font-sans text-xs font-semibold uppercase tracking-[0.25em] text-[#B85233]">
                ABOUT
              </p>

              <h1 className="font-playfair text-4xl sm:text-6xl lg:text-7xl font-normal text-[#1E1C1A] leading-[1.08] tracking-tight">
                Who is <br />
                Naag Nool UP?
              </h1>

              <p className="font-sans text-sm sm:text-base lg:text-lg font-medium text-[#1E1C1A]">
                A movement. A community. A call to rise.
              </p>

              <p className="font-sans text-xs sm:text-sm lg:text-base text-[#6B655B] max-w-xl leading-relaxed">
                Naag Nool UP is a universal women’s empowerment brand and movement, created to help women live with greater intention, confidence, self-worth and agency.
              </p>

              <div className="pt-2">
                <p className="font-cormorant italic text-2xl sm:text-3xl text-[#B85233]">
                  Real women. Real growth. <br />
                  A brighter future.
                </p>
              </div>
            </div>

            {/* Right Hero Image */}
            <div className="lg:col-span-6">
              <div className="relative aspect-[4/5] sm:aspect-[1/1] lg:aspect-[4/5] w-full rounded-2xl overflow-hidden shadow-lg border border-[#E5DFC0]/60 bg-[#FAF8F5]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/hero-portrait.svg"
                  alt="Woman in terracotta hijab looking upward"
                  className="w-full h-full object-cover object-center"
                />
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 2. OUR STORY SECTION ("More than a brand. A movement.") */}
      <section className="py-16 sm:py-24 bg-[#FAF8F5] border-b border-[#E5DFC0]/50">
        <Container size="default">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* Left Collage */}
            <div className="lg:col-span-6 relative flex items-center justify-center">
              <div className="relative w-full max-w-lg grid grid-cols-12 gap-4 items-center">
                {/* Main Upper Image */}
                <div className="col-span-8 rounded-xl overflow-hidden shadow-md border border-[#E5DFC0]/60 aspect-[4/5] bg-[#FAF8F5]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/images/hero-portrait.svg"
                    alt="Woman overlooking landscape"
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* Secondary Lower Overlapping Image */}
                <div className="col-span-7 -mt-16 -ms-8 sm:-ms-12 rounded-xl overflow-hidden shadow-lg border-2 border-white aspect-square bg-[#FAF8F5] z-10">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/images/journal-awakening.svg"
                    alt="Guided journal artwork"
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* Botanical Accent */}
                <div className="absolute -top-6 right-0 w-32 h-44 text-[#D49B4B]/40 pointer-events-none">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/images/botanical-branch.svg"
                    alt="Botanical illustration"
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
            </div>

            {/* Right Text */}
            <div className="lg:col-span-6 space-y-5">
              <p className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-[#B85233]">
                OUR STORY
              </p>
              <h2 className="font-playfair text-3xl sm:text-4xl lg:text-5xl font-normal text-[#1E1C1A] leading-[1.15]">
                More than a brand. <br />
                A movement.
              </h2>
              <div className="space-y-4 font-sans text-xs sm:text-sm text-[#6B655B] leading-relaxed">
                <p>
                  Naag Nool UP was born from a simple truth — when a woman believes in herself, everything changes.
                </p>
                <p>
                  We created this brand to give women the tools, space and inspiration to reflect, heal, grow and take charge of their lives. Through beautifully crafted journals, intentional resources and community support, we’re building a future where every woman feels seen, valued and empowered.
                </p>
              </div>
              <div className="pt-2">
                <Link
                  href="/community"
                  className="inline-flex items-center gap-2 rounded-md bg-[#B85233] text-white px-6 py-2.5 text-xs sm:text-sm font-medium hover:bg-[#A64426] transition-colors"
                >
                  <span>Our Story</span>
                  <ArrowRight className="w-4 h-4 rtl:rotate-180" />
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 3. OUR THREE VALUES */}
      <section className="py-16 sm:py-24 bg-[#F9F6F0] border-b border-[#E5DFC0]/50">
        <Container size="default">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-start">
            {/* Left Header */}
            <div className="lg:col-span-4 space-y-3">
              <p className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-[#B85233]">
                OUR VALUES
              </p>
              <h2 className="font-playfair text-3xl sm:text-4xl lg:text-5xl font-normal text-[#1E1C1A]">
                Our Three Values
              </h2>
              <p className="font-sans text-xs sm:text-sm text-[#6B655B] leading-relaxed">
                These values guide everything we do — from the journals we create to the communities we support.
              </p>
            </div>

            {/* Right 3 Pillars with vertical dividers */}
            <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-0 md:divide-x divide-[#E5DFC0]">
              {/* Value 1: Resilient */}
              <div className="space-y-3 md:px-6 first:ps-0">
                <div className="w-12 h-12 rounded-full bg-[#FAF8F5] border border-[#E5DFC0] text-[#B85233] flex items-center justify-center">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h3 className="font-playfair text-xl text-[#1E1C1A]">Resilient</h3>
                <p className="font-sans text-xs text-[#6B655B] leading-relaxed">
                  We rise, even when it’s hard.
                </p>
              </div>

              {/* Value 2: Worthy */}
              <div className="space-y-3 md:px-6">
                <div className="w-12 h-12 rounded-full bg-[#FAF8F5] border border-[#E5DFC0] text-[#D49B4B] flex items-center justify-center">
                  <Sun className="w-5 h-5" />
                </div>
                <h3 className="font-playfair text-xl text-[#1E1C1A]">Worthy</h3>
                <p className="font-sans text-xs text-[#6B655B] leading-relaxed">
                  We are enough, just as we are.
                </p>
              </div>

              {/* Value 3: In Charge */}
              <div className="space-y-3 md:px-6 last:pe-0">
                <div className="w-12 h-12 rounded-full bg-[#FAF8F5] border border-[#E5DFC0] text-[#4D5844] flex items-center justify-center">
                  <Compass className="w-5 h-5" />
                </div>
                <h3 className="font-playfair text-xl text-[#1E1C1A]">In Charge</h3>
                <p className="font-sans text-xs text-[#6B655B] leading-relaxed">
                  We choose, we grow, we lead.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 4. OUR MISSION ("Empower today. Transform tomorrow.") */}
      <section className="py-0 bg-[#4D5844] text-white overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[480px]">
          {/* Left Green Block */}
          <div className="lg:col-span-6 p-8 sm:p-12 lg:p-16 flex flex-col justify-center space-y-6">
            <p className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-[#D49B4B]">
              OUR MISSION
            </p>
            <h2 className="font-playfair text-3xl sm:text-4xl lg:text-5xl font-normal leading-[1.15]">
              Empower today. <br />
              Transform tomorrow.
            </h2>
            <p className="font-sans text-xs sm:text-sm text-white/80 max-w-xl leading-relaxed">
              Our mission is to empower women through education, connection and opportunity — creating a ripple effect of confident, independent and empowered women and girls in our communities and beyond.
            </p>
            <div className="pt-2">
              <p className="font-cormorant italic text-2xl text-[#D49B4B]">
                Stronger women. <br />
                Stronger communities.
              </p>
            </div>
          </div>

          {/* Right Group Image */}
          <div className="lg:col-span-6 relative min-h-[300px] lg:min-h-full bg-[#3D4736]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/somali-women-group.svg"
              alt="Somali women gathering outdoors in sisterhood"
              className="w-full h-full object-cover object-center"
            />
          </div>
        </div>
      </section>

      {/* 5. MOVEMENT QUOTE BANNER */}
      <section className="relative bg-[#1E1C1A] text-white py-16 sm:py-24 overflow-hidden border-t border-white/10">
        <div 
          className="absolute inset-0 bg-cover bg-center pointer-events-none opacity-40 mix-blend-overlay"
          style={{ backgroundImage: 'url(/images/sunset-banner.svg)' }}
        />
        <Container size="default">
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* Left Column */}
            <div className="lg:col-span-6 space-y-5">
              <h2 className="font-playfair text-3xl sm:text-4xl lg:text-5xl font-normal leading-tight">
                The movement <br />
                is bigger than us.
              </h2>
              <p className="font-sans text-xs sm:text-sm text-white/80 max-w-lg leading-relaxed">
                Naag Nool UP is for every woman — in every chapter of her life. Because when one woman rises, she lifts others with her.
              </p>
              <div className="pt-2">
                <Link
                  href="/community"
                  className="inline-flex items-center gap-2 rounded-md bg-[#B85233] text-white px-6 py-2.5 text-xs sm:text-sm font-medium hover:bg-[#A64426] transition-colors"
                >
                  <span>Join the Community</span>
                  <ArrowRight className="w-4 h-4 rtl:rotate-180" />
                </Link>
              </div>
            </div>

            {/* Right Column: Quote */}
            <div className="lg:col-span-6 space-y-3">
              <blockquote className="font-playfair italic text-2xl sm:text-3xl text-white/95 leading-snug">
                &ldquo;Empowered women build stronger families, stronger communities and a brighter future.&rdquo;
              </blockquote>
              <p className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-[#D49B4B]">
                — NAAG NOOL UP
              </p>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
