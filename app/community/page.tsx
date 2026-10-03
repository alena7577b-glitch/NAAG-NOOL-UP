import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, ArrowLeft, Leaf, Users, Heart, Sparkles, Check } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { CommunitySignupForm } from '@/components/forms/CommunitySignupForm';

export const metadata: Metadata = {
  title: 'Community — Naag Nool UP',
  description:
    'Real women. A stronger circle. Join the Naag Nool UP community — a space for women who support, encourage and grow together.',
};

export default function CommunityPage() {
  return (
    <div className="space-y-0 overflow-hidden">
      {/* 1. HERO SECTION */}
      <section className="relative bg-[#F9F6F0] py-12 sm:py-16 lg:py-24 border-b border-[#E5DFC0]/50">
        <Container size="default">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-6 space-y-6 text-start">
              <p className="font-sans text-xs font-semibold uppercase tracking-[0.25em] text-[#B85233]">
                COMMUNITY
              </p>

              <h1 className="font-playfair text-4xl sm:text-6xl lg:text-7xl font-normal text-[#1E1C1A] leading-[1.08] tracking-tight">
                Real women. <br />
                A stronger circle.
              </h1>

              <p className="font-sans text-xs sm:text-sm lg:text-base text-[#6B655B] max-w-xl leading-relaxed">
                Join the Naag Nool UP community — a space for women who support, encourage and grow together. Here, you’ll find inspiration, resources and a sisterhood that believes in your potential.
              </p>

              <div className="pt-2">
                <a
                  href="#join-form"
                  className="inline-flex items-center gap-2 justify-center rounded-md bg-[#B85233] text-white px-6 sm:px-7 py-3 text-xs sm:text-sm font-medium hover:bg-[#A64426] transition-colors shadow-sm"
                >
                  <span>Join the Community</span>
                  <ArrowRight className="w-4 h-4 rtl:rotate-180" />
                </a>
              </div>
            </div>

            {/* Right Hero Image */}
            <div className="lg:col-span-6 relative">
              <div className="relative aspect-[4/3] sm:aspect-[4/3] lg:aspect-[4/3] w-full rounded-2xl overflow-hidden shadow-md">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/hero-woman-portrait.png"
                  alt="Woman in terracotta hijab against mountains"
                  className="w-full h-full object-cover object-center"
                />
              </div>
              <div className="absolute top-4 end-4 z-10">
                <p className="font-cormorant italic text-2xl sm:text-3xl text-[#B85233] drop-shadow-sm">
                  Together we rise.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 2. WHY JOIN? */}
      <section className="py-16 sm:py-24 bg-[#FAF8F5] border-b border-[#E5DFC0]/50">
        <Container size="default">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* Left Content */}
            <div className="lg:col-span-6 space-y-5">
              <p className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-[#B85233]">
                WHY JOIN?
              </p>
              <h2 className="font-playfair text-3xl sm:text-4xl lg:text-5xl font-normal text-[#1E1C1A] leading-[1.15]">
                More than a community. <br />
                It&apos;s a movement.
              </h2>
              <p className="font-sans text-xs sm:text-sm text-[#6B655B] leading-relaxed">
                When you join Naag Nool UP, you become part of a growing circle of women who choose growth, courage and change. Together, we create opportunities, share knowledge and uplift one another.
              </p>
              <div className="pt-1">
                <Link
                  href="/about"
                  className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-[#B85233] hover:underline"
                >
                  <span>Learn More About Naag Nool UP</span>
                  <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
                </Link>
              </div>
            </div>

            {/* Right: 4 Circular Feature Cards */}
            <div className="lg:col-span-6 grid grid-cols-2 gap-4 sm:gap-6">
              <div className="space-y-2 text-center p-5 rounded-xl bg-white border border-[#E5DFC0]/60 shadow-sm">
                <div className="w-12 h-12 rounded-full bg-[#FAF8F5] border border-[#E5DFC0] text-[#4D5844] flex items-center justify-center mx-auto">
                  <Leaf className="w-5 h-5" />
                </div>
                <h4 className="font-playfair text-base text-[#1E1C1A] font-semibold">Support</h4>
                <p className="font-sans text-xs text-[#6B655B] leading-relaxed">
                  Find encouragement in every season of your journey.
                </p>
              </div>

              <div className="space-y-2 text-center p-5 rounded-xl bg-white border border-[#E5DFC0]/60 shadow-sm">
                <div className="w-12 h-12 rounded-full bg-[#FAF8F5] border border-[#E5DFC0] text-[#D49B4B] flex items-center justify-center mx-auto">
                  <Users className="w-5 h-5" />
                </div>
                <h4 className="font-playfair text-base text-[#1E1C1A] font-semibold">Learn</h4>
                <p className="font-sans text-xs text-[#6B655B] leading-relaxed">
                  Access resources, workshops and useful tools.
                </p>
              </div>

              <div className="space-y-2 text-center p-5 rounded-xl bg-white border border-[#E5DFC0]/60 shadow-sm">
                <div className="w-12 h-12 rounded-full bg-[#FAF8F5] border border-[#E5DFC0] text-[#B85233] flex items-center justify-center mx-auto">
                  <Heart className="w-5 h-5" />
                </div>
                <h4 className="font-playfair text-base text-[#1E1C1A] font-semibold">Connect</h4>
                <p className="font-sans text-xs text-[#6B655B] leading-relaxed">
                  Build meaningful friendships and sisterhood.
                </p>
              </div>

              <div className="space-y-2 text-center p-5 rounded-xl bg-white border border-[#E5DFC0]/60 shadow-sm">
                <div className="w-12 h-12 rounded-full bg-[#FAF8F5] border border-[#E5DFC0] text-[#1E1C1A] flex items-center justify-center mx-auto">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h4 className="font-playfair text-base text-[#1E1C1A] font-semibold">Grow</h4>
                <p className="font-sans text-xs text-[#6B655B] leading-relaxed">
                  Turn your dreams into real plans and action.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 3. WHAT TO EXPECT (Split Section) */}
      <section className="py-0 bg-[#4D5844] text-white overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[480px]">
          {/* Left Group Image */}
          <div className="lg:col-span-6 relative min-h-[300px] lg:min-h-full bg-[#3D4736]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/somali-women-group.png"
              alt="Group of smiling women sitting outdoors in sisterhood"
              className="w-full h-full object-cover object-center"
            />
          </div>

          {/* Right Green Block */}
          <div className="lg:col-span-6 p-8 sm:p-12 lg:p-16 flex flex-col justify-center space-y-6 relative">
            {/* Botanical Watermark */}
            <div className="absolute top-0 end-0 w-48 h-64 text-white/10 pointer-events-none">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/botanical-branch.svg"
                alt="Botanical sketch"
                className="w-full h-full object-contain"
              />
            </div>

            <p className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-[#D49B4B]">
              WHAT TO EXPECT
            </p>
            <h2 className="font-playfair text-3xl sm:text-4xl lg:text-5xl font-normal leading-[1.15]">
              A safe space. Real conversations. Lasting impact.
            </h2>
            <p className="font-sans text-xs sm:text-sm text-white/80 max-w-xl leading-relaxed">
              Our community is a place to share, ask, learn and be inspired. From journal prompts and self-development resources to exclusive updates and events, you’ll always have a place here.
            </p>

            <ul className="space-y-3 pt-2 font-sans text-xs sm:text-sm text-white/90">
              <li className="flex items-center gap-3">
                <div className="h-5 w-5 rounded-full bg-white/20 text-white flex items-center justify-center shrink-0">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span>Exclusive content & resources</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="h-5 w-5 rounded-full bg-white/20 text-white flex items-center justify-center shrink-0">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span>Monthly challenges & conversations</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="h-5 w-5 rounded-full bg-white/20 text-white flex items-center justify-center shrink-0">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span>Updates on Ayeyo Koris and Naag Nool UP</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="h-5 w-5 rounded-full bg-white/20 text-white flex items-center justify-center shrink-0">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span>A supportive and respectful community</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* 4. JOIN TODAY FORM */}
      <section id="join-form" className="py-16 sm:py-24 bg-[#FAF8F5] border-b border-[#E5DFC0]/50">
        <Container size="default">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* Left Column */}
            <div className="lg:col-span-6 space-y-6">
              <p className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-[#B85233]">
                JOIN TODAY
              </p>
              <h2 className="font-playfair text-3xl sm:text-4xl lg:text-5xl font-normal text-[#1E1C1A] leading-[1.15]">
                Be part of something bigger.
              </h2>
              <p className="font-sans text-xs sm:text-sm text-[#6B655B] max-w-lg leading-relaxed">
                Your voice, your story and your presence matter. Join Naag Nool UP and help build a stronger, more empowered future for women and girls.
              </p>
              <div className="pt-2">
                <p className="font-cormorant italic text-2xl sm:text-3xl text-[#B85233]">
                  Stronger women. <br />
                  Stronger communities.
                </p>
              </div>
            </div>

            {/* Right Column: Form Card */}
            <div className="lg:col-span-6">
              <div className="rounded-2xl bg-white border border-[#E5DFC0] p-6 sm:p-8 shadow-sm">
                <CommunitySignupForm />
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 5. OUR COMMUNITY VOICES */}
      <section className="relative bg-[#1E1C1A] text-white py-16 sm:py-24 overflow-hidden border-t border-white/10">
        <div 
          className="absolute inset-0 bg-cover bg-center pointer-events-none opacity-40 mix-blend-overlay"
          style={{ backgroundImage: 'url(/images/sunset-banner.svg)' }}
        />
        <Container size="default">
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Content */}
            <div className="lg:col-span-8 space-y-4">
              <p className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-[#D49B4B]">
                Our Community Voices
              </p>
              <blockquote className="font-playfair italic text-2xl sm:text-3xl text-white/95 leading-snug">
                &ldquo;Naag Nool UP has reminded me that I am not alone. This community gives me strength, ideas and hope.&rdquo;
              </blockquote>
              <p className="font-sans text-xs font-medium text-white/70">
                — Community Member
              </p>
            </div>

            {/* Right Slider Arrows */}
            <div className="lg:col-span-4 flex items-center lg:justify-end gap-3">
              <button
                type="button"
                aria-label="Previous testimonial"
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
              </button>
              <button
                type="button"
                aria-label="Next testimonial"
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <ArrowRight className="w-4 h-4 rtl:rotate-180" />
              </button>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
