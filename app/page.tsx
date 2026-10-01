import Link from 'next/link';
import { ArrowRight, BookOpen, Heart, Sparkles, Compass, ShieldCheck } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { ProductCard } from '@/components/commerce/ProductCard';
import { CommunitySignupForm } from '@/components/forms/CommunitySignupForm';
import { getFeaturedProducts } from '@/lib/products';

export const revalidate = 60; // ISR revalidation every 60 seconds

export default async function HomePage() {
  const featuredProducts = await getFeaturedProducts(6);

  return (
    <div className="space-y-0">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-[#F9F6F0] py-20 sm:py-28 lg:py-36 border-b border-[#E5DFC0]/60">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-[#B85233]/10 via-transparent to-transparent pointer-events-none" />
        <Container size="default">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            <div className="lg:col-span-7 space-y-6 text-start">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#B85233]/10 text-[#B85233] text-xs font-semibold uppercase tracking-widest">
                <Sparkles className="w-3.5 h-3.5" />
                <span>The Movement & Journals</span>
              </div>

              <h1 className="font-playfair text-4xl sm:text-6xl lg:text-7xl font-normal tracking-tight text-[#1E1C1A] leading-[1.1]">
                The time to be{' '}
                <span className="font-cormorant italic text-[#B85233] font-semibold">
                  ALIVE
                </span>{' '}
                is now.
              </h1>

              <p className="font-sans text-base sm:text-lg lg:text-xl text-[#6B655B] max-w-xl leading-relaxed">
                A universal women’s empowerment movement centered around intention, self-worth, and agency. Reflect deeply, claim your voice, and step boldly into your purpose.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-3">
                <Link href="/shop">
                  <Button variant="primary" size="lg" className="shadow-md">
                    <span>Shop the Journals</span>
                    <ArrowRight className="w-4 h-4 ms-2 rtl:rotate-180" />
                  </Button>
                </Link>
                <Link href="/about">
                  <Button variant="outline" size="lg">
                    Discover Our Story
                  </Button>
                </Link>
              </div>
            </div>

            {/* Visual Hero Panel */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none rounded-3xl bg-gradient-to-br from-[#EAE5DC] to-[#FAF8F5] p-8 sm:p-12 border border-[#E5DFC0] shadow-lg text-center space-y-6">
                <div className="w-16 h-16 rounded-2xl bg-[#B85233] text-white mx-auto flex items-center justify-center shadow-md">
                  <BookOpen className="w-8 h-8" />
                </div>
                <div className="space-y-2">
                  <span className="text-xs uppercase tracking-widest font-semibold text-[#B85233]">
                    Six Guided Reflections
                  </span>
                  <h3 className="font-playfair text-2xl sm:text-3xl font-normal text-[#1E1C1A]">
                    Designed for Transformation
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-[#6B655B] leading-relaxed">
                  Crafted with premium materials and guided inquiries to anchor your daily self-worth, healing, and unstoppable resilience.
                </p>
                <div className="pt-2">
                  <span className="inline-block px-4 py-1.5 rounded-full bg-[#4D5844]/10 text-[#4D5844] text-xs font-medium">
                    Resilient • Worthy • In Charge
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 2. THE MOVEMENT / THREE PILLARS */}
      <section className="py-20 sm:py-28 bg-white border-b border-[#E5DFC0]/60">
        <Container size="default">
          <div className="text-center max-w-2xl mx-auto space-y-4 mb-16">
            <p className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-[#B85233]">
              Our Foundation
            </p>
            <h2 className="font-playfair text-3xl sm:text-4xl lg:text-5xl font-normal text-[#1E1C1A]">
              Three Pillars of Agency
            </h2>
            <p className="font-sans text-sm sm:text-base text-[#6B655B] leading-relaxed">
              Naag Nool UP is anchored in three non-negotiable principles that guide our journals, our content, and our global sisterhood.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
            {/* Pillar 1 */}
            <div className="rounded-2xl bg-[#F9F6F0] p-8 border border-[#E5DFC0]/80 space-y-4 hover:border-[#B85233]/40 transition-colors">
              <span className="font-playfair text-3xl text-[#B85233] font-light">01</span>
              <h3 className="font-playfair text-2xl font-normal text-[#1E1C1A]">Resilient</h3>
              <p className="font-sans text-sm text-[#6B655B] leading-relaxed">
                The courage to rise from every challenge. Recognizing that your trials are not your final story, but the crucible that proves your inner strength.
              </p>
            </div>

            {/* Pillar 2 */}
            <div className="rounded-2xl bg-[#F9F6F0] p-8 border border-[#E5DFC0]/80 space-y-4 hover:border-[#B85233]/40 transition-colors">
              <span className="font-playfair text-3xl text-[#B85233] font-light">02</span>
              <h3 className="font-playfair text-2xl font-normal text-[#1E1C1A]">Worthy</h3>
              <p className="font-sans text-sm text-[#6B655B] leading-relaxed">
                Unconditional self-value. Embracing who you are without requiring validation, permission, or comparison with anyone else.
              </p>
            </div>

            {/* Pillar 3 */}
            <div className="rounded-2xl bg-[#F9F6F0] p-8 border border-[#E5DFC0]/80 space-y-4 hover:border-[#B85233]/40 transition-colors">
              <span className="font-playfair text-3xl text-[#B85233] font-light">03</span>
              <h3 className="font-playfair text-2xl font-normal text-[#1E1C1A]">In Charge</h3>
              <p className="font-sans text-sm text-[#6B655B] leading-relaxed">
                Radical ownership of your decisions, your narrative, and your future. Stepping into the author’s seat of your own life.
              </p>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link href="/about">
              <Button variant="outline" size="md">
                <span>Read the Full Movement Philosophy</span>
                <ArrowRight className="w-4 h-4 ms-2 rtl:rotate-180" />
              </Button>
            </Link>
          </div>
        </Container>
      </section>

      {/* 3. FEATURED JOURNALS COLLECTION */}
      <section className="py-20 sm:py-28 bg-[#F9F6F0] border-b border-[#E5DFC0]/60">
        <Container size="default">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div className="space-y-3 max-w-xl">
              <p className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-[#B85233]">
                The Shop
              </p>
              <h2 className="font-playfair text-3xl sm:text-4xl lg:text-5xl font-normal text-[#1E1C1A]">
                Guided Journals
              </h2>
              <p className="font-sans text-sm sm:text-base text-[#6B655B]">
                Each journal is thoughtfully curated with daily inquiries, grounding reflections, and space to cultivate your personal agency.
              </p>
            </div>

            <div>
              <Link href="/shop">
                <Button variant="outline" size="md">
                  <span>Explore All Products</span>
                  <ArrowRight className="w-4 h-4 ms-2 rtl:rotate-180" />
                </Button>
              </Link>
            </div>
          </div>

          {featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="rounded-3xl bg-white border border-[#E5DFC0] p-12 text-center max-w-xl mx-auto space-y-4">
              <div className="w-12 h-12 rounded-full bg-[#B85233]/10 text-[#B85233] mx-auto flex items-center justify-center">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="font-playfair text-2xl text-[#1E1C1A]">The Catalog is Being Prepared</h3>
              <p className="text-sm text-[#6B655B] leading-relaxed">
                Our team is currently finalizing the product catalog for the six journal editions. Check back shortly or join our community to receive first access.
              </p>
              <div className="pt-2">
                <Link href="/community">
                  <Button variant="primary" size="md">Join for Launch Updates</Button>
                </Link>
              </div>
            </div>
          )}
        </Container>
      </section>

      {/* 4. WHY JOURNALING? (EDITORIAL INSIGHT) */}
      <section className="py-20 sm:py-28 bg-[#4D5844] text-white">
        <Container size="narrow">
          <div className="text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 text-white text-xs font-semibold uppercase tracking-widest">
              <Compass className="w-3.5 h-3.5" />
              <span>Editorial Perspective</span>
            </div>

            <h2 className="font-playfair text-3xl sm:text-4xl lg:text-5xl font-normal leading-snug">
              &ldquo;When you put your truth on paper, you take the power back into your own hands.&rdquo;
            </h2>

            <p className="font-sans text-sm sm:text-base text-white/80 max-w-2xl mx-auto leading-relaxed">
              Writing is not merely keeping a record—it is a conscious act of reclaiming your narrative. In a world full of noise, daily reflection provides the clarity needed to discern who you are and what you are building.
            </p>
          </div>
        </Container>
      </section>

      {/* 5. AYEYO KORIS SOCIAL IMPACT */}
      <section className="py-20 sm:py-28 bg-white border-b border-[#E5DFC0]/60">
        <Container size="default">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#B85233]/10 text-[#B85233] text-xs font-semibold uppercase tracking-widest">
                <Heart className="w-3.5 h-3.5" />
                <span>Social Impact Initiative</span>
              </div>

              <h2 className="font-playfair text-3xl sm:text-4xl lg:text-5xl font-normal text-[#1E1C1A]">
                Ayeyo Koris
              </h2>

              <p className="font-cormorant italic text-xl text-[#B85233]">
                Honoring wisdom, nurturing future generations.
              </p>

              <p className="font-sans text-sm sm:text-base text-[#6B655B] leading-relaxed">
                Naag Nool UP is deeply committed to community uplifting. Through the Ayeyo Koris initiative, we connect women across generations, preserving cultural resilience while supporting health, mentorship, and solidarity.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link href="/ayeyo-koris">
                  <Button variant="primary" size="md">
                    Learn About Ayeyo Koris
                  </Button>
                </Link>
                <Link href="/ayeyo-koris#get-involved">
                  <Button variant="outline" size="md">
                    Support the Cause
                  </Button>
                </Link>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="rounded-3xl bg-[#F9F6F0] border border-[#E5DFC0] p-8 sm:p-10 space-y-6">
                <h3 className="font-playfair text-2xl text-[#1E1C1A]">
                  Our Commitment to Giving Back
                </h3>
                <ul className="space-y-4 font-sans text-sm text-[#6B655B]">
                  <li className="flex items-start gap-3">
                    <ShieldCheck className="w-5 h-5 text-[#4D5844] shrink-0 mt-0.5" />
                    <span>Empowering elders and matriarchs who hold the wisdom of our communities.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <ShieldCheck className="w-5 h-5 text-[#4D5844] shrink-0 mt-0.5" />
                    <span>Providing educational resources, maternal support, and mentorship opportunities.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <ShieldCheck className="w-5 h-5 text-[#4D5844] shrink-0 mt-0.5" />
                    <span>Fostering spaces where young women and grandmothers connect to share stories of resilience.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 6. COMMUNITY SIGNUP SECTION */}
      <section className="py-20 sm:py-28 bg-[#F9F6F0] border-b border-[#E5DFC0]/60">
        <Container size="narrow">
          <div className="text-center space-y-4 mb-10">
            <p className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-[#B85233]">
              Sisterhood
            </p>
            <h2 className="font-playfair text-3xl sm:text-4xl lg:text-5xl font-normal text-[#1E1C1A]">
              Join the Movement
            </h2>
            <p className="font-sans text-sm sm:text-base text-[#6B655B] max-w-xl mx-auto leading-relaxed">
              Sign up to receive journal prompts, early access to new releases, and invitations to upcoming community discussions.
            </p>
          </div>

          <div className="rounded-3xl bg-white p-6 sm:p-10 border border-[#E5DFC0] shadow-sm">
            <CommunitySignupForm />
          </div>
        </Container>
      </section>

      {/* 7. CLOSING BRAND CALL TO ACTION */}
      <section className="py-20 sm:py-24 bg-[#1E1C1A] text-white text-center">
        <Container size="narrow">
          <div className="space-y-6">
            <span className="font-cormorant italic text-2xl text-[#D49B4B]">
              Resilient • Worthy • In Charge
            </span>
            <h2 className="font-playfair text-3xl sm:text-5xl font-normal tracking-tight">
              Your life is yours to live.
            </h2>
            <p className="font-sans text-sm sm:text-base text-white/70 max-w-lg mx-auto leading-relaxed">
              Step into your fullest agency with the Naag Nool UP journals and community.
            </p>
            <div className="pt-4">
              <Link href="/shop">
                <Button variant="secondary" size="lg" className="bg-[#B85233] text-white hover:bg-[#A64426] border-none shadow-md">
                  Explore All Journals
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
