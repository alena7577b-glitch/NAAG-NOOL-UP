'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Check } from 'lucide-react';

export function CommunitySection() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsSubmitted(true);
    setTimeout(() => {
      setEmail('');
      setIsSubmitted(false);
    }, 4000);
  };

  return (
    <div className="w-full bg-[#FAF7F2] text-[#1E1C1A]">
      
      {/* =========================================================================
          1. THE SISTERHOOD SANCTUARY
      ========================================================================= */}
      <section className="relative w-full py-16 sm:py-20 lg:py-24 border-b border-[#EBE3D3] overflow-hidden">
        {/* Subtle ambient lighting */}
        <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-[#F3ECE0]/50 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="w-full max-w-[1360px] mx-auto px-6 sm:px-10 lg:px-14">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            {/* Left Column: Authentic Photography of Women in Sisterhood */}
            <div className="lg:col-span-6 w-full">
              <div className="relative aspect-[3/2] w-full overflow-hidden rounded-2xl border border-[#E5DFC0]/80 shadow-[0_20px_50px_rgba(30,28,26,0.09)] group bg-[#EDE5D6]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/community-women-circle.jpg"
                  alt="A circle of women smiling, laughing, and supporting each other in sisterhood at sunset"
                  className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                />

                {/* Subtle vignette scrim */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />

                {/* Fine-Art Floating Quote Plaque */}
                <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 max-w-[290px] sm:max-w-[330px] bg-[#FAF7F2]/92 backdrop-blur-md py-2.5 px-3.5 sm:py-3 sm:px-4 rounded-xl border border-white/80 shadow-md text-start space-y-0.5">
                  <p className="font-cormorant italic text-xs sm:text-sm text-[#1E1C1A] leading-snug">
                    &ldquo;When a woman rises, she lifts her entire community with her.&rdquo;
                  </p>
                  <p className="font-sans text-[9px] sm:text-[10px] font-semibold tracking-[0.2em] uppercase text-[#A64426]">
                    THE SISTERHOOD CIRCLE
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column: Editorial Community Invitation & Form */}
            <div className="lg:col-span-6 text-start space-y-6">
              
              {/* Eyebrow */}
              <div className="flex items-center gap-3">
                <span className="w-5 h-[1.5px] bg-[#A64426]" />
                <p className="font-sans text-[11px] sm:text-xs font-semibold uppercase tracking-[0.28em] text-[#A64426]">
                  THE SISTERHOOD
                </p>
                <span className="text-[10px] font-mono tracking-widest text-[#8C8173] uppercase">
                  / 04
                </span>
              </div>

              {/* Majestic Headline */}
              <h2 className="font-playfair text-3xl sm:text-4xl lg:text-[2.85rem] font-normal text-[#1E1C1A] leading-[1.15] tracking-tight">
                You belong here.<br />
                <span className="font-cormorant italic text-[#A64426]">
                  A circle of intentional women.
                </span>
              </h2>

              {/* Narrative */}
              <p className="font-sans text-sm sm:text-[15px] text-[#4D453D] leading-[1.8] font-normal max-w-lg">
                Naag Nool UP is more than pages in a journal — it is an enduring sanctuary for women choosing healing, intentional agency, and unapologetic self-worth.
              </p>

              {/* Refined Capsule Newsletter Subscription Form */}
              <div className="pt-1">
                {isSubmitted ? (
                  <div className="flex items-center gap-2.5 p-4 bg-[#4F5D48]/10 border border-[#4F5D48]/30 rounded-xl text-[#3A4535] text-xs sm:text-sm font-medium">
                    <Check className="w-4 h-4 text-[#3A4535] shrink-0" />
                    <span>Welcome to the sisterhood. Check your inbox for our guided welcome ritual.</span>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="w-full max-w-lg">
                    <div className="relative flex flex-col sm:flex-row items-stretch sm:items-center bg-white rounded-2xl sm:rounded-full p-1.5 border border-[#E0D7C6] shadow-xs focus-within:border-[#A64426] focus-within:ring-2 focus-within:ring-[#A64426]/10 transition-all">
                      <input
                        type="email"
                        required
                        placeholder="Enter your email address..."
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-5 py-3 sm:py-2.5 text-xs sm:text-sm text-[#1E1C1A] placeholder-[#8C8377] bg-transparent focus:outline-none"
                      />
                      <button
                        type="submit"
                        className="shrink-0 inline-flex items-center justify-center gap-2 bg-[#A64426] hover:bg-[#8E381E] active:scale-[0.98] text-white text-xs sm:text-[13px] font-semibold tracking-wider uppercase px-6 py-3 sm:py-2.5 rounded-xl sm:rounded-full transition-all shadow-sm"
                      >
                        <span>Join the Circle</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </form>
                )}
              </div>

              {/* Understated Value Perks */}
              <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-[11px] sm:text-xs font-sans text-[#786E63] pt-1">
                <span className="flex items-center gap-1.5">
                  <span className="text-[#A64426]">✦</span> Weekly Guided Reflections
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="text-[#A64426]">✦</span> Private Circles
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="text-[#A64426]">✦</span> Zero Spam
                </span>
              </div>

              {/* Integrated Social Follow & Member Count */}
              <div className="pt-4 border-t border-[#E8DFCF] flex flex-wrap items-center justify-between gap-4">
                <p className="font-sans text-xs text-[#7A7065]">
                  Over <span className="font-semibold text-[#1E1C1A]">2,400+ women</span> growing together:
                </p>

                <div className="flex items-center gap-2.5">
                  {/* Instagram */}
                  <a
                    href="https://www.instagram.com/naagnoolup/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 bg-white rounded-full border border-[#E0D7C6] text-[#1E1C1A] hover:text-[#A64426] hover:border-[#A64426] transition-all shadow-xs flex items-center justify-center"
                    aria-label="Instagram"
                  >
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.449-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                  </a>

                  {/* TikTok */}
                  <a
                    href="https://www.tiktok.com/@naagnoolup_"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 bg-white rounded-full border border-[#E0D7C6] text-[#1E1C1A] hover:text-[#A64426] hover:border-[#A64426] transition-all shadow-xs flex items-center justify-center"
                    aria-label="TikTok"
                  >
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
                    </svg>
                  </a>

                  {/* YouTube */}
                  <a
                    href="https://www.youtube.com/@NaagNoolUP"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 bg-white rounded-full border border-[#E0D7C6] text-[#1E1C1A] hover:text-[#A64426] hover:border-[#A64426] transition-all shadow-xs flex items-center justify-center"
                    aria-label="YouTube"
                  >
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                    </svg>
                  </a>
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* =========================================================================
          2. CINEMATIC PRE-FOOTER HORIZON BANNER ("Your life is yours to live.")
      ========================================================================= */}
      <section className="relative w-full min-h-[360px] sm:min-h-[420px] lg:min-h-[460px] overflow-hidden flex items-center">
        {/* Full-Bleed Golden Sunset Horizon Photography (No burned-in text) */}
        <div className="absolute inset-0 z-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/prefooter-sunset-cinematic.jpg"
            alt="Cinematic panoramic golden hour desert horizon at sunset with Somali woman in terracotta scarf looking into the horizon"
            className="w-full h-full object-cover object-[78%_center] sm:object-[75%_center] lg:object-right"
          />
          {/* Atmospheric Scrim: Deep warm shadow on left for crisp text legibility, glowing sunset on right */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/45 via-45% sm:via-black/35 to-transparent" />
          {/* Subtle bottom gradient melt into dark footer */}
          <div className="absolute bottom-0 inset-x-0 h-16 bg-gradient-to-t from-[#1E1C1A] to-transparent pointer-events-none" />
        </div>

        {/* Content Overlay: Anchored on the Left/Center with generous breathing room */}
        <div className="relative z-10 w-full max-w-[1360px] mx-auto px-6 sm:px-10 lg:px-14">
          <div className="max-w-xl text-start space-y-4 sm:space-y-5">
            {/* Eyebrow */}
            <div className="flex items-center gap-3">
              <span className="w-5 h-[1.5px] bg-[#E5DFC0]" />
              <p className="font-sans text-[11px] sm:text-xs font-semibold uppercase tracking-[0.3em] text-[#E5DFC0]">
                NAAG NOOL UP
              </p>
            </div>

            {/* Majestic Headline with Cormorant Italic Nuance */}
            <h2 className="font-playfair text-3xl sm:text-4xl lg:text-[3.25rem] font-normal text-[#FAF6F0] leading-[1.14] tracking-tight drop-shadow-sm">
              Your life is <br />
              <span className="font-cormorant italic text-[#FFD6A5]">
                yours to live.
              </span>
            </h2>

            {/* Narrative */}
            <p className="font-sans text-xs sm:text-sm lg:text-[14.5px] text-[#E5DDD0] leading-[1.75] font-normal max-w-md">
              Step into clarity, daily intention, and quiet confidence. Begin your guided journaling practice today.
            </p>

            {/* Luxury Action Button */}
            <div className="pt-2">
              <Link
                href="/shop"
                className="group inline-flex items-center gap-3 bg-[#FAF6F0] hover:bg-white text-[#1E1C1A] text-xs sm:text-[13px] font-semibold tracking-[0.06em] uppercase px-8 py-3.5 rounded-full transition-all duration-200 shadow-xl hover:shadow-2xl hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]"
              >
                <span>Explore All Journals</span>
                <ArrowRight className="w-4 h-4 text-[#A64426] transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
