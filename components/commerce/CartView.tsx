'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ShoppingBag,
  ArrowRight,
  ArrowLeft,
  Trash2,
  Plus,
  Minus,
  ShieldCheck,
  Sparkles,
  Truck,
  RotateCcw,
  Check,
  Tag,
  Gift,
  Lock,
} from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { useCart } from '@/lib/cart/CartContext';

const JOURNAL_IMAGE_FALLBACKS: Record<string, string> = {
  awakening: '/images/book-cover-awakening.png',
  clarity: '/images/book-cover-clarity.png',
  healing: '/images/book-cover-healing.png',
  confidence: '/images/book-cover-confidence.png',
  abundance: '/images/book-cover-abundance.png',
  legacy: '/images/book-cover-legacy.png',
};

function resolveItemImage(slug: string, imageUrl?: string): string {
  if (imageUrl && !imageUrl.includes('placeholder') && imageUrl.startsWith('/')) {
    return imageUrl;
  }
  const cleanSlug = slug.toLowerCase().replace('the-', '').replace('prod-', '');
  for (const [key, path] of Object.entries(JOURNAL_IMAGE_FALLBACKS)) {
    if (cleanSlug.includes(key)) return path;
  }
  return '/images/book-cover-awakening.png';
}

export function CartView() {
  const { items, totalItems, subtotal, isHydrated, updateQuantity, removeItem, clearCart } = useCart();
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [giftNote, setGiftNote] = useState('');
  const [showGiftNote, setShowGiftNote] = useState(false);

  // Free shipping threshold: $50.00
  const shippingThreshold = 50.0;
  const shippingFee = subtotal >= shippingThreshold || subtotal === 0 ? 0.0 : 5.0;
  const progressPercent = Math.min(100, Math.round((subtotal / shippingThreshold) * 100));
  const amountToFreeShipping = Math.max(0, shippingThreshold - subtotal);
  const discountAmount = promoApplied ? 5.0 : 0.0;
  const estimatedTotal = Math.max(0, subtotal - discountAmount + shippingFee);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (promoCode.trim().toLowerCase() === 'welcome' || promoCode.trim().toLowerCase() === 'naagnool') {
      setPromoApplied(true);
    } else if (promoCode.trim().length > 0) {
      setPromoApplied(true); // Generous acceptance for promo demonstration
    }
  };

  if (!isHydrated) {
    return (
      <div className="py-20 sm:py-28 bg-[#FAF8F5] min-h-[75vh]">
        <Container size="default">
          <div className="animate-pulse space-y-8 max-w-4xl mx-auto">
            <div className="h-6 bg-[#E8E2D8]/60 rounded-full w-48 mx-auto" />
            <div className="h-10 bg-[#E8E2D8]/40 rounded-xl w-64 mx-auto" />
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-7 h-96 bg-white/70 rounded-3xl border border-[#E8E2D8]/60" />
              <div className="lg:col-span-5 h-80 bg-white/70 rounded-3xl border border-[#E8E2D8]/60" />
            </div>
          </div>
        </Container>
      </div>
    );
  }

  // EMPTY BAG STATE
  if (items.length === 0) {
    return (
      <div className="py-16 sm:py-28 bg-[#FAF8F5] min-h-[80vh] flex items-center">
        <Container size="default">
          <div className="max-w-2xl mx-auto text-center space-y-8">
            <div className="relative inline-block">
              <div className="w-20 h-20 rounded-full bg-[#B85233]/10 text-[#B85233] mx-auto flex items-center justify-center ring-8 ring-[#B85233]/5 transition-transform duration-500 hover:scale-105">
                <ShoppingBag className="w-9 h-9 stroke-[1.5]" />
              </div>
              <span className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-[#4D5844] text-white text-[11px] font-bold flex items-center justify-center">
                0
              </span>
            </div>

            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#B85233]">
                Your Sanctuary Bag
              </p>
              <h1 className="font-playfair text-3xl sm:text-5xl font-normal text-[#1E1C1A] tracking-tight">
                Your Shopping Bag is Empty
              </h1>
              <p className="font-sans text-base sm:text-lg text-[#6B655B] max-w-lg mx-auto leading-relaxed pt-2">
                Every great journey begins with a blank page. Discover our six handcrafted guided journals designed to awaken your inner strength, clarity, and purpose.
              </p>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/shop" className="w-full sm:w-auto">
                <Button variant="primary" size="lg" className="w-full sm:w-auto px-8 py-4 shadow-lg shadow-[#B85233]/20">
                  <span>Explore the Journals</span>
                  <ArrowRight className="w-4 h-4 ms-2 rtl:rotate-180" />
                </Button>
              </Link>
              <Link href="/community" className="w-full sm:w-auto">
                <Button variant="outline" size="lg" className="w-full sm:w-auto px-8 py-4 border-[#E8E2D8] hover:border-[#B85233]">
                  Join the Movement
                </Button>
              </Link>
            </div>

            {/* Curated journal micro-preview */}
            <div className="pt-12 border-t border-[#E8E2D8]/70 grid grid-cols-2 sm:grid-cols-3 gap-4 text-start">
              {[
                { title: 'The Awakening', price: '$24.00', image: '/images/book-cover-awakening.png', slug: 'the-awakening' },
                { title: 'The Clarity', price: '$24.00', image: '/images/book-cover-clarity.png', slug: 'the-clarity' },
                { title: 'The Healing', price: '$24.00', image: '/images/book-cover-healing.png', slug: 'the-healing' },
              ].map((rec) => (
                <Link
                  key={rec.slug}
                  href={`/shop/${rec.slug}`}
                  className="group p-3 rounded-2xl bg-white border border-[#E8E2D8]/60 hover:border-[#B85233]/40 transition-all duration-300 hover:shadow-md"
                >
                  <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-[#F5F2EB] mb-2.5">
                    <Image
                      src={rec.image}
                      alt={rec.title}
                      fill
                      className="object-contain p-2 group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <h4 className="font-playfair text-sm text-[#1E1C1A] font-medium truncate group-hover:text-[#B85233] transition-colors">
                    {rec.title}
                  </h4>
                  <p className="text-xs text-[#6B655B]">{rec.price}</p>
                </Link>
              ))}
            </div>

            {/* Assurance Badges */}
            <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-[#6B655B]">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#4D5844]" />
                <span>256-Bit SSL Encrypted</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#B85233]" />
                <span>Complimentary Shipping Over $50</span>
              </div>
              <div className="flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-[#4D5844]" />
                <span>30-Day Intentional Guarantee</span>
              </div>
            </div>
          </div>
        </Container>
      </div>
    );
  }

  // ACTIVE CART
  return (
    <div className="py-10 sm:py-16 bg-[#FAF8F5] min-h-[85vh]">
      <Container size="default">
        {/* Breadcrumbs */}
        <nav aria-label="Breadcrumb" className="mb-6 sm:mb-8">
          <ol className="flex items-center gap-2 text-xs text-[#8A847A]">
            <li>
              <Link href="/" className="hover:text-[#B85233] transition-colors">
                Home
              </Link>
            </li>
            <li>/</li>
            <li>
              <Link href="/shop" className="hover:text-[#B85233] transition-colors">
                Shop
              </Link>
            </li>
            <li>/</li>
            <li className="text-[#1E1C1A] font-semibold">Shopping Bag</li>
          </ol>
        </nav>

        {/* Header section with shipping meter */}
        <div className="mb-8 pb-6 border-b border-[#E8E2D8]">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-5">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] font-semibold text-[#B85233] mb-1">
                Your Selection
              </p>
              <h1 className="font-playfair text-3xl sm:text-4xl lg:text-5xl font-normal text-[#1E1C1A] tracking-tight">
                Shopping Bag <span className="text-xl sm:text-2xl text-[#8A847A] font-sans font-light">({totalItems} {totalItems === 1 ? 'item' : 'items'})</span>
              </h1>
            </div>

            <Link
              href="/shop"
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-[#6B655B] hover:text-[#B85233] transition-colors group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform rtl:rotate-180" />
              <span>Continue Shopping</span>
            </Link>
          </div>

          {/* Complimentary Shipping Progress Meter */}
          <div className="p-4 rounded-2xl bg-white border border-[#E8E2D8] shadow-xs">
            <div className="flex items-center justify-between gap-2 text-xs sm:text-sm font-medium mb-2.5">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#B85233] shrink-0" />
                {amountToFreeShipping === 0 ? (
                  <span className="text-[#4D5844] font-semibold">
                    Congratulations! You have unlocked Complimentary Priority Shipping.
                  </span>
                ) : (
                  <span className="text-[#1E1C1A]">
                    Add <strong className="text-[#B85233] font-semibold">${amountToFreeShipping.toFixed(2)}</strong> more to unlock <span className="underline decoration-[#B85233]/40">Complimentary Shipping</span>
                  </span>
                )}
              </div>
              <span className="text-xs text-[#8A847A] font-mono shrink-0">
                ${subtotal.toFixed(2)} / ${shippingThreshold.toFixed(2)}
              </span>
            </div>

            <div className="w-full h-2 rounded-full bg-[#F0EBE1] overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ease-out ${
                  amountToFreeShipping === 0 ? 'bg-[#4D5844]' : 'bg-[#B85233]'
                }`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Two-Column Grid: Bag Items vs Order Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* LEFT: Items List */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-4">
              {items.map((item) => {
                const itemImage = resolveItemImage(item.slug, item.imageUrl);
                const lineTotal = item.price * item.quantity;

                return (
                  <div
                    key={item.id}
                    className="group p-4 sm:p-5 rounded-3xl bg-white border border-[#E8E2D8] hover:border-[#D48344]/50 transition-all duration-300 shadow-xs flex flex-col sm:flex-row gap-4 sm:gap-6 items-start sm:items-center"
                  >
                    {/* Item Thumbnail Frame */}
                    <Link
                      href={`/shop/${item.slug}`}
                      className="relative w-24 h-32 sm:w-28 sm:h-36 rounded-2xl overflow-hidden bg-[#F5F2EB] border border-[#E8E2D8]/70 shrink-0 shadow-inner group-hover:scale-[1.02] transition-transform duration-300"
                    >
                      <Image
                        src={itemImage}
                        alt={item.title}
                        fill
                        className="object-contain p-2"
                        sizes="(max-width: 640px) 96px, 112px"
                      />
                    </Link>

                    {/* Item Details */}
                    <div className="flex-1 min-w-0 space-y-2 w-full">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-[#8A847A]">
                            Hardcover Guided Journal
                          </span>
                          <Link href={`/shop/${item.slug}`}>
                            <h3 className="font-playfair text-lg sm:text-xl font-medium text-[#1E1C1A] hover:text-[#B85233] transition-colors truncate">
                              {item.title}
                            </h3>
                          </Link>
                        </div>

                        {/* Remove Action */}
                        <button
                          type="button"
                          onClick={() => removeItem(item.id)}
                          aria-label={`Remove ${item.title}`}
                          className="p-2 rounded-full text-[#8A847A] hover:text-[#B85233] hover:bg-[#FAF8F5] transition-all"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="flex items-center gap-2 text-xs text-[#4D5844] font-medium">
                        <Check className="w-3.5 h-3.5 text-[#4D5844]" />
                        <span>In Stock • Dispatched within 24 hours</span>
                      </div>

                      <div className="pt-2 flex items-center justify-between gap-4 border-t border-[#F0EBE1]">
                        {/* Tactile Quantity Stepper */}
                        <div className="flex items-center gap-2 bg-[#FAF8F5] border border-[#E8E2D8] rounded-full p-1">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            className="w-7 h-7 rounded-full flex items-center justify-center text-[#1E1C1A] hover:bg-white disabled:opacity-30 disabled:hover:bg-transparent transition-all active:scale-90"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-8 text-center font-mono text-sm font-semibold text-[#1E1C1A]">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            disabled={item.quantity >= 99}
                            className="w-7 h-7 rounded-full flex items-center justify-center text-[#1E1C1A] hover:bg-white disabled:opacity-30 disabled:hover:bg-transparent transition-all active:scale-90"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        {/* Price Breakdown */}
                        <div className="text-end">
                          <div className="font-playfair text-lg sm:text-xl font-semibold text-[#1E1C1A]">
                            ${lineTotal.toFixed(2)}
                          </div>
                          {item.quantity > 1 && (
                            <div className="text-[11px] text-[#8A847A] font-mono">
                              (${item.price.toFixed(2)} each)
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Clear Cart Option */}
            <div className="flex items-center justify-between text-xs text-[#8A847A] pt-2">
              <button
                type="button"
                onClick={clearCart}
                className="hover:text-[#B85233] transition-colors underline decoration-[#8A847A]/30 underline-offset-4"
              >
                Clear all items from bag
              </button>
              <span>Prices listed in USD</span>
            </div>

            {/* Optional Gift Message & Notes Accordion */}
            <div className="p-5 rounded-3xl bg-white border border-[#E8E2D8] shadow-xs">
              <button
                type="button"
                onClick={() => setShowGiftNote(!showGiftNote)}
                className="w-full flex items-center justify-between text-sm font-medium text-[#1E1C1A] hover:text-[#B85233] transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <Gift className="w-4 h-4 text-[#B85233]" />
                  <span>Complimentary Gift Packaging & Personal Note</span>
                </div>
                <span className="text-xs text-[#8A847A] underline">
                  {showGiftNote ? 'Collapse' : 'Add Note'}
                </span>
              </button>

              {showGiftNote && (
                <div className="mt-4 pt-4 border-t border-[#F0EBE1] space-y-2 animate-in fade-in duration-200">
                  <p className="text-xs text-[#6B655B]">
                    Include a handwritten note with your order. Hand-inscribed on gold-stamped cardstock.
                  </p>
                  <textarea
                    rows={3}
                    value={giftNote}
                    onChange={(e) => setGiftNote(e.target.value)}
                    placeholder="Write your personal message here (e.g., 'May this journal be the beginning of your sacred clarity...')"
                    className="w-full p-3 rounded-2xl bg-[#FAF8F5] border border-[#E8E2D8] text-sm text-[#1E1C1A] placeholder-[#A0988A] focus:outline-none focus:ring-2 focus:ring-[#B85233]/20 focus:border-[#B85233]"
                  />
                </div>
              )}
            </div>

            {/* Reassurance Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
              <div className="p-4 rounded-2xl bg-white/60 border border-[#E8E2D8]/80 text-center space-y-1.5">
                <Sparkles className="w-4 h-4 text-[#B85233] mx-auto" />
                <h5 className="font-playfair text-xs font-semibold text-[#1E1C1A]">Artisanal Craft</h5>
                <p className="text-[11px] text-[#6B655B] leading-snug">Hardcover linen with metallic gold embossing</p>
              </div>
              <div className="p-4 rounded-2xl bg-white/60 border border-[#E8E2D8]/80 text-center space-y-1.5">
                <Truck className="w-4 h-4 text-[#4D5844] mx-auto" />
                <h5 className="font-playfair text-xs font-semibold text-[#1E1C1A]">Dispatched Globally</h5>
                <p className="text-[11px] text-[#6B655B] leading-snug">Tracked priority delivery worldwide</p>
              </div>
              <div className="p-4 rounded-2xl bg-white/60 border border-[#E8E2D8]/80 text-center space-y-1.5">
                <RotateCcw className="w-4 h-4 text-[#B85233] mx-auto" />
                <h5 className="font-playfair text-xs font-semibold text-[#1E1C1A]">Thoughtful Return</h5>
                <p className="text-[11px] text-[#6B655B] leading-snug">30-day effortless return guarantee</p>
              </div>
            </div>
          </div>

          {/* RIGHT: Sticky Order Summary */}
          <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-6">
            <div className="p-6 sm:p-7 rounded-3xl bg-white border border-[#E8E2D8] shadow-sm space-y-6">
              <h2 className="font-playfair text-2xl font-normal text-[#1E1C1A] pb-4 border-b border-[#E8E2D8]">
                Order Summary
              </h2>

              {/* Price Calculation breakdown */}
              <div className="space-y-3.5 text-sm">
                <div className="flex items-center justify-between text-[#6B655B]">
                  <span>Items Subtotal</span>
                  <span className="font-mono text-[#1E1C1A] font-medium">${subtotal.toFixed(2)}</span>
                </div>

                <div className="flex items-center justify-between text-[#6B655B]">
                  <span>Shipping</span>
                  {shippingFee === 0 ? (
                    <span className="font-semibold text-[#4D5844] bg-[#4D5844]/10 px-2 py-0.5 rounded-full text-xs">
                      COMPLIMENTARY
                    </span>
                  ) : (
                    <span className="font-mono text-[#1E1C1A] font-medium">${shippingFee.toFixed(2)}</span>
                  )}
                </div>

                {promoApplied && (
                  <div className="flex items-center justify-between text-[#B85233] bg-[#B85233]/5 px-3 py-2 rounded-xl">
                    <span className="flex items-center gap-1.5 text-xs font-medium">
                      <Tag className="w-3.5 h-3.5" />
                      Promo Code Applied
                    </span>
                    <span className="font-mono font-semibold text-xs">-${discountAmount.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex items-center justify-between text-[#8A847A] text-xs">
                  <span>Estimated Taxes</span>
                  <span>Calculated at checkout</span>
                </div>
              </div>

              {/* Promo Code Input */}
              <form onSubmit={handleApplyPromo} className="pt-2 flex gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="Gift card or discount code"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#E8E2D8] text-xs text-[#1E1C1A] placeholder-[#A0988A] focus:outline-none focus:border-[#B85233]"
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-xl bg-[#1E1C1A] text-white hover:bg-[#B85233] text-xs font-medium transition-all active:scale-95"
                >
                  Apply
                </button>
              </form>

              {/* Divider */}
              <div className="pt-4 border-t border-[#E8E2D8]">
                <div className="flex items-baseline justify-between mb-1">
                  <span className="font-playfair text-lg font-medium text-[#1E1C1A]">Estimated Total</span>
                  <div className="text-end">
                    <span className="font-playfair text-2xl sm:text-3xl font-semibold text-[#1E1C1A]">
                      ${estimatedTotal.toFixed(2)}
                    </span>
                    <span className="text-[11px] text-[#8A847A] ms-1 uppercase font-mono">USD</span>
                  </div>
                </div>
                <p className="text-[11px] text-[#8A847A]">
                  Taxes and final shipping calculated during checkout
                </p>
              </div>

              {/* Primary Checkout CTA */}
              <div className="pt-2 space-y-3">
                <Link href="/checkout" className="block w-full">
                  <button
                    type="button"
                    className="w-full py-4 px-6 rounded-full bg-[#B85233] hover:bg-[#9E4228] text-white text-sm sm:text-base font-medium tracking-wide flex items-center justify-center gap-2.5 shadow-lg shadow-[#B85233]/25 transition-all duration-300 active:scale-[0.98] group"
                  >
                    <Lock className="w-4 h-4 opacity-80" />
                    <span>Proceed to Checkout</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform rtl:rotate-180" />
                  </button>
                </Link>

                <p className="text-center text-[11px] text-[#8A847A] flex items-center justify-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#4D5844]" />
                  <span>Guaranteed safe & bank-grade encrypted checkout</span>
                </p>
              </div>

              {/* Supported Payment Options Mini-Gallery */}
              <div className="pt-5 border-t border-[#F0EBE1] space-y-2.5">
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#8A847A] text-center">
                  Accepted Payment Methods
                </p>
                <div className="flex flex-wrap items-center justify-center gap-2">
                  <span className="px-2.5 py-1 rounded-md bg-[#FAF8F5] border border-[#E8E2D8] text-[11px] font-medium text-[#1E1C1A]">
                    💳 Credit / Debit Card
                  </span>
                  <span className="px-2.5 py-1 rounded-md bg-[#FAF8F5] border border-[#E8E2D8] text-[11px] font-medium text-[#1E1C1A]">
                    📱 EVC Plus
                  </span>
                  <span className="px-2.5 py-1 rounded-md bg-[#FAF8F5] border border-[#E8E2D8] text-[11px] font-medium text-[#1E1C1A]">
                    📱 ZAAD
                  </span>
                  <span className="px-2.5 py-1 rounded-md bg-[#FAF8F5] border border-[#E8E2D8] text-[11px] font-medium text-[#1E1C1A]">
                    📱 Sahal
                  </span>
                  <span className="px-2.5 py-1 rounded-md bg-[#FAF8F5] border border-[#E8E2D8] text-[11px] font-medium text-[#1E1C1A]">
                    📱 eDahab
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
