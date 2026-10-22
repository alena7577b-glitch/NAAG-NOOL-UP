'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Heart,
  Users,
  BookOpen,
  Sprout,
  Menu,
  X,
  CheckCircle2,
  Sparkles,
  GraduationCap,
} from 'lucide-react';
import { AyeeyoTypographyTransition } from './AyeeyoTypographyTransition';

export function AyeyoKorisView() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [supportModalOpen, setSupportModalOpen] = useState(false);
  const [selectedTier, setSelectedTier] = useState<number>(50);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [donorEmail, setDonorEmail] = useState<string>('');
  const [donorName, setDonorName] = useState<string>('');
  const [isPledged, setIsPledged] = useState<boolean>(false);

  const handlePledgeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!donorEmail) return;
    setIsPledged(true);
  };

  const openSupportModal = (presetAmount?: number) => {
    if (presetAmount) setSelectedTier(presetAmount);
    setIsPledged(false);
    setSupportModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1E1C1A] selection:bg-[#D3A03A]/30 selection:text-[#0A3929] overflow-x-hidden">
      {/* =========================================================================
          1. DEDICATED AYEEYO KORIS HEADER
      ========================================================================= */}
      <header className="sticky top-0 z-40 w-full bg-[#FFFFFF]/95 backdrop-blur-md border-b border-[#E5DFC0]/70 transition-all duration-200">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-8 lg:px-12">
          <div className="flex h-20 items-center justify-between gap-6">
            {/* Logo */}
            <Link
              href="/ayeyo-koris"
              className="flex items-center gap-2 group focus-visible:outline-none"
              aria-label="Ayeeyo Koris Non-Profit Home"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/ayeeyo-koris-logo.png"
                alt="Ayeeyo Koris"
                className="h-10 sm:h-11 md:h-12 w-auto object-contain transition-transform duration-200 group-hover:scale-[1.02]"
              />
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-7 lg:gap-9">
              <Link
                href="/"
                className="font-sans text-xs sm:text-[13px] font-medium text-[#4A544E] hover:text-[#0A3929] transition-colors"
              >
                Home
              </Link>
              <Link
                href="/about"
                className="font-sans text-xs sm:text-[13px] font-medium text-[#4A544E] hover:text-[#0A3929] transition-colors"
              >
                About
              </Link>
              <Link
                href="/ayeyo-koris"
                className="font-sans text-xs sm:text-[13px] font-semibold text-[#0A3929] border-b-2 border-[#D3A03A] pb-1 transition-colors"
              >
                Ayeeyo Koris
              </Link>
              <Link
                href="/community"
                className="font-sans text-xs sm:text-[13px] font-medium text-[#4A544E] hover:text-[#0A3929] transition-colors"
              >
                Community
              </Link>
              <a
                href="#get-involved"
                className="font-sans text-xs sm:text-[13px] font-medium text-[#4A544E] hover:text-[#0A3929] transition-colors"
              >
                Get Involved
              </a>
            </nav>

            {/* Support Us CTA */}
            <div className="hidden sm:flex items-center gap-3">
              <button
                type="button"
                onClick={() => openSupportModal(50)}
                className="inline-flex items-center gap-1.5 bg-[#D3A03A] hover:bg-[#C29130] text-[#1E1C1A] text-xs sm:text-[13px] font-semibold px-5 sm:px-6 py-2.5 rounded-full transition-all duration-200 shadow-sm hover:shadow active:scale-[0.98]"
              >
                <span>Support Us</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Mobile Menu Toggle Button */}
            <div className="flex md:hidden items-center gap-2">
              <button
                type="button"
                onClick={() => openSupportModal(25)}
                className="bg-[#D3A03A] text-[#1E1C1A] text-xs font-semibold px-3.5 py-1.5 rounded-full"
              >
                Support Us
              </button>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-[#0A3929] rounded-lg hover:bg-[#F2ECE1]"
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#FFFFFF] border-b border-[#E5DFC0] px-6 py-5 space-y-4 shadow-lg animate-in slide-in-from-top-2 duration-200">
            <nav className="flex flex-col space-y-3 font-sans text-sm">
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className="text-[#4A544E] hover:text-[#0A3929] py-1"
              >
                Home
              </Link>
              <Link
                href="/about"
                onClick={() => setMobileMenuOpen(false)}
                className="text-[#4A544E] hover:text-[#0A3929] py-1"
              >
                About
              </Link>
              <Link
                href="/ayeyo-koris"
                onClick={() => setMobileMenuOpen(false)}
                className="font-semibold text-[#0A3929] border-s-2 border-[#D3A03A] ps-2 py-1"
              >
                Ayeeyo Koris
              </Link>
              <Link
                href="/community"
                onClick={() => setMobileMenuOpen(false)}
                className="text-[#4A544E] hover:text-[#0A3929] py-1"
              >
                Community
              </Link>
              <a
                href="#get-involved"
                onClick={() => setMobileMenuOpen(false)}
                className="text-[#4A544E] hover:text-[#0A3929] py-1"
              >
                Get Involved
              </a>
            </nav>
            <div className="pt-2 border-t border-[#E5DFC0]/60">
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  openSupportModal(50);
                }}
                className="w-full justify-center inline-flex items-center gap-2 bg-[#D3A03A] text-[#1E1C1A] text-xs font-semibold px-5 py-3 rounded-full"
              >
                <span>Support Ayeeyo Koris</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </header>

      {/* =========================================================================
          2. HERO SECTION: Grandmothers Raise Tomorrow
      ========================================================================= */}
      <section className="relative w-full bg-[#181512] text-white overflow-hidden min-h-[540px] sm:min-h-[600px] lg:min-h-[660px] flex items-center">
        {/* Background Canvas: Full Official Sunset Hero Banner pinned to the right */}
        <div className="absolute inset-0 z-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/ayeeyo-hero-family.jpg"
            alt="Ayeeyo Koris - Somali grandmother with grandson and granddaughter at sunset"
            className="w-full h-full object-cover object-right lg:object-[right_center]"
          />
          {/* Deep Cinematic Gradient Overlay: Darker on the left to create a dedicated reading pane */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#14120F] via-[#14120F]/95 via-35% sm:via-[#14120F]/80 sm:via-45% lg:via-[#14120F]/45 lg:via-55% to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#14120F]/85 via-transparent to-transparent sm:hidden" />
        </div>

        {/* Hero Content - Confined to the far left */}
        <div className="relative z-10 w-full max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-14 xl:px-16 py-16 sm:py-24 lg:py-32">
          <div className="max-w-md lg:max-w-[460px] xl:max-w-[500px] space-y-5 sm:space-y-6 text-start">
            {/* Tag / Eyebrow */}
            <p className="font-sans text-xs sm:text-[13px] font-semibold uppercase tracking-[0.25em] text-[#D3A03A]">
              AYEEYO KORIS
            </p>

            {/* Headline */}
            <h1 className="font-playfair text-3xl sm:text-4xl lg:text-[3.25rem] font-normal text-white leading-[1.12] tracking-tight">
              Grandmothers <br />
              Raise Tomorrow
            </h1>

            {/* Narrative Paragraph */}
            <p className="font-sans text-xs sm:text-sm lg:text-[14.5px] text-[#E0D8C9] leading-[1.8] font-normal">
              Ayeeyo Koris is about the boys and girls who are raised by their grandmothers when their parents are absent, have passed away, or are unable to provide care. It&apos;s a story of love, responsibility, resilience and hope.
            </p>

            {/* CTA Button */}
            <div className="pt-2 sm:pt-3">
              <a
                href="#about-ayeeyo"
                className="inline-flex items-center gap-2 bg-[#D3A03A] hover:bg-[#C29130] text-[#1E1C1A] text-xs sm:text-[13px] font-semibold px-6 sm:px-7 py-3 rounded-full transition-all duration-200 shadow-md hover:shadow-lg active:scale-[0.98]"
              >
                <span>Learn More</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          HERO TEXT ANIMATION (Ayeeyo Koris Brand Affirmations Marquee)
      ========================================================================= */}
      <AyeeyoTypographyTransition />

      {/* =========================================================================
          3. SECTION: ABOUT AYEEYO KORIS (Care Today. Opportunity Tomorrow.)
      ========================================================================= */}
      <section id="about-ayeeyo" className="py-16 sm:py-24 lg:py-28 bg-[#FAF8F5] border-b border-[#E5DFC0]/50">
        <div className="max-w-[1360px] mx-auto px-6 sm:px-10 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
            {/* Left Content */}
            <div className="lg:col-span-6 space-y-6">
              <p className="font-sans text-xs sm:text-[12px] font-semibold uppercase tracking-[0.22em] text-[#A8741A]">
                ABOUT AYEEYO KORIS
              </p>

              <h2 className="font-playfair text-3xl sm:text-4xl lg:text-[2.75rem] font-normal text-[#0A3929] leading-[1.15] tracking-tight">
                Care Today. <br />
                Opportunity Tomorrow.
              </h2>

              <p className="font-sans text-xs sm:text-sm lg:text-[14.5px] text-[#4A544E] leading-[1.8] font-normal">
                Ayeeyo Koris supports children who are raised by their grandmothers, honoring the strength of Somali families and the vital role of grandmothers in shaping confident, capable, and hopeful futures.
              </p>

              {/* Dividing Accent Line */}
              <div className="w-14 h-0.5 bg-[#D3A03A]" />

              <p className="font-sans text-xs sm:text-sm lg:text-[14.5px] text-[#4A544E] leading-[1.8] font-normal">
                This is not just a story of hardship — it&apos;s a story of care, agency, education, and opportunity.
              </p>
            </div>

            {/* Right Photo: Grandmother & Grandchildren */}
            <div className="lg:col-span-6 flex justify-center lg:justify-end">
              <div className="relative w-full max-w-lg aspect-[3/2] rounded-2xl overflow-hidden shadow-lg border border-[#E5DFC0]/70 bg-[#FAF8F5] group">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/ayeeyo-about-family.jpg"
                  alt="Somali grandmother with her three grandchildren smiling together outdoors"
                  className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          4. SECTION: WHAT AYEEYO KORIS MEANS (4 Core Pillars in Deep Forest Green)
      ========================================================================= */}
      <section className="py-20 sm:py-24 lg:py-28 bg-[#0A3929] text-white relative overflow-hidden">
        {/* Subtle geometric background motif */}
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M0,0 L100,100 M100,0 L0,100" stroke="#FFFFFF" strokeWidth="0.5" />
          </svg>
        </div>

        <div className="relative z-10 max-w-[1360px] mx-auto px-6 sm:px-10 lg:px-12">
          {/* Eyebrow Header */}
          <div className="text-center max-w-2xl mx-auto mb-14 sm:mb-18">
            <p className="font-sans text-xs sm:text-[13px] font-semibold uppercase tracking-[0.25em] text-[#D3A03A]">
              WHAT AYEEYO KORIS MEANS
            </p>
          </div>

          {/* 4 Pillars Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
            {/* 1. Love & Care */}
            <div className="flex flex-col items-center text-center space-y-4 p-4 rounded-xl transition-transform duration-300 hover:-translate-y-1">
              <div className="w-16 h-16 rounded-full border border-[#D3A03A] flex items-center justify-center text-[#D3A03A] bg-[#0A3929]/50 shadow-inner">
                <Heart className="w-6 h-6 stroke-[1.75]" />
              </div>
              <h3 className="font-playfair text-xl sm:text-2xl font-normal text-white">
                Love &amp; Care
              </h3>
              <p className="font-sans text-xs sm:text-[13px] text-[#B7CDC3] leading-[1.7] max-w-xs">
                Grandmothers provide unwavering love, stability and a sense of belonging.
              </p>
            </div>

            {/* 2. Resilience */}
            <div className="flex flex-col items-center text-center space-y-4 p-4 rounded-xl transition-transform duration-300 hover:-translate-y-1">
              <div className="w-16 h-16 rounded-full border border-[#D3A03A] flex items-center justify-center text-[#D3A03A] bg-[#0A3929]/50 shadow-inner">
                <Users className="w-6 h-6 stroke-[1.75]" />
              </div>
              <h3 className="font-playfair text-xl sm:text-2xl font-normal text-white">
                Resilience
              </h3>
              <p className="font-sans text-xs sm:text-[13px] text-[#B7CDC3] leading-[1.7] max-w-xs">
                Children grow with strength, dignity and a belief in their future.
              </p>
            </div>

            {/* 3. Education */}
            <div className="flex flex-col items-center text-center space-y-4 p-4 rounded-xl transition-transform duration-300 hover:-translate-y-1">
              <div className="w-16 h-16 rounded-full border border-[#D3A03A] flex items-center justify-center text-[#D3A03A] bg-[#0A3929]/50 shadow-inner">
                <BookOpen className="w-6 h-6 stroke-[1.75]" />
              </div>
              <h3 className="font-playfair text-xl sm:text-2xl font-normal text-white">
                Education
              </h3>
              <p className="font-sans text-xs sm:text-[13px] text-[#B7CDC3] leading-[1.7] max-w-xs">
                Learning opens doors, builds confidence and creates new possibilities.
              </p>
            </div>

            {/* 4. Stronger Families */}
            <div className="flex flex-col items-center text-center space-y-4 p-4 rounded-xl transition-transform duration-300 hover:-translate-y-1">
              <div className="w-16 h-16 rounded-full border border-[#D3A03A] flex items-center justify-center text-[#D3A03A] bg-[#0A3929]/50 shadow-inner">
                <Sprout className="w-6 h-6 stroke-[1.75]" />
              </div>
              <h3 className="font-playfair text-xl sm:text-2xl font-normal text-white">
                Stronger Families
              </h3>
              <p className="font-sans text-xs sm:text-[13px] text-[#B7CDC3] leading-[1.7] max-w-xs">
                Supporting grandmothers and children strengthens our communities.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          5. SECTION: THE POWER OF GRANDMOTHERS (Their Care Builds Strong Futures)
      ========================================================================= */}
      <section className="relative py-20 sm:py-28 lg:py-32 bg-[#FAF8F5] border-b border-[#E5DFC0]/60 overflow-hidden">
        {/* Ambient Warm Gradients */}
        <div className="absolute top-0 right-1/4 w-[420px] h-[420px] bg-[#D3A03A]/8 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 left-10 w-[360px] h-[360px] bg-[#0A3929]/5 rounded-full blur-3xl pointer-events-none" />
        {/* Subtle Botanical Watermark */}
        <div className="absolute top-10 right-8 w-40 h-56 opacity-5 pointer-events-none">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/botanical-branch.svg" alt="" className="w-full h-full object-contain" />
        </div>

        <div className="relative z-10 max-w-[1360px] mx-auto px-6 sm:px-10 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Left Photo: Grandmother with Engineer & Doctor Grandchildren */}
            <div className="lg:col-span-6 flex justify-center lg:justify-start order-2 lg:order-1">
              <div className="relative w-full max-w-xl group">
                {/* Offset Decorative Gold Frame & Ambient Shadow */}
                <div className="absolute -bottom-3 -right-3 sm:-bottom-4 sm:-right-4 w-full h-full rounded-2xl border-2 border-[#D3A03A]/30 bg-[#FAF3E0]/40 -z-10 transition-transform duration-500 group-hover:translate-x-1 group-hover:translate-y-1" />

                {/* Main Image Frame */}
                <div className="relative aspect-[16/9] sm:aspect-[2/1] rounded-2xl overflow-hidden shadow-2xl shadow-[#0A3929]/12 border border-[#E5DFC0] bg-[#FAF8F5]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/images/ayeeyo-power-futures.jpg"
                    alt="Somali grandmother proudly seated between her grandson, an engineer in a hard hat, and granddaughter, a doctor with a stethoscope"
                    className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A3929]/30 via-transparent to-transparent pointer-events-none" />
                </div>

                {/* Floating Glassmorphic Story Badge */}
                <div className="absolute -bottom-5 left-4 sm:left-6 z-20 bg-white/95 backdrop-blur-md rounded-xl p-3 sm:p-3.5 shadow-xl border border-[#E5DFC0] flex items-center gap-3 max-w-[280px] sm:max-w-[320px]">
                  <div className="w-10 h-10 rounded-full bg-[#0A3929] text-[#D3A03A] flex items-center justify-center shrink-0 shadow-inner">
                    <Sparkles className="w-5 h-5 stroke-[2]" />
                  </div>
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-wider text-[#A8741A]">
                      Generational Success
                    </p>
                    <p className="text-xs text-[#1E1C1A] font-medium leading-snug">
                      Raised with love • Thriving in engineering, medicine &amp; beyond
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Content */}
            <div className="lg:col-span-6 space-y-6 sm:space-y-7 order-1 lg:order-2">
              {/* Eyebrow with gold dash */}
              <div className="flex items-center gap-3">
                <span className="w-6 h-[2px] bg-[#D3A03A]" />
                <p className="font-sans text-xs sm:text-[12px] font-bold uppercase tracking-[0.25em] text-[#A8741A]">
                  THE POWER OF GRANDMOTHERS
                </p>
              </div>

              {/* Headline with Cormorant serif italic accent */}
              <h2 className="font-playfair text-3xl sm:text-4xl lg:text-[2.85rem] font-normal text-[#0A3929] leading-[1.12] tracking-tight">
                Their Care Builds <br />
                <span className="font-cormorant italic text-[#A8741A] font-medium">Strong Futures.</span>
              </h2>

              {/* Narrative Story */}
              <p className="font-sans text-xs sm:text-sm lg:text-[15px] text-[#4A544E] leading-[1.8] font-normal">
                Grandmothers are more than caregivers — they are teachers, protectors, and the unwavering heart of their families. They give children stability when life is uncertain, creating the fertile soil where dreams take root and flourish.
              </p>

              {/* 2 Feature Highlight Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                {/* Card 1 */}
                <div className="p-4 rounded-xl bg-white/90 border border-[#E5DFC0]/80 shadow-sm space-y-1.5 transition-all duration-300 hover:border-[#D3A03A]/60 hover:shadow-md">
                  <div className="flex items-center gap-2 text-[#0A3929]">
                    <Heart className="w-4 h-4 text-[#D3A03A]" />
                    <h4 className="font-playfair text-sm sm:text-base font-semibold text-[#0A3929]">
                      Unwavering Stability
                    </h4>
                  </div>
                  <p className="font-sans text-xs text-[#5C6760] leading-relaxed">
                    Providing safe shelter, daily nutrition, and steady moral and cultural guidance.
                  </p>
                </div>

                {/* Card 2 */}
                <div className="p-4 rounded-xl bg-white/90 border border-[#E5DFC0]/80 shadow-sm space-y-1.5 transition-all duration-300 hover:border-[#D3A03A]/60 hover:shadow-md">
                  <div className="flex items-center gap-2 text-[#0A3929]">
                    <GraduationCap className="w-4 h-4 text-[#D3A03A]" />
                    <h4 className="font-playfair text-sm sm:text-base font-semibold text-[#0A3929]">
                      Limitless Potential
                    </h4>
                  </div>
                  <p className="font-sans text-xs text-[#5C6760] leading-relaxed">
                    Empowering boys and girls to graduate as confident doctors, engineers, and community leaders.
                  </p>
                </div>
              </div>

              {/* Action Buttons Row */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <a
                  href="#get-involved"
                  className="inline-flex items-center gap-2 bg-[#0A3929] hover:bg-[#06251B] text-[#FAF8F5] text-xs sm:text-[13px] font-semibold px-6 py-3 rounded-full transition-all duration-200 shadow-md hover:shadow-lg active:scale-[0.98]"
                >
                  <span>Our Vision &amp; Purpose</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#D3A03A]" />
                </a>

                <button
                  type="button"
                  onClick={() => openSupportModal(50)}
                  className="inline-flex items-center gap-2 border border-[#D3A03A] text-[#8B651B] hover:text-[#0A3929] hover:bg-[#D3A03A]/10 text-xs sm:text-[13px] font-semibold px-6 py-3 rounded-full transition-all duration-200"
                >
                  <span>Support a Family</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          6. SECTION: EDUCATION & OPPORTUNITY (Learning Creates New Possibilities)
      ========================================================================= */}
      <section className="py-16 sm:py-24 lg:py-28 bg-[#FCFBF9] border-b border-[#E5DFC0]/50">
        <div className="max-w-[1360px] mx-auto px-6 sm:px-10 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
            {/* Left Content */}
            <div className="lg:col-span-6 space-y-6">
              <p className="font-sans text-xs sm:text-[12px] font-semibold uppercase tracking-[0.22em] text-[#A8741A]">
                EDUCATION &amp; OPPORTUNITY
              </p>

              <h2 className="font-playfair text-3xl sm:text-4xl lg:text-[2.75rem] font-normal text-[#0A3929] leading-[1.15] tracking-tight">
                Learning Creates <br />
                New Possibilities
              </h2>

              <p className="font-sans text-xs sm:text-sm lg:text-[14.5px] text-[#4A544E] leading-[1.8] font-normal">
                Through education and skill-building, children raised by their grandmothers can reach their potential and build the future they deserve.
              </p>

              {/* Action Button: Support Education */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => openSupportModal(100)}
                  className="inline-flex items-center gap-2 bg-[#D3A03A] hover:bg-[#C29130] text-[#1E1C1A] text-xs sm:text-[13px] font-semibold px-6 sm:px-7 py-3 rounded-full transition-all duration-200 shadow-sm hover:shadow active:scale-[0.98]"
                >
                  <span>Support Education</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Right Photo Collage: School Girls Reading & Classroom Study */}
            <div className="lg:col-span-6 flex justify-center lg:justify-end pt-4 pb-6 sm:pb-0">
              <div className="relative w-full max-w-lg">
                {/* Main Large Image: Girls Reading Somali Textbook Together Outdoors */}
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-xl border border-[#E5DFC0]/70 bg-[#FAF8F5] group">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/images/ayeeyo-education-reading.jpg"
                    alt="Young Somali schoolgirls reading an open textbook together in the schoolyard"
                    className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60" />
                  <div className="absolute bottom-4 left-4 text-white text-xs font-sans">
                    <span className="inline-block px-3 py-1 bg-[#0A3929]/90 backdrop-blur-sm rounded-full font-medium text-[#D3A03A] border border-[#D3A03A]/30">
                      Education &amp; Literacy
                    </span>
                  </div>
                </div>

                {/* Overlapping Secondary Card: Classroom Focused Study */}
                <div className="hidden sm:block absolute -bottom-6 -left-6 sm:-left-8 w-44 sm:w-52 aspect-[4/3] rounded-xl overflow-hidden shadow-2xl border-4 border-white bg-white z-10 transition-transform duration-500 hover:scale-105">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/images/ayeeyo-education-girls.jpg"
                    alt="Young Somali girl writing in classroom"
                    className="w-full h-full object-cover object-center"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          7. SECTION: GET INVOLVED (Be Part of Their Journey)
      ========================================================================= */}
      <section id="get-involved" className="relative py-20 sm:py-28 lg:py-32 bg-[#0A3929] text-white overflow-hidden">
        {/* Coastal Skyline Atmospheric Backdrop */}
        <div className="absolute inset-0 z-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/ayeeyo-get-involved-bg.jpg"
            alt="Mogadishu coastal skyline"
            className="w-full h-full object-cover object-center opacity-30 mix-blend-luminosity"
          />
          <div className="absolute inset-0 bg-[#0A3929]/85" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A3929] via-transparent to-[#0A3929]" />
        </div>

        <div className="relative z-10 max-w-3xl mx-auto px-6 text-center space-y-6">
          <p className="font-sans text-xs sm:text-[13px] font-semibold uppercase tracking-[0.25em] text-[#D3A03A]">
            GET INVOLVED
          </p>

          <h2 className="font-playfair text-3xl sm:text-4xl lg:text-5xl font-normal text-white leading-tight">
            Be Part of Their Journey
          </h2>

          <p className="font-sans text-xs sm:text-sm lg:text-base text-[#D1DDD6] leading-relaxed max-w-xl mx-auto">
            Your support helps grandmothers care for their children and creates more opportunities for a brighter tomorrow.
          </p>

          <div className="pt-4">
            <button
              type="button"
              onClick={() => openSupportModal(50)}
              className="inline-flex items-center gap-2 bg-[#D3A03A] hover:bg-[#C29130] text-[#1E1C1A] text-xs sm:text-sm font-semibold px-8 py-3.5 rounded-full transition-all duration-200 shadow-xl hover:shadow-2xl active:scale-[0.98]"
            >
              <span>Support Ayeeyo Koris</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* =========================================================================
          8. DEDICATED AYEEYO KORIS FOOTER
      ========================================================================= */}
      <footer className="w-full bg-[#FFFFFF] border-t border-[#E5DFC0]/70 text-[#1E1C1A]">
        <div className="max-w-[1360px] mx-auto px-6 sm:px-10 lg:px-12 py-12 sm:py-16">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-center pb-10 border-b border-[#E5DFC0]/60">
            {/* Left: Logo & Tagline */}
            <div className="md:col-span-5 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
              <Link href="/ayeyo-koris" className="focus-visible:outline-none">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/ayeeyo-koris-logo.png"
                  alt="Ayeeyo Koris"
                  className="h-10 sm:h-12 w-auto object-contain"
                />
              </Link>
              <div className="hidden sm:block w-px h-10 bg-[#D5C9B3]" />
              <div className="space-y-0.5">
                <p className="font-sans text-xs sm:text-[13px] text-[#4A544E] font-medium leading-snug">
                  Stronger grandmothers.
                </p>
                <p className="font-sans text-xs sm:text-[13px] text-[#4A544E] font-medium leading-snug">
                  Brighter futures.
                </p>
              </div>
            </div>

            {/* Middle: Navigation Links */}
            <div className="md:col-span-5 grid grid-cols-2 gap-6 sm:gap-8 font-sans text-xs sm:text-[13px]">
              <div className="space-y-2.5">
                <div>
                  <Link href="/" className="text-[#4A544E] hover:text-[#0A3929] transition-colors">
                    Home
                  </Link>
                </div>
                <div>
                  <Link href="/about" className="text-[#4A544E] hover:text-[#0A3929] transition-colors">
                    About
                  </Link>
                </div>
                <div>
                  <Link href="/ayeyo-koris" className="text-[#0A3929] font-semibold transition-colors">
                    Ayeeyo Koris
                  </Link>
                </div>
              </div>
              <div className="space-y-2.5">
                <div>
                  <Link href="/community" className="text-[#4A544E] hover:text-[#0A3929] transition-colors">
                    Community
                  </Link>
                </div>
                <div>
                  <a href="#get-involved" className="text-[#4A544E] hover:text-[#0A3929] transition-colors">
                    Get Involved
                  </a>
                </div>
                <div>
                  <Link href="/contact" className="text-[#4A544E] hover:text-[#0A3929] transition-colors">
                    Contact
                  </Link>
                </div>
              </div>
            </div>

            {/* Right: Social Media Icons */}
            <div className="md:col-span-2 flex items-center md:justify-end gap-3 text-[#4A544E]">
              {/* Facebook */}
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="w-9 h-9 rounded-full border border-[#D5C9B3] flex items-center justify-center hover:bg-[#0A3929] hover:text-white hover:border-[#0A3929] transition-all text-xs"
              >
                f
              </a>
              {/* X / Twitter */}
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="X (formerly Twitter)"
                className="w-9 h-9 rounded-full border border-[#D5C9B3] flex items-center justify-center hover:bg-[#0A3929] hover:text-white hover:border-[#0A3929] transition-all text-xs font-bold"
              >
                𝕏
              </a>
              {/* Instagram */}
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-9 h-9 rounded-full border border-[#D5C9B3] flex items-center justify-center hover:bg-[#0A3929] hover:text-white hover:border-[#0A3929] transition-all text-xs"
              >
                ig
              </a>
              {/* YouTube */}
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="w-9 h-9 rounded-full border border-[#D5C9B3] flex items-center justify-center hover:bg-[#0A3929] hover:text-white hover:border-[#0A3929] transition-all text-xs"
              >
                yt
              </a>
            </div>
          </div>

          {/* Bottom Bar: Copyright & Legal */}
          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 font-sans text-xs text-[#7A756D]">
            <p>© 2026 Naag Nool Up. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <Link href="/privacy" className="hover:text-[#0A3929] transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-[#0A3929] transition-colors">
                Terms &amp; Conditions
              </Link>
            </div>
          </div>
        </div>
      </footer>

      {/* =========================================================================
          INTERACTIVE SUPPORT & DONATION MODAL
      ========================================================================= */}
      {supportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-[#FAF8F5] rounded-2xl shadow-2xl border border-[#E5DFC0] p-6 sm:p-8 text-[#1E1C1A] overflow-hidden">
            <button
              type="button"
              onClick={() => setSupportModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-[#4A544E] hover:text-[#0A3929] rounded-full hover:bg-[#EAE5DC]"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            {!isPledged ? (
              <form onSubmit={handlePledgeSubmit} className="space-y-5">
                <div className="space-y-1">
                  <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-[#A8741A]">
                    SUPPORT AYEEYO KORIS
                  </p>
                  <h3 className="font-playfair text-2xl sm:text-3xl font-normal text-[#0A3929]">
                    Sponsor a Future
                  </h3>
                  <p className="font-sans text-xs sm:text-sm text-[#4A544E] leading-relaxed">
                    Choose how you would like to support children raised by grandmothers.
                  </p>
                </div>

                {/* Preset Tiers */}
                <div className="grid grid-cols-3 gap-2.5 pt-1">
                  {[25, 50, 100].map((amount) => (
                    <button
                      key={amount}
                      type="button"
                      onClick={() => {
                        setSelectedTier(amount);
                        setCustomAmount('');
                      }}
                      className={`py-3 px-2 rounded-xl border text-center font-sans transition-all ${
                        selectedTier === amount && !customAmount
                          ? 'border-[#0A3929] bg-[#0A3929] text-white shadow-sm font-semibold'
                          : 'border-[#D5C9B3] bg-white text-[#1E1C1A] hover:border-[#0A3929]'
                      }`}
                    >
                      <div className="text-base font-bold">${amount}</div>
                      <div className="text-[10px] opacity-80 mt-0.5">
                        {amount === 25 ? 'Books' : amount === 50 ? 'Care Kit' : 'Tuition'}
                      </div>
                    </button>
                  ))}
                </div>

                {/* Custom Amount */}
                <div>
                  <label htmlFor="custom-amount" className="block font-sans text-xs font-medium text-[#4A544E] mb-1">
                    Or Enter Custom Amount ($ USD)
                  </label>
                  <input
                    id="custom-amount"
                    type="number"
                    min="5"
                    step="5"
                    placeholder="e.g. 150"
                    value={customAmount}
                    onChange={(e) => {
                      setCustomAmount(e.target.value);
                      setSelectedTier(0);
                    }}
                    className="w-full px-4 py-2.5 rounded-lg border border-[#D5C9B3] bg-white font-sans text-sm focus:outline-none focus:ring-2 focus:ring-[#0A3929]"
                  />
                </div>

                {/* Donor Details */}
                <div className="space-y-3 pt-1">
                  <div>
                    <label htmlFor="donor-name" className="block font-sans text-xs font-medium text-[#4A544E] mb-1">
                      Your Full Name
                    </label>
                    <input
                      id="donor-name"
                      type="text"
                      required
                      placeholder="e.g. Sarah Warsame"
                      value={donorName}
                      onChange={(e) => setDonorName(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-lg border border-[#D5C9B3] bg-white font-sans text-sm focus:outline-none focus:ring-2 focus:ring-[#0A3929]"
                    />
                  </div>
                  <div>
                    <label htmlFor="donor-email" className="block font-sans text-xs font-medium text-[#4A544E] mb-1">
                      Email Address
                    </label>
                    <input
                      id="donor-email"
                      type="email"
                      required
                      placeholder="you@example.com"
                      value={donorEmail}
                      onChange={(e) => setDonorEmail(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-lg border border-[#D5C9B3] bg-white font-sans text-sm focus:outline-none focus:ring-2 focus:ring-[#0A3929]"
                    />
                  </div>
                </div>

                {/* Submit Action */}
                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full bg-[#D3A03A] hover:bg-[#C29130] text-[#1E1C1A] font-semibold text-xs sm:text-sm py-3.5 rounded-full transition-all shadow-md hover:shadow-lg"
                  >
                    Confirm Pledge of ${customAmount || selectedTier}
                  </button>
                  <p className="font-sans text-[11px] text-center text-[#7A756D] mt-2">
                    Ayeeyo Koris is a registered non-profit initiative. Secure pledge processing.
                  </p>
                </div>
              </form>
            ) : (
              <div className="text-center py-6 space-y-4">
                <div className="w-16 h-16 bg-[#0A3929] text-[#D3A03A] rounded-full mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="font-playfair text-2xl font-normal text-[#0A3929]">
                  Mahadsanid, {donorName || 'Friend'}!
                </h3>
                <p className="font-sans text-xs sm:text-sm text-[#4A544E] leading-relaxed max-w-sm mx-auto">
                  Thank you for your generous pledge of <span className="font-bold text-[#0A3929]">${customAmount || selectedTier}</span>. You will receive an email confirmation at <span className="font-medium text-[#1E1C1A]">{donorEmail}</span> with details on how your contribution empowers grandmothers and children.
                </p>
                <div className="pt-3">
                  <button
                    type="button"
                    onClick={() => setSupportModalOpen(false)}
                    className="bg-[#0A3929] text-white text-xs sm:text-sm font-medium px-6 py-2.5 rounded-full hover:bg-[#07261B] transition-colors"
                  >
                    Done
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
