import Link from 'next/link';

export function AyeyoKorisSection() {
  return (
    <section className="relative w-full bg-[#2F362A] text-[#FAF7F2] overflow-hidden border-b border-[#242A20]">
      <div className="relative w-full min-h-[340px] sm:min-h-[380px] lg:min-h-[420px] flex items-center">
        
        {/* =========================================================================
            BACKGROUND: High-Resolution Sunset Landscape Photography
        ========================================================================= */}
        <div className="absolute inset-0 z-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/ayeyo-actual-hero.png"
            alt="Ayeyo Koris - Empowering women and girls in our communities"
            className="w-full h-full object-cover object-[80%_center] sm:object-[78%_center] lg:object-[82%_center]"
          />
          {/* Deep Olive/Sage Gradient Scrim blending naturally with twilight landscape */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#2F362A] via-[#2F362A] via-42% sm:via-[#2F362A]/90 sm:via-55% lg:via-[#2F362A]/75 lg:via-50% to-transparent" />
        </div>

        {/* Decorative Botanical Leaf Line Illustration on Far Left */}
        <div className="absolute left-0 bottom-0 top-0 w-32 sm:w-44 pointer-events-none opacity-20 text-[#FAF7F2] z-10 hidden sm:block">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/botanical-branch.svg"
            alt=""
            className="w-full h-full object-contain object-left invert brightness-200"
          />
        </div>

        {/* =========================================================================
            CONTENT OVERLAY: Editorial Purpose Manifesto & Dual Action CTAs
        ========================================================================= */}
        <div className="relative z-10 w-full max-w-[1440px] mx-auto px-6 sm:px-12 lg:px-16 xl:px-20 py-10 sm:py-14 lg:py-16">
          <div className="max-w-lg lg:max-w-xl text-start space-y-4 sm:space-y-5">
            
            {/* Eyebrow */}
            <p className="font-sans text-[11px] sm:text-xs font-semibold uppercase tracking-[0.28em] text-[#D8CEBD]">
              OUR IMPACT
            </p>

            {/* Headline */}
            <h2 className="font-playfair text-3xl sm:text-4xl lg:text-[2.85rem] font-normal text-[#FAF7F2] leading-[1.15] tracking-tight">
              Ayeyo Koris
            </h2>

            {/* Narrative Description */}
            <p className="font-sans text-xs sm:text-sm lg:text-[14.5px] text-[#E0D8C9] leading-[1.8] font-normal max-w-md">
              Ayeyo Koris is our commitment to creating real change. Through your support and purchases, we invest in education, opportunity and brighter futures for women and girls in our communities.
            </p>

            {/* Dual Action Buttons matching Figma Design */}
            <div className="flex flex-wrap items-center gap-3.5 pt-1 sm:pt-2">
              <Link
                href="/ayeyo-koris"
                className="inline-flex items-center justify-center bg-[#FAF6F0] hover:bg-[#EDE3D4] text-[#1E1C1A] text-xs sm:text-[13px] font-semibold tracking-[0.04em] px-6 py-2.5 sm:py-3 rounded-[5px] transition-all duration-200 shadow-sm hover:shadow active:scale-[0.98]"
              >
                Learn More
              </Link>
              <Link
                href="/donate"
                className="inline-flex items-center justify-center border border-[#FAF7F2]/60 hover:border-[#FAF7F2] hover:bg-[#FAF7F2]/10 text-[#FAF7F2] text-xs sm:text-[13px] font-semibold tracking-[0.04em] px-6 py-2.5 sm:py-3 rounded-[5px] transition-all duration-200 active:scale-[0.98]"
              >
                Donate
              </Link>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
