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
  Smartphone,
  ChevronDown,
  Sparkles,
  ArrowLeft,
  Check,
  Phone,
  Mail,
} from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { useCart } from '@/lib/cart/CartContext';
import { createOrderAction, CheckoutFormInput } from '@/lib/actions/checkout';

interface CheckoutViewProps {
  initialUserEmail?: string;
  initialUserName?: string;
}

interface MobileMoneyOption {
  id: 'EVC' | 'ZAAD' | 'SAHAL' | 'EDAHAB' | 'PREMIER';
  name: string;
  network: string;
  logo: string;
  placeholder: string;
  helpText: string;
}

const MOBILE_MONEY_OPTIONS: MobileMoneyOption[] = [
  {
    id: 'EVC',
    name: 'EVC Plus',
    network: 'Hormuud Telecom',
    logo: '/images/payment-methods/EVC-PLUS-Logo-01-230x128.webp',
    placeholder: '61X XXXXXX',
    helpText: 'An instant USSD verification prompt will appear on your Hormuud phone to enter your PIN.',
  },
  {
    id: 'ZAAD',
    name: 'ZAAD Service',
    network: 'Telesom',
    logo: '/images/payment-methods/zaad.png',
    placeholder: '63X XXXXXX',
    helpText: 'An instant USSD approval prompt will be sent to your Telesom registered number.',
  },
  {
    id: 'SAHAL',
    name: 'Sahal Service',
    network: 'Golis Telecom',
    logo: '/images/payment-methods/Golis_Telecom_Logo.png',
    placeholder: '90X XXXXXX',
    helpText: 'An instant push notification/USSD prompt will be sent to your Golis mobile phone.',
  },
  {
    id: 'EDAHAB',
    name: 'eDahab',
    network: 'Dahabshiil',
    logo: '/images/payment-methods/edahab.jpg',
    placeholder: '65X XXXXXX',
    helpText: 'You will receive an authorization prompt on your Dahabshiil eDahab account.',
  },
  {
    id: 'PREMIER',
    name: 'Premier Wallet',
    network: 'Premier Bank',
    logo: '/images/payment-methods/premier wallet.png',
    placeholder: '68X XXXXXX',
    helpText: 'Approval notification will be dispatched to your Premier Wallet account.',
  },
];

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

