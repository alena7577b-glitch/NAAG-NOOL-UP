'use client';

import Link from 'next/link';
import { ShoppingBag, ArrowRight, Trash2, Plus, Minus, ShieldCheck, Sparkles, Truck, RotateCcw } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { useCart } from '@/lib/cart/CartContext';

export function CartView() {
  const { items, totalItems, subtotal, isHydrated, updateQuantity, removeItem, clearCart } = useCart();

  // Shipping calculation: Free over $50, else $5.00
  const shippingThreshold = 50.0;
  const shippingFee = subtotal >= shippingThreshold || subtotal === 0 ? 0.0 : 5.0;
  const estimatedTotal = subtotal + shippingFee;

  if (!isHydrated) {
    return (
      <div className="py-16 sm:py-24 bg-[#F9F6F0] min-h-[70vh]">
        <Container size="default">
          <div className="animate-pulse space-y-6 max-w-3xl mx-auto">
            <div className="h-8 bg-[#E5DFC0]/50 rounded-lg w-48 mx-auto" />
            <div className="h-4 bg-[#E5DFC0]/30 rounded w-64 mx-auto" />
            <div className="h-64 bg-white rounded-3xl border border-[#E5DFC0]/60 p-8" />
          </div>
        </Container>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="py-16 sm:py-24 bg-[#F9F6F0] min-h-[70vh] flex items-center">
        <Container size="narrow">
          <div className="rounded-3xl bg-white border border-[#E5DFC0] p-8 sm:p-14 shadow-sm text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-[#B85233]/10 text-[#B85233] mx-auto flex items-center justify-center">
              <ShoppingBag className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <span className="text-xs uppercase tracking-[0.2em] font-semibold text-[#B85233]">
                Your Bag
              </span>
              <h1 className="font-playfair text-3xl sm:text-4xl font-normal text-[#1E1C1A]">
                Your Shopping Bag is Empty
              </h1>
            </div>

            <p className="font-sans text-sm sm:text-base text-[#6B655B] max-w-md mx-auto leading-relaxed">
              Begin your transformational journey by exploring our collection of six guided journals and intentional tools.
            </p>

            <div className="pt-4 flex flex-wrap justify-center gap-4">
              <Link href="/shop">
                <Button variant="primary" size="lg" className="shadow-md">
                  <span>Browse All Journals</span>
                  <ArrowRight className="w-4 h-4 ms-2 rtl:rotate-180" />
                </Button>
              </Link>
              <Link href="/about">
                <Button variant="outline" size="lg">
                  Our Philosophy
                </Button>
              </Link>
            </div>

            <div className="pt-8 border-t border-[#E5DFC0]/60 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-[#6B655B] max-w-md mx-auto text-start">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#4D5844] shrink-0" />
                <span>Secure SSL encrypted checkout</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#B85233] shrink-0" />
                <span>Premium linen artisanal craft</span>
              </div>
            </div>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="py-12 sm:py-20 bg-[#F9F6F0] min-h-[75vh]">
      <Container size="default">
        {/* Header Breadcrumbs & Title */}
        <div className="mb-8 sm:mb-12">
          <div className="flex items-center gap-2 text-xs text-[#6B655B] mb-3">
            <Link href="/" className="hover:text-[#B85233] transition-colors">
              Home
            </Link>
            <span>&gt;</span>
            <Link href="/shop" className="hover:text-[#B85233] transition-colors">
              Shop
            </Link>
            <span>&gt;</span>
            <span className="text-[#1E1C1A] font-medium">Shopping Bag</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#E5DFC0]/60 pb-6">
            <div>
              <span className="text-xs uppercase tracking-[0.2em] font-semibold text-[#B85233] block mb-1">
                Review Your Selection
              </span>
              <h1 className="font-playfair text-3xl sm:text-4xl font-normal text-[#1E1C1A]">
                Shopping Bag ({totalItems} {totalItems === 1 ? 'item' : 'items'})
              </h1>
            </div>
            <button
              type="button"
              onClick={clearCart}
              className="text-xs text-[#6B655B] hover:text-[#B85233] underline transition-colors self-start sm:self-auto cursor-pointer"
            >
              Clear Entire Bag
            </button>
          </div>
        </div>

        {/* Commerce Grid: Items List + Order Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column: Cart Items List */}
          <div className="lg:col-span-8 space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-[#E5DFC0]/80 p-4 sm:p-6 shadow-2xs flex flex-col sm:flex-row gap-5 items-start sm:items-center justify-between transition-all hover:border-[#B85233]/30"
              >
                {/* Product Thumbnail & Details */}
                <div className="flex items-center gap-4 min-w-0 flex-1">
                  <Link
                    href={`/product/${item.slug}`}
                    className="relative w-20 h-24 sm:w-24 sm:h-28 rounded-xl bg-[#FAF7F2] border border-[#E5DFC0]/60 shrink-0 overflow-hidden p-2 flex items-center justify-center hover:opacity-90 transition-opacity"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.imageUrl || `/images/journal-${item.slug.replace('the-', '')}.png`}
                      alt={item.title}
                      className="w-full h-full object-contain"
                    />
                  </Link>

                  <div className="space-y-1 min-w-0">
                    {item.category && (
                      <span className="text-[10px] uppercase tracking-wider font-semibold text-[#B85233]">
                        {item.category}
                      </span>
                    )}
                    <h3 className="font-playfair text-lg sm:text-xl font-normal text-[#1E1C1A] truncate">
                      <Link href={`/product/${item.slug}`} className="hover:text-[#B85233] transition-colors">
                        {item.title}
                      </Link>
                    </h3>
                    <p className="text-sm font-semibold text-[#1E1C1A]">
                      ${item.price.toFixed(2)}{' '}
                      <span className="text-xs font-normal text-[#6B655B]">each</span>
                    </p>
                  </div>
                </div>

                {/* Quantity Controls & Line Item Total */}
                <div className="flex items-center justify-between w-full sm:w-auto sm:gap-8 pt-3 sm:pt-0 border-t sm:border-t-0 border-[#E5DFC0]/40">
                  {/* Stepper */}
                  <div className="flex items-center border border-[#E5DFC0] rounded-lg bg-[#FAF8F5] p-1">
                    <button
                      type="button"
                      aria-label={`Decrease quantity of ${item.title}`}
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="p-1.5 text-[#6B655B] hover:text-[#1E1C1A] disabled:opacity-30 cursor-pointer"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-8 text-center text-xs font-semibold text-[#1E1C1A]">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      aria-label={`Increase quantity of ${item.title}`}
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-1.5 text-[#6B655B] hover:text-[#1E1C1A] cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Line Item Total */}
                  <div className="text-end">
                    <p className="font-playfair text-lg font-semibold text-[#1E1C1A]">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>

                  {/* Remove Button */}
                  <button
                    type="button"
                    aria-label={`Remove ${item.title} from bag`}
                    onClick={() => removeItem(item.id)}
                    className="p-2 text-[#6B655B] hover:text-red-600 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}

            {/* Shipping note */}
            <div className="bg-[#4D5844]/5 border border-[#4D5844]/20 rounded-xl p-4 flex items-center gap-3 text-xs text-[#4D5844]">
              <Truck className="w-4 h-4 shrink-0" />
              <span>
                {subtotal >= shippingThreshold ? (
                  <strong className="font-semibold">Congratulations! You unlocked free standard shipping.</strong>
                ) : (
                  <>
                    Add <strong>${(shippingThreshold - subtotal).toFixed(2)}</strong> more to unlock{' '}
                    <strong>Free Standard Shipping</strong>.
                  </>
                )}
              </span>
            </div>
          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-3xl border border-[#E5DFC0] p-6 sm:p-8 shadow-sm space-y-6 sticky top-24">
              <h2 className="font-playfair text-2xl font-normal text-[#1E1C1A] pb-4 border-b border-[#E5DFC0]/60">
                Order Summary
              </h2>

              <div className="space-y-3.5 text-sm text-[#4A433A]">
                <div className="flex justify-between items-center">
                  <span>Subtotal</span>
                  <span className="font-semibold text-[#1E1C1A]">${subtotal.toFixed(2)}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-1.5">
                    Shipping
                    {shippingFee === 0 && (
                      <span className="text-[10px] bg-[#4D5844]/10 text-[#4D5844] font-bold px-1.5 py-0.5 rounded uppercase">
                        Free
                      </span>
                    )}
                  </span>
                  <span className="font-semibold text-[#1E1C1A]">
                    {shippingFee === 0 ? '$0.00' : `$${shippingFee.toFixed(2)}`}
                  </span>
                </div>

                <div className="flex justify-between items-center text-xs text-[#6B655B]">
                  <span>Sales Tax</span>
                  <span>Calculated at checkout</span>
                </div>

                <div className="pt-4 border-t border-[#E5DFC0]/60 flex justify-between items-baseline">
                  <div>
                    <span className="font-playfair text-lg font-normal text-[#1E1C1A] block">
                      Estimated Total
                    </span>
                    <span className="text-[11px] text-[#6B655B]">USD currency</span>
                  </div>
                  <span className="font-playfair text-2xl font-bold text-[#B85233]">
                    ${estimatedTotal.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Checkout CTA */}
              <div className="space-y-3 pt-2">
                <Link href="/checkout" className="block w-full">
                  <Button variant="primary" size="lg" className="w-full shadow-md py-3.5">
                    <span>Proceed to Checkout</span>
                    <ArrowRight className="w-4 h-4 ms-2 rtl:rotate-180" />
                  </Button>
                </Link>

                <Link
                  href="/shop"
                  className="block text-center text-xs text-[#6B655B] hover:text-[#B85233] transition-colors py-1"
                >
                  Continue Shopping
                </Link>
              </div>

              {/* Security & Craft Badges */}
              <div className="pt-6 border-t border-[#E5DFC0]/50 space-y-2.5 text-xs text-[#6B655B]">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#4D5844] shrink-0" />
                  <span>Secure 256-bit SSL encrypted checkout</span>
                </div>
                <div className="flex items-center gap-2">
                  <RotateCcw className="w-4 h-4 text-[#4D5844] shrink-0" />
                  <span>30-day mindful return policy</span>
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#B85233] shrink-0" />
                  <span>Intentional artisanal packaging</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
