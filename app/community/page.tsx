import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, ArrowLeft, Leaf, Users, Heart, Sparkles, Check } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { CommunitySignupForm } from '@/components/forms/CommunitySignupForm';
import { InteractiveJourneyGame } from '@/components/community/InteractiveJourneyGame';

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
                Let your <br />
                <span className="font-cormorant italic text-[#B85233]">strength</span> show!
              </h1>

              <p className="font-sans text-xs sm:text-sm font-semibold tracking-wide uppercase text-[#B85233]">
                Providing every woman and girl a room to let her strength show &mdash; HER WAY!
              </p>

              <p className="font-sans text-xs sm:text-sm lg:text-base text-[#6B655B] max-w-xl leading-relaxed">
                Naag Nool UP is a purpose-driven company dedicated to empowering individuals through healing, self-development, and self-love. By combining guided journals with meaningful community engagement, Naag Nool UP creates safe and inspiring spaces that encourage personal growth, emotional awareness, and mindful connection.
              </p>

              <div className="pt-1">
                <p className="font-cormorant italic text-2xl sm:text-3xl text-[#B85233]">
                  The time to be ALIVE is now!
                </p>
              </div>

              <div className="pt-2 flex flex-wrap items-center gap-3">
                <a
                  href="#interactive-journey"
                  className="inline-flex items-center gap-2 justify-center rounded-md bg-[#B85233] text-white px-6 sm:px-7 py-3 text-xs sm:text-sm font-medium hover:bg-[#A64426] transition-colors shadow-sm"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>The Path of Naag Nool</span>
                </a>
                <a
                  href="#join-form"
                  className="inline-flex items-center gap-2 justify-center rounded-md bg-white border border-[#E5DFC0] text-[#1E1C1A] px-5 py-3 text-xs sm:text-sm font-medium hover:bg-[#FAF8F5] transition-colors shadow-2xs"
                >
                  <span>Join Direct</span>
                  <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
                </a>
              </div>
            </div>

            {/* Right Hero Image */}
            <div className="lg:col-span-6">
              <div className="relative aspect-[4/3] sm:aspect-[4/3] lg:aspect-[4/3] w-full rounded-2xl overflow-hidden shadow-md">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/community-hero-woman.jpg"
                  alt="Naag Nool UP community member"
                  className="w-full h-full object-cover object-[center_12%]"
                />
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

      {/* 3. INTERACTIVE LIFE-CHOICE JOURNEY GAME */}
      <div id="interactive-journey" className="scroll-mt-16">
        <InteractiveJourneyGame />
      </div>

      {/* 4. WHAT TO EXPECT (Split Section) */}
      <section className="py-0 bg-[#4D5844] text-white overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[480px]">
          {/* Left Group Image */}
          <div className="lg:col-span-6 relative min-h-[420px] lg:min-h-full bg-[#3D4736]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/community-sisterhood-gathering.jpg"
              alt="Diverse sisterhood community gathered together laughing and conversing outdoors at sunset"
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
            <p className="font-sans text-xs sm:text-sm text-white/85 max-w-xl leading-relaxed">
              Our community is a sanctuary to share openly, reflect deeply, and grow courageously. Through guided journal prompts, mindful emotional intelligence resources, and intimate sisterhood circles, you will always have a welcoming room to let your strength show &mdash; your way.
            </p>

            <ul className="space-y-3 pt-2 font-sans text-xs sm:text-sm text-white/90">
              <li className="flex items-center gap-3">
                <div className="h-5 w-5 rounded-full bg-white/20 text-white flex items-center justify-center shrink-0">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span>Curated guided journal prompts & mindfulness reflections</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="h-5 w-5 rounded-full bg-white/20 text-white flex items-center justify-center shrink-0">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span>Monthly personal growth challenges & supportive sister circles</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="h-5 w-5 rounded-full bg-white/20 text-white flex items-center justify-center shrink-0">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span>Exclusive updates on the Ayeeyo Koris Children Scholarship & community grants</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="h-5 w-5 rounded-full bg-white/20 text-white flex items-center justify-center shrink-0">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span>An authentic, emotionally intelligent community where you are seen and valued</span>
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
              <div className="flex items-center gap-2">
                <span className="w-4 h-[1.5px] bg-[#B85233]" />
                <p className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-[#B85233]">
                  BECOME A NAAG NOOL
                </p>
              </div>
              <h2 className="font-playfair text-3xl sm:text-4xl lg:text-5xl font-normal text-[#1E1C1A] leading-[1.15]">
                Your seat in the circle <br />
                is waiting.
              </h2>
              <p className="font-sans text-xs sm:text-sm text-[#6B655B] max-w-lg leading-relaxed">
                Naag Nool UP is dedicated to building a stronger, more emotionally intelligent community where women feel supported, seen, and empowered to thrive. Complete the membership sign-up sheet below to join our sisterhood, access members-only discussions, and receive free daily affirmations delivered straight to your morning routine.
              </p>
              <div className="pt-2">
                <p className="font-cormorant italic text-2xl sm:text-3xl text-[#B85233]">
                  The time to be ALIVE is now!
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
