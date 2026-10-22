'use client';

const AYEEYO_MANTRAS = [
  'Grandmothers Raise Tomorrow',
  'Care Today. Opportunity Tomorrow.',
  'A story of love, responsibility, resilience and hope',
  'Honoring Somali grandmothers & empowering every child',
  'From unconditional love to generational leadership',
  'Building confidence, dignity & bright futures',
];

export function AyeeyoTypographyTransition() {
  return (
    <div
      aria-label="Ayeeyo Koris Affirmations Marquee"
      className="relative w-full bg-[#0A3929] py-3.5 sm:py-4 border-y border-[#D3A03A]/40 overflow-hidden select-none shadow-[inset_0_1px_4px_rgba(0,0,0,0.25)]"
    >
      <style jsx>{`
        @keyframes marquee-ayeeyo {
          0% {
            transform: translate3d(0, 0, 0);
          }
          100% {
            transform: translate3d(-50%, 0, 0);
          }
        }
        .ayeeyo-marquee-track {
          display: flex;
          width: max-content;
          animation: marquee-ayeeyo 34s linear infinite;
          will-change: transform;
        }
        .ayeeyo-marquee-track:hover {
          animation-play-state: paused;
        }
        @media (prefers-reduced-motion: reduce) {
          .ayeeyo-marquee-track {
            animation: none;
          }
        }
      `}</style>

      {/* Infinite Scrolling Track */}
      <div className="ayeeyo-marquee-track">
        {/* Set 1 */}
        <div className="flex items-center shrink-0">
          {AYEEYO_MANTRAS.map((mantra, i) => (
            <div key={`ayeeyo-set1-${i}`} className="flex items-center">
              <span className="font-playfair text-xs sm:text-[14px] lg:text-[15px] font-normal tracking-wide text-[#FAF8F5] whitespace-nowrap px-6 sm:px-10">
                {mantra}
              </span>
              <span className="text-[#D3A03A] text-[10px] sm:text-xs">
                ✦
              </span>
            </div>
          ))}
        </div>

        {/* Set 2 (Duplicate for seamless continuous loop) */}
        <div className="flex items-center shrink-0" aria-hidden="true">
          {AYEEYO_MANTRAS.map((mantra, i) => (
            <div key={`ayeeyo-set2-${i}`} className="flex items-center">
              <span className="font-playfair text-xs sm:text-[14px] lg:text-[15px] font-normal tracking-wide text-[#FAF8F5] whitespace-nowrap px-6 sm:px-10">
                {mantra}
              </span>
              <span className="text-[#D3A03A] text-[10px] sm:text-xs">
                ✦
              </span>
            </div>
          ))}
        </div>

        {/* Set 3 (Buffer for ultrawide screens) */}
        <div className="flex items-center shrink-0" aria-hidden="true">
          {AYEEYO_MANTRAS.map((mantra, i) => (
            <div key={`ayeeyo-set3-${i}`} className="flex items-center">
              <span className="font-playfair text-xs sm:text-[14px] lg:text-[15px] font-normal tracking-wide text-[#FAF8F5] whitespace-nowrap px-6 sm:px-10">
                {mantra}
              </span>
              <span className="text-[#D3A03A] text-[10px] sm:text-xs">
                ✦
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
