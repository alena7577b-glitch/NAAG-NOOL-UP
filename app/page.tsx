import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { ProductCard } from '@/components/commerce/ProductCard';
import { PreFooterBanner } from '@/components/layout/PreFooterBanner';
import { getFeaturedProducts } from '@/lib/products';

export const revalidate = 60; // ISR revalidation

export default async function HomePage() {
  const featuredProducts = await getFeaturedProducts(6);

  return (
    <div className="space-y-0 overflow-hidden">
      {/* 1. HERO SECTION */}
      <section className="relative bg-[#F9F6F0] py-12 sm:py-16 lg:py-24 border-b border-[#E5DFC0]/50 overflow-hidden">
        <Container size="default">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Column: Authentic Hero Portrait */}
            <div className="lg:col-span-6 relative order-2 lg:order-1 flex items-center justify-center">
              <div className="relative aspect-[4/3] sm:aspect-[4/3] lg:aspect-[4/3] w-full max-w-lg rounded-2xl overflow-hidden shadow-md">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/hero-woman-portrait.png"
                  alt="Somali woman in terracotta hijab against warm desert landscape"
                  className="w-full h-full object-cover object-center"
                />
              </div>
            </div>

            {/* Right Column: Hero Typography & Actions */}
            <div className="lg:col-span-6 space-y-6 text-start order-1 lg:order-2">
              <p className="font-sans text-xs font-semibold uppercase tracking-[0.25em] text-[#B85233]">
                NAAG NOOL UP
              </p>

              <h1 className="font-playfair text-4xl sm:text-6xl lg:text-7xl font-normal text-[#1E1C1A] leading-[1.08] tracking-tight">
                The time to be <br />
                <span className="font-cormorant italic text-[#B85233] font-semibold">
                  ALIVE
                </span>{' '}
                is now.
              </h1>

              <p className="font-sans text-sm sm:text-base lg:text-lg text-[#6B655B] max-w-xl leading-relaxed">
                Naag Nool UP is a universal women’s empowerment brand and movement, created to help women live with greater intention, confidence, self-worth and agency.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  href="/shop"
                  className="inline-flex items-center justify-center rounded-md bg-[#B85233] text-white px-6 sm:px-7 py-3 text-xs sm:text-sm font-medium hover:bg-[#A64426] transition-colors shadow-sm"
                >
                  Shop the Journals
                </Link>
                <Link
                  href="/about"
                  className="inline-flex items-center justify-center rounded-md bg-transparent border border-[#1E1C1A]/40 text-[#1E1C1A] px-6 sm:px-7 py-3 text-xs sm:text-sm font-medium hover:bg-[#EAE5DC]/60 transition-colors"
                >
                  Discover Naag Nool UP
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 2. THE MOVEMENT SECTION */}
      <section className="py-16 sm:py-24 bg-[#FAF8F5] border-b border-[#E5DFC0]/50">
        <Container size="default">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
            {/* Left Text Block */}
            <div className="lg:col-span-4 space-y-5">
              <p className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-[#B85233]">
                THE MOVEMENT
              </p>
              <h2 className="font-playfair text-3xl sm:text-4xl lg:text-5xl font-normal text-[#1E1C1A] leading-[1.15]">
                You are resilient. <br />
                You are worthy. <br />
                You are in charge.
              </h2>
              <p className="font-sans text-xs sm:text-sm text-[#6B655B] leading-relaxed">
                Naag Nool UP is more than a brand — it’s a movement. A space for women to reconnect with their power, write their own stories and create a more intentional future.
              </p>
              <div className="pt-2">
                <Link
                  href="/about"
                  className="inline-flex items-center justify-center rounded-md bg-[#B85233] text-white px-6 py-2.5 text-xs sm:text-sm font-medium hover:bg-[#A64426] transition-colors"
                >
                  Our Story
                </Link>
              </div>
            </div>

            {/* Center: Editorial Collage */}
            <div className="lg:col-span-6 relative flex items-center justify-center">
              <div className="relative w-full max-w-lg grid grid-cols-12 gap-4 items-center">
                {/* Main Upper Image */}
                <div className="col-span-8 rounded-xl overflow-hidden shadow-md border border-[#E5DFC0]/60 aspect-[4/5] bg-[#FAF8F5]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/images/movement-woman.png"
                    alt="Woman looking upward"
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* Secondary Lower Overlapping Image */}
                <div className="col-span-7 -mt-16 -ms-8 sm:-ms-12 rounded-xl overflow-hidden shadow-lg border-2 border-white aspect-square bg-[#FAF8F5] z-10">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/images/movement-hands.png"
                    alt="Hands holding journal"
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* Decorative Botanical Branch */}
                <div className="absolute -top-6 right-0 w-32 h-44 text-[#D49B4B]/40 pointer-events-none -z-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/images/botanical-branch.svg"
                    alt="Botanical branch sketch"
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
            </div>

            {/* Right: Vertical Values Pillar */}
            <div className="lg:col-span-2 hidden lg:flex flex-col items-center justify-center space-y-4 text-center">
              <span className="font-sans text-[11px] font-bold uppercase tracking-[0.25em] text-[#1E1C1A]/80">
                RESILIENT
              </span>
              <span className="font-sans text-[11px] font-bold uppercase tracking-[0.25em] text-[#1E1C1A]/80">
                WORTHY
              </span>
              <span className="font-sans text-[11px] font-bold uppercase tracking-[0.25em] text-[#1E1C1A]/80">
                IN CHARGE
              </span>
              <div className="w-[1px] h-16 bg-[#1E1C1A]/30 mt-2" />
            </div>
          </div>
        </Container>
      </section>

      {/* 3. OUR JOURNALS ("Six Journals. One Movement.") */}
      <section className="py-16 sm:py-24 bg-[#F9F6F0] border-b border-[#E5DFC0]/50">
        <Container size="default">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
            <p className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-[#B85233]">
              OUR JOURNALS
            </p>
            <h2 className="font-playfair text-3xl sm:text-4xl lg:text-5xl font-normal text-[#1E1C1A]">
              Six Journals. One Movement.
            </h2>
            <p className="font-sans text-xs sm:text-sm text-[#6B655B] leading-relaxed">
              Thoughtfully designed journals to help you reflect, grow and take up space. Each journal is a step towards the life you want to live.
            </p>
            <div className="pt-1">
              <Link
                href="/shop"
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-[#B85233] hover:underline"
              >
                <span>Explore All Journals</span>
                <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
              </Link>
            </div>
          </div>

          {/* 6 Journal Cards Row/Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-5">
            {featuredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                showDetailsButton={false}
              />
            ))}
          </div>
        </Container>
      </section>

      {/* 4. WHY JOURNALING? */}
      <section className="py-16 sm:py-24 bg-[#FAF8F5] border-b border-[#E5DFC0]/50">
        <Container size="default">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* Left Image: Hands writing */}
            <div className="lg:col-span-6">
              <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden shadow-md border border-[#E5DFC0]/60 bg-[#FAF8F5]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/why-journaling.png"
                  alt="Hands writing in open journal on wooden desk"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Right Text */}
            <div className="lg:col-span-6 space-y-5">
              <p className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-[#B85233]">
                WHY JOURNALING?
              </p>
              <h2 className="font-playfair text-3xl sm:text-4xl lg:text-5xl font-normal text-[#1E1C1A] leading-[1.15]">
                A journal is a mirror, a guide and a safe space.
              </h2>
              <p className="font-sans text-xs sm:text-sm text-[#6B655B] leading-relaxed">
                Journaling helps you process, plan, heal and dream. It gives you the space to be honest, to be curious and to build the life you want — on your own terms.
              </p>
              <div className="pt-2">
                <Link
                  href="/about"
                  className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-[#B85233] hover:underline"
                >
                  <span>Learn More</span>
                  <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 5. OUR IMPACT / AYEYO KORIS */}
      <section className="py-16 sm:py-24 bg-[#4D5844] text-white">
        <Container size="default">
          <div className="relative rounded-2xl bg-[#444F3B] border border-white/10 p-8 sm:p-12 lg:p-16 overflow-hidden">
            {/* Botanical Watermark Background */}
            <div className="absolute top-0 start-0 w-64 h-80 text-white/10 pointer-events-none">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/botanical-branch.svg"
                alt="Botanical sketch"
                className="w-full h-full object-contain"
              />
            </div>

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              {/* Left Content */}
              <div className="lg:col-span-7 space-y-5">
                <p className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-[#D49B4B]">
                  OUR IMPACT
                </p>
                <h2 className="font-playfair text-3xl sm:text-4xl lg:text-5xl font-normal text-white">
                  Ayeyo Koris
                </h2>
                <p className="font-sans text-xs sm:text-sm text-white/80 max-w-xl leading-relaxed">
                  Ayeyo Koris is our commitment to creating real change. Through your support and purchases, we invest in education, opportunity and brighter futures for women and girls in our communities.
                </p>
                <div className="flex flex-wrap items-center gap-4 pt-2">
                  <Link
                    href="/ayeyo-koris"
                    className="inline-flex items-center justify-center rounded-md bg-white text-[#1E1C1A] px-6 py-2.5 text-xs sm:text-sm font-medium hover:bg-[#FAF8F5] transition-colors shadow-sm"
                  >
                    Learn More
                  </Link>
                  <Link
                    href="/ayeyo-koris#get-involved"
                    className="inline-flex items-center justify-center rounded-md bg-transparent border border-white text-white px-6 py-2.5 text-xs sm:text-sm font-medium hover:bg-white/10 transition-colors"
                  >
                    Donate
                  </Link>
                </div>
              </div>

              {/* Right Image */}
              <div className="lg:col-span-5">
                <div className="relative aspect-[4/3] sm:aspect-[16/10] rounded-xl overflow-hidden shadow-lg border border-white/20 bg-[#FAF8F5]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/images/ayeyo-portrait.png"
                    alt="Woman in terracotta headscarf looking toward horizon"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 6. JOIN OUR COMMUNITY */}
      <section className="py-16 sm:py-24 bg-[#FAF8F5] border-b border-[#E5DFC0]/50">
        <Container size="default">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Left: Women Celebrating Image */}
            <div className="lg:col-span-6">
              <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden shadow-md border border-[#E5DFC0]/60 bg-[#FAF8F5]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/community-sunset.png"
                  alt="Women celebrating together against mountain sunset"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Right: Community Text & Form */}
            <div className="lg:col-span-6 space-y-5">
              <p className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-[#B85233]">
                JOIN OUR COMMUNITY
              </p>
              <h2 className="font-playfair text-3xl sm:text-4xl lg:text-5xl font-normal text-[#1E1C1A]">
                You belong here.
              </h2>
              <p className="font-sans text-xs sm:text-sm text-[#6B655B] leading-relaxed">
                Be part of a growing community of women who support, encourage and uplift each other.
              </p>

              {/* Inline Name & Email Form */}
              <form action="/community" method="GET" className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-2">
                <div className="sm:col-span-5">
                  <input
                    type="text"
                    name="name"
                    placeholder="Your name"
                    required
                    className="w-full rounded-md bg-[#FAF8F5] border border-[#E5DFC0] px-4 py-2.5 text-xs text-[#1E1C1A] placeholder:text-[#6B655B] focus:outline-none focus:border-[#B85233]"
                  />
                </div>
                <div className="sm:col-span-5">
                  <input
                    type="email"
                    name="email"
                    placeholder="Your email address"
                    required
                    className="w-full rounded-md bg-[#FAF8F5] border border-[#E5DFC0] px-4 py-2.5 text-xs text-[#1E1C1A] placeholder:text-[#6B655B] focus:outline-none focus:border-[#B85233]"
                  />
                </div>
                <div className="sm:col-span-2">
                  <button
                    type="submit"
                    aria-label="Submit community signup"
                    className="w-full h-full min-h-[38px] rounded-md bg-[#B85233] text-white flex items-center justify-center hover:bg-[#A64426] transition-colors shadow-sm"
                  >
                    <ArrowRight className="w-4 h-4 rtl:rotate-180" />
                  </button>
                </div>
              </form>
            </div>
          </div>
        </Container>
      </section>

      {/* 7. FOLLOW OUR JOURNEY (SOCIAL STRIP) */}
      <section className="py-6 sm:py-8 bg-white border-b border-[#E5DFC0]/50">
        <Container size="default">
          <div className="flex flex-wrap items-center justify-center sm:justify-between gap-6 text-xs font-semibold uppercase tracking-[0.15em] text-[#1E1C1A]/80">
            <span>FOLLOW OUR JOURNEY</span>
            <div className="flex items-center gap-6 sm:gap-8">
              <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#B85233] transition-colors flex items-center gap-1.5">
                <span>TikTok</span>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#B85233] transition-colors flex items-center gap-1.5">
                <span>Instagram</span>
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#B85233] transition-colors flex items-center gap-1.5">
                <span>Facebook</span>
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#B85233] transition-colors flex items-center gap-1.5">
                <span>YouTube</span>
              </a>
            </div>
          </div>
        </Container>
      </section>

      {/* 8. PRE-FOOTER BANNER */}
      <PreFooterBanner
        eyebrow="JOIN OUR COMMUNITY"
        headline="Your life is yours to live."
        buttonText="Explore Naag Nool UP →"
        buttonHref="/about"
      />
    </div>
  );
}
