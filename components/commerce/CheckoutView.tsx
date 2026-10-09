'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ShoppingBag,
  ShieldCheck,
  Lock,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Truck,
  CreditCard,
  Building2,
} from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { useCart } from '@/lib/cart/CartContext';
import { createOrderAction, CheckoutFormInput } from '@/lib/actions/checkout';

interface CheckoutViewProps {
  initialUserEmail?: string;
  initialUserName?: string;
}

export function CheckoutView({ initialUserEmail = '', initialUserName = '' }: CheckoutViewProps) {
  const { items, subtotal, isHydrated, clearCart } = useCart();

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

  const [paymentMethod, setPaymentMethod] = useState<'CARD' | 'EVC' | 'ZAAD' | 'SAHAL'>('CARD');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [completedOrder, setCompletedOrder] = useState<{
    orderId: string;
    orderNumber: string;
    totalAmount: number;
    paymentUrl?: string;
  } | null>(null);

  const shippingFee = subtotal >= 50.0 || subtotal === 0 ? 0.0 : 5.0;
  const estimatedTotal = subtotal + shippingFee;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (items.length === 0) {
      setErrorMessage('Your shopping bag is empty. Please add items before checking out.');
      return;
    }

    setIsSubmitting(true);

    try {
      if (paymentMethod !== 'CARD' && !formData.customerPhone?.trim()) {
        setErrorMessage(`Please enter your mobile phone number for ${paymentMethod} payment.`);
        setIsSubmitting(false);
        return;
      }

      const orderPayload: CheckoutFormInput = {
        ...formData,
        paymentMethod,
        items: items.map((i) => ({ productId: i.id, quantity: i.quantity })),
      };

      const result = await createOrderAction(orderPayload);

      if (!result.success) {
        setErrorMessage(result.error || 'Unable to place order. Please check your information.');
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
      });
    } catch {
      setErrorMessage('A network error occurred. Please try submitting your order again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isHydrated) {
    return (
      <div className="py-20 bg-[#F9F6F0] min-h-[70vh]">
        <Container size="default">
          <div className="animate-pulse space-y-6 max-w-2xl mx-auto">
            <div className="h-8 bg-[#E5DFC0]/50 rounded w-48 mx-auto" />
            <div className="h-96 bg-white rounded-3xl border border-[#E5DFC0]/60 p-8" />
          </div>
        </Container>
      </div>
    );
  }

  // ORDER SUCCESS STATE
  if (completedOrder) {
    return (
      <div className="py-16 sm:py-24 bg-[#F9F6F0] min-h-[75vh] flex items-center">
        <Container size="narrow">
          <div className="rounded-3xl bg-white border border-[#E5DFC0] p-8 sm:p-14 shadow-sm text-center space-y-6 animate-in fade-in duration-300">
            <div className="w-16 h-16 rounded-full bg-[#4D5844]/15 text-[#4D5844] mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <span className="text-xs uppercase tracking-[0.25em] font-semibold text-[#4D5844]">
                Order Confirmed
              </span>
              <h1 className="font-playfair text-3xl sm:text-4xl font-normal text-[#1E1C1A]">
                Thank You for Your Order
              </h1>
              <p className="font-mono text-sm font-semibold text-[#B85233]">
                Order Reference: {completedOrder.orderNumber}
              </p>
            </div>

            <p className="font-sans text-sm sm:text-base text-[#6B655B] max-w-md mx-auto leading-relaxed">
              We have received your order details and initiated fulfillment. A confirmation summary has been logged for your account.
            </p>

            <div className="rounded-2xl bg-[#FAF8F5] border border-[#E5DFC0]/70 p-5 text-start max-w-md mx-auto space-y-2 text-xs text-[#4A433A]">
              <div className="flex justify-between">
                <span>Total Amount:</span>
                <span className="font-bold text-[#1E1C1A]">${completedOrder.totalAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Order Status:</span>
                <span className="font-semibold text-[#B85233]">Processing / Awaiting Payment</span>
              </div>
              <div className="flex justify-between">
                <span>Recipient:</span>
                <span className="text-[#1E1C1A]">{formData.customerName}</span>
              </div>
            </div>

            <div className="pt-4 flex flex-wrap justify-center gap-4">
              <Link href="/account/orders">
                <Button variant="primary" size="lg" className="shadow-md">
                  <span>View Order History</span>
                  <ArrowRight className="w-4 h-4 ms-2 rtl:rotate-180" />
                </Button>
              </Link>
              <Link href="/shop">
                <Button variant="outline" size="lg">
                  Return to Shop
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </div>
    );
  }

  // EMPTY CART GUARD
  if (items.length === 0) {
    return (
      <div className="py-20 bg-[#F9F6F0] min-h-[70vh] flex items-center">
        <Container size="narrow">
          <div className="rounded-3xl bg-white border border-[#E5DFC0] p-10 text-center space-y-6">
            <ShoppingBag className="w-12 h-12 text-[#B85233] mx-auto opacity-70" />
            <h2 className="font-playfair text-2xl text-[#1E1C1A]">Your Bag is Empty</h2>
            <p className="text-xs text-[#6B655B]">
              Add journals to your shopping bag before proceeding to checkout.
            </p>
            <Link href="/shop">
              <Button variant="primary" size="md">
                Browse Collection
              </Button>
            </Link>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="py-12 sm:py-20 bg-[#F9F6F0] min-h-[80vh]">
      <Container size="default">
        {/* Breadcrumb Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-xs text-[#6B655B] mb-2">
            <Link href="/" className="hover:text-[#B85233] transition-colors">
              Home
            </Link>
            <span>&gt;</span>
            <Link href="/cart" className="hover:text-[#B85233] transition-colors">
              Shopping Bag
            </Link>
            <span>&gt;</span>
            <span className="text-[#1E1C1A] font-medium">Checkout</span>
          </div>

          <div className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-[#4D5844]" />
            <h1 className="font-playfair text-3xl sm:text-4xl font-normal text-[#1E1C1A]">
              Secure Checkout
            </h1>
          </div>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-8 p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs sm:text-sm flex items-start gap-3">
            <AlertCircle className="w-5 h-5 shrink-0 text-red-600 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold">Checkout Error</p>
              <p>{errorMessage}</p>
            </div>
          </div>
        )}

        {/* 2-Column Checkout Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Form Details */}
          <div className="lg:col-span-7">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Section 1: Customer Contact */}
              <div className="bg-white rounded-2xl border border-[#E5DFC0] p-6 sm:p-8 shadow-xs space-y-5">
                <div className="border-b border-[#E5DFC0]/60 pb-3">
                  <h2 className="font-playfair text-xl font-normal text-[#1E1C1A]">
                    1. Contact Information
                  </h2>
                  <p className="text-xs text-[#6B655B]">
                    We will send order confirmation and tracking updates to this email.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label htmlFor="customerName" className="block text-xs font-semibold uppercase tracking-wider text-[#1E1C1A] mb-1">
                      Full Name *
                    </label>
                    <input
                      id="customerName"
                      type="text"
                      name="customerName"
                      required
                      value={formData.customerName}
                      onChange={handleChange}
                      placeholder="e.g. Amina Warsame"
                      className="w-full px-4 py-2.5 text-sm rounded-lg border border-[#E5DFC0] bg-[#FAF8F5] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#B85233]"
                    />
                  </div>

                  <div>
                    <label htmlFor="customerEmail" className="block text-xs font-semibold uppercase tracking-wider text-[#1E1C1A] mb-1">
                      Email Address *
                    </label>
                    <input
                      id="customerEmail"
                      type="email"
                      name="customerEmail"
                      required
                      value={formData.customerEmail}
                      onChange={handleChange}
                      placeholder="amina@example.com"
                      className="w-full px-4 py-2.5 text-sm rounded-lg border border-[#E5DFC0] bg-[#FAF8F5] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#B85233]"
                    />
                  </div>

                  <div>
                    <label htmlFor="customerPhone" className="block text-xs font-semibold uppercase tracking-wider text-[#1E1C1A] mb-1">
                      Phone Number
                    </label>
                    <input
                      id="customerPhone"
                      type="tel"
                      name="customerPhone"
                      value={formData.customerPhone}
                      onChange={handleChange}
                      placeholder="+1 (555) 000-0000"
                      className="w-full px-4 py-2.5 text-sm rounded-lg border border-[#E5DFC0] bg-[#FAF8F5] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#B85233]"
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Shipping Destination */}
              <div className="bg-white rounded-2xl border border-[#E5DFC0] p-6 sm:p-8 shadow-xs space-y-5">
                <div className="border-b border-[#E5DFC0]/60 pb-3">
                  <h2 className="font-playfair text-xl font-normal text-[#1E1C1A]">
                    2. Shipping Address
                  </h2>
                  <p className="text-xs text-[#6B655B]">
                    Where should we deliver your intentional journals?
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label htmlFor="addressLine1" className="block text-xs font-semibold uppercase tracking-wider text-[#1E1C1A] mb-1">
                      Street Address *
                    </label>
                    <input
                      id="addressLine1"
                      type="text"
                      name="addressLine1"
                      required
                      value={formData.addressLine1}
                      onChange={handleChange}
                      placeholder="123 Heritage Way"
                      className="w-full px-4 py-2.5 text-sm rounded-lg border border-[#E5DFC0] bg-[#FAF8F5] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#B85233]"
                    />
                  </div>

                  <div>
                    <label htmlFor="addressLine2" className="block text-xs font-semibold uppercase tracking-wider text-[#1E1C1A] mb-1">
                      Apartment, Suite, Unit (optional)
                    </label>
                    <input
                      id="addressLine2"
                      type="text"
                      name="addressLine2"
                      value={formData.addressLine2}
                      onChange={handleChange}
                      placeholder="Apt 4B"
                      className="w-full px-4 py-2.5 text-sm rounded-lg border border-[#E5DFC0] bg-[#FAF8F5] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#B85233]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label htmlFor="city" className="block text-xs font-semibold uppercase tracking-wider text-[#1E1C1A] mb-1">
                        City *
                      </label>
                      <input
                        id="city"
                        type="text"
                        name="city"
                        required
                        value={formData.city}
                        onChange={handleChange}
                        placeholder="Minneapolis"
                        className="w-full px-4 py-2.5 text-sm rounded-lg border border-[#E5DFC0] bg-[#FAF8F5] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#B85233]"
                      />
                    </div>

                    <div>
                      <label htmlFor="postalCode" className="block text-xs font-semibold uppercase tracking-wider text-[#1E1C1A] mb-1">
                        Postal Code
                      </label>
                      <input
                        id="postalCode"
                        type="text"
                        name="postalCode"
                        value={formData.postalCode}
                        onChange={handleChange}
                        placeholder="55401"
                        className="w-full px-4 py-2.5 text-sm rounded-lg border border-[#E5DFC0] bg-[#FAF8F5] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#B85233]"
                      />
                    </div>

                    <div>
                      <label htmlFor="country" className="block text-xs font-semibold uppercase tracking-wider text-[#1E1C1A] mb-1">
                        Country *
                      </label>
                      <select
                        id="country"
                        name="country"
                        value={formData.country}
                        onChange={handleChange}
                        className="w-full px-3 py-2.5 text-sm rounded-lg border border-[#E5DFC0] bg-[#FAF8F5] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#B85233]"
                      >
                        <option value="United States">United States</option>
                        <option value="Canada">Canada</option>
                        <option value="United Kingdom">United Kingdom</option>
                        <option value="Somalia">Somalia</option>
                        <option value="Kenya">Kenya</option>
                        <option value="United Arab Emirates">United Arab Emirates</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="deliveryNotes" className="block text-xs font-semibold uppercase tracking-wider text-[#1E1C1A] mb-1">
                      Delivery Instructions (optional)
                    </label>
                    <textarea
                      id="deliveryNotes"
                      name="deliveryNotes"
                      rows={2}
                      value={formData.deliveryNotes}
                      onChange={handleChange}
                      placeholder="e.g. Leave with building concierge or front porch"
                      className="w-full px-4 py-2 text-sm rounded-lg border border-[#E5DFC0] bg-[#FAF8F5] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#B85233]"
                    />
                  </div>
                </div>
              </div>

              {/* Section 3: Payment Method */}
              <div className="bg-white rounded-2xl border border-[#E5DFC0] p-6 sm:p-8 shadow-xs space-y-5">
                <div className="border-b border-[#E5DFC0]/60 pb-3">
                  <h2 className="font-playfair text-xl font-normal text-[#1E1C1A]">
                    3. Payment Selection
                  </h2>
                  <p className="text-xs text-[#6B655B]">
                    Choose your preferred secure payment method.
                  </p>
                </div>

                <div className="space-y-3">
                  {/* Card Option */}
                  <label className={`block p-4 rounded-xl border transition-all cursor-pointer ${
                    paymentMethod === 'CARD' ? 'border-[#B85233] bg-[#B85233]/5 ring-1 ring-[#B85233]' : 'border-[#E5DFC0] bg-[#FAF8F5]'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="paymentOption"
                          value="CARD"
                          checked={paymentMethod === 'CARD'}
                          onChange={() => setPaymentMethod('CARD')}
                          className="accent-[#B85233]"
                        />
                        <div className="flex items-center gap-2">
                          <CreditCard className="w-5 h-5 text-[#B85233]" />
                          <div>
                            <span className="text-sm font-semibold text-[#1E1C1A] block">
                              Credit / Debit Card (Visa · Mastercard)
                            </span>
                            <span className="text-[11px] text-[#6B655B]">
                              Powered by SoomarPay &amp; Salaam Somali Bank
                            </span>
                          </div>
                        </div>
                      </div>
                      <span className="text-xs text-[#4D5844] font-medium bg-[#4D5844]/10 px-2 py-0.5 rounded">
                        Encrypted SSL
                      </span>
                    </div>
                  </label>

                  {/* EVC Plus */}
                  <label className={`block p-4 rounded-xl border transition-all cursor-pointer ${
                    paymentMethod === 'EVC' ? 'border-[#B85233] bg-[#B85233]/5 ring-1 ring-[#B85233]' : 'border-[#E5DFC0] bg-[#FAF8F5]'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="paymentOption"
                          value="EVC"
                          checked={paymentMethod === 'EVC'}
                          onChange={() => setPaymentMethod('EVC')}
                          className="accent-[#B85233]"
                        />
                        <div className="flex items-center gap-2">
                          <Building2 className="w-5 h-5 text-[#B85233]" />
                          <div>
                            <span className="text-sm font-semibold text-[#1E1C1A] block">
                              EVC Plus (Hormuud)
                            </span>
                            <span className="text-[11px] text-[#6B655B]">
                              Instant prompt sent to your mobile phone
                            </span>
                          </div>
                        </div>
                      </div>
                      <span className="text-xs text-[#4D5844] font-medium bg-[#4D5844]/10 px-2 py-0.5 rounded">
                        Instant USSD
                      </span>
                    </div>
                  </label>

                  {/* ZAAD */}
                  <label className={`block p-4 rounded-xl border transition-all cursor-pointer ${
                    paymentMethod === 'ZAAD' ? 'border-[#B85233] bg-[#B85233]/5 ring-1 ring-[#B85233]' : 'border-[#E5DFC0] bg-[#FAF8F5]'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="paymentOption"
                          value="ZAAD"
                          checked={paymentMethod === 'ZAAD'}
                          onChange={() => setPaymentMethod('ZAAD')}
                          className="accent-[#B85233]"
                        />
                        <div className="flex items-center gap-2">
                          <Building2 className="w-5 h-5 text-[#B85233]" />
                          <div>
                            <span className="text-sm font-semibold text-[#1E1C1A] block">
                              ZAAD Service (Telesom)
                            </span>
                            <span className="text-[11px] text-[#6B655B]">
                              Direct mobile wallet confirmation
                            </span>
                          </div>
                        </div>
                      </div>
                      <span className="text-xs text-[#6B655B]">Somaliland</span>
                    </div>
                  </label>

                  {/* Sahal */}
                  <label className={`block p-4 rounded-xl border transition-all cursor-pointer ${
                    paymentMethod === 'SAHAL' ? 'border-[#B85233] bg-[#B85233]/5 ring-1 ring-[#B85233]' : 'border-[#E5DFC0] bg-[#FAF8F5]'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="paymentOption"
                          value="SAHAL"
                          checked={paymentMethod === 'SAHAL'}
                          onChange={() => setPaymentMethod('SAHAL')}
                          className="accent-[#B85233]"
                        />
                        <div className="flex items-center gap-2">
                          <Building2 className="w-5 h-5 text-[#B85233]" />
                          <div>
                            <span className="text-sm font-semibold text-[#1E1C1A] block">
                              Sahal (Golis)
                            </span>
                            <span className="text-[11px] text-[#6B655B]">
                              Direct mobile money processing
                            </span>
                          </div>
                        </div>
                      </div>
                      <span className="text-xs text-[#6B655B]">Puntland</span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Submit CTA */}
              <div>
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  disabled={isSubmitting}
                  isLoading={isSubmitting}
                  className="w-full py-4 text-sm font-semibold shadow-md"
                >
                  <span>Place Order • ${estimatedTotal.toFixed(2)}</span>
                  <ArrowRight className="w-4 h-4 ms-2 rtl:rotate-180" />
                </Button>

                <p className="text-center text-xs text-[#6B655B] mt-3">
                  By placing your order, you agree to Naag Nool UP Terms of Service and Privacy Policy.
                </p>
              </div>
            </form>
          </div>

          {/* Right Column: Order Review Summary */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-3xl border border-[#E5DFC0] p-6 sm:p-8 shadow-sm space-y-6 sticky top-24">
              <h2 className="font-playfair text-2xl font-normal text-[#1E1C1A] pb-4 border-b border-[#E5DFC0]/60">
                Order Review
              </h2>

              {/* Items List */}
              <div className="space-y-4 max-h-72 overflow-y-auto pr-1">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-12 h-14 rounded-lg bg-[#FAF8F5] border border-[#E5DFC0]/60 shrink-0 p-1 flex items-center justify-center">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={item.imageUrl || `/images/journal-${item.slug.replace('the-', '')}.png`}
                          alt={item.title}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-[#1E1C1A] truncate">{item.title}</p>
                        <p className="text-[#6B655B]">Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <span className="font-semibold text-[#1E1C1A] shrink-0">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Cost Breakdown */}
              <div className="pt-4 border-t border-[#E5DFC0]/60 space-y-2.5 text-xs text-[#4A433A]">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-[#1E1C1A]">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="font-semibold text-[#1E1C1A]">
                    {shippingFee === 0 ? 'FREE' : `$${shippingFee.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Taxes</span>
                  <span>Calculated ($0.00)</span>
                </div>
                <div className="pt-3 border-t border-[#E5DFC0]/60 flex justify-between items-baseline text-sm">
                  <span className="font-playfair text-base font-semibold text-[#1E1C1A]">Total</span>
                  <span className="font-playfair text-xl font-bold text-[#B85233]">
                    ${estimatedTotal.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="pt-4 border-t border-[#E5DFC0]/50 space-y-2 text-[11px] text-[#6B655B]">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#4D5844] shrink-0" />
                  <span>Authoritative server-side price verification</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-[#4D5844] shrink-0" />
                  <span>Inspected and packaged with care</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
