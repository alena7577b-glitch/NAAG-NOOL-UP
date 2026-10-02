import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight, BookOpen, Sprout, Users, Heart } from 'lucide-react';
import { Container } from '@/components/ui/Container';

export const metadata: Metadata = {
  title: 'Ayeyo Koris — Naag Nool UP',
  description:
    'More than a cause. A lasting impact. Ayeyo Koris is Naag Nool UP’s commitment to investing in education, opportunity and brighter futures for women and girls.',
};

export default function AyeyoKorisPage() {
  return (
    <div className="space-y-0 overflow-hidden">
      {/* 1. HERO SECTION */}
      <section className="relative bg-[#F9F6F0] py-12 sm:py-16 lg:py-24 border-b border-[#E5DFC0]/50">
        <Container size="default">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-6 space-y-6 text-start">
              <p className="font-sans text-xs font-semibold uppercase tracking-[0.25em] text-[#B85233]">
                AYEYO KORIS
              </p>

              <h1 className="font-playfair text-4xl sm:text-6xl lg:text-7xl font-normal text-[#1E1C1A] leading-[1.08] tracking-tight">
                More than a cause. <br />
                A lasting impact.
              </h1>

              <p className="font-sans text-xs sm:text-sm lg:text-base text-[#6B655B] max-w-xl leading-relaxed">
                Ayeyo Koris is Naag Nool UP’s commitment to creating real change. Through your support and purchases, we invest in education, opportunity and brighter futures for women and girls in our communities.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <a
                  href="#get-involved"
                  className="inline-flex items-center gap-1.5 justify-center rounded-md bg-[#B85233] text-white px-6 sm:px-7 py-3 text-xs sm:text-sm font-medium hover:bg-[#A64426] transition-colors shadow-sm"
                >
                  <span>Support / Donate</span>
                  <ArrowUpRight className="w-4 h-4" />
                </a>
                <Link
                  href="/community"
                  className="inline-flex items-center justify-center rounded-md bg-transparent border border-[#1E1C1A]/40 text-[#1E1C1A] px-6 sm:px-7 py-3 text-xs sm:text-sm font-medium hover:bg-[#EAE5DC]/60 transition-colors"
                >
                  Join the Movement
                </Link>
              </div>
            </div>

            {/* Right Hero Image */}
            <div className="lg:col-span-6">
              <div className="relative aspect-[4/5] sm:aspect-[1/1] lg:aspect-[4/5] w-full rounded-2xl overflow-hidden shadow-lg border border-[#E5DFC0]/60 bg-[#FAF8F5]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/hero-portrait.svg"
                  alt="Woman in terracotta hijab against warm mountains"
                  className="w-full h-full object-cover object-center"
                />
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 2. WHAT IS AYEYO KORIS? */}
      <section className="py-16 sm:py-24 bg-[#FAF8F5] border-b border-[#E5DFC0]/50">
        <Container size="default">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* Left Content */}
            <div className="lg:col-span-6 space-y-5">
              <p className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-[#B85233]">
                WHAT IS AYEYO KORIS?
              </p>
              <h2 className="font-playfair text-3xl sm:text-4xl lg:text-5xl font-normal text-[#1E1C1A] leading-[1.15]">
                When a woman rises, <br />
                her community rises.
              </h2>
              <p className="font-sans text-xs sm:text-sm text-[#6B655B] leading-relaxed">
                Ayeyo Koris means &ldquo;support&rdquo; and &ldquo;uplift&rdquo; in Somali. It is a community-driven initiative that stands beside women and girls, helping them access education, resources and opportunities to build better, brighter futures.
              </p>
              <div className="ps-4 border-s-2 border-[#D49B4B] pt-1">
                <p className="font-cormorant italic text-2xl text-[#B85233]">
                  Stronger women. <br />
                  Stronger communities.
                </p>
              </div>
            </div>

            {/* Right Image: School Girls */}
            <div className="lg:col-span-6">
              <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden shadow-md border border-[#E5DFC0]/60 bg-[#FAF8F5]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/ayeyo-hero.svg"
                  alt="Young girls smiling holding school books"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 3. OUR CONNECTION (Naag Nool UP & Ayeyo Koris) */}
      <section className="py-16 sm:py-24 bg-[#4D5844] text-white">
        <Container size="default">
          <div className="relative rounded-2xl bg-[#444F3B] border border-white/10 p-8 sm:p-12 lg:p-16 overflow-hidden">
            {/* Botanical Background Watermark */}
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
                  OUR CONNECTION
                </p>
                <h2 className="font-playfair text-3xl sm:text-4xl lg:text-5xl font-normal text-white">
                  Naag Nool UP & Ayeyo Koris
                </h2>
                <p className="font-sans text-xs sm:text-sm text-white/80 max-w-xl leading-relaxed">
                  Every journal you purchase helps fuel the movement. A portion of proceeds goes toward Ayeyo Koris, supporting education, training and empowerment programs for women and girls in need.
                </p>
                <div className="pt-2">
                  <Link
                    href="/shop"
                    className="inline-flex items-center gap-2 rounded-full bg-white text-[#1E1C1A] px-7 py-3 text-xs sm:text-sm font-medium hover:bg-[#FAF8F5] transition-colors shadow-sm"
                  >
                    <span>Learn More</span>
                    <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
                  </Link>
                </div>
              </div>

              {/* Right Image & Script Text */}
              <div className="lg:col-span-5 space-y-3">
                <div className="relative aspect-[4/3] rounded-xl overflow-hidden shadow-lg border border-white/20 bg-[#FAF8F5]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/images/hero-portrait.svg"
                    alt="Woman in hijab looking toward village"
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="font-cormorant italic text-xl text-[#D49B4B] text-end">
                  Real support. Real change.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 4. THE IMPACT ("Creating opportunities. Building futures.") */}
      <section className="py-16 sm:py-24 bg-[#FAF8F5] border-b border-[#E5DFC0]/50">
        <Container size="default">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* Left Content & 4 Impact Pillars */}
            <div className="lg:col-span-6 space-y-6">
              <div className="space-y-4">
                <p className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-[#B85233]">
                  THE IMPACT
                </p>
                <h2 className="font-playfair text-3xl sm:text-4xl lg:text-5xl font-normal text-[#1E1C1A] leading-[1.15]">
                  Creating opportunities. <br />
                  Building futures.
                </h2>
                <p className="font-sans text-xs sm:text-sm text-[#6B655B] leading-relaxed">
                  Through Ayeyo Koris, we support access to education, provide resources and create pathways for women and girls to reach their full potential. Every contribution helps bring hope, confidence and new possibilities.
                </p>
              </div>

              {/* 4 Impact Pillars Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
                <div className="space-y-2 text-center sm:text-start">
                  <div className="w-10 h-10 rounded-full bg-[#F4EFE6] border border-[#E5DFC0] text-[#B85233] flex items-center justify-center mx-auto sm:mx-0">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <h4 className="font-playfair text-xs sm:text-sm text-[#1E1C1A] font-semibold">Education Support</h4>
                </div>

                <div className="space-y-2 text-center sm:text-start">
                  <div className="w-10 h-10 rounded-full bg-[#F4EFE6] border border-[#E5DFC0] text-[#4D5844] flex items-center justify-center mx-auto sm:mx-0">
                    <Sprout className="w-4 h-4" />
                  </div>
                  <h4 className="font-playfair text-xs sm:text-sm text-[#1E1C1A] font-semibold">Skills & Training Programs</h4>
                </div>

                <div className="space-y-2 text-center sm:text-start">
                  <div className="w-10 h-10 rounded-full bg-[#F4EFE6] border border-[#E5DFC0] text-[#D49B4B] flex items-center justify-center mx-auto sm:mx-0">
                    <Users className="w-4 h-4" />
                  </div>
                  <h4 className="font-playfair text-xs sm:text-sm text-[#1E1C1A] font-semibold">Community Empowerment</h4>
                </div>

                <div className="space-y-2 text-center sm:text-start">
                  <div className="w-10 h-10 rounded-full bg-[#F4EFE6] border border-[#E5DFC0] text-[#B85233] flex items-center justify-center mx-auto sm:mx-0">
                    <Heart className="w-4 h-4" />
                  </div>
                  <h4 className="font-playfair text-xs sm:text-sm text-[#1E1C1A] font-semibold">Brighter Futures</h4>
                </div>
              </div>
            </div>

            {/* Right: Triple Image Showcase */}
            <div className="lg:col-span-6 grid grid-cols-12 gap-4 items-center">
              <div className="col-span-7 rounded-xl overflow-hidden shadow-md border border-[#E5DFC0]/60 aspect-[4/5] bg-[#FAF8F5]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/writing-hands.svg"
                  alt="Girl writing in notebook"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="col-span-5 space-y-4">
                <div className="rounded-xl overflow-hidden shadow-sm border border-[#E5DFC0]/60 aspect-[4/3] bg-[#FAF8F5]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/images/somali-women-group.svg"
                    alt="Women in study group"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="rounded-xl overflow-hidden shadow-sm border border-[#E5DFC0]/60 aspect-[4/3] bg-[#FAF8F5]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/images/community-circle.svg"
                    alt="Women walking together at sunset"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 5. GET INVOLVED BANNER */}
      <section id="get-involved" className="py-16 sm:py-24 bg-[#B85233] text-white relative overflow-hidden">
        <div className="absolute top-0 start-0 w-64 h-80 text-white/10 pointer-events-none">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/botanical-branch.svg"
            alt="Botanical sketch"
            className="w-full h-full object-contain"
          />
        </div>

        <Container size="default">
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-4">
              <p className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-[#FAF8F5]/90">
                GET INVOLVED
              </p>
              <h2 className="font-playfair text-3xl sm:text-4xl lg:text-5xl font-normal text-white">
                Be part of something bigger.
              </h2>
              <p className="font-sans text-xs sm:text-sm text-white/90 max-w-xl leading-relaxed">
                You can make a difference. Support Ayeyo Koris or join our community and be part of the Naag Nool UP movement.
              </p>
            </div>

            {/* Right Buttons */}
            <div className="lg:col-span-5 flex flex-wrap items-center lg:justify-end gap-4">
              <a
                href="https://ayeyokoris.org"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 justify-center rounded-md bg-white text-[#1E1C1A] px-6 py-3 text-xs sm:text-sm font-medium hover:bg-[#FAF8F5] transition-colors shadow-sm"
              >
                <span>Support / Donate</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>
              <Link
                href="/community"
                className="inline-flex items-center gap-1.5 justify-center rounded-md bg-transparent border border-white text-white px-6 py-3 text-xs sm:text-sm font-medium hover:bg-white/10 transition-colors"
              >
                <span>Join the Community</span>
                <ArrowRight className="w-4 h-4 rtl:rotate-180" />
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
