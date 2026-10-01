import { Metadata } from 'next';
import Link from 'next/link';
import { Heart, Users, Sparkles, ExternalLink, ArrowRight } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';

export const metadata: Metadata = {
  title: 'Ayeyo Koris Initiative — Naag Nool UP',
  description:
    'Discover Ayeyo Koris, the social impact initiative of Naag Nool UP dedicated to intergenerational care, maternal health, and community empowerment.',
};

export default function AyeyoKorisPage() {
  return (
    <div className="space-y-0">
      {/* 1. HERO SECTION */}
      <section className="relative bg-[#F9F6F0] py-20 sm:py-28 border-b border-[#E5DFC0]/60">
        <Container size="narrow">
          <div className="text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#B85233]/10 text-[#B85233] text-xs font-semibold uppercase tracking-widest">
              <Heart className="w-3.5 h-3.5" />
              <span>Social Impact & Community Care</span>
            </div>

            <h1 className="font-playfair text-4xl sm:text-6xl font-normal text-[#1E1C1A] leading-[1.15]">
              Ayeyo Koris
            </h1>

            <p className="font-cormorant italic text-xl sm:text-2xl text-[#B85233]">
              Honoring wisdom, nurturing future generations.
            </p>

            <p className="font-sans text-base sm:text-lg text-[#6B655B] max-w-2xl mx-auto leading-relaxed">
              Ayeyo Koris is the impact arm of Naag Nool UP. We bridge the generational divide, celebrating the matriarchs who paved our way while empowering the next generation of young women to thrive.
            </p>

            <div className="flex flex-wrap justify-center gap-4 pt-2">
              <a
                href="#get-involved"
                className="inline-flex items-center justify-center font-medium rounded-lg px-6 py-3 text-sm bg-[#B85233] text-white hover:bg-[#A64426] transition-colors shadow-sm"
              >
                <span>Support the Initiative</span>
                <ArrowRight className="w-4 h-4 ms-2 rtl:rotate-180" />
              </a>
              <Link href="/about">
                <Button variant="outline" size="md">
                  Our Mission
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </section>

      {/* 2. PURPOSE & ROOTS */}
      <section className="py-20 sm:py-28 bg-white border-b border-[#E5DFC0]/60">
        <Container size="default">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-6">
              <p className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-[#B85233]">
                The Purpose
              </p>
              <h2 className="font-playfair text-3xl sm:text-4xl font-normal text-[#1E1C1A]">
                The Meaning of Ayeyo Koris
              </h2>
              <div className="space-y-4 font-sans text-sm sm:text-base text-[#6B655B] leading-relaxed">
                <p>
                  In Somali culture, <em>Ayeyo</em> represents the grandmother—the bedrock of family wisdom, oral heritage, and steady resilience. <em>Koris</em> speaks to rearing, nurturing, and lifting up the vulnerable.
                </p>
                <p>
                  <strong>Ayeyo Koris</strong> was conceived to ensure that no mother or elder walks alone. By uniting our resources, stories, and collective care, we create spaces where intergenerational wisdom is preserved and practical community aid is delivered.
                </p>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="rounded-3xl bg-[#F9F6F0] border border-[#E5DFC0] p-8 sm:p-12 space-y-6">
                <div className="w-12 h-12 rounded-full bg-[#4D5844] text-white flex items-center justify-center">
                  <Users className="w-6 h-6" />
                </div>
                <h3 className="font-playfair text-2xl text-[#1E1C1A]">
                  Intergenerational Solidarity
                </h3>
                <p className="font-sans text-sm text-[#6B655B] leading-relaxed">
                  When young women sit at the feet of their elders, they inherit not only history, but the fortitude that carried generations before them. We preserve this lineage of strength.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 3. IMPACT PILLARS */}
      <section className="py-20 sm:py-28 bg-[#F9F6F0] border-b border-[#E5DFC0]/60">
        <Container size="default">
          <div className="text-center max-w-2xl mx-auto space-y-4 mb-16">
            <p className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-[#B85233]">
              Impact Areas
            </p>
            <h2 className="font-playfair text-3xl sm:text-4xl font-normal text-[#1E1C1A]">
              Where We Focus Our Efforts
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="rounded-2xl bg-white p-8 border border-[#E5DFC0] space-y-4">
              <div className="w-12 h-12 rounded-xl bg-[#B85233]/10 text-[#B85233] flex items-center justify-center">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="font-playfair text-xl text-[#1E1C1A]">Elder & Matriarch Support</h3>
              <p className="font-sans text-sm text-[#6B655B] leading-relaxed">
                Providing health resources, social connection, and honor to elder women who have dedicated their lives to raising families and sustaining communities.
              </p>
            </div>

            <div className="rounded-2xl bg-white p-8 border border-[#E5DFC0] space-y-4">
              <div className="w-12 h-12 rounded-xl bg-[#4D5844]/10 text-[#4D5844] flex items-center justify-center">
                <Heart className="w-6 h-6" />
              </div>
              <h3 className="font-playfair text-xl text-[#1E1C1A]">Maternal Wellbeing</h3>
              <p className="font-sans text-sm text-[#6B655B] leading-relaxed">
                Supporting new and expectant mothers with postpartum guidance, wellness resources, and practical communal encouragement during pivotal transitions.
              </p>
            </div>

            <div className="rounded-2xl bg-white p-8 border border-[#E5DFC0] space-y-4">
              <div className="w-12 h-12 rounded-xl bg-[#D49B4B]/20 text-[#D49B4B] flex items-center justify-center">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="font-playfair text-xl text-[#1E1C1A]">Mentorship Circles</h3>
              <p className="font-sans text-sm text-[#6B655B] leading-relaxed">
                Hosting mentorship and storytelling circles where young women receive direct life coaching, leadership advice, and career perspective from seasoned women.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* 4. GET INVOLVED / DONATION SECTION */}
      <section id="get-involved" className="py-20 sm:py-28 bg-white border-b border-[#E5DFC0]/60">
        <Container size="narrow">
          <div className="text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#4D5844]/10 text-[#4D5844] text-xs font-semibold uppercase tracking-widest">
              <Heart className="w-3.5 h-3.5" />
              <span>Get Involved</span>
            </div>

            <h2 className="font-playfair text-3xl sm:text-5xl font-normal text-[#1E1C1A]">
              Support the Ayeyo Koris Cause
            </h2>

            <p className="font-sans text-base text-[#6B655B] max-w-xl mx-auto leading-relaxed">
              Your contribution directly empowers grassroots mentorship programs, community care packages, and intergenerational storytelling initiatives.
            </p>

            <div className="pt-6 rounded-3xl bg-[#F9F6F0] border border-[#E5DFC0] p-8 sm:p-10 max-w-lg mx-auto space-y-6 text-center">
              <div className="space-y-2">
                <h3 className="font-playfair text-2xl text-[#1E1C1A]">Direct Giving</h3>
                <p className="text-xs sm:text-sm text-[#6B655B]">
                  Support our verified initiative through our official donation channel.
                </p>
              </div>

              <div className="pt-2">
                {/* Official client donation URL destination */}
                <a
                  href="https://ayeyokoris.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 font-medium rounded-lg px-8 py-3.5 text-base bg-[#4D5844] text-white hover:bg-[#3B4734] transition-colors shadow-md w-full sm:w-auto"
                >
                  <span>Donate to Ayeyo Koris</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>

              <p className="text-[11px] text-[#6B655B]">
                All contributions are directed exclusively to verified community assistance and mentorship programming.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* 5. CALL TO ACTION */}
      <section className="py-20 sm:py-24 bg-[#1E1C1A] text-white text-center">
        <Container size="narrow">
          <div className="space-y-6">
            <h2 className="font-playfair text-3xl sm:text-4xl font-normal">
              Stay Connected With Our Impact
            </h2>
            <p className="font-sans text-sm sm:text-base text-white/70 max-w-lg mx-auto leading-relaxed">
              Join the Naag Nool UP community to receive seasonal updates, impact reports, and event announcements.
            </p>
            <div className="pt-4">
              <Link href="/community">
                <Button variant="secondary" size="lg" className="bg-[#B85233] text-white hover:bg-[#A64426] border-none shadow-md">
                  Join the Community
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
