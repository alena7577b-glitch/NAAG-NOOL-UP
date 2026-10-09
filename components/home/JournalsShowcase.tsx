'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';

interface JournalItem {
  id: string;
  title: string;
  slug: string;
  subtitle: string;
  price: string;
  imageUrl: string;
}

const JOURNALS: JournalItem[] = [
  {
    id: 'prod-awakening',
    title: 'The Awakening',
    slug: 'the-awakening',
    subtitle: 'Discover your power.',
    price: '$24.00',
    imageUrl: '/images/book-cover-awakening.png',
  },
  {
    id: 'prod-clarity',
    title: 'The Clarity',
    slug: 'the-clarity',
    subtitle: 'Find your direction.',
    price: '$24.00',
    imageUrl: '/images/book-cover-clarity.png',
  },
  {
    id: 'prod-healing',
    title: 'The Healing',
    slug: 'the-healing',
    subtitle: 'Release. Rebuild.',
    price: '$24.00',
    imageUrl: '/images/book-cover-healing.png',
  },
  {
    id: 'prod-confidence',
    title: 'The Confidence',
    slug: 'the-confidence',
    subtitle: 'Speak. Show up.',
    price: '$24.00',
    imageUrl: '/images/book-cover-confidence.png',
  },
  {
    id: 'prod-abundance',
    title: 'The Abundance',
    slug: 'the-abundance',
    subtitle: 'Create what you deserve.',
    price: '$24.00',
    imageUrl: '/images/book-cover-abundance.png',
  },
  {
    id: 'prod-legacy',
    title: 'The Legacy',
    slug: 'the-legacy',
    subtitle: 'Write your next chapter.',
    price: '$24.00',
    imageUrl: '/images/book-cover-legacy.png',
  },
];

