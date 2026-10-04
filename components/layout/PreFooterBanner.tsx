import Link from 'next/link';

export interface PreFooterBannerProps {
  eyebrow?: string;
  headline?: string;
  buttonText?: string;
  buttonHref?: string;
}

export function PreFooterBanner({
  eyebrow = 'JOIN OUR COMMUNITY',
  headline = 'Your life is yours to live.',
  buttonText = 'Explore Naag Nool UP →',
  buttonHref = '/shop',
}: PreFooterBannerProps) {
  return (
    <section className="relative w-full overflow-hidden bg-[#B85233] py-16 sm:py-20 lg:py-24 text-white text-center">
      {/* Background Sunset Graphic */}
      <div 
        className="absolute inset-0 bg-cover bg-center pointer-events-none opacity-60 mix-blend-overlay"
        style={{ backgroundImage: 'url(/images/sunset-banner.svg)' }}
      />

      <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-6">
        <p className="font-sans text-[11px] sm:text-xs font-semibold uppercase tracking-[0.25em] text-[#FAF8F5]/90">
          {eyebrow}
        </p>

        <h2 className="font-playfair text-3xl sm:text-5xl lg:text-6xl font-normal text-white tracking-tight">
          {headline}
        </h2>

        <div className="pt-2">
          <Link
            href={buttonHref}
            className="btn-white-solid shadow-md"
          >
            <span>{buttonText}</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
