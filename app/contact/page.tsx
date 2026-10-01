import { Metadata } from 'next';
import { Mail, MessageSquare, Sparkles, Clock } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { ContactInquiryForm } from '@/components/forms/ContactInquiryForm';

export const metadata: Metadata = {
  title: 'Contact Us — Naag Nool UP',
  description:
    'Have a question about our journals, partnerships, or community? Get in touch with the Naag Nool UP team.',
};

export default function ContactPage() {
  return (
    <div className="space-y-0">
      {/* 1. HERO SECTION */}
      <section className="relative bg-[#F9F6F0] py-20 sm:py-28 border-b border-[#E5DFC0]/60">
        <Container size="narrow">
          <div className="text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#B85233]/10 text-[#B85233] text-xs font-semibold uppercase tracking-widest">
              <Mail className="w-3.5 h-3.5" />
              <span>Get In Touch</span>
            </div>

            <h1 className="font-playfair text-4xl sm:text-6xl font-normal text-[#1E1C1A] leading-[1.15]">
              Let’s Connect
            </h1>

            <p className="font-sans text-base sm:text-lg text-[#6B655B] max-w-xl mx-auto leading-relaxed">
              Whether you have a question about our journals, an inquiry regarding partnerships, or simply want to share your journey, we are here for you.
            </p>
          </div>
        </Container>
      </section>

      {/* 2. FORM & INFO SECTION */}
      <section className="py-20 sm:py-28 bg-white border-b border-[#E5DFC0]/60">
        <Container size="default">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
            {/* Form Column */}
            <div className="lg:col-span-7">
              <div className="rounded-3xl bg-[#F9F6F0] border border-[#E5DFC0] p-8 sm:p-10 shadow-sm space-y-6">
                <div className="space-y-2">
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
            <div className="lg:col-span-5 space-y-8">
              <div className="space-y-6">
                <h3 className="font-playfair text-2xl font-normal text-[#1E1C1A]">
                  Inquiry Channels
                </h3>

                <div className="space-y-6 font-sans text-sm text-[#6B655B]">
                  <div className="flex items-start gap-4 p-5 rounded-2xl bg-[#F9F6F0] border border-[#E5DFC0]/70">
                    <div className="w-10 h-10 rounded-xl bg-[#B85233]/10 text-[#B85233] flex items-center justify-center shrink-0">
                      <MessageSquare className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-[#1E1C1A] text-base mb-1">Customer Care</h4>
                      <p className="text-xs leading-relaxed">
                        For questions regarding journal orders, shipping timelines, or account details.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-5 rounded-2xl bg-[#F9F6F0] border border-[#E5DFC0]/70">
                    <div className="w-10 h-10 rounded-xl bg-[#4D5844]/10 text-[#4D5844] flex items-center justify-center shrink-0">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-[#1E1C1A] text-base mb-1">Collaborations & Press</h4>
                      <p className="text-xs leading-relaxed">
                        For movement partnerships, speaking engagements, and editorial features.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-5 rounded-2xl bg-[#F9F6F0] border border-[#E5DFC0]/70">
                    <div className="w-10 h-10 rounded-xl bg-[#D49B4B]/20 text-[#D49B4B] flex items-center justify-center shrink-0">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-[#1E1C1A] text-base mb-1">Response Time</h4>
                      <p className="text-xs leading-relaxed">
                        Our team operates Monday through Friday and reviews all incoming inquiries promptly.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Direct Note */}
              <div className="p-6 rounded-2xl bg-[#1E1C1A] text-white space-y-2">
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
    </div>
  );
}