export function JournalsShowcase() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(1);
  const [addedId, setAddedId] = useState<string | null>(null);

  // Update current slide index based on scroll position
  const handleScroll = useCallback(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const card = el.firstElementChild as HTMLElement | null;
    if (!card) return;
    const cardWidth = card.offsetWidth + 14; // width + gap
    const index = Math.min(
      JOURNALS.length,
      Math.max(1, Math.round(el.scrollLeft / cardWidth) + 1)
    );
    setCurrentIndex(index);
  }, []);

  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    el.addEventListener('scroll', handleScroll, { passive: true });
    return () => el.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const scrollPrev = () => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const card = el.firstElementChild as HTMLElement | null;
    const scrollAmount = card ? card.offsetWidth + 14 : 170;
    el.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
  };

  const scrollNext = () => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const card = el.firstElementChild as HTMLElement | null;
    const scrollAmount = card ? card.offsetWidth + 14 : 170;
    el.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };

  const handleAddToCart = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    setAddedId(id);
    setTimeout(() => {
      setAddedId((prev) => (prev === id ? null : prev));
    }, 2000);
  };

  return (
    <section className="relative w-full bg-[#FAF6F0] text-[#1E1C1A] py-8 sm:py-10 lg:py-12 border-b border-[#EBE3D3] overflow-hidden">
      <div className="w-full max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-14 xl:px-16">
        
        {/* =========================================================================
            TOP NAVIGATION ROW: Counter and Prev/Next Arrows (Aligned Top Right)
        ========================================================================= */}
        <div className="flex justify-end items-center mb-3 sm:mb-4">
          <div className="flex items-center gap-3 text-xs font-sans tracking-wider text-[#1E1C1A]">
            <button
              onClick={scrollPrev}
              disabled={currentIndex <= 1}
              aria-label="Previous journal"
              className="p-1 text-[#1E1C1A] hover:text-[#A64426] disabled:text-[#C5BEB3] disabled:cursor-not-allowed transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
            </button>
            <span className="font-mono text-xs text-[#524C46] min-w-[32px] text-center select-none">
              {currentIndex} / {JOURNALS.length}
            </span>
            <button
              onClick={scrollNext}
              disabled={currentIndex >= JOURNALS.length}
              aria-label="Next journal"
              className="p-1 text-[#1E1C1A] hover:text-[#A64426] disabled:text-[#C5BEB3] disabled:cursor-not-allowed transition-colors"
            >
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* =========================================================================
            SPLIT LAYOUT: Left Editorial Narrative + Right Interactive Carousel
        ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          
          {/* Left Column: Editorial Headline & Purpose */}
          <div className="lg:col-span-4 xl:col-span-4 text-start space-y-4 pt-1">
            {/* Eyebrow */}
            <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.28em] text-[#7A7067]">
              OUR JOURNALS
            </p>

            {/* Headline */}
            <h2 className="font-playfair text-3xl sm:text-4xl lg:text-[2.65rem] font-normal text-[#1E1C1A] leading-[1.14] tracking-tight">
              Six Journals.<br />
              One Movement.
            </h2>

            {/* Narrative description */}
            <p className="font-sans text-xs sm:text-[13.5px] text-[#524C46] leading-[1.7] font-normal max-w-sm">
              Thoughtfully designed journals to help you reflect, grow and take up space. Each journal is a step forward in the life you want to live.
            </p>

            {/* Direct Link to all journals */}
            <div className="pt-1">
              <Link
                href="/shop"
                className="group inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-[#A64426] hover:text-[#8E381E] transition-colors"
              >
                <span>Explore All Journals</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
            </div>
          </div>

          {/* Right Column: Carousel of Slim White Pedestal Cards */}
          <div className="lg:col-span-8 xl:col-span-8 min-w-0">
            <div
              ref={scrollContainerRef}
              className="flex gap-3 sm:gap-3.5 overflow-x-auto scrollbar-none scroll-smooth pb-3 pt-1 px-1 -mx-6 sm:-mx-10 lg:mx-0 px-6 sm:px-10 lg:px-0"
              style={{ scrollSnapType: 'x mandatory' }}
            >
              {JOURNALS.map((journal) => {
                const isAdded = addedId === journal.id;

                return (
                  <div
                    key={journal.id}
                    className="w-[145px] sm:w-[158px] shrink-0 bg-white rounded-lg border border-[#EDE7DC] p-3 shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_18px_rgba(30,28,26,0.07)] hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between group"
                    style={{ scrollSnapAlign: 'start' }}
                  >
                    {/* Top Portion: Clickable to Journal Details */}
                    <Link
                      href={`/shop/${journal.slug}`}
                      className="block focus-visible:outline-none"
                    >
                      {/* Book Cover Container with Authentic Figma Book Art */}
                      <div className="relative w-full h-[125px] sm:h-[135px] flex items-center justify-center p-1 mb-2">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={journal.imageUrl}
                          alt={journal.title}
                          className="h-full w-auto max-h-[125px] sm:max-h-[135px] object-contain drop-shadow-[0_6px_14px_rgba(0,0,0,0.12)] transition-transform duration-300 ease-out group-hover:scale-[1.04]"
                        />
                      </div>

                      {/* Title */}
                      <h3 className="font-playfair text-[13px] sm:text-[14px] font-normal text-[#1E1C1A] leading-snug group-hover:text-[#A64426] transition-colors truncate">
                        {journal.title}
                      </h3>

                      {/* Subtitle */}
                      <p className="font-sans text-[10.5px] text-[#7A7268] mt-0.5 mb-1.5 leading-snug line-clamp-1">
                        {journal.subtitle}
                      </p>

                      {/* Price */}
                      <p className="font-sans text-[11.5px] font-semibold text-[#1E1C1A] mb-2">
                        {journal.price}
                      </p>
                    </Link>

                    {/* Bottom Action: Add to Cart Button */}
                    <button
                      onClick={(e) => handleAddToCart(e, journal.id)}
                      className={`w-full py-1.5 px-2 rounded-[5px] text-[11px] font-sans font-medium transition-all duration-200 border flex items-center justify-center gap-1 ${
                        isAdded
                          ? 'bg-[#4F5D48] text-white border-[#4F5D48]'
                          : 'bg-[#F5EFE6] hover:bg-[#EDE3D4] active:bg-[#E2D5C2] text-[#1E1C1A] border-[#2C2723]'
                      }`}
                    >
                      {isAdded ? (
                        <>
                          <Check className="w-3 h-3" />
                          <span>Added</span>
                        </>
                      ) : (
                        <span>Add to Cart</span>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
