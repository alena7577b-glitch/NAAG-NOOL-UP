'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Check } from 'lucide-react';
import { Container } from '@/components/ui/Container';

export function Footer() {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setIsSubscribed(true);
  };

  return (
    <footer className="relative w-full bg-[#1E1C12] text-[#FAF6F0] pt-14 sm:pt-16 lg:pt-20 pb-10 border-t border-[#2D2A1F] overflow-hidden">
      {/* Subtle organic watermark behind footer */}
      <div className="absolute right-0 bottom-0 pointer-events-none opacity-5 w-[420px] h-[420px]">
        <svg viewBox="0 0 200 200" fill="none" className="w-full h-full text-white">
          <circle cx="100" cy="100" r="80" stroke="currentColor" strokeWidth="0.5" strokeDasharray="3 3" />
          <circle cx="100" cy="100" r="60" stroke="currentColor" strokeWidth="0.5" />
          <circle cx="100" cy="100" r="40" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 2" />
        </svg>
      </div>

      <Container size="default">
        {/* Main 4-Column Grid */}
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-12 sm:pb-16 border-b border-white/10">
          
          {/* Column 1: Brand & Mantra (4 cols on lg) */}
          <div className="lg:col-span-4 space-y-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2.5 text-[#FAF6F0] focus-visible:outline-none group"
            >
              {/* Authentic Hand-Drawn Botanical Sprig Motif */}
              <svg
                className="h-6 w-6 text-[#FAF6F0] group-hover:text-[#D49B4B] transition-colors shrink-0"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {/* Main stem */}
                <path d="M5 21C7 16 11 11 19 5" />
                {/* Top sprout leaf */}
                <path
                  d="M19 5C17 2 13 4 14 8C15 8 18 7 19 5Z"
                  fill="currentColor"
                  fillOpacity="0.25"
                />
                {/* Left leaf */}
                <path
                  d="M10 12C7 11 6 14 9 16C10 15 11 13 10 12Z"
                  fill="currentColor"
                  fillOpacity="0.25"
                />
                {/* Right leaf */}
                <path
                  d="M14 9C17 8 18 11 15 13C14 12 13 10 14 9Z"
                  fill="currentColor"
                  fillOpacity="0.25"
                />
                {/* Base leaf */}
                <path
                  d="M7 17C5 17 5 19 8 20C8 19 8 18 7 17Z"
                  fill="currentColor"
                  fillOpacity="0.25"
                />
              </svg>

              <span className="font-playfair text-lg sm:text-xl font-normal tracking-[0.14em] uppercase text-[#FAF6F0]">
                NAAG NOOL UP
              </span>
            </Link>

            <p className="font-sans text-xs sm:text-[13px] text-[#A69E90] font-normal tracking-wide">
              Resilient. Worthy. In Charge.
            </p>
          </div>

          {/* Column 2: Quick Links (2.5 cols on lg) */}
          <div className="lg:col-span-2 space-y-3.5">
            <h4 className="font-sans text-xs sm:text-[13px] font-semibold text-[#FAF6F0] tracking-wider uppercase">
              Quick Links
            </h4>
            <ul className="space-y-2 font-sans text-xs sm:text-[13px] text-[#A69E90]">
              <li>
                <Link href="/" className="hover:text-[#FAF6F0] transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/shop" className="hover:text-[#FAF6F0] transition-colors">
                  Shop
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-[#FAF6F0] transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/ayeyo-koris" className="hover:text-[#FAF6F0] transition-colors">
                  Ayeyo Koris
                </Link>
              </li>
              <li>
                <Link href="/community" className="hover:text-[#FAF6F0] transition-colors">
                  Community
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#FAF6F0] transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Customer Care (2.5 cols on lg) */}
          <div className="lg:col-span-2 space-y-3.5">
            <h4 className="font-sans text-xs sm:text-[13px] font-semibold text-[#FAF6F0] tracking-wider uppercase">
              Customer Care
            </h4>
            <ul className="space-y-2 font-sans text-xs sm:text-[13px] text-[#A69E90]">
              <li>
                <Link href="/shop" className="hover:text-[#FAF6F0] transition-colors">
                  Shipping
                </Link>
              </li>
              <li>
                <Link href="/shop" className="hover:text-[#FAF6F0] transition-colors">
                  Returns
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-[#FAF6F0] transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-[#FAF6F0] transition-colors">
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Stay Connected & Newsletter (3.5 cols on lg) */}
          <div className="lg:col-span-4 space-y-3.5">
            <h4 className="font-sans text-xs sm:text-[13px] font-semibold text-[#FAF6F0] tracking-wider uppercase">
              Stay Connected
            </h4>

            {isSubscribed ? (
              <div className="flex items-center gap-2 text-xs text-[#FAF6F0] bg-white/10 px-4 py-3 rounded-lg border border-white/15">
                <Check className="w-4 h-4 text-[#D49B4B] shrink-0" />
                <span>Thank you for joining our circle!</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="relative flex items-center">
                <input
                  type="email"
                  name="email"
                  placeholder="Your email address"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg bg-[#FAF7F2] text-[#1E1C1A] px-4 py-2.5 pe-12 text-xs placeholder:text-[#8C8477] focus:outline-none focus:ring-2 focus:ring-[#A64426]/30 border border-transparent shadow-inner"
                />
                <button
                  type="submit"
                  aria-label="Subscribe to newsletter"
                  className="absolute end-1 h-8 w-8 rounded-md bg-[#2C2E23] hover:bg-[#A64426] text-[#FAF6F0] flex items-center justify-center transition-colors active:scale-95 shadow-sm"
                >
                  <ArrowRight className="w-4 h-4 rtl:rotate-180" />
                </button>
              </form>
            )}

            {/* Social Icons Row (TikTok, Instagram, Facebook, YouTube) */}
            <div className="flex items-center gap-3 pt-2 text-[#FAF6F0]">
              {/* TikTok */}
              <a
                href="https://www.tiktok.com/@naagnoolup_"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok"
                className="p-1.5 text-white/80 hover:text-white hover:scale-110 transition-all"
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
                </svg>
              </a>

              {/* Instagram */}
              <a
                href="https://www.instagram.com/naagnoolup/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="p-1.5 text-white/80 hover:text-white hover:scale-110 transition-all"
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>

              {/* Facebook */}
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="p-1.5 text-white/80 hover:text-white hover:scale-110 transition-all"
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>

              {/* YouTube */}
              <a
                href="https://www.youtube.com/@NaagNoolUP"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="p-1.5 text-white/80 hover:text-white hover:scale-110 transition-all"
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Copyright */}
        <div className="pt-8 text-center text-xs text-[#827A6D] font-sans">
          &copy; {new Date().getFullYear()} Naag Nool UP. All rights reserved.
        </div>
      </Container>
    </footer>
  );
}
