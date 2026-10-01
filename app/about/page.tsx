import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Sparkles, Compass, ShieldCheck } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';

export const metadata: Metadata = {
  title: 'About Our Movement — Naag Nool UP',
  description:
    'Learn about Naag Nool UP, our mission, core values of Resilience, Worth, and Agency, and the philosophy behind our guided journals.',
};

export default function AboutPage() {
  return (
    <div className="space-y-0">
      {/* 1. HERO SECTION */}
      <section className="relative bg-[#F9F6F0] py-20 sm:py-28 border-b border-[#E5DFC0]/60">
        <Container size="narrow">
          <div className="text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#B85233]/10 text-[#B85233] text-xs font-semibold uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Our Mission & Story</span>
            </div>

            <h1 className="font-playfair text-4xl sm:text-6xl font-normal text-[#1E1C1A] leading-[1.15]">
              Built for women who choose to be{' '}
              <span className="font-cormorant italic text-[#B85233]">
                In Charge.
              </span>
            </h1>

            <p className="font-sans text-base sm:text-lg text-[#6B655B] max-w-2xl mx-auto leading-relaxed">
              Naag Nool UP is more than a brand. It is an intentional space, a movement, and a commitment to helping women reclaim their voice, honor their inner strength, and live fully alive.
            </p>
          </div>
        </Container>
      </section>

      {/* 2. THE STORY / PHILOSOPHY */}
      <section className="py-20 sm:py-28 bg-white border-b border-[#E5DFC0]/60">
        <Container size="default">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-6">
              <p className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-[#B85233]">
                Why We Exist
              </p>
              <h2 className="font-playfair text-3xl sm:text-4xl font-normal text-[#1E1C1A]">
                The time to be ALIVE is now.
              </h2>
              <div className="space-y-4 font-sans text-sm sm:text-base text-[#6B655B] leading-relaxed">
                <p>
                  Every woman carries an undeniable spark of wisdom, strength, and possibility. Too often, external expectations, unspoken burdens, or past challenges encourage us to diminish ourselves.
                </p>
                <p>
                  <strong>Naag Nool UP</strong> was founded to disrupt that cycle. We believe that true empowerment begins inward—through radical honesty, dedicated self-reflection, and the courage to take ownership of your personal narrative.
                </p>
                <p>
                  Whether through our guided journals, community dialogues, or social impact initiatives, our purpose is to support you in stepping into your fullest power.
                </p>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="rounded-3xl bg-[#F9F6F0] border border-[#E5DFC0] p-8 sm:p-12 space-y-6">
                <span className="font-cormorant italic text-3xl text-[#B85233] block">
                  &ldquo;You are resilient. You are worthy. You are in charge.&rdquo;
                </span>
                <p className="font-sans text-sm text-[#6B655B] leading-relaxed">
                  These three truths serve as the anchor for everything we create. They remind us that our dignity is inherent, our resilience is proven, and our future belongs to us.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 3. THE THREE VALUES (DEEP DIVE) */}
      <section className="py-20 sm:py-28 bg-[#F9F6F0] border-b border-[#E5DFC0]/60">
        <Container size="default">
          <div className="text-center max-w-2xl mx-auto space-y-4 mb-16">
            <p className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-[#B85233]">
              Core Values
            </p>
            <h2 className="font-playfair text-3xl sm:text-4xl font-normal text-[#1E1C1A]">
              The Principles That Guide Us
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="rounded-2xl bg-white p-8 border border-[#E5DFC0] space-y-4">
              <div className="w-12 h-12 rounded-xl bg-[#B85233]/10 text-[#B85233] flex items-center justify-center font-playfair font-bold text-lg">
                R
              </div>
              <h3 className="font-playfair text-2xl text-[#1E1C1A]">Resilient</h3>
              <p className="font-sans text-sm text-[#6B655B] leading-relaxed">
                Resilience is not merely enduring hardship—it is transforming experience into insight. We honor the strength forged through overcoming adversity.
              </p>
            </div>

            <div className="rounded-2xl bg-white p-8 border border-[#E5DFC0] space-y-4">
              <div className="w-12 h-12 rounded-xl bg-[#4D5844]/10 text-[#4D5844] flex items-center justify-center font-playfair font-bold text-lg">
                W
              </div>
              <h3 className="font-playfair text-2xl text-[#1E1C1A]">Worthy</h3>
              <p className="font-sans text-sm text-[#6B655B] leading-relaxed">
                Your self-worth is non-negotiable and requires no external validation. We cultivate environments where women know and trust their value.
              </p>
            </div>

            <div className="rounded-2xl bg-white p-8 border border-[#E5DFC0] space-y-4">
              <div className="w-12 h-12 rounded-xl bg-[#D49B4B]/20 text-[#D49B4B] flex items-center justify-center font-playfair font-bold text-lg">
                C
              </div>
              <h3 className="font-playfair text-2xl text-[#1E1C1A]">In Charge</h3>
              <p className="font-sans text-sm text-[#6B655B] leading-relaxed">
                Agency is the ultimate freedom. Taking charge means choosing your boundaries, steering your ambitions, and claiming your rightful seat at every table.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* 4. THE GUIDED JOURNALS */}
      <section className="py-20 sm:py-28 bg-white border-b border-[#E5DFC0]/60">
        <Container size="default">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#4D5844]/10 text-[#4D5844] text-xs font-semibold uppercase tracking-widest">
                <Compass className="w-3.5 h-3.5" />
                <span>The Tool for Growth</span>
              </div>
              <h2 className="font-playfair text-3xl sm:text-4xl font-normal text-[#1E1C1A]">
                Why Guided Journaling?
              </h2>
              <p className="font-sans text-sm sm:text-base text-[#6B655B] leading-relaxed">
                We chose journaling as our core instrument because the written word anchors intention. When you write down your reflections, fears, goals, and breakthroughs, you transform abstract thought into tangible reality.
              </p>
              <p className="font-sans text-sm sm:text-base text-[#6B655B] leading-relaxed">
                Our six journal editions are structured around specific themes of healing, clarity, boundaries, leadership, and joy.
              </p>
              <div className="pt-2">
                <Link href="/shop">
                  <Button variant="primary" size="md">
                    <span>Explore the Journal Editions</span>
                    <ArrowRight className="w-4 h-4 ms-2 rtl:rotate-180" />
                  </Button>
                </Link>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="rounded-3xl bg-[#F9F6F0] border border-[#E5DFC0] p-8 sm:p-10 space-y-5">
                <h3 className="font-playfair text-2xl text-[#1E1C1A]">
                  The Transformational Journal Framework
                </h3>
                <ul className="space-y-4 font-sans text-sm text-[#6B655B]">
                  <li className="flex items-start gap-3">
                    <ShieldCheck className="w-5 h-5 text-[#B85233] shrink-0 mt-0.5" />
                    <span>Structured daily prompts designed to deepen self-awareness.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <ShieldCheck className="w-5 h-5 text-[#B85233] shrink-0 mt-0.5" />
                    <span>Dedicated reflection intervals to track personal growth and healing.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <ShieldCheck className="w-5 h-5 text-[#B85233] shrink-0 mt-0.5" />
                    <span>Tactile, high-grade linen materials that honor the ritual of writing.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 5. CALL TO ACTION */}
      <section className="py-20 sm:py-24 bg-[#1E1C1A] text-white text-center">
        <Container size="narrow">
          <div className="space-y-6">
            <h2 className="font-playfair text-3xl sm:text-5xl font-normal">
              Join Our Global Movement
            </h2>
            <p className="font-sans text-sm sm:text-base text-white/70 max-w-lg mx-auto leading-relaxed">
              Connect with like-minded women, access weekly reflections, and be the first to know about new releases and events.
            </p>
            <div className="flex flex-wrap justify-center gap-4 pt-4">
              <Link href="/community">
                <Button variant="secondary" size="lg" className="bg-[#B85233] text-white hover:bg-[#A64426] border-none shadow-md">
                  Join the Community
                </Button>
              </Link>
              <Link href="/contact">
                <Button variant="outline" size="lg" className="text-white border-white/30 hover:bg-white/10">
                  Get in Touch
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
