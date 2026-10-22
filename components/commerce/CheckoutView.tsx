'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
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
  Phone,
  Mail,
  MapPin,
  Building,
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
  const { items, subtotal, isHydrated, clearCart } = useCart();
  const { currency, formatPrice } = useCurrency();
  const paymentConfig = initialPaymentConfig || DEFAULT_PAYMENT_CONFIG;

  // Primary Payment Category: defaults to Card if active, else PayPal
  const [primaryMethod, setPrimaryMethod] = useState<'CARD' | 'PAYPAL'>(
    paymentConfig.cardEnabled ? 'CARD' : 'PAYPAL'
  );

  // Optional Ayeeyo Koris Sponsorship Donation
  const [sponsorshipTier, setSponsorshipTier] = useState<number>(0);
  const [showAyeeyoModal, setShowAyeeyoModal] = useState<boolean>(false);

  // Card Inputs (Simulated encrypted fields for aesthetic polish)
  const [cardData, setCardData] = useState({
    cardNumber: '',
    cardExpiry: '',
    cardCvc: '',
  });

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

  const handleCardChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCardData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (items.length === 0) {
      setErrorMessage('Your shopping bag is empty. Please add items before checking out.');
      return;
    }

    const resolvedMethod = primaryMethod;
    setIsSubmitting(true);

    try {
      // Append sponsorship note if user opted into Ayeeyo Koris pledge
      const enhancedNotes = sponsorshipTier > 0
        ? `${formData.deliveryNotes ? formData.deliveryNotes + ' | ' : ''}[Includes Ayeeyo Koris Sponsor Pledge: $${sponsorshipTier}]`
        : formData.deliveryNotes;

      const orderPayload: CheckoutFormInput = {
        ...formData,
        deliveryNotes: enhancedNotes,
        paymentMethod: resolvedMethod,
        items: items.map((i: CartItem) => ({ productId: i.id, quantity: i.quantity })),
      };

      const result = await createOrderAction(orderPayload);

      if (!result.success) {
        setErrorMessage(result.error || 'Unable to place order. Please review your information.');
        setIsSubmitting(false);
        return;
      }

      // Order created successfully
      clearCart();

      // If PayPal returned an approval URL, redirect immediately
      if (resolvedMethod === 'PAYPAL' && result.paymentUrl) {
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
      <div className="py-24 bg-[#FBF9F5] min-h-[80vh]">
        <Container size="default">
          <div className="animate-pulse space-y-8 max-w-5xl mx-auto">
            <div className="h-6 bg-[#E8E2D8]/60 rounded-full w-56 mx-auto" />
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
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
      <div className="py-16 sm:py-24 bg-[#FBF9F5] min-h-[85vh] flex items-center">
        <Container size="narrow">
          <div className="rounded-3xl bg-white border border-[#E5DFC0] p-8 sm:p-14 shadow-2xl shadow-[#0A3929]/5 text-center space-y-8 animate-in fade-in duration-300">
            <div className="relative inline-block">
              <div
                className={`w-20 h-20 rounded-full mx-auto flex items-center justify-center ring-8 ${
                  isPaid
                    ? 'bg-[#0A3929] text-[#D3A03A] ring-[#0A3929]/10 shadow-lg'
                    : 'bg-[#D3A03A] text-[#1E1C1A] ring-[#D3A03A]/15 shadow-lg'
                }`}
              >
                <CheckCircle2 className="w-10 h-10 stroke-[2]" />
              </div>
            </div>

            <div className="space-y-3">
              <span className="text-[11px] uppercase tracking-[0.28em] font-semibold text-[#A8741A]">
                {isPaid ? 'PURCHASE CONFIRMED & SECURED' : 'ORDER RECORDED — AWAITING SETTLEMENT'}
              </span>
              <h1 className="font-playfair text-3xl sm:text-4xl text-[#0A3929]">
                {isPaid ? 'Thank You for Your Order' : 'Order Received with Care'}
              </h1>
              <p className="font-sans text-xs sm:text-sm text-[#5C665F] max-w-md mx-auto leading-relaxed">
                {isPaid
                  ? 'Your transaction has been verified. Your guided journal collection is being carefully packaged with our gold bookmark & bespoke box.'
                  : 'Your ceremonial order has been reserved. Please complete your transaction with the provider below to begin priority dispatch.'}
              </p>
              <p className="font-mono text-xs font-semibold text-[#0A3929] bg-[#0A3929]/5 py-1 px-3 rounded-full inline-block">
                {completedOrder.customerEmail}
              </p>
            </div>

            {/* Receipt Summary Card */}
            <div className="p-6 rounded-2xl bg-[#FBF9F5] border border-[#E5DFC0] text-start space-y-3.5 max-w-md mx-auto text-sm">
              <div className="flex items-center justify-between pb-3 border-b border-[#E5DFC0]">
                <span className="text-[11px] uppercase tracking-wider text-[#7A756D] font-semibold">
                  Reference Code
                </span>
                <span className="font-mono text-xs sm:text-sm font-bold text-[#0A3929]">
                  {completedOrder.orderNumber}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#5C665F]">Total Amount</span>
                <span className="font-playfair font-bold text-lg text-[#0A3929]">
                  {formatPrice(completedOrder.totalAmount, { showCode: true })}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#5C665F]">Payment Channel</span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#0A3929]/10 text-[#0A3929]">
                  <Check className="w-3 h-3 stroke-[2.5]" />
                  {isPaid ? 'Settled & Verified' : 'Pending Provider Approval'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#5C665F]">Estimated Dispatch</span>
                <span className="text-xs text-[#0A3929] font-medium">Within 24 Hours with Tracking</span>
              </div>
            </div>

            {completedOrder.paymentUrl && !isPaid && (
              <div className="pt-2">
                <a
                  href={completedOrder.paymentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-[#0070BA] hover:bg-[#005ea6] text-white font-medium text-sm transition-all shadow-md active:scale-95"
                >
                  <span>Authorize via PayPal</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            )}

            {/* Actions */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/shop" className="w-full sm:w-auto">
                <button
                  type="button"
                  className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#0A3929] hover:bg-[#06251B] text-[#FAF8F5] font-semibold text-xs sm:text-sm transition-all shadow-md active:scale-95"
                >
                  Return to Boutique
                </button>
              </Link>
              <Link href="/account/orders" className="w-full sm:w-auto">
                <button
                  type="button"
                  className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-white hover:bg-[#FBF9F5] border border-[#E5DFC0] text-[#0A3929] font-semibold text-xs sm:text-sm transition-all active:scale-95"
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
      <div className="py-20 sm:py-28 bg-[#FBF9F5] min-h-[75vh] flex items-center">
        <Container size="narrow">
          <div className="rounded-3xl bg-white border border-[#E5DFC0] p-8 sm:p-14 text-center space-y-6 shadow-xl shadow-[#0A3929]/5">
            <div className="w-16 h-16 rounded-full bg-[#0A3929]/5 border border-[#D3A03A]/40 flex items-center justify-center mx-auto text-[#0A3929]">
              <ShoppingBag className="w-7 h-7" />
            </div>
            <div className="space-y-2">
              <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#A8741A]">
                YOUR BAG IS CURATED BUT EMPTY
              </span>
              <h2 className="font-playfair text-3xl font-normal text-[#0A3929]">
                Select Your Guided Journal
              </h2>
              <p className="text-xs sm:text-sm text-[#5C665F] max-w-sm mx-auto leading-relaxed">
                Explore our empowering hardcover journal collection crafted for Somali women everywhere.
              </p>
            </div>
            <div className="pt-2">
              <Link href="/shop">
                <button
                  type="button"
                  className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#0A3929] hover:bg-[#06251B] text-[#FAF8F5] font-semibold text-xs sm:text-sm shadow-lg hover:shadow-xl transition-all active:scale-95"
                >
                  <span>Explore The Boutique</span>
                  <ArrowRight className="w-4 h-4 text-[#D3A03A]" />
                </button>
              </Link>
            </div>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="py-10 sm:py-16 bg-[#FBF9F5] min-h-[90vh] text-[#1E1C1A]">
      <Container size="default">
        {/* Navigation Breadcrumbs & Trust Bar */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E5DFC0]/70">
          <Link
            href="/cart"
            className="inline-flex items-center gap-2 text-xs sm:text-sm text-[#5C665F] hover:text-[#0A3929] transition-colors group font-medium"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform rtl:rotate-180 text-[#D3A03A]" />
            <span>Return to Shopping Bag</span>
          </Link>

          <div className="flex items-center gap-4 text-xs text-[#5C665F]">
            <div className="flex items-center gap-1.5 font-medium text-[#0A3929]">
              <Lock className="w-3.5 h-3.5 text-[#D3A03A]" />
              <span>256-Bit SSL Encrypted Checkout</span>
            </div>
            <span className="hidden sm:inline text-[#D5C9B3]">•</span>
            <span className="hidden sm:inline text-[#7A756D]">Global Priority Fulfillment</span>
          </div>
        </div>

        {/* Stepper Indicator */}
        <div className="mb-10 max-w-3xl mx-auto">
          <div className="grid grid-cols-3 gap-2 sm:gap-4 relative text-center">
            <div className="flex flex-col items-center gap-1.5">
              <span className="w-8 h-8 rounded-full bg-[#0A3929] text-[#D3A03A] border border-[#D3A03A]/50 text-xs font-bold flex items-center justify-center shadow-sm">
                1
              </span>
              <span className="text-[11px] font-semibold tracking-wider uppercase text-[#0A3929]">
                Identity &amp; Contact
              </span>
            </div>

            <div className="flex flex-col items-center gap-1.5">
              <span className="w-8 h-8 rounded-full bg-[#0A3929] text-[#D3A03A] border border-[#D3A03A]/50 text-xs font-bold flex items-center justify-center shadow-sm">
                2
              </span>
              <span className="text-[11px] font-semibold tracking-wider uppercase text-[#0A3929]">
                Delivery Destination
              </span>
            </div>

            <div className="flex flex-col items-center gap-1.5">
              <span className="w-8 h-8 rounded-full bg-[#0A3929] text-[#D3A03A] border border-[#D3A03A]/50 text-xs font-bold flex items-center justify-center shadow-sm">
                3
              </span>
              <span className="text-[11px] font-semibold tracking-wider uppercase text-[#0A3929]">
                Stripe &amp; PayPal
              </span>
            </div>
          </div>
        </div>

        {/* Main Grid: Checkout Forms vs Order Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* LEFT: Customer, Shipping & Payment Forms */}
          <div className="lg:col-span-7 space-y-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Error Banner */}
              {errorMessage && (
                <div
                  role="alert"
                  className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-xs sm:text-sm flex items-start gap-3 animate-in fade-in duration-200"
                >
                  <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold">Unable to complete checkout</p>
                    <p className="mt-0.5 text-red-700">{errorMessage}</p>
                  </div>
                </div>
              )}

              {/* 1. Contact & Customer Information */}
              <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#E5DFC0] shadow-md shadow-[#0A3929]/3 space-y-6">
                <div className="flex items-center gap-3.5 pb-4 border-b border-[#F0EBE1]">
                  <span className="w-8 h-8 rounded-full bg-[#0A3929] text-[#D3A03A] text-xs font-bold flex items-center justify-center shrink-0 shadow-sm border border-[#D3A03A]/30">
                    1
                  </span>
                  <div>
                    <h2 className="font-playfair text-xl font-normal text-[#0A3929]">
                      Customer &amp; Contact
                    </h2>
                    <p className="text-xs text-[#6B726B]">
                      We will dispatch order updates and digital certificates to your email.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#4A544E]">
                      Full Name <span className="text-[#A8741A]">*</span>
                    </label>
                    <input
                      type="text"
                      name="customerName"
                      required
                      value={formData.customerName}
                      onChange={handleInputChange}
                      placeholder="e.g. Marian Warsame"
                      className="w-full px-4 py-3 rounded-2xl bg-[#FAF8F4] border border-[#E5DFC0] text-sm text-[#1E1C1A] placeholder-[#A0988A] focus:outline-none focus:ring-2 focus:ring-[#D3A03A]/30 focus:border-[#0A3929] focus:bg-white transition-all"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#4A544E]">
                      Email Address <span className="text-[#A8741A]">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        name="customerEmail"
                        required
                        value={formData.customerEmail}
                        onChange={handleInputChange}
                        placeholder="marian@example.com"
                        className="w-full px-4 py-3 rounded-2xl bg-[#FAF8F4] border border-[#E5DFC0] text-sm text-[#1E1C1A] placeholder-[#A0988A] focus:outline-none focus:ring-2 focus:ring-[#D3A03A]/30 focus:border-[#0A3929] focus:bg-white transition-all"
                      />
                      <Mail className="w-4 h-4 text-[#8A847A] absolute right-3.5 top-3.5 pointer-events-none" />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#4A544E]">
                      Contact Phone <span className="text-[#A8741A]">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        name="customerPhone"
                        required
                        value={formData.customerPhone}
                        onChange={handleInputChange}
                        placeholder="+252 61 5000000"
                        className="w-full px-4 py-3 rounded-2xl bg-[#FAF8F4] border border-[#E5DFC0] text-sm text-[#1E1C1A] placeholder-[#A0988A] focus:outline-none focus:ring-2 focus:ring-[#D3A03A]/30 focus:border-[#0A3929] focus:bg-white transition-all"
                      />
                      <Phone className="w-4 h-4 text-[#8A847A] absolute right-3.5 top-3.5 pointer-events-none" />
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. Delivery & Shipping Address */}
              <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#E5DFC0] shadow-md shadow-[#0A3929]/3 space-y-6">
                <div className="flex items-center gap-3.5 pb-4 border-b border-[#F0EBE1]">
                  <span className="w-8 h-8 rounded-full bg-[#0A3929] text-[#D3A03A] text-xs font-bold flex items-center justify-center shrink-0 shadow-sm border border-[#D3A03A]/30">
                    2
                  </span>
                  <div>
                    <h2 className="font-playfair text-xl font-normal text-[#0A3929]">
                      Delivery Destination
                    </h2>
                    <p className="text-xs text-[#6B726B]">
                      Where should our luxury courier deliver your guided journal box?
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#4A544E]">
                      Street Address <span className="text-[#A8741A]">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="addressLine1"
                        required
                        value={formData.addressLine1}
                        onChange={handleInputChange}
                        placeholder="Street Address or Building Details"
                        className="w-full px-4 py-3 rounded-2xl bg-[#FAF8F4] border border-[#E5DFC0] text-sm text-[#1E1C1A] placeholder-[#A0988A] focus:outline-none focus:ring-2 focus:ring-[#D3A03A]/30 focus:border-[#0A3929] focus:bg-white transition-all"
                      />
                      <MapPin className="w-4 h-4 text-[#8A847A] absolute right-3.5 top-3.5 pointer-events-none" />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#4A544E]">
                      Apartment, Suite, Unit <span className="text-[#8A847A] font-normal">(Optional)</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="addressLine2"
                        value={formData.addressLine2}
                        onChange={handleInputChange}
                        placeholder="Floor 4, Suite 12B"
                        className="w-full px-4 py-3 rounded-2xl bg-[#FAF8F4] border border-[#E5DFC0] text-sm text-[#1E1C1A] placeholder-[#A0988A] focus:outline-none focus:ring-2 focus:ring-[#D3A03A]/30 focus:border-[#0A3929] focus:bg-white transition-all"
                      />
                      <Building className="w-4 h-4 text-[#8A847A] absolute right-3.5 top-3.5 pointer-events-none" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#4A544E]">
                        City <span className="text-[#A8741A]">*</span>
                      </label>
                      <input
                        type="text"
                        name="city"
                        required
                        value={formData.city}
                        onChange={handleInputChange}
                        placeholder="Mogadishu"
                        className="w-full px-4 py-3 rounded-2xl bg-[#FAF8F4] border border-[#E5DFC0] text-sm text-[#1E1C1A] placeholder-[#A0988A] focus:outline-none focus:ring-2 focus:ring-[#D3A03A]/30 focus:border-[#0A3929] focus:bg-white transition-all"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#4A544E]">
                        Country <span className="text-[#A8741A]">*</span>
                      </label>
                      <div className="relative">
                        <select
                          name="country"
                          value={formData.country}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 rounded-2xl bg-[#FAF8F4] border border-[#E5DFC0] text-sm text-[#1E1C1A] focus:outline-none focus:ring-2 focus:ring-[#D3A03A]/30 focus:border-[#0A3929] focus:bg-white transition-all appearance-none cursor-pointer"
                        >
                          <option value="Somalia">Somalia</option>
                          <option value="Djibouti">Djibouti</option>
                          <option value="Kenya">Kenya</option>
                          <option value="Ethiopia">Ethiopia</option>
                          <option value="United Arab Emirates">United Arab Emirates</option>
                          <option value="Turkey">Turkey</option>
                          <option value="United Kingdom">United Kingdom</option>
                          <option value="United States">United States</option>
                          <option value="Canada">Canada</option>
                          <option value="Sweden">Sweden</option>
                          <option value="Norway">Norway</option>
                        </select>
                        <Globe2 className="w-4 h-4 text-[#8A847A] absolute right-3.5 top-3.5 pointer-events-none" />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#4A544E]">
                        Postal Code <span className="text-[#8A847A] font-normal">(Optional)</span>
                      </label>
                      <input
                        type="text"
                        name="postalCode"
                        value={formData.postalCode}
                        onChange={handleInputChange}
                        placeholder="00100"
                        className="w-full px-4 py-3 rounded-2xl bg-[#FAF8F4] border border-[#E5DFC0] text-sm text-[#1E1C1A] placeholder-[#A0988A] focus:outline-none focus:ring-2 focus:ring-[#D3A03A]/30 focus:border-[#0A3929] focus:bg-white transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#4A544E]">
                      Delivery Instructions <span className="text-[#8A847A] font-normal">(Optional)</span>
                    </label>
                    <textarea
                      name="deliveryNotes"
                      rows={2}
                      value={formData.deliveryNotes}
                      onChange={handleInputChange}
                      placeholder="e.g. Leave at front reception, call upon arrival"
                      className="w-full px-4 py-3 rounded-2xl bg-[#FAF8F4] border border-[#E5DFC0] text-sm text-[#1E1C1A] placeholder-[#A0988A] focus:outline-none focus:ring-2 focus:ring-[#D3A03A]/30 focus:border-[#0A3929] focus:bg-white transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* AYEEYO KORIS NON-PROFIT COMMUNITY IMPACT SECTION */}
              <div className="relative rounded-3xl bg-[#0A3929] text-white p-6 sm:p-7 border border-[#D3A03A]/40 shadow-xl overflow-hidden space-y-4">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#D3A03A]/10 rounded-full blur-3xl pointer-events-none" />
                <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white/10 border border-[#D3A03A] flex items-center justify-center text-[#D3A03A] shrink-0 shadow-inner">
                      <Heart className="w-5 h-5 fill-current text-[#D3A03A]" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#D3A03A]">
                          COMMUNITY IMPACT
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-white font-medium">
                          Non-Profit
                        </span>
                      </div>
                      <h3 className="font-playfair text-lg text-white">
                        Sponsor an Ayeeyo Koris Family
                      </h3>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowAyeeyoModal(true)}
                    className="inline-flex items-center gap-1.5 text-xs text-[#D3A03A] hover:text-white transition-colors self-start sm:self-center"
                  >
                    <span>Learn About the Cause</span>
                    <HelpCircle className="w-3.5 h-3.5" />
                  </button>
                </div>

                <p className="relative z-10 text-xs sm:text-[13px] text-[#CBE1D6] leading-relaxed">
                  Support Somali boys and girls raised by their loving grandmothers. 100% of your pledge funds textbooks, school uniforms, and nutrition.
                </p>

                {/* Sponsorship Tier Chips */}
                <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
                  {[
                    { amount: 0, label: 'No Extra Pledge' },
                    { amount: 10, label: '+$10 (Textbooks)' },
                    { amount: 25, label: '+$25 (Care Kit)' },
                    { amount: 50, label: '+$50 (Tuition)' },
                  ].map((tier) => {
                    const isSelected = sponsorshipTier === tier.amount;
                    return (
                      <button
                        key={tier.amount}
                        type="button"
                        onClick={() => setSponsorshipTier(tier.amount)}
                        className={`p-2.5 rounded-2xl text-center text-xs font-semibold transition-all border ${
                          isSelected
                            ? 'bg-[#D3A03A] text-[#1E1C1A] border-[#D3A03A] shadow-md ring-2 ring-[#D3A03A]/50 scale-[1.02]'
                            : 'bg-white/10 hover:bg-white/15 text-white border-white/15'
                        }`}
                      >
                        {tier.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 3. Payment Method: TWO PRIMARY CHOICES (Stripe & PayPal) */}
              <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#E5DFC0] shadow-md shadow-[#0A3929]/3 space-y-6">
                <div className="flex items-center gap-3.5 pb-4 border-b border-[#F0EBE1]">
                  <span className="w-8 h-8 rounded-full bg-[#0A3929] text-[#D3A03A] text-xs font-bold flex items-center justify-center shrink-0 shadow-sm border border-[#D3A03A]/30">
                    3
                  </span>
                  <div>
                    <h2 className="font-playfair text-xl font-normal text-[#0A3929]">
                      Payment Channel
                    </h2>
                    <p className="text-xs text-[#6B726B]">
                      Select your preferred secure international settlement gateway
                    </p>
                  </div>
                </div>

                {/* PRIMARY PAYMENT OPTIONS (Stripe & PayPal) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* OPTION 1: Credit / Debit Card (Stripe) */}
                  {paymentConfig.cardEnabled && (
                    <button
                      type="button"
                      onClick={() => setPrimaryMethod('CARD')}
                      className={`relative p-5 rounded-2xl text-start transition-all duration-300 border-2 flex flex-col justify-between gap-3 ${
                        primaryMethod === 'CARD'
                          ? 'border-[#0A3929] bg-[#0A3929]/5 shadow-sm ring-4 ring-[#0A3929]/10'
                          : 'border-[#E5DFC0] bg-[#FAF8F4] hover:border-[#D3A03A]/50'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <div className="w-10 h-10 rounded-xl bg-white border border-[#E5DFC0] flex items-center justify-center text-[#0A3929] shadow-2xs">
                          <CreditCard className="w-5 h-5 text-[#0A3929]" />
                        </div>
                        <span
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                            primaryMethod === 'CARD'
                              ? 'border-[#0A3929] bg-[#0A3929] text-[#D3A03A]'
                              : 'border-[#C4BCB0] bg-white'
                          }`}
                        >
                          {primaryMethod === 'CARD' && <Check className="w-3 h-3 stroke-[3]" />}
                        </span>
                      </div>

                      <div>
                        <h3 className="font-playfair text-base font-semibold text-[#0A3929]">
                          Credit or Debit Card
                        </h3>
                        <p className="text-xs text-[#5C665F] mt-0.5">
                          Visa, Mastercard, &amp; International Cards
                        </p>
                      </div>

                      <div className="flex items-center gap-1.5 pt-1">
                        <span className="text-[10px] px-2 py-0.5 rounded bg-white border border-[#E5DFC0] font-semibold text-[#1E1C1A]">
                          VISA
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-white border border-[#E5DFC0] font-semibold text-[#1E1C1A]">
                          Mastercard
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-white border border-[#E5DFC0] font-semibold text-[#1E1C1A]">
                          Stripe 256-Bit
                        </span>
                      </div>
                    </button>
                  )}

                  {/* OPTION 2: PayPal */}
                  {paymentConfig.paypalEnabled && (
                    <button
                      type="button"
                      onClick={() => setPrimaryMethod('PAYPAL')}
                      className={`relative p-5 rounded-2xl text-start transition-all duration-300 border-2 flex flex-col justify-between gap-3 ${
                        primaryMethod === 'PAYPAL'
                          ? 'border-[#0070BA] bg-[#0070BA]/5 shadow-sm ring-4 ring-[#0070BA]/10'
                          : 'border-[#E5DFC0] bg-[#FAF8F4] hover:border-[#0070BA]/40'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <div className="w-10 h-10 rounded-xl bg-white border border-[#E5DFC0] flex items-center justify-center text-[#003087] shadow-2xs">
                          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                            <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944 2.76A.948.948 0 0 1 5.88 2h7.02c3.08 0 5.348.814 6.368 2.302 1.054 1.536.87 3.792-.472 5.922-1.572 2.493-4.143 3.864-7.433 3.864H9.014l-1.042 6.582a.641.641 0 0 1-.633.544l-.263.125z" fill="#003087" />
                            <path d="M19.268 7.37c-.32 2.336-1.575 4.394-3.737 5.768-1.532.975-3.418 1.488-5.452 1.488h-1.65a.82.82 0 0 0-.81.693l-1.162 7.362a.51.51 0 0 0 .504.59h3.702a.76.76 0 0 0 .752-.644l.808-5.112a.82.82 0 0 1 .81-.693h1.166c3.968 0 7.07-1.611 7.973-6.26.377-1.942.062-3.473-.91-4.49-.24-.251-.53-.478-.85-.68l-.556 1.978z" fill="#0079C1" />
                          </svg>
                        </div>
                        <span
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                            primaryMethod === 'PAYPAL'
                              ? 'border-[#0070BA] bg-[#0070BA] text-white'
                              : 'border-[#C4BCB0] bg-white'
                          }`}
                        >
                          {primaryMethod === 'PAYPAL' && <Check className="w-3 h-3 stroke-[3]" />}
                        </span>
                      </div>

                      <div>
                        <h3 className="font-playfair text-base font-semibold text-[#1E1C1A]">
                          PayPal
                        </h3>
                        <p className="text-xs text-[#5C665F] mt-0.5">
                          PayPal balance, Pay in 4, or Cards
                        </p>
                      </div>

                      <div className="flex items-center gap-1.5 pt-1">
                        <span className="text-[10px] px-2 py-0.5 rounded bg-white border border-[#E5DFC0] font-bold text-[#003087]">
                          PayPal
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-white border border-[#E5DFC0] font-semibold text-[#1E1C1A]">
                          Buyer Protection
                        </span>
                      </div>
                    </button>
                  )}
                </div>

                {/* DETAILS CONTAINER FOR CHOSEN METHOD */}
                {primaryMethod === 'CARD' ? (
                  /* CARD FORM FIELDS */
                  <div className="p-6 rounded-2xl bg-[#FAF8F4] border border-[#E5DFC0] space-y-4 animate-in fade-in duration-300">
                    <div className="flex items-center justify-between text-xs text-[#5C665F] pb-2 border-b border-[#E5DFC0]/70">
                      <span className="font-semibold text-[#0A3929]">Card Information</span>
                      <span className="flex items-center gap-1 text-[#0A3929] font-medium">
                        <Lock className="w-3.5 h-3.5 text-[#D3A03A]" />
                        Stripe TLS Encrypted
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-[#1E1C1A]">
                        Card Number
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          name="cardNumber"
                          value={cardData.cardNumber}
                          onChange={handleCardChange}
                          placeholder="4000 •••• •••• ••••"
                          maxLength={19}
                          className="w-full px-4 py-3 rounded-xl bg-white border border-[#E5DFC0] text-sm text-[#1E1C1A] placeholder-[#A0988A] focus:outline-none focus:border-[#0A3929] focus:ring-1 focus:ring-[#0A3929]"
                        />
                        <div className="absolute right-3.5 top-3 flex items-center gap-1.5 pointer-events-none">
                          <span className="text-[10px] font-bold text-[#0A3929] bg-[#FAF8F4] px-1.5 py-0.5 rounded border border-[#E5DFC0]">
                            CARD
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-[#1E1C1A]">
                          Expires (MM / YY)
                        </label>
                        <input
                          type="text"
                          name="cardExpiry"
                          value={cardData.cardExpiry}
                          onChange={handleCardChange}
                          placeholder="MM / YY"
                          maxLength={5}
                          className="w-full px-4 py-3 rounded-xl bg-white border border-[#E5DFC0] text-sm text-[#1E1C1A] placeholder-[#A0988A] focus:outline-none focus:border-[#0A3929] focus:ring-1 focus:ring-[#0A3929]"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-[#1E1C1A]">
                          Security Code (CVC)
                        </label>
                        <input
                          type="text"
                          name="cardCvc"
                          value={cardData.cardCvc}
                          onChange={handleCardChange}
                          placeholder="123"
                          maxLength={4}
                          className="w-full px-4 py-3 rounded-xl bg-white border border-[#E5DFC0] text-sm text-[#1E1C1A] placeholder-[#A0988A] focus:outline-none focus:border-[#0A3929] focus:ring-1 focus:ring-[#0A3929]"
                        />
                      </div>
                    </div>

                    <p className="text-[11px] text-[#6B726B] leading-relaxed pt-1">
                      Your payment is processed securely via Stripe. All card details are strictly tokenized according to PCI-DSS Level 1 standards.
                    </p>
                  </div>
                ) : (
                  /* PAYPAL EXPRESS CHECKOUT CONTAINER */
                  <div className="p-6 rounded-2xl bg-[#FAF8F4] border border-[#E5DFC0] space-y-4 animate-in fade-in duration-300">
                    <div className="flex items-center justify-between text-xs text-[#5C665F] pb-3 border-b border-[#E5DFC0]/70">
                      <span className="font-semibold text-[#003087]">PayPal Express Checkout</span>
                      <span className="flex items-center gap-1 text-[#0070BA] font-medium">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        PayPal Purchase Protection
                      </span>
                    </div>

                    <div className="p-4 rounded-xl bg-white border border-[#E5DFC0] space-y-2 text-xs text-[#4A544E]">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-[#0070BA]/10 flex items-center justify-center text-[#0070BA]">
                          <ArrowRight className="w-3.5 h-3.5" />
                        </div>
                        <p className="font-semibold text-[#1E1C1A]">Seamless One-Click Authorization</p>
                      </div>
                      <p className="leading-relaxed ps-8">
                        When you click <strong>Complete Order</strong>, you will be redirected securely to PayPal to approve your payment with your balance, linked bank, or card. Once approved, your order is instantly secured and confirmed.
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] text-[#6B726B]">
                      <span className="inline-flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> No sensitive financial details shared
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Full fraud monitoring &amp; 24/7 buyer support
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Submit CTA Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 px-6 rounded-full bg-[#0A3929] hover:bg-[#06251B] disabled:opacity-50 text-[#FAF8F5] text-base font-semibold tracking-wide flex items-center justify-center gap-3 shadow-xl shadow-[#0A3929]/20 transition-all duration-300 active:scale-[0.98]"
                >
                  {isSubmitting ? (
                    <span className="inline-flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Securing &amp; Initiating Order...
                    </span>
                  ) : (
                    <>
                      <Lock className="w-4 h-4 text-[#D3A03A]" />
                      <span>Complete Order • {formatPrice(estimatedTotal, { showCode: true })}</span>
                      <ArrowRight className="w-4 h-4 rtl:rotate-180 text-[#D3A03A]" />
                    </>
                  )}
                </button>

                <p className="text-center text-xs text-[#7A756D] mt-3.5 flex items-center justify-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#0A3929]" />
                  <span>Backed by our 30-Day Discretionary Guarantee and Quality Assured</span>
                </p>
              </div>
            </form>
          </div>

          {/* RIGHT: Sticky Luxury Order Summary */}
          <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-6">
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#E5DFC0] shadow-xl shadow-[#0A3929]/5 space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-[#E5DFC0]">
                <div>
                  <h2 className="font-playfair text-2xl font-normal text-[#0A3929]">
                    Order Summary
                  </h2>
                  <p className="text-xs text-[#6B726B]">Ceremonial Guided Journal Collection</p>
                </div>
                <span className="text-xs text-[#0A3929] font-semibold px-2.5 py-1 rounded-full bg-[#0A3929]/5 border border-[#D3A03A]/40 font-mono">
                  {items.length} {items.length === 1 ? 'item' : 'items'}
                </span>
              </div>

              {/* Items List */}
              <div className="space-y-4 max-h-80 overflow-y-auto pe-1">
                {items.map((item: CartItem) => {
                  const itemImage = resolveItemImage(item.slug, item.imageUrl);
                  return (
                    <div key={item.id} className="flex items-center gap-3.5 p-2 rounded-2xl hover:bg-[#FAF8F4] transition-colors">
                      <div className="relative w-14 h-18 rounded-xl bg-[#F5F2EB] border border-[#E5DFC0] shrink-0 overflow-hidden p-1 shadow-2xs">
                        <Image
                          src={itemImage}
                          alt={item.title}
                          fill
                          className="object-contain p-1"
                        />
                        <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#0A3929] text-[#D3A03A] text-[10px] font-bold flex items-center justify-center shadow-xs">
                          {item.quantity}
                        </span>
                      </div>

                      <div className="flex-1 min-w-0">
                        <h4 className="font-playfair text-sm font-semibold text-[#0A3929] truncate">
                          {item.title}
                        </h4>
                        <p className="text-[11px] text-[#7A756D]">
                          Hardcover Gold Foil Edition
                        </p>
                      </div>

                      <div className="font-playfair text-sm font-semibold text-[#0A3929] font-mono">
                        {formatPrice(item.price * item.quantity)}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Financial Calculations */}
              <div className="pt-4 border-t border-[#E5DFC0] space-y-3 text-sm">
                <div className="flex items-center justify-between text-[#5C665F]">
                  <span>Subtotal</span>
                  <span className="font-mono text-[#0A3929] font-medium">{formatPrice(subtotal)}</span>
                </div>

                <div className="flex items-center justify-between text-[#5C665F]">
                  <span>Shipping</span>
                  {shippingFee === 0 ? (
                    <span className="font-semibold text-[#0A3929] bg-[#0A3929]/10 px-2.5 py-0.5 rounded-full text-xs">
                      COMPLIMENTARY
                    </span>
                  ) : (
                    <span className="font-mono text-[#0A3929] font-medium">{formatPrice(shippingFee)}</span>
                  )}
                </div>

                {sponsorshipTier > 0 && (
                  <div className="flex items-center justify-between text-[#A8741A] font-medium text-xs sm:text-sm">
                    <span className="flex items-center gap-1.5">
                      <Heart className="w-3.5 h-3.5 fill-current text-[#D3A03A]" />
                      Ayeeyo Koris Pledge
                    </span>
                    <span className="font-mono font-semibold">+${sponsorshipTier}.00</span>
                  </div>
                )}

                <div className="flex items-center justify-between text-[#7A756D] text-xs">
                  <span>Customs &amp; Duties</span>
                  <span>Calculated &amp; Included</span>
                </div>
              </div>

              {/* Grand Total */}
              <div className="pt-4 border-t border-[#E5DFC0]">
                <div className="flex items-baseline justify-between">
                  <span className="font-playfair text-lg font-medium text-[#0A3929]">Total Due</span>
                  <div className="text-end">
                    <span className="font-playfair text-3xl font-semibold text-[#0A3929]">
                      {formatPrice(estimatedTotal)}
                    </span>
                    <span className="text-[11px] text-[#7A756D] ms-1.5 uppercase font-mono">{currency}</span>
                  </div>
                </div>
              </div>

              {/* Luxury Guarantee & Perks */}
              <div className="pt-4 border-t border-[#F0EBE1] space-y-2.5 text-xs text-[#5C665F]">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-[#D3A03A]" />
                  <span>Complimentary Gold Bookmark &amp; Linen Keepsake Box</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="w-3.5 h-3.5 text-[#0A3929]" />
                  <span>Dispatched with Priority Air Freight Tracking</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#0A3929]" />
                  <span>Official Certified NAAG NOOL UP Merchandise</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>

      {/* AYEEYO KORIS INFORMATIONAL MODAL */}
      {showAyeeyoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-[#FAF8F5] rounded-3xl shadow-2xl border border-[#E5DFC0] p-6 sm:p-8 text-[#1E1C1A] overflow-hidden space-y-5">
            <button
              type="button"
              onClick={() => setShowAyeeyoModal(false)}
              className="absolute top-4 right-4 p-2 text-[#4A544E] hover:text-[#0A3929] rounded-full hover:bg-[#EAE5DC]"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#A8741A]">
                ABOUT AYEEYO KORIS
              </span>
              <h3 className="font-playfair text-2xl sm:text-3xl font-normal text-[#0A3929]">
                Grandmothers Raise Tomorrow
              </h3>
              <p className="font-sans text-xs sm:text-sm text-[#4A544E] leading-relaxed">
                Ayeeyo Koris is dedicated to Somali boys and girls who are raised by their grandmothers when their parents are absent or have passed away.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-[#E5DFC0] space-y-2 text-xs text-[#5C665F]">
              <div className="flex items-center gap-2 text-[#0A3929] font-semibold">
                <Heart className="w-4 h-4 text-[#D3A03A]" />
                <span>How Your Pledge Makes a Difference</span>
              </div>
              <ul className="space-y-1.5 list-disc ps-5 leading-relaxed">
                <li><strong>$10</strong> provides school textbooks and notebooks for one child.</li>
                <li><strong>$25</strong> supplies an entire family care kit including basic staples.</li>
                <li><strong>$50</strong> covers one month of full schooling tuition and transport.</li>
              </ul>
            </div>

            <div className="flex items-center justify-between pt-2">
              <Link
                href="/ayeyo-koris"
                onClick={() => setShowAyeeyoModal(false)}
                className="text-xs font-semibold text-[#0A3929] hover:underline"
              >
                Visit Full Ayeeyo Koris Page →
              </Link>
              <button
                type="button"
                onClick={() => setShowAyeeyoModal(false)}
                className="px-6 py-2.5 rounded-full bg-[#0A3929] text-white text-xs font-semibold hover:bg-[#06251B] transition-colors"
              >
                Close Window
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
