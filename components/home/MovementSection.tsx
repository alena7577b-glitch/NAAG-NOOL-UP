import Link from 'next/link';

export function MovementSection() {
  return (
    <section className="relative w-full bg-[#FAF7F2] text-[#1E1C1A] py-10 sm:py-12 lg:py-14 overflow-hidden border-b border-[#EBE3D3]">
      {/* Subtle organic ambient warmth in the background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-[#F3ECE0]/40 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="w-full max-w-[1140px] mx-auto px-6 sm:px-10 lg:px-12">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-12 lg:gap-14">
          
          {/* =========================================================================
              LEFT CONTENT: Editorial Manifesto Typography
          ========================================================================= */}
          <div className="w-full lg:w-[410px] xl:w-[430px] text-start shrink-0 space-y-6">
            
            {/* Eyebrow with delicate terracotta architectural mark */}
            <div className="flex items-center gap-3">
              <span className="w-5 h-[1.5px] bg-[#A64426]" />
              <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.28em] text-[#A64426]">
                THE MOVEMENT
              </p>
              <span className="text-[10px] font-mono tracking-widest text-[#8C8173] uppercase">
                / 01
              </span>
            </div>

            {/* 3-line Majestic Headline with Cormorant Italic Nuance */}
            <h2 className="font-playfair text-3xl sm:text-[2.5rem] lg:text-[2.85rem] font-normal text-[#1E1C1A] leading-[1.12] tracking-tight">
              You are <span className="font-cormorant italic text-[#A64426]">resilient.</span><br />
              You are <span className="font-cormorant italic text-[#1E1C1A]">worthy.</span><br />
              You are in <span className="font-cormorant italic text-[#A64426]">charge.</span>
            </h2>

            {/* Refined Editorial Narrative */}
            <p className="font-sans text-sm sm:text-[14.5px] text-[#4D453D] leading-[1.75] max-w-[390px] font-normal">
              Naag Nool UP is more than a brand — it’s a movement. A sanctuary for women to reconnect with their power, write their own stories and create a more intentional future.
            </p>

            {/* Tactile Luxury CTA Button */}
            <div className="pt-2">
              <Link
                href="/about"
                className="group relative inline-flex items-center justify-center bg-[#A64426] hover:bg-[#8E381E] text-white text-xs font-semibold tracking-[0.1em] uppercase px-7 py-3.5 rounded-[4px] shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all duration-200 ease-out"
              >
                <span>Our Story</span>
              </Link>
            </div>
          </div>

          {/* =========================================================================
              RIGHT VISUAL COMPOSITION: Fine-Art Collage & Editorial Folio
          ========================================================================= */}
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-end gap-8 sm:gap-10 lg:gap-12 shrink-0">
            
            {/* Fine-Art Collage Canvas */}
            <div className="relative w-[340px] sm:w-[390px] lg:w-[420px] h-[300px] sm:h-[340px] lg:h-[360px] shrink-0">
              
              {/* Rich Hand-Drawn Botanical Leaf SVG Backdrop */}
              <div className="absolute -top-8 right-6 sm:right-10 w-48 sm:w-56 h-64 sm:h-76 pointer-events-none text-[#C4B7A4] opacity-55 z-0">
                <svg
                  viewBox="0 0 240 320"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-full h-full object-contain"
                >
                  {/* Organic Stems */}
                  <path d="M120 295 C120 200 80 135 25 75" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                  <path d="M120 295 C120 180 165 115 215 55" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                  
                  {/* Left Leaves with Delicate Vein Lines */}
                  <path d="M70 145 C48 130 38 102 44 86 C60 92 76 112 76 140" stroke="currentColor" strokeWidth="1" fill="currentColor" fillOpacity="0.14" />
                  <path d="M58 116 C66 122 72 130 76 140" stroke="currentColor" strokeWidth="0.6" strokeOpacity="0.6" />

                  <path d="M92 195 C66 184 54 156 62 140 C78 150 94 168 94 190" stroke="currentColor" strokeWidth="1" fill="currentColor" fillOpacity="0.14" />
                  <path d="M78 168 C86 176 90 182 94 190" stroke="currentColor" strokeWidth="0.6" strokeOpacity="0.6" />

                  <path d="M108 245 C82 238 72 212 80 196 C96 204 110 224 110 240" stroke="currentColor" strokeWidth="1" fill="currentColor" fillOpacity="0.14" />

                  {/* Right Leaves with Delicate Vein Lines */}
                  <path d="M170 120 C192 105 202 78 196 62 C180 68 164 88 164 115" stroke="currentColor" strokeWidth="1" fill="currentColor" fillOpacity="0.14" />
                  <path d="M184 92 C176 98 170 106 164 115" stroke="currentColor" strokeWidth="0.6" strokeOpacity="0.6" />

                  <path d="M148 172 C174 160 184 134 176 118 C160 126 144 145 144 166" stroke="currentColor" strokeWidth="1" fill="currentColor" fillOpacity="0.14" />
                  <path d="M162 144 C154 152 148 158 144 166" stroke="currentColor" strokeWidth="0.6" strokeOpacity="0.6" />

                  <path d="M132 222 C158 216 168 190 160 174 C144 182 130 202 130 218" stroke="currentColor" strokeWidth="1" fill="currentColor" fillOpacity="0.14" />

                  {/* Top Flourish Buds */}
                  <path d="M25 75 C20 60 30 46 40 50 C43 62 35 72 25 75 Z" stroke="currentColor" strokeWidth="1" fill="currentColor" fillOpacity="0.18" />
                  <path d="M215 55 C220 40 210 26 200 30 C197 42 205 52 215 55 Z" stroke="currentColor" strokeWidth="1" fill="currentColor" fillOpacity="0.18" />
                </svg>
              </div>

              {/* IMAGE 1: Primary Vertical Canvas (Woman Portrait) */}
              <div
                data-slot="primary-portrait"
                className="group absolute top-0 left-0 w-[60%] h-[82%] bg-[#E8E1D2] border border-[#D5C9B3] overflow-hidden shadow-md z-10 transition-transform duration-500 hover:scale-[1.01]"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/movement-woman.png"
                  alt="Woman in intentional contemplation"
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
              </div>

              {/* IMAGE 2: Secondary Overlapping Canvas (Journal Hands Detail) */}
              <div
                data-slot="secondary-image"
                className="group absolute bottom-0 right-0 w-[58%] h-[66%] bg-[#E0D8C8] border border-[#CCBEA6] overflow-hidden shadow-[0_16px_36px_rgba(30,28,26,0.14)] z-20 transition-transform duration-500 hover:scale-[1.02]"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/movement-hands.png"
                  alt="Hands holding the Naag Nool UP guided journal"
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
              </div>

            </div>

            {/* FAR-RIGHT EDITORIAL FOLIO & HAIRLINE */}
            <div className="flex flex-col items-center justify-center shrink-0 pt-2 sm:pt-0">
              {/* Star Accent */}
              <span className="text-[#A64426] text-[10px] mb-3 opacity-80">✦</span>

              {/* Stacked Tracked Mantra */}
              <div className="text-center space-y-2 font-sans text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.28em] text-[#332A24]">
                <p>RESILIENT</p>
                <p>WORTHY</p>
                <p>IN CHARGE</p>
              </div>

              {/* Architectural Hairline Line */}
              <div className="w-[1px] h-14 sm:h-16 bg-[#C4B7A4] mt-4" />
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
