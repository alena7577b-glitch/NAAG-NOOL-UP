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
                <span className="font-cormorant italic text-[#B85233]">Naag Nool UP?</span>
              </h1>

              <p className="font-cormorant italic text-xl sm:text-2xl text-[#1E1C1A] font-medium leading-snug">
                &ldquo;The time to be ALIVE is now!&rdquo;
              </p>

              <p className="font-sans text-xs sm:text-sm lg:text-base text-[#6B655B] max-w-xl leading-relaxed">
                Naag Nool UP is a purpose-driven company dedicated to empowering individuals through healing, self-development, and self-love. By combining guided journals with meaningful community engagement, we create safe and inspiring spaces that encourage personal growth, emotional awareness, and mindful connection.
              </p>

              <div className="pt-1">
                <p className="font-sans text-xs sm:text-sm font-semibold uppercase tracking-wider text-[#B85233]">
                  Providing every woman and girl a room to let her strength show &mdash; HER WAY!
                </p>
              </div>
            </div>

            {/* Right Hero Image */}
            <div className="lg:col-span-6">
              <div className="relative aspect-[4/3] sm:aspect-[4/3] lg:aspect-[4/3] w-full rounded-2xl overflow-hidden shadow-md">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/about-hero-woman.jpg"
                  alt="Woman holding Buugga Riyooyinka journal in front of blooming garden"
                  className="w-full h-full object-cover object-[28%_center]"
                />
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 2. OUR STORY SECTION */}
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
                    src="/images/about-story-founder.jpg"
                    alt="Naag Nool UP founder portrait"
                    className="w-full h-full object-cover object-top"
                  />
                </div>
                {/* Secondary Lower Overlapping Image */}
                <div className="col-span-8 -mt-16 -ms-8 sm:-ms-12 rounded-xl overflow-hidden shadow-lg border-2 border-white aspect-[4/3] bg-[#FAF8F5] z-10">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/images/story-women-journals.jpg"
                    alt="Two women holding Naag Nool UP journals together"
                    className="w-full h-full object-cover object-center"
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
                BRAND STORY
              </p>
              <h2 className="font-playfair text-3xl sm:text-4xl lg:text-5xl font-normal text-[#1E1C1A] leading-[1.15]">
                How Naag Nool UP <br />
                <span className="font-cormorant italic text-[#B85233]">Began.</span>
              </h2>
              <div className="space-y-4 font-sans text-xs sm:text-sm text-[#5C5349] leading-relaxed">
                <p>
                  Naag Nool UP was born during one of the most uncertain chapters in modern history. During the Covid-19 lockdown, while the world stood still and daily life felt profoundly disconnected, one young woman found herself navigating an intimate struggle with identity, purpose, and raw emotion.
                </p>
                <p>
                  Alone in her apartment with endless time to reflect, she began decluttering her space &mdash; and stumbled across a few unused guided journals and forgotten blank notebooks tucked away in a drawer. What began as a simple ritual to pass the quiet hours quickly unfolded into a life-changing journey of deep self-discovery.
                </p>

                {/* Editorial Highlight Quote */}
                <div className="my-2 py-3 px-4 border-s-2 border-[#D49B4B] bg-[#FAF6F0] rounded-r-lg">
                  <p className="font-cormorant italic text-base sm:text-lg text-[#1E1C1A] leading-snug">
                    &ldquo;Page by page, prompt by prompt, she unpacked her thoughts, fears, dreams, and healing. Through journaling, she was finally able to put into words who she truly was &mdash; and who she was destined to become in a forever-changing world.&rdquo;
                  </p>
                </div>

                <p>
                  That profound transformation became the catalyst for Naag Nool UP &mdash; an empowering movement dedicated to helping women reconnect with their innermost power through guided journals, mindful self-reflection, and compassionate community.
                </p>
                <p className="font-medium text-[#1E1C1A]">
                  Naag Nool UP exists to empower women to heal, grow, live intentionally, and embrace life in the present moment &mdash; <span className="font-cormorant italic text-[#B85233] text-base">their way.</span>
                </p>
              </div>
              <div className="pt-2">
                <Link
                  href="/shop"
                  className="inline-flex items-center gap-2 rounded-md bg-[#B85233] text-white px-6 py-2.5 text-xs sm:text-sm font-medium hover:bg-[#A64426] transition-colors"
                >
                  <span>Explore the Journals</span>
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
              Let your strength show!
            </h2>
            <p className="font-sans text-xs sm:text-sm text-white/90 max-w-xl leading-relaxed">
              Naag Nool UP is a purpose-driven company dedicated to empowering individuals through healing, self-development, and self-love. By combining guided journals with meaningful community engagement, Naag Nool UP creates safe and inspiring spaces that encourage personal growth, emotional awareness, and mindful connection.
            </p>
            <p className="font-sans text-xs sm:text-sm text-white/80 max-w-xl leading-relaxed">
              The company&apos;s mission is to build a stronger, more emotionally intelligent community where people feel supported, seen, and empowered to thrive.
            </p>
            <div className="pt-2">
              <p className="font-cormorant italic text-xl sm:text-2xl text-[#D49B4B] leading-snug">
                &ldquo;Providing every woman and girl a room to let her strength show &mdash; HER WAY!&rdquo;
              </p>
            </div>
          </div>

          {/* Right Group Image */}
          <div className="lg:col-span-6 relative min-h-[300px] lg:min-h-full bg-[#3D4736]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/mission-women-community.jpg"
              alt="Two women sharing a moment with the Mogadishu coordinates notebook and Koobka Naag Nool mug"
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
