'use client';

const MANTRAS = [
  'You are resilient.',
  'You are worthy.',
  'You are in charge.',
];

export function TypographyTransition() {
  return (
    <div 
      aria-label="Brand Affirmations Marquee"
      className="relative w-full bg-[#A64426] py-3 sm:py-3.5 border-y border-[#8E381E] overflow-hidden select-none shadow-[inset_0_1px_3px_rgba(0,0,0,0.08)]"
    >
      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translate3d(0, 0, 0);
          }
          100% {
            transform: translate3d(-50%, 0, 0);
          }
        }
        .marquee-track {
          display: flex;
          width: max-content;
          animation: marquee 32s linear infinite;
          will-change: transform;
        }
        .marquee-track:hover {
          animation-play-state: paused;
        }
        @media (prefers-reduced-motion: reduce) {
          .marquee-track {
            animation: none;
          }
        }
      `}</style>

      {/* Infinite Scrolling Track */}
      <div className="marquee-track">
        {/* Set 1 */}
        <div className="flex items-center shrink-0">
          {MANTRAS.map((mantra, i) => (
            <div key={`set1-${i}`} className="flex items-center">
              <span className="font-playfair text-xs sm:text-[14px] lg:text-[15px] font-normal tracking-wide text-[#FAF6F0] whitespace-nowrap px-6 sm:px-10">
                {mantra}
              </span>
              <span className="text-[#E8C58C] text-[10px] sm:text-xs opacity-85">
                ✦
              </span>
            </div>
          ))}
        </div>

        {/* Set 2 (Duplicate for seamless loop) */}
        <div className="flex items-center shrink-0" aria-hidden="true">
          {MANTRAS.map((mantra, i) => (
            <div key={`set2-${i}`} className="flex items-center">
              <span className="font-playfair text-xs sm:text-[14px] lg:text-[15px] font-normal tracking-wide text-[#FAF6F0] whitespace-nowrap px-6 sm:px-10">
                {mantra}
              </span>
              <span className="text-[#E8C58C] text-[10px] sm:text-xs opacity-85">
                ✦
              </span>
            </div>
          ))}
        </div>

        {/* Set 3 (Buffer for ultrawide screens) */}
        <div className="flex items-center shrink-0" aria-hidden="true">
          {MANTRAS.map((mantra, i) => (
            <div key={`set3-${i}`} className="flex items-center">
              <span className="font-playfair text-xs sm:text-[14px] lg:text-[15px] font-normal tracking-wide text-[#FAF6F0] whitespace-nowrap px-6 sm:px-10">
                {mantra}
              </span>
              <span className="text-[#E8C58C] text-[10px] sm:text-xs opacity-85">
                ✦
              </span>
            </div>
          ))}
        </div>

        {/* Set 4 (Buffer for ultrawide screens) */}
        <div className="flex items-center shrink-0" aria-hidden="true">
          {MANTRAS.map((mantra, i) => (
            <div key={`set4-${i}`} className="flex items-center">
              <span className="font-playfair text-xs sm:text-[14px] lg:text-[15px] font-normal tracking-wide text-[#FAF6F0] whitespace-nowrap px-6 sm:px-10">
                {mantra}
              </span>
              <span className="text-[#E8C58C] text-[10px] sm:text-xs opacity-85">
                ✦
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