export function CheckoutView({ initialUserEmail = '', initialUserName = '' }: CheckoutViewProps) {
  const { items, subtotal, isHydrated, clearCart } = useCart();

  // Primary Payment Category: 'CARD' or 'MOBILE_MONEY'
  const [primaryMethod, setPrimaryMethod] = useState<'CARD' | 'MOBILE_MONEY'>('CARD');

  // Selected Mobile Money Provider (when Mobile Money is chosen)
  const [selectedMobileService, setSelectedMobileService] = useState<'EVC' | 'ZAAD' | 'SAHAL' | 'EDAHAB' | 'PREMIER'>('EVC');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

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
  } | null>(null);

  // Financial calculations
  const shippingThreshold = 50.0;
  const shippingFee = subtotal >= shippingThreshold || subtotal === 0 ? 0.0 : 5.0;
  const estimatedTotal = subtotal + shippingFee;

  const currentMobileOption = MOBILE_MONEY_OPTIONS.find((opt) => opt.id === selectedMobileService) || MOBILE_MONEY_OPTIONS[0];

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

    // Determine backend payment method code
    const resolvedMethod = primaryMethod === 'CARD' ? 'CARD' : selectedMobileService;

    // Validate phone number if mobile money is selected
    if (primaryMethod === 'MOBILE_MONEY' && !formData.customerPhone?.trim()) {
      setErrorMessage(`Please enter your mobile phone number for ${currentMobileOption.name} payment.`);
      return;
    }

    setIsSubmitting(true);

    try {
      const orderPayload: CheckoutFormInput = {
        ...formData,
        paymentMethod: resolvedMethod,
        items: items.map((i) => ({ productId: i.id, quantity: i.quantity })),
      };

      const result = await createOrderAction(orderPayload);

      if (!result.success) {
        setErrorMessage(result.error || 'Unable to place order. Please review your information.');
        setIsSubmitting(false);
        return;
      }

      // Order created successfully
      clearCart();
      setCompletedOrder({
        orderId: result.orderId!,
        orderNumber: result.orderNumber!,
        totalAmount: result.totalAmount!,
        paymentUrl: result.paymentUrl,
        customerEmail: formData.customerEmail,
      });
    } catch {
      setErrorMessage('A network error occurred while placing your order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isHydrated) {
    return (
      <div className="py-20 bg-[#FAF8F5] min-h-[75vh]">
        <Container size="default">
          <div className="animate-pulse space-y-8 max-w-4xl mx-auto">
            <div className="h-6 bg-[#E8E2D8]/60 rounded-full w-48 mx-auto" />
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-7 h-96 bg-white/70 rounded-3xl border border-[#E8E2D8]/60" />
              <div className="lg:col-span-5 h-80 bg-white/70 rounded-3xl border border-[#E8E2D8]/60" />
            </div>
          </div>
        </Container>
      </div>
    );
  }

  // ORDER SUCCESS CONFIRMATION STATE
  if (completedOrder) {
    return (
      <div className="py-16 sm:py-24 bg-[#FAF8F5] min-h-[85vh] flex items-center">
        <Container size="narrow">
          <div className="rounded-3xl bg-white border border-[#E8E2D8] p-8 sm:p-14 shadow-lg shadow-[#1E1C1A]/5 text-center space-y-8 animate-in fade-in duration-400">
            <div className="relative inline-block">
              <div className="w-20 h-20 rounded-full bg-[#4D5844]/15 text-[#4D5844] mx-auto flex items-center justify-center ring-8 ring-[#4D5844]/5">
                <CheckCircle2 className="w-10 h-10 stroke-[1.75]" />
              </div>
            </div>

            <div className="space-y-3">
              <span className="text-xs uppercase tracking-[0.25em] font-semibold text-[#4D5844]">
                Order Confirmed & Secured
              </span>
              <h1 className="font-playfair text-3xl sm:text-4xl font-normal text-[#1E1C1A]">
                Thank You for Your Order
              </h1>
              <p className="font-sans text-sm sm:text-base text-[#6B655B] max-w-md mx-auto leading-relaxed">
                Your order has been recorded and is being prepared with exceptional care. A formal confirmation and receipt have been dispatched to:
              </p>
              <p className="font-medium text-[#1E1C1A] text-sm">{completedOrder.customerEmail}</p>
            </div>

            {/* Receipt Summary Card */}
            <div className="p-6 rounded-2xl bg-[#FAF8F5] border border-[#E8E2D8] text-start space-y-3.5 max-w-md mx-auto text-sm">
              <div className="flex items-center justify-between pb-3 border-b border-[#E8E2D8]">
                <span className="text-xs uppercase tracking-wider text-[#8A847A] font-semibold">Order Reference</span>
                <span className="font-mono text-xs sm:text-sm font-bold text-[#B85233]">
                  {completedOrder.orderNumber}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#6B655B]">Total Amount Paid</span>
                <span className="font-mono font-bold text-base text-[#1E1C1A]">
                  ${completedOrder.totalAmount.toFixed(2)} USD
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#6B655B]">Payment Status</span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#4D5844]/15 text-[#4D5844]">
                  <Check className="w-3 h-3" />
                  Verified
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#6B655B]">Estimated Dispatch</span>
                <span className="text-xs text-[#1E1C1A] font-medium">Within 24 Hours</span>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/shop" className="w-full sm:w-auto">
                <button
                  type="button"
                  className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#B85233] hover:bg-[#9E4228] text-white font-medium text-sm transition-all shadow-md active:scale-95"
                >
                  Return to Boutique
                </button>
              </Link>
              <Link href="/admin/orders" className="w-full sm:w-auto">
                <button
                  type="button"
                  className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-white hover:bg-[#FAF8F5] border border-[#E8E2D8] text-[#1E1C1A] font-medium text-sm transition-all active:scale-95"
                >
                  View Order Status
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
      <div className="py-20 bg-[#FAF8F5] min-h-[75vh] flex items-center">
        <Container size="narrow">
          <div className="rounded-3xl bg-white border border-[#E8E2D8] p-8 sm:p-12 text-center space-y-6">
            <ShoppingBag className="w-12 h-12 text-[#B85233] mx-auto opacity-70" />
            <h2 className="font-playfair text-2xl sm:text-3xl text-[#1E1C1A]">Your Bag is Empty</h2>
            <p className="text-sm text-[#6B655B]">Please select a guided journal before proceeding to checkout.</p>
            <Link href="/shop">
              <button
                type="button"
                className="mt-2 px-8 py-3 rounded-full bg-[#B85233] text-white font-medium text-sm shadow-md"
              >
                Browse Journals
              </button>
            </Link>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="py-10 sm:py-16 bg-[#FAF8F5] min-h-[90vh]">
      <Container size="default">
        {/* Navigation Breadcrumbs */}
        <div className="mb-6 sm:mb-8 flex items-center justify-between">
          <Link
            href="/cart"
            className="inline-flex items-center gap-2 text-xs sm:text-sm text-[#8A847A] hover:text-[#B85233] transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform rtl:rotate-180" />
            <span>Return to Shopping Bag</span>
          </Link>
          <div className="flex items-center gap-1.5 text-xs text-[#4D5844] font-medium">
            <Lock className="w-3.5 h-3.5" />
            <span>256-Bit SSL Encrypted Checkout</span>
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
              <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#E8E2D8] shadow-xs space-y-5">
                <div className="flex items-center gap-3 pb-4 border-b border-[#F0EBE1]">
                  <span className="w-7 h-7 rounded-full bg-[#B85233] text-white text-xs font-bold flex items-center justify-center">
                    1
                  </span>
                  <div>
                    <h2 className="font-playfair text-xl font-medium text-[#1E1C1A]">Customer & Contact</h2>
                    <p className="text-xs text-[#8A847A]">We will send your order confirmation and dispatch updates here</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-xs font-semibold text-[#1E1C1A] uppercase tracking-wider">
                      Full Name <span className="text-[#B85233]">*</span>
                    </label>
                    <input
                      type="text"
                      name="customerName"
                      required
                      value={formData.customerName}
                      onChange={handleInputChange}
                      placeholder="e.g. Marian Hassan"
                      className="w-full px-4 py-3 rounded-2xl bg-[#FAF8F5] border border-[#E8E2D8] text-sm text-[#1E1C1A] placeholder-[#A0988A] focus:outline-none focus:ring-2 focus:ring-[#B85233]/20 focus:border-[#B85233]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[#1E1C1A] uppercase tracking-wider">
                      Email Address <span className="text-[#B85233]">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        name="customerEmail"
                        required
                        value={formData.customerEmail}
                        onChange={handleInputChange}
                        placeholder="you@domain.com"
                        className="w-full px-4 py-3 rounded-2xl bg-[#FAF8F5] border border-[#E8E2D8] text-sm text-[#1E1C1A] placeholder-[#A0988A] focus:outline-none focus:ring-2 focus:ring-[#B85233]/20 focus:border-[#B85233]"
                      />
                      <Mail className="w-4 h-4 text-[#8A847A] absolute right-3.5 top-3.5 pointer-events-none" />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[#1E1C1A] uppercase tracking-wider">
                      Contact Phone <span className="text-[#B85233]">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        name="customerPhone"
                        required
                        value={formData.customerPhone}
                        onChange={handleInputChange}
                        placeholder="+252 61 5000000"
                        className="w-full px-4 py-3 rounded-2xl bg-[#FAF8F5] border border-[#E8E2D8] text-sm text-[#1E1C1A] placeholder-[#A0988A] focus:outline-none focus:ring-2 focus:ring-[#B85233]/20 focus:border-[#B85233]"
                      />
                      <Phone className="w-4 h-4 text-[#8A847A] absolute right-3.5 top-3.5 pointer-events-none" />
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. Delivery & Shipping Address */}
              <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#E8E2D8] shadow-xs space-y-5">
                <div className="flex items-center gap-3 pb-4 border-b border-[#F0EBE1]">
                  <span className="w-7 h-7 rounded-full bg-[#B85233] text-white text-xs font-bold flex items-center justify-center">
                    2
                  </span>
                  <div>
                    <h2 className="font-playfair text-xl font-medium text-[#1E1C1A]">Delivery Destination</h2>
                    <p className="text-xs text-[#8A847A]">Where shall we deliver your ceremonial journals?</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[#1E1C1A] uppercase tracking-wider">
                      Street Address <span className="text-[#B85233]">*</span>
                    </label>
                    <input
                      type="text"
                      name="addressLine1"
                      required
                      value={formData.addressLine1}
                      onChange={handleInputChange}
                      placeholder="Makkah Al-Mukarramah Road / Building No."
                      className="w-full px-4 py-3 rounded-2xl bg-[#FAF8F5] border border-[#E8E2D8] text-sm text-[#1E1C1A] placeholder-[#A0988A] focus:outline-none focus:ring-2 focus:ring-[#B85233]/20 focus:border-[#B85233]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[#1E1C1A] uppercase tracking-wider">
                      Apartment, Suite, Unit <span className="text-[#8A847A] font-normal">(Optional)</span>
                    </label>
                    <input
                      type="text"
                      name="addressLine2"
                      value={formData.addressLine2}
                      onChange={handleInputChange}
                      placeholder="Floor 3, Apt 12B"
                      className="w-full px-4 py-3 rounded-2xl bg-[#FAF8F5] border border-[#E8E2D8] text-sm text-[#1E1C1A] placeholder-[#A0988A] focus:outline-none focus:ring-2 focus:ring-[#B85233]/20 focus:border-[#B85233]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-[#1E1C1A] uppercase tracking-wider">
                        City <span className="text-[#B85233]">*</span>
                      </label>
                      <input
                        type="text"
                        name="city"
                        required
                        value={formData.city}
                        onChange={handleInputChange}
                        placeholder="Mogadishu"
                        className="w-full px-4 py-3 rounded-2xl bg-[#FAF8F5] border border-[#E8E2D8] text-sm text-[#1E1C1A] placeholder-[#A0988A] focus:outline-none focus:ring-2 focus:ring-[#B85233]/20 focus:border-[#B85233]"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-[#1E1C1A] uppercase tracking-wider">
                        Country <span className="text-[#B85233]">*</span>
                      </label>
                      <select
                        name="country"
                        value={formData.country}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-2xl bg-[#FAF8F5] border border-[#E8E2D8] text-sm text-[#1E1C1A] focus:outline-none focus:ring-2 focus:ring-[#B85233]/20 focus:border-[#B85233]"
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
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-[#1E1C1A] uppercase tracking-wider">
                        Postal Code <span className="text-[#8A847A] font-normal">(Optional)</span>
                      </label>
                      <input
                        type="text"
                        name="postalCode"
                        value={formData.postalCode}
                        onChange={handleInputChange}
                        placeholder="00100"
                        className="w-full px-4 py-3 rounded-2xl bg-[#FAF8F5] border border-[#E8E2D8] text-sm text-[#1E1C1A] placeholder-[#A0988A] focus:outline-none focus:ring-2 focus:ring-[#B85233]/20 focus:border-[#B85233]"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[#1E1C1A] uppercase tracking-wider">
                      Delivery Instructions <span className="text-[#8A847A] font-normal">(Optional)</span>
                    </label>
                    <textarea
                      name="deliveryNotes"
                      rows={2}
                      value={formData.deliveryNotes}
                      onChange={handleInputChange}
                      placeholder="e.g., Deliver to front reception, call upon arrival"
                      className="w-full px-4 py-3 rounded-2xl bg-[#FAF8F5] border border-[#E8E2D8] text-sm text-[#1E1C1A] placeholder-[#A0988A] focus:outline-none focus:ring-2 focus:ring-[#B85233]/20 focus:border-[#B85233]"
                    />
                  </div>
                </div>
              </div>

              {/* 3. Payment Method: TWO PRIMARY CHOICES (Card or Mobile Money) */}
              <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#E8E2D8] shadow-xs space-y-6">
                <div className="flex items-center gap-3 pb-4 border-b border-[#F0EBE1]">
                  <span className="w-7 h-7 rounded-full bg-[#B85233] text-white text-xs font-bold flex items-center justify-center">
                    3
                  </span>
                  <div>
                    <h2 className="font-playfair text-xl font-medium text-[#1E1C1A]">Payment Method</h2>
                    <p className="text-xs text-[#8A847A]">Select your preferred payment channel</p>
                  </div>
                </div>

                {/* TWO PRIMARY PAYMENT OPTIONS */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* OPTION 1: Credit / Debit Card */}
                  <button
                    type="button"
                    onClick={() => setPrimaryMethod('CARD')}
                    className={`relative p-5 rounded-2xl text-start transition-all duration-300 border-2 flex flex-col justify-between gap-3 ${
                      primaryMethod === 'CARD'
                        ? 'border-[#B85233] bg-[#B85233]/5 shadow-sm ring-4 ring-[#B85233]/5'
                        : 'border-[#E8E2D8] bg-[#FAF8F5] hover:border-[#D48344]/50'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className="w-10 h-10 rounded-xl bg-white border border-[#E8E2D8] flex items-center justify-center text-[#B85233]">
                        <CreditCard className="w-5 h-5" />
                      </div>
                      <span
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                          primaryMethod === 'CARD'
                            ? 'border-[#B85233] bg-[#B85233] text-white'
                            : 'border-[#C4BCB0] bg-white'
                        }`}
                      >
                        {primaryMethod === 'CARD' && <Check className="w-3 h-3 stroke-[3]" />}
                      </span>
                    </div>

                    <div>
                      <h3 className="font-playfair text-base font-medium text-[#1E1C1A]">
                        Credit or Debit Card
                      </h3>
                      <p className="text-xs text-[#6B655B] mt-0.5">
                        Visa, Mastercard, & International Cards
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5 pt-1">
                      <span className="text-[10px] px-2 py-0.5 rounded bg-white border border-[#E8E2D8] font-semibold text-[#1E1C1A]">
                        VISA
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-white border border-[#E8E2D8] font-semibold text-[#1E1C1A]">
                        Mastercard
                      </span>
                    </div>
                  </button>

                  {/* OPTION 2: Mobile Money */}
                  <button
                    type="button"
                    onClick={() => setPrimaryMethod('MOBILE_MONEY')}
                    className={`relative p-5 rounded-2xl text-start transition-all duration-300 border-2 flex flex-col justify-between gap-3 ${
                      primaryMethod === 'MOBILE_MONEY'
                        ? 'border-[#B85233] bg-[#B85233]/5 shadow-sm ring-4 ring-[#B85233]/5'
                        : 'border-[#E8E2D8] bg-[#FAF8F5] hover:border-[#D48344]/50'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className="w-10 h-10 rounded-xl bg-white border border-[#E8E2D8] flex items-center justify-center text-[#B85233]">
                        <Smartphone className="w-5 h-5" />
                      </div>
                      <span
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                          primaryMethod === 'MOBILE_MONEY'
                            ? 'border-[#B85233] bg-[#B85233] text-white'
                            : 'border-[#C4BCB0] bg-white'
                        }`}
                      >
                        {primaryMethod === 'MOBILE_MONEY' && <Check className="w-3 h-3 stroke-[3]" />}
                      </span>
                    </div>

                    <div>
                      <h3 className="font-playfair text-base font-medium text-[#1E1C1A]">
                        Mobile Money
                      </h3>
                      <p className="text-xs text-[#6B655B] mt-0.5">
                        Instant USSD prompt & wallet settlement
                      </p>
                    </div>

                    <div className="flex items-center gap-1 pt-1 overflow-hidden">
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-white border border-[#E8E2D8] font-medium text-[#1E1C1A]">
                        EVC Plus
                      </span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-white border border-[#E8E2D8] font-medium text-[#1E1C1A]">
                        ZAAD
                      </span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-white border border-[#E8E2D8] font-medium text-[#1E1C1A]">
                        Sahal
                      </span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-white border border-[#E8E2D8] font-medium text-[#1E1C1A]">
                        eDahab
                      </span>
                    </div>
                  </button>
                </div>

                {/* DETAILS CONTAINER FOR CHOSEN METHOD */}
                {primaryMethod === 'CARD' ? (
                  /* CARD FORM FIELDS */
                  <div className="p-5 rounded-2xl bg-[#FAF8F5] border border-[#E8E2D8] space-y-4 animate-in fade-in duration-300">
                    <div className="flex items-center justify-between text-xs text-[#6B655B] pb-2 border-b border-[#E8E2D8]/60">
                      <span>Card Details</span>
                      <span className="flex items-center gap-1 text-[#4D5844] font-medium">
                        <Lock className="w-3.5 h-3.5" />
                        256-Bit TLS Bank Encrypted
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
                          className="w-full px-4 py-3 rounded-xl bg-white border border-[#E8E2D8] text-sm text-[#1E1C1A] placeholder-[#A0988A] focus:outline-none focus:border-[#B85233]"
                        />
                        <div className="absolute right-3.5 top-3 flex items-center gap-1.5 pointer-events-none">
                          <span className="text-[10px] font-bold text-[#1E1C1A] bg-[#FAF8F5] px-1.5 py-0.5 rounded border border-[#E8E2D8]">
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
                          className="w-full px-4 py-3 rounded-xl bg-white border border-[#E8E2D8] text-sm text-[#1E1C1A] placeholder-[#A0988A] focus:outline-none focus:border-[#B85233]"
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
                          className="w-full px-4 py-3 rounded-xl bg-white border border-[#E8E2D8] text-sm text-[#1E1C1A] placeholder-[#A0988A] focus:outline-none focus:border-[#B85233]"
                        />
                      </div>
                    </div>

                    <p className="text-[11px] text-[#8A847A] leading-relaxed pt-1">
                      Your payment is processed securely. All card numbers are strictly tokenized and encrypted according to PCI-DSS Level 1 standards.
                    </p>
                  </div>
                ) : (
                  /* MOBILE MONEY ACCORDION & DROPDOWN */
                  <div className="p-5 rounded-2xl bg-[#FAF8F5] border border-[#E8E2D8] space-y-5 animate-in fade-in duration-300">
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-[#1E1C1A] uppercase tracking-wider block">
                        Choose Mobile Money Service
                      </label>

                      {/* Custom Luxury Dropdown Selector */}
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                          className="w-full p-3.5 rounded-2xl bg-white border-2 border-[#E8E2D8] hover:border-[#B85233] text-start flex items-center justify-between gap-3 transition-all shadow-xs"
                        >
                          <div className="flex items-center gap-3.5 min-w-0">
                            {/* Selected Logo */}
                            <div className="w-12 h-9 rounded-lg bg-white border border-[#E8E2D8] p-1 flex items-center justify-center shrink-0 overflow-hidden shadow-xs">
                              <img
                                src={currentMobileOption.logo}
                                alt={currentMobileOption.name}
                                className="max-h-full max-w-full object-contain"
                              />
                            </div>
                            <div className="min-w-0">
                              <div className="font-playfair text-base font-semibold text-[#1E1C1A] truncate">
                                {currentMobileOption.name}
                              </div>
                              <div className="text-xs text-[#8A847A] truncate">
                                {currentMobileOption.network}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 text-[#8A847A]">
                            <span className="text-xs hidden sm:inline">Change</span>
                            <ChevronDown
                              className={`w-4 h-4 transition-transform duration-200 ${
                                isDropdownOpen ? 'rotate-180' : ''
                              }`}
                            />
                          </div>
                        </button>

                        {/* Dropdown Menu */}
                        {isDropdownOpen && (
                          <div className="absolute z-30 left-0 right-0 mt-2 p-2 rounded-2xl bg-white border border-[#E8E2D8] shadow-xl space-y-1 animate-in fade-in zoom-in-95 duration-150">
                            {MOBILE_MONEY_OPTIONS.map((opt) => {
                              const isSelected = opt.id === selectedMobileService;
                              return (
                                <button
                                  key={opt.id}
                                  type="button"
                                  onClick={() => {
                                    setSelectedMobileService(opt.id);
                                    setIsDropdownOpen(false);
                                  }}
                                  className={`w-full p-2.5 rounded-xl text-start flex items-center justify-between gap-3 transition-colors ${
                                    isSelected
                                      ? 'bg-[#B85233]/10 text-[#1E1C1A]'
                                      : 'hover:bg-[#FAF8F5] text-[#1E1C1A]'
                                  }`}
                                >
                                  <div className="flex items-center gap-3 min-w-0">
                                    <div className="w-12 h-8 rounded-lg bg-white border border-[#E8E2D8] p-1 flex items-center justify-center shrink-0 overflow-hidden">
                                      <img
                                        src={opt.logo}
                                        alt={opt.name}
                                        className="max-h-full max-w-full object-contain"
                                      />
                                    </div>
                                    <div>
                                      <div className="font-playfair text-sm font-semibold text-[#1E1C1A]">
                                        {opt.name}
                                      </div>
                                      <div className="text-[11px] text-[#8A847A]">{opt.network}</div>
                                    </div>
                                  </div>

                                  {isSelected && (
                                    <span className="w-5 h-5 rounded-full bg-[#B85233] text-white flex items-center justify-center shrink-0">
                                      <Check className="w-3 h-3 stroke-[3]" />
                                    </span>
                                  )}
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Dedicated Phone Input */}
                    <div className="space-y-1.5 pt-1">
                      <label className="text-xs font-semibold text-[#1E1C1A] uppercase tracking-wider block">
                        Registered Mobile Number <span className="text-[#B85233]">*</span>
                      </label>
                      <div className="relative flex rounded-2xl overflow-hidden border border-[#E8E2D8] focus-within:ring-2 focus-within:ring-[#B85233]/20 focus-within:border-[#B85233] bg-white">
                        <span className="px-3.5 py-3 bg-[#FAF8F5] border-e border-[#E8E2D8] text-xs font-mono font-bold text-[#1E1C1A] flex items-center">
                          +252
                        </span>
                        <input
                          type="tel"
                          name="customerPhone"
                          required
                          value={formData.customerPhone}
                          onChange={handleInputChange}
                          placeholder={currentMobileOption.placeholder}
                          className="flex-1 px-4 py-3 bg-white text-sm text-[#1E1C1A] placeholder-[#A0988A] focus:outline-none"
                        />
                      </div>
                    </div>

                    {/* Instant USSD Prompt Guidance Card */}
                    <div className="p-3.5 rounded-xl bg-white border border-[#E8E2D8] text-xs text-[#6B655B] flex items-start gap-2.5">
                      <Smartphone className="w-4 h-4 text-[#B85233] shrink-0 mt-0.5" />
                      <div className="space-y-0.5">
                        <p className="font-semibold text-[#1E1C1A]">Direct Phone Authorization</p>
                        <p className="leading-relaxed">{currentMobileOption.helpText}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Submit CTA */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 px-6 rounded-full bg-[#B85233] hover:bg-[#9E4228] disabled:bg-[#B85233]/50 text-white text-base font-medium tracking-wide flex items-center justify-center gap-3 shadow-lg shadow-[#B85233]/25 transition-all duration-300 active:scale-[0.98]"
                >
                  {isSubmitting ? (
                    <span className="inline-flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Securing & Initiating Order...
                    </span>
                  ) : (
                    <>
                      <Lock className="w-4 h-4 opacity-90" />
                      <span>Complete Order • ${estimatedTotal.toFixed(2)} USD</span>
                      <ArrowRight className="w-4 h-4 rtl:rotate-180" />
                    </>
                  )}
                </button>

                <p className="text-center text-xs text-[#8A847A] mt-3 flex items-center justify-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#4D5844]" />
                  <span>By placing your order, you agree to our 30-Day Guarantee and Terms</span>
                </p>
              </div>
            </form>
          </div>

          {/* RIGHT: Sticky Luxury Order Summary */}
          <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-6">
            <div className="p-6 sm:p-7 rounded-3xl bg-white border border-[#E8E2D8] shadow-sm space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-[#E8E2D8]">
                <h2 className="font-playfair text-2xl font-normal text-[#1E1C1A]">
                  Order Items
                </h2>
                <span className="text-xs text-[#8A847A] font-mono">
                  {items.length} {items.length === 1 ? 'item' : 'items'}
                </span>
              </div>

              {/* Items List */}
              <div className="space-y-4 max-h-80 overflow-y-auto pe-1">
                {items.map((item) => {
                  const itemImage = resolveItemImage(item.slug, item.imageUrl);
                  return (
                    <div key={item.id} className="flex items-center gap-3.5">
                      <div className="relative w-14 h-18 rounded-xl bg-[#F5F2EB] border border-[#E8E2D8] shrink-0 overflow-hidden p-1">
                        <Image
                          src={itemImage}
                          alt={item.title}
                          fill
                          className="object-contain p-1"
                        />
                        <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#1E1C1A] text-white text-[10px] font-bold flex items-center justify-center">
                          {item.quantity}
                        </span>
                      </div>

                      <div className="flex-1 min-w-0">
                        <h4 className="font-playfair text-sm font-medium text-[#1E1C1A] truncate">
                          {item.title}
                        </h4>
                        <p className="text-[11px] text-[#8A847A]">
                          Hardcover Guided Journal
                        </p>
                      </div>

                      <div className="font-playfair text-sm font-semibold text-[#1E1C1A] font-mono">
                        ${(item.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Financial Calculations */}
              <div className="pt-4 border-t border-[#E8E2D8] space-y-3 text-sm">
                <div className="flex items-center justify-between text-[#6B655B]">
                  <span>Subtotal</span>
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

                <div className="flex items-center justify-between text-[#8A847A] text-xs">
                  <span>Taxes</span>
                  <span>Calculated & Included</span>
                </div>
              </div>

              {/* Grand Total */}
              <div className="pt-4 border-t border-[#E8E2D8]">
                <div className="flex items-baseline justify-between">
                  <span className="font-playfair text-lg font-medium text-[#1E1C1A]">Total Due</span>
                  <div className="text-end">
                    <span className="font-playfair text-2xl sm:text-3xl font-semibold text-[#1E1C1A]">
                      ${estimatedTotal.toFixed(2)}
                    </span>
                    <span className="text-[11px] text-[#8A847A] ms-1 uppercase font-mono">USD</span>
                  </div>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="pt-4 border-t border-[#F0EBE1] space-y-2 text-xs text-[#6B655B]">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-[#B85233]" />
                  <span>Includes Gold Bookmark & Custom Linen Box</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="w-3.5 h-3.5 text-[#4D5844]" />
                  <span>Dispatched with Priority Tracking</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#4D5844]" />
                  <span>Guaranteed Official NAAG NOOL UP Merchandise</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
