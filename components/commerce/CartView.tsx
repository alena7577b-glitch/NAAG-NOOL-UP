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
  HeartHandshake,
  CheckCircle2,
  AlertCircle,
  Undo2,
  ShieldAlert,
} from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { useCart, CartItem } from '@/lib/cart/CartContext';
import { useCurrency } from '@/lib/currency/context';

const JOURNAL_IMAGE_FALLBACKS: Record<string, string> = {
  awakening: '/images/book-cover-awakening.png',
  clarity: '/images/book-cover-clarity.png',
  healing: '/images/book-cover-healing.png',
  confidence: '/images/book-cover-confidence.png',
  abundance: '/images/book-cover-abundance.png',
  legacy: '/images/book-cover-legacy.png',
};

function resolveItemImage(slug: string, imageUrl?: string): string {
  if (imageUrl && !imageUrl.includes('placeholder') && (imageUrl.startsWith('/') || imageUrl.startsWith('http'))) {
    return imageUrl;
  }
  const cleanSlug = slug.toLowerCase().replace('the-', '').replace('prod-', '');
  for (const [key, path] of Object.entries(JOURNAL_IMAGE_FALLBACKS)) {
    if (cleanSlug.includes(key)) return path;
  }
  return '/images/book-cover-awakening.png';
}

