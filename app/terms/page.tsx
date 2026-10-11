import { Metadata } from 'next';
import { Container } from '@/components/ui/Container';

export const metadata: Metadata = {
  title: 'Terms of Service — Naag Nool UP',
  description: 'Review the terms and conditions governing purchases and usage of Naag Nool UP services.',
};

export default function TermsOfServicePage() {
  return (
    <div className="py-16 sm:py-24 bg-[#F9F6F0]">
      <Container size="narrow" className="space-y-12">
        <header className="space-y-4 border-b border-[#EBE6DC] pb-8 text-center sm:text-start">
          <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[#B85233]">
            Legal & Compliance
          </span>
          <h1 className="font-playfair text-3xl sm:text-5xl font-medium text-[#1E1C1A]">
            Terms of Service
          </h1>
          <p className="text-sm text-[#8A847A]">
            Effective Date: October 2025 &bull; Last Updated: October 2025
          </p>
        </header>

        <section className="space-y-8 text-sm text-[#4A463F] leading-relaxed">
          <div className="space-y-3">
            <h2 className="font-playfair text-xl font-medium text-[#1E1C1A]">
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing the Naag Nool UP boutique, placing orders, or engaging with our community initiatives, you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, please discontinue use of the platform.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="font-playfair text-xl font-medium text-[#1E1C1A]">
              2. Product Orders & Pricing
            </h2>
            <p>
              All product listings, artisanal formulations, and prices are subject to availability. Prices are stated in United States Dollars (USD) unless otherwise specified. We reserve the right to correct pricing typographical errors and cancel orders placed under erroneous figures prior to dispatch.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="font-playfair text-xl font-medium text-[#1E1C1A]">
              3. Payment & Order Confirmation
            </h2>
            <p>
              Orders are accepted once payment has been verified by the respective authorized gateway. Acknowledgment of order submission does not constitute legally binding acceptance until funds are confirmed and inventory allocation is finalized.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="font-playfair text-xl font-medium text-[#1E1C1A]">
              4. Shipping & Delivery
            </h2>
            <p>
              Shipping estimates and courier timelines are provided for customer guidance. While we endeavor to meet all estimated delivery dates, delays caused by customs clearance, local carrier conditions, or force majeure are beyond our direct control.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="font-playfair text-xl font-medium text-[#1E1C1A]">
              5. Intellectual Property
            </h2>
            <p>
              All content on this platform—including visual identity, brand marks, product designs, literary texts, and software interfaces—is the exclusive intellectual property of Naag Nool UP and protected by international copyright laws.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="font-playfair text-xl font-medium text-[#1E1C1A]">
              6. Customer Care & Contact
            </h2>
            <p>
              For inquiries regarding orders, returns, or these terms, reach our support team at:
            </p>
            <div className="p-4 rounded-2xl bg-white border border-[#EBE6DC] text-xs font-mono text-[#1E1C1A] space-y-1">
              <p>Email: info@naagnoolup.com</p>
              <p>Office: Naag Nool UP Client Concierge</p>
            </div>
          </div>
        </section>
      </Container>
    </div>
  );
}
