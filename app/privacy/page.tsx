import { Metadata } from 'next';
import { Container } from '@/components/ui/Container';

export const metadata: Metadata = {
  title: 'Privacy Policy — Naag Nool UP',
  description: 'Understand how Naag Nool UP collects, protects, and handles your personal information.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="py-16 sm:py-24 bg-[#F9F6F0]">
      <Container size="narrow" className="space-y-12">
        <header className="space-y-4 border-b border-[#EBE6DC] pb-8 text-center sm:text-start">
          <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[#B85233]">
            Legal & Compliance
          </span>
          <h1 className="font-playfair text-3xl sm:text-5xl font-medium text-[#1E1C1A]">
            Privacy Policy
          </h1>
          <p className="text-sm text-[#8A847A]">
            Effective Date: October 2025 &bull; Last Updated: October 2025
          </p>
        </header>

        <section className="space-y-8 text-sm text-[#4A463F] leading-relaxed">
          <div className="space-y-3">
            <h2 className="font-playfair text-xl font-medium text-[#1E1C1A]">
              1. Overview & Commitment
            </h2>
            <p>
              Naag Nool UP (&ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;us&rdquo;) is dedicated to safeguarding your privacy and ensuring transparency in how your personal data is collected and processed when interacting with our digital boutique and services.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="font-playfair text-xl font-medium text-[#1E1C1A]">
              2. Information We Collect
            </h2>
            <p>
              When you browse our catalog, register an account, or complete a purchase, we collect the necessary information to fulfill our service commitments:
            </p>
            <ul className="list-disc ps-5 space-y-1 text-xs sm:text-sm">
              <li><strong>Contact Details:</strong> Full name, email address, telephone number, and physical shipping address.</li>
              <li><strong>Order History:</strong> Products purchased, order amounts, and transaction identifiers.</li>
              <li><strong>Technical Metadata:</strong> IP address, browser type, and interaction metrics to optimize storefront performance and security.</li>
            </ul>
          </div>

          <div className="space-y-3">
            <h2 className="font-playfair text-xl font-medium text-[#1E1C1A]">
              3. Payment Information Security
            </h2>
            <p>
              All payment transactions are handled through secure, certified external payment gateways (such as Stripe and SoomarPay). Naag Nool UP never stores or directly accesses your complete credit card numbers or banking PINs on our servers.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="font-playfair text-xl font-medium text-[#1E1C1A]">
              4. Cookies & Preferences
            </h2>
            <p>
              We utilize essential session cookies and locale preferences (e.g. language selection) to deliver a seamless browsing experience. We do not sell your personal information or browsing records to third-party data brokers.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="font-playfair text-xl font-medium text-[#1E1C1A]">
              5. Your Rights & Inquiries
            </h2>
            <p>
              You have the right to request access to the personal data we hold about you, request corrections, or ask for account deletion. To exercise these rights, please contact our administrative team at:
            </p>
            <div className="p-4 rounded-2xl bg-white border border-[#EBE6DC] text-xs font-mono text-[#1E1C1A] space-y-1">
              <p>Email: info@naagnoolup.com</p>
              <p>Subject: Privacy & Data Request</p>
            </div>
          </div>
        </section>
      </Container>
    </div>
  );
}
