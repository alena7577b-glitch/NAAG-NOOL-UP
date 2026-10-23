'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import {
  ShoppingBag,
  ShieldCheck,
  Lock,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Truck,
  CreditCard,
  Sparkles,
  ArrowLeft,
  Check,
  Heart,
  Globe2,
  HelpCircle,
  X,
} from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { createOrderAction, CheckoutFormInput } from '@/lib/actions/checkout';
import { PaymentMethodsConfig, DEFAULT_PAYMENT_CONFIG } from '@/lib/payment/types';
import { useCart, CartItem } from '@/lib/cart/CartContext';
import { useCurrency } from '@/lib/currency/context';

interface CheckoutViewProps {
  initialUserEmail?: string;
  initialUserName?: string;
  initialPaymentConfig?: PaymentMethodsConfig;
}

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

export function CheckoutView({
  initialUserEmail = '',
  initialUserName = '',
  initialPaymentConfig,
}: CheckoutViewProps) {
  const searchParams = useSearchParams();
  const { items, subtotal, isHydrated, clearCart } = useCart();
  const { currency, formatPrice } = useCurrency();
  const paymentConfig = initialPaymentConfig || DEFAULT_PAYMENT_CONFIG;

  // Primary Payment Category: defaults to Card/Digital Wallets (Apple Pay, Google Pay, Card)
  const [primaryMethod, setPrimaryMethod] = useState<'CARD' | 'PAYPAL'>(
    paymentConfig.cardEnabled ? 'CARD' : 'PAYPAL'
  );

  // Optional Ayeeyo Koris Sponsorship Donation
  const [sponsorshipTier, setSponsorshipTier] = useState<number>(0);
  const [showAyeeyoModal, setShowAyeeyoModal] = useState<boolean>(false);
  const [showDeliveryNotes, setShowDeliveryNotes] = useState<boolean>(false);

  const [formData, setFormData] = useState<Omit<CheckoutFormInput, 'items' | 'paymentMethod'>>({
    customerName: initialUserName,
    customerEmail: initialUserEmail,
    customerPhone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    postalCode: '',
    country: 'Somalia',
    deliveryNotes: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [completedOrder, setCompletedOrder] = useState<{
    orderId: string;
    orderNumber: string;
    totalAmount: number;
    paymentUrl?: string;
    customerEmail?: string;
    paymentStatus?: 'PAID' | 'PENDING_PAYMENT';
  } | null>(null);

  // Detect return redirect from payment gateway with success query params
  useEffect(() => {
    const isSuccess = searchParams?.get('success') === 'true';
    const orderNumber = searchParams?.get('orderNumber');
    if (isSuccess && orderNumber) {
      clearCart();
      setCompletedOrder({
        orderId: orderNumber,
        orderNumber: orderNumber,
        totalAmount: 0,
        paymentStatus: 'PAID',
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  // Financial calculations
  const shippingThreshold = 50.0;
  const shippingFee = subtotal >= shippingThreshold || subtotal === 0 ? 0.0 : 5.0;
  const estimatedTotal = subtotal + shippingFee + sponsorshipTier;

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMessage(null);

    if (items.length === 0) {
      setErrorMessage('Your shopping bag is empty. Please add items before checking out.');
      return;
    }

    if (!formData.customerName.trim() || !formData.customerEmail.trim()) {
      setErrorMessage('Please fill in your name and email address to continue.');
      return;
    }

    if (!formData.addressLine1.trim() || !formData.city.trim()) {
      setErrorMessage('Please provide your street address and city.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Append sponsorship note if user opted into Ayeeyo Koris pledge
      const enhancedNotes =
        sponsorshipTier > 0
          ? `${formData.deliveryNotes ? formData.deliveryNotes + ' | ' : ''}[Includes Ayeeyo Koris Sponsor Pledge: $${sponsorshipTier}]`
          : formData.deliveryNotes;

      const orderPayload: CheckoutFormInput = {
        ...formData,
        deliveryNotes: enhancedNotes,
        paymentMethod: primaryMethod,
        items: items.map((i: CartItem) => ({ productId: i.id, quantity: i.quantity })),
      };

      const result = await createOrderAction(orderPayload);

      if (!result.success) {
        setErrorMessage(result.error || 'Unable to place order. Please review your information.');
        setIsSubmitting(false);
        return;
      }

      // Order created successfully — clear local cart
      clearCart();

      // Hand off to the secure payment sheet (Apple Pay, Google Pay, Card, or PayPal)
      if (result.paymentUrl) {
        window.location.href = result.paymentUrl;
        return;
      }

      setCompletedOrder({
        orderId: result.orderId!,
        orderNumber: result.orderNumber!,
        totalAmount: result.totalAmount! + sponsorshipTier,
        paymentUrl: result.paymentUrl,
        customerEmail: formData.customerEmail,
        paymentStatus: result.paymentStatus || 'PENDING_PAYMENT',
      });
    } catch {
      setErrorMessage('A network error occurred while placing your order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // SKELETON / LOADING HYDRATION
  if (!isHydrated) {
    return (
      <div className="py-20 bg-[#FBF9F5] min-h-[80vh]">
        <Container size="default">
          <div className="animate-pulse space-y-6 max-w-5xl mx-auto">
            <div className="h-6 bg-[#E8E2D8]/60 rounded-full w-48 mx-auto" />
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-7 h-96 bg-white/70 rounded-3xl border border-[#E8E2D8]/70" />
              <div className="lg:col-span-5 h-80 bg-white/70 rounded-3xl border border-[#E8E2D8]/70" />
            </div>
          </div>
        </Container>
      </div>
    );
  }

  // ORDER SUCCESS / CONFIRMATION STATE
  if (completedOrder) {
    const isPaid = completedOrder.paymentStatus === 'PAID';
    return (
      <div className="py-16 sm:py-24 bg-[#FAF7F2] min-h-[80vh] flex items-center">
        <Container size="narrow">
          <div className="rounded-3xl bg-white border border-[#E5DFC0] p-8 sm:p-14 text-center space-y-6 shadow-xl shadow-[#2D5A43]/5">
            <div className="w-16 h-16 rounded-full bg-[#2D5A43]/10 border border-[#2D5A43]/30 flex items-center justify-center mx-auto text-[#2D5A43]">
              <CheckCircle2 className="w-9 h-9 text-[#2D5A43]" />
            </div>

            <div className="space-y-2">
              <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#B85233]">
                ORDER CONFIRMED &amp; DISPATCH QUEUED
              </span>
              <h1 className="font-playfair text-3xl sm:text-4xl font-normal text-[#1E1C1A]">
                Mahadsanid, Sister.
              </h1>
              <p className="text-xs sm:text-sm text-[#5C665F] max-w-md mx-auto leading-relaxed">
                Your order is confirmed. A full invoice, dispatch schedule, and tracking link have been dispatched to your email.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#FAF7F2] border border-[#E5DFC0] max-w-sm mx-auto space-y-3 text-xs sm:text-sm text-[#1E1C1A]">
              <div className="flex items-center justify-between">
                <span className="text-[#5C665F]">Order Identifier</span>
                <span className="font-mono font-bold text-[#2D5A43]">
                  {completedOrder.orderNumber}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#5C665F]">Payment Status</span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#2D5A43]/10 text-[#2D5A43]">
                  <Check className="w-3 h-3 stroke-[2.5]" />
                  {isPaid ? 'Verified & Complete' : 'Pending Authorization'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#5C665F]">Estimated Dispatch</span>
                <span className="text-xs text-[#2D5A43] font-medium">Within 24 Hours with Tracking</span>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/shop" className="w-full sm:w-auto">
                <button
                  type="button"
                  className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#2D5A43] hover:bg-[#234935] text-white font-semibold text-xs sm:text-sm transition-all shadow-md active:scale-95"
                >
                  Return to Boutique
                </button>
              </Link>
              <Link href="/account/orders" className="w-full sm:w-auto">
                <button
                  type="button"
                  className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-white hover:bg-[#FAF7F2] border border-[#E5DFC0] text-[#2D5A43] font-semibold text-xs sm:text-sm transition-all active:scale-95"
                >
                  View Order History
                </button>
              </Link>
            </div>
          </div>
        </Container>
      </div>
    );
  }

  // EMPTY BAG GUARD
  if (items.length === 0) {
    return (
      <div className="py-20 sm:py-28 bg-[#FAF7F2] min-h-[75vh] flex items-center">
        <Container size="narrow">
          <div className="rounded-3xl bg-white border border-[#E5DFC0] p-8 sm:p-14 text-center space-y-6 shadow-xl shadow-[#2D5A43]/5">
            <div className="w-16 h-16 rounded-full bg-[#2D5A43]/5 border border-[#D49B4B]/40 flex items-center justify-center mx-auto text-[#2D5A43]">
              <ShoppingBag className="w-7 h-7" />
            </div>
            <div className="space-y-2">
              <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#B85233]">
                YOUR BAG IS CURATED BUT EMPTY
              </span>
              <h2 className="font-playfair text-3xl font-normal text-[#1E1C1A]">
                Select Your Guided Journal
              </h2>
              <p className="text-xs sm:text-sm text-[#5C665F] max-w-sm mx-auto leading-relaxed">
                Explore our empowering hardcover journal collection crafted for women everywhere.
              </p>
            </div>
            <div className="pt-2">
              <Link href="/shop">
                <button
                  type="button"
                  className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#2D5A43] hover:bg-[#234935] text-white font-semibold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all active:scale-95"
                >
                  <span>Explore The Boutique</span>
                  <ArrowRight className="w-4 h-4 text-[#D49B4B]" />
                </button>
              </Link>
            </div>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="py-8 sm:py-12 bg-[#FAF7F2] min-h-[90vh] text-[#1E1C1A]">
      <Container size="default">
        {/* Navigation Breadcrumbs & Trust Header */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#E5DFC0]/70">
          <Link
            href="/cart"
            className="inline-flex items-center gap-2 text-xs sm:text-sm text-[#5C665F] hover:text-[#2D5A43] transition-colors group font-medium"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform rtl:rotate-180 text-[#B85233]" />
            <span>Return to Bag</span>
          </Link>

          <div className="flex items-center gap-3 text-xs text-[#5C665F]">
            <div className="flex items-center gap-1.5 font-medium text-[#2D5A43]">
              <Lock className="w-3.5 h-3.5 text-[#B85233]" />
              <span>Bank-Grade 256-Bit SSL Encrypted</span>
            </div>
            <span className="hidden sm:inline text-[#D5C9B3]">•</span>
            <span className="hidden sm:inline text-[#7A756D]">Global Priority Shipping</span>
          </div>
        </div>

        {/* Page Title & Fast Checkout Banner */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#B85233]">
              SECURE CHECKOUT
            </span>
            <h1 className="font-playfair text-3xl sm:text-4xl font-normal text-[#1E1C1A] mt-1">
              Complete Your Order
            </h1>
          </div>
          <p className="text-xs text-[#6B726B]">
            All major payment methods &amp; 1-tap mobile wallets accepted
          </p>
        </div>

        {/* Main 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          
          {/* LEFT: Compact Unified Customer, Shipping & Payment Card */}
          <div className="lg:col-span-7 space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Error Banner */}
              {errorMessage && (
                <div
                  role="alert"
                  className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-xs sm:text-sm flex items-start gap-3 animate-in fade-in duration-200"
                >
                  <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold">Unable to proceed</p>
                    <p className="mt-0.5 text-red-700">{errorMessage}</p>
                  </div>
                </div>
              )}

              {/* 1. COMPACT CONTACT & SHIPPING DETAILS (Unified to reduce scrolling) */}
              <div className="p-6 sm:p-7 rounded-2xl bg-white border border-[#E5DFC0] shadow-sm space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-[#F0EBE1]">
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-full bg-[#2D5A43] text-white text-xs font-bold flex items-center justify-center shrink-0">
                      1
                    </span>
                    <h2 className="font-playfair text-lg sm:text-xl font-normal text-[#1E1C1A]">
                      Contact &amp; Shipping Details
                    </h2>
                  </div>
                  <span className="text-[11px] text-[#7A756D]">Instant Dispatch</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {/* Full Name */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#4A544E]">
                      Full Name <span className="text-[#B85233]">*</span>
                    </label>
                    <input
                      type="text"
                      name="customerName"
                      required
                      value={formData.customerName}
                      onChange={handleInputChange}
                      placeholder="e.g. Marian Warsame"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#E5DFC0] text-sm text-[#1E1C1A] placeholder-[#A0988A] focus:outline-none focus:ring-2 focus:ring-[#2D5A43]/20 focus:border-[#2D5A43] focus:bg-white transition-all"
                    />
                  </div>

                  {/* Email */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#4A544E]">
                      Email Address <span className="text-[#B85233]">*</span>
                    </label>
                    <input
                      type="email"
                      name="customerEmail"
                      required
                      value={formData.customerEmail}
                      onChange={handleInputChange}
                      placeholder="marian@example.com"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#E5DFC0] text-sm text-[#1E1C1A] placeholder-[#A0988A] focus:outline-none focus:ring-2 focus:ring-[#2D5A43]/20 focus:border-[#2D5A43] focus:bg-white transition-all"
                    />
                  </div>

                  {/* Phone */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#4A544E]">
                      Phone Number <span className="text-[#8A847A] font-normal">(For Courier Tracking)</span>
                    </label>
                    <input
                      type="tel"
                      name="customerPhone"
                      value={formData.customerPhone}
                      onChange={handleInputChange}
                      placeholder="+252 61 ••• ••••"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#E5DFC0] text-sm text-[#1E1C1A] placeholder-[#A0988A] focus:outline-none focus:ring-2 focus:ring-[#2D5A43]/20 focus:border-[#2D5A43] focus:bg-white transition-all"
                    />
                  </div>

                  {/* Country */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#4A544E]">
                      Country / Region <span className="text-[#B85233]">*</span>
                    </label>
                    <div className="relative">
                      <select
                        name="country"
                        value={formData.country}
                        onChange={handleInputChange}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#E5DFC0] text-sm text-[#1E1C1A] focus:outline-none focus:ring-2 focus:ring-[#2D5A43]/20 focus:border-[#2D5A43] focus:bg-white transition-all appearance-none cursor-pointer"
                      >
                        <option value="Somalia">Somalia</option>
                        <option value="Djibouti">Djibouti</option>
                        <option value="Kenya">Kenya</option>
                        <option value="Ethiopia">Ethiopia</option>
                        <option value="United Arab Emirates">United Arab Emirates</option>
                        <option value="United Kingdom">United Kingdom</option>
                        <option value="United States">United States</option>
                        <option value="Canada">Canada</option>
                        <option value="Sweden">Sweden</option>
                        <option value="Norway">Norway</option>
                        <option value="Turkey">Turkey</option>
                      </select>
                      <Globe2 className="w-4 h-4 text-[#8A847A] absolute right-3.5 top-3 pointer-events-none" />
                    </div>
                  </div>

                  {/* Street Address */}
                  <div className="space-y-1 sm:col-span-2">
                    <label className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#4A544E]">
                      Delivery Address <span className="text-[#B85233]">*</span>
                    </label>
                    <input
                      type="text"
                      name="addressLine1"
                      required
                      value={formData.addressLine1}
                      onChange={handleInputChange}
                      placeholder="Street Address, Building, Floor or Apartment"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#E5DFC0] text-sm text-[#1E1C1A] placeholder-[#A0988A] focus:outline-none focus:ring-2 focus:ring-[#2D5A43]/20 focus:border-[#2D5A43] focus:bg-white transition-all"
                    />
                  </div>

                  {/* City & Postal Code */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#4A544E]">
                      City <span className="text-[#B85233]">*</span>
                    </label>
                    <input
                      type="text"
                      name="city"
                      required
                      value={formData.city}
                      onChange={handleInputChange}
                      placeholder="Mogadishu"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#E5DFC0] text-sm text-[#1E1C1A] placeholder-[#A0988A] focus:outline-none focus:ring-2 focus:ring-[#2D5A43]/20 focus:border-[#2D5A43] focus:bg-white transition-all"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#4A544E]">
                      Postal Code <span className="text-[#8A847A] font-normal">(Optional)</span>
                    </label>
                    <input
                      type="text"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleInputChange}
                      placeholder="Postal / Zip code"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#E5DFC0] text-sm text-[#1E1C1A] placeholder-[#A0988A] focus:outline-none focus:ring-2 focus:ring-[#2D5A43]/20 focus:border-[#2D5A43] focus:bg-white transition-all"
                    />
                  </div>
                </div>

                {/* Collapsible Delivery Notes Toggle (Reduces page clutter) */}
                <div className="pt-1">
                  {!showDeliveryNotes ? (
                    <button
                      type="button"
                      onClick={() => setShowDeliveryNotes(true)}
                      className="text-xs text-[#2D5A43] hover:underline font-medium inline-flex items-center gap-1"
                    >
                      + Add delivery instructions or special notes
                    </button>
                  ) : (
                    <div className="space-y-1 animate-in fade-in duration-200">
                      <div className="flex items-center justify-between">
                        <label className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#4A544E]">
                          Delivery Instructions
                        </label>
                        <button
                          type="button"
                          onClick={() => setShowDeliveryNotes(false)}
                          className="text-[11px] text-[#7A756D] hover:text-[#1E1C1A]"
                        >
                          Close
                        </button>
                      </div>
                      <textarea
                        name="deliveryNotes"
                        rows={2}
                        value={formData.deliveryNotes}
                        onChange={handleInputChange}
                        placeholder="e.g. Leave at front reception, call upon arrival"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#E5DFC0] text-sm text-[#1E1C1A] placeholder-[#A0988A] focus:outline-none focus:ring-2 focus:ring-[#2D5A43]/20 focus:border-[#2D5A43] focus:bg-white transition-all"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* 2. COMPACT COMMUNITY IMPACT PLEDGE (Slim inline design) */}
              <div className="p-4 sm:p-5 rounded-2xl bg-[#2D5A43] text-white shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 border border-[#D49B4B]/30">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-full bg-white/10 border border-[#D49B4B] flex items-center justify-center text-[#D49B4B] shrink-0">
                    <Heart className="w-4 h-4 fill-current text-[#D49B4B]" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#D49B4B]">
                        Ayeeyo Koris Pledge
                      </span>
                      <button
                        type="button"
                        onClick={() => setShowAyeeyoModal(true)}
                        className="text-[10px] text-white/80 hover:text-white underline inline-flex items-center gap-0.5"
                      >
                        info <HelpCircle className="w-2.5 h-2.5" />
                      </button>
                    </div>
                    <p className="text-xs text-[#E3ECE7] truncate">
                      Support textbooks &amp; care for Somali children
                    </p>
                  </div>
                </div>

                {/* Quick Toggle Chips */}
                <div className="flex items-center gap-1.5 shrink-0">
                  {[
                    { amount: 0, label: 'None' },
                    { amount: 10, label: '+$10' },
                    { amount: 25, label: '+$25' },
                    { amount: 50, label: '+$50' },
                  ].map((tier) => {
                    const isSelected = sponsorshipTier === tier.amount;
                    return (
                      <button
                        key={tier.amount}
                        type="button"
                        onClick={() => setSponsorshipTier(tier.amount)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
                          isSelected
                            ? 'bg-[#D49B4B] text-[#1E1C1A] border-[#D49B4B] shadow-sm font-bold'
                            : 'bg-white/10 hover:bg-white/20 text-white border-white/20'
                        }`}
                      >
                        {tier.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 3. PAYMENT METHOD (Apple Pay, Google Pay, Cards, PayPal - No Vendor Branding) */}
              <div className="p-6 sm:p-7 rounded-2xl bg-white border border-[#E5DFC0] shadow-sm space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-[#F0EBE1]">
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-full bg-[#2D5A43] text-white text-xs font-bold flex items-center justify-center shrink-0">
                      2
                    </span>
                    <h2 className="font-playfair text-lg sm:text-xl font-normal text-[#1E1C1A]">
                      Select Payment Method
                    </h2>
                  </div>
                  <span className="text-[11px] text-[#2D5A43] font-medium flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> Bank-Grade Security
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  
                  {/* OPTION 1: Cards + Apple Pay + Google Pay */}
                  {paymentConfig.cardEnabled && (
                    <button
                      type="button"
                      onClick={() => setPrimaryMethod('CARD')}
                      className={`relative p-4 sm:p-5 rounded-2xl text-start transition-all border-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                        primaryMethod === 'CARD'
                          ? 'border-[#2D5A43] bg-[#2D5A43]/5 ring-2 ring-[#2D5A43]/20 shadow-sm'
                          : 'border-[#E5DFC0] bg-[#FAF7F2] hover:border-[#2D5A43]/40'
                      }`}
                    >
                      <div className="flex items-center gap-3.5">
                        <div className="w-10 h-10 rounded-xl bg-white border border-[#E5DFC0] flex items-center justify-center text-[#2D5A43] shrink-0 shadow-2xs">
                          <CreditCard className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-playfair text-base font-semibold text-[#1E1C1A]">
                              Credit / Debit Card, Apple Pay, Google Pay
                            </h3>
                          </div>
                          <p className="text-xs text-[#5C665F] mt-0.5">
                            One-tap checkout with Apple Pay, Google Pay, Visa, Mastercard &amp; Amex
                          </p>
                        </div>
                      </div>

                      {/* Official Method Badges */}
                      <div className="flex items-center gap-1.5 flex-wrap sm:justify-end shrink-0 ps-12 sm:ps-0">
                        {/* Apple Pay Badge */}
                        <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-md bg-black text-white text-[11px] font-semibold tracking-tight shadow-xs">
                          Pay
                        </span>
                        {/* Google Pay Badge */}
                        <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-md bg-white border border-[#E5DFC0] text-[#444] text-[11px] font-bold shadow-xs">
                          <span className="text-[#4285F4]">G</span>
                          <span className="text-[#EA4335]">o</span>
                          <span className="text-[#FBBC05]">o</span>
                          <span className="text-[#4285F4]">g</span>
                          <span className="text-[#34A853]">l</span>
                          <span className="text-[#EA4335]">e</span>
                          <span className="ms-0.5 text-[#5f6368]">Pay</span>
                        </span>
                        {/* Card Brand Badges */}
                        <span className="text-[10px] px-2 py-0.5 rounded bg-white border border-[#E5DFC0] font-bold text-[#1a1f36]">
                          VISA
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-white border border-[#E5DFC0] font-bold text-[#eb001b]">
                          MC
                        </span>
                      </div>
                    </button>
                  )}

                  {/* OPTION 2: PayPal */}
                  {paymentConfig.paypalEnabled && (
                    <button
                      type="button"
                      onClick={() => setPrimaryMethod('PAYPAL')}
                      className={`relative p-4 sm:p-5 rounded-2xl text-start transition-all border-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                        primaryMethod === 'PAYPAL'
                          ? 'border-[#0070BA] bg-[#0070BA]/5 ring-2 ring-[#0070BA]/20 shadow-sm'
                          : 'border-[#E5DFC0] bg-[#FAF7F2] hover:border-[#0070BA]/40'
                      }`}
                    >
                      <div className="flex items-center gap-3.5">
                        <div className="w-10 h-10 rounded-xl bg-white border border-[#E5DFC0] flex items-center justify-center text-[#003087] shrink-0 shadow-2xs">
                          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                            <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944 2.76A.948.948 0 0 1 5.88 2h7.02c3.08 0 5.348.814 6.368 2.302 1.054 1.536.87 3.792-.472 5.922-1.572 2.493-4.143 3.864-7.433 3.864H9.014l-1.042 6.582a.641.641 0 0 1-.633.544l-.263.125z" fill="#003087" />
                            <path d="M19.268 7.37c-.32 2.336-1.575 4.394-3.737 5.768-1.532.975-3.418 1.488-5.452 1.488h-1.65a.82.82 0 0 0-.81.693l-1.162 7.362a.51.51 0 0 0 .504.59h3.702a.76.76 0 0 0 .752-.644l.808-5.112a.82.82 0 0 1 .81-.693h1.166c3.968 0 7.07-1.611 7.973-6.26.377-1.942.062-3.473-.91-4.49-.24-.251-.53-.478-.85-.68l-.556 1.978z" fill="#0079C1" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="font-playfair text-base font-semibold text-[#1E1C1A]">
                            PayPal
                          </h3>
                          <p className="text-xs text-[#5C665F] mt-0.5">
                            Use your PayPal balance, linked bank account, or debit/credit card
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0 ps-12 sm:ps-0">
                        <span className="text-[10px] px-2 py-0.5 rounded bg-white border border-[#E5DFC0] font-bold text-[#003087]">
                          PayPal
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-white border border-[#E5DFC0] font-semibold text-[#1E1C1A]">
                          Pay in 4
                        </span>
                      </div>
                    </button>
                  )}
                </div>

                <div className="p-3.5 rounded-xl bg-[#FAF7F2] border border-[#E5DFC0] flex items-center gap-2.5 text-xs text-[#5C665F]">
                  <Lock className="w-4 h-4 text-[#2D5A43] shrink-0" />
                  <span>
                    When you tap <strong>Proceed to Secure Payment</strong>, you will be connected directly to your authorized payment gateway to complete your transaction with 100% bank-grade privacy.
                  </span>
                </div>
              </div>

              {/* 4. PROMINENT CTA (Directly visible, no excessive scrolling) */}
              <div className="pt-1">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 px-6 rounded-full bg-[#2D5A43] hover:bg-[#234935] disabled:opacity-50 text-white text-base font-semibold tracking-wide flex items-center justify-center gap-3 shadow-lg shadow-[#2D5A43]/20 transition-all duration-200 active:scale-[0.99] cursor-pointer"
                >
                  {isSubmitting ? (
                    <span className="inline-flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Connecting to Secure Checkout...
                    </span>
                  ) : (
                    <>
                      <Lock className="w-4 h-4 text-[#D49B4B]" />
                      <span>
                        Proceed to Secure Payment • {formatPrice(estimatedTotal, { showCode: true })}
                      </span>
                      <ArrowRight className="w-4 h-4 rtl:rotate-180 text-[#D49B4B]" />
                    </>
                  )}
                </button>

                <p className="text-center text-xs text-[#7A756D] mt-3 flex items-center justify-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#2D5A43]" />
                  <span>Protected by 256-bit encryption &amp; 30-Day Quality Assurance</span>
                </p>
              </div>

            </form>
          </div>

          {/* RIGHT: Compact Sticky Luxury Order Summary */}
          <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-4">
            <div className="p-6 sm:p-7 rounded-2xl bg-white border border-[#E5DFC0] shadow-sm space-y-5">
              
              <div className="flex items-center justify-between pb-3 border-b border-[#E5DFC0]">
                <div>
                  <h2 className="font-playfair text-xl font-normal text-[#1E1C1A]">
                    Order Summary
                  </h2>
                  <p className="text-xs text-[#6B726B]">Curated Sisterhood Collection</p>
                </div>
                <span className="text-xs text-[#2D5A43] font-semibold px-2.5 py-1 rounded-full bg-[#2D5A43]/5 border border-[#2D5A43]/20 font-mono">
                  {items.length} {items.length === 1 ? 'item' : 'items'}
                </span>
              </div>

              {/* Items List */}
              <div className="space-y-3 max-h-64 overflow-y-auto pe-1">
                {items.map((item: CartItem) => {
                  const itemImage = resolveItemImage(item.slug, item.imageUrl);
                  return (
                    <div key={item.id} className="flex items-center gap-3 p-1.5 rounded-xl hover:bg-[#FAF7F2] transition-colors">
                      <div className="relative w-12 h-16 rounded-lg bg-[#FAF7F2] border border-[#E5DFC0] shrink-0 overflow-hidden p-1 shadow-2xs">
                        <Image
                          src={itemImage}
                          alt={item.title}
                          fill
                          className="object-contain p-1"
                        />
                        <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#2D5A43] text-white text-[9px] font-bold flex items-center justify-center shadow-xs">
                          {item.quantity}
                        </span>
                      </div>

                      <div className="flex-1 min-w-0">
                        <h4 className="font-playfair text-sm font-semibold text-[#1E1C1A] truncate">
                          {item.title}
                        </h4>
                        <p className="text-[11px] text-[#7A756D]">
                          Hardcover Gold Foil Edition
                        </p>
                      </div>

                      <div className="font-playfair text-sm font-semibold text-[#2D5A43] font-mono">
                        {formatPrice(item.price * item.quantity)}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Financial Breakdown */}
              <div className="pt-3 border-t border-[#E5DFC0] space-y-2.5 text-xs sm:text-sm">
                <div className="flex items-center justify-between text-[#5C665F]">
                  <span>Subtotal</span>
                  <span className="font-mono text-[#1E1C1A] font-medium">{formatPrice(subtotal)}</span>
                </div>

                <div className="flex items-center justify-between text-[#5C665F]">
                  <span>Shipping</span>
                  {shippingFee === 0 ? (
                    <span className="font-semibold text-[#2D5A43] bg-[#2D5A43]/10 px-2.5 py-0.5 rounded-full text-xs">
                      COMPLIMENTARY
                    </span>
                  ) : (
                    <span className="font-mono text-[#1E1C1A] font-medium">{formatPrice(shippingFee)}</span>
                  )}
                </div>

                {sponsorshipTier > 0 && (
                  <div className="flex items-center justify-between text-[#B85233] font-medium text-xs">
                    <span className="flex items-center gap-1.5">
                      <Heart className="w-3.5 h-3.5 fill-current text-[#B85233]" />
                      Ayeeyo Koris Pledge
                    </span>
                    <span className="font-mono font-semibold">+${sponsorshipTier}.00</span>
                  </div>
                )}
              </div>

              {/* Grand Total */}
              <div className="pt-3 border-t border-[#E5DFC0]">
                <div className="flex items-baseline justify-between">
                  <span className="font-playfair text-base font-semibold text-[#1E1C1A]">Total Due</span>
                  <div className="text-end">
                    <span className="font-playfair text-2xl font-bold text-[#2D5A43]">
                      {formatPrice(estimatedTotal)}
                    </span>
                    <span className="text-[11px] text-[#7A756D] ms-1 uppercase font-mono">{currency}</span>
                  </div>
                </div>
              </div>

              {/* Secondary Instant Action Button in Summary (Allows instant 1-click on desktop) */}
              <div className="hidden lg:block pt-1">
                <button
                  type="button"
                  onClick={() => handleSubmit()}
                  disabled={isSubmitting}
                  className="w-full py-3 px-4 rounded-full bg-[#2D5A43] hover:bg-[#234935] disabled:opacity-50 text-white text-xs font-semibold tracking-wider uppercase flex items-center justify-center gap-2 shadow-sm transition-all"
                >
                  <Lock className="w-3.5 h-3.5 text-[#D49B4B]" />
                  <span>Pay Now</span>
                </button>
              </div>

              {/* Reassurance Badges */}
              <div className="pt-3 border-t border-[#F0EBE1] space-y-2 text-[11px] text-[#5C665F]">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-[#D49B4B]" />
                  <span>Gold Bookmark &amp; Keepsake Packaging</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="w-3.5 h-3.5 text-[#2D5A43]" />
                  <span>Tracked Global Priority Courier</span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </Container>

      {/* MOBILE STICKY BOTTOM CHECKOUT ACTION BAR (Zero scrolling needed on phone!) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#E5DFC0] p-3 shadow-2xl animate-in slide-in-from-bottom duration-300">
        <div className="max-w-md mx-auto flex items-center justify-between gap-3">
          <div>
            <span className="text-[10px] text-[#7A756D] uppercase tracking-wider block">Total Due</span>
            <span className="font-playfair text-lg font-bold text-[#2D5A43]">
              {formatPrice(estimatedTotal)}
            </span>
          </div>

          <button
            type="button"
            onClick={() => handleSubmit()}
            disabled={isSubmitting}
            className="flex-1 py-3 px-5 rounded-full bg-[#2D5A43] hover:bg-[#234935] disabled:opacity-50 text-white text-xs font-semibold tracking-wide flex items-center justify-center gap-2 shadow-md active:scale-95"
          >
            {isSubmitting ? (
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Lock className="w-3.5 h-3.5 text-[#D49B4B]" />
                <span>Pay Now</span>
                <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* AYEEYO KORIS INFORMATIONAL MODAL */}
      {showAyeeyoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-[#FAF7F2] rounded-3xl shadow-2xl border border-[#E5DFC0] p-6 sm:p-8 text-[#1E1C1A] overflow-hidden space-y-5">
            <button
              type="button"
              onClick={() => setShowAyeeyoModal(false)}
              className="absolute top-4 right-4 p-2 text-[#4A544E] hover:text-[#2D5A43] rounded-full hover:bg-[#EAE5DC]"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#2D5A43]/10 border border-[#2D5A43]/30 flex items-center justify-center text-[#2D5A43]">
                <Heart className="w-5 h-5 fill-current text-[#B85233]" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#B85233]">
                  AYEEYO KORIS INITIATIVE
                </span>
                <h3 className="font-playfair text-xl font-bold text-[#1E1C1A]">
                  Grandmother-Led Family Support
                </h3>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-[#5C665F] leading-relaxed">
              In Somali tradition, grandmothers (&ldquo;Ayeeyooyin&rdquo;) are the heart and pillars of familial resilience. Ayeeyo Koris provides direct educational scholarships, textbooks, and nutrition for orphaned and vulnerable children raised by their grandmothers.
            </p>

            <div className="p-4 rounded-2xl bg-white border border-[#E5DFC0] space-y-2 text-xs text-[#1E1C1A]">
              <div className="flex items-center justify-between font-semibold text-[#2D5A43]">
                <span>100% Direct Allocation</span>
                <span>Audited Transparency</span>
              </div>
              <p className="text-[11px] text-[#7A756D]">
                Every single cent added to your order goes directly to purchasing verified school supplies and nutritional care kits distributed on the ground.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowAyeeyoModal(false)}
              className="w-full py-3 rounded-full bg-[#2D5A43] text-white text-xs font-semibold tracking-wider uppercase hover:bg-[#234935] transition-all"
            >
              Understood &amp; Return to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
