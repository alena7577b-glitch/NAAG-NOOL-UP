'use client';

import { useState, useEffect, useRef } from 'react';
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
  ArrowLeft,
  Check,
  Heart,
  Globe2,
} from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { createOrderAction, capturePayPalOrderAction, CheckoutFormInput } from '@/lib/actions/checkout';
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

  // Primary Payment Selection: Clean choice between Card (with Apple/Google Pay) and PayPal
  const [paymentMethod, setPaymentMethod] = useState<'CARD' | 'PAYPAL'>(
    paymentConfig.cardEnabled ? 'CARD' : 'PAYPAL'
  );

  // Optional community pledge: Simple 1-click $10 scholarship donation
  const [pledgeAyeeyoKoris, setPledgeAyeeyoKoris] = useState<boolean>(false);
  const donationAmount = pledgeAyeeyoKoris ? 10 : 0;

  const [formData, setFormData] = useState<Omit<CheckoutFormInput, 'items' | 'paymentMethod'>>({
    customerName: initialUserName,
    customerEmail: initialUserEmail,
    customerPhone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    postalCode: '',
    country: 'United States',
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

  // Derive completed order from redirect parameters or direct state
  const isSuccessReturn = searchParams?.get('success') === 'true';
  const successOrderNumber = searchParams?.get('orderNumber');
  const activeCompletedOrder =
    completedOrder ||
    (isSuccessReturn && successOrderNumber
      ? {
          orderId: successOrderNumber,
          orderNumber: successOrderNumber,
          totalAmount: 0,
          paymentStatus: 'PAID' as const,
        }
      : null);

  // Process return redirects from external payment gateways without triggering state cascading renders
  const processedReturnRef = useRef(false);
  useEffect(() => {
    if (processedReturnRef.current) return;

    const isSuccess = searchParams?.get('success') === 'true';
    const orderNumber = searchParams?.get('orderNumber');
    const token = searchParams?.get('token');
    const isPayPal = searchParams?.get('provider') === 'paypal';

    if (isSuccess && orderNumber) {
      processedReturnRef.current = true;
      clearCart();

      if (isPayPal && token) {
        capturePayPalOrderAction(token, orderNumber).catch((err) => {
          console.warn('PayPal capture callback notice:', err);
        });
      }
    }
  }, [searchParams, clearCart]);

  // Financial calculations
  const shippingThreshold = 50.0;
  const shippingFee = subtotal >= shippingThreshold || subtotal === 0 ? 0.0 : 5.0;
  const grandTotal = subtotal + shippingFee + donationAmount;

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMessage(null);

    if (items.length === 0) {
      setErrorMessage('Your bag is empty. Please add items to checkout.');
      return;
    }

    if (!formData.customerEmail.trim()) {
      setErrorMessage('Please enter your email address for order confirmation.');
      return;
    }

    if (!formData.customerName.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }

    if (!formData.addressLine1.trim() || !formData.city.trim()) {
      setErrorMessage('Please provide your complete delivery address and city.');
      return;
    }

    setIsSubmitting(true);

    try {
      const orderPayload: CheckoutFormInput = {
        ...formData,
        paymentMethod: paymentMethod,
        sponsorshipPledge: donationAmount > 0 ? donationAmount : undefined,
        deliveryNotes: donationAmount > 0 
          ? `${formData.deliveryNotes ? formData.deliveryNotes + ' | ' : ''}[Ayeeyo Koris Children Pledge: $10]`
          : formData.deliveryNotes,
        items: items.map((i: CartItem) => ({
          productId: i.productId || i.id,
          quantity: i.quantity,
        })),
      };

      const result = await createOrderAction(orderPayload);

      if (!result.success) {
        setErrorMessage(result.error || 'Unable to place order. Please review your details.');
        setIsSubmitting(false);
        return;
      }

      // Order created — clear local cart
      clearCart();

      // Hand off to the secure payment provider (Stripe Direct Card/Wallets or PayPal)
      if (result.paymentUrl) {
        window.location.href = result.paymentUrl;
        return;
      }

      setCompletedOrder({
        orderId: result.orderId!,
        orderNumber: result.orderNumber!,
        totalAmount: (result.totalAmount || 0) + donationAmount,
        customerEmail: formData.customerEmail,
        paymentStatus: result.paymentStatus || 'PENDING_PAYMENT',
      });
    } catch {
      setErrorMessage('A network error occurred while connecting to payment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Loading skeleton
  if (!isHydrated) {
    return (
      <div className="py-20 bg-[#FAF7F2] min-h-[75vh]">
        <Container size="default">
          <div className="max-w-4xl mx-auto space-y-6 animate-pulse">
            <div className="h-8 bg-[#E5DFC0]/50 rounded-xl w-48" />
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-7 h-96 bg-white rounded-2xl border border-[#E5DFC0]" />
              <div className="lg:col-span-5 h-80 bg-white rounded-2xl border border-[#E5DFC0]" />
            </div>
          </div>
        </Container>
      </div>
    );
  }

  // Order confirmation view
  if (activeCompletedOrder) {
    const isPaid = activeCompletedOrder.paymentStatus === 'PAID';
    return (
      <div className="py-16 sm:py-24 bg-[#FAF7F2] min-h-[80vh] flex items-center">
        <Container size="narrow">
          <div className="rounded-3xl bg-white border border-[#E5DFC0] p-8 sm:p-12 text-center space-y-6 shadow-xl shadow-[#2D5A43]/5">
            <div className="w-16 h-16 rounded-full bg-[#2D5A43]/10 border border-[#2D5A43]/30 flex items-center justify-center mx-auto text-[#2D5A43]">
              <CheckCircle2 className="w-9 h-9 text-[#2D5A43]" />
            </div>

            <div className="space-y-2">
              <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#B85233]">
                Order Confirmed
              </span>
              <h1 className="font-playfair text-3xl sm:text-4xl text-[#1E1C1A]">
                Mahadsanid, Thank You!
              </h1>
              <p className="text-xs sm:text-sm text-[#5C665F] max-w-md mx-auto leading-relaxed">
                Your order is confirmed. A receipt and dispatch updates have been sent to your email.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#FAF7F2] border border-[#E5DFC0] max-w-sm mx-auto space-y-3 text-xs sm:text-sm text-[#1E1C1A]">
              <div className="flex items-center justify-between">
                <span className="text-[#5C665F]">Order Number</span>
                <span className="font-mono font-bold text-[#2D5A43]">
                  {activeCompletedOrder.orderNumber}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#5C665F]">Payment</span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#2D5A43]/10 text-[#2D5A43]">
                  <Check className="w-3 h-3 stroke-[2.5]" />
                  {isPaid ? 'Paid & Verified' : 'Processing'}
                </span>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link href="/shop" className="w-full sm:w-auto">
                <button
                  type="button"
                  className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#2D5A43] hover:bg-[#234935] text-white font-semibold text-xs sm:text-sm transition-all shadow-md cursor-pointer"
                >
                  Continue Shopping
                </button>
              </Link>
              <Link href="/account/orders" className="w-full sm:w-auto">
                <button
                  type="button"
                  className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-white hover:bg-[#FAF7F2] border border-[#E5DFC0] text-[#2D5A43] font-semibold text-xs sm:text-sm transition-all cursor-pointer"
                >
                  View My Orders
                </button>
              </Link>
            </div>
          </div>
        </Container>
      </div>
    );
  }

  // Empty bag view
  if (items.length === 0) {
    return (
      <div className="py-20 sm:py-28 bg-[#FAF7F2] min-h-[75vh] flex items-center">
        <Container size="narrow">
          <div className="rounded-3xl bg-white border border-[#E5DFC0] p-8 sm:p-12 text-center space-y-6 shadow-xl shadow-[#2D5A43]/5">
            <div className="w-16 h-16 rounded-full bg-[#2D5A43]/5 border border-[#E5DFC0] flex items-center justify-center mx-auto text-[#2D5A43]">
              <ShoppingBag className="w-7 h-7" />
            </div>
            <div className="space-y-2">
              <h2 className="font-playfair text-2xl sm:text-3xl text-[#1E1C1A]">
                Your Shopping Bag is Empty
              </h2>
              <p className="text-xs sm:text-sm text-[#5C665F] max-w-sm mx-auto">
                Explore our collection of guided journals, mugs, and modest essentials.
              </p>
            </div>
            <Link href="/shop">
              <button
                type="button"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#2D5A43] hover:bg-[#234935] text-white font-semibold text-xs sm:text-sm shadow-md transition-all cursor-pointer"
              >
                <span>Browse The Shop</span>
                <ArrowRight className="w-4 h-4 text-[#D49B4B]" />
              </button>
            </Link>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="py-8 sm:py-12 bg-[#FAF7F2] min-h-[90vh] text-[#1E1C1A]">
      <Container size="default">
        {/* Simple Top Navigation */}
        <div className="mb-6 flex items-center justify-between pb-4 border-b border-[#E5DFC0]/70">
          <Link
            href="/cart"
            className="inline-flex items-center gap-2 text-xs sm:text-sm text-[#5C665F] hover:text-[#2D5A43] transition-colors font-medium"
          >
            <ArrowLeft className="w-4 h-4 text-[#B85233]" />
            <span>Back to Bag</span>
          </Link>
          <div className="flex items-center gap-2 text-xs text-[#2D5A43] font-medium">
            <Lock className="w-3.5 h-3.5 text-[#B85233]" />
            <span>256-Bit SSL Encrypted Checkout</span>
          </div>
        </div>

        {/* 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          
          {/* LEFT: Streamlined Checkout Form */}
          <div className="lg:col-span-7">
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {errorMessage && (
                <div
                  role="alert"
                  className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-xs sm:text-sm flex items-start gap-3"
                >
                  <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                  <p>{errorMessage}</p>
                </div>
              )}

              {/* 1. CONTACT INFORMATION */}
              <div className="p-6 rounded-2xl bg-white border border-[#E5DFC0] shadow-xs space-y-4">
                <div className="flex items-center gap-2.5 pb-3 border-b border-[#F0EBE1]">
                  <span className="w-6 h-6 rounded-full bg-[#2D5A43] text-white text-xs font-bold flex items-center justify-center">
                    1
                  </span>
                  <h2 className="font-playfair text-lg font-medium text-[#1E1C1A]">
                    Contact Information
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Email */}
                  <div className="space-y-1 sm:col-span-2">
                    <label className="text-xs font-semibold text-[#4A544E]">
                      Email Address <span className="text-[#B85233]">*</span>
                    </label>
                    <input
                      type="email"
                      name="customerEmail"
                      required
                      value={formData.customerEmail}
                      onChange={handleInputChange}
                      placeholder="your.email@example.com"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#E5DFC0] text-sm text-[#1E1C1A] placeholder-[#A0988A] focus:outline-none focus:ring-2 focus:ring-[#2D5A43]/20 focus:border-[#2D5A43] focus:bg-white transition-all"
                    />
                    <p className="text-[11px] text-[#7A756D]">Order receipt and tracking info will be sent here.</p>
                  </div>

                  {/* Full Name */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-[#4A544E]">
                      Full Name <span className="text-[#B85233]">*</span>
                    </label>
                    <input
                      type="text"
                      name="customerName"
                      required
                      value={formData.customerName}
                      onChange={handleInputChange}
                      placeholder="First and last name"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#E5DFC0] text-sm text-[#1E1C1A] placeholder-[#A0988A] focus:outline-none focus:ring-2 focus:ring-[#2D5A43]/20 focus:border-[#2D5A43] focus:bg-white transition-all"
                    />
                  </div>

                  {/* Phone */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-[#4A544E]">
                      Phone Number <span className="text-[#8A847A] font-normal">(Optional)</span>
                    </label>
                    <input
                      type="tel"
                      name="customerPhone"
                      value={formData.customerPhone}
                      onChange={handleInputChange}
                      placeholder="+1 (555) 000-0000"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#E5DFC0] text-sm text-[#1E1C1A] placeholder-[#A0988A] focus:outline-none focus:ring-2 focus:ring-[#2D5A43]/20 focus:border-[#2D5A43] focus:bg-white transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* 2. SHIPPING ADDRESS */}
              <div className="p-6 rounded-2xl bg-white border border-[#E5DFC0] shadow-xs space-y-4">
                <div className="flex items-center gap-2.5 pb-3 border-b border-[#F0EBE1]">
                  <span className="w-6 h-6 rounded-full bg-[#2D5A43] text-white text-xs font-bold flex items-center justify-center">
                    2
                  </span>
                  <h2 className="font-playfair text-lg font-medium text-[#1E1C1A]">
                    Delivery Address
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Street Address */}
                  <div className="space-y-1 sm:col-span-2">
                    <label className="text-xs font-semibold text-[#4A544E]">
                      Street Address <span className="text-[#B85233]">*</span>
                    </label>
                    <input
                      type="text"
                      name="addressLine1"
                      required
                      value={formData.addressLine1}
                      onChange={handleInputChange}
                      placeholder="Street address, apartment, suite, or unit"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#E5DFC0] text-sm text-[#1E1C1A] placeholder-[#A0988A] focus:outline-none focus:ring-2 focus:ring-[#2D5A43]/20 focus:border-[#2D5A43] focus:bg-white transition-all"
                    />
                  </div>

                  {/* City */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-[#4A544E]">
                      City <span className="text-[#B85233]">*</span>
                    </label>
                    <input
                      type="text"
                      name="city"
                      required
                      value={formData.city}
                      onChange={handleInputChange}
                      placeholder="City"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#E5DFC0] text-sm text-[#1E1C1A] placeholder-[#A0988A] focus:outline-none focus:ring-2 focus:ring-[#2D5A43]/20 focus:border-[#2D5A43] focus:bg-white transition-all"
                    />
                  </div>

                  {/* Country */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-[#4A544E]">
                      Country <span className="text-[#B85233]">*</span>
                    </label>
                    <div className="relative">
                      <select
                        name="country"
                        value={formData.country}
                        onChange={handleInputChange}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#E5DFC0] text-sm text-[#1E1C1A] focus:outline-none focus:ring-2 focus:ring-[#2D5A43]/20 focus:border-[#2D5A43] focus:bg-white transition-all appearance-none cursor-pointer"
                      >
                        <option value="United States">United States</option>
                        <option value="Canada">Canada</option>
                        <option value="United Kingdom">United Kingdom</option>
                        <option value="Somalia">Somalia</option>
                        <option value="Djibouti">Djibouti</option>
                        <option value="Kenya">Kenya</option>
                        <option value="Ethiopia">Ethiopia</option>
                        <option value="United Arab Emirates">United Arab Emirates</option>
                        <option value="Sweden">Sweden</option>
                        <option value="Norway">Norway</option>
                        <option value="Turkey">Turkey</option>
                      </select>
                      <Globe2 className="w-4 h-4 text-[#8A847A] absolute right-3.5 top-3 pointer-events-none" />
                    </div>
                  </div>

                  {/* Postal Code */}
                  <div className="space-y-1 sm:col-span-2">
                    <label className="text-xs font-semibold text-[#4A544E]">
                      Postal / Zip Code <span className="text-[#8A847A] font-normal">(Optional)</span>
                    </label>
                    <input
                      type="text"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleInputChange}
                      placeholder="Zip / Postal code"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#E5DFC0] text-sm text-[#1E1C1A] placeholder-[#A0988A] focus:outline-none focus:ring-2 focus:ring-[#2D5A43]/20 focus:border-[#2D5A43] focus:bg-white transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* 3. PAYMENT METHOD SELECTION */}
              <div className="p-6 rounded-2xl bg-white border border-[#E5DFC0] shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#F0EBE1]">
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-full bg-[#2D5A43] text-white text-xs font-bold flex items-center justify-center">
                      3
                    </span>
                    <h2 className="font-playfair text-lg font-medium text-[#1E1C1A]">
                      Payment Method
                    </h2>
                  </div>
                  <span className="text-[11px] text-[#2D5A43] font-medium flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> 100% Secure
                  </span>
                </div>

                <div className="space-y-3">
                  
                  {/* OPTION 1: Credit / Debit Card (with Apple Pay & Google Pay) */}
                  {paymentConfig.cardEnabled && (
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('CARD')}
                      className={`w-full p-4 rounded-xl text-left transition-all border-2 flex items-center justify-between gap-3 cursor-pointer ${
                        paymentMethod === 'CARD'
                          ? 'border-[#2D5A43] bg-[#2D5A43]/5 ring-1 ring-[#2D5A43]/30'
                          : 'border-[#E5DFC0] bg-[#FAF7F2] hover:border-[#2D5A43]/30'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                          paymentMethod === 'CARD' ? 'border-[#2D5A43] bg-[#2D5A43]' : 'border-[#A0988A] bg-white'
                        }`}>
                          {paymentMethod === 'CARD' && <div className="w-2 h-2 rounded-full bg-white" />}
                        </div>
                        <div>
                          <span className="font-medium text-sm text-[#1E1C1A] block">
                            Credit or Debit Card
                          </span>
                          <span className="text-xs text-[#5C665F]">
                            Visa, Mastercard, Amex, Apple Pay, Google Pay
                          </span>
                        </div>
                      </div>

                      {/* Card brand icons */}
                      <div className="flex items-center gap-1 shrink-0">
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-white border border-[#E5DFC0] font-bold text-[#1a1f36]">
                          VISA
                        </span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-white border border-[#E5DFC0] font-bold text-[#eb001b]">
                          MC
                        </span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-white border border-[#E5DFC0] font-bold text-[#006fcf]">
                          AMEX
                        </span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-black text-white font-semibold">
                          Pay
                        </span>
                      </div>
                    </button>
                  )}

                  {/* OPTION 2: PayPal */}
                  {paymentConfig.paypalEnabled && (
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('PAYPAL')}
                      className={`w-full p-4 rounded-xl text-left transition-all border-2 flex items-center justify-between gap-3 cursor-pointer ${
                        paymentMethod === 'PAYPAL'
                          ? 'border-[#0070BA] bg-[#0070BA]/5 ring-1 ring-[#0070BA]/30'
                          : 'border-[#E5DFC0] bg-[#FAF7F2] hover:border-[#0070BA]/30'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                          paymentMethod === 'PAYPAL' ? 'border-[#0070BA] bg-[#0070BA]' : 'border-[#A0988A] bg-white'
                        }`}>
                          {paymentMethod === 'PAYPAL' && <div className="w-2 h-2 rounded-full bg-white" />}
                        </div>
                        <div>
                          <span className="font-medium text-sm text-[#1E1C1A] block">
                            PayPal
                          </span>
                          <span className="text-xs text-[#5C665F]">
                            Pay with PayPal account, balance, or cards
                          </span>
                        </div>
                      </div>

                      <span className="text-xs px-2 py-0.5 rounded bg-white border border-[#E5DFC0] font-bold text-[#003087]">
                        PayPal
                      </span>
                    </button>
                  )}
                </div>
              </div>

              {/* 4. OPTIONAL GIVING: AYEEYO KORIS CHILDREN (Clean 1-Click Checkbox) */}
              <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E5DFC0] flex items-start gap-3">
                <input
                  type="checkbox"
                  id="ayeeyo-pledge"
                  checked={pledgeAyeeyoKoris}
                  onChange={(e) => setPledgeAyeeyoKoris(e.target.checked)}
                  className="mt-1 w-4 h-4 rounded text-[#2D5A43] focus:ring-[#2D5A43] cursor-pointer"
                />
                <label htmlFor="ayeeyo-pledge" className="text-xs text-[#4A544E] cursor-pointer leading-relaxed">
                  <span className="font-semibold text-[#2D5A43] flex items-center gap-1.5">
                    <Heart className="w-3.5 h-3.5 text-[#B85233] fill-current" />
                    Optional: Add $10 to the Ayeeyo Koris Children Scholarship Fund
                  </span>
                  <span>100% of this gift provides schoolbooks and nutrition kits for children raised by grandmothers.</span>
                </label>
              </div>

              {/* MAIN PAY BUTTON */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 px-6 rounded-full bg-[#2D5A43] hover:bg-[#234935] disabled:opacity-50 text-white text-base font-semibold tracking-wide flex items-center justify-center gap-2 shadow-lg shadow-[#2D5A43]/15 transition-all cursor-pointer active:scale-[0.99]"
                >
                  {isSubmitting ? (
                    <span className="inline-flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Connecting to Secure Payment...
                    </span>
                  ) : (
                    <>
                      <Lock className="w-4 h-4 text-[#D49B4B]" />
                      <span>
                        Pay {formatPrice(grandTotal, { showCode: true })}
                      </span>
                      <ArrowRight className="w-4 h-4 text-[#D49B4B]" />
                    </>
                  )}
                </button>
                <p className="text-center text-xs text-[#7A756D] mt-2 flex items-center justify-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#2D5A43]" />
                  <span>Guaranteed safe checkout with 30-Day returns</span>
                </p>
              </div>

            </form>
          </div>

          {/* RIGHT: Compact Sticky Order Summary */}
          <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-4">
            <div className="p-6 rounded-2xl bg-white border border-[#E5DFC0] shadow-xs space-y-4">
              
              <div className="flex items-center justify-between pb-3 border-b border-[#E5DFC0]">
                <h2 className="font-playfair text-lg text-[#1E1C1A]">
                  Order Summary
                </h2>
                <span className="text-xs text-[#2D5A43] font-semibold px-2 py-0.5 rounded-full bg-[#2D5A43]/5 border border-[#2D5A43]/20">
                  {items.length} {items.length === 1 ? 'item' : 'items'}
                </span>
              </div>

              {/* Items List */}
              <div className="space-y-3 max-h-72 overflow-y-auto pe-1">
                {items.map((item: CartItem) => {
                  const itemImage = resolveItemImage(item.slug, item.imageUrl);
                  return (
                    <div key={item.id} className="flex items-center gap-3">
                      <div className="relative w-12 h-14 rounded-lg bg-[#FAF7F2] border border-[#E5DFC0] shrink-0 overflow-hidden p-1">
                        <Image
                          src={itemImage}
                          alt={item.title}
                          fill
                          className="object-contain p-1"
                        />
                        <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#2D5A43] text-white text-[9px] font-bold flex items-center justify-center">
                          {item.quantity}
                        </span>
                      </div>

                      <div className="flex-1 min-w-0">
                        <h4 className="font-playfair text-xs sm:text-sm font-medium text-[#1E1C1A] truncate">
                          {item.title}
                        </h4>
                        <p className="text-[11px] text-[#7A756D]">
                          Qty: {item.quantity}
                        </p>
                      </div>

                      <div className="text-xs sm:text-sm font-semibold text-[#2D5A43]">
                        {formatPrice(item.price * item.quantity)}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Calculations */}
              <div className="pt-3 border-t border-[#E5DFC0] space-y-2 text-xs sm:text-sm">
                <div className="flex items-center justify-between text-[#5C665F]">
                  <span>Subtotal</span>
                  <span className="font-medium text-[#1E1C1A]">{formatPrice(subtotal)}</span>
                </div>

                <div className="flex items-center justify-between text-[#5C665F]">
                  <span>Shipping</span>
                  {shippingFee === 0 ? (
                    <span className="font-semibold text-[#2D5A43] text-xs">
                      Free Shipping
                    </span>
                  ) : (
                    <span className="font-medium text-[#1E1C1A]">{formatPrice(shippingFee)}</span>
                  )}
                </div>

                {pledgeAyeeyoKoris && (
                  <div className="flex items-center justify-between text-[#B85233] text-xs font-medium">
                    <span className="flex items-center gap-1">
                      <Heart className="w-3 h-3 fill-current" />
                      Ayeeyo Koris Pledge
                    </span>
                    <span>+$10.00</span>
                  </div>
                )}
              </div>

              {/* Total Due */}
              <div className="pt-3 border-t border-[#E5DFC0] flex items-baseline justify-between">
                <span className="font-playfair text-base text-[#1E1C1A]">Total Due</span>
                <div className="text-right">
                  <span className="font-playfair text-2xl font-bold text-[#2D5A43]">
                    {formatPrice(grandTotal)}
                  </span>
                  <span className="text-[11px] text-[#7A756D] ms-1 uppercase font-mono">{currency}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-[#F0EBE1] text-[11px] text-[#5C665F] space-y-1.5">
                <div className="flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-[#2D5A43]" />
                  <span>Fast tracked dispatch with delivery confirmation</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CreditCard className="w-3.5 h-3.5 text-[#D49B4B]" />
                  <span>Secure bank-grade encrypted payment gateway</span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </Container>
    </div>
  );
}
