import Link from 'next/link';
import { ArrowRight, Sparkles, Heart, Shield, Award, Star, CheckCircle2 } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { ProductCard } from '@/components/commerce/ProductCard';
import { PreFooterBanner } from '@/components/layout/PreFooterBanner';
import { getFeaturedProducts } from '@/lib/products';
import { CommunitySignupForm } from '@/components/forms/CommunitySignupForm';

export const revalidate = 60; // ISR revalidation

export default async function HomePage() {
  const featuredProducts = await getFeaturedProducts(6);

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

        {/* Hero Content Overlay (Anchored to the far right with balanced vertical center) */}
        <div className="relative z-10 w-full max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-16 flex justify-end items-center">
          <div className="w-full max-w-lg lg:max-w-md xl:max-w-lg ml-auto space-y-4 sm:space-y-5 text-start">
            {/* Eyebrow */}
            <p className="font-sans text-xs sm:text-sm font-semibold uppercase tracking-[0.25em] text-[#A64426]">
              NAAG NOOL UP
            </p>

            {/* Majestic Headline */}
            <h1 className="font-playfair text-3xl sm:text-4xl lg:text-[3.25rem] xl:text-[3.5rem] font-normal text-[#1E1C1A] leading-[1.12] tracking-tight">
              The time to be <br />
              <span className="font-cormorant italic text-[#A64426] font-normal">
                ALIVE
              </span>{' '}
              is now.
            </h1>

            {/* Refined Narrative */}
            <p className="font-sans text-xs sm:text-sm lg:text-[0.95rem] text-[#4A453E] leading-relaxed max-w-md font-normal">
              Naag Nool UP is a universal women’s empowerment brand and movement, created to help women live with greater intention, confidence, self-worth and agency.
            </p>

            {/* Refined Luxury Buttons */}
            <div className="flex flex-wrap items-center gap-3.5 sm:gap-4 pt-2">
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

      {/* =========================================================================
          2. THE THREE PILLARS (Resilient • Worthy • In Charge)
      ========================================================================= */}
      <section className="py-14 sm:py-20 bg-[#FAF7F2] border-b border-[#E5DFC0]/50">
        <Container size="default">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
            <p className="font-sans text-xs font-semibold uppercase tracking-[0.25em] text-[#B85233]">
              CORE MANIFESTO
            </p>
            <h2 className="font-playfair text-2xl sm:text-4xl font-normal text-[#1E1C1A]">
              Three Pillars of Becoming
            </h2>
            <p className="font-sans text-xs sm:text-sm text-[#6B655B]">
              Every journal, prompt, and gathering is anchored in timeless truths designed to awaken your innate sovereignty.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {/* Pillar 1 */}
            <div className="group bg-white rounded-2xl p-8 border border-[#E5DFC0]/70 shadow-xs hover:shadow-md hover:border-[#B85233]/40 transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-[#B85233]/10 flex items-center justify-center text-[#B85233] mb-5 group-hover:bg-[#B85233] group-hover:text-white transition-colors duration-300">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="font-playfair text-xl font-normal text-[#1E1C1A] mb-2.5">
                01. Resilient
              </h3>
              <p className="font-sans text-xs sm:text-sm text-[#6B655B] leading-relaxed">
                Anchored in an unbreakable core. You possess the innate capacity to navigate seasons of transformation with grounded grace.
              </p>
            </div>

            {/* Pillar 2 */}
            <div className="group bg-white rounded-2xl p-8 border border-[#E5DFC0]/70 shadow-xs hover:shadow-md hover:border-[#B85233]/40 transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-[#D49B4B]/15 flex items-center justify-center text-[#D49B4B] mb-5 group-hover:bg-[#D49B4B] group-hover:text-white transition-colors duration-300">
                <Heart className="w-6 h-6" />
              </div>
              <h3 className="font-playfair text-xl font-normal text-[#1E1C1A] mb-2.5">
                02. Worthy
              </h3>
              <p className="font-sans text-xs sm:text-sm text-[#6B655B] leading-relaxed">
                Your worth is inherent, sacred, and non-negotiable. Reclaim your seat at your own table without seeking external validation.
              </p>
            </div>

            {/* Pillar 3 */}
            <div className="group bg-white rounded-2xl p-8 border border-[#E5DFC0]/70 shadow-xs hover:shadow-md hover:border-[#B85233]/40 transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-[#4D5844]/15 flex items-center justify-center text-[#4D5844] mb-5 group-hover:bg-[#4D5844] group-hover:text-white transition-colors duration-300">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="font-playfair text-xl font-normal text-[#1E1C1A] mb-2.5">
                03. In Charge
              </h3>
              <p className="font-sans text-xs sm:text-sm text-[#6B655B] leading-relaxed">
                Holding the pen to author your own story. Take intentional ownership over your thoughts, boundaries, habits, and future.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* =========================================================================
          3. THE MOVEMENT (Editorial split story feature)
      ========================================================================= */}
      <section className="py-16 sm:py-24 bg-[#FAF8F5] border-b border-[#E5DFC0]/50">
        <Container size="default">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Left Story Text */}
            <div className="lg:col-span-5 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#B85233]/10 text-[#B85233] text-[11px] font-semibold uppercase tracking-widest">
                <span>The Movement</span>
              </div>

              <h2 className="font-playfair text-3xl sm:text-4xl lg:text-5xl font-normal text-[#1E1C1A] leading-[1.15]">
                You are resilient. <br />
                You are worthy. <br />
                You are in charge.
              </h2>

              <p className="font-sans text-xs sm:text-sm text-[#6B655B] leading-relaxed">
                Naag Nool UP is more than a brand — it’s a living global movement. A sacred space created for women to reconnect with their power, heal past narratives, and boldly author their most vibrant chapter yet.
              </p>

              <div className="p-4 sm:p-5 rounded-xl bg-[#F4EFE6] border-l-3 border-[#B85233] space-y-2">
                <p className="font-cormorant italic text-base sm:text-lg text-[#1E1C1A]">
                  &ldquo;When a woman remembers who she is, entire generations shift with her.&rdquo;
                </p>
                <span className="block text-[11px] font-sans font-semibold uppercase tracking-wider text-[#B85233]">
                  — Naag Nool UP Founding Principle
                </span>
              </div>

              <div className="pt-2">
                <Link
                  href="/about"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[#B85233] text-white px-7 py-3 text-xs sm:text-sm font-semibold hover:bg-[#A64426] transition-colors shadow-sm"
                >
                  <span>Our Story & Mission</span>
                  <ArrowRight className="w-4 h-4 rtl:rotate-180" />
                </Link>
              </div>
            </div>

            {/* Right: Editorial Photo Collage */}
            <div className="lg:col-span-7 relative flex items-center justify-center">
              <div className="relative w-full max-w-lg rounded-2xl overflow-hidden shadow-lg border border-[#E5DFC0]/70 bg-white p-2 sm:p-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/hp-movement-collage.png"
                  alt="The Movement photo collage with botanical branch sketch"
                  className="w-full h-auto object-contain rounded-xl"
                />
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* =========================================================================
          4. SIGNATURE GUIDED JOURNALS (6 Product Grid)
      ========================================================================= */}
      <section className="py-16 sm:py-24 bg-[#FAF7F2] border-b border-[#E5DFC0]/50">
        <Container size="default">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div className="space-y-3 max-w-xl">
              <p className="font-sans text-xs font-semibold uppercase tracking-[0.25em] text-[#B85233]">
                SIGNATURE COLLECTION
              </p>
              <h2 className="font-playfair text-3xl sm:text-4xl font-normal text-[#1E1C1A]">
                The Guided Journals
              </h2>
              <p className="font-sans text-xs sm:text-sm text-[#6B655B]">
                Intentionally designed daily rituals to unlock healing, clarity, intentional focus, and deep self-worth.
              </p>
            </div>

            <Link
              href="/shop"
              className="inline-flex items-center gap-2 font-sans text-xs sm:text-sm font-semibold text-[#B85233] hover:text-[#A64426] transition-colors group"
            >
              <span>View Full Shop</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform rtl:rotate-180" />
            </Link>
          </div>

          {/* 6 Journal Cards in Responsive Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-5">
            {featuredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                showDetailsButton={false}
                className="h-full bg-white rounded-xl shadow-xs hover:shadow-md transition-all duration-300"
              />
            ))}
          </div>
        </Container>
      </section>

      {/* =========================================================================
          5. WHY GUIDED JOURNALING (Methodology & Practice)
      ========================================================================= */}
      <section className="py-16 sm:py-24 bg-[#FAF8F5] border-b border-[#E5DFC0]/50">
        <Container size="default">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* Left Image with Floating Stat Badge */}
            <div className="lg:col-span-6 relative">
              <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden shadow-md bg-[#FAF8F5] border border-[#E5DFC0]/60">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/hp-why-journaling.png"
                  alt="Hands writing in open journal on wooden desk"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Floating Stat Card */}
              <div className="absolute -bottom-6 -right-2 sm:right-6 bg-white/95 backdrop-blur-md p-4 sm:p-5 rounded-xl border border-[#E5DFC0] shadow-lg max-w-xs space-y-1">
                <div className="flex items-center gap-2 text-[#D49B4B]">
                  <Sparkles className="w-4 h-4 fill-[#D49B4B]" />
                  <span className="font-playfair text-lg font-bold text-[#1E1C1A]">94% Transformation</span>
                </div>
                <p className="text-[11px] text-[#6B655B] leading-tight">
                  Of women report deeper emotional clarity and confidence within their first 14 days of journaling.
                </p>
              </div>
            </div>

            {/* Right Text & Steps */}
            <div className="lg:col-span-6 space-y-6 pt-6 lg:pt-0">
              <div className="space-y-2">
                <p className="font-sans text-xs font-semibold uppercase tracking-[0.25em] text-[#B85233]">
                  THE METHODOLOGY
                </p>
                <h2 className="font-playfair text-3xl sm:text-4xl font-normal text-[#1E1C1A]">
                  Why Guided Journaling Works
                </h2>
              </div>

              <p className="font-sans text-xs sm:text-sm text-[#6B655B] leading-relaxed">
                Unstructured pages can often feel overwhelming. Our proven step-by-step guided frameworks bridge mindfulness, emotional regulation, and intentional identity design into 10 minutes of transformative daily ritual.
              </p>

              {/* 4 Methodological Steps */}
              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-3.5 p-3 rounded-lg bg-white border border-[#E5DFC0]/60 shadow-xs">
                  <span className="flex-shrink-0 w-7 h-7 rounded-full bg-[#B85233]/10 text-[#B85233] text-xs font-bold flex items-center justify-center">
                    01
                  </span>
                  <div>
                    <h3 className="font-playfair text-sm font-semibold text-[#1E1C1A]">Daily Grounding</h3>
                    <p className="text-xs text-[#6B655B] leading-relaxed">Clear mental fog and center on today’s core emotional intention.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 p-3 rounded-lg bg-white border border-[#E5DFC0]/60 shadow-xs">
                  <span className="flex-shrink-0 w-7 h-7 rounded-full bg-[#D49B4B]/15 text-[#D49B4B] text-xs font-bold flex items-center justify-center">
                    02
                  </span>
                  <div>
                    <h3 className="font-playfair text-sm font-semibold text-[#1E1C1A]">Targeted Prompts</h3>
                    <p className="text-xs text-[#6B655B] leading-relaxed">Unpack subconscious patterns, celebrate progress, and release unhelpful narratives.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 p-3 rounded-lg bg-white border border-[#E5DFC0]/60 shadow-xs">
                  <span className="flex-shrink-0 w-7 h-7 rounded-full bg-[#4D5844]/15 text-[#4D5844] text-xs font-bold flex items-center justify-center">
                    03
                  </span>
                  <div>
                    <h3 className="font-playfair text-sm font-semibold text-[#1E1C1A]">Identity Alignment</h3>
                    <p className="text-xs text-[#6B655B] leading-relaxed">Anchor into the feeling of resilience, self-worth, and proactive leadership.</p>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  href="/shop"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[#B85233] text-white px-7 py-3 text-xs sm:text-sm font-semibold hover:bg-[#A64426] transition-colors shadow-sm"
                >
                  <span>Explore the Journals</span>
                  <ArrowRight className="w-4 h-4 rtl:rotate-180" />
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* =========================================================================
          6. AYEYO KORIS INITIATIVE (Heritage & Social Impact)
      ========================================================================= */}
      <section className="py-16 sm:py-24 bg-[#B85233] text-white">
        <Container size="default">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* Left Content */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-white text-[11px] font-semibold uppercase tracking-widest backdrop-blur-sm">
                <span>Social Impact & Heritage</span>
              </div>

              <h2 className="font-playfair text-3xl sm:text-4xl lg:text-5xl font-normal leading-[1.12]">
                Ayeyo Koris: <br />
                <span className="font-cormorant italic font-normal text-[#FAF8F5]">
                  Nurturing Generational Hope
                </span>
              </h2>

              <p className="font-sans text-xs sm:text-sm text-white/90 leading-relaxed max-w-xl">
                Named after the timeless wisdom of grandmothers (&ldquo;Ayeyo&rdquo;), Ayeyo Koris is our dedicated grassroots initiative supporting girls’ literacy, mentorship, and creative education for young women across East Africa.
              </p>

              {/* Impact Counters */}
              <div className="grid grid-cols-3 gap-4 pt-2 border-t border-white/20">
                <div>
                  <span className="block font-playfair text-2xl sm:text-3xl font-bold text-white">500+</span>
                  <span className="text-[11px] text-white/80 uppercase tracking-wider">Girls Supported</span>
                </div>
                <div>
                  <span className="block font-playfair text-2xl sm:text-3xl font-bold text-white">100%</span>
                  <span className="text-[11px] text-white/80 uppercase tracking-wider">Direct Impact</span>
                </div>
                <div>
                  <span className="block font-playfair text-2xl sm:text-3xl font-bold text-white">12</span>
                  <span className="text-[11px] text-white/80 uppercase tracking-wider">Communities</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  href="/ayeyo-koris"
                  className="inline-flex items-center justify-center rounded-full bg-white text-[#1E1C1A] px-7 py-3 text-xs sm:text-sm font-semibold hover:bg-[#FAF8F5] transition-colors shadow-sm"
                >
                  Learn More
                </Link>
                <Link
                  href="/ayeyo-koris#get-involved"
                  className="inline-flex items-center justify-center rounded-full bg-transparent border border-white text-white px-7 py-3 text-xs sm:text-sm font-medium hover:bg-white/10 transition-colors"
                >
                  Support the Initiative
                </Link>
              </div>
            </div>

            {/* Right Image */}
            <div className="lg:col-span-6">
              <div className="relative aspect-[4/3] sm:aspect-[16/11] rounded-2xl overflow-hidden shadow-2xl border border-white/25 bg-[#FAF8F5]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/hp-ayeyo-woman.png"
                  alt="Somali woman in terracotta headscarf looking toward horizon"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* =========================================================================
          7. COMMUNITY & TESTIMONIALS (Voices of Becoming)
      ========================================================================= */}
      <section className="py-16 sm:py-24 bg-[#FAF7F2] border-b border-[#E5DFC0]/50">
        <Container size="default">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
            <p className="font-sans text-xs font-semibold uppercase tracking-[0.25em] text-[#B85233]">
              COMMUNITY VOICES
            </p>
            <h2 className="font-playfair text-3xl sm:text-4xl font-normal text-[#1E1C1A]">
              Stories of Transformation
            </h2>
            <p className="font-sans text-xs sm:text-sm text-[#6B655B]">
              Real reflections from women around the world claiming their worth through the daily practice.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {/* Testimonial 1 */}
            <div className="bg-white rounded-2xl p-7 border border-[#E5DFC0]/70 shadow-xs flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center text-[#D49B4B]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-[#D49B4B] text-[#D49B4B]" />
                  ))}
                </div>
                <p className="font-cormorant italic text-base sm:text-lg text-[#1E1C1A] leading-relaxed">
                  &ldquo;The Awakening Journal gave me permission to stop apologizing for taking up space. It changed the entire trajectory of my mornings.&rdquo;
                </p>
              </div>
              <div className="pt-3 border-t border-[#E5DFC0]/50 flex items-center justify-between">
                <div>
                  <h4 className="font-playfair text-sm font-semibold text-[#1E1C1A]">Fadumo A.</h4>
                  <span className="text-[11px] text-[#6B655B]">London, UK • Verified Buyer</span>
                </div>
                <CheckCircle2 className="w-4 h-4 text-[#4D5844]" />
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-white rounded-2xl p-7 border border-[#E5DFC0]/70 shadow-xs flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center text-[#D49B4B]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-[#D49B4B] text-[#D49B4B]" />
                  ))}
                </div>
                <p className="font-cormorant italic text-base sm:text-lg text-[#1E1C1A] leading-relaxed">
                  &ldquo;Having a structured, soulful journal made me feel seen. The prompts are deep, gentle, and profoundly empowering.&rdquo;
                </p>
              </div>
              <div className="pt-3 border-t border-[#E5DFC0]/50 flex items-center justify-between">
                <div>
                  <h4 className="font-playfair text-sm font-semibold text-[#1E1C1A]">Amina K.</h4>
                  <span className="text-[11px] text-[#6B655B]">Toronto, Canada • Verified Buyer</span>
                </div>
                <CheckCircle2 className="w-4 h-4 text-[#4D5844]" />
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-white rounded-2xl p-7 border border-[#E5DFC0]/70 shadow-xs flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center text-[#D49B4B]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-[#D49B4B] text-[#D49B4B]" />
                  ))}
                </div>
                <p className="font-cormorant italic text-base sm:text-lg text-[#1E1C1A] leading-relaxed">
                  &ldquo;I bought one for myself and three for my sisters. The quality of the linen and gold foil is unmatched. Truly a luxury item.&rdquo;
                </p>
              </div>
              <div className="pt-3 border-t border-[#E5DFC0]/50 flex items-center justify-between">
                <div>
                  <h4 className="font-playfair text-sm font-semibold text-[#1E1C1A]">Samira M.</h4>
                  <span className="text-[11px] text-[#6B655B]">Minneapolis, USA • Verified Buyer</span>
                </div>
                <CheckCircle2 className="w-4 h-4 text-[#4D5844]" />
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* =========================================================================
          8. JOIN THE INNER CIRCLE (Luxury Community Newsletter)
      ========================================================================= */}
      <section className="py-16 sm:py-24 bg-[#FAF8F5]">
        <Container size="default">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center bg-[#F4EFE6] rounded-3xl p-8 sm:p-12 border border-[#E5DFC0]">
            {/* Left: Women Celebrating Image */}
            <div className="lg:col-span-6">
              <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden shadow-md bg-white border border-[#E5DFC0]/60">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/hp-community-sunset.png"
                  alt="Women celebrating together against mountain sunset"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Right: Join Form */}
            <div className="lg:col-span-6 space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#B85233]/10 text-[#B85233] text-[11px] font-semibold uppercase tracking-widest">
                <span>The Inner Circle</span>
              </div>

              <h2 className="font-playfair text-3xl sm:text-4xl font-normal text-[#1E1C1A]">
                Join Our Global Sisterhood
              </h2>

              <p className="font-sans text-xs sm:text-sm text-[#6B655B] leading-relaxed">
                Receive weekly guided reflections, early access to new releases, private workshop invitations, and empowering stories from the movement.
              </p>

              <CommunitySignupForm />
            </div>
          </div>
        </Container>
      </section>

      {/* =========================================================================
          9. PRE-FOOTER PROMISES & TRUST
      ========================================================================= */}
      <PreFooterBanner />
    </div>
  );
}
