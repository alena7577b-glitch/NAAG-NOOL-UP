'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  ArrowRight,
  ArrowLeft,
  Heart,
  Users,
  BookOpen,
  Sprout,
  Menu,
  X,
  CheckCircle2,
  Sparkles,
  GraduationCap,
  CreditCard,
  ShieldCheck,
  User,
  Mail,
  Check,
} from 'lucide-react';
import { AyeeyoTypographyTransition } from './AyeeyoTypographyTransition';
import { createDonationAction } from '@/lib/actions/donation';
import { capturePayPalOrderAction } from '@/lib/actions/checkout';

export function AyeyoKorisView() {
  const searchParams = useSearchParams();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [supportModalOpen, setSupportModalOpen] = useState(false);
  const [selectedTier, setSelectedTier] = useState<number>(50);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [donorEmail, setDonorEmail] = useState<string>('');
  const [donorName, setDonorName] = useState<string>('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'CARD' | 'PAYPAL'>('CARD');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [dismissedSuccess, setDismissedSuccess] = useState(false);

  // Read return query parameters from Stripe or PayPal
  const isSuccessReturn = searchParams?.get('success') === 'true';
  const returnOrderNumber = searchParams?.get('orderNumber');
  const returnAmount = searchParams?.get('amount');
  const returnName = searchParams?.get('name');
  const returnProvider = searchParams?.get('provider');
  const returnToken = searchParams?.get('token');

  const activeDonationSuccess =
    isSuccessReturn && returnOrderNumber
      ? {
          orderNumber: returnOrderNumber,
          amount: returnAmount || selectedTier,
          name: returnName || 'Generous Friend',
          provider: returnProvider === 'paypal' ? 'PayPal' : 'Credit / Debit Card (Stripe)',
        }
      : null;

  const isModalVisible = (supportModalOpen || Boolean(activeDonationSuccess)) && !dismissedSuccess;

  const processedReturnRef = useRef(false);
  useEffect(() => {
    if (processedReturnRef.current) return;
    if (isSuccessReturn && returnOrderNumber) {
      processedReturnRef.current = true;

      if (returnProvider === 'paypal' && returnToken) {
        capturePayPalOrderAction(returnToken, returnOrderNumber).catch((err) => {
          console.warn('PayPal donation capture notice:', err);
        });
      }
    }
  }, [isSuccessReturn, returnOrderNumber, returnProvider, returnToken]);

  const handlePledgeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const donationAmount = customAmount ? parseFloat(customAmount) : selectedTier;
    if (!donationAmount || isNaN(donationAmount) || donationAmount < 5) {
      setErrorMessage('Please select or enter an amount of at least $5.');
      return;
    }

    if (!donorName.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }

    if (!donorEmail.trim()) {
      setErrorMessage('Please enter your email address for your donation receipt.');
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await createDonationAction({
        donorName: donorName.trim(),
        donorEmail: donorEmail.trim(),
        amount: donationAmount,
        paymentMethod: selectedPaymentMethod,
      });

      if (!result.success || !result.paymentUrl) {
        setErrorMessage(result.error || 'Unable to connect to payment gateway. Please try again.');
        setIsSubmitting(false);
        return;
      }

      // Redirect directly to Stripe or PayPal secure checkout
      window.location.href = result.paymentUrl;
    } catch {
      setErrorMessage('A network error occurred while connecting to payment. Please try again.');
      setIsSubmitting(false);
    }
  };

  const openSupportModal = (presetAmount?: number) => {
    if (presetAmount) setSelectedTier(presetAmount);
    setErrorMessage(null);
    setDismissedSuccess(false);
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
              aria-label="Ayeeyo Koris Children Educational Scholarship Home"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/ayeeyo-koris-logo.png"
                alt="Ayeeyo Koris"
                className="h-10 sm:h-11 md:h-12 w-auto object-contain transition-transform duration-200 group-hover:scale-[1.02]"
              />
            </Link>

            {/* Desktop Navigation Links: Scoped to Ayeeyo Koris Impact Story */}
            <nav className="hidden md:flex items-center gap-6 lg:gap-8">
              <a
                href="#about-ayeeyo"
                className="font-sans text-xs sm:text-[13px] font-medium text-[#4A544E] hover:text-[#0A3929] transition-colors"
              >
                About
              </a>
              <a
                href="#what-it-means"
                className="font-sans text-xs sm:text-[13px] font-medium text-[#4A544E] hover:text-[#0A3929] transition-colors"
              >
                Our Pillars
              </a>
              <a
                href="#the-power"
                className="font-sans text-xs sm:text-[13px] font-medium text-[#4A544E] hover:text-[#0A3929] transition-colors"
              >
                Power of Care
              </a>
              <a
                href="#education"
                className="font-sans text-xs sm:text-[13px] font-medium text-[#4A544E] hover:text-[#0A3929] transition-colors"
              >
                Education
              </a>
              <a
                href="#get-involved"
                className="font-sans text-xs sm:text-[13px] font-medium text-[#4A544E] hover:text-[#0A3929] transition-colors"
              >
                Get Involved
              </a>
            </nav>

            {/* Right Side: Discrete Return Link + Support Us CTA */}
            <div className="hidden sm:flex items-center gap-4">
              <Link
                href="/"
                className="group inline-flex items-center gap-1.5 text-xs text-[#6B726B] hover:text-[#0A3929] font-medium transition-colors"
                title="Return to Naag Nool UP Boutique & Home"
              >
                <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
                <span>Naag Nool UP</span>
              </Link>

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
              <a
                href="#about-ayeeyo"
                onClick={() => setMobileMenuOpen(false)}
                className="text-[#4A544E] hover:text-[#0A3929] py-1 font-medium"
              >
                About
              </a>
              <a
                href="#what-it-means"
                onClick={() => setMobileMenuOpen(false)}
                className="text-[#4A544E] hover:text-[#0A3929] py-1 font-medium"
              >
                Our Pillars
              </a>
              <a
                href="#the-power"
                onClick={() => setMobileMenuOpen(false)}
                className="text-[#4A544E] hover:text-[#0A3929] py-1 font-medium"
              >
                Power of Care
              </a>
              <a
                href="#education"
                onClick={() => setMobileMenuOpen(false)}
                className="text-[#4A544E] hover:text-[#0A3929] py-1 font-medium"
              >
                Education
              </a>
              <a
                href="#get-involved"
                onClick={() => setMobileMenuOpen(false)}
                className="text-[#4A544E] hover:text-[#0A3929] py-1 font-medium"
              >
                Get Involved
              </a>

              <div className="pt-2 border-t border-[#E5DFC0]/60">
                <Link
                  href="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className="inline-flex items-center gap-1.5 text-xs text-[#6B726B] hover:text-[#0A3929] py-1"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Return to Naag Nool UP Boutique</span>
                </Link>
              </div>
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
                <span>Support Ayeeyo Koris Children</span>
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
              EDUCATIONAL SCHOLARSHIP
            </p>

            {/* Headline */}
            <h1 className="font-playfair text-3xl sm:text-4xl lg:text-[3.25rem] font-normal text-white leading-[1.12] tracking-tight">
              Ayeeyo Koris Children <br />
              <span className="text-2xl sm:text-3xl lg:text-[2.6rem] font-light text-[#FAF6F0]">Grandmothers Raise Tomorrow</span>
            </h1>

            {/* Narrative Paragraph */}
            <p className="font-sans text-xs sm:text-sm lg:text-[14.5px] text-[#E0D8C9] leading-[1.8] font-normal">
              Ayeeyo Koris Children is about the boys and girls who are raised by their grandmothers when their parents are absent, have passed away, or are unable to provide care. It&apos;s a story of love, responsibility, resilience and hope.
            </p>

            {/* CTA Buttons: Direct Sponsor Action + Story Anchor */}
            <div className="flex flex-wrap items-center gap-3 pt-2 sm:pt-3">
              <button
                type="button"
                onClick={() => openSupportModal(50)}
                className="inline-flex items-center gap-2 bg-[#D3A03A] hover:bg-[#C29130] text-[#1E1C1A] text-xs sm:text-[13px] font-semibold px-6 sm:px-7 py-3 rounded-full transition-all duration-200 shadow-md hover:shadow-lg active:scale-[0.98]"
              >
                <span>Sponsor a Child • $50</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <a
                href="#about-ayeeyo"
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/25 text-xs sm:text-[13px] font-medium px-5 sm:px-6 py-3 rounded-full transition-all duration-200 backdrop-blur-xs"
              >
                <span>Our Story</span>
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
                ABOUT AYEEYO KORIS CHILDREN
              </p>

              <h2 className="font-playfair text-3xl sm:text-4xl lg:text-[2.75rem] font-normal text-[#0A3929] leading-[1.15] tracking-tight">
                Care Today. <br />
                Opportunity Tomorrow.
              </h2>

              <p className="font-sans text-xs sm:text-sm lg:text-[14.5px] text-[#4A544E] leading-[1.8] font-normal">
                Ayeeyo Koris Children supports young boys and girls who are raised by their grandmothers, honoring the strength of Somali families and the vital role of grandmothers in shaping confident, capable, and hopeful futures.
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
      <section id="what-it-means" className="py-20 sm:py-24 lg:py-28 bg-[#0A3929] text-white relative overflow-hidden">
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
              WHAT AYEEYO KORIS CHILDREN MEANS
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
      <section id="the-power" className="relative py-20 sm:py-28 lg:py-32 bg-[#FAF8F5] border-b border-[#E5DFC0]/60 overflow-hidden">
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
      <section id="education" className="py-16 sm:py-24 lg:py-28 bg-[#FCFBF9] border-b border-[#E5DFC0]/50">
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

                {/* Overlapping Secondary Card: Joyful Student on the School Bus */}
                <div className="hidden sm:block absolute -bottom-6 -left-6 sm:-left-8 w-48 sm:w-56 aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl border-4 border-white bg-white z-10 transition-transform duration-500 hover:scale-105">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/images/ayeeyo-education-bus-girl.jpg"
                    alt="Young Somali schoolgirl smiling joyfully out of the school bus window"
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
              <span>Support Ayeeyo Koris Children</span>
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
                  <a href="#about-ayeeyo" className="text-[#4A544E] hover:text-[#0A3929] transition-colors">
                    About Ayeeyo Koris Children
                  </a>
                </div>
                <div>
                  <a href="#what-it-means" className="text-[#4A544E] hover:text-[#0A3929] transition-colors">
                    Our Core Pillars
                  </a>
                </div>
                <div>
                  <a href="#the-power" className="text-[#4A544E] hover:text-[#0A3929] transition-colors">
                    Power of Care
                  </a>
                </div>
              </div>
              <div className="space-y-2.5">
                <div>
                  <a href="#education" className="text-[#4A544E] hover:text-[#0A3929] transition-colors">
                    Education &amp; Opportunity
                  </a>
                </div>
                <div>
                  <a href="#get-involved" className="text-[#4A544E] hover:text-[#0A3929] transition-colors">
                    Get Involved
                  </a>
                </div>
                <div>
                  <Link href="/" className="inline-flex items-center gap-1 text-[#A8741A] hover:text-[#0A3929] font-medium transition-colors">
                    <span>← Naag Nool UP</span>
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
          INTERACTIVE SUPPORT & DONATION MODAL (AYEEYO KORIS ZERO-SCROLL SUITE)
      ========================================================================= */}
      {isModalVisible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-3 sm:p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-[520px] bg-[#FAF8F5] rounded-[24px] sm:rounded-[28px] shadow-2xl border border-[#E5DFC0] p-5 sm:p-6 text-[#1E1C1A] overflow-hidden">
            {/* Ambient Warm Golden Glow in Top Right Corner */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#D3A03A]/10 rounded-full blur-3xl pointer-events-none" />

            {/* Header: Official Ayeeyo Koris Logo & Close Button */}
            <div className="relative z-10 flex items-center justify-between pb-3 border-b border-[#E5DFC0]/70">
              <div className="flex items-center gap-2.5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/ayeeyo-koris-logo.png"
                  alt="Ayeeyo Koris"
                  className="h-8 sm:h-9 w-auto object-contain"
                />
                <div className="h-5 w-px bg-[#D5C9B3]" />
                <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#A8741A]">
                  Educational Scholarship
                </span>
              </div>

              <button
                type="button"
                onClick={() => {
                  setSupportModalOpen(false);
                  setDismissedSuccess(true);
                }}
                className="p-1.5 text-[#5C665F] hover:text-[#0A3929] rounded-full hover:bg-[#EAE5DC] transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {!activeDonationSuccess ? (
              <form onSubmit={handlePledgeSubmit} className="relative z-10 space-y-3 pt-3">
                {/* Title & Short Mission Statement */}
                <div>
                  <h3 className="font-playfair text-xl sm:text-2xl text-[#0A3929] leading-tight">
                    Sponsor a Child&apos;s Future
                  </h3>
                  <p className="font-sans text-[11px] sm:text-xs text-[#5C665F] mt-0.5 leading-normal">
                    100% of your gift directly funds meals, books, and educational tuition for children raised by grandmothers.
                  </p>
                </div>

                {/* Error Banner */}
                {errorMessage && (
                  <div
                    role="alert"
                    className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2"
                  >
                    <span>{errorMessage}</span>
                  </div>
                )}

                {/* Compact Sponsorship Tiers */}
                <div className="space-y-1.5">
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      {
                        amount: 25,
                        title: 'Books',
                        badge: 'Essential',
                      },
                      {
                        amount: 50,
                        title: 'Care Kit',
                        badge: 'Most Popular',
                      },
                      {
                        amount: 100,
                        title: 'Schooling',
                        badge: 'Full Year',
                      },
                    ].map((tier) => {
                      const isSelected = selectedTier === tier.amount && !customAmount;
                      return (
                        <button
                          key={tier.amount}
                          type="button"
                          onClick={() => {
                            setSelectedTier(tier.amount);
                            setCustomAmount('');
                          }}
                          className={`relative py-2 px-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                            isSelected
                              ? 'border-[#0A3929] bg-[#0A3929] text-white shadow-md ring-1 ring-[#D3A03A]'
                              : 'border-[#E5DFC0] bg-white hover:border-[#D3A03A]/60 text-[#1E1C1A]'
                          }`}
                        >
                          <span
                            className={`text-[8px] font-bold uppercase tracking-wider block ${
                              isSelected ? 'text-[#D3A03A]' : 'text-[#8A847A]'
                            }`}
                          >
                            {tier.badge}
                          </span>
                          <span className="font-playfair text-lg sm:text-xl font-bold block leading-snug">
                            ${tier.amount}
                          </span>
                          <span
                            className={`text-[10px] block font-medium ${
                              isSelected ? 'text-[#D8E6DE]' : 'text-[#5C665F]'
                            }`}
                          >
                            {tier.title}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Inline Custom Amount */}
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-xs font-bold text-[#0A3929] font-mono">
                      $
                    </span>
                    <input
                      id="custom-amount"
                      type="number"
                      min="5"
                      step="5"
                      placeholder="Or enter custom amount ($ USD)"
                      value={customAmount}
                      onChange={(e) => {
                        setCustomAmount(e.target.value);
                        setSelectedTier(0);
                      }}
                      className="w-full ps-7 pe-3 py-1.5 rounded-xl border border-[#E5DFC0] bg-white font-sans text-xs text-[#1E1C1A] placeholder-[#A0988A] focus:outline-none focus:ring-1 focus:ring-[#D3A03A] focus:border-[#0A3929] transition-all"
                    />
                  </div>
                </div>

                {/* Donor Fields Side-by-Side */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="relative">
                    <input
                      id="donor-name"
                      type="text"
                      required
                      placeholder="Full Name *"
                      value={donorName}
                      onChange={(e) => setDonorName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-[#E5DFC0] bg-white font-sans text-xs text-[#1E1C1A] placeholder-[#A0988A] focus:outline-none focus:ring-1 focus:ring-[#D3A03A] focus:border-[#0A3929]"
                    />
                    <User className="w-3.5 h-3.5 text-[#8A847A] absolute right-2.5 top-2.5 pointer-events-none" />
                  </div>

                  <div className="relative">
                    <input
                      id="donor-email"
                      type="email"
                      required
                      placeholder="Email Address *"
                      value={donorEmail}
                      onChange={(e) => setDonorEmail(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-[#E5DFC0] bg-white font-sans text-xs text-[#1E1C1A] placeholder-[#A0988A] focus:outline-none focus:ring-1 focus:ring-[#D3A03A] focus:border-[#0A3929]"
                    />
                    <Mail className="w-3.5 h-3.5 text-[#8A847A] absolute right-2.5 top-2.5 pointer-events-none" />
                  </div>
                </div>

                {/* Payment Channel: Stripe vs PayPal */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedPaymentMethod('CARD')}
                    className={`py-2 px-3 rounded-xl border text-start transition-all flex items-center justify-between cursor-pointer ${
                      selectedPaymentMethod === 'CARD'
                        ? 'border-[#0A3929] bg-[#0A3929]/5 ring-1 ring-[#0A3929]'
                        : 'border-[#E5DFC0] bg-white hover:border-[#D3A03A]/50'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-[#0A3929]" />
                      <div>
                        <span className="text-xs font-semibold text-[#1E1C1A] block leading-tight">
                          Card (Stripe)
                        </span>
                        <span className="text-[9px] text-[#7A756D] block leading-none">
                          Apple/Google Pay &amp; Cards
                        </span>
                      </div>
                    </div>
                    <span
                      className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                        selectedPaymentMethod === 'CARD'
                          ? 'border-[#0A3929] bg-[#0A3929] text-white'
                          : 'border-[#C4BCB0]'
                      }`}
                    >
                      {selectedPaymentMethod === 'CARD' && <Check className="w-2 h-2 stroke-[3]" />}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedPaymentMethod('PAYPAL')}
                    className={`py-2 px-3 rounded-xl border text-start transition-all flex items-center justify-between cursor-pointer ${
                      selectedPaymentMethod === 'PAYPAL'
                        ? 'border-[#0070BA] bg-[#0070BA]/5 ring-1 ring-[#0070BA]'
                        : 'border-[#E5DFC0] bg-white hover:border-[#0070BA]/40'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 fill-current text-[#003087]" viewBox="0 0 24 24">
                        <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944 2.76A.948.948 0 0 1 5.88 2h7.02c3.08 0 5.348.814 6.368 2.302 1.054 1.536.87 3.792-.472 5.922-1.572 2.493-4.143 3.864-7.433 3.864H9.014l-1.042 6.582a.641.641 0 0 1-.633.544l-.263.125z" fill="#003087" />
                        <path d="M19.268 7.37c-.32 2.336-1.575 4.394-3.737 5.768-1.532.975-3.418 1.488-5.452 1.488h-1.65a.82.82 0 0 0-.81.693l-1.162 7.362a.51.51 0 0 0 .504.59h3.702a.76.76 0 0 0 .752-.644l.808-5.112a.82.82 0 0 1 .81-.693h1.166c3.968 0 7.07-1.611 7.973-6.26.377-1.942.062-3.473-.91-4.49-.24-.251-.53-.478-.85-.68l-.556 1.978z" fill="#0079C1" />
                      </svg>
                      <div>
                        <span className="text-xs font-semibold text-[#1E1C1A] block leading-tight">
                          PayPal
                        </span>
                        <span className="text-[9px] text-[#7A756D] block leading-none">
                          Account / Card
                        </span>
                      </div>
                    </div>
                    <span
                      className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                        selectedPaymentMethod === 'PAYPAL'
                          ? 'border-[#0070BA] bg-[#0070BA] text-white'
                          : 'border-[#C4BCB0]'
                      }`}
                    >
                      {selectedPaymentMethod === 'PAYPAL' && <Check className="w-2 h-2 stroke-[3]" />}
                    </span>
                  </button>
                </div>

                {/* Direct CTA Action Button */}
                <div className="pt-1">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-[#D3A03A] hover:bg-[#C29130] disabled:opacity-50 text-[#1E1C1A] font-semibold text-xs sm:text-sm py-3 rounded-full transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 active:scale-[0.98] cursor-pointer"
                  >
                    {isSubmitting ? (
                      <span className="inline-flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-[#1E1C1A]/40 border-t-[#1E1C1A] rounded-full animate-spin" />
                        Connecting to Secure Payment...
                      </span>
                    ) : (
                      <>
                        <span>
                          Proceed with {selectedPaymentMethod === 'CARD' ? 'Card (Stripe)' : 'PayPal'} • ${customAmount || selectedTier}
                        </span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>

                  <p className="font-sans text-[10px] text-center text-[#7A756D] mt-2 flex items-center justify-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#0A3929]" />
                    <span>Official registered initiative • Secure bank-grade encryption</span>
                  </p>
                </div>
              </form>
            ) : (
              /* Success Celebration State */
              <div className="relative z-10 text-center py-6 sm:py-8 space-y-5 animate-in fade-in duration-300">
                <div className="relative inline-block">
                  <div className="w-20 h-20 bg-[#0A3929] text-[#D3A03A] rounded-full mx-auto flex items-center justify-center shadow-xl border border-[#D3A03A]/40">
                    <CheckCircle2 className="w-10 h-10 stroke-[2]" />
                  </div>
                </div>

                <div className="space-y-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/images/ayeeyo-koris-logo.png"
                    alt="Ayeeyo Koris"
                    className="h-10 w-auto mx-auto object-contain mb-3"
                  />
                  <h3 className="font-playfair text-2xl sm:text-3xl text-[#0A3929]">
                    Mahadsanid, {activeDonationSuccess.name}!
                  </h3>
                  <p className="font-sans text-xs sm:text-sm text-[#5C665F] leading-relaxed max-w-sm mx-auto">
                    Your sponsorship donation of <span className="font-bold text-[#0A3929]">${activeDonationSuccess.amount}</span> is verified and complete. It brings immediate hope, stability, and education to Somali grandmothers and their children.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-[#E5DFC0] max-w-sm mx-auto text-xs text-start space-y-2">
                  <div className="flex items-center justify-between pb-2 border-b border-[#E5DFC0]">
                    <span className="text-[#7A756D]">Order Reference</span>
                    <span className="font-mono font-medium text-[#1E1C1A]">{activeDonationSuccess.orderNumber}</span>
                  </div>
                  <div className="flex items-center justify-between pb-2 border-b border-[#E5DFC0]">
                    <span className="text-[#7A756D]">Payment Channel</span>
                    <span className="font-medium text-[#0A3929]">
                      {activeDonationSuccess.provider}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#7A756D]">Payment Status</span>
                    <span className="text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full text-[10px]">
                      Verified &amp; Paid
                    </span>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setSupportModalOpen(false);
                      setDismissedSuccess(true);
                    }}
                    className="bg-[#0A3929] hover:bg-[#06251B] text-white text-xs sm:text-sm font-semibold px-8 py-3 rounded-full transition-all shadow-md active:scale-95 cursor-pointer"
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
