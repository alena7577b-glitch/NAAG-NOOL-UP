import Link from 'next/link';

import { ArrowRight } from 'lucide-react';

export interface PreFooterBannerProps {
  eyebrow?: string;
  headline?: string;
  buttonText?: string;
  buttonHref?: string;
}

export function PreFooterBanner({
  eyebrow = 'NAAG NOOL UP',
  headline = 'Your life is yours to live.',
  buttonText = 'Explore All Journals',
  buttonHref = '/shop',
}: PreFooterBannerProps) {
  return (
    <section className="relative w-full min-h-[340px] sm:min-h-[400px] lg:min-h-[440px] overflow-hidden flex items-center">
      {/* Cinematic Golden Sunset Horizon Background */}
      <div className="absolute inset-0 z-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/prefooter-sunset-cinematic.jpg"
          alt="Cinematic desert horizon at sunset"
          className="w-full h-full object-cover object-[78%_center] sm:object-[75%_center] lg:object-right"
        />
        {/* Scrim for pristine text legibility */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/50 via-50% sm:via-black/35 to-transparent" />
        <div className="absolute bottom-0 inset-x-0 h-16 bg-gradient-to-t from-[#1E1C1A] to-transparent pointer-events-none" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-[1360px] mx-auto px-6 sm:px-10 lg:px-14">
        <div className="max-w-xl text-start space-y-4 sm:space-y-5">
          <div className="flex items-center gap-3">
            <span className="w-5 h-[1.5px] bg-[#E5DFC0]" />
            <p className="font-sans text-[11px] sm:text-xs font-semibold uppercase tracking-[0.3em] text-[#E5DFC0]">
              {eyebrow}
            </p>
          </div>

          <h2 className="font-playfair text-3xl sm:text-4xl lg:text-[3.25rem] font-normal text-[#FAF6F0] leading-[1.14] tracking-tight drop-shadow-sm">
            {headline.includes('yours to live') ? (
              <>
                Your life is <br />
                <span className="font-cormorant italic text-[#FFD6A5]">
                  yours to live.
                </span>
              </>
            ) : (
              headline
            )}
          </h2>

          <p className="font-sans text-xs sm:text-sm lg:text-[14.5px] text-[#E5DDD0] leading-[1.75] font-normal max-w-md">
            Step into clarity, daily intention, and quiet confidence. Begin your guided journaling practice today.
          </p>

          <div className="pt-2">
            <Link
              href={buttonHref}
              className="group inline-flex items-center gap-3 bg-[#FAF6F0] hover:bg-white text-[#1E1C1A] text-xs sm:text-[13px] font-semibold tracking-[0.06em] uppercase px-8 py-3.5 rounded-full transition-all duration-200 shadow-xl hover:shadow-2xl hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]"
            >
              <span>{buttonText}</span>
              <ArrowRight className="w-4 h-4 text-[#A64426] transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
