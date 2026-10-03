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
    <div className="space-y-0 overflow-hidden bg-[#FAF8F5] text-[#1E1C1A]">
      {/* 1. HERO SECTION (Seamless full-bleed panoramic photographic hero with overlaid header) */}
      <section className="relative w-full overflow-hidden bg-[#EDE5D8] min-h-[580px] sm:min-h-[640px] lg:min-h-[700px] xl:min-h-[760px] flex items-center border-b border-[#E5DFC0]/50 pt-24 sm:pt-28 lg:pt-32 pb-12 sm:pb-16 lg:pb-20">
        {/* Full-bleed background panoramic image grounded on left */}
        <div className="absolute inset-0 z-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/hp-hero-bg-seamless.png"
            alt="Naag Nool UP Hero Landscape with woman in terracotta scarf"
            className="w-full h-full object-cover object-[0%_center] sm:object-[5%_center] md:object-[10%_center] lg:object-[left_center]"
          />
        </div>

        {/* Hero Content Overlay (Positioned to the far right over the open sky and hills) */}
        <Container size="default" className="relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
            {/* Left Column Spacer: Keeps the woman's portrait completely open and unobstructed */}
            <div className="hidden lg:block lg:col-span-6 xl:col-span-6 2xl:col-span-7" />

            {/* Right Column: Hero Typography & Actions */}
            <div className="lg:col-span-6 xl:col-span-6 2xl:col-span-5 space-y-6 text-start bg-[#FAF8F5]/90 lg:bg-transparent p-6 sm:p-8 lg:p-0 lg:ps-6 xl:ps-8 rounded-2xl lg:rounded-none backdrop-blur-sm lg:backdrop-blur-none shadow-sm lg:shadow-none max-w-xl lg:ml-auto">
              <p className="font-sans text-xs sm:text-sm font-semibold uppercase tracking-[0.25em] text-[#B85233]">
                NAAG NOOL UP
              </p>

              <h1 className="font-playfair text-4xl sm:text-5xl lg:text-[3.5rem] xl:text-[4rem] font-normal text-[#1E1C1A] leading-[1.08] tracking-tight">
                The time to be <br />
                <span className="font-cormorant italic text-[#B85233] font-normal">
                  ALIVE
                </span>{' '}
                is now.
              </h1>

              <p className="font-sans text-sm sm:text-base lg:text-[1.05rem] text-[#3D3833] max-w-lg leading-relaxed font-normal">
                Naag Nool UP is a universal women’s empowerment brand and movement, created to help women live with greater intention, confidence, self-worth and agency.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  href="/shop"
                  className="inline-flex items-center justify-center gap-2 rounded-md bg-[#B85233] text-white px-7 sm:px-8 py-3.5 sm:py-4 text-sm font-medium hover:bg-[#A64426] hover:shadow-md transition-all shadow-sm"
                >
                  Shop the Journals <ArrowRight className="w-4 h-4 rtl:rotate-180" />
                </Link>
                <Link
                  href="/about"
                  className="inline-flex items-center justify-center rounded-md bg-[#FAF3E8]/90 hover:bg-[#FAF3E8] border border-[#B85233]/40 text-[#1E1C1A] px-7 sm:px-8 py-3.5 sm:py-4 text-sm font-medium hover:border-[#B85233]/70 hover:shadow-sm transition-all"
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
                  className="inline-flex items-center justify-center rounded bg-[#B85233] text-white px-6 py-2.5 text-xs sm:text-sm font-medium hover:bg-[#A64426] transition-colors"
                >
                  Our Story
                </Link>
              </div>
            </div>

            {/* Center: Editorial Collage */}
            <div className="lg:col-span-6 relative flex items-center justify-center">
              <div className="relative w-full max-w-lg">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/hp-movement-collage.png"
                  alt="The Movement photo collage with botanical sketch"
                  className="w-full h-auto object-contain drop-shadow-sm rounded-lg"
                />
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

          {/* 6 Journal Cards in 6 Columns */}
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
              <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden shadow-sm bg-[#FAF8F5]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/hp-why-journaling.png"
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
                    className="inline-flex items-center justify-center rounded bg-white text-[#1E1C1A] px-6 py-2.5 text-xs sm:text-sm font-medium hover:bg-[#FAF8F5] transition-colors shadow-sm"
                  >
                    Learn More
                  </Link>
                  <Link
                    href="/ayeyo-koris#get-involved"
                    className="inline-flex items-center justify-center rounded bg-transparent border border-white text-white px-6 py-2.5 text-xs sm:text-sm font-medium hover:bg-white/10 transition-colors"
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
                    src="/images/hp-ayeyo-woman.png"
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
              <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden shadow-sm bg-[#FAF8F5]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/hp-community-sunset.png"
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
                    className="w-full rounded bg-[#FAF8F5] border border-[#E5DFC0] px-4 py-2.5 text-xs text-[#1E1C1A] placeholder:text-[#6B655B] focus:outline-none focus:border-[#B85233]"
                  />
                </div>
                <div className="sm:col-span-5">
                  <input
                    type="email"
                    name="email"
                    placeholder="Your email address"
                    required
                    className="w-full rounded bg-[#FAF8F5] border border-[#E5DFC0] px-4 py-2.5 text-xs text-[#1E1C1A] placeholder:text-[#6B655B] focus:outline-none focus:border-[#B85233]"
                  />
                </div>
                <div className="sm:col-span-2">
                  <button
                    type="submit"
                    aria-label="Submit community signup"
                    className="w-full h-full min-h-[38px] rounded bg-[#B85233] text-white flex items-center justify-center hover:bg-[#A64426] transition-colors shadow-sm"
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
