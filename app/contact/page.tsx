import { Metadata } from 'next';
import { MessageSquare, Sparkles, Clock } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { ContactInquiryForm } from '@/components/forms/ContactInquiryForm';
import { PreFooterBanner } from '@/components/layout/PreFooterBanner';

export const metadata: Metadata = {
  title: 'Contact Us — Naag Nool UP',
  description:
    'Have a question about our journals, partnerships, or community? Get in touch with the Naag Nool UP team.',
};

export default function ContactPage() {
  return (
    <div className="space-y-0 overflow-hidden">
      {/* 1. HERO SECTION */}
      <section className="relative bg-[#F9F6F0] py-12 sm:py-16 lg:py-24 border-b border-[#E5DFC0]/50">
        <Container size="default">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-6 space-y-6 text-start">
              <p className="font-sans text-xs font-semibold uppercase tracking-[0.25em] text-[#B85233]">
                CONTACT
              </p>

              <h1 className="font-playfair text-4xl sm:text-6xl lg:text-7xl font-normal text-[#1E1C1A] leading-[1.08] tracking-tight">
                Let&apos;s Connect
              </h1>

              <p className="font-sans text-xs sm:text-sm lg:text-base text-[#6B655B] max-w-xl leading-relaxed">
                Whether you have a question about our journals, an inquiry regarding partnerships, or simply want to share your journey, we are here for you.
              </p>
            </div>

            {/* Right Hero Image */}
            <div className="lg:col-span-6">
              <div className="relative aspect-[4/3] sm:aspect-[4/3] lg:aspect-[4/3] w-full rounded-2xl overflow-hidden shadow-md">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/hero-woman-portrait.png"
                  alt="Woman in terracotta hijab looking upward"
                  className="w-full h-full object-cover object-center"
                />
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 2. FORM & INFO SECTION */}
      <section className="py-16 sm:py-24 bg-[#FAF8F5] border-b border-[#E5DFC0]/50">
        <Container size="default">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
            {/* Form Column */}
            <div className="lg:col-span-7">
              <div className="rounded-2xl bg-white border border-[#E5DFC0] p-6 sm:p-10 shadow-sm space-y-6">
                <div className="space-y-1.5">
                  <h2 className="font-playfair text-2xl sm:text-3xl font-normal text-[#1E1C1A]">
                    Send Us a Message
                  </h2>
                  <p className="font-sans text-xs sm:text-sm text-[#6B655B]">
                    Please fill out the form below and our team will get back to you within 1-2 business days.
                  </p>
                </div>

                <ContactInquiryForm />
              </div>
            </div>

            {/* Information Column */}
            <div className="lg:col-span-5 space-y-6">
              <div className="space-y-4">
                <h3 className="font-playfair text-2xl font-normal text-[#1E1C1A]">
                  Inquiry Channels
                </h3>

                <div className="space-y-4 font-sans text-xs sm:text-sm text-[#6B655B]">
                  <div className="flex items-start gap-4 p-4 rounded-xl bg-white border border-[#E5DFC0]/70">
                    <div className="w-9 h-9 rounded-lg bg-[#B85233]/10 text-[#B85233] flex items-center justify-center shrink-0">
                      <MessageSquare className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-[#1E1C1A] text-sm mb-0.5">Customer Care</h4>
                      <p className="text-xs leading-relaxed">
                        For questions regarding journal orders, shipping timelines, or account details.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 rounded-xl bg-white border border-[#E5DFC0]/70">
                    <div className="w-9 h-9 rounded-lg bg-[#4D5844]/10 text-[#4D5844] flex items-center justify-center shrink-0">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-[#1E1C1A] text-sm mb-0.5">Collaborations &amp; Press</h4>
                      <p className="text-xs leading-relaxed">
                        For movement partnerships, speaking engagements, and editorial features.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 rounded-xl bg-white border border-[#E5DFC0]/70">
                    <div className="w-9 h-9 rounded-lg bg-[#D49B4B]/20 text-[#D49B4B] flex items-center justify-center shrink-0">
                      <Clock className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-[#1E1C1A] text-sm mb-0.5">Response Time</h4>
                      <p className="text-xs leading-relaxed">
                        Our team operates Monday through Friday and reviews all incoming inquiries promptly.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Direct Note */}
              <div className="p-6 rounded-xl bg-[#1E1C1A] text-white space-y-2">
                <span className="font-cormorant italic text-lg text-[#D49B4B] block">
                  Resilient • Worthy • In Charge
                </span>
                <p className="text-xs text-white/80 leading-relaxed font-sans">
                  We value every connection. Thank you for walking this intentional path with us.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 3. PRE-FOOTER BANNER */}
      <PreFooterBanner
        eyebrow="JOIN OUR COMMUNITY"
        headline="Your life is yours to live."
        buttonText="Explore Naag Nool UP →"
        buttonHref="/about"
      />
    </div>
  );
}