export function CartView() {
  const { items, totalItems, subtotal, isHydrated, updateQuantity, removeItem, clearCart, addItem } = useCart();
  const { currency, formatPrice } = useCurrency();

  // Promo code handling
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoDiscountRate, setPromoDiscountRate] = useState(0);
  const [promoError, setPromoError] = useState<string | null>(null);

  // Gift Note
  const [giftNote, setGiftNote] = useState('');
  const [showGiftNote, setShowGiftNote] = useState(false);
  const [giftWrapping, setGiftWrapping] = useState(false);

  // Transit Protection ($1.95)
  const [transitProtection, setTransitProtection] = useState(true);

  // Undo removal support
  const [lastRemovedItem, setLastRemovedItem] = useState<CartItem | null>(null);

  // Complimentary shipping threshold ($50.00)
  const shippingThreshold = 50.0;
  const isFreeShippingUnlocked = subtotal >= shippingThreshold && subtotal > 0;
  const shippingFee = isFreeShippingUnlocked || subtotal === 0 ? 0.0 : 6.0;
  const progressPercent = Math.min(100, Math.round((subtotal / shippingThreshold) * 100));
  const amountToFreeShipping = Math.max(0, shippingThreshold - subtotal);

  // Financial calculations
  const discountAmount = promoApplied ? (promoDiscountRate > 0 ? (subtotal * promoDiscountRate) : 5.0) : 0.0;
  const protectionFee = transitProtection && subtotal > 0 ? 1.95 : 0.0;
  const estimatedTotal = Math.max(0, subtotal - discountAmount + shippingFee + protectionFee);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = promoCode.trim().toUpperCase();

    if (!cleanCode) {
      setPromoError('Please enter a promotion code.');
      return;
    }

    if (cleanCode === 'WELCOME10') {
      setPromoApplied(true);
      setPromoDiscountRate(0.10);
      setPromoError(null);
    } else if (cleanCode === 'AYEEYO' || cleanCode === 'NAAGNOOL') {
      setPromoApplied(true);
      setPromoDiscountRate(0.15);
      setPromoError(null);
    } else if (cleanCode.length >= 3) {
      // Generous fallback voucher code
      setPromoApplied(true);
      setPromoDiscountRate(0.05);
      setPromoError(null);
    } else {
      setPromoError('Invalid promotion code. Try "WELCOME10" or "NAAGNOOL".');
    }
  };

  const handleRemovePromo = () => {
    setPromoApplied(false);
    setPromoDiscountRate(0);
    setPromoCode('');
    setPromoError(null);
  };

  const handleRemoveWithUndo = (item: CartItem) => {
    setLastRemovedItem(item);
    removeItem(item.id);
  };

  const handleUndoRemoval = () => {
    if (lastRemovedItem) {
      addItem(
        {
          id: lastRemovedItem.id,
          productId: lastRemovedItem.productId,
          title: lastRemovedItem.title,
          slug: lastRemovedItem.slug,
          price: lastRemovedItem.price,
          imageUrl: lastRemovedItem.imageUrl,
          category: lastRemovedItem.category,
          color: lastRemovedItem.color,
          edition: lastRemovedItem.edition,
        },
        lastRemovedItem.quantity
      );
      setLastRemovedItem(null);
    }
  };

  // HYDRATION SKELETON
  if (!isHydrated) {
    return (
      <div className="py-20 sm:py-28 bg-[#FAF8F5] min-h-[75vh]">
        <Container size="default">
          <div className="animate-pulse space-y-8 max-w-4xl mx-auto">
            <div className="h-6 bg-[#E8E2D8]/60 rounded-full w-48 mx-auto" />
            <div className="h-10 bg-[#E8E2D8]/40 rounded-xl w-64 mx-auto" />
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-7 h-96 bg-white rounded-3xl border border-[#E8E2D8]" />
              <div className="lg:col-span-5 h-80 bg-white rounded-3xl border border-[#E8E2D8]" />
            </div>
          </div>
        </Container>
      </div>
    );
  }

  // EMPTY BAG STATE (Luxury Sanctuary Lookbook)
  if (items.length === 0) {
    return (
      <div className="py-16 sm:py-28 bg-[#FAF8F5] min-h-[85vh] flex items-center">
        <Container size="default">
          <div className="max-w-3xl mx-auto text-center space-y-10">
            {/* Header Icon with Gold Laurel Ring */}
            <div className="relative inline-block">
              <div className="w-24 h-24 rounded-full bg-white border border-[#E8E2D8] shadow-sm flex items-center justify-center mx-auto text-[#182821] ring-12 ring-[#182821]/5">
                <ShoppingBag className="w-10 h-10 stroke-[1.2] text-[#B85233]" />
              </div>
              <span className="absolute -top-1 -right-1 w-7 h-7 rounded-full bg-[#182821] text-[#D49B4B] text-xs font-serif font-bold flex items-center justify-center border-2 border-white shadow-xs">
                0
              </span>
            </div>

            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FAF3EC] border border-[#E8E2D8] text-[11px] font-semibold uppercase tracking-[0.2em] text-[#B85233]">
                <Sparkles className="w-3.5 h-3.5 text-[#D49B4B]" />
                <span>Sanctuary Collection</span>
              </div>
              <h1 className="font-playfair text-3xl sm:text-5xl font-normal text-[#1E1C1A] tracking-tight">
                Your Shopping Bag is Empty
              </h1>
              <p className="font-sans text-base sm:text-lg text-[#6B655B] max-w-xl mx-auto leading-relaxed">
                Every sacred transformation begins with an open mind and a blank page. Discover our six handcrafted guided journals designed to awaken your inner strength, clarity, and purpose.
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <Link href="/shop" className="w-full sm:w-auto">
                <button
                  type="button"
                  className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#182821] hover:bg-[#22382E] text-white font-medium text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg shadow-[#182821]/15 transition-all duration-300 active:scale-[0.98]"
                >
                  <span>Explore the Journals</span>
                  <ArrowRight className="w-4 h-4 text-[#D49B4B] rtl:rotate-180" />
                </button>
              </Link>
              <Link href="/ayeyo-koris" className="w-full sm:w-auto">
                <button
                  type="button"
                  className="w-full sm:w-auto px-8 py-4 rounded-full bg-white hover:bg-[#FAF8F5] border border-[#E8E2D8] text-[#1E1C1A] font-medium text-sm sm:text-base transition-colors"
                >
                  Our Philanthropic Mission
                </button>
              </Link>
            </div>

            {/* Curated Journal Micro-Showcase */}
            <div className="pt-10 border-t border-[#E8E2D8]">
              <div className="text-center mb-6">
                <span className="text-xs uppercase tracking-widest font-semibold text-[#8A847A]">
                  Curated Journal Recommendations
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 text-start">
                {[
                  {
                    title: 'The Awakening Edition',
                    subtitle: 'Rebirth & Unshakable Purpose',
                    price: 24.0,
                    image: '/images/book-cover-awakening.png',
                    slug: 'the-awakening',
                  },
                  {
                    title: 'The Clarity Edition',
                    subtitle: 'Focus, Calm & Quiet Resolution',
                    price: 24.0,
                    image: '/images/book-cover-clarity.png',
                    slug: 'the-clarity',
                  },
                  {
                    title: 'The Healing Edition',
                    subtitle: 'Compassion & Generational Grace',
                    price: 24.0,
                    image: '/images/book-cover-healing.png',
                    slug: 'the-healing',
                  },
                ].map((rec) => (
                  <div
                    key={rec.slug}
                    className="group p-4 rounded-3xl bg-white border border-[#E8E2D8] hover:border-[#D49B4B] transition-all duration-300 hover:shadow-md flex flex-col justify-between"
                  >
                    <div>
                      <Link href={`/shop/${rec.slug}`} className="block relative aspect-[4/5] rounded-2xl overflow-hidden bg-[#FAF8F5] mb-3">
                        <Image
                          src={rec.image}
                          alt={rec.title}
                          fill
                          className="object-contain p-3 group-hover:scale-105 transition-transform duration-500"
                        />
                      </Link>
                      <h4 className="font-playfair text-base font-semibold text-[#1E1C1A] group-hover:text-[#B85233] transition-colors">
                        {rec.title}
                      </h4>
                      <p className="text-xs text-[#8A847A] mt-0.5 line-clamp-1">{rec.subtitle}</p>
                    </div>

                    <div className="pt-3 mt-3 border-t border-[#F5F2EB] flex items-center justify-between">
                      <span className="font-playfair text-sm font-semibold text-[#1E1C1A]">
                        {formatPrice(rec.price)}
                      </span>
                      <button
                        type="button"
                        onClick={() => addItem({
                          id: rec.slug,
                          productId: rec.slug,
                          title: rec.title,
                          slug: rec.slug,
                          price: rec.price,
                          imageUrl: rec.image,
                          category: 'Guided Journal',
                        }, 1)}
                        className="px-3 py-1.5 rounded-full bg-[#182821] hover:bg-[#22382E] text-white text-xs font-medium flex items-center gap-1 transition-all active:scale-95 shadow-xs"
                      >
                        <Plus className="w-3 h-3 text-[#D49B4B]" />
                        <span>Add</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Reassurance Guarantees */}
            <div className="pt-6 flex flex-wrap items-center justify-center gap-8 text-xs text-[#6B655B]">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#182821]" />
                <span>256-Bit SSL Bank-Grade Security</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#B85233]" />
                <span>Complimentary Shipping Over $50</span>
              </div>
              <div className="flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-[#D49B4B]" />
                <span>30-Day Mindful Return Guarantee</span>
              </div>
            </div>
          </div>
        </Container>
      </div>
    );
  }

  // ACTIVE CART EXPERIENCE
  return (
    <div className="py-10 sm:py-16 bg-[#FAF8F5] min-h-[90vh]">
      <Container size="default">
        {/* Navigation Breadcrumbs */}
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
                Sanctuary Shop
              </Link>
            </li>
            <li>/</li>
            <li className="text-[#1E1C1A] font-semibold">Shopping Bag</li>
          </ol>
        </nav>

        {/* Header Strip with Shipping Meter */}
        <div className="mb-8 pb-6 border-b border-[#E8E2D8]">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] font-semibold text-[#B85233] mb-1">
                <Sparkles className="w-3.5 h-3.5 text-[#D49B4B]" />
                <span>Your Curated Bag</span>
              </div>
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

          {/* Complimentary Shipping Progress Card */}
          <div className="p-4 sm:p-5 rounded-3xl bg-white border border-[#E8E2D8] shadow-xs">
            <div className="flex items-center justify-between gap-3 text-xs sm:text-sm font-medium mb-3">
              <div className="flex items-center gap-2.5">
                {isFreeShippingUnlocked ? (
                  <div className="w-6 h-6 rounded-full bg-[#182821] text-[#D49B4B] flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                  </div>
                ) : (
                  <Truck className="w-5 h-5 text-[#B85233] shrink-0" />
                )}

                {isFreeShippingUnlocked ? (
                  <span className="text-[#182821] font-semibold">
                    Congratulations! You have unlocked <span className="text-[#B85233]">Complimentary Worldwide Priority Shipping</span>.
                  </span>
                ) : (
                  <span className="text-[#1E1C1A]">
                    Add <strong className="text-[#B85233] font-semibold">{formatPrice(amountToFreeShipping)}</strong> more to your bag to unlock <span className="underline decoration-[#D49B4B]">Complimentary Priority Shipping</span>
                  </span>
                )}
              </div>

              <span className="text-xs text-[#8A847A] font-mono shrink-0">
                {formatPrice(subtotal)} / {formatPrice(shippingThreshold)}
              </span>
            </div>

            <div className="w-full h-2 rounded-full bg-[#FAF3EC] overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ease-out ${
                  isFreeShippingUnlocked ? 'bg-[#182821]' : 'bg-gradient-to-r from-[#B85233] to-[#D49B4B]'
                }`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Undo removal toast alert */}
        {lastRemovedItem && (
          <div className="mb-6 p-4 rounded-2xl bg-[#182821] text-white shadow-lg flex items-center justify-between gap-4 animate-in slide-in-from-top-2 duration-300">
            <div className="flex items-center gap-3 text-xs sm:text-sm">
              <AlertCircle className="w-4 h-4 text-[#D49B4B] shrink-0" />
              <span>
                Removed <strong>{lastRemovedItem.title}</strong> from your shopping bag.
              </span>
            </div>
            <button
              type="button"
              onClick={handleUndoRemoval}
              className="px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-[#D49B4B] font-semibold text-xs flex items-center gap-1.5 transition-colors"
            >
              <Undo2 className="w-3.5 h-3.5" />
              <span>Undo</span>
            </button>
          </div>
        )}

        {/* Main Grid: Left Items + Right Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* ============================================================== */}
          {/* LEFT: Items List & Addons                                      */}
          {/* ============================================================== */}
          <div className="lg:col-span-7 space-y-6">
            {/* Philanthropic Impact Strip */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-[#FAF3EC] to-white border border-[#E8E2D8] flex items-center gap-3.5 shadow-xs">
              <div className="w-10 h-10 rounded-full bg-[#182821] text-[#D49B4B] flex items-center justify-center shrink-0">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <div className="text-xs leading-relaxed">
                <p className="font-semibold text-[#182821]">Ayeeyo Koris Foundation Guarantee</p>
                <p className="text-[#6B655B]">
                  10% of this purchase directly funds young Somali girls&apos; school scholarships and grandmother literacy circles.
                </p>
              </div>
            </div>

            {/* List of Cart Items */}
            <div className="space-y-4">
              {items.map((item) => {
                const itemImage = resolveItemImage(item.slug, item.imageUrl);
                const lineTotal = item.price * item.quantity;

                return (
                  <div
                    key={item.id}
                    className="group p-5 rounded-3xl bg-white border border-[#E8E2D8] hover:border-[#D49B4B]/50 transition-all duration-300 shadow-xs flex flex-col sm:flex-row gap-5 items-start sm:items-center relative"
                  >
                    {/* Item Thumbnail */}
                    <Link
                      href={`/shop/${item.slug}`}
                      className="relative w-24 h-32 sm:w-28 sm:h-36 rounded-2xl overflow-hidden bg-[#FAF8F5] border border-[#E8E2D8] shrink-0 group-hover:scale-[1.02] transition-transform duration-300"
                    >
                      <Image
                        src={itemImage}
                        alt={item.title}
                        fill
                        className="object-contain p-2"
                        sizes="(max-width: 640px) 96px, 112px"
                      />
                    </Link>

                    {/* Item Metadata */}
                    <div className="flex-1 min-w-0 space-y-2.5 w-full">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-[#B85233] block mb-0.5">
                            {item.category || 'Hardcover Guided Journal'}
                          </span>
                          <Link href={`/product/${item.slug}`}>
                            <h3 className="font-playfair text-lg sm:text-xl font-medium text-[#1E1C1A] hover:text-[#B85233] transition-colors truncate">
                              {item.title}
                            </h3>
                          </Link>

                          {/* Edition & Color Variant Badges */}
                          {(item.edition || item.color) && (
                            <div className="flex flex-wrap items-center gap-2 mt-1.5">
                              {item.edition && (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#FAF3EC] text-[#B85233] border border-[#E8E2D8]">
                                  Edition: {item.edition}
                                </span>
                              )}
                              {item.color && (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-[#F5F2EB] text-[#5C554B] border border-[#E8E2D8]">
                                  Color: {item.color}
                                </span>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Remove Action */}
                        <button
                          type="button"
                          onClick={() => handleRemoveWithUndo(item)}
                          aria-label={`Remove ${item.title}`}
                          className="p-2 rounded-full text-[#8A847A] hover:text-red-600 hover:bg-red-50 transition-colors"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Stock Assurance */}
                      <div className="flex items-center gap-2 text-xs text-[#182821] font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#182821]" />
                        <span>In Stock • Dispatched in luxury packaging within 24 hours</span>
                      </div>

                      {/* Stepper & Price Calculation */}
                      <div className="pt-3 flex items-center justify-between gap-4 border-t border-[#F5F2EB]">
                        {/* Tactile Stepper */}
                        <div className="flex items-center gap-2 bg-[#FAF8F5] border border-[#E8E2D8] rounded-full p-1 shadow-inner">
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

                        {/* Price Details */}
                        <div className="text-end">
                          <div className="font-playfair text-lg sm:text-xl font-semibold text-[#1E1C1A]">
                            {formatPrice(lineTotal)}
                          </div>
                          {item.quantity > 1 && (
                            <div className="text-[11px] text-[#8A847A] font-mono">
                              ({formatPrice(item.price)} each)
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Clear Cart Utility */}
            <div className="flex items-center justify-between text-xs text-[#8A847A] pt-2 px-1">
              <button
                type="button"
                onClick={clearCart}
                className="hover:text-red-600 transition-colors underline decoration-[#8A847A]/30 underline-offset-4"
              >
                Clear all items from bag
              </button>
              <span>All orders ship worldwide with live tracking</span>
            </div>

            {/* Complimentary Gift Packaging & Personal Calligraphy Note */}
            <div className="p-5 rounded-3xl bg-white border border-[#E8E2D8] shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#FAF3EC] text-[#B85233] flex items-center justify-center">
                    <Gift className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-playfair font-medium text-sm text-[#1E1C1A]">
                      Complimentary Luxury Gift Inscription
                    </h4>
                    <p className="text-xs text-[#8A847A]">
                      Hand-written on gold-stamped linen cardstock.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowGiftNote(!showGiftNote)}
                  className="text-xs font-semibold text-[#B85233] hover:underline"
                >
                  {showGiftNote ? 'Hide Note' : '+ Add Personal Note'}
                </button>
              </div>

              {showGiftNote && (
                <div className="pt-3 border-t border-[#F5F2EB] space-y-3 animate-in fade-in duration-200">
                  <textarea
                    rows={3}
                    maxLength={250}
                    value={giftNote}
                    onChange={(e) => setGiftNote(e.target.value)}
                    placeholder="Inscribe a message for your recipient (e.g., 'May this journal be the quiet sanctuary where your deepest strength unfolds...')"
                    className="w-full p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#E8E2D8] text-xs text-[#1E1C1A] placeholder-[#A0988A] focus:outline-none focus:border-[#B85233]"
                  />
                  <div className="flex items-center justify-between text-[11px] text-[#8A847A]">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={giftWrapping}
                        onChange={(e) => setGiftWrapping(e.target.checked)}
                        className="rounded border-[#E8E2D8] text-[#182821] focus:ring-[#182821]"
                      />
                      <span>Include satin ribbon gift packaging</span>
                    </label>
                    <span>{250 - giftNote.length} characters remaining</span>
                  </div>
                </div>
              )}
            </div>

            {/* Reassurance Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-4">
              <div className="p-4 rounded-2xl bg-white/70 border border-[#E8E2D8] text-center space-y-1">
                <Sparkles className="w-4 h-4 text-[#D49B4B] mx-auto" />
                <h5 className="font-playfair text-xs font-semibold text-[#1E1C1A]">Artisanal Craft</h5>
                <p className="text-[11px] text-[#6B655B]">Linen hardcover with metallic gold stamping</p>
              </div>
              <div className="p-4 rounded-2xl bg-white/70 border border-[#E8E2D8] text-center space-y-1">
                <Truck className="w-4 h-4 text-[#182821] mx-auto" />
                <h5 className="font-playfair text-xs font-semibold text-[#1E1C1A]">Worldwide Priority</h5>
                <p className="text-[11px] text-[#6B655B]">Tracked international parcel delivery</p>
              </div>
              <div className="p-4 rounded-2xl bg-white/70 border border-[#E8E2D8] text-center space-y-1">
                <RotateCcw className="w-4 h-4 text-[#B85233] mx-auto" />
                <h5 className="font-playfair text-xs font-semibold text-[#1E1C1A]">Mindful Guarantee</h5>
                <p className="text-[11px] text-[#6B655B]">30-day effortless return guarantee</p>
              </div>
            </div>
          </div>

          {/* ============================================================== */}
          {/* RIGHT: Sticky Luxury Order Summary                             */}
          {/* ============================================================== */}
          <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-6">
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#E8E2D8] shadow-sm space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-[#E8E2D8]">
                <h2 className="font-playfair text-2xl font-normal text-[#1E1C1A]">
                  Order Summary
                </h2>
                <div className="flex items-center gap-1.5 text-xs text-[#8A847A]">
                  <Lock className="w-3.5 h-3.5 text-[#182821]" />
                  <span>Encrypted</span>
                </div>
              </div>

              {/* Price Calculation breakdown */}
              <div className="space-y-3.5 text-sm">
                <div className="flex items-center justify-between text-[#6B655B]">
                  <span>Items Subtotal ({totalItems})</span>
                  <span className="font-mono text-[#1E1C1A] font-medium">{formatPrice(subtotal)}</span>
                </div>

                <div className="flex items-center justify-between text-[#6B655B]">
                  <div className="flex items-center gap-1.5">
                    <span>Shipping</span>
                    {isFreeShippingUnlocked && (
                      <span className="text-[10px] text-[#182821] font-semibold">Priority</span>
                    )}
                  </div>
                  {shippingFee === 0 ? (
                    <span className="font-semibold text-[#182821] bg-[#FAF3EC] text-[#B85233] px-2.5 py-0.5 rounded-full text-xs border border-[#E8E2D8]">
                      COMPLIMENTARY
                    </span>
                  ) : (
                    <span className="font-mono text-[#1E1C1A] font-medium">{formatPrice(shippingFee)}</span>
                  )}
                </div>

                {/* Transit Protection Add-on */}
                <div className="flex items-center justify-between p-3 rounded-2xl bg-[#FAF8F5] border border-[#E8E2D8] text-xs">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={transitProtection}
                      onChange={(e) => setTransitProtection(e.target.checked)}
                      className="rounded border-[#E8E2D8] text-[#182821] focus:ring-[#182821]"
                    />
                    <div>
                      <span className="font-semibold text-[#1E1C1A] block">Carbon-Neutral Protection</span>
                      <span className="text-[10px] text-[#8A847A]">Guaranteed against loss or transit damage</span>
                    </div>
                  </label>
                  <span className="font-mono font-medium text-[#1E1C1A] shrink-0">
                    {transitProtection ? formatPrice(1.95) : '—'}
                  </span>
                </div>

                {/* Promo Applied Ribbon */}
                {promoApplied && (
                  <div className="flex items-center justify-between text-[#B85233] bg-[#FAF3EC] p-3 rounded-2xl border border-[#E8E2D8]">
                    <div className="flex items-center gap-2 text-xs font-semibold">
                      <Tag className="w-4 h-4 text-[#B85233]" />
                      <span>Promotion Applied ({promoCode.toUpperCase()})</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-semibold text-xs">-{formatPrice(discountAmount)}</span>
                      <button
                        type="button"
                        onClick={handleRemovePromo}
                        className="text-[10px] text-[#8A847A] hover:text-red-600 underline"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between text-[#8A847A] text-xs pt-1">
                  <span>Taxes & Duties</span>
                  <span>Calculated at checkout</span>
                </div>
              </div>

              {/* Promo Code Input */}
              <form onSubmit={handleApplyPromo} className="pt-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="Enter gift card or voucher..."
                    className="flex-1 px-4 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#E8E2D8] text-xs text-[#1E1C1A] placeholder-[#A0988A] focus:outline-none focus:border-[#B85233] uppercase"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2.5 rounded-xl bg-[#182821] hover:bg-[#22382E] text-white text-xs font-medium transition-all active:scale-95 shadow-xs"
                  >
                    Apply
                  </button>
                </div>
                {promoError && (
                  <p className="text-[11px] text-red-600 mt-1.5 flex items-center gap-1">
                    <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
                    <span>{promoError}</span>
                  </p>
                )}
              </form>

              {/* Total Divider */}
              <div className="pt-4 border-t border-[#E8E2D8]">
                <div className="flex items-baseline justify-between mb-1">
                  <div>
                    <span className="font-playfair text-xl font-medium text-[#1E1C1A] block">
                      Estimated Total
                    </span>
                    <span className="text-[11px] text-[#8A847A]">
                      Including shipping & guarantees
                    </span>
                  </div>
                  <div className="text-end">
                    <span className="font-playfair text-2xl sm:text-3xl font-semibold text-[#182821]">
                      {formatPrice(estimatedTotal, { showCode: false })}
                    </span>
                    <span className="text-xs text-[#8A847A] ms-1.5 uppercase font-mono font-semibold">
                      {currency}
                    </span>
                  </div>
                </div>
              </div>

              {/* Primary Checkout CTA */}
              <div className="pt-2 space-y-3">
                <Link href="/checkout" className="block w-full">
                  <button
                    type="button"
                    className="w-full py-4 px-6 rounded-full bg-[#182821] hover:bg-[#22382E] text-white text-sm sm:text-base font-semibold tracking-wide flex items-center justify-center gap-2.5 shadow-lg shadow-[#182821]/20 transition-all duration-300 active:scale-[0.98] group"
                  >
                    <Lock className="w-4 h-4 text-[#D49B4B]" />
                    <span>Proceed to Secure Checkout</span>
                    <ArrowRight className="w-4 h-4 text-[#D49B4B] group-hover:translate-x-1 transition-transform rtl:rotate-180" />
                  </button>
                </Link>

                <p className="text-center text-[11px] text-[#8A847A] flex items-center justify-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#182821]" />
                  <span>Bank-grade 256-bit encrypted checkout</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
