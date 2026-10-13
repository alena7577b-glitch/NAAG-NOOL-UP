'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Check, ShoppingBag } from 'lucide-react';
import { useOptionalCart } from '@/lib/cart/CartContext';

export interface ShowcaseProduct {
  id: string;
  title: string;
  slug: string;
  description?: string | null;
  price: number;
  category?: string;
  imageUrl?: string;
  tagline?: string;
}

export interface JournalsShowcaseProps {
  products?: ShowcaseProduct[];
}

export function JournalsShowcase({ products = [] }: JournalsShowcaseProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(1);
  const [addedIds, setAddedIds] = useState<Record<string, boolean>>({});
  const optionalCart = useOptionalCart();

  // Update current slide index based on scroll position
  const handleScroll = useCallback(() => {
    const el = scrollContainerRef.current;
    if (!el || products.length === 0) return;
    const card = el.firstElementChild as HTMLElement | null;
    if (!card) return;
    const cardWidth = card.offsetWidth + 16;
    const index = Math.min(
      products.length,
      Math.max(1, Math.round(el.scrollLeft / cardWidth) + 1)
    );
    setCurrentIndex(index);
  }, [products.length]);

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
    const scrollAmount = card ? card.offsetWidth + 16 : 220;
    el.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
  };

  const scrollNext = () => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const card = el.firstElementChild as HTMLElement | null;
    const scrollAmount = card ? card.offsetWidth + 16 : 220;
    el.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };

  const handleAddToCart = (e: React.MouseEvent, product: ShowcaseProduct) => {
    e.preventDefault();
    e.stopPropagation();

    if (optionalCart) {
      optionalCart.addItem({
        id: product.id,
        title: product.title,
        slug: product.slug,
        price: Number(product.price),
        imageUrl: product.imageUrl || '',
        category: product.category,
      });
    }

    setAddedIds((prev) => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedIds((prev) => ({ ...prev, [product.id]: false }));
    }, 2200);
  };

  if (products.length === 0) return null;

  return (
    <section className="relative w-full bg-[#FAF6F0] text-[#1E1C1A] py-12 sm:py-16 lg:py-20 border-b border-[#EBE3D3] overflow-hidden">
      <div className="w-full max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-14 xl:px-16">
        
        {/* =========================================================================
            TOP ROW: Title & Controls
        ========================================================================= */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 sm:mb-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-4 h-[1.5px] bg-[#A64426]" />
              <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.28em] text-[#A64426]">
                BOUTIQUE COLLECTION
              </p>
            </div>
            <h2 className="font-playfair text-3xl sm:text-4xl lg:text-[2.65rem] font-normal text-[#1E1C1A] leading-[1.15] tracking-tight">
              Crafted for Intention & Growth.
            </h2>
          </div>

          {/* Carousel Arrows & Counter */}
          <div className="flex items-center gap-3">
            <button
              onClick={scrollPrev}
              disabled={currentIndex <= 1}
              aria-label="Previous product"
              className="w-9 h-9 rounded-full border border-[#DCD3C4] bg-white flex items-center justify-center text-[#1E1C1A] hover:border-[#A64426] hover:text-[#A64426] disabled:opacity-40 disabled:hover:border-[#DCD3C4] disabled:hover:text-[#1E1C1A] transition-colors cursor-pointer disabled:cursor-not-allowed shadow-xs"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <span className="font-mono text-xs text-[#7A7067] min-w-[44px] text-center select-none font-medium">
              {currentIndex} / {products.length}
            </span>
            <button
              onClick={scrollNext}
              disabled={currentIndex >= products.length}
              aria-label="Next product"
              className="w-9 h-9 rounded-full border border-[#DCD3C4] bg-white flex items-center justify-center text-[#1E1C1A] hover:border-[#A64426] hover:text-[#A64426] disabled:opacity-40 disabled:hover:border-[#DCD3C4] disabled:hover:text-[#1E1C1A] transition-colors cursor-pointer disabled:cursor-not-allowed shadow-xs"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* =========================================================================
            SPLIT LAYOUT: Left Editorial Narrative + Right Interactive Carousel
        ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          
          {/* Left Column: Editorial Manifesto */}
          <div className="lg:col-span-4 xl:col-span-4 text-start space-y-4 pt-1">
            <p className="font-sans text-xs sm:text-[14px] text-[#524C46] leading-[1.75] font-normal">
              From our signature guided journals available in English & Somali editions, to coordinates notebooks, artisanal stoneware, and statement canvas totes — every piece is designed to ground your days in strength and purpose.
            </p>

            <div className="pt-2">
              <Link
                href="/shop"
                className="group inline-flex items-center gap-2 text-xs sm:text-sm font-semibold uppercase tracking-[0.1em] text-[#A64426] hover:text-[#8E381E] transition-colors"
              >
                <span>View Full Boutique</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
            </div>
          </div>

          {/* Right Column: Carousel of Product Cards */}
          <div className="lg:col-span-8 xl:col-span-8 min-w-0">
            <div
              ref={scrollContainerRef}
              className="flex gap-4 overflow-x-auto scrollbar-none scroll-smooth pb-4 pt-1 px-1 -mx-6 sm:-mx-10 lg:mx-0 px-6 sm:px-10 lg:px-0"
              style={{ scrollSnapType: 'x mandatory' }}
            >
              {products.map((product) => {
                const isAdded = !!addedIds[product.id];
                const isPortrait =
                  product.category?.toLowerCase().includes('journal') ||
                  product.category?.toLowerCase().includes('notebook');

                return (
                  <div
                    key={product.id}
                    className="w-[200px] sm:w-[220px] shrink-0 bg-white rounded-xl border border-[#EDE7DC] p-3.5 shadow-[0_2px_10px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_24px_rgba(30,28,26,0.08)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group"
                    style={{ scrollSnapAlign: 'start' }}
                  >
                    {/* Top Portion: Clickable Link */}
                    <Link
                      href={`/shop/${product.slug}`}
                      className="block focus-visible:outline-none"
                    >
                      {/* Product Image Frame */}
                      <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden bg-[#FAF6F0] mb-3 flex items-center justify-center p-2 border border-[#EFE9DF]">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={product.imageUrl}
                          alt={product.title}
                          className={`w-full h-full transition-transform duration-300 ease-out group-hover:scale-[1.05] ${
                            isPortrait ? 'object-contain' : 'object-cover'
                          }`}
                        />
                      </div>

                      {/* Category Badge */}
                      <span className="inline-block text-[10px] font-sans font-semibold uppercase tracking-wider text-[#A64426] mb-1">
                        {product.category}
                      </span>

                      {/* Title */}
                      <h3 className="font-playfair text-[14px] font-normal text-[#1E1C1A] leading-snug group-hover:text-[#A64426] transition-colors line-clamp-1">
                        {product.title}
                      </h3>

                      {/* Tagline / Subtitle */}
                      <p className="font-sans text-[11px] text-[#7A7268] mt-0.5 mb-2 leading-snug line-clamp-1">
                        {product.tagline || product.description}
                      </p>

                      {/* Price */}
                      <p className="font-sans text-xs font-bold text-[#1E1C1A] mb-3">
                        ${Number(product.price).toFixed(2)} CAD
                      </p>
                    </Link>

                    {/* Add to Cart Button */}
                    <button
                      onClick={(e) => handleAddToCart(e, product)}
                      className={`w-full py-2 px-3 rounded-lg text-xs font-sans font-medium transition-all duration-200 border flex items-center justify-center gap-1.5 cursor-pointer ${
                        isAdded
                          ? 'bg-[#4F5D48] text-white border-[#4F5D48]'
                          : 'bg-[#FAF6F0] hover:bg-[#A64426] hover:text-white hover:border-[#A64426] text-[#1E1C1A] border-[#DCD3C4]'
                      }`}
                    >
                      {isAdded ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Added to Cart</span>
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>Add to Cart</span>
                        </>
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
