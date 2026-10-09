import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export function WhyJournalingSection() {
  return (
    <section className="relative w-full bg-[#FAF7F2] text-[#1E1C1A] border-b border-[#EBE3D3] overflow-hidden">
      <div className="w-full grid grid-cols-1 lg:grid-cols-2 items-center min-h-[280px] sm:min-h-[320px] lg:min-h-[350px]">
        
        {/* =========================================================================
            LEFT 50%: Full-Bleed Authentic Photography (Zoomed Out Proportions)
        ========================================================================= */}
        <div className="relative w-full h-[260px] sm:h-[320px] lg:h-full min-h-[260px] lg:min-h-[340px] max-h-[400px] overflow-hidden bg-[#2D3328]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/why-journaling-woman.png"
            alt="Woman writing with gold fountain pen in open journal"
            className="w-full h-full object-cover object-[center_30%] sm:object-center transition-transform duration-700 ease-out hover:scale-[1.02]"
          />
        </div>

        {/* =========================================================================
            RIGHT 50%: Editorial Guidance & Purpose Narrative
        ========================================================================= */}
        <div className="relative flex flex-col justify-center px-6 sm:px-10 lg:px-14 xl:px-16 py-8 sm:py-10 lg:py-12 text-start space-y-4 bg-[#FAF7F2]">
          
          {/* Subtle Organic Curve Motif on Far Right */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-72 h-72 border border-[#E5DFC0]/50 rounded-full translate-x-28 pointer-events-none -z-0 hidden md:block" />

          {/* Eyebrow */}
          <div className="relative z-10">
            <p className="font-sans text-[11px] sm:text-xs font-semibold uppercase tracking-[0.28em] text-[#7A7067]">
              WHY JOURNALING?
            </p>
          </div>

          {/* Headline */}
          <h2 className="relative z-10 font-playfair text-2xl sm:text-3xl lg:text-[2.35rem] font-normal text-[#1E1C1A] leading-[1.2] tracking-tight">
            A journal is a mirror,<br />
            a guide and a safe space.
          </h2>

          {/* Editorial Narrative */}
          <p className="relative z-10 font-sans text-xs sm:text-[14px] text-[#4D453D] leading-[1.75] font-normal max-w-lg">
            Journaling helps you process, plan, heal and dream. It gives you the space to be honest, to be curious and to build the life you want — on your own terms.
          </p>

          {/* Action CTA Link */}
          <div className="relative z-10 pt-1">
            <Link
              href="/about"
              className="group inline-flex items-center gap-2 text-xs sm:text-sm font-semibold tracking-[0.06em] text-[#A64426] hover:text-[#8E381E] transition-colors"
            >
              <span>Learn More</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
          </div>

        </div>

      </div>
    </section>
  );
}
