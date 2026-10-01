import { Metadata } from 'next';
import { Users, Sparkles, HeartHandshake, BookMarked, MessageSquare } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { CommunitySignupForm } from '@/components/forms/CommunitySignupForm';

export const metadata: Metadata = {
  title: 'Join Our Community — Naag Nool UP',
  description:
    'Join the Naag Nool UP global movement. Connect with intentional women, receive weekly journaling prompts, and access private community reflections.',
};

export default function CommunityPage() {
  return (
    <div className="space-y-0">
      {/* 1. HERO SECTION */}
      <section className="relative bg-[#F9F6F0] py-20 sm:py-28 border-b border-[#E5DFC0]/60">
        <Container size="narrow">
          <div className="text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#B85233]/10 text-[#B85233] text-xs font-semibold uppercase tracking-widest">
              <Users className="w-3.5 h-3.5" />
              <span>Global Sisterhood</span>
            </div>

            <h1 className="font-playfair text-4xl sm:text-6xl font-normal text-[#1E1C1A] leading-[1.15]">
              A community for women who choose to{' '}
              <span className="font-cormorant italic text-[#B85233]">
                Rise Together.
              </span>
            </h1>

            <p className="font-sans text-base sm:text-lg text-[#6B655B] max-w-2xl mx-auto leading-relaxed">
              We are building a sanctuary where women encourage one another to live with intention, unapologetic worth, and bold agency.
            </p>
          </div>
        </Container>
      </section>

      {/* 2. SIGNUP SECTION */}
      <section className="py-20 sm:py-28 bg-white border-b border-[#E5DFC0]/60">
        <Container size="narrow">
          <div className="rounded-3xl bg-[#F9F6F0] border border-[#E5DFC0] p-8 sm:p-12 shadow-sm space-y-8">
            <div className="text-center space-y-3">
              <span className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-[#B85233]">
                Member Registration
              </span>
              <h2 className="font-playfair text-3xl sm:text-4xl font-normal text-[#1E1C1A]">
                Claim Your Seat in the Circle
              </h2>
              <p className="font-sans text-sm text-[#6B655B] max-w-lg mx-auto leading-relaxed">
                Enter your name and email to join our private mailing community. No spam, only purposeful reflections and early drops.
              </p>
            </div>

            <CommunitySignupForm />
          </div>
        </Container>
      </section>

      {/* 3. WHAT MEMBERS RECEIVE */}
      <section className="py-20 sm:py-28 bg-[#F9F6F0] border-b border-[#E5DFC0]/60">
        <Container size="default">
          <div className="text-center max-w-2xl mx-auto space-y-4 mb-16">
            <p className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-[#B85233]">
              Member Benefits
            </p>
            <h2 className="font-playfair text-3xl sm:text-4xl font-normal text-[#1E1C1A]">
              What You Can Expect
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="rounded-2xl bg-white p-8 border border-[#E5DFC0] space-y-4">
              <div className="w-12 h-12 rounded-xl bg-[#B85233]/10 text-[#B85233] flex items-center justify-center">
                <BookMarked className="w-6 h-6" />
              </div>
              <h3 className="font-playfair text-xl text-[#1E1C1A]">Weekly Journal Prompts</h3>
              <p className="font-sans text-sm text-[#6B655B] leading-relaxed">
                Carefully crafted reflective questions delivered to your inbox every Sunday to set an intentional tone for your week.
              </p>
            </div>

            <div className="rounded-2xl bg-white p-8 border border-[#E5DFC0] space-y-4">
              <div className="w-12 h-12 rounded-xl bg-[#4D5844]/10 text-[#4D5844] flex items-center justify-center">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="font-playfair text-xl text-[#1E1C1A]">Early Edition Access</h3>
              <p className="font-sans text-sm text-[#6B655B] leading-relaxed">
                Be the first to access limited journal edition print runs, seasonal lifestyle items, and special community workshops.
              </p>
            </div>

            <div className="rounded-2xl bg-white p-8 border border-[#E5DFC0] space-y-4">
              <div className="w-12 h-12 rounded-xl bg-[#D49B4B]/20 text-[#D49B4B] flex items-center justify-center">
                <MessageSquare className="w-6 h-6" />
              </div>
              <h3 className="font-playfair text-xl text-[#1E1C1A]">Community Stories</h3>
              <p className="font-sans text-sm text-[#6B655B] leading-relaxed">
                Hear authentic reflections and testimonials from women worldwide who are navigating healing and stepping into leadership.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* 4. COMMUNITY PRINCIPLES */}
      <section className="py-20 sm:py-24 bg-[#1E1C1A] text-white">
        <Container size="narrow">
          <div className="text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 text-white text-xs font-semibold uppercase tracking-widest">
              <HeartHandshake className="w-3.5 h-3.5" />
              <span>Our Code</span>
            </div>

            <h2 className="font-playfair text-3xl sm:text-4xl font-normal">
              Safe. Honest. Uplifting.
            </h2>

            <p className="font-sans text-sm sm:text-base text-white/80 max-w-xl mx-auto leading-relaxed">
              We protect the sanctity of our space. Every voice is respected, every journey is honored, and our shared goal is always mutual elevation.
            </p>
          </div>
        </Container>
      </section>
    </div>
  );
}
